<!-- 文章正文（v-html + 首图注入）与底部操作栏（ArticleDetailView 主栏），点赞/收藏状态由页面持有 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Star, Share } from '@element-plus/icons-vue'
import type { ArticleItem } from './types'

const props = defineProps<{
  article: ArticleItem
  liked: boolean
  bookmarked: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-like'): void
  (e: 'toggle-bookmark'): void
}>()

const articleBody = computed(() => {
  const hero = props.article.image
    ? `<figure class="article-hero-img"><img src="${props.article.image}" alt="${props.article.title}"/><figcaption>— ${props.article.title}</figcaption></figure>`
    : ''
  return hero + (props.article.content || '')
})
</script>

<template>
  <div class="article-main">
    <article v-reveal="80" class="rich-content drop-cap" v-html="articleBody"></article>

    <!-- 底部操作栏 -->
    <footer class="detail-footer">
      <div class="footer-line"></div>
      <div class="footer-row">
        <span class="footer-mark">— End of Article</span>
        <div class="footer-actions">
          <button class="action-btn" :class="{ active: liked }" @click="emit('toggle-like')">
            <el-icon><Star /></el-icon>
            <span>{{ liked ? $t('article.detail.comments.liked') : $t('article.detail.comments.like') }}</span>
          </button>
          <button class="action-btn" @click="emit('toggle-bookmark')">
            <el-icon><Share /></el-icon>
            <span>{{ $t('square.detail.share') }}</span>
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.article-main {
  min-width: 0;
}

/* ===== 正文 ===== */
.rich-content {
  font-size: 17px;
  line-height: 1.85;
  color: var(--ink-800);
  font-weight: 400;
}

.rich-content :deep(p) {
  margin: 0 0 24px;
}

.rich-content :deep(h3) {
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 800;
  color: var(--navy-950);
  letter-spacing: -0.5px;
  margin: 56px 0 20px;
  position: relative;
  padding-left: 18px;
}

.rich-content :deep(h3)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 6px;
  height: 6px;
  background: var(--brand-primary);
  border-radius: 50%;
}

.rich-content :deep(strong) {
  font-weight: 700;
  color: var(--navy-950);
}

.rich-content :deep(blockquote) {
  margin: 32px 0;
  padding: 16px 24px;
  border-left: 3px solid var(--brand-primary);
  font-style: italic;
  color: var(--ink-600);
  background: var(--brand-primary-wash);
}

.rich-content :deep(a) {
  color: var(--brand-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.rich-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 32px 0;
  display: block;
}

/* ===== Hero 大图 ===== */

/* 文章首图（封面）· 嵌入正文 */
.rich-content :deep(.article-hero-img) {
  margin: 0 0 40px;
  position: relative;
}

.rich-content :deep(.article-hero-img img) {
  width: 100%;
  height: clamp(280px, 38vw, 480px);
  object-fit: cover;
  display: block;
  border-radius: 20px;
  filter: grayscale(1%) contrast(1.02);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.rich-content :deep(.article-hero-img:hover img) {
  transform: scale(1.02);
}

.rich-content :deep(.article-hero-img figcaption) {
  margin-top: 14px;
  font-size: 12px;
  color: var(--ink-400);
  letter-spacing: 1.5px;
  font-style: italic;
  font-family: Georgia, 'Times New Roman', serif;
  text-align: center;
}

/* ===== 底部操作栏 ===== */
.detail-footer {
  margin: 80px 0 0;
}

.footer-line {
  height: 1px;
  background: var(--mist-050);
  margin-bottom: 28px;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-mark {
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--ink-400);
  font-weight: 600;
  text-transform: uppercase;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid var(--mist-100);
  color: var(--ink-800);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 0;
}

.action-btn:hover {
  border-color: var(--navy-950);
  background: var(--navy-950);
  color: white;
}

.action-btn.active {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
  color: white;
}
.action-btn .el-icon { font-size: 13px; }

@media (width <= 768px) {
  .footer-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
