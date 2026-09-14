<template>
  <section class="carousel-section">
    <div
      class="carousel-container"
      @mouseenter="pauseCarousel"
      @mouseleave="handleMouseLeave"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
      @mouseup="handleDragEnd"
      @touchstart="handleDragStart"
      @touchmove="handleDragMove"
      @touchend="handleDragEnd"
      @touchcancel="handleDragEnd"
    >
      <div
        class="carousel-track"
        :class="{ 'is-dragging': isDragging, 'no-transition': disableTransition }"
        :style="{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          transition: (isDragging || disableTransition) ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }"
        @transitionend="handleTransitionEnd"
      >
        <div v-for="(slide, index) in displaySlides" :key="index" class="carousel-slide">
          <div class="slide-image">
            <img :src="slide.image" :alt="slide.title">
            <div class="image-overlay"></div>
          </div>
        </div>
      </div>
      <!-- 文字内容独立层：基于 realIndex 渲染，避免无缝跳转时重复触发动画 -->
      <div class="slide-content-overlay">
        <transition name="fade-up" mode="out-in">
          <div :key="realIndex" class="slide-text">
            <span class="slide-tag">{{ currentSlide.tag || $t('home.carousel.exploreTag') }}</span>
            <h2>{{ currentSlide.title }}</h2>
            <p>{{ currentSlide.description }}</p>
            <div class="slide-actions">
              <button class="carousel-button primary" @click="handleSlideAction(currentSlide)">
                {{ currentSlide.buttonText }}
              </button>
              <button class="carousel-button secondary" @click="goToAbout">
                {{ $t('home.carousel.learnMore') }}
              </button>
            </div>
          </div>
        </transition>
      </div>
      <!-- 轮播图导航点 -->
      <div class="carousel-indicators">
        <span
          v-for="(slide, index) in slides"
          :key="index"
          :class="{ active: realIndex === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
      <!-- 轮播图左右箭头 -->
      <button class="carousel-btn prev" aria-label="Previous slide" @click="prevSlide">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <button class="carousel-btn next" aria-label="Next slide" @click="nextSlide">
        <el-icon><ArrowRight /></el-icon>
      </button>

      <!-- 向下滚动指示器 -->
      <div class="scroll-down-indicator" @click="scrollToNextSection">
        <span class="scroll-text">{{ $t('home.carousel.scrollDown') }}</span>
        <el-icon class="scroll-icon"><ArrowDown /></el-icon>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * 【business】HomeCarousel —— 首页全屏轮播（无缝循环 + 拖拽/惯性 + 自动播放）
 * - slides 由页面注入（i18n 驱动，语言切换实时更新）
 * - 文字内容独立层基于 realIndex 渲染，避免无缝跳转时重复触发动画
 * - 跳转行为上抛页面：slide-action（主按钮）/ learn-more / scroll-down
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight, ArrowDown } from '@element-plus/icons-vue'
import type { CarouselSlide } from './types'

const props = defineProps<{ slides: CarouselSlide[] }>()

const emit = defineEmits<{
  (e: 'slide-action', slide: CarouselSlide): void
  (e: 'learn-more'): void
  (e: 'scroll-down'): void
}>()

// 轮播图相关状态
const currentIndex = ref(1) // 从1开始，因为0是克隆的末尾项
const carouselInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isPaused = ref(false)
const disableTransition = ref(false)
const isAnimating = ref(false) // 过渡动画进行中锁，防止重复操作导致越界

// 生成展示用的轮播图（首尾各克隆一项）
const displaySlides = computed(() => {
  if (props.slides.length === 0) return []
  return [
    props.slides[props.slides.length - 1],
    ...props.slides,
    props.slides[0]
  ]
})

// 当前真实索引（0-based），用于导航点 active 状态
const realIndex = computed(() => {
  const total = displaySlides.value.length
  if (total === 0) return 0
  if (currentIndex.value <= 0) return props.slides.length - 1
  if (currentIndex.value >= total - 1) return 0
  return currentIndex.value - 1
})

// 当前显示的幻灯片数据（基于真实索引，无缝跳转时保持稳定）
const currentSlide = computed(() => props.slides[realIndex.value] || props.slides[0])

