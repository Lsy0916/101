<template>
  <div class="animated-homepage">
    <!-- 轮播图区域 -->
    <HomeCarousel
      :slides="carouselSlides"
      @slide-action="onSlideAction"
      @learn-more="onLearnMore"
      @scroll-down="onScrollDown"
    />

    <!-- 跑马灯 · 滚动信息条 -->
    <HomeMarquee />

    <!-- 最新动态 -->
    <HomeNewsSection @read="onReadNews" />

    <!-- 关于我们 -->
    <HomeAboutSection />

    <!-- 联系我们 -->
    <HomeContactSection />

    <!-- 回到顶部与快速导航 -->
    <HomeBackTop />
  </div>
</template>

<script setup lang="ts">
/**
 * 首页（页面层）：仅负责数据组装与跨区块跳转/滚动。
 * 区块实现见 components/business/home/*（数据 props 入、行为 emits 出）。
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import HomeCarousel from '@/components/business/home/HomeCarousel.vue'
import HomeMarquee from '@/components/business/home/HomeMarquee.vue'
import HomeNewsSection from '@/components/business/home/HomeNewsSection.vue'
import HomeAboutSection from '@/components/business/home/HomeAboutSection.vue'
import HomeContactSection from '@/components/business/home/HomeContactSection.vue'
import HomeBackTop from '@/components/business/home/HomeBackTop.vue'
import type { CarouselSlide } from '@/components/business/home/types'
import imgNist from '@/assets/images/nist-bg.jpg'
import imgTsinghua from '@/assets/images/tsinghua-bg.jpg'

const router = useRouter()
const { t } = useI18n()

// 轮播图数据（computed 以支持语言切换时实时更新文案）
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
])

// 轮播主按钮：按文案映射路由（slide1 → 测评中心, slide2 → 时光胶囊, slide3 → 心理咨询）
const onSlideAction = (slide: CarouselSlide) => {
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

// 「了解我们」→ 滚动到关于区块
const onLearnMore = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
}

// 下滚指示 → 滚动到最新动态
const onScrollDown = () => {
  document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })
}

// 阅读动态 → 文章中心（保持原跳转行为）
const onReadNews = (_id: number) => {
  router.push({ name: 'articles' })
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
    onScrollDown()
    setTimeout(() => { wheelLock.value = false }, 800)
  }
}

// 跨区块「滚动显现」观察器：为所有 .scroll-reveal 元素加 is-visible
let scrollObserver: IntersectionObserver | null = null
onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: false })

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
  window.removeEventListener('wheel', handleWheel)
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
</style>
