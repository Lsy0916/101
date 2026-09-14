<!-- 广场详情页 · 标题区：心情/日期 + 大标题 + 作者行 -->
<script setup lang="ts">
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'
import { moodMap } from './data'
import type { PostItem } from './types'

defineProps<{
  post: PostItem
}>()
</script>

<template>
  <header class="detail-header">
    <div class="header-eyebrow">
      <span v-if="post.mood" class="eyebrow-mood">{{ moodMap[post.mood] }}</span>
      <span class="eyebrow-date">{{ $t('square.detail.createdAt', { date: post.createdAt }) }}</span>
    </div>
    <h1 class="detail-title" v-html="$t('square.detail.title')"></h1>

    <!-- 作者行 -->
    <div class="author-row">
      <div class="author-block">
        <BaseInitialAvatar :name="post.author" :size="44" :is-anonymous="post.isAnonymous" class="author-avatar" />
        <div class="author-info">
          <span class="author-name">{{ post.isAnonymous ? $t('square.detail.anonymous') : post.author }}</span>
          <span class="author-title">{{ post.type === 'capsule' ? $t('square.list.capsuleBadge') : $t('square.list.momentBadge') }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===== 标题区 ===== */
.detail-header {
  max-width: 860px;
  margin: 0 auto;
  padding: 56px 40px 40px;
  position: relative;
  z-index: 1;
}

.header-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--brand-primary);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.eyebrow-mood {
  font-size: 24px;
  line-height: 1;
}

.eyebrow-date {
  color: var(--ink-500);
  font-weight: 500;
}

.detail-title {
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 900;
  color: var(--navy-950);
  line-height: 1.08;
  letter-spacing: -1.5px;
  margin: 0 0 32px;
}

.detail-title em {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
}

/* 作者行 */
.author-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--mist-050);
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
  color: var(--ink-900);
  letter-spacing: 0.2px;
}

.author-title {
  font-size: 11px;
  color: var(--ink-400);
  letter-spacing: 1px;
  text-transform: uppercase;
}

@media (width <= 768px) {
  .detail-header {
    padding: 36px 20px 28px;
  }
}
</style>
