﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Search,
  Reading,
  Timer,
  View,
  ArrowRight,
  Collection,
  HotWater,
  Star,
  Right
} from '@element-plus/icons-vue'
import ReadProgress from '@/components/ReadProgress.vue'
import InitialAvatar from '@/components/InitialAvatar.vue'

const route = useRoute()
const router = useRouter()
const { t, tm } = useI18n()
const searchQuery = ref('')
const activeCategory = ref(route.query.category || 'all')
const showAllArticles = ref(false)

watch(() => route.query.category, (newCat) => {
  const next = newCat || 'all'
  if (next !== activeCategory.value) {
    activeCategory.value = next
    searchQuery.value = ''
    showAllArticles.value = false
  }
})

function goToAllArticles() {
  router.push('/articles/list')
}

// 文章分类数据
const categories = computed(() => [
  { label: t('article.categories.all'), key: 'all', icon: Collection },
  { label: t('article.categories.daily'), key: 'daily', icon: Star },
  { label: t('article.categories.featured'), key: 'featured', icon: HotWater },
  { label: t('article.categories.psychology'), key: 'psychology', icon: Reading },
  { label: t('article.categories.career'), key: 'career', icon: Timer },
  { label: t('article.categories.stories'), key: 'stories', icon: View }
])

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
    date: '2026-01-05',
    views: 4520,
    readTime: '12 min',
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

// 焦点文章（取最新的一篇 featured）
const spotlightArticle = computed(() => {
  return articles.value.find(a => a.featured) || articles.value[0]
})

// 分类专属标题区数据
const categoryIntros = computed(() => ({
  all: { title: t('article.intro.all.title'), eyebrow: '— Articles &amp; Stories', sub: t('article.intro.all.sub') },
  daily: { title: t('article.intro.daily.title'), eyebrow: '— Daily Picks', sub: t('article.intro.daily.sub') },
  featured: { title: t('article.intro.featured.title'), eyebrow: '— Featured Stories', sub: t('article.intro.featured.sub') },
  psychology: { title: t('article.intro.psychology.title'), eyebrow: '— Psychology', sub: t('article.intro.psychology.sub') },
  career: { title: t('article.intro.career.title'), eyebrow: '— Career', sub: t('article.intro.career.sub') },
  stories: { title: t('article.intro.stories.title'), eyebrow: '— Growth Stories', sub: t('article.intro.stories.sub') }
}))

