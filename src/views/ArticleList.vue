<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Search,
  Reading,
  Timer,
  View,
  ArrowLeft,
  ArrowRight,
  Collection,
  HotWater,
  Star
} from '@element-plus/icons-vue'
import ReadProgress from '@/components/ReadProgress.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const searchQuery = ref('')
const activeCategory = ref(route.query.category || 'all')

// 文章分类数据
const categories = computed(() => [
  { label: t('article.categories.all'), key: 'all', icon: Collection },
  { label: t('article.categories.daily'), key: 'daily', icon: Star },
  { label: t('article.categories.featured'), key: 'featured', icon: HotWater },
  { label: t('article.categories.psychology'), key: 'psychology', icon: Reading },
  { label: t('article.categories.career'), key: 'career', icon: Timer },
  { label: t('article.categories.stories'), key: 'stories', icon: View }
])

// 监听 URL query 变化，同步分类切换（Navbar 子菜单跳转）
watch(() => route.query.category, (newCat) => {
  const next = newCat || 'all'
  if (next !== activeCategory.value) {
    activeCategory.value = next
    searchQuery.value = ''
  }
})

// 模拟文章数据 (与 ArticleCenter.vue 保持一致)
const articles = ref([
  {
    id: 1,
    title: '在不确定的时代，如何建立内心的秩序？',
    summary: '探索如何在纷乱的外界环境中，通过心理学的工具与自省，找回属于自己的节奏与宁静。在这个快速变化的时代，内心的安定是我们最宝贵的资产。',
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
    date: '2025-12-15',
    views: 3100,
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800',
    featured: false
  }
])

// 文章详情 · 跳转独立详情页
function openArticle(article) {
  router.push(`/articles/${article.id}`)
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

function setCategory(key) {
  activeCategory.value = key
  searchQuery.value = ''
}

function goBack() {
  router.push('/articles')
}
</script>

<template>
  <div class="article-list-page">
    <ReadProgress />
    <!-- 纯排版标题区 -->
    <div class="page-intro">
      <div class="intro-container">
        <div class="intro-left">
          <span class="intro-eyebrow">— Articles &amp; Stories</span>
          <h1 class="intro-title">{{ categories.find(c => c.key === activeCategory)?.label || '全部文章' }}</h1>
        </div>
        <div class="intro-right">
          <span class="intro-count">{{ String(filteredArticles.length).padStart(2, '0') }}</span>
          <span class="intro-count-label">篇 / 文章</span>
        </div>
      </div>
    </div>

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
      <!-- 搜索栏 -->
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

      <!-- 文章列表：横向编辑式 -->
      <div class="article-list-content">
        <div class="article-rows">
          <article
            v-for="(article, i) in filteredArticles"
            :key="article.id"
            class="article-row"
            @click="openArticle(article)"
          >
            <div class="row-index">{{ i < 99 ? String(i + 1).padStart(2, '0') : String(i + 1) }}</div>
            <div class="row-body">
              <div class="row-tags">
                <span class="row-cat">{{ article.categoryLabel }}</span>
                <span class="row-date">{{ article.date }}</span>
              </div>
              <h3 class="row-title">{{ article.title }}</h3>
              <p class="row-summary">{{ article.summary }}</p>
              <div class="row-meta">
                <span>{{ article.author }}</span>
                <span class="dot"></span>
                <span class="row-read"><el-icon><Timer /></el-icon>{{ article.readTime }}</span>
                <span class="dot"></span>
                <span class="row-views"><el-icon><View /></el-icon>{{ article.views }}</span>
              </div>
            </div>
            <div class="row-image">
              <img :src="article.image" :alt="article.title" loading="lazy">
              <span class="row-arrow"><el-icon><ArrowRight /></el-icon></span>
            </div>
          </article>
        </div>

        <div v-if="filteredArticles.length === 0" class="no-results">
          <el-empty description="未找到相关文章，尝试换个搜索词吧" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-list-page {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 28px;
  position: relative;
}

/* 纯排版标题区 · 杂志编辑式 */
.page-intro {
  max-width: 1400px;
  margin: 0 auto;
  padding: 56px 40px 48px;
  position: relative;
  z-index: 1;
}

.intro-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e8ecf0;
}

.intro-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-eyebrow {
  font-size: 13px;
  letter-spacing: 2px;
  color: #0052d9;
  font-weight: 600;
  text-transform: uppercase;
}

.intro-title {
  font-size: clamp(48px, 7vw, 96px);
  font-weight: 900;
  color: #0a0f1a;
  margin: 0;
  letter-spacing: -3px;
  line-height: 0.95;
}

