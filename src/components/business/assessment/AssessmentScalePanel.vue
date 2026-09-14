<!-- 测评广场面板（AssessmentCenterView scales tab 内容区）：分类导航 + 搜索 + 行列表 -->
<script setup lang="ts">
import { Search, Timer, Collection, ArrowRight, InfoFilled } from '@element-plus/icons-vue'
import type { ScaleInfo } from './types'

defineProps<{
  categories: { key: string; name: string; count: number }[]
  activeCategory: string
  scales: ScaleInfo[]
  completedKeys: string[]
  searchQuery: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'update:activeCategory', key: string): void
  (e: 'select', scale: ScaleInfo): void
}>()
</script>

<template>
  <!-- 编号式分类导航 + 极简搜索 -->
  <div v-reveal="{ delay: 80 }" class="scale-ribbon">
    <div class="ribbon-cats">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="ribbon-cat"
        :class="{ active: activeCategory === cat.key }"
        @click="emit('update:activeCategory', cat.key)"
      >
        <span class="cat-name">{{ cat.name }}</span>
        <span class="cat-count">({{ cat.count }})</span>
      </button>
    </div>
    <div class="ribbon-search">
      <el-icon class="search-ico"><Search /></el-icon>
      <input
        :value="searchQuery"
        :placeholder="$t('assessment.searchPlaceholder')"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>

  <!-- 当前分类小标题 -->
  <div v-if="scales.length > 0" class="rows-heading">
    <span class="heading-name">{{ activeCategory === 'all' ? '全部测评' : categories.find(c => c.key === activeCategory)?.name }}</span>
    <span class="heading-line"></span>
    <span class="heading-count">{{ String(scales.length).padStart(2, '0') }} {{ $t('assessment.unit.items') }}</span>
  </div>

  <!-- 测评列表：横向编辑式行 -->
  <div v-if="scales.length > 0" class="scale-rows">
    <div
      v-for="(scale, i) in scales"
      :key="scale.key"
      class="scale-row"
      :class="{ 'is-completed': completedKeys.includes(scale.key), 'is-unavailable': !scale.available }"
      @click="emit('select', scale)"
    >
      <div class="row-number">
        <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
        <div class="row-icon" :class="'cat-' + scale.category">
          <el-icon><component :is="scale.icon" /></el-icon>
        </div>
      </div>
      <div class="row-main">
        <div class="row-title-wrap">
          <h3 class="row-title">{{ scale.name }}</h3>
          <span v-if="completedKeys.includes(scale.key)" class="row-status done">{{ $t('assessment.status.completed') }}</span>
          <span v-else-if="!scale.available" class="row-status soon">{{ $t('assessment.status.comingSoon') }}</span>
        </div>
        <p class="row-desc">{{ scale.desc }}</p>
        <div class="row-tags">
          <span v-for="tag in scale.tags" :key="tag" class="row-tag">{{ tag }}</span>
        </div>
      </div>
      <div class="row-meta">
        <span class="meta-item"><el-icon><Timer /></el-icon>{{ scale.duration }}</span>
        <span class="meta-item"><el-icon><Collection /></el-icon>{{ scale.count }}{{ $t('assessment.unit.questions') }}</span>
        <span class="meta-difficulty">{{ scale.difficulty }}</span>
        <el-icon class="row-arrow"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>

  <!-- 空状态 -->
  <div v-else class="filter-empty">
    <el-empty :description="$t('assessment.empty')" :image-size="80" />
  </div>

  <!-- 提示 -->
  <div class="footer-tip">
    <el-icon><InfoFilled /></el-icon>
    <span>{{ $t('assessment.disclaimer') }}</span>
  </div>
</template>

<style scoped>
/* 编号式分类导航 + 搜索 */
.scale-ribbon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 18px 0;
  border-top: 1px solid #0a0f1a;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.ribbon-cats {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 28px;
  flex: 1;
}

.ribbon-cat {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  font-family: inherit;
  transition: opacity 0.25s;
  opacity: 0.45;
}

.ribbon-cat:hover {
  opacity: 0.8;
}

.ribbon-cat.active {
  opacity: 1;
}

