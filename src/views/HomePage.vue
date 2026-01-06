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
            <div class="slide-content">
              <transition name="fade-up" appear>
                <div class="slide-text" v-if="currentIndex === index">
                  <span class="slide-tag">{{ slide.tag || '探索发现' }}</span>
                  <h2>{{ slide.title }}</h2>
                  <p>{{ slide.description }}</p>
                  <div class="slide-actions">
                    <button class="carousel-button primary" @click="handleSlideAction(slide)">
                      {{ slide.buttonText }}
                    </button>
                    <button class="carousel-button secondary" @click="goToAbout">
                      了解详情
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <!-- 轮播图导航点 -->
        <div class="carousel-indicators">
          <span
            v-for="(slide, index) in carouselSlides"
            :key="index"
            :class="{ active: (currentIndex === 0 ? carouselSlides.length - 1 : (currentIndex === displaySlides.length - 1 ? 0 : currentIndex - 1)) === index }"
            @click="goToSlide(index + 1)"
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
          <span class="scroll-text">Scroll Down</span>
          <el-icon class="scroll-icon"><ArrowDown /></el-icon>
        </div>
      </div>
    </section>

    <!-- 最新动态 -->
    <section id="news" class="news-section">
      <div class="tech-bg-pattern"></div>
      <div class="container relative z-10">
        <div class="section-header scroll-reveal">
          <span class="section-badge">NEWS & UPDATES</span>
          <h2>最新动态</h2>
          <p class="section-subtitle">洞察行业前沿，把握成长机遇</p>
        </div>
        <div class="news-grid">
          <div class="news-item scroll-reveal" v-for="(news, index) in allNews" :key="news.id" :style="{ transitionDelay: `${index * 100}ms` }">
            <div class="news-image">
              <img :src="news.image" :alt="news.title">
              <div class="news-overlay">
                <el-button circle class="view-btn"><el-icon><ArrowRight /></el-icon></el-button>
              </div>
            </div>
            <div class="news-content">
              <div class="news-category">{{ news.category }}</div>
              <h3>{{ news.title }}</h3>
              <p class="news-summary">{{ news.summary }}</p>
              <div class="news-meta">
                <span class="news-date">{{ news.date }}</span>
              </div>
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
            <div class="section-tag">ABOUT US</div>
            <h2>科技赋能<br>用心呵护每一份成长</h2>
            <p>生涯心旅致力于为用户提供专业的心理健康服务。我们结合人工智能大数据与专业心理学知识，构建精准的心理支持模型。</p>
            <p>我们的使命是通过科技的力量，打破时间和空间的限制，让每个人都能享受高质量、个性化的心理健康服务。</p>
            <div class="about-stats">
              <div class="stat-item">
                <div class="stat-number">10k+</div>
                <div class="stat-label">服务用户</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">50+</div>
                <div class="stat-label">专家团队</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">98%</div>
                <div class="stat-label">满意度</div>
              </div>
            </div>
          </div>
          <div class="about-image-wrapper scroll-reveal">
            <div class="about-image-bg"></div>
            <div class="about-image">
              <img :src="imgNist" alt="关于我们" class="about-img-full">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务介绍 -->
    <section id="services" class="services-section">
      <div class="container">
        <div class="section-header center scroll-reveal">
          <span class="section-badge">OUR SERVICES</span>
          <h2>我们的服务</h2>
          <p class="section-subtitle">全方位的心理健康与生涯发展支持体系</p>
        </div>
        <div class="services-grid">
          <div class="service-card scroll-reveal" v-for="(service, index) in services" :key="index" :style="{ transitionDelay: `${index * 100}ms` }">
            <div class="service-icon-wrapper">
               <!-- 这里简单用图片代替图标，实际可以用 icon -->
               <img :src="service.image" class="service-icon-img" />
            </div>
            <div class="service-info">
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
              <div class="service-link">
                <span>了解详情</span>
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
            <div class="card-glow"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section id="features" class="features-section">
      <div class="tech-grid-bg"></div>
      <div class="container relative z-10">
        <div class="section-header center scroll-reveal">
          <span class="section-badge">FEATURES</span>
          <h2>平台特色功能</h2>
          <p class="section-subtitle">前沿科技驱动，助您更好成长</p>
        </div>
        <div class="features-grid">
          <div class="feature-item scroll-reveal" v-for="(feature, index) in features" :key="index" :style="{ transitionDelay: `${index * 50}ms` }">
            <div class="feature-card-inner">
              <div class="feature-icon-box">
                <el-icon class="feature-icon"><component :is="feature.icon" /></el-icon>
              </div>
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.description }}</p>
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
              <h2>联系我们</h2>
              <p>无论是建议、反馈还是咨询，我们都乐意倾听。</p>
            </div>
            <div class="contact-methods">
              <div class="method-item">
                <div class="method-icon"><el-icon><Phone /></el-icon></div>
                <div class="method-text">
                  <label>电话</label>
                  <span>400-123-4567</span>
                </div>
              </div>
              <div class="method-item">
                <div class="method-icon"><el-icon><Message /></el-icon></div>
                <div class="method-text">
                  <label>邮箱</label>
                  <span>info@careerpulse.com</span>
                </div>
              </div>
            </div>
          </div>
          <div class="contact-form-wrapper">
            <h3>留言咨询</h3>
            <el-form :model="contactForm" :rules="contactRules" ref="contactFormRef" label-position="top" class="tech-form">
              <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                  <el-form-item prop="name" label="姓名">
                    <el-input v-model="contactForm.name" placeholder="您的姓名"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" :xs="24">
                  <el-form-item prop="email" label="邮箱">
                    <el-input v-model="contactForm.email" placeholder="您的邮箱"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop="message" label="留言内容">
                <el-input
                  v-model="contactForm.message"
                  type="textarea"
                  :rows="4"
                  placeholder="请留下您的问题或建议">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="submit-btn" @click="submitContactForm">
                  发送留言 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
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
          <div
            v-for="item in navSections"
            :key="item.id"
            class="menu-item"
            @click.stop="scrollToSection(item.id)"
          >
            <span>{{ item.name }}</span>
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User,
  Lock,
  Calendar,
  TrendCharts,
  ChatLineRound,
  Collection,
  ArrowLeft,
  ArrowRight,
  Phone,
  Message,
  Location,
  ArrowDown,
  ArrowUp
} from '@element-plus/icons-vue'

