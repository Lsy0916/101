<!-- 广场列表页 · 社区侧边栏：活跃同学 / 热门话题 / 社区公约 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'
import { activeMembers, trendingTopics } from './data'

defineProps<{
  onlineCount: number
}>()

const { tm } = useI18n()

const guidelines = computed(() => tm('square.list.community.sidebar.guidelinesItems') as string[])

const filterByTopic = (tag: string) => {
  ElMessage.info('#' + tag)
}
</script>

<template>
  <aside class="sidebar-column">
    <!-- 活跃同学 -->
    <div class="sidebar-card">
      <div class="sidebar-head">
        <h4 class="sidebar-title">{{ $t('square.list.community.sidebar.activeMembers') }}</h4>
        <span class="online-dot">{{ onlineCount }} {{ $t('square.list.community.online') }}</span>
      </div>
      <div class="members-row">
        <div
          v-for="(member, i) in activeMembers"
          :key="i"
          class="member-avatar"
          :style="{ zIndex: activeMembers.length - i, marginLeft: i === 0 ? '0' : '-10px' }"
        >
          <BaseInitialAvatar :name="member.name" :size="36" :is-anonymous="member.isAnonymous" />
        </div>
        <span class="members-more">+{{ onlineCount - activeMembers.length }}</span>
      </div>
    </div>

    <!-- 热门话题 -->
    <div class="sidebar-card">
      <div class="sidebar-head">
        <h4 class="sidebar-title">{{ $t('square.list.community.sidebar.trending') }}</h4>
      </div>
      <div class="topic-cloud">
        <button
          v-for="topic in trendingTopics"
          :key="topic.tag"
          class="cloud-tag"
          @click="filterByTopic(topic.tag)"
        >
          <span class="cloud-hash">#</span>{{ topic.tag }}
          <span class="cloud-count">{{ topic.count }}</span>
        </button>
      </div>
    </div>

    <!-- 社区公约 -->
    <div class="sidebar-card guidelines-card">
      <div class="sidebar-head">
        <h4 class="sidebar-title">{{ $t('square.list.community.sidebar.guidelines') }}</h4>
      </div>
      <ol class="guidelines-list">
        <li v-for="(rule, i) in guidelines" :key="i" class="guideline-item">
          <span class="rule-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="rule-text">{{ rule }}</span>
        </li>
      </ol>
    </div>
  </aside>
</template>

<style scoped>
/* ===== 侧边栏 ===== */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 88px;
  align-self: start;
}

.sidebar-card {
  background: #f8fbff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 22px 24px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.sidebar-card:hover {
  border-color: #d0e7ff;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.06);
}

.sidebar-card.guidelines-card {
  background: rgba(0, 82, 217, 0.04);
  border-color: #d0e7ff;
}

.sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: 0.5px;
}

.online-dot {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #10b981;
  font-weight: 600;
}

.online-dot::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

/* 活跃同学 */
.members-row {
  display: flex;
  align-items: center;
}

.member-avatar {
  border-radius: 50%;
  border: 2px solid #fff;
  transition: transform 0.2s ease;
}

.member-avatar:hover {
  transform: translateY(-3px);
  z-index: 10 !important;
}

.members-more {
  margin-left: 12px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* 热门话题 */
.topic-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cloud-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f8fbff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  font-size: 12px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 500;
}

.cloud-tag:hover {
  background: #f0f7ff;
  border-color: #d0e7ff;
  color: var(--brand-primary);
  transform: translateY(-2px);
}

.cloud-hash {
  color: #9ca3af;
  font-weight: 700;
}

.cloud-tag:hover .cloud-hash {
  color: var(--brand-primary);
}

.cloud-count {
  font-size: 10px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  margin-left: 2px;
}

/* 社区公约 */
.guidelines-card {
  background: linear-gradient(160deg, #f8fbff 0%, #ffffff 100%);
}

.guidelines-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guideline-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.rule-num {
  font-size: 11px;
  font-weight: 800;
  color: var(--brand-primary);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  margin-top: 1px;
  letter-spacing: 0.5px;
}

.rule-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

@media (max-width: 1100px) {
  .sidebar-column {
    position: static;
    order: 2;
  }
}
</style>
