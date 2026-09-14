<!-- 广场列表页 · Feed 双栏左栏：筛选栏 + 动态列表 + 空状态 -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Star, ChatLineRound, Share } from '@element-plus/icons-vue'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'
import { moodMap, feedItemsSeed } from './data'
import type { FeedItem } from './types'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'open', id: number): void
  (e: 'create'): void
  (e: 'stats-change', interactions: number): void
}>()

const activeFilter = ref('all')

// 浅拷贝种子数据，保证每次进入页面点赞等状态重置
const feedItems = ref<FeedItem[]>(feedItemsSeed.map((i) => ({ ...i })))

const counts = computed(() => ({
  all: feedItems.value.length,
  moment: feedItems.value.filter(i => i.type === 'moment').length,
  capsule: feedItems.value.filter(i => i.type === 'capsule').length
}))

const stats = computed(() => {
  const totalLikes = feedItems.value.reduce((sum, i) => sum + i.likes, 0)
  const totalComments = feedItems.value.reduce((sum, i) => sum + i.commentCount, 0)
  return {
    moments: counts.value.moment,
    capsules: counts.value.capsule,
    interactions: totalLikes + totalComments
  }
})

const filters = computed(() => [
  { key: 'all', label: t('square.list.filter.all'), count: counts.value.all },
  { key: 'moment', label: t('square.list.filter.moment'), count: counts.value.moment },
  { key: 'capsule', label: t('square.list.filter.capsule'), count: counts.value.capsule }
])

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return feedItems.value
  return feedItems.value.filter(item => item.type === activeFilter.value)
})

watch(stats, (s) => emit('stats-change', s.interactions), { immediate: true })

const toggleLike = (item: FeedItem) => {
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
}

const openDetail = (id: number) => {
  emit('open', id)
}

const goCreate = () => {
  emit('create')
}

const handleShare = (item: FeedItem) => {
  ElMessage.success(t('square.list.share') + ' · ' + (item.isAnonymous ? t('square.list.anonymous') : item.author))
}

const filterByTopic = (tag: string) => {
  ElMessage.info('#' + tag)
}
</script>

<template>
  <main class="feed-column">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <button
        v-for="f in filters"
        :key="f.key"
        class="filter-tab"
        :class="{ active: activeFilter === f.key }"
        @click="activeFilter = f.key"
      >
        <span class="tab-label">{{ f.label }}</span>
        <span class="tab-count">({{ f.count }})</span>
      </button>
    </div>

    <!-- Feed 列表 -->
    <div v-if="filteredItems.length > 0" class="feed-list">
      <article
        v-for="(item, i) in filteredItems"
        :key="item.id"
        v-reveal="i * 60"
        class="feed-card"
        :class="{ 'is-capsule': item.type === 'capsule', 'is-pinned': item.isPinned }"
        @click="openDetail(item.id)"
      >
        <!-- 置顶/热议标记 -->
        <div v-if="item.isPinned || item.isHot" class="card-mark">
          <span class="mark-badge" :class="{ pinned: item.isPinned, hot: item.isHot }">
            {{ item.isPinned ? $t('square.list.pinned') : $t('square.list.hot') }}
          </span>
        </div>

        <!-- 卡片头部 -->
        <div class="card-head">
          <BaseInitialAvatar :name="item.author" :size="44" :is-anonymous="item.isAnonymous" />
          <div class="head-meta">
            <span class="head-author">{{ item.isAnonymous ? $t('square.list.anonymous') : item.author }}</span>
            <span class="head-time">{{ item.createdAt }}</span>
          </div>
          <span class="type-badge" :class="item.type">
            {{ item.type === 'capsule' ? $t('square.list.capsuleBadge') : $t('square.list.momentBadge') }}
          </span>
        </div>

        <!-- 心情 + 内容 -->
        <div class="card-body">
          <div v-if="item.mood" class="mood-line">
            <span class="mood-emoji">{{ moodMap[item.mood] }}</span>
          </div>
          <p class="card-content">{{ item.content }}</p>
        </div>

        <!-- 图片网格 -->
        <div v-if="item.photos && item.photos.length" class="card-photo-grid" :class="'photo-count-' + Math.min(item.photos.length, 4)">
          <img v-for="(photo, pi) in item.photos.slice(0, 4)" :key="pi" :src="photo" class="card-photo" loading="lazy" />
          <span v-if="item.photos.length > 4" class="photo-more">+{{ item.photos.length - 4 }}</span>
        </div>

        <!-- 话题标签 -->
        <div v-if="item.topics && item.topics.length" class="card-topics">
          <span
            v-for="topic in item.topics"
            :key="topic"
            class="topic-tag"
            @click.stop="filterByTopic(topic)"
          >#{{ topic }}</span>
        </div>

        <!-- 互动栏 -->
        <div class="card-foot">
          <button
            class="interact-btn"
            :class="{ liked: item.liked }"
            @click.stop="toggleLike(item)"
          >
            <el-icon><Star /></el-icon>
            <span>{{ item.likes }}</span>
          </button>
          <button class="interact-btn" @click.stop="openDetail(item.id)">
            <el-icon><ChatLineRound /></el-icon>
            <span>{{ item.commentCount }}</span>
          </button>
          <button class="interact-btn" @click.stop="handleShare(item)">
            <el-icon><Share /></el-icon>
            <span>{{ $t('square.list.share') }}</span>
          </button>
        </div>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <h3 class="empty-title">{{ $t('square.list.empty.title') }}</h3>
      <p class="empty-hint">{{ $t('square.list.empty.hint') }}</p>
      <button class="empty-btn" @click="goCreate">{{ $t('square.list.empty.btn') }}</button>
    </div>
  </main>
