<!-- 发布页 · 杂志编辑式标题区（含返回） -->
<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'back'): void
}>()
</script>

<template>
  <header class="page-header">
    <div class="header-back" @click="emit('back')">
      <el-icon><ArrowLeft /></el-icon>
      <span>{{ $t('square.create.back') }}</span>
    </div>
    <span class="header-eyebrow">{{ $t('square.create.eyebrow') }}</span>
    <h1 class="header-title" v-html="$t('square.create.title')"></h1>
    <p class="header-subtitle">{{ $t('square.create.subtitle') }}</p>
  </header>
</template>

<style scoped>
.page-header {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 56px 32px;
  position: relative;
  border-bottom: 1px solid #eef2f6;
  z-index: 1;
}

.header-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.header-back:hover {
  color: var(--brand-primary);
}

.header-eyebrow {
  display: block;
  font-size: 12px;
  letter-spacing: 3px;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.header-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  color: #111827;
  margin: 0 0 14px 0;
  letter-spacing: -2px;
  line-height: 1.02;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
  opacity: 0.85;
}

.header-subtitle {
  font-size: 13px;
  color: #6b7280;
  letter-spacing: 0.5px;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px 20px 20px;
  }
  .header-title {
    font-size: 36px;
    letter-spacing: -1px;
  }
}
</style>
