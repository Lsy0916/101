<template>
  <div class="nf-page" :class="{ 'is-dark-slide': isDarkSlide }">
    <!-- 自定义光标 -->
    <div ref="cursorDotRef" class="cursor-dot" :class="{ 'is-hover': cursorHover }" aria-hidden="true"></div>

    <!-- 固定导航栏 -->
    <NotFoundNav :scrolled="currentSlide > 0" :dark="isDarkSlide" @navigate="goTo" />

    <!-- 翻页指示器 -->
    <NotFoundDots :count="slideCount" :current="currentSlide" :dark="isDarkSlide" @navigate="goToSlide" />

    <!-- 翻页提示（仅首页 · 非游戏模式） -->
    <transition name="fade">
      <div v-if="currentSlide === 0 && !activeGame" class="nf-flip-hint" @click="nextSlide">
        <span class="nf-flip-text">{{ t('notFound.hero.scroll') }}</span>
        <span class="nf-flip-mouse">
          <span class="nf-flip-wheel"></span>
        </span>
      </div>
    </transition>

    <!-- 翻页容器 -->
    <div class="nf-slides">
      <div
        class="nf-slides-track"
        :style="{ transform: `translateY(-${currentSlide * 100}vh)` }"
      >
        <!-- Slide 0：Hero 杂志封面（深蓝渐变） -->
        <section class="nf-slide nf-slide-hero">
          <div class="nf-hero-grid-bg" aria-hidden="true"></div>

          <div class="nf-hero-stage">
            <NotFoundHero :active-game="activeGame" @enter="enterGame" />

            <!-- 游戏舞台 -->
            <transition name="stage-game">
              <NotFoundGameStage v-if="activeGame" ref="gameStageRef" :key="activeGame" :game="activeGame" @exit="exitGame" />
            </transition>
          </div>

          <div class="nf-hero-foot">
            <div class="nf-hero-meta-left">
              <span>{{ t('notFound.hero.issue') }}</span>
              <span>{{ t('notFound.hero.volume') }}</span>
            </div>
            <span class="nf-hero-page">{{ t('notFound.hero.page') }}</span>
          </div>
        </section>

        <!-- Slide 1：专题选择区（浅蓝 · 杂志网格） -->
        <NotFoundSlideTopics @navigate="router.push" />

        <!-- Slide 2：Pull Quote 引语区（深蓝渐变） -->
        <NotFoundSlideQuote />

        <!-- Slide 3：社区笔记区（浅蓝 · 杂志专栏） -->
        <NotFoundSlideCommunity />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NotFoundNav from '@/components/business/notfound/NotFoundNav.vue'
import NotFoundDots from '@/components/business/notfound/NotFoundDots.vue'
import NotFoundHero from '@/components/business/notfound/NotFoundHero.vue'
import NotFoundGameStage from '@/components/business/notfound/NotFoundGameStage.vue'
import NotFoundSlideTopics from '@/components/business/notfound/NotFoundSlideTopics.vue'
import NotFoundSlideQuote from '@/components/business/notfound/NotFoundSlideQuote.vue'
import NotFoundSlideCommunity from '@/components/business/notfound/NotFoundSlideCommunity.vue'

const router = useRouter()
const { t } = useI18n()

/* ---------- 翻页控制 ---------- */
const slideCount = 4
const currentSlide = ref(0)
const isAnimating = ref(false)
let animTimer: ReturnType<typeof setTimeout> | null = null

function lockAnim() {
  isAnimating.value = true
  if (animTimer) clearTimeout(animTimer)
  animTimer = setTimeout(() => {
    isAnimating.value = false
  }, 800)
}

function nextSlide() {
  if (isAnimating.value || currentSlide.value >= slideCount - 1) return
  lockAnim()
  currentSlide.value++
}

function prevSlide() {
  if (isAnimating.value || currentSlide.value <= 0) return
  lockAnim()
  currentSlide.value--
}

function goToSlide(index: number) {
  if (isAnimating.value || index === currentSlide.value) return
  lockAnim()
  currentSlide.value = index
}

/* ---------- 滚轮 / 触摸 / 键盘 ---------- */
function handleWheel(e: WheelEvent) {
  if (activeGame.value) {
    // 游戏模式下不翻页
    return
  }
  if (isAnimating.value) {
    e.preventDefault()
    return
  }
  if (e.deltaY > 30) {
    e.preventDefault()
    nextSlide()
  } else if (e.deltaY < -30) {
    e.preventDefault()
    prevSlide()
  }
}

