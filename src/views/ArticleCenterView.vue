<!-- 文章中心页（/articles）· 页面层负责过滤/焦点/标题区状态，内容区拆至 Spotlight/CardGrid/CollectionGrid -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Search,
  Reading,
  Timer,
  View,
  Collection,
  HotWater,
  Star
} from '@element-plus/icons-vue'
import BaseReadProgress from '@/components/base/BaseReadProgress.vue'
import ArticleSpotlightCard from '@/components/business/article/ArticleSpotlightCard.vue'
import ArticleCardGrid from '@/components/business/article/ArticleCardGrid.vue'
import ArticleCollectionGrid from '@/components/business/article/ArticleCollectionGrid.vue'
import type { ArticleItem } from '@/api/mock/articles'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const searchQuery = ref('')
const activeCategory = ref(String(route.query.category || 'all'))
const showAllArticles = ref(false)

watch(() => route.query.category, (newCat) => {
  const next = (typeof newCat === 'string' && newCat) || 'all'
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

// 模拟文章数据（与 @/api/mock/articles 基本一致，但刻意保留 id 1 无 image：
// 今日焦点与网格首卡依赖该字段走"无封面"纯文字排版分支，直接替换共享数据会改变视觉）
const articles = ref<ArticleItem[]>([
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
function openArticle(article: ArticleItem) {
  router.push(`/articles/${article.id}`)
}

// 焦点文章（取最新的一篇 featured）
const spotlightArticle = computed(() => {
  return articles.value.find(a => a.featured) || articles.value[0]
})

// 分类专属标题区数据
const categoryIntros = computed<Record<string, { title: string; eyebrow: string; sub: string }>>(() => ({
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

function setCategory(key: string) {
  activeCategory.value = key
  searchQuery.value = ''
  showAllArticles.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 专题合集点击 → 以合集标题作为搜索词
function onCollectionSelect(title: string) {
  searchQuery.value = title
}
</script>

<template>
  <div class="article-center">
    <BaseReadProgress />
    <!-- 编辑式标题区 · 纯排版无卡片 · 随分类切换 -->
    <div class="page-intro">
      <div class="intro-container">
        <div class="intro-left">
          <span class="intro-eyebrow">{{ introData.eyebrow }}</span>
          <h1 class="intro-title" v-html="introData.title"></h1>
          <p class="intro-sub">{{ introData.sub }}</p>
        </div>
        <div class="intro-right">
          <div v-for="stat in introData.stats" :key="stat.label" class="intro-stat">
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
            v-model="searchQuery"
            type="text"
            :placeholder="$t('article.search')"
            class="search-input"
          />
        </div>
      </div>

      <div class="article-modules">
        <!-- 今日焦点 -->
        <ArticleSpotlightCard
          v-if="activeCategory === 'all' && !searchQuery"
          :article="spotlightArticle"
          @open="openArticle"
        />

        <!-- 文章网格 -->
        <ArticleCardGrid
          :articles="displayedArticles"
          :title="categories.find(c => c.key === activeCategory)?.label || $t('article.grid.all')"
          :count="filteredArticles.length"
          :show-view-all="hasMoreArticles"
          @open="openArticle"
          @view-all="goToAllArticles"
        />

        <!-- 专题合集 -->
        <ArticleCollectionGrid
          v-if="activeCategory === 'all' && !searchQuery"
          @select="onCollectionSelect"
          @view-all="goToAllArticles"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-center {
  min-height: 100vh;
  background-color: var(--slate-50);
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
  border-bottom: 1px solid var(--mist-100);
}

.intro-left {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.intro-eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--brand-primary);
  font-weight: 600;
  text-transform: uppercase;
}

.intro-title {
  font-size: clamp(48px, 7vw, 104px);
  font-weight: 900;
  color: var(--navy-950);
  margin: 0;
  letter-spacing: -3px;
  line-height: 0.92;
}

.intro-title :deep(em) {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
}

.intro-sub {
  font-size: 0.95rem;
  color: var(--ink-500);
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
  color: var(--navy-950);
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.stat-num sup {
  font-size: 16px;
  font-weight: 700;
  color: var(--brand-primary);
  vertical-align: super;
  margin-left: 2px;
}

.stat-label {
  font-size: 11px;
  color: var(--ink-500);
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* ===== 导读栏 · sticky 紧贴 navbar（滚动后 navbar 64px）===== */
.discovery-ribbon {
  background: white;
  border-bottom: 1px solid var(--mist-050);
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

@media (width <= 768px) {
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
  color: var(--ink-400);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.item-label {
  font-size: 0.95rem;
  color: var(--ink-900);
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
  background: var(--navy-950);
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
  color: var(--brand-primary);
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
  border-bottom: 1px solid var(--mist-100);
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
  border-color: var(--navy-950);
}

.search-icon {
  color: var(--ink-400);
  font-size: 1.15rem;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  color: var(--ink-900);
  font-weight: 500;
  background: transparent;
}

.search-input::placeholder {
  color: var(--ink-400);
}

/* ===== 响应式 ===== */
@media (width <= 1200px) {
  .ribbon-container, .main-content, .page-intro {
    padding-left: 24px;
    padding-right: 24px;
  }
}

@media (width <= 768px) {
  .page-intro {
    padding: 40px 24px 32px;
  }

  .intro-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }

  .ribbon-scroll {
    gap: 28px;
  }

  .search-wrapper {
    margin-bottom: 48px;
  }
}
</style>