const introData = computed(() => {
  const data = categoryIntros.value[activeCategory.value] || categoryIntros.value.all
  const stats = activeCategory.value === 'all'
    ? [
        { num: '120', sup: '+', label: t('article.stats.articles') },
        { num: '06', sup: '', label: t('article.stats.categories') },
        { num: '24h', sup: '', label: t('article.stats.update') }
      ]
    : [
        { num: String(filteredArticles.value.length).padStart(2, '0'), sup: '', label: t('article.stats.count') },
        { num: '06', sup: '', label: t('article.stats.categories') },
        { num: '24h', sup: '', label: t('article.stats.update') }
      ]
  return { ...data, stats }
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

// 专题合集数据（标题与描述走 i18n，count 与 icon 为本地配置）
const collectionItems = computed(() => {
  const items = tm('article.collections.items')
  const meta = [
    { count: 12, icon: 'Sunny' },
    { count: 15, icon: 'Moon' },
    { count: 10, icon: 'EditPen' },
    { count: 8, icon: 'ChatLineRound' }
  ]
  return items.map((item, i) => ({
    title: item.title,
    desc: item.desc,
    ...meta[i]
  }))
})

function setCategory(key) {
  activeCategory.value = key
  searchQuery.value = ''
  showAllArticles.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="article-center">
    <ReadProgress />
    <!-- 编辑式标题区 · 纯排版无卡片 · 随分类切换 -->
    <div class="page-intro">
      <div class="intro-container">
        <div class="intro-left">
          <span class="intro-eyebrow">{{ introData.eyebrow }}</span>
          <h1 class="intro-title" v-html="introData.title"></h1>
          <p class="intro-sub">{{ introData.sub }}</p>
        </div>
        <div class="intro-right">
          <div class="intro-stat" v-for="stat in introData.stats" :key="stat.label">
            <span class="stat-num">{{ stat.num }}<sup v-if="stat.sup">{{ stat.sup }}</sup></span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 导读栏 · sticky 紧贴 navbar -->
    <section class="discovery-ribbon">
      <div class="ribbon-container">
        <div class="ribbon-scroll">
          <div
            v-for="(cat, i) in categories"
            :key="cat.key"
            class="ribbon-item"
            :class="{ active: activeCategory === cat.key }"
            @click="setCategory(cat.key)"
          >
            <span class="item-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="item-label">{{ cat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <div class="main-content">
      <!-- 极简搜索 -->
      <div class="search-wrapper">
        <div class="search-box">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('article.search')"
            class="search-input"
          />
        </div>
      </div>

      <div class="article-modules">
        <!-- 今日焦点 -->
        <div v-if="activeCategory === 'all' && !searchQuery" class="module-spotlight">
          <div class="module-header">
            <h3 class="module-title">{{ $t('article.spotlight.title') }}</h3>
            <span class="article-count">{{ $t('article.spotlight.sub') }}</span>
          </div>
          <div class="spotlight-card" :class="{ 'no-cover': !spotlightArticle.image }" @click="openArticle(spotlightArticle)">
            <div v-if="spotlightArticle.image" class="spotlight-image">
              <img :src="spotlightArticle.image" :alt="spotlightArticle.title" loading="lazy">
              <span class="spotlight-stamp">FEATURED · 01</span>
            </div>
            <span v-else class="spotlight-quote-deco" aria-hidden="true">"</span>
            <div class="spotlight-content">
              <div class="spotlight-meta">
                <span class="category-tag">{{ spotlightArticle.categoryLabel }}</span>
                <span class="dot"></span>
                <span class="read-badge">{{ spotlightArticle.readTime }} read</span>
              </div>
              <h2 class="spotlight-title">{{ spotlightArticle.title }}</h2>
              <p class="spotlight-desc">{{ spotlightArticle.summary }}</p>
              <div class="spotlight-footer">
                <div class="spotlight-author">
                  <InitialAvatar :name="spotlightArticle.author" :size="48" class="author-avatar" />
                  <div class="author-info">
                    <span class="author-name">{{ spotlightArticle.author }}</span>
                    <span class="author-title">{{ spotlightArticle.authorTitle }}</span>
                  </div>
                </div>
                <button class="read-more">
                  <span>{{ $t('article.spotlight.read') }}</span>
                  <el-icon><ArrowRight /></el-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 文章网格 -->
        <div class="module-grid">
          <div class="module-header">
            <div class="header-left">
              <h3 class="module-title">{{ categories.find(c => c.key === activeCategory)?.label || $t('article.grid.all') }}</h3>
              <span class="article-count">{{ filteredArticles.length }} {{ $t('article.stats.count') }}</span>
            </div>
            <button v-if="hasMoreArticles" class="view-all-link" @click="goToAllArticles">
              {{ $t('article.grid.viewAll') }} <el-icon><ArrowRight /></el-icon>
            </button>
          </div>

          <div class="article-grid">
            <div
              v-for="article in displayedArticles"
              :key="article.id"
              class="article-card"
              :class="{ 'no-cover': !article.image }"
              @click="openArticle(article)"
            >
              <div v-if="article.image" class="card-image">
                <img :src="article.image" :alt="article.title" loading="lazy">
                <span class="card-tag">{{ article.categoryLabel }}</span>
              </div>
              <div v-else class="card-no-cover-top">
                <span class="no-cover-eyebrow">{{ article.categoryLabel }}</span>
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
                  <span class="meta-item"><el-icon><View /></el-icon> {{ article.views }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredArticles.length === 0" class="no-results">
            <el-empty :description="$t('article.empty')" />
          </div>
        </div>

        <!-- 专题合集 -->
        <div v-if="activeCategory === 'all' && !searchQuery" class="module-collections">
          <div class="module-header">
            <div class="header-left">
              <h3 class="module-title">{{ $t('article.collections.title') }}</h3>
              <span class="article-count">{{ $t('article.collections.sub') }}</span>
            </div>
            <button class="view-all-link" @click="goToAllArticles">
              {{ $t('article.collections.viewAll') }} <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div class="collection-grid">
            <div
              v-for="collection in collectionItems"
              :key="collection.title"
              class="collection-card"
              @click="searchQuery = collection.title"
            >
              <div class="collection-content">
                <div class="collection-top">
                  <div class="collection-icon-wrapper">
                    <el-icon><component :is="collection.icon" /></el-icon>
                  </div>
                  <span class="collection-count">{{ collection.count }} {{ $t('article.collections.countUnit') }}</span>
                </div>
                <h4 class="collection-title">{{ collection.title }}</h4>
                <p class="collection-desc">{{ collection.desc }}</p>
              </div>
              <div class="collection-footer">
                <span class="explore-text">{{ $t('article.collections.enter') }}</span>
                <el-icon class="arrow-icon"><Right /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-center {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 28px;
  position: relative;
}

/* ===== 编辑式标题区 · 纯排版无卡片 ===== */
.page-intro {
  max-width: 1400px;
  margin: 0 auto;
  padding: 56px 40px 40px;
  position: relative;
  z-index: 1;
}

.intro-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 48px;
  padding-bottom: 40px;
  border-bottom: 1px solid #e8ecf0;
}

.intro-left {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.intro-eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
  color: #0052d9;
  font-weight: 600;
  text-transform: uppercase;
}

.intro-title {
  font-size: clamp(48px, 7vw, 104px);
  font-weight: 900;
  color: #0a0f1a;
  margin: 0;
  letter-spacing: -3px;
  line-height: 0.92;
}

.intro-title :deep(em) {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
}

.intro-sub {
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  max-width: 480px;
}

.intro-right {
  display: flex;
  gap: 40px;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.intro-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
}

.stat-num {
  font-size: 32px;
  font-weight: 900;
  color: #0a0f1a;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.stat-num sup {
  font-size: 16px;
  font-weight: 700;
  color: #0052d9;
  vertical-align: super;
  margin-left: 2px;
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* ===== 导读栏 · sticky 紧贴 navbar（滚动后 navbar 64px）===== */
.discovery-ribbon {
  background: #ffffff;
  border-bottom: 1px solid #eef2f6;
  padding: 14px 0;
  position: sticky;
  top: 64px;
  z-index: 100;
}

.ribbon-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.ribbon-scroll {
  display: flex;
  gap: 36px;
  overflow-x: clip;
  scrollbar-width: none;
}

@media (max-width: 768px) {
  .ribbon-scroll { overflow-x: auto; }
}

.ribbon-scroll::-webkit-scrollbar {
  display: none;
}

.ribbon-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding: 6px 0;
  opacity: 0.45;
}

.item-num {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.item-label {
  font-size: 0.95rem;
  color: #111827;
  font-weight: 500;
  white-space: nowrap;
}

.ribbon-item::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0a0f1a;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
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

.ribbon-item.active .item-num {
  color: #0052d9;
}

.ribbon-item.active::after {
  transform: scaleX(1);
}

/* ===== 主内容 ===== */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 56px 40px 100px;
}

/* 搜索 */
.search-wrapper {
  margin-bottom: 64px;
  display: flex;
  justify-content: flex-start;
}

.search-box {
  background: transparent;
  border: none;
  border-bottom: 1px solid #e8ecf0;
  border-radius: 0;
  padding: 8px 0 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 460px;
  transition: border-color 0.3s ease;
}

.search-box:focus-within {
  border-color: #0a0f1a;
}

.search-icon {
  color: #9ca3af;
  font-size: 1.15rem;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

/* ===== 模块标题 ===== */
.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 36px;
  gap: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-title {
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 900;
  color: #0a0f1a;
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.article-count {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.view-all-link {
  background: none;
  border: none;
  color: #0052d9;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 8px 0;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.view-all-link:hover {
  transform: translateX(4px);
  gap: 10px;
}

/* ===== 今日焦点 · 图片完全覆盖 ===== */
.module-spotlight {
  margin-bottom: 88px;
}

.spotlight-card {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eef2f6;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.spotlight-card:hover {
  box-shadow: 0 24px 56px -20px rgba(0, 82, 217, 0.18);
  border-color: #d0e7ff;
}

.spotlight-image {
  position: relative;
  overflow: hidden;
  min-height: 440px;
}

.spotlight-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.spotlight-card:hover .spotlight-image img {
  transform: scale(1.06);
}

/* 无封面焦点卡 · 编辑式纯文字排版 */
.spotlight-card.no-cover {
  grid-template-columns: 1fr;
  position: relative;
  padding: 0;
  background: #fafafa;
}

.spotlight-quote-deco {
  position: absolute;
  top: -20px;
  left: 32px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 200px;
  font-weight: 900;
  color: rgba(17, 24, 39, 0.05);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.spotlight-card.no-cover .spotlight-content {
  padding: 72px 64px;
  position: relative;
  z-index: 1;
  background: #fafafa;
}

.spotlight-card.no-cover .spotlight-content::before {
  display: none;
}

.spotlight-card.no-cover .spotlight-title {
  font-size: clamp(32px, 4vw, 52px);
  background: linear-gradient(135deg, #111827, #4b5563);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.spotlight-card.no-cover .spotlight-desc {
  font-size: 17px;
  line-height: 1.8;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}

.spotlight-stamp {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.95);
  color: #0a0f1a;
  padding: 6px 12px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  border-radius: 4px;
}

.spotlight-content {
  padding: 48px 44px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  position: relative;
}

.spotlight-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #0052d9, #1890ff);
}

.spotlight-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.category-tag {
  color: #0052d9;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.read-badge {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 500;
}

.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: #d1d5db;
}

.spotlight-title {
  font-size: clamp(26px, 2.6vw, 38px);
  font-weight: 900;
  line-height: 1.12;
  color: #0a0f1a;
  margin: 0 0 20px 0;
  letter-spacing: -0.03em;
}

.spotlight-desc {
  color: #4b5563;
  line-height: 1.7;
  margin: 0 0 36px 0;
  font-size: 1rem;
  font-weight: 400;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spotlight-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 28px;
  border-top: 1px solid #f1f5f9;
  gap: 16px;
}

.spotlight-author {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.author-avatar {
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.author-name {
  font-weight: 700;
  color: #111827;
  font-size: 0.9rem;
}

.author-title {
  font-size: 0.72rem;
  color: #6b7280;
  font-weight: 500;
}

.read-more {
  background: #0a0f1a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.read-more:hover {
  background: #0052d9;
  transform: translateX(4px);
}

/* ===== 文章网格 · 等宽 3 列 ===== */
.article-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.article-card {
  grid-column: span 1;
}

@media (max-width: 1024px) {
  .article-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}

.article-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #eef2f6;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -12px rgba(0, 82, 217, 0.15);
  border-color: #d0e7ff;
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
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover .card-image img {
  transform: scale(1.08);
}

.card-tag {
  position: absolute;
  top: 14px;
  left: 14px;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #0052d9;
  letter-spacing: 0.5px;
}

/* 无封面网格卡 · 杂志式文字排版 */
.article-card.no-cover {
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  position: relative;
}

.card-no-cover-top {
  padding: 32px 24px 0;
  display: flex;
  align-items: center;
}

.no-cover-eyebrow {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 400;
  color: #6b7280;
  letter-spacing: 1.5px;
  font-style: italic;
}

.article-card.no-cover .card-info {
  padding-top: 16px;
}

.article-card.no-cover .card-title {
  font-size: 20px;
  line-height: 1.35;
  font-family: Georgia, 'Times New Roman', serif;
}

.article-card.no-cover .card-summary {
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
}

.card-info {
  padding: 22px 24px 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-meta-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 10px 0;
  line-height: 1.35;
  letter-spacing: -0.015em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-summary {
  color: #4b5563;
  font-size: 0.88rem;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  margin-top: auto;
  display: flex;
  gap: 16px;
  color: #9ca3af;
  font-size: 0.78rem;
  font-weight: 500;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.publish-date {
  color: #9ca3af;
}

/* ===== 专题合集 ===== */
.module-collections {
  margin-top: 88px;
  padding-top: 64px;
  border-top: 1px solid #eef2f6;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.collection-card {
  background: #ffffff;
  padding: 28px 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #eef2f6;
  position: relative;
  overflow: hidden;
}

.collection-card:hover {
  transform: translateY(-4px);
  border-color: #d0e7ff;
  box-shadow: 0 16px 32px -12px rgba(0, 82, 217, 0.12);
}

.collection-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collection-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #f0f7ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #0052d9;
  transition: all 0.3s ease;
}

.collection-card:hover .collection-icon-wrapper {
  background: #0052d9;
  color: white;
}

.collection-count {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.collection-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.collection-desc {
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.collection-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  color: #0052d9;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.collection-card:hover .arrow-icon {
  transform: translateX(4px);
}

.no-results {
  padding: 80px 0;
}

/* ===== 响应式 ===== */
@media (max-width: 1200px) {
  .ribbon-container, .main-content, .page-intro {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (max-width: 1024px) {
  .spotlight-card {
    grid-template-columns: 1fr;
  }
  .spotlight-image {
    min-height: 320px;
  }
  .spotlight-content {
    padding: 36px 32px;
  }
}

@media (max-width: 768px) {
  .page-intro {
    padding: 40px 24px 32px;
  }
  .intro-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }
  .intro-mark::before { display: none; }
  .ribbon-scroll {
    gap: 28px;
  }
  .search-wrapper {
    margin-bottom: 48px;
  }
  .spotlight-title {
    font-size: 1.6rem;
  }
  .module-title {
    font-size: 1.4rem;
  }
}
</style>