.intro-right {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-shrink: 0;
  padding-bottom: 8px;
}

.intro-count {
  font-size: clamp(48px, 5vw, 72px);
  font-weight: 200;
  color: #0a0f1a;
  line-height: 1;
  letter-spacing: -2px;
  font-variant-numeric: tabular-nums;
}

.intro-count-label {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 1px;
  font-weight: 500;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .page-intro { padding: 32px 24px 32px; }
  .intro-container { flex-direction: column; align-items: flex-start; gap: 24px; padding-bottom: 28px; }
  .intro-right { padding-bottom: 0; }
}

/* Discovery Ribbon · sticky 紧贴 navbar（滚动后 navbar 64px）*/
.discovery-ribbon {
  background: #ffffff;
  border-bottom: 1px solid #eef2f6;
  padding: 14px 0;
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
  background: #f0f7ff;
  border: 1px solid #d0e7ff;
  color: #0052d9;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 12px;
  white-space: nowrap;
  font-size: 0.9rem;
}

.back-link:hover {
  background: #0052d9;
  border-color: #0052d9;
  color: #fff;
  transform: translateX(-4px);
  box-shadow: 0 8px 18px -6px rgba(0, 82, 217, 0.3);
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
  background: #0052d9;
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 40px 100px;
}

/* Search Box · 极简下划线 */
.search-wrapper {
  margin-bottom: 48px;
  display: flex;
}

.search-box {
  background: transparent;
  border: none;
  border-bottom: 1px solid #d1d5db;
  border-radius: 0;
  padding: 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 360px;
  transition: border-color 0.3s ease;
}

.search-box:focus-within {
  border-color: #0052d9;
  box-shadow: none;
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

/* 文章列表 · 横向编辑式 */
.article-rows {
  display: flex;
  flex-direction: column;
}

.article-row {
  display: grid;
  grid-template-columns: 80px 1fr 240px;
  gap: 32px;
  align-items: center;
  padding: 36px 0;
  border-bottom: 1px solid #e8ecf0;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.article-row:first-child {
  border-top: 1px solid #e8ecf0;
}

.article-row:hover {
  transform: translateX(16px);
}

/* 编号 */
.row-index {
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 200;
  color: rgba(0, 82, 217, 0.25);
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
  transition: color 0.4s ease, font-weight 0.4s ease;
  line-height: 1;
  min-width: 56px;
  text-align: left;
  font-family: Georgia, 'Times New Roman', serif;
  position: relative;
  padding-left: 14px;
}

.row-index::before {
  content: '—';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.7em;
  color: rgba(0, 82, 217, 0.3);
  font-weight: 400;
}

.article-row:hover .row-index {
  color: #0052d9;
  font-weight: 400;
}

/* 文章主体 */
.row-body {
  min-width: 0;
}

.row-tags {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.row-cat {
  font-size: 11px;
  font-weight: 700;
  color: #0052d9;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.row-date {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.row-title {
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 700;
  color: #0a0f1a;
  line-height: 1.3;
  margin: 0 0 10px 0;
  letter-spacing: -0.02em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.article-row:hover .row-title {
  color: #0052d9;
}

.row-summary {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.row-meta .dot {
  width: 3px;
  height: 3px;
  background: #d1d5db;
  border-radius: 50%;
  flex-shrink: 0;
}

.row-read, .row-views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.row-read .el-icon, .row-views .el-icon {
  font-size: 13px;
}

/* 缩略图 */
.row-image {
  position: relative;
  width: 240px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.row-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-row:hover .row-image img {
  transform: scale(1.08);
}

.row-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 60%, rgba(0, 82, 217, 0.12) 100%);
  pointer-events: none;
}

.row-arrow {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0052d9;
  font-size: 16px;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.article-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* 响应式 */
@media (max-width: 1024px) {
  .article-row {
    grid-template-columns: 64px 1fr 180px;
    gap: 24px;
  }
  .row-image {
    width: 180px;
    height: 110px;
  }
}

@media (max-width: 768px) {
  .article-row {
    grid-template-columns: 48px 1fr;
    gap: 16px;
    padding: 24px 0;
  }
  .row-image {
    display: none;
  }
  .row-index {
    font-size: 20px;
  }
  .article-row:hover {
    transform: translateX(8px);
  }
}

.no-results {
  padding: 100px 0;
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
  .article-grid {
    grid-template-columns: 1fr;
  }
}
</style>
