<!-- 03 活动统计区块 · 编辑式数字排 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stats = computed(() => [
  { key: 'assessments', value: 12, label: t('profile.card.stats.assessments') },
  { key: 'counseling', value: 3, label: t('profile.card.stats.counseling') },
  { key: 'moments', value: 8, label: t('profile.card.stats.moments') },
  { key: 'favorites', value: 24, label: t('profile.card.stats.favorites') },
  { key: 'capsules', value: 5, label: t('profile.card.stats.capsules') }
])
</script>

<template>
  <section class="mag-section">
    <div class="sec-head">
      <span class="sec-num">03</span>
      <div class="sec-titles">
        <h2 class="sec-title">{{ t('profile.card.stats.title') }}</h2>
        <p class="sec-desc">{{ t('profile.card.stats.desc') }}</p>
      </div>
    </div>
    <div class="stats-row">
      <div v-for="(s, i) in stats" :key="s.key" class="stat-block">
        <span class="stat-index">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="stat-num">{{ s.value }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============ 杂志区块通用 ============ */
.mag-section {
  border-top: 1px solid var(--ink-200);
  padding: 48px 0 40px;
}

.sec-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: start;
  margin-bottom: 36px;
}

.sec-num {
  font-size: 28px;
  font-weight: 700;
  font-style: italic;
  color: var(--brand-primary);
  line-height: 1;
  padding-top: 2px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', STSong, serif;
}

.sec-titles {
  min-width: 0;
}

.sec-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: var(--ink-900);
  line-height: 1.2;
  letter-spacing: -0.3px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', STSong, serif;
}

.sec-desc {
  margin: 0;
  font-size: 14px;
  color: var(--ink-500);
  line-height: 1.6;
  max-width: 540px;
}

/* ============ 活动统计 ============ */
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
}

.stat-block {
  padding: 8px 28px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid var(--ink-200);
}

.stat-block:first-child {
  border-left: none;
  padding-left: 0;
}

.stat-index {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--ink-400);
  font-family: Georgia, serif;
  font-style: italic;
}

.stat-num {
  font-size: clamp(40px, 5vw, 56px);
  font-weight: 700;
  line-height: 1;
  color: var(--brand-primary);
  letter-spacing: -1px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', STSong, serif;
}

.stat-label {
  font-size: 13px;
  color: var(--ink-600);
  letter-spacing: 0.5px;
}

@media (width <= 1024px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }

  .stat-block:nth-child(4) {
    border-left: none;
    padding-left: 0;
  }
}

@media (width <= 768px) {
  .mag-section {
    padding: 36px 0 28px;
  }

  .sec-head {
    grid-template-columns: auto 1fr;
    gap: 16px;
    margin-bottom: 26px;
  }

  .sec-title {
    font-size: 22px;
  }

  .sec-num {
    font-size: 24px;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .stat-block {
    border-left: none;
    border-bottom: 1px solid var(--mist-075);
    padding: 16px 0;
    flex-direction: row;
    align-items: baseline;
    gap: 16px;
  }

  .stat-block:last-child {
    border-bottom: none;
  }

  .stat-index {
    width: 28px;
  }

  .stat-num {
    font-size: 38px;
  }

  .stat-label {
    margin-left: auto;
    text-align: right;
  }
}
</style>
