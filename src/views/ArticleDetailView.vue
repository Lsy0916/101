<!-- 文章详情页（/articles/:id）· 页面层负责取数与跳转，正文/推荐/评论区拆至 RichBody/RelatedSidebar/Comments -->
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticleById, getRelatedArticles, type ArticleItem } from '@/api/mock/articles'
import { ArrowLeft, Timer, View } from '@element-plus/icons-vue'
import BaseReadProgress from '@/components/base/BaseReadProgress.vue'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'
import ArticleRichBody from '@/components/business/article/ArticleRichBody.vue'
import ArticleRelatedSidebar from '@/components/business/article/ArticleRelatedSidebar.vue'
import ArticleComments from '@/components/business/article/ArticleComments.vue'

const route = useRoute()
const router = useRouter()

const article = ref<ArticleItem | null>(null)
const related = ref<ArticleItem[]>([])
const liked = ref(false)
const bookmarked = ref(false)

const loadArticle = (id: string | string[]) => {
  const data = getArticleById(id)
  if (!data) {
    router.replace({ name: 'articles' })
    return
  }
  article.value = data
  related.value = getRelatedArticles(data, 4)
  liked.value = false
  bookmarked.value = false
  window.scrollTo({ top: 0, behavior: 'instant' })
}

onMounted(() => {
  loadArticle(route.params.id)
})

watch(() => route.params.id, (id) => {
  if (id) loadArticle(id)
})

const goToList = () => router.push('/articles/list')
const openRelated = (id: number) => router.push(`/articles/${id}`)

const formatViews = (n: number) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}
</script>

<template>
  <div v-if="article" class="article-detail-page">
    <BaseReadProgress />

    <!-- 顶部返回栏 · 紧贴 navbar -->
    <div class="top-bar">
      <button class="back-btn" @click="goToList">
        <el-icon><ArrowLeft /></el-icon>
        <span>{{ $t('common.back') }}</span>
      </button>
      <span class="top-mark">{{ article.categoryLabel }} · No.{{ String(article.id).padStart(2, '0') }}</span>
    </div>

    <!-- 标题区 · 纯排版 -->
    <header class="detail-header">
      <div class="header-eyebrow">
        <span class="eyebrow-cat">{{ article.categoryLabel }}</span>
        <span class="eyebrow-sep">/</span>
        <span class="eyebrow-date">{{ article.date }}</span>
      </div>
      <h1 v-reveal class="detail-title">{{ article.title }}</h1>
      <p v-reveal="120" class="detail-summary">{{ article.summary }}</p>

      <!-- 作者 + meta · 编辑式定义行 -->
      <div v-reveal="200" class="author-row">
        <div class="author-block">
          <BaseInitialAvatar :name="article.author" :size="44" class="author-avatar" />
          <div class="author-info">
            <span class="author-name">{{ article.author }}</span>
            <span class="author-title">{{ article.authorTitle }}</span>
          </div>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-stats">
          <span class="meta-item"><el-icon><Timer /></el-icon>{{ article.readTime }}</span>
          <span class="meta-item"><el-icon><View /></el-icon>{{ formatViews(article.views) }}</span>
        </div>
      </div>
    </header>

    <!-- 双栏布局: 正文 + 右侧推荐 -->
    <div class="article-grid">
      <!-- 主栏: 正文（含封面首图）+ 操作栏 -->
      <ArticleRichBody
        :article="article"
        :liked="liked"
        :bookmarked="bookmarked"
        @toggle-like="liked = !liked"
        @toggle-bookmark="bookmarked = !bookmarked"
      />

      <!-- 右侧推荐栏 · sticky -->
      <ArticleRelatedSidebar :related="related" @open="openRelated" />
    </div>

    <!-- 评论区 -->
    <ArticleComments />
  </div>
</template>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 28px;
  padding-bottom: 80px;
}

/* ===== 顶部返回栏 ===== */
.top-bar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eef2f6;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s ease, transform 0.2s ease;
}
.back-btn:hover {
  color: var(--brand-primary);
  transform: translateX(-4px);
}
.back-btn .el-icon { font-size: 14px; }

.top-mark {
  font-size: 11px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
}

/* ===== 标题区 · 纯排版 ===== */
.detail-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 40px 48px;
}

.header-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--brand-primary);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 28px;
}
.eyebrow-sep { color: #d0d5db; font-weight: 400; }
.eyebrow-date { color: #6b7280; font-weight: 500; }

.detail-title {
  font-size: clamp(36px, 5.5vw, 68px);
  font-weight: 900;
  color: #0a0f1a;
  line-height: 1.04;
  letter-spacing: -2px;
  margin: 0 0 28px;
}

.detail-summary {
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.7;
  color: #4b5563;
  font-weight: 400;
  font-style: italic;
  margin: 0 0 40px;
  padding-left: 20px;
  border-left: 2px solid var(--brand-primary);
  max-width: 760px;
}

/* 作者行 */
.author-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 28px;
  border-top: 1px solid #eef2f6;
}

.author-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.author-avatar {
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.2px;
}

.author-title {
  font-size: 11px;
  color: #9ca3af;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.meta-divider {
  width: 1px;
  height: 28px;
  background: #eef2f6;
}

.meta-stats {
  display: flex;
  gap: 20px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}
.meta-item .el-icon { font-size: 13px; color: #9ca3af; }

/* ===== 双栏布局 ===== */
.article-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 56px;
  align-items: start;
}

/* ===== 响应式 ===== */
@media (max-width: 992px) {
  .article-grid {
    grid-template-columns: 1fr;
    gap: 64px;
  }
}

@media (max-width: 768px) {
  .top-bar,
  .detail-header,
  .article-grid {
    padding-left: 20px;
    padding-right: 20px;
  }
  .detail-header { padding-top: 36px; padding-bottom: 32px; }
  .author-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .meta-divider { display: none; }
}
</style>
