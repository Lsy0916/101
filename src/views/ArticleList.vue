<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Search, 
  Reading, 
  Timer, 
  View, 
  ArrowLeft,
  Collection,
  HotWater,
  Star,
  Share
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const activeCategory = ref('all')

// 文章分类数据
const categories = [
  { label: '全部内容', key: 'all', icon: Collection },
  { label: '每日精选', key: 'daily', icon: Star },
  { label: '专题报道', key: 'featured', icon: HotWater },
  { label: '心理科普', key: 'psychology', icon: Reading },
  { label: '生涯导航', key: 'career', icon: Timer },
  { label: '成长故事', key: 'stories', icon: View }
]

// 模拟文章数据 (与 ArticleCenter.vue 保持一致)
const articles = ref([
  {
    id: 1,
    title: '在不确定的时代，如何建立内心的秩序？',
    summary: '探索如何在纷乱的外界环境中，通过心理学的工具 and 自省，找回属于自己的节奏与宁静。在这个快速变化的时代，内心的安定是我们最宝贵的资产。',
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function closeArticle() {
  showDetail.value = false
  selectedArticle.value = null
}

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

onMounted(() => {
  if (route.query.category) {
    activeCategory.value = route.query.category
  }
})

function setCategory(key) {
  activeCategory.value = key
  showDetail.value = false
  searchQuery.value = ''
}

function goBack() {
  router.push('/articles')
}
</script>

<template>
  <div class="article-list-page">
    <!-- Section 1: Navigation Ribbon -->
    <section class="discovery-ribbon">
      <div class="ribbon-container">
        <button class="back-link" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          <span>返回中心</span>
        </button>
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
      <!-- Section 2: Search Bar -->
      <div class="search-wrapper">
        <div class="search-box">
          <el-icon class="search-icon"><Search /></el-icon>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索文章标题或摘要..."
            class="search-input"
          />
        </div>
      </div>

      <!-- Section 3: Article List -->
      <div class="article-list-content" v-if="!showDetail">
        <div class="list-header">
          <h2 class="list-title">
            {{ categories.find(c => c.key === activeCategory)?.label }}
            <span class="count-badge">{{ filteredArticles.length }}</span>
          </h2>
        </div>

        <div class="article-grid">
          <div 
            v-for="article in filteredArticles" 
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
          <el-empty description="未找到相关文章，尝试换个搜索词吧" />
        </div>
      </div>

      <!-- Section 4: Article Detail View -->
      <div v-else class="article-detail-view">
        <button class="back-button" @click="closeArticle">
          <el-icon><ArrowLeft /></el-icon> 返回列表
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
.article-list-page {
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
  display: flex;
  align-items: center;
  gap: 40px;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  border: none;
  color: #0f172a;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 12px;
  white-space: nowrap;
  font-size: 0.9rem;
}

.back-link:hover {
  background: #e2e8f0;
  transform: translateX(-4px);
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
  padding: 40px 40px 100px;
}

/* Search Box */
.search-wrapper {
  margin-bottom: 40px;
  display: flex;
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
  max-width: 400px;
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

/* List Content */
.list-header {
  margin-bottom: 32px;
}

.list-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 16px;
}

.count-badge {
  font-size: 0.9rem;
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 40px;
}

.article-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid #f1f5f9;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: transparent;
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
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
}

.card-tag {
  background: rgba(255, 255, 255, 0.95);
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
}

.card-info {
  padding: 24px;
}

.card-meta-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.author-name {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.dot {
  width: 3px;
  height: 3px;
  background: #cbd5e1;
  border-radius: 50%;
}

.publish-date {
  font-size: 0.85rem;
  color: #94a3b8;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #94a3b8;
}

.no-results {
  padding: 100px 0;
}

/* Article Detail View */
.article-detail-view {
  animation: fadeIn 0.5s ease;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 32px;
  transition: color 0.3s ease;
}

.back-button:hover {
  color: #0f172a;
}

.detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.detail-header {
  margin-bottom: 40px;
}

.detail-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-category {
  color: #3b82f6;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-date {
  color: #94a3b8;
}

.detail-title {
  font-size: 3rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

.detail-author-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.detail-author-name {
  display: block;
  font-weight: 700;
  color: #0f172a;
}

.detail-author-title {
  font-size: 0.85rem;
  color: #64748b;
}

.detail-hero {
  width: 100%;
  height: 450px;
  border-radius: 32px;
  overflow: hidden;
  margin-bottom: 60px;
}

.detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-content {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #334155;
}

.detail-content :deep(h3) {
  font-size: 1.75rem;
  color: #0f172a;
  margin: 48px 0 24px;
}

.detail-content :deep(p) {
  margin-bottom: 24px;
}

.detail-footer {
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-stats {
  color: #94a3b8;
  display: flex;
  gap: 8px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .ribbon-container {
    padding: 0 20px;
  }
  .back-link span {
    display: none;
  }
  .main-content {
    padding: 30px 20px 60px;
  }
  .detail-title {
    font-size: 2rem;
  }
  .detail-hero {
    height: 250px;
  }
  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>