let touchStartY = 0
function handleTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
}
function handleTouchEnd(e: TouchEvent) {
  if (activeGame.value) return
  const dy = touchStartY - e.changedTouches[0].clientY
  if (Math.abs(dy) > 50) {
    if (dy > 0) nextSlide()
    else prevSlide()
  }
}

function handleKeydown(e: KeyboardEvent) {
  // 游戏模式下：键盘交给游戏舞台（方向键移动 / 空格同步 / Esc 退出）
  if (activeGame.value) {
    gameStageRef.value?.handleKey(e)
    return
  }

  // 非游戏模式：方向键 / 空格翻页
  if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
    e.preventDefault()
    nextSlide()
  } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
    e.preventDefault()
    prevSlide()
  } else if (e.key === 'Home') {
    e.preventDefault()
    goToSlide(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    goToSlide(slideCount - 1)
  }
}

/* ---------- 深色 slide 判定 ---------- */
const darkSlides = [0, 2]
const isDarkSlide = computed(() => darkSlides.includes(currentSlide.value))

/* ---------- 路由跳转 ---------- */
function goTo(route: string) {
  router.push(route)
}

/* ---------- 翻页后触发动画 ---------- */
watch(currentSlide, async () => {
  await nextTick()
  const slideEl = document.querySelectorAll('.nf-slide')[currentSlide.value]
  if (!slideEl) return
  slideEl.querySelectorAll('.reveal-anim').forEach((el) => {
    const node = el as HTMLElement
    node.classList.remove('in-view')
    void node.offsetWidth
    node.classList.add('in-view')
  })
})

/* ---------- 小游戏系统 ---------- */
const activeGame = ref<string | null>(null)
const gameStageRef = ref<InstanceType<typeof NotFoundGameStage>>()

function enterGame(id: string) {
  activeGame.value = id
}

function exitGame() {
  activeGame.value = null
}

/* ---------- 自定义光标 cursor-dot ---------- */
const cursorDotRef = ref<HTMLDivElement | null>(null)
const cursorHover = ref(false)
let cursorRaf: number | null = null
let cursorX = 0
let cursorY = 0
let dotX = 0
let dotY = 0
let cursorVisible = false

function handleMouseMove(e: MouseEvent) {
  cursorX = e.clientX
  cursorY = e.clientY
  if (!cursorVisible) {
    cursorVisible = true
    dotX = cursorX
    dotY = cursorY
    if (cursorDotRef.value) cursorDotRef.value.style.opacity = '1'
  }
  if (!cursorRaf) {
    cursorRaf = requestAnimationFrame(updateCursorDot)
  }
  // 检测是否悬停在可交互元素上 → 光标点放大为圆环（替代系统手指样式）
  const target = e.target as HTMLElement
  const interactive = target.closest && target.closest(
    'a, button, .nf-topic, .nf-nav-link, .nf-nav-logo, .nf-dot, .nf-flip-hint, .nf-game-entry, .nf-game-back, .nf-memory-card, .nf-breath-wrap, .nf-note-action, .nf-write-submit, .nf-footer-link'
  )
  cursorHover.value = !!interactive
}

