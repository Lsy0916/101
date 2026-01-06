<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Search, 
  Reading, 
  Timer, 
  View, 
  ArrowRight,
  ArrowLeft,
  Collection,
  HotWater,
  Star,
  Share,
  ChatDotRound,
  Suitcase,
  Notebook,
  Sunny,
  Moon,
  EditPen,
  ChatLineRound,
  Right
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const activeCategory = ref('all')
const showAllArticles = ref(false)

function goToAllArticles() {
  router.push('/articles/list')
}

// 文章分类数据
const categories = [
  { label: '精选推荐', key: 'all', icon: Collection },
  { label: '每日精选', key: 'daily', icon: Star },
  { label: '专题报道', key: 'featured', icon: HotWater },
  { label: '心理科普', key: 'psychology', icon: Reading },
  { label: '生涯导航', key: 'career', icon: Timer },
  { label: '成长故事', key: 'stories', icon: View }
]

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: '在不确定的时代，如何建立内心的秩序？',
    summary: '探索如何在纷乱的外界环境中，通过心理学的工具和自省，找回属于自己的节奏与宁静。在这个快速变化的时代，内心的安定是我们最宝贵的资产。',
    content: `
      <p>在这个信息爆炸、变化迅速的时代，我们常常感到焦虑、迷茫和无助。外部环境的不确定性似乎正在侵蚀我们内心的宁静。</p>
      <h3>1. 认清焦虑的本质</h3>
      <p>焦虑往往源于对未来的失控感。当我们试图掌控那些无法掌控的事情时，焦虑就会随之而来。</p>
      <h3>2. 建立微小的秩序</h3>
      <p>从整理房间、规律作息开始。这些看似微不足道的小事，实际上是在向我们的大脑传递一个信号：我依然拥有掌控生活的能力。</p>
      <h3>3. 练习正念与冥想</h3>
      <p>关注当下，而不是过去或未来。通过呼吸练习，我们可以快速将思绪拉回此时此刻。</p>
    `,
    category: 'psychology',
    categoryLabel: '心理科普',
    author: '陈默老师',
    authorTitle: '资深心理咨询师',
    authorAvatar: 'https://i.pravatar.cc/100?u=chenmo',
    date: '2026-01-05',
    views: 4520,
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200',
    featured: true
  },
  {
    id: 2,
    title: 'MBTI 16种人格类型详解：找到你的职业天赋',
    summary: '深入了解每种人格类型的核心特征、优势与挑战，找到最适合自己的职业发展方向。',
    content: '<p>MBTI（Myers-Briggs Type Indicator）是一种广泛应用的人格测评工具...</p>',
    category: 'career',
    categoryLabel: '生涯导航',
    author: '王悦',
    authorTitle: '职业规划专家',
    authorAvatar: 'https://i.pravatar.cc/100?u=wangyue',
    date: '2026-01-04',
    views: 3420,
    readTime: '15 min',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
    id: 3,
    title: '从迷茫到坚定：我的跨专业保研之路',
    summary: '一个真实的学生成长故事，记录了如何在困惑中寻找方向，并最终实现梦想的心路历程。',
    content: '<p>大二那年，我开始思考自己的未来。虽然现在的专业很稳妥，但我内心始终渴望...</p>',
    category: 'stories',
    categoryLabel: '成长故事',
    author: '李华',
    authorTitle: '优秀学长',
    authorAvatar: 'https://i.pravatar.cc/100?u=lihua',
    date: '2026-01-03',
    views: 890,
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    featured: false
  },
  {
    id: 4,
    title: '大学生如何高效管理自己的时间？',
    summary: '时间管理不是要把每一分钟都填满，而是要学会有序地安排优先级，提升学习效率。',
    content: '<p>你是否经常感到时间不够用？明明忙了一整天，却发现重要的工作一点没动...</p>',
    category: 'career',
    categoryLabel: '生涯导航',
    author: '周琳',
    authorTitle: '效率管理专家',
    authorAvatar: 'https://i.pravatar.cc/100?u=zhoulin',
    date: '2026-01-02',
    views: 2100,
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800',
    featured: false
  },
  {
    id: 5,
    title: '深夜食堂：那些藏在文字里的温暖',
    summary: '文学不仅仅是纸上的墨迹，更是孤独灵魂的避风港。让我们一起走进那些治愈系的文学作品。',
    content: '<p>文字是有温度的。当你在深夜感到孤独时，翻开一本书...</p>',
    category: 'daily',
    categoryLabel: '每日精选',
    author: '苏小北',
    authorTitle: '专栏作家',
    authorAvatar: 'https://i.pravatar.cc/100?u=subei',
    date: '2026-01-01',
    views: 1560,
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800',
    featured: true
  },
  {
     id: 6,
     title: '认知觉醒：如何开启自我驱动的进化？',
     summary: '通过理解大脑的运作机制，打破固有的思维枷锁，实现从被动学习到主动进化的跨越。',
     content: '<p>为什么我们总是习惯性拖延？为什么注意力难以集中？答案可能藏在我们的进化基因里...</p>',
     category: 'psychology',
     categoryLabel: '心理科普',
     author: '阿何',
     authorTitle: '知名博主',
     authorAvatar: 'https://i.pravatar.cc/100?u=ahe',
     date: '2025-12-30',
     views: 5600,
     readTime: '18 min',
     image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&q=80&w=800',
     featured: true
   },
   {
     id: 7,
     title: '面试避坑指南：HR最看重的五个特质',
     summary: '在面试中，除了专业技能，你的沟通能力、抗压能力和学习潜力同样关键。',
     content: '<p>很多同学在面试时只关注技术细节，却忽视了软实力的展现...</p>',
     category: 'career',
     categoryLabel: '生涯导航',
     author: '李经理',
     authorTitle: '大厂HRBP',
     authorAvatar: 'https://i.pravatar.cc/100?u=lihr',
     date: '2025-12-28',
     views: 2800,
     readTime: '9 min',
     image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800',
     featured: false
   },
   {
     id: 8,
     title: '被讨厌的勇气：阿德勒心理学带给我的改变',
     summary: '每个人都想获得他人的认可，但过度在意他人的评价只会让你失去自由。',
     content: '<p>阿德勒心理学告诉我们，所有的烦恼都来自人际关系...</p>',
     category: 'psychology',
     categoryLabel: '心理科普',
     author: '哲学家',
     authorTitle: '特约作者',
     authorAvatar: 'https://i.pravatar.cc/100?u=zhe',
     date: '2025-12-25',
     views: 4200,
     readTime: '14 min',
     image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
     featured: false
   },
   {
     id: 9,
     title: '创业日记：在车库里诞生的梦想',
     summary: '一个关于坚持、失败与重生的故事，献给每一个正在路上的创业者。',
     content: '<p>那是2020年的春天，我们三个人挤在一个不足十平米的车库里...</p>',
     category: 'stories',
     categoryLabel: '成长故事',
     author: '小明',
     authorTitle: '连续创业者',
     authorAvatar: 'https://i.pravatar.cc/100?u=xiaoming',
     date: '2025-12-20',
     views: 1100,
     readTime: '20 min',
     image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
     featured: false
   },
   {
     id: 10,
     title: '极简主义生活：少即是多',
     summary: '当我们开始清理物理空间时，内心也随之变得清晰。',
     content: '<p>极简主义不代表苦行，而是一种对生活的主动选择...</p>',
     category: 'daily',
     categoryLabel: '每日精选',
     author: '林溪',
     authorTitle: '生活方式博主',
     authorAvatar: 'https://i.pravatar.cc/100?u=linxi',
     date: '2025-12-15',
     views: 3100,
     readTime: '7 min',
     image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800',
     featured: false
   }
])

