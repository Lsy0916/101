<!-- 文章列表 · 横向编辑式行（ArticleListView 内容区），点击行上抛 open -->
<script setup lang="ts">
import { Timer, View, ArrowRight } from '@element-plus/icons-vue'
import type { ArticleItem } from './types'

defineProps<{
  articles: ArticleItem[]
}>()

const emit = defineEmits<{
  (e: 'open', article: ArticleItem): void
}>()
</script>

<template>
  <div class="article-rows">
    <article
      v-for="(article, i) in articles"
      :key="article.id"
      class="article-row"
      @click="emit('open', article)"
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

  <div v-if="articles.length === 0" class="no-results">
    <el-empty description="未找到相关文章，尝试换个搜索词吧" />
  </div>
</template>

<style scoped>
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
  border-bottom: 1px solid var(--mist-100);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.article-row:first-child {
  border-top: 1px solid var(--mist-100);
}

.article-row:hover {
  transform: translateX(16px);
}

/* 编号 */
.row-index {
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 200;
  color: color-mix(in srgb, var(--brand-primary) 25%, transparent);
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
  color: color-mix(in srgb, var(--brand-primary) 30%, transparent);
  font-weight: 400;
}

.article-row:hover .row-index {
  color: var(--brand-primary);
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
  color: var(--brand-primary);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.row-date {
  font-size: 12px;
  color: var(--ink-400);
  font-weight: 500;
}

.row-title {
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 700;
  color: var(--navy-950);
  line-height: 1.3;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.article-row:hover .row-title {
  color: var(--brand-primary);
}

.row-summary {
  font-size: 14px;
  color: var(--ink-500);
  line-height: 1.6;
  margin: 0 0 14px;
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
  color: var(--ink-400);
  font-weight: 500;
}

.row-meta .dot {
  width: 3px;
  height: 3px;
  background: var(--ink-300);
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
  background: linear-gradient(135deg, transparent 60%, color-mix(in srgb, var(--brand-primary) 12%, transparent) 100%);
  pointer-events: none;
}

.row-arrow {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: color-mix(in srgb, white 95%, transparent);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
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
@media (width <= 1024px) {
  .article-row {
    grid-template-columns: 64px 1fr 180px;
    gap: 24px;
  }

  .row-image {
    width: 180px;
    height: 110px;
  }
}

@media (width <= 768px) {
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
</style>
