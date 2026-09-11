<template>
  <div class="animated-homepage">
    <!-- 轮播图区域 -->
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
          @transitionend="handleTransitionEnd"
          :style="{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transition: (isDragging || disableTransition) ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }"
        >
          <div class="carousel-slide" v-for="(slide, index) in displaySlides" :key="index">
            <div class="slide-image">
              <img :src="slide.image" :alt="slide.title">
              <div class="image-overlay"></div>
            </div>
          </div>
        </div>
        <!-- 文字内容独立层：基于 realIndex 渲染，避免无缝跳转时重复触发动画 -->
        <div class="slide-content-overlay">
          <transition name="fade-up" mode="out-in">
            <div class="slide-text" :key="realIndex">
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
            v-for="(slide, index) in carouselSlides"
            :key="index"
            :class="{ active: realIndex === index }"
            @click="goToSlide(index)"
          ></span>
        </div>
        <!-- 轮播图左右箭头 -->
        <button class="carousel-btn prev" @click="prevSlide" aria-label="Previous slide">
          <el-icon><ArrowLeft /></el-icon>
        </button>
        <button class="carousel-btn next" @click="nextSlide" aria-label="Next slide">
          <el-icon><ArrowRight /></el-icon>
        </button>
        
        <!-- 向下滚动指示器 -->
        <div class="scroll-down-indicator" @click="scrollToNextSection">
          <span class="scroll-text">{{ $t('home.carousel.scrollDown') }}</span>
          <el-icon class="scroll-icon"><ArrowDown /></el-icon>
        </div>
      </div>
    </section>

    <!-- 跑马灯 · 滚动信息条 -->
    <div class="marquee-band" aria-hidden="true">
      <div class="marquee-track">
        <span class="marquee-item">{{ $t('home.marquee.users') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.experts') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.satisfaction') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.aiPsych') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.support') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.slogan') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.users') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.experts') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.satisfaction') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.aiPsych') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.support') }}</span>
        <span class="marquee-dot">●</span>
        <span class="marquee-item">{{ $t('home.marquee.slogan') }}</span>
        <span class="marquee-dot">●</span>
      </div>
    </div>

    <!-- 最新动态 -->
    <section id="news" class="news-section">
      <div class="tech-bg-pattern"></div>
      <div class="container relative z-10">
        <div class="section-header scroll-reveal">
          <span class="section-badge">{{ $t('home.news.badge') }}</span>
          <h2>{{ $t('home.news.title') }}</h2>
          <p class="section-subtitle">{{ $t('home.news.subtitle') }}</p>
        </div>
        <div class="news-rows">
          <div
            class="news-row scroll-reveal"
            v-for="(news, index) in allNews"
            :key="news.id"
            :style="{ transitionDelay: `${index * 80}ms` }"
            @click="readNews(news.id)"
          >
            <div class="news-row-num">
              <span class="num">{{ String(index + 1).padStart(2, '0') }}</span>
            </div>
            <div class="news-row-body">
              <div class="news-row-cat">{{ news.category }}</div>
              <h3 class="news-row-title">{{ news.title }}</h3>
              <p class="news-row-summary">{{ news.summary }}</p>
            </div>
            <div class="news-row-thumb">
              <img :src="news.image" :alt="news.title" loading="lazy">
            </div>
            <div class="news-row-meta">
              <span class="news-row-date">{{ news.date }}</span>
              <el-icon class="news-row-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text scroll-reveal">
            <div class="section-tag">{{ $t('home.about.badge') }}</div>
            <h2>{{ $t('home.about.title1') }}<br>{{ $t('home.about.title2') }}</h2>
            <p>{{ $t('home.about.p1') }}</p>
            <p>{{ $t('home.about.p2') }}</p>
            <div class="about-stats">
              <div class="stat-item">
                <div class="stat-number"><AnimatedCounter :target="10" suffix="k+" /></div>
                <div class="stat-label">{{ $t('home.about.statUsers') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number"><AnimatedCounter :target="50" suffix="+" /></div>
                <div class="stat-label">{{ $t('home.about.statExperts') }}</div>
              </div>
              <div class="stat-item">
                <div class="stat-number"><AnimatedCounter :target="98" suffix="%" /></div>
                <div class="stat-label">{{ $t('home.about.statSatisfaction') }}</div>
              </div>
            </div>
          </div>
          <div class="about-image-wrapper scroll-reveal">
            <div class="about-image-bg"></div>
            <div class="about-image">
              <img :src="imgNist" :alt="$t('home.about.alt')" class="about-img-full" loading="lazy">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="contact-wrapper scroll-reveal">
          <div class="contact-info">
            <div class="contact-bg-shape"></div>
            <div class="contact-header">
              <h2>{{ $t('home.contact.title') }}</h2>
              <p>{{ $t('home.contact.desc') }}</p>
            </div>
            <div class="contact-methods">
              <div class="method-item">
                <div class="method-icon"><el-icon><Phone /></el-icon></div>
                <div class="method-text">
                  <label>{{ $t('home.contact.phone') }}</label>
                  <span>400-123-4567</span>
                </div>
              </div>
              <div class="method-item">
                <div class="method-icon"><el-icon><Message /></el-icon></div>
                <div class="method-text">
                  <label>{{ $t('home.contact.email') }}</label>
                  <span>contact@shengyaxinlv.com</span>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-form-wrapper">
            <h3>{{ $t('home.contact.formTitle') }}</h3>
            <el-form :model="contactForm" :rules="contactRules" ref="contactFormRef" label-position="top" class="tech-form">
              <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                  <el-form-item prop="name" :label="$t('home.contact.name')">
                    <el-input v-model="contactForm.name" :placeholder="$t('home.contact.namePlaceholder')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                  <el-form-item prop="email" :label="$t('home.contact.emailLabel')">
                    <el-input v-model="contactForm.email" :placeholder="$t('home.contact.emailPlaceholder')"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop="message" :label="$t('home.contact.message')">
                <el-input
                  v-model="contactForm.message"
                  type="textarea"
                  :rows="4"
                  :placeholder="$t('home.contact.messagePlaceholder')">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="submit-btn" @click="submitContactForm">
                  {{ $t('home.contact.submit') }} <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <!-- 回到顶部与快速导航 -->
    <div class="back-to-top-container" 
         :class="{ 'visible': scrollY > 100 }"
         @mouseenter="showNavMenu = true" 
         @mouseleave="showNavMenu = false">
      
      <transition name="fade-slide">
        <div class="nav-menu" v-show="showNavMenu">
          <div class="nav-menu-title">{{ $t('home.nav.quick') }}</div>
          <div
            v-for="item in navSections"
            :key="item.id"
            class="menu-item"
            @click.stop="scrollToSection(item.id)"
          >
            <span>{{ $t(item.nameKey) }}</span>
            <div class="item-dot"></div>
          </div>
        </div>
      </transition>

      <div class="back-to-top-btn" @click="scrollToSection('top')">
        <div class="btn-content">
          <el-icon class="main-icon"><ArrowUp /></el-icon>
          <span class="btn-text">TOP</span>
        </div>
        <div class="nav-hint">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Lock,
  TrendCharts,
  ChatLineRound,
  ArrowLeft,
  ArrowRight,
  Phone,
  Message,
  ArrowDown,
  ArrowUp,
  DataAnalysis,
  Connection,
  Clock,
  Reading,
  ChatDotRound
} from '@element-plus/icons-vue'

// 导入图片资源
import imgNist from '@/assets/images/nist-bg.jpg'
import imgTsinghua from '@/assets/images/tsinghua-bg.jpg'
import AnimatedCounter from '@/components/AnimatedCounter.vue'

const router = useRouter()
const { t, tm } = useI18n()

interface CarouselSlide {
  title: string
  tag: string
  description: string
  buttonText: string
  image: string
}

interface NewsItem {
  category: string
  title: string
  summary: string
  date: string
}

// tm 返回类型对深层 locale 消息实例化过深，收敛为 unknown 后按需断言
const tmItems = tm as unknown as (key: string) => unknown

// 轮播图相关状态
const currentIndex = ref(1) // 从1开始，因为0是克隆的末尾项
const carouselInterval = ref<ReturnType<typeof setInterval> | null>(null)
const isPaused = ref(false)
const disableTransition = ref(false)
const isAnimating = ref(false) // 过渡动画进行中锁，防止重复操作导致越界

// 轮播图数据（使用 computed 以支持语言切换时实时更新文案）
const carouselSlides = computed<CarouselSlide[]>(() => [
  {
    title: t('home.carousel.slide1.title'),
    tag: t('home.carousel.slide1.tag'),
    description: t('home.carousel.slide1.desc'),
    buttonText: t('home.carousel.slide1.btn'),
    image: imgNist
  },
  {
    title: t('home.carousel.slide2.title'),
    tag: t('home.carousel.slide2.tag'),
    description: t('home.carousel.slide2.desc'),
    buttonText: t('home.carousel.slide2.btn'),
    image: imgTsinghua
  },
  {
    title: t('home.carousel.slide3.title'),
    tag: t('home.carousel.slide3.tag'),
    description: t('home.carousel.slide3.desc'),
    buttonText: t('home.carousel.slide3.btn'),
    image: imgNist
  }
]);

// 生成展示用的轮播图（首尾各克隆一项）
const displaySlides = computed(() => {
  if (carouselSlides.value.length === 0) return []
  return [
    carouselSlides.value[carouselSlides.value.length - 1],
    ...carouselSlides.value,
    carouselSlides.value[0]
  ]
})

// 当前真实索引（0-based），用于导航点 active 状态
const realIndex = computed(() => {
  const total = displaySlides.value.length
  if (total === 0) return 0
  if (currentIndex.value <= 0) return carouselSlides.value.length - 1
  if (currentIndex.value >= total - 1) return 0
  return currentIndex.value - 1
})

// 当前显示的幻灯片数据（基于真实索引，无缝跳转时保持稳定）
const currentSlide = computed(() => carouselSlides.value[realIndex.value] || carouselSlides.value[0])

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

const handleSlideAction = (slide: { buttonText: string }) => {
  // slide1 → 测评中心, slide2 → 时光胶囊, slide3 → 心理咨询
  const routeMap: Record<string, string> = {
    [t('home.carousel.slide1.btn')]: 'assessment',
    [t('home.carousel.slide2.btn')]: 'time-capsule',
    [t('home.carousel.slide3.btn')]: 'counseling'
  }
  const routeName = routeMap[slide.buttonText]
  if (routeName) {
    router.push({ name: routeName })
  } else {
    ElMessage.success(t('home.carousel.preparing', { text: slide.buttonText }))
  }
}

// 导航栏相关状态
const isScrolled = ref(false)

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
  carouselSlides.value.forEach(slide => {
    const img = new Image()
    img.src = slide.image
  })
}