</template>

<style scoped>
/* ===== Feed 列表 ===== */
.feed-column {
  min-width: 0;
}

.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #eef2f6;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  letter-spacing: 0.3px;
}

.filter-tab:hover {
  border-color: #d0e7ff;
  background: #f0f7ff;
  color: var(--brand-primary);
}

.filter-tab.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 82, 217, 0.2);
}

.tab-count {
  font-size: 12px;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feed-card {
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 20px;
  padding: 28px 32px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feed-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d0e7ff, #f0f7ff);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feed-card:hover {
  border-color: #e5e7eb;
  transform: translateY(-6px) rotate(-0.3deg);
  box-shadow: 0 18px 40px rgba(0, 82, 217, 0.12);
}

.feed-card:hover::before {
  opacity: 1;
}

.feed-card.is-capsule {
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%);
  border-color: #d0e7ff;
}

.feed-card.is-capsule::before {
  background: linear-gradient(90deg, #e0e7ff, #f0f7ff);
  opacity: 0;
}

.feed-card.is-pinned {
  border-color: #e5e7eb;
}

/* 图片网格 */
.card-photo-grid {
  display: grid;
  gap: 6px;
  margin: 14px 0 4px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.photo-count-1 { grid-template-columns: 1fr; }
.photo-count-1 .card-photo { height: 280px; }
.photo-count-2 { grid-template-columns: 1fr 1fr; }
.photo-count-2 .card-photo { height: 180px; }
.photo-count-3 { grid-template-columns: 1fr 1fr 1fr; }
.photo-count-3 .card-photo { height: 140px; }
.photo-count-4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
.photo-count-4 .card-photo { height: 120px; }
.card-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: transform 0.4s ease;
}
.card-photo:hover { transform: scale(1.03); }
.photo-more {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: rgba(17, 24, 39, 0.7);
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

/* 置顶/热议标记 */
.card-mark {
  position: absolute;
  top: 16px;
  right: 16px;
}

.mark-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 5px;
}

.mark-badge.pinned {
  background: var(--brand-primary);
  color: #fff;
}

.mark-badge.hot {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

/* 卡片头部 */
.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding-right: 60px;
}

.head-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.head-author {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.2px;
}

.head-time {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.3px;
}

.type-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 6px;
  flex-shrink: 0;
}

.type-badge.moment {
  background: #f0f7ff;
  color: var(--brand-primary);
}

.type-badge.capsule {
  background: linear-gradient(135deg, #0052d9, #1890ff);
  color: #fff;
}

/* 卡片正文 */
.card-body {
  margin-bottom: 16px;
}

.mood-line {
  margin-bottom: 12px;
}

.mood-emoji {
  font-size: 28px;
  line-height: 1;
}

.card-content {
  font-size: 15px;
  line-height: 1.8;
  color: #1f2937;
  margin: 0;
  letter-spacing: 0.1px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 话题标签 */
.card-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.topic-tag {
  font-size: 12px;
  color: var(--brand-primary);
  background: #f0f7ff;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.topic-tag:hover {
  background: var(--brand-primary);
  color: #fff;
}

/* 互动栏 */
.card-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.interact-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 500;
}

.interact-btn:hover {
  background: #f0f7ff;
  border-color: #d0e7ff;
  color: var(--brand-primary);
}

.interact-btn.liked {
  color: var(--brand-primary);
  background: #f0f7ff;
  border-color: #d0e7ff;
}

.interact-btn .el-icon {
  font-size: 15px;
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 80px 0 40px;
}

.empty-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
}

.empty-hint {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 28px;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--brand-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.22);
}

.empty-btn:hover {
  background: #0040b0;
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0, 82, 217, 0.3);
}

@media (max-width: 1100px) {
  .feed-column {
    order: 1;
  }
}

@media (max-width: 768px) {
  .feed-card {
    padding: 20px 18px;
    border-radius: 16px;
  }
  .interact-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  .card-head {
    padding-right: 0;
  }
  .card-mark {
    position: static;
    margin-bottom: 10px;
  }
}
</style>
