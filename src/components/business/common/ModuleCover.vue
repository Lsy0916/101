<!-- 模块封面 · 编辑式（eyebrow + 编号 + 标题 + 描述），title 支持 v-html（i18n 带 em 标签） -->
<script setup lang="ts">
defineProps<{
  eyebrow: string
  no: string
  title: string
  desc: string
}>()
</script>

<template>
  <div v-reveal class="module-cover">
    <div class="cover-top">
      <span class="cover-eyebrow">{{ eyebrow }}</span>
      <span class="cover-no">{{ no }}</span>
    </div>
    <h2 class="cover-title" v-html="title"></h2>
    <p class="cover-desc">{{ desc }}</p>
    <div class="cover-line"></div>
  </div>
</template>

<style scoped>
.module-cover {
  padding: 8px 0 32px;
  border-bottom: 1px solid #eef2f6;
  position: relative;
}
.module-cover .cover-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.module-cover .cover-eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}
.module-cover .cover-no {
  font-size: 12px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
}
.module-cover .cover-title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 12px 0;
  letter-spacing: -1.5px;
  line-height: 1.02;
}
.module-cover .cover-title :deep(em) {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
  opacity: 0.85;
}
.module-cover .cover-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
  line-height: 1.7;
  max-width: 640px;
}
.module-cover .cover-line {
  height: 1px;
  background: linear-gradient(to right, #0052d9 0, #0052d9 56px, #eef2f6 56px, #eef2f6 100%);
}
</style>
