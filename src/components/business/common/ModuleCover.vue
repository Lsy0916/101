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
  border-bottom: 1px solid var(--mist-050);
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
  color: var(--ink-500);
  font-weight: 600;
  text-transform: uppercase;
}

.module-cover .cover-no {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--ink-400);
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  padding: 4px 10px;
  border: 1px solid var(--ink-200);
}

.module-cover .cover-title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 800;
  color: var(--navy-950);
  margin: 0 0 12px;
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
  color: var(--ink-500);
  margin: 0 0 20px;
  line-height: 1.7;
  max-width: 640px;
}

.module-cover .cover-line {
  height: 1px;
  background: linear-gradient(to right, var(--brand-primary) 0, var(--brand-primary) 56px, var(--mist-050) 56px, var(--mist-050) 100%);
}
</style>
