<!-- 文章列表页（/articles/list）· 页面层负责过滤状态与跳转，内容区拆至 ArticleRowList -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Search,
  Reading,
  Timer,
  View,
  ArrowLeft,
  Collection,
  HotWater,
  Star
} from '@element-plus/icons-vue'
import BaseReadProgress from '@/components/base/BaseReadProgress.vue'
import ArticleRowList from '@/components/business/article/ArticleRowList.vue'
import { articles, type ArticleItem } from '@/api/mock/articles'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const searchQuery = ref('')
const activeCategory = ref(String(route.query.category || 'all'))

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
  const next = (typeof newCat === 'string' && newCat) || 'all'
  if (next !== activeCategory.value) {
    activeCategory.value = next
    searchQuery.value = ''
  }
})

// 文章详情 · 跳转独立详情页
function openArticle(article: ArticleItem) {
  router.push(`/articles/${article.id}`)
}

// 过滤文章
const filteredArticles = computed(() => {
  let result = articles
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

function setCategory(key: string) {
  activeCategory.value = key
  searchQuery.value = ''
}

function goBack() {
  router.push('/articles')
}
</script>

<template>
  <div class="article-list-page">
    <BaseReadProgress />
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
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章标题或摘要..."
            class="search-input"
          />
        </div>
      </div>

      <!-- 文章列表：横向编辑式 -->
      <div class="article-list-content">
        <ArticleRowList :articles="filteredArticles" @open="openArticle" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-list-page {
  min-height: 100vh;
  background-color: var(--slate-50);
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
  border-bottom: 1px solid var(--mist-100);
}

.intro-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.intro-eyebrow {
  font-size: 13px;
  letter-spacing: 2px;
  color: var(--brand-primary);
  font-weight: 600;
  text-transform: uppercase;
}

.intro-title {
  font-size: clamp(48px, 7vw, 96px);
  font-weight: 900;
  color: var(--navy-950);
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
  color: var(--navy-950);
  line-height: 1;
  letter-spacing: -2px;
  font-variant-numeric: tabular-nums;
}

.intro-count-label {
  font-size: 12px;
  color: var(--ink-400);
  letter-spacing: 1px;
  font-weight: 500;
  text-transform: uppercase;
}

@media (width <= 768px) {
  .page-intro { padding: 32px 24px; }
  .intro-container { flex-direction: column; align-items: flex-start; gap: 24px; padding-bottom: 28px; }
  .intro-right { padding-bottom: 0; }
}

/* Discovery Ribbon · sticky 紧贴 navbar（滚动后 navbar 64px） */
.discovery-ribbon {
  background: white;
  border-bottom: 1px solid var(--mist-050);
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
  background: var(--brand-primary-faint);
  border: 1px solid var(--brand-primary-soft);
  color: var(--brand-primary);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 12px;
  white-space: nowrap;
  font-size: 0.9rem;
}

.back-link:hover {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: white;
  transform: translateX(-4px);
  box-shadow: 0 8px 18px -6px color-mix(in srgb, var(--brand-primary) 30%, transparent);
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
  color: var(--slate-800);
}

.item-label {
  font-size: 1rem;
  color: var(--slate-800);
  font-weight: 500;
  white-space: nowrap;
}

.item-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--brand-primary);
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
  border-bottom: 1px solid var(--ink-300);
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
  border-color: var(--brand-primary);
  box-shadow: none;
}

.search-icon {
  color: var(--slate-400);
  font-size: 1.2rem;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 1rem;
  color: var(--slate-800);
  font-weight: 500;
}

/* 响应式 */
@media (width <= 768px) {
  .ribbon-container {
    padding: 0 20px;
  }

  .back-link span {
    display: none;
  }

  .main-content {
    padding: 30px 20px 60px;
  }
}
</style>
