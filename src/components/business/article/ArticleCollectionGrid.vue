<!-- 专题合集（ArticleCenterView），数据自取 i18n；点击卡片上抛 select(title)，点击查看全部上抛 view-all -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Right } from '@element-plus/icons-vue'

const { tm } = useI18n()

const emit = defineEmits<{
  (e: 'select', title: string): void
  (e: 'view-all'): void
}>()

// 专题合集数据（标题与描述走 i18n，count 与 icon 为本地配置）
const collectionItems = computed(() => {
  const items = tm('article.collections.items') as Array<{ title: string; desc: string }>
  const meta = [
    { count: 12, icon: 'Sunny' },
    { count: 15, icon: 'Moon' },
    { count: 10, icon: 'EditPen' },
    { count: 8, icon: 'ChatLineRound' }
  ]
  return items.map((item, i) => ({
    title: item.title,
    desc: item.desc,
    ...meta[i]
  }))
})
</script>

<template>
  <div class="module-collections">
    <div class="module-header">
      <div class="header-left">
        <h3 class="module-title">{{ $t('article.collections.title') }}</h3>
        <span class="article-count">{{ $t('article.collections.sub') }}</span>
      </div>
      <button class="view-all-link" @click="emit('view-all')">
        {{ $t('article.collections.viewAll') }} <el-icon><Right /></el-icon>
      </button>
    </div>
    <div class="collection-grid">
      <div
        v-for="collection in collectionItems"
        :key="collection.title"
        class="collection-card"
        @click="emit('select', collection.title)"
      >
        <div class="collection-content">
          <div class="collection-top">
            <div class="collection-icon-wrapper">
              <el-icon><component :is="collection.icon" /></el-icon>
            </div>
            <span class="collection-count">{{ collection.count }} {{ $t('article.collections.countUnit') }}</span>
          </div>
          <h4 class="collection-title">{{ collection.title }}</h4>
          <p class="collection-desc">{{ collection.desc }}</p>
        </div>
        <div class="collection-footer">
          <span class="explore-text">{{ $t('article.collections.enter') }}</span>
          <el-icon class="arrow-icon"><Right /></el-icon>
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

/* ===== 专题合集 ===== */
.module-collections {
  margin-top: 88px;
  padding-top: 64px;
  border-top: 1px solid #eef2f6;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.collection-card {
  background: #ffffff;
  padding: 28px 24px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #eef2f6;
  position: relative;
  overflow: hidden;
}

.collection-card:hover {
  transform: translateY(-4px);
  border-color: #d0e7ff;
  box-shadow: 0 16px 32px -12px rgba(0, 82, 217, 0.12);
}

.collection-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collection-icon-wrapper {
  width: 44px;
  height: 44px;
  background: #f0f7ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: var(--brand-primary);
  transition: all 0.3s ease;
}

.collection-card:hover .collection-icon-wrapper {
  background: var(--brand-primary);
  color: white;
}

.collection-count {
  font-size: 0.72rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.collection-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.collection-desc {
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.collection-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  color: var(--brand-primary);
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.collection-card:hover .arrow-icon {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .module-title {
    font-size: 1.4rem;
  }
}
</style>