// 文章详情
const selectedArticle = ref(null)
const showDetail = ref(false)

function openArticle(article) {
  selectedArticle.value = article
  showDetail.value = true
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function closeArticle() {
  showDetail.value = false
  selectedArticle.value = null
}

// 焦点文章（取最新的一篇 featured）
const spotlightArticle = computed(() => {
  return articles.value.find(a => a.featured) || articles.value[0]
})

// 过滤文章
const filteredArticles = computed(() => {
  let result = articles.value
  if (activeCategory.value !== 'all') {
    if (activeCategory.value === 'daily' || activeCategory.value === 'featured') {
      result = result.filter(a => a.featured)
    } else {
      result = result.filter(a => a.category === activeCategory.value)
    }
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q))
  }
  return result
})

// 最终展示的文章（处理“查看全部”逻辑）
const ARTICLE_LIMIT = 6
const displayedArticles = computed(() => {
  if (showAllArticles.value || activeCategory.value !== 'all' || searchQuery.value) {
    return filteredArticles.value
  }
  return filteredArticles.value.slice(0, ARTICLE_LIMIT)
})

const hasMoreArticles = computed(() => {
  return filteredArticles.value.length > ARTICLE_LIMIT && !showAllArticles.value && activeCategory.value === 'all' && !searchQuery.value
})

