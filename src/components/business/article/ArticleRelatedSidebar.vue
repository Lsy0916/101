<!-- 相关推荐侧栏（ArticleDetailView 右栏，sticky），点击卡片上抛 open(id) -->
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import type { ArticleItem } from './types'

defineProps<{
  related: ArticleItem[]
}>()

const emit = defineEmits<{
  (e: 'open', id: number): void
}>()
</script>

<template>
  <aside v-if="related.length > 0" class="related-sidebar">
    <div class="sidebar-header">
      <span class="sidebar-eyebrow">— Continue Reading</span>
      <h3 class="sidebar-title">相关<em>推荐</em></h3>
    </div>
    <div class="sidebar-list">
      <article
        v-for="(item, i) in related"
        :key="item.id"
        v-reveal="i * 80"
        class="sidebar-card"
        @click="emit('open', item.id)"
      >
        <span class="card-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <div class="card-body">
          <span class="card-cat">{{ item.categoryLabel }}</span>
          <h4 class="card-title">{{ item.title }}</h4>
          <span class="card-meta">{{ item.readTime }}</span>
        </div>
        <el-icon class="card-arrow"><ArrowRight /></el-icon>
      </article>
    </div>
  </aside>
</template>

<style scoped>
/* ===== 右侧推荐栏 ===== */
.related-sidebar {
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 8px;
  scroll-behavior: smooth;
}

.related-sidebar::-webkit-scrollbar {
  width: 4px;
}
.related-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.related-sidebar::-webkit-scrollbar-thumb {
  background: #d0e7ff;
  border-radius: 2px;
}
.related-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--brand-primary);
}

.sidebar-header {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eef2f6;
}

.sidebar-eyebrow {
  display: block;
  font-size: 11px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.sidebar-title {
  font-size: 24px;
  font-weight: 900;
  color: #0a0f1a;
  letter-spacing: -1px;
  margin: 0;
}
.sidebar-title em {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.sidebar-card:hover {
  background: #f8fbff;
  border-color: #d0e7ff;
  transform: translateX(4px);
}

.sidebar-card:hover .card-arrow {
  color: var(--brand-primary);
  transform: translateX(2px);
}

.card-num {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  margin-top: 2px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.card-cat {
  font-size: 9px;
  letter-spacing: 1.5px;
  color: var(--brand-primary);
  font-weight: 700;
  text-transform: uppercase;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.45;
  letter-spacing: -0.2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
}

.card-arrow {
  font-size: 14px;
  color: #d0d5db;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

@media (max-width: 992px) {
  .related-sidebar {
    position: static;
  }
}
</style>