// 拖拽切换相关状态
const isDragging = ref(false)
const startX = ref(0)
const dragOffset = ref(0)
const lastX = ref(0)
const lastTime = ref(0)
const velocity = ref(0)
const rafId = ref<number | null>(null)

const handleDragStart = (e: TouchEvent | MouseEvent) => {
  if (disableTransition.value || isAnimating.value) return
  // 文本选中与拖拽由 .carousel-container 的 user-select:none / -webkit-user-drag:none 控制
  // 不再调用 preventDefault，避免触发 passive listener 警告
  isDragging.value = true
  const clientX = e.type.includes('touch') ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
  startX.value = clientX
  lastX.value = clientX
  lastTime.value = performance.now()
  velocity.value = 0
  pauseCarousel()
}

const handleDragMove = (e: TouchEvent | MouseEvent) => {
  if (!isDragging.value) return

  const currentX = e.type.includes('touch') ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX
  const currentTime = performance.now()
  const deltaTime = currentTime - lastTime.value

  if (deltaTime > 0) {
    velocity.value = (currentX - lastX.value) / deltaTime
  }

  lastX.value = currentX
  lastTime.value = currentTime

  // 使用 requestAnimationFrame 优化渲染性能
  if (rafId.value) cancelAnimationFrame(rafId.value)
  rafId.value = requestAnimationFrame(() => {
    dragOffset.value = currentX - startX.value
  })
}

const handleDragEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false
  if (rafId.value) cancelAnimationFrame(rafId.value)

  const threshold = 100
  const velocityThreshold = 0.5 // 惯性触发阈值
  let shouldSwitch = false
  let direction = 0 // -1 上一张, 1 下一张

  // 结合位移和速度判断切换
  if (Math.abs(dragOffset.value) > threshold || Math.abs(velocity.value) > velocityThreshold) {
    if (dragOffset.value > 0 || velocity.value > velocityThreshold) {
      direction = -1
      shouldSwitch = true
    } else {
      direction = 1
      shouldSwitch = true
    }
  }

  if (shouldSwitch) {
    // 直接修改 currentIndex，不调用 nextSlide/prevSlide（避免被 isAnimating 锁拦截）
    isAnimating.value = true
    currentIndex.value += direction
  } else if (dragOffset.value !== 0) {
    // 未触发切换但存在位移：清零后会产生回弹过渡，同样加锁
    isAnimating.value = true
  }
  // dragOffset 清零：切换时过渡到新位置，未切换时回弹到原位
  dragOffset.value = 0
  velocity.value = 0
  resumeCarousel()
}

const handleMouseLeave = () => {
  if (isDragging.value) {
    handleDragEnd()
  }
  resumeCarousel()
}

const handleSlideAction = (slide: CarouselSlide) => emit('slide-action', slide)

const goToAbout = () => emit('learn-more')

const scrollToNextSection = () => emit('scroll-down')

const startCarousel = () => {
  if (carouselInterval.value) clearInterval(carouselInterval.value)
  carouselInterval.value = setInterval(() => {
    nextSlide()
  }, 5000)
}

const pauseCarousel = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
  isPaused.value = true
}

const resumeCarousel = () => {
  isPaused.value = false
  startCarousel()
}

// 轮播图控制函数
const nextSlide = () => {
  if (isAnimating.value || isDragging.value || disableTransition.value) return
  isAnimating.value = true
  currentIndex.value++
}

const prevSlide = () => {
  if (isAnimating.value || isDragging.value || disableTransition.value) return
  isAnimating.value = true
  currentIndex.value--
}

const goToSlide = (index: number) => {
  if (isAnimating.value || isDragging.value || disableTransition.value) return
  // index 为真实索引(0-based)，+1 跳过首部克隆项
  const target = index + 1
  if (target === currentIndex.value) return
  isAnimating.value = true
  currentIndex.value = target
}

// 无缝跳转：到达克隆项边界时，禁用过渡瞬间归位
const handleTransitionEnd = () => {
  const total = displaySlides.value.length
  if (currentIndex.value >= total - 1) {
    // 到达尾部克隆项，跳回首部真实项
    disableTransition.value = true
    currentIndex.value = 1
    // 双 rAF 确保浏览器完成重绘后再恢复过渡，避免闪烁
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        disableTransition.value = false
        isAnimating.value = false
      })
    })
  } else if (currentIndex.value <= 0) {
    // 到达首部克隆项，跳回尾部真实项
    disableTransition.value = true
    currentIndex.value = total - 2
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        disableTransition.value = false
        isAnimating.value = false
      })
    })
  } else {
    isAnimating.value = false
  }
}