onMounted(() => {
  if (route.query.category) {
    activeCategory.value = route.query.category
  }
})

function setCategory(key) {
  activeCategory.value = key
  showDetail.value = false
  searchQuery.value = ''
  showAllArticles.value = false
}
</script>

<template>
  <div class="article-center">
    <!-- Section 1: Enhanced Content Discovery -->
    <section class="discovery-ribbon">
      <div class="ribbon-container">
        <div class="ribbon-scroll">
          <div 
            v-for="cat in categories" 
            :key="cat.key" 
            class="ribbon-item"
            :class="{ active: activeCategory === cat.key }"
            @click="setCategory(cat.key)"
          >
            <el-icon class="item-icon"><component :is="cat.icon" /></el-icon>
            <span class="item-label">{{ cat.label }}</span>
            <div class="item-indicator"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="main-content">
      <!-- Section 2: Search Bar (Minimalist) -->
      <div class="search-wrapper">
        <div class="search-box">
          <el-icon class="search-icon"><Search /></el-icon>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索你感兴趣的话题..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Section 3: Article Modules -->
      <div class="article-modules" v-if="!showDetail">
        <!-- Spotlight Module -->
        <div v-if="activeCategory === 'all' && !searchQuery" class="module-spotlight">
          <div class="module-header">
            <div class="header-left">
              <h3 class="module-title">今日焦点</h3>
              <span class="article-count">为您甄选的最佳深度内容</span>
            </div>
          </div>
          <div class="spotlight-card" @click="openArticle(spotlightArticle)">
            <div class="spotlight-image">
              <img :src="spotlightArticle.image" :alt="spotlightArticle.title">
            </div>
            <div class="spotlight-content">
              <div class="spotlight-badge">
                <span class="category-tag">{{ spotlightArticle.categoryLabel }}</span>
                <span class="read-badge">{{ spotlightArticle.readTime }} read</span>
              </div>
              <h2 class="spotlight-title">{{ spotlightArticle.title }}</h2>
              <p class="spotlight-desc">{{ spotlightArticle.summary }}</p>
              <div class="spotlight-footer">
                <div class="spotlight-author">
                  <img :src="spotlightArticle.authorAvatar" :alt="spotlightArticle.author" class="author-avatar">
                  <div class="author-info">
                    <span class="author-name">{{ spotlightArticle.author }}</span>
                    <span class="author-title">{{ spotlightArticle.authorTitle }}</span>
                  </div>
                </div>
                <button class="read-more">
                  <span>立即阅读</span>
                  <el-icon><ArrowRight /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid Module -->
        <div class="module-grid">
          <div class="module-header">
            <div class="header-left">
              <h3 class="module-title">{{ categories.find(c => c.key === activeCategory)?.label || '全部文章' }}</h3>
              <span class="article-count">{{ filteredArticles.length }} 篇内容</span>
            </div>
            <button v-if="hasMoreArticles" class="view-all-link" @click="goToAllArticles">
              查看全部 <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          
          <div class="article-grid">
            <div 
              v-for="article in displayedArticles" 
              :key="article.id" 
              class="article-card"
              @click="openArticle(article)"
            >
              <div class="card-image">
                <img :src="article.image" :alt="article.title">
                <div class="card-overlay">
                  <span class="card-tag">{{ article.categoryLabel }}</span>
                </div>
              </div>
              <div class="card-info">
                <div class="card-meta-top">
                  <span class="author-name">{{ article.author }}</span>
                  <span class="dot"></span>
                  <span class="publish-date">{{ article.date }}</span>
                </div>
                <h4 class="card-title">{{ article.title }}</h4>
                <p class="card-summary">{{ article.summary }}</p>
                <div class="card-meta">
                  <span class="meta-item"><el-icon><Timer /></el-icon> {{ article.readTime }}</span>
                  <span class="meta-item"><el-icon><View /></el-icon> {{ article.views }} 阅读</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredArticles.length === 0" class="no-results">
            <el-empty description="暂无相关内容，换个词试试？" />
          </div>
        </div>

        <!-- Collections Module -->
        <div v-if="activeCategory === 'all' && !searchQuery" class="module-collections">
          <div class="module-header">
            <div class="header-left">
              <h3 class="module-title">专题合集</h3>
              <span class="article-count">沉浸式学习，深度掌握知识体系</span>
            </div>
            <button class="view-all-link" @click="goToAllArticles">
              查看全部 <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div class="collection-grid">
            <div 
              v-for="collection in [
                { title: '新生适应指南', count: 12, icon: 'Sunny', desc: '从校园到职场的无缝衔接，助你快速融入新环境。' },
                { title: '情绪调节手册', count: 15, icon: 'Moon', desc: '掌握心理学工具，在压力之下保持内心的平静与从容。' },
                { title: '高效学习方法', count: 10, icon: 'EditPen', desc: '科学的学习策略，让你的认知效率实现质的飞跃。' },
                { title: '职场沟通艺术', count: 8, icon: 'ChatLineRound', desc: '在复杂的职场环境中，用沟通搭建信任与合作的桥梁。' }
              ]" 
              :key="collection.title" 
              class="collection-card"
              @click="searchQuery = collection.title"
            >
              <div class="collection-content">
                <div class="collection-top">
                  <div class="collection-icon-wrapper">
                    <el-icon><component :is="collection.icon" /></el-icon>
                  </div>
                  <span class="collection-count">{{ collection.count }} 篇精选</span>
                </div>
                <h4 class="collection-title">{{ collection.title }}</h4>
                <p class="collection-desc">{{ collection.desc }}</p>
              </div>
              <div class="collection-footer">
                <span class="explore-text">进入专题</span>
                <el-icon class="arrow-icon"><Right /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 4: Article Detail View -->
      <div v-else class="article-detail-view">
        <button class="back-button" @click="closeArticle">
          <el-icon><ArrowLeft /></el-icon> 返回中心
        </button>
        
        <div class="detail-container">
          <header class="detail-header">
            <div class="detail-meta">
              <span class="detail-category">{{ selectedArticle.categoryLabel }}</span>
              <span class="detail-date">{{ selectedArticle.date }}</span>
            </div>
            <h1 class="detail-title">{{ selectedArticle.title }}</h1>
            <div class="detail-author-box">
              <img :src="selectedArticle.authorAvatar" :alt="selectedArticle.author" class="detail-avatar">
              <div class="detail-author-info">
                <span class="detail-author-name">{{ selectedArticle.author }}</span>
                <span class="detail-author-title">{{ selectedArticle.authorTitle }}</span>
              </div>
            </div>
          </header>

          <div class="detail-hero">
            <img :src="selectedArticle.image" :alt="selectedArticle.title">
          </div>

          <div class="detail-content" v-html="selectedArticle.content"></div>

          <footer class="detail-footer">
            <div class="detail-stats">
              <span>阅读量 {{ selectedArticle.views }}</span>
              <span>·</span>
              <span>预计阅读 {{ selectedArticle.readTime }}</span>
            </div>
            <div class="detail-actions">
              <el-button circle><el-icon><Star /></el-icon></el-button>
              <el-button circle><el-icon><Share /></el-icon></el-button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-center {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 64px;
}

