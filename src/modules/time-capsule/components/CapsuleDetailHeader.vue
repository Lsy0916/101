<template>
  <header class="page-header">
    <div class="header-back" @click="emit('back')">
      <el-icon><ArrowLeft /></el-icon>
      <span>{{ $t('capsule.detail.back') }}</span>
    </div>
    <span class="header-eyebrow">— Capsule Detail</span>
    <h1 class="header-title" v-html="$t('capsule.detail.title')"></h1>
  </header>
</template>

<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'

const emit = defineEmits<{ back: [] }>()
</script>

<style scoped>
.page-header {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 56px 32px;
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
  margin: 0;
  letter-spacing: -2px;
  line-height: 1.02;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
  opacity: 0.85;
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px 16px 20px;
  }

  .header-title {
    font-size: 36px;
    letter-spacing: -1px;
  }
}
</style>