function updateCursorDot() {
  cursorRaf = null
  dotX += (cursorX - dotX) * 0.32
  dotY += (cursorY - dotY) * 0.32
  if (cursorDotRef.value) {
    cursorDotRef.value.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`
  }
  if (Math.abs(cursorX - dotX) > 0.3 || Math.abs(cursorY - dotY) > 0.3) {
    cursorRaf = requestAnimationFrame(updateCursorDot)
  }
}

function handleMouseLeave() {
  cursorVisible = false
  if (cursorDotRef.value) cursorDotRef.value.style.opacity = '0'
}

/* ---------- 生命周期 ---------- */
onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchend', handleTouchEnd, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
  document.addEventListener('mouseleave', handleMouseLeave)
})

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseleave', handleMouseLeave)
  if (animTimer) clearTimeout(animTimer)
  if (cursorRaf) cancelAnimationFrame(cursorRaf)
})
</script>

<style scoped>
/* ========== 色彩与字体变量（品牌蓝主题） ========== */
.nf-page {
  --brand-primary: #0052d9;
  --brand-light: #1890ff;
  --brand-dark: #0a2a6b;
  --brand-gradient: linear-gradient(135deg, #0a2a6b 0%, #0052d9 50%, #1890ff 100%);

  --bg-primary: #f8fbff;
  --bg-secondary: #ffffff;
  --bg-tint: #f0f7ff;

  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  --border: #e5e7eb;
  --border-light: #f1f5f9;
  --border-blue: #d0e7ff;

  --dark-text: #ffffff;
  --dark-text-soft: rgba(255, 255, 255, 0.78);
  --dark-text-mute: rgba(255, 255, 255, 0.5);

  --font-display: 'Playfair Display', 'Noto Serif SC', Georgia, serif;
  --font-serif: 'Noto Serif SC', 'Playfair Display', Georgia, serif;
  --font-sans: 'Noto Sans SC', -apple-system, sans-serif;

  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-weight: 300;
  line-height: 1.6;
  height: 100vh;
  overflow: hidden;
  cursor: none;
}

/* 自定义光标 cursor-dot：默认小圆点，hover 可交互元素时放大为圆环 */
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  border: 1.5px solid transparent;
  box-sizing: border-box;
  transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.28s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.28s ease,
              border-color 0.28s ease,
              opacity 0.3s ease;
}

.cursor-dot.is-hover {
  width: 42px;
  height: 42px;
  background: transparent;
  border-color: #ffffff;
}

/* ========== 翻页容器 ========== */
.nf-slides {
  height: 100vh;
  overflow: hidden;
}

.nf-slides-track {
  transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.nf-slide {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 80px 56px 40px;
  box-sizing: border-box;
}

.nf-slide-inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

/* ========== 翻页提示 ========== */
.nf-flip-hint {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  z-index: 90;
}

.nf-flip-text {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--dark-text-soft);
}

.nf-flip-mouse {
  width: 22px;
  height: 36px;
  border: 1px solid var(--dark-text-soft);
  border-radius: 12px;
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.nf-flip-wheel {
  width: 3px;
  height: 8px;
  background: var(--dark-text);
  border-radius: 2px;
  animation: flipWheel 1.8s ease-in-out infinite;
}

@keyframes flipWheel {
  0% { transform: translateY(0); opacity: 1; }
  60% { transform: translateY(12px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ========== Slide 0：Hero（深蓝渐变） ========== */
.nf-slide-hero {
  background: var(--brand-gradient);
  color: var(--dark-text);
  text-align: center;
}

.nf-hero-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

/* Hero 舞台（404 ↔ 游戏 切换容器） */
.nf-hero-stage {
  position: relative;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  min-height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nf-hero-foot {
  position: absolute;
  bottom: 32px;
  left: 56px;
  right: 56px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 2;
}

.nf-hero-meta-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nf-hero-meta-left span {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--dark-text-soft);
}

.nf-hero-page {
  font-family: var(--font-display);
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--dark-text-soft);
}

/* 舞台切换动画 · 404 退出 / 游戏进入 */
.stage-game-enter-active {
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.18s,
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.18s,
              filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.18s;
}
.stage-game-leave-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.stage-game-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.96);
  filter: blur(10px);
}
.stage-game-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.96);
  filter: blur(10px);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .nf-slide {
    padding: 80px 24px 30px;
  }

  .nf-hero-foot {
    left: 24px;
    right: 24px;
    bottom: 20px;
  }

  .nf-flip-hint {
    display: none;
  }
}

/* 低高度屏幕：进一步压缩 */
@media (max-height: 760px) {
  .nf-slide {
    padding: 70px 56px 24px;
  }

  .nf-hero-stage {
    min-height: 360px;
  }
}
</style>

<!-- 桌面端强制隐藏系统光标 / 触控设备恢复（作用于子组件内部元素，需全局块） -->
<style>
.nf-page,
.nf-page * {
  cursor: none !important;
}

@media (hover: none), (max-width: 768px) {
  .nf-page .cursor-dot {
    display: none;
  }
  .nf-page,
  .nf-page * {
    cursor: auto !important;
  }
  .nf-page :is(.nf-nav-logo, .nf-nav-link, .nf-dot, .nf-flip-hint, .nf-topic, .nf-note-action, .nf-write-submit, .nf-footer-link, .nf-game-entry, .nf-game-back, .nf-memory-card, .nf-breath-wrap, a, button) {
    cursor: pointer !important;
  }
  .nf-page .nf-write-input {
    cursor: text !important;
  }
}
</style>