/* Discovery Ribbon */
.discovery-ribbon {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px 0;
  position: sticky;
  top: 64px;
  z-index: 100;
}

.ribbon-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 40px;
}

.ribbon-scroll {
  display: flex;
  gap: 32px;
  overflow-x: auto;
  scrollbar-width: none;
}

.ribbon-scroll::-webkit-scrollbar {
  display: none;
}

.ribbon-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 0;
  opacity: 0.5;
}

.item-icon {
  font-size: 1.1rem;
  color: #1e293b;
}

.item-label {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
  white-space: nowrap;
}

.item-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0f172a;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.ribbon-item:hover {
  opacity: 1;
}

.ribbon-item.active {
  opacity: 1;
}

.ribbon-item.active .item-label {
  font-weight: 700;
}

.ribbon-item.active .item-indicator {
  transform: scaleX(1);
}

/* Main Content */
.main-content {
  max-width: 1300px;
  margin: 0 auto;
  padding: 60px 40px 100px;
}

/* Search Box */
.search-wrapper {
  margin-bottom: 60px;
  display: flex;
  justify-content: center;
}

.search-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #0f172a;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.search-icon {
  color: #94a3b8;
  font-size: 1.2rem;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 500;
}

.search-input::placeholder {
  color: #94a3b8;
}

/* Modules */
/* Spotlight */
.module-spotlight {
  margin-bottom: 100px;
}

