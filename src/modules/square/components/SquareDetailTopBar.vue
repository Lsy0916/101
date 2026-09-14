<!-- 广场详情页 · 顶部返回栏 -->
<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'

defineProps<{
  type: string
  id: number
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <div class="top-bar">
    <button class="back-btn" @click="emit('back')">
      <el-icon><ArrowLeft /></el-icon>
      <span>{{ $t('square.detail.back') }}</span>
    </button>
    <span class="top-mark">
      <span class="type-mark" :class="type">{{ type === 'capsule' ? $t('square.list.capsuleBadge') : $t('square.list.momentBadge') }}</span>
      <span class="id-mark">No.{{ String(id).padStart(2, '0') }}</span>
    </span>
  </div>
</template>

<style scoped>
/* ===== 顶部返回栏 ===== */
.top-bar {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 40px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  border-bottom: 1px solid var(--mist-050);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: var(--ink-800);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s ease, transform 0.2s ease;
  font-family: inherit;
}

.back-btn:hover {
  color: var(--brand-primary);
  transform: translateX(-4px);
}

.back-btn .el-icon { font-size: 14px; }

.top-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  letter-spacing: 2px;
  color: var(--ink-400);
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
}

.type-mark {
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 10px;
}

.type-mark.moment {
  background: var(--brand-primary-faint);
  color: var(--brand-primary);
}

.type-mark.capsule {
  background: linear-gradient(135deg, var(--brand-primary), var(--color-info));
  color: white;
}

@media (width <= 768px) {
  .top-bar {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