// 表单数据
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

// 表单校验规则（使用 computed 以支持语言切换时实时更新提示文案）
const contactRules = computed(() => ({
  name: [
    { required: true, message: t('home.validation.nameRequired'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('home.validation.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('home.validation.emailFormat'), trigger: 'blur' }
  ],
  message: [
    { required: true, message: t('home.validation.messageRequired'), trigger: 'blur' }
  ]
}))

const contactFormRef = ref<FormInstance | null>(null)

// 导航菜单相关
const showNavMenu = ref(false)

const navSections = [
  { id: 'top', nameKey: 'home.nav.top' },
  { id: 'news', nameKey: 'home.nav.news' },
  { id: 'about', nameKey: 'home.nav.about' },
  { id: 'services', nameKey: 'home.nav.services' },
  { id: 'features', nameKey: 'home.nav.features' },
  { id: 'contact', nameKey: 'home.nav.contact' }
]

const scrollToSection = (id: string) => {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// 图标映射：i18n 中的 icon 字符串 → Element Plus 图标组件
const iconMap: Record<string, Component> = {
  DataAnalysis,
  Connection,
  Clock,
  Reading,
  ChatDotRound,
  ChatLineRound,
  TrendCharts,
  Lock
}

// 服务路由映射（按 i18n items 顺序）
const serviceRoutes = ['assessment', 'counseling', 'time-capsule', 'articles']

// 新闻数据（i18n 驱动，图片循环复用）
const allNews = computed(() => {
  const items = tmItems('home.news.items') as NewsItem[]
  if (!Array.isArray(items)) return []
  return items.map((item, i) => ({
    ...item,
    id: i + 1,
    image: i % 2 === 0 ? imgNist : imgTsinghua
  }))
})

// 服务数据（i18n 驱动）
const services = computed(() => {
  const items = tmItems('home.services.items') as Array<{ icon?: string }>
  if (!Array.isArray(items)) return []
  return items.map((item, i) => ({
    ...item,
    iconComp: iconMap[item.icon || ''] || DataAnalysis,
    route: serviceRoutes[i] || null
  }))
})

// 特色功能数据（i18n 驱动）
const features = computed(() => {
  const items = tmItems('home.features.items') as Array<{ icon?: string }>
  if (!Array.isArray(items)) return []
  return items.map((item) => ({
    ...item,
    iconComp: iconMap[item.icon || ''] || DataAnalysis
  }))
})

function handleServiceClick(service: { route?: string | null }) {
  if (service.route) {
    router.push({ name: service.route })
  }
}

const goToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
}

const readNews = (id: number) => {
  router.push({ name: 'articles' })
}

const submitContactForm = async () => {
  try {
    const form = contactFormRef.value
    if (!form) return
    await form.validate()
    ElMessage.success(t('home.contact.submitSuccess'))
    contactForm.value = { name: '', email: '', message: '' }
  } catch {
    // 表单验证失败，Element Plus 会自动在表单项下方显示错误信息
  }
}

// 节流函数优化性能
const throttle = (fn: (...args: unknown[]) => void, delay: number) => {
  let last = 0
  return (...args: unknown[]) => {
    const now = Date.now()
    if (now - last >= delay) {
      fn(...args)
      last = now
    }
  }
}

// 滚动事件处理
const scrollY = ref(0)
const handleScroll = throttle(() => {
  scrollY.value = window.scrollY
}, 100)

const scrollToNextSection = () => {
  const nextSection = document.getElementById('news')
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 监听滚轮事件实现首屏自动滚动
// 不调用 preventDefault（wheel 在某些浏览器中被视为 passive），
// 改用锁标志避免重复触发 smooth 滚动
const wheelLock = ref(false)
const handleWheel = (e: WheelEvent) => {
  if (wheelLock.value) return
  // 只有在顶部区域且向下滚动时触发
  if (window.scrollY < 10 && e.deltaY > 0) {
    wheelLock.value = true
    scrollToNextSection()
    setTimeout(() => { wheelLock.value = false }, 800)
  }
}

// 组件挂载和卸载时的处理
let scrollObserver: IntersectionObserver | null = null
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('wheel', handleWheel, { passive: false })
  preloadImages()
  startCarousel()

  // 初始化滚动显现观察器
  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }

  const obs = new IntersectionObserver(observerCallback, {
    threshold: 0.1
  })

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    obs.observe(el)
  })
  scrollObserver = obs
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleWheel)
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
  }
  // 断开 IntersectionObserver，避免内存泄漏
  if (scrollObserver) {
    scrollObserver.disconnect()
    scrollObserver = null
  }
})
</script>