// 导入图片资源
import imgNist from '@/assets/images/nist-bg.jpg'
import imgTsinghua from '@/assets/images/tsinghua-bg.jpg'

const router = useRouter()

// 轮播图相关状态
const currentIndex = ref(1) // 从1开始，因为0是克隆的末尾项
const carouselInterval = ref(null)
const isPaused = ref(false)
const disableTransition = ref(false)

// 轮播图数据
const carouselSlides = ref([
  {
    title: "专业心理健康服务",
    tag: "心灵呵护",
    description: "我们提供专业的心理健康服务，帮助您解决情绪困扰、人际关系、压力管理等问题",
    buttonText: "了解更多",
    image: imgNist
  },
  {
    title: "个性化生涯规划",
    tag: "未来指引",
    description: "通过科学测评和专业指导，帮助您明确职业发展方向，制定个性化生涯规划方案",
    buttonText: "开始规划",
    image: imgTsinghua
  },
  {
    title: "智能匹配咨询师",
    tag: "智慧匹配",
    description: "根据您的需求和偏好，智能匹配最适合的咨询师，提供个性化服务",
    buttonText: "立即匹配",
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

// 拖拽切换相关状态
const isDragging = ref(false)
const startX = ref(0)
const dragOffset = ref(0)
const lastX = ref(0)
const lastTime = ref(0)
const velocity = ref(0)
const rafId = ref(null)

const handleDragStart = (e) => {
  if (disableTransition.value) return
  isDragging.value = true
  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
  startX.value = clientX
  lastX.value = clientX
  lastTime.value = performance.now()
  velocity.value = 0
  pauseCarousel()
}

const handleDragMove = (e) => {
  if (!isDragging.value) return

  const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
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

  // 结合位移和速度判断切换
  if (Math.abs(dragOffset.value) > threshold || Math.abs(velocity.value) > velocityThreshold) {
    if (dragOffset.value > 0 || velocity.value > velocityThreshold) {
      prevSlide()
    } else {
      nextSlide()
    }
  }

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

const handleSlideAction = (slide) => {
  ElMessage.success(`准备：${slide.buttonText}`)
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
  if (disableTransition.value) return
  currentIndex.value++
}

const prevSlide = () => {
  if (disableTransition.value) return
  currentIndex.value--
}

const goToSlide = (index) => {
  if (disableTransition.value) return
  currentIndex.value = index
}

const handleTransitionEnd = () => {
  // 无缝跳转逻辑
  if (currentIndex.value >= displaySlides.value.length - 1) {
    disableTransition.value = true
    currentIndex.value = 1
    // 强制重绘
    setTimeout(() => {
      disableTransition.value = false
    }, 20)
  } else if (currentIndex.value <= 0) {
    disableTransition.value = true
    currentIndex.value = displaySlides.value.length - 2
    // 强制重绘
    setTimeout(() => {
      disableTransition.value = false
    }, 20)
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

const contactRules = {
  name: [
    { required: true, message: '请输入您的姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  message: [
    { required: true, message: '请输入您的留言', trigger: 'blur' }
  ]
}

const contactFormRef = ref(null)

// 导航菜单相关
const showNavMenu = ref(false)

const navSections = [
  { id: 'top', name: '首页' },
  { id: 'news', name: '最新动态' },
  { id: 'about', name: '关于我们' },
  { id: 'services', name: '我们的服务' },
  { id: 'features', name: '平台特色' },
  { id: 'contact', name: '联系我们' }
]

const scrollToSection = (id) => {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// 统一的新闻数据（合并特色和常规新闻，简化展示）
const allNews = ref([
  {
    id: 1,
    title: "生涯心旅推出全新AI心理评估系统",
    summary: "引入基于人工智能技术的心理评估系统，能够更精准地了解您的心理状态和需求。",
    category: "平台更新",
    date: "2026-01-04",
    image: imgNist
  },
  {
    id: 2,
    title: "冬季心理健康指南：如何应对季节性情绪波动",
    summary: "为您介绍一些实用的方法，帮助您在寒冷的季节里保持心理健康。",
    category: "健康指南",
    date: "2025-12-28",
    image: imgTsinghua
  },
  {
    id: 3,
    title: "线上心理咨询服务满意度调查结果公布",
    summary: "95%的用户对我们的线上心理咨询服务表示满意。我们将继续努力提供优质服务。",
    category: "服务报告",
    date: "2025-12-20",
    image: imgNist
  },
  {
    id: 4,
    title: "心理健康专家团队扩大：欢迎新成员加入",
    summary: "三位资深心理健康专家加入了生涯心旅团队，提供更专业、多元化的心理支持。",
    category: "团队动态",
    date: "2025-12-15",
    image: imgTsinghua
  }
])

// 服务数据
const services = ref([
  {
    title: "心理咨询",
    description: "专业心理咨询师提供一对一心理咨询服务，解决情绪困扰、人际关系等问题。",
    image: imgTsinghua
  },
  {
    title: "生涯规划",
    description: "通过科学测评和专业指导，帮助您明确职业发展方向，制定个性化方案。",
    image: imgNist
  },
  {
    title: "教育培训",
    description: "提供心理健康、个人成长、职业技能等方面的线上与线下培训课程。",
    image: imgNist
  },
  {
    title: "团体辅导",
    description: "组织主题性团体辅导活动，通过互动交流促进个人成长和问题解决。",
    image: imgTsinghua
  }
])

// 特色功能数据
const features = ref([
  {
    title: "智能匹配",
    description: "根据需求智能匹配最适合的咨询师",
    icon: User
  },
  {
    title: "隐私保护",
    description: "严格保护用户隐私，确保信息安全",
    icon: Lock
  },
  {
    title: "在线预约",
    description: "便捷的在线预约系统，随时随地",
    icon: Calendar
  },
  {
    title: "成长记录",
    description: "记录您的成长轨迹，追踪咨询效果",
    icon: TrendCharts
  },
  {
    title: "社区交流",
    description: "与同路人交流心得，共同成长",
    icon: ChatLineRound
  },
  {
    title: "资源库",
    description: "丰富的心理健康资源，助您提升",
    icon: Collection
  }
])

// 页面跳转函数
const goToService = () => {
  document.getElementById('services').scrollIntoView({ behavior: 'smooth' })
}

const goToAbout = () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' })
}

const readNews = (id) => {
  ElMessage.info('正在跳转到新闻页面')
  console.log('阅读新闻:', id)
}

const submitContactForm = async () => {
  try {
    await contactFormRef.value.validate()
    ElMessage.success('留言提交成功！我们会尽快与您联系。')
    contactForm.value = { name: '', email: '', message: '' }
  } catch (error) {
    console.log('表单验证失败', error)
  }
}

// 滚动事件处理
const scrollY = ref(0)
const handleScroll = () => {
  scrollY.value = window.scrollY
}

const scrollToNextSection = () => {
  const nextSection = document.getElementById('news')
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}

// 监听滚轮事件实现首屏自动滚动
const handleWheel = (e) => {
  // 只有在顶部区域且向下滚动时触发
  if (window.scrollY < 50 && e.deltaY > 0) {
    e.preventDefault()
    scrollToNextSection()
  }
}

// 组件挂载和卸载时的处理
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('wheel', handleWheel, { passive: false })
  preloadImages()
  startCarousel()

  // 初始化滚动显现观察器
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    })
  }

  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.1
  })

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('wheel', handleWheel)
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
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

.nav-menu::before {
  content: '快速导航';
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
  display: flex;
  align-items: center;
  justify-content: center;
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

.slide-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  text-align: left;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
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

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
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
}

.section-header.center {
  text-align: center;
}

.section-header h2 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827; /* 深灰近黑 */
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
}

.section-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
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

/* 装饰性小标题 */
.section-badge {
  display: inline-block;
  padding: 6px 16px;
  background: rgba(0, 82, 217, 0.08);
  color: #0052d9;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 20px;
  margin-bottom: 1rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: 1px solid rgba(0, 82, 217, 0.1);
}

/* 最新动态 - 科技感优化 */
.tech-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 24px 24px;
  opacity: 0.5;
  z-index: 0;
}