// 图片预加载
const preloadImages = () => {
  props.slides.forEach(slide => {
    const img = new Image()
    img.src = slide.image
  })
}

onMounted(() => {
  preloadImages()
  startCarousel()
})

onUnmounted(() => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
  }
})
</script>

<style scoped>
.carousel-section {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-top: 0;
  padding-top: 0;
}

.scroll-down-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  cursor: pointer;
  animation: bounce 2s infinite;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.scroll-down-indicator:hover {
  opacity: 1;
}

.scroll-text {
  font-size: 0.8rem;
  letter-spacing: 2px;
  margin-bottom: 8px;
  text-transform: uppercase;
  font-weight: 500;
  text-shadow: 0 2px 4px color-mix(in srgb, black 30%, transparent);
}

.scroll-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px color-mix(in srgb, black 30%, transparent));
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }

  40% {
    transform: translateX(-50%) translateY(-10px);
  }

  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  -webkit-user-drag: none;
}

.carousel-container:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  will-change: transform;
  backface-visibility: hidden;
  perspective: 1000px;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, color-mix(in srgb, black 30%, transparent) 0%, color-mix(in srgb, black 60%, transparent) 100%);
}

/* 文字内容独立层：覆盖在轮播图上方，不受 track 滑动影响 */
.slide-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 0 7rem;
  text-align: left;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
}

.slide-content-overlay .slide-text {
  pointer-events: auto;
}

.slide-text {
  max-width: 650px;
  padding: 0;
  background: transparent;
  backdrop-filter: none;
  display: block;
}

.slide-tag {
  display: inline-block;
  padding: 4px 12px;
  background: color-mix(in srgb, var(--brand-primary) 20%, transparent);
  border-left: 3px solid var(--brand-primary);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.slide-text h2 {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  font-weight: 800;
  text-shadow: none;
  color: white;
}

.slide-text p {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-shadow: none;
  color: color-mix(in srgb, white 90%, transparent);
  max-width: 500px;
}

.slide-actions {
  display: flex;
  gap: 1rem;
}

.carousel-button {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
}

.carousel-button.primary {
  background: var(--brand-primary);
  color: white;
  border: none;
}

.carousel-button.primary:hover {
  background: var(--brand-primary-deeper);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px color-mix(in srgb, var(--brand-primary) 30%, transparent);
}

.carousel-button.secondary {
  background: color-mix(in srgb, white 10%, transparent);
  color: white;
  border: 1px solid color-mix(in srgb, white 30%, transparent);
  backdrop-filter: blur(10px);
}

.carousel-button.secondary:hover {
  background: white;
  color: var(--slate-800);
  transform: translateY(-3px);
}

.carousel-indicators {
  position: absolute;
  bottom: 3rem;
  left: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 10;
}

.carousel-indicators span {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: color-mix(in srgb, white 30%, transparent);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: var(--brand-primary);
  width: 60px;
}

.fade-up-enter-active {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-up-leave-active {
  transition: all 0.2s ease-out;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent !important;
  color: color-mix(in srgb, white 70%, transparent);
  border: none;
  width: 80px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  opacity: 0;
}

.carousel-container:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn .el-icon {
  font-size: 40px;
  filter: drop-shadow(0 2px 10px color-mix(in srgb, black 30%, transparent));
  transition: all 0.3s ease;
}

.carousel-btn:hover {
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: 1.5rem;
}

.carousel-btn.next {
  right: 1.5rem;
}

.carousel-btn.prev:hover .el-icon {
  transform: translateX(-8px);
}

.carousel-btn.next:hover .el-icon {
  transform: translateX(8px);
}

.carousel-btn:active {
  transform: translateY(-50%) scale(0.9);
}

@media (width <= 992px) {
  .slide-text h2 {
    font-size: 2.5rem;
  }
}

@media (width <= 768px) {
  .carousel-indicators {
    display: none;
  }

  .carousel-btn {
    width: 50px;
    height: 60px;
  }

  .carousel-btn .el-icon {
    font-size: 24px;
  }

  .slide-content-overlay {
    padding: 0 1rem 0 4rem;
  }
}
</style>