<style scoped>
.animated-homepage {
  background: linear-gradient(to bottom, #ffffff, #f0f7ff) fixed;
  min-height: 100vh;
}

.back-to-top-container {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.back-to-top-container.visible {
  opacity: 1;
  pointer-events: auto;
}

.back-to-top-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0052d9;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 82, 217, 0.3);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.main-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

.btn-text {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.5px;
}

.nav-hint {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 3px;
  opacity: 0.6;
}

.dot {
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
}

.back-to-top-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 82, 217, 0.4);
}

.back-to-top-btn:hover .btn-content {
  transform: translateY(-2px);
}

.nav-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  min-width: 160px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transform-origin: bottom right;
}

.nav-menu-title {
  display: block;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  padding: 4px 12px 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.menu-item {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  white-space: nowrap;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.item-dot {
  width: 5px;
  height: 5px;
  background: #0052d9;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: white;
  color: #0052d9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding-left: 20px;
}

.menu-item:hover .item-dot {
  opacity: 1;
  transform: scale(1);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* 轮播图样式 - 保持原样 */
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
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.scroll-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
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
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
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
  background: rgba(0, 82, 217, 0.2);
  border-left: 3px solid #0052d9;
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
  color: rgba(255, 255, 255, 0.9);
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
  background: #0052d9;
  color: white;
  border: none;
}

.carousel-button.primary:hover {
  background: #003bb3;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 82, 217, 0.3);
}

.carousel-button.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.carousel-button.secondary:hover {
  background: white;
  color: #1e293b;
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
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators span.active {
  background: #0052d9;
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
  color: rgba(255, 255, 255, 0.7);
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
  filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.3));
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

/* 通用布局样式 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  margin-bottom: 4rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eef2f6;
}

.section-header.center {
  text-align: center;
  border-bottom: none;
  padding-bottom: 0;
}

.section-header h2 {
  font-size: clamp(32px, 4.5vw, 60px);
  font-weight: 800;
  color: #0a0f1a;
  margin: 0.5rem 0 1rem;
  letter-spacing: -1.5px;
  line-height: 1.05;
}

.section-subtitle {
  color: #6b7280;
  font-size: 1rem;
  max-width: 600px;
  margin: 0;
  line-height: 1.7;
}

.section-header.center .section-subtitle {
  margin: 0 auto;
}

/* 全局辅助类 */
.relative { position: relative; }
.z-10 { z-index: 10; }

/* 滚动显现动画 */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 装饰性小标题 · 编辑式 eyebrow */
.section-badge {
  display: inline-block;
  padding: 0;
  background: none;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0;
  margin-bottom: 0.5rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  border: none;
}

/* 最新动态 - 科技感优化 */
.tech-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  z-index: 0;
}

/* 跑马灯滚动信息条 */
.marquee-band {
  overflow: hidden;
  border-top: 1px solid #eef2f6;
  border-bottom: 1px solid #eef2f6;
  background: #f8fbff;
  padding: 14px 0;
}

.marquee-track {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  white-space: nowrap;
  animation: marquee-scroll 36s linear infinite;
}

.marquee-band:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-item {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #111827;
  text-transform: uppercase;
}

.marquee-dot {
  font-size: 6px;
  color: #0052d9;
  line-height: 1;
}

.news-section {
  position: relative;
  overflow: hidden;
  padding: 8rem 0;
}

.news-rows {
  display: flex;
  flex-direction: column;
}

.news-row {
  display: grid;
  grid-template-columns: 64px 1fr 220px 150px;
  gap: 32px;
  align-items: center;
  padding: 32px 0;
  border-bottom: 1px solid #eef2f6;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-row:first-child {
  border-top: 1px solid #0a0f1a;
}

.news-row:hover {
  transform: translateX(10px);
}

.news-row-num .num {
  font-size: 24px;
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  transition: color 0.25s;
}

.news-row:hover .news-row-num .num {
  color: #0052d9;
}

.news-row-body {
  min-width: 0;
}

.news-row-cat {
  font-size: 11px;
  color: #0052d9;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}

.news-row-title {
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 700;
  color: #0a0f1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
  transition: color 0.25s;
}

.news-row:hover .news-row-title {
  color: #0052d9;
}

.news-row-summary {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-row-thumb {
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-radius: 4px;
}

.news-row-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-row:hover .news-row-thumb img {
  transform: scale(1.06);
}

.news-row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

.news-row-date {
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.news-row-arrow {
  font-size: 20px;
  color: #0a0f1a;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-row:hover .news-row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .news-row {
    grid-template-columns: 40px 1fr;
    gap: 20px;
  }
  .news-row-thumb,
  .news-row-meta {
    display: none;
  }
}

/* 关于我们 - 视差与创新布局 */
.about-section {
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

.section-tag {
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  font-size: 0.75rem;
}

.about-text h2 {
  font-size: clamp(32px, 4vw, 54px);
  color: #0a0f1a;
  margin-bottom: 1.5rem;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -1.5px;
}

.about-text p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eef2f6;
}

.stat-number {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  color: #0a0f1a;
  margin-bottom: 0.25rem;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.about-image-wrapper {
  position: relative;
  perspective: 1000px;
}

.about-image {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  transform: rotateY(-5deg);
  transition: transform 0.5s ease;
  height: auto;
  width: 100%;
}

.about-image-wrapper:hover .about-image {
  transform: rotateY(0);
}

.about-img-full {
  width: 100%;
  height: auto;
  display: block;
}

/* 服务介绍 - 统一浅色主题 */
.services-section {
  color: #1f2937;
  padding: 8rem 0;
  position: relative;
}

.services-section .section-header h2 {
  color: #0a0f1a;
}

.services-section .section-subtitle {
  color: #6b7280;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

@media (max-width: 1200px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}

.service-card {
  background: white;
  border: 1px solid #eef2f6;
  border-radius: 20px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 82, 217, 0.1);
  border-color: rgba(0, 82, 217, 0.2);
}

.service-icon-wrapper {
  width: 60px;
  height: 60px;
  margin-bottom: 2rem;
  border-radius: 16px;
  background: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.service-icon-el {
  font-size: 28px;
  color: #0052d9;
  transition: all 0.3s ease;
}

.service-card:hover .service-icon-wrapper {
  background: #0052d9;
}

.service-card:hover .service-icon-el {
  color: white;
  transform: rotate(8deg);
}

.service-info h3 {
  color: #1f2937;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.service-info p {
  color: #6b7280;
  margin-bottom: 2rem;
  flex: 1;
  line-height: 1.6;
}

.service-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0052d9;
  font-weight: 600;
  cursor: pointer;
  transition: gap 0.3s ease;
}

.service-card:hover .service-link {
  gap: 12px;
  color: #003bb3;
}

.card-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(0, 82, 217, 0.05) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.service-card:hover .card-glow {
  opacity: 1;
}

/* 特色功能 - 网格背景与卡片 */
.features-section {
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
}

.tech-grid-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.feature-item {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
}

.feature-item:hover {
  border-color: #0052d9;
  box-shadow: 0 20px 40px rgba(0, 82, 217, 0.08);
}

.feature-icon-box {
  width: 64px;
  height: 64px;
  background: #f0f7ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #0052d9;
  font-size: 2rem;
  transition: all 0.3s ease;
}

.feature-item:hover .feature-icon-box {
  background: #0052d9;
  color: white;
  transform: rotate(10deg);
}

.feature-item h3 {
  font-size: 1.25rem;
  margin-bottom: 0.8rem;
  color: #1f2937;
  font-weight: 700;
}

.feature-item p {
  color: #6b7280;
  line-height: 1.6;
  font-size: 1rem;
}

/* 联系我们 - 现代表单 */
.contact-section {
  padding: 8rem 0;
}

.contact-wrapper {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 400px 1fr;
  border: 1px solid #eef2f6;
}

.contact-info {
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  padding: 4rem;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid #eef2f6;
}

.contact-bg-shape {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 82, 217, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.contact-header h2 {
  color: #0a0f1a;
  margin-bottom: 1rem;
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
}

.contact-header p {
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.7;
}

.method-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.method-icon {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
  color: #0052d9;
}

.method-text label {
  display: block;
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.method-text span {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.contact-form-wrapper {
  padding: 3rem;
  background: white;
}

.contact-form-wrapper h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 2rem;
  font-weight: 700;
}

.submit-btn {
  width: auto;
  padding: 12px 36px;
  border-radius: 8px;
  height: auto;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background-color: #0052d9;
  border-color: #0052d9;
}

.submit-btn:hover {
  background-color: #003bb3;
  border-color: #003bb3;
}

.tech-form :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  padding: 8px 15px;
}

.tech-form :deep(.el-input__wrapper.is-focus) {
  background-color: white;
  border-color: #0052d9;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1) !important;
}

.tech-form :deep(.el-textarea__inner) {
  background-color: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  padding: 12px 15px;
}

.tech-form :deep(.el-textarea__inner:focus) {
  background-color: white;
  border-color: #0052d9;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1) !important;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .about-content,
  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .about-image-wrapper {
    order: -1;
    margin-bottom: 2rem;
  }
  
  .contact-info {
    padding: 2rem;
  }
  
  .contact-form-wrapper {
    padding: 2rem;
  }

  .slide-text h2 {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 1.9rem;
    letter-spacing: -0.5px;
  }

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
}</style>