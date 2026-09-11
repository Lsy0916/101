<!-- 文章网格（ArticleCenterView），卡片点击上抛 open；count 单独传入（原页面显示过滤后总数而非展示数） -->
<script setup lang="ts">
import { Timer, View, ArrowRight } from '@element-plus/icons-vue'
import type { ArticleItem } from './types'

defineProps<{
  articles: ArticleItem[]
  title: string
  count: number
  showViewAll: boolean
}>()

const emit = defineEmits<{
  (e: 'open', article: ArticleItem): void
  (e: 'view-all'): void
}>()
</script>

<template>
  <div class="module-grid">
    <div class="module-header">
      <div class="header-left">
        <h3 class="module-title">{{ title }}</h3>
        <span class="article-count">{{ count }} {{ $t('article.stats.count') }}</span>
      </div>
      <button v-if="showViewAll" class="view-all-link" @click="emit('view-all')">
        {{ $t('article.grid.viewAll') }} <el-icon><ArrowRight /></el-icon>
      </button>
    </div>

    <div class="article-grid">
      <div
        v-for="article in articles"
        :key="article.id"
        class="article-card"
        :class="{ 'no-cover': !article.image }"
        @click="emit('open', article)"
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

    <div v-if="articles.length === 0" class="no-results">
      <el-empty :description="$t('article.empty')" />
    </div>
  </div>
</template>

<style scoped>
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
  color: var(--brand-primary);
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
  color: var(--brand-primary);
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

.no-results {
  padding: 80px 0;
}

@media (max-width: 768px) {
  .module-title {
    font-size: 1.4rem;
  }
}
</style>
