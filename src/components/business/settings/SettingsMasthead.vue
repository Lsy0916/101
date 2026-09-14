<!-- 设置页报头 · 编辑式 masthead + 目录索引 -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  sections: Array<{ id: string; label: string }>
  activeSection: string
}>()

const emit = defineEmits<{
  (e: 'navigate', id: string): void
}>()

const { t } = useI18n()
</script>

<template>
  <header class="masthead">
    <div class="masthead-col masthead-mark">
      <span class="vol-mark">№</span>
      <span class="vol-text">VOL. 2026</span>
      <span class="vol-sub">{{ t('settings.eyebrow') }}</span>
    </div>
    <div class="masthead-col masthead-title-block">
      <p class="masthead-eyebrow">{{ t('settings.eyebrow') }}</p>
      <h1 class="masthead-title" v-html="t('settings.title')"></h1>
      <p class="masthead-deck">{{ t('settings.desc') }}</p>
    </div>
    <div class="masthead-col masthead-toc">
      <p class="toc-label">Index</p>
      <ol class="toc-list">
        <li v-for="(sec, i) in sections" :key="sec.id">
          <a
            href="javascript:void(0)"
            class="toc-link"
            :class="{ active: activeSection === sec.id }"
            @click.prevent="emit('navigate', sec.id)"
          >
            <span class="toc-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="toc-text">{{ sec.label }}</span>
          </a>
        </li>
      </ol>
    </div>
  </header>
</template>

<style scoped>
/* ============ Masthead ============ */
.masthead {
  display: grid;
  grid-template-columns: 200px 1fr 220px;
  border-top: 4px solid var(--ink-900);
  border-bottom: 1px solid var(--ink-900);
  margin-top: 32px;
  margin-bottom: 56px;
}

.masthead-col {
  padding: 28px 24px;
  border-right: 1px solid var(--ink-200);
}

.masthead-col:last-child {
  border-right: none;
}

.masthead-mark {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.vol-mark {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
  color: var(--brand-primary);
}

.vol-text {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--ink-900);
}

.vol-sub {
  margin-top: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ink-500);
}

.masthead-title-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.masthead-eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--brand-primary);
}

.masthead-title {
  margin: 0 0 14px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 56px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -1.5px;
  color: var(--ink-900);
}

.masthead-title :deep(em) {
  font-style: italic;
  background: linear-gradient(135deg, var(--brand-primary), var(--color-info));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.masthead-deck {
  margin: 0;
  max-width: 540px;
  font-size: 15px;
  line-height: 1.65;
  color: var(--ink-600);
}

.masthead-toc {
  display: flex;
  flex-direction: column;
}

.toc-label {
  margin: 0 0 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ink-500);
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.toc-link {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 7px 0;
  text-decoration: none;
  color: var(--ink-700);
  font-size: 13px;
  border-bottom: 1px solid transparent;
  transition: color 0.2s;
}

.toc-link:hover {
  color: var(--brand-primary);
}

.toc-link.active {
  color: var(--brand-primary);
}

.toc-link.active .toc-num {
  color: var(--brand-primary);
}

.toc-num {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-400);
  min-width: 22px;
}

.toc-text {
  flex: 1;
}

@media (width <= 1024px) {
  .masthead {
    grid-template-columns: 1fr;
    margin-top: 24px;
    margin-bottom: 32px;
  }

  .masthead-col {
    border-right: none;
    border-bottom: 1px solid var(--ink-200);
    padding: 20px 0;
  }
  .masthead-col:last-child { border-bottom: none; }
  .masthead-toc { display: none; }
  .masthead-title { font-size: 40px; }
}

@media (width <= 768px) {
  .masthead-title { font-size: 32px; }
}
</style>