.ribbon-cat .cat-name {
  font-size: 15px;
  font-weight: 500;
  color: #0a0f1a;
  letter-spacing: 0.2px;
}

.ribbon-cat.active .cat-name {
  font-weight: 700;
}

.ribbon-cat .cat-count {
  font-size: 11px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  margin-left: 4px;
  opacity: 0.7;
}

.ribbon-cat.active .cat-count {
  color: var(--brand-primary);
  opacity: 1;
}

.ribbon-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #0a0f1a;
  padding: 4px 0;
  min-width: 200px;
}

.ribbon-search .search-ico {
  font-size: 15px;
  color: #6b7280;
}

.ribbon-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #0a0f1a;
  font-family: inherit;
  width: 100%;
  padding: 4px 0;
}

.ribbon-search input::placeholder {
  color: #9ca3af;
}

/* 当前分类小标题 */
.rows-heading {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 40px 0 20px;
}

.rows-heading .heading-name {
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
}

.rows-heading .heading-line {
  flex: 1;
  height: 1px;
  background: #eef2f6;
}

.rows-heading .heading-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}

/* 测评列表：杂志网格卡片 */
.scale-rows {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 0;
  border-top: 1px solid #eef2f6;
  border-left: 1px solid #eef2f6;
}

.scale-row {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px 24px 24px;
  border-right: 1px solid #eef2f6;
  border-bottom: 1px solid #eef2f6;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  background: #ffffff;
}

.scale-row:hover {
  background: #f8fbff;
  box-shadow: 0 12px 32px rgba(0, 82, 217, 0.1);
  z-index: 2;
}

.scale-row.is-completed .row-title {
  color: var(--brand-primary);
}

.scale-row.is-unavailable {
  opacity: 0.55;
}

.scale-row.is-unavailable:hover {
  opacity: 0.9;
  background: #fafafa;
}

.row-number {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row-number .num {
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 1.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.scale-row:hover .row-number .num {
  color: var(--brand-primary);
}

.row-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: 8px;
  background: #f8fafc;
  color: var(--brand-primary);
  transition: all 0.3s ease;
}

.row-icon.cat-mental { background: #f0f7ff; color: #0052d9; }
.row-icon.cat-career { background: #eef6ff; color: #1890ff; }
.row-icon.cat-cognitive { background: #f5f0ff; color: #6b5ce7; }
.row-icon.cat-esports { background: #fff0f6; color: #e84393; }
.row-icon.cat-learning { background: #f0fbf6; color: #00a878; }
.row-icon.cat-social { background: #fff7e6; color: #e8830c; }

.scale-row:hover .row-icon {
  transform: scale(1.08) rotate(-4deg);
}

.row-main {
  min-width: 0;
  flex: 1;
}

.row-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.row-title {
  font-size: 17px;
  font-weight: 700;
  color: #0a0f1a;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.2px;
}

.row-status {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.row-status.done {
  background: #0a0f1a;
  color: #fff;
}

.row-status.soon {
  background: transparent;
  color: #9ca3af;
  border: 1px dashed #d0d5dd;
}

.row-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.row-tag {
  font-size: 11px;
  color: #6b7280;
  padding: 2px 0;
  font-weight: 500;
}

.row-tag::before {
  content: '/ ';
  color: #d0d5dd;
}

.row-tag:first-child::before {
  content: '';
}

.row-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.row-meta .meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-variant-numeric: tabular-nums;
}

.row-meta .meta-item .el-icon {
  font-size: 13px;
}

.meta-difficulty {
  font-size: 11px;
  font-weight: 700;
  color: #0a0f1a;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.row-arrow {
  font-size: 16px;
  color: var(--brand-primary);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s ease;
}

.scale-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .scale-rows {
    grid-template-columns: 1fr;
  }
}

/* 空状态 */
.filter-empty {
  padding: 80px 0;
}

/* 提示 */
.footer-tip {
  margin-top: 48px;
  padding: 24px 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.6;
  border-top: 1px solid #eef2f6;
}

.footer-tip .el-icon {
  color: #6b7280;
  flex-shrink: 0;
  font-size: 14px;
}
</style>