.news-section {
  position: relative;
  overflow: hidden;
  padding: 8rem 0;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.news-item {
  border: none;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.news-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 82, 217, 0.12);
}

.news-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-item:hover .news-image img {
  transform: scale(1.05);
}

.news-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 82, 217, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.news-item:hover .news-overlay {
  opacity: 1;
}

.view-btn {
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.2, 1.5, 0.5, 1);
  background: white;
  border: none;
  color: #0052d9;
}

.news-item:hover .view-btn {
  transform: scale(1.1);
}

.news-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.news-category {
  display: inline-block;
  color: #0052d9;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.8rem;
  letter-spacing: 1px;
}

.news-item h3 {
  font-size: 1.25rem;
  margin-bottom: 0.8rem;
  color: #1f2937;
  font-weight: 700;
  line-height: 1.4;
}

.news-summary {
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
}

.news-meta {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 1rem;
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
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
  color: #0052d9;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.about-text h2 {
  font-size: 2.5rem;
  color: #111827;
  margin-bottom: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4b5563;
  margin-bottom: 1.5rem;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #f3f4f6;
}

.stat-number {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0052d9;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
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
  color: #111827;
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
  overflow: hidden;
  background: #f0f7ff;
  padding: 10px;
}

.service-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  color: #111827;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
}

.contact-header p {
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.6;
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
    font-size: 1.75rem;
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
}</style>
