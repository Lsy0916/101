<!-- 今日焦点卡（ArticleCenterView），点击上抛 open -->
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'
import type { ArticleItem } from './types'

defineProps<{
  article: ArticleItem
}>()

const emit = defineEmits<{
  (e: 'open', article: ArticleItem): void
}>()
</script>

<template>
  <div class="module-spotlight">
    <div class="module-header">
      <h3 class="module-title">{{ $t('article.spotlight.title') }}</h3>
      <span class="article-count">{{ $t('article.spotlight.sub') }}</span>
    </div>
    <div class="spotlight-card" :class="{ 'no-cover': !article.image }" @click="emit('open', article)">
      <div v-if="article.image" class="spotlight-image">
        <img :src="article.image" :alt="article.title" loading="lazy">
        <span class="spotlight-stamp">FEATURED · 01</span>
      </div>
      <span v-else class="spotlight-quote-deco" aria-hidden="true">"</span>
      <div class="spotlight-content">
        <div class="spotlight-meta">
          <span class="category-tag">{{ article.categoryLabel }}</span>
          <span class="dot"></span>
          <span class="read-badge">{{ article.readTime }} read</span>
        </div>
        <h2 class="spotlight-title">{{ article.title }}</h2>
        <p class="spotlight-desc">{{ article.summary }}</p>
        <div class="spotlight-footer">
          <div class="spotlight-author">
            <BaseInitialAvatar :name="article.author" :size="48" class="author-avatar" />
            <div class="author-info">
              <span class="author-name">{{ article.author }}</span>
              <span class="author-title">{{ article.authorTitle }}</span>
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

.module-title {
  font-size: clamp(22px, 2.2vw, 30px);
  font-weight: 900;
  color: var(--navy-950);
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.article-count {
  font-size: 0.85rem;
  color: var(--ink-500);
  font-weight: 500;
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
  border: 1px solid var(--mist-050);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.spotlight-card:hover {
  box-shadow: 0 24px 56px -20px color-mix(in srgb, var(--brand-primary) 18%, transparent);
  border-color: var(--brand-primary-soft);
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
  background: var(--neutral-025);
}

.spotlight-quote-deco {
  position: absolute;
  top: -20px;
  left: 32px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 200px;
  font-weight: 900;
  color: color-mix(in srgb, var(--ink-900) 5%, transparent);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.spotlight-card.no-cover .spotlight-content {
  padding: 72px 64px;
  position: relative;
  z-index: 1;
  background: var(--neutral-025);
}

.spotlight-card.no-cover .spotlight-content::before {
  display: none;
}

.spotlight-card.no-cover .spotlight-title {
  font-size: clamp(32px, 4vw, 52px);
  background: linear-gradient(135deg, var(--ink-900), var(--ink-600));
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
  background: color-mix(in srgb, white 95%, transparent);
  color: var(--navy-950);
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
  background: white;
  position: relative;
}

.spotlight-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, var(--brand-primary), var(--color-info));
}

.spotlight-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.category-tag {
  color: var(--brand-primary);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.read-badge {
  color: var(--ink-500);
  font-size: 0.75rem;
  font-weight: 500;
}

.dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: var(--ink-300);
}

.spotlight-title {
  font-size: clamp(26px, 2.6vw, 38px);
  font-weight: 900;
  line-height: 1.12;
  color: var(--navy-950);
  margin: 0 0 20px;
  letter-spacing: -0.03em;
}

.spotlight-desc {
  color: var(--ink-600);
  line-height: 1.7;
  margin: 0 0 36px;
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
  border-top: 1px solid var(--slate-100);
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
  color: var(--ink-900);
  font-size: 0.9rem;
}

.author-title {
  font-size: 0.72rem;
  color: var(--ink-500);
  font-weight: 500;
}

.read-more {
  background: var(--navy-950);
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
  background: var(--brand-primary);
  transform: translateX(4px);
}

/* ===== 响应式 ===== */
@media (width <= 1024px) {
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

@media (width <= 768px) {
  .spotlight-title {
    font-size: 1.6rem;
  }

  .module-title {
    font-size: 1.4rem;
  }
}
</style>