.spotlight-card {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  background: white;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.spotlight-card:hover {
  transform: translateY(-10px) scale(1.01);
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.12);
}

.spotlight-image {
  position: relative;
  overflow: hidden;
}

.spotlight-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.spotlight-card:hover .spotlight-image img {
  transform: scale(1.05);
}

.spotlight-content {
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(to right, white, #fafafa);
}

.spotlight-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.read-badge {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
}

.category-tag {
  display: inline-block;
  color: #0f172a;
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.spotlight-title {
  font-size: 2.75rem;
  font-weight: 900;
  line-height: 1.1;
  color: #0f172a;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
}

.spotlight-desc {
  color: #475569;
  line-height: 1.7;
  margin-bottom: 48px;
  font-size: 1.15rem;
  font-weight: 400;
}

.spotlight-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
  border-top: 1px solid #f1f5f9;
}

.spotlight-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
}

.author-title {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.read-more {
  background: #0f172a;
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.read-more:hover {
  background: #334155;
  transform: translateX(6px);
}

/* Grid Module & General Module Headers */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px; /* 增加间距防止遮挡 */
  position: relative;
  z-index: 2; /* 确保标题在卡片之上 */
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.module-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0;
  letter-spacing: -0.025em;
}

.article-count {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.view-all-link {
  background: none;
  border: none;
  color: #0f172a;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 40px;
}

.article-card {
  background: white;
  border-radius: 32px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
  border-color: rgba(0, 0, 0, 0.08);
}

.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.article-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
}

.card-tag {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #0f172a;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-info {
  padding: 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-meta-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}

.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #cbd5e1;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.card-summary {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  margin-top: auto;
  display: flex;
  gap: 20px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  padding-top: 20px;
  border-top: 1px solid #f8fafc;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Collections Module */
.module-collections {
  margin-top: 100px;
  padding: 80px 0;
  border-top: 1px solid #f1f5f9;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.collection-card {
  background: white;
  padding: 32px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;
}

.collection-card:hover {
  transform: translateY(-5px);
  border-color: #0f172a;
  box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.05);
}

.collection-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.collection-icon-wrapper {
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #0f172a;
  transition: all 0.3s ease;
}

.collection-card:hover .collection-icon-wrapper {
  background: #0f172a;
  color: white;
}

.collection-count {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.collection-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
  line-height: 1.3;
}

.collection-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.collection-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid #f8fafc;
  color: #0f172a;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.collection-card:hover .arrow-icon {
  transform: translateX(4px);
}

.collection-card:hover .collection-footer {
  color: #2563eb;
}

.no-results {
  padding: 100px 0;
}

/* Article Detail View */
.article-detail-view {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  padding: 12px 0;
  margin-bottom: 40px;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #0f172a;
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.detail-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.detail-category {
  background: #f1f5f9;
  color: #0f172a;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
}

.detail-date {
  color: #94a3b8;
  font-size: 0.9rem;
}

.detail-title {
  font-size: 3rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.1;
  margin-bottom: 40px;
  letter-spacing: -0.04em;
}

.detail-author-box {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 60px;
}

.detail-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
}

.detail-author-info {
  display: flex;
  flex-direction: column;
}

.detail-author-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.detail-author-title {
  font-size: 0.9rem;
  color: #64748b;
}

.detail-hero {
  margin: 0 -40px 60px;
  border-radius: 40px;
  overflow: hidden;
  height: 500px;
}

.detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  font-size: 1.25rem;
  line-height: 1.8;
  color: #334155;
}

.detail-content :deep(p) {
  margin-bottom: 32px;
}

.detail-content :deep(h3) {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 48px 0 24px;
}

.detail-footer {
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-stats {
  display: flex;
  gap: 12px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.detail-actions {
  display: flex;
  gap: 16px;
}

@media (max-width: 1200px) {
  .ribbon-container, .main-content {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (max-width: 1024px) {
  .spotlight-card {
    grid-template-columns: 1fr;
  }
  .spotlight-image img {
    height: 350px;
  }
  .spotlight-content {
    padding: 40px;
  }
  .spotlight-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .ribbon-scroll {
    gap: 32px;
  }
  .discovery-ribbon {
    padding-top: 24px;
  }
  .search-wrapper {
    margin-bottom: 50px;
  }
  .article-grid {
    grid-template-columns: 1fr;
  }
  .spotlight-title {
    font-size: 1.8rem;
  }
  .module-title {
    font-size: 1.5rem;
  }
}
</style>
