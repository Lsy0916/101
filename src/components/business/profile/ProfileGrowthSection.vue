<!-- 04 成长足迹区块 · 概览 + 徽章墙 + 分年时间线 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { View } from '@element-plus/icons-vue'
import type { GrowthItem } from './types'

const emit = defineEmits<{
  (e: 'view-all'): void
}>()

const { t } = useI18n()

const growthTimeline = computed(() => [
  { type: 'milestone', kind: 'M', text: t('profile.card.growth.items.milestone') + ' · 100', date: '2025-06-20' },
  { type: 'assessment', kind: 'A', text: t('profile.card.growth.items.assessment') + ' · 抑郁自评量表', date: '2025-06-15' },
  { type: 'square', kind: 'S', text: t('profile.card.growth.items.square') + ' · 考前焦虑应对', date: '2025-06-08' },
  { type: 'comment', kind: 'C', text: t('profile.card.growth.items.comment') + ' · 时光胶囊', date: '2025-05-28' },
  { type: 'counseling', kind: 'C', text: t('profile.card.growth.items.counseling'), date: '2025-05-20' },
  { type: 'article', kind: 'F', text: t('profile.card.growth.items.article') + ' · 心理韧性', date: '2025-05-10' },
  { type: 'like', kind: 'L', text: t('profile.card.growth.items.like'), date: '2025-04-22' },
  { type: 'capsule', kind: 'T', text: t('profile.card.growth.items.capsule'), date: '2025-04-01' },
  { type: 'assessment', kind: 'A', text: t('profile.card.growth.items.assessment') + ' · MBTI', date: '2024-12-15' },
  { type: 'counseling', kind: 'C', text: t('profile.card.growth.items.counseling'), date: '2024-12-10' },
  { type: 'capsule', kind: 'T', text: t('profile.card.growth.items.capsule'), date: '2024-12-05' },
  { type: 'login', kind: 'L', text: t('profile.card.growth.items.login'), date: '2024-09-01' }
])

const growthSummary = computed(() => ({
  total: 48,
  activeDays: 127,
  streak: 12,
  badgeCount: 4
}))

const badges = computed(() => [
  { key: 'first', icon: 'badge-first', letter: 'I', name: t('profile.card.growth.badgeFirst'), desc: t('profile.card.growth.badgeFirstDesc'), earned: true },
  { key: 'explorer', icon: 'badge-explorer', letter: 'E', name: t('profile.card.growth.badgeExplorer'), desc: t('profile.card.growth.badgeExplorerDesc'), earned: true },
  { key: 'persistent', icon: 'badge-persistent', letter: 'P', name: t('profile.card.growth.badgePersistent'), desc: t('profile.card.growth.badgePersistentDesc'), earned: true },
  { key: 'collector', icon: 'badge-collector', letter: 'C', name: t('profile.card.growth.badgeCollector'), desc: t('profile.card.growth.badgeCollectorDesc'), earned: true }
])

const timelineGroups = computed(() => {
  const groups: Record<string, GrowthItem[]> = {}
  growthTimeline.value.forEach((item) => {
    const year = item.date.split('-')[0]
    if (!groups[year]) groups[year] = []
    groups[year].push(item)
  })
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({
      year: year === '2025' ? t('profile.card.growth.year2025') : t('profile.card.growth.year2024'),
      items: groups[year]
    }))
})
</script>

<template>
  <section class="mag-section">
    <div class="sec-head">
      <span class="sec-num">04</span>
      <div class="sec-titles">
        <h2 class="sec-title">{{ t('profile.card.growth.title') }}</h2>
        <p class="sec-desc">{{ t('profile.card.growth.desc') }}</p>
      </div>
      <button class="sec-toggle" @click="emit('view-all')">
        <el-icon><View /></el-icon>
        <span>{{ t('profile.card.growth.viewAll') }}</span>
      </button>
    </div>

    <!-- 成长概览 -->
    <div class="growth-summary">
      <div class="gs-header">
        <span class="gs-label">{{ t('profile.card.growth.summary') }}</span>
        <span class="gs-line"></span>
      </div>
      <div class="gs-stats">
        <div class="gs-stat">
          <span class="gs-num">{{ growthSummary.total }}</span>
          <span class="gs-key">{{ t('profile.card.growth.totalActivities') }}</span>
        </div>
        <div class="gs-stat">
          <span class="gs-num">{{ growthSummary.activeDays }}</span>
          <span class="gs-key">{{ t('profile.card.growth.activeDays') }}</span>
        </div>
        <div class="gs-stat">
          <span class="gs-num">{{ growthSummary.streak }}</span>
          <span class="gs-key">{{ t('profile.card.growth.streak') }}</span>
        </div>
        <div class="gs-stat">
          <span class="gs-num">{{ growthSummary.badgeCount }}</span>
          <span class="gs-key">{{ t('profile.card.growth.badges') }}</span>
        </div>
      </div>
    </div>

    <!-- 徽章墙 -->
    <div class="badge-wall">
      <div
        v-for="badge in badges"
        :key="badge.key"
        class="badge-card"
        :class="{ earned: badge.earned }"
      >
        <span class="badge-icon" :class="badge.icon">{{ badge.letter }}</span>
        <div class="badge-info">
          <span class="badge-name">{{ badge.name }}</span>
          <span class="badge-desc">{{ badge.desc }}</span>
        </div>
      </div>
    </div>

    <!-- 时间线 -->
    <div class="timeline-groups">
      <div v-for="group in timelineGroups" :key="group.year" class="timeline-group">
        <div class="tg-year-mark">
          <span class="tg-year">{{ group.year }}</span>
          <span class="tg-rule"></span>
        </div>
        <ol class="timeline-list">
          <li v-for="(item, i) in group.items" :key="i" class="timeline-row">
            <span class="timeline-no">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="timeline-body">
              <span class="timeline-text">{{ item.text }}</span>
              <span class="timeline-date">{{ item.date }}</span>
            </div>
            <span class="timeline-kind" :class="item.type">{{ item.kind }}</span>
          </li>
        </ol>
      </div>
      <p class="timeline-end">{{ t('profile.card.growth.noMore') }}</p>
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

.sec-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--brand-primary);
  background: var(--brand-primary-faint);
  border: 1px solid var(--brand-primary-soft);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sec-toggle:hover {
  background: var(--brand-primary-soft);
}

/* ============ 成长足迹 ============ */
.growth-summary {
  margin-bottom: 36px;
}

.gs-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.gs-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ink-900);
  white-space: nowrap;
}

.gs-line {
  flex: 1;
  height: 1px;
  background: var(--ink-900);
}

.gs-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--ink-200);
  border-bottom: 1px solid var(--ink-200);
}

.gs-stat {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid var(--ink-200);
}

.gs-stat:last-child {
  border-right: none;
}

.gs-num {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
  line-height: 1;
  color: var(--brand-primary);
  letter-spacing: -1px;
}

.gs-key {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-500);
}

/* ============ 徽章墙 ============ */
.badge-wall {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.badge-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 16px;
  border: 1px solid var(--ink-200);
  transition: all 0.25s;
}

.badge-card.earned {
  border-color: var(--brand-primary-soft);
  background: linear-gradient(135deg, var(--brand-primary-faint) 0%, white 100%);
}

.badge-card.earned:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary) 10%, transparent);
  border-color: var(--brand-primary);
}

.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--ink-400);
  background: var(--ink-100);
  border: 1px solid var(--ink-200);
  border-radius: 50%;
  flex-shrink: 0;
}

.badge-card.earned .badge-icon {
  color: white;
  background: linear-gradient(135deg, var(--brand-primary), var(--color-info));
  border-color: transparent;
}

.badge-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.badge-name {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-800);
}

.badge-card.earned .badge-name {
  color: var(--brand-primary);
}

.badge-desc {
  font-size: 11px;
  color: var(--ink-400);
  line-height: 1.4;
}

/* ============ 时间线分组 ============ */
.timeline-groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-group {
  margin-bottom: 16px;
}

.tg-year-mark {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.tg-year {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 700;
  font-style: italic;
  color: var(--brand-primary);
  line-height: 1;
}

.tg-rule {
  flex: 1;
  height: 1px;
  background: var(--brand-primary-soft);
}

.timeline-end {
  text-align: center;
  font-size: 12px;
  font-style: italic;
  color: var(--ink-400);
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 20px 0 0;
  border-top: 1px solid var(--mist-075);
}

/* ============ 时间线列表 ============ */
.timeline-list {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: none;
}

.timeline-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid var(--mist-075);
  transition: background 0.2s;
}

.timeline-row:hover {
  background: var(--mist-025);
}

.timeline-no {
  font-size: 22px;
  font-weight: 700;
  font-style: italic;
  font-family: Georgia, serif;
  color: var(--brand-primary-soft);
  line-height: 1;
  width: 40px;
}

.timeline-row:hover .timeline-no {
  color: var(--brand-primary);
}

.timeline-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.timeline-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-800);
}

.timeline-date {
  font-size: 12px;
  color: var(--ink-400);
  letter-spacing: 1px;
}

.timeline-kind {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 12px;
  font-weight: 700;
  font-family: Georgia, serif;
  color: white;
  background: var(--brand-primary);
  border-radius: 50%;
}

.timeline-kind.counseling { background: var(--color-info); }
.timeline-kind.capsule { background: var(--purple-600); }
.timeline-kind.article { background: #fa8c16; } /* stylelint-disable-line color-no-hex, function-allowed-list */
.timeline-kind.milestone { background: var(--brand-primary); }
.timeline-kind.square { background: #13c2c2; } /* stylelint-disable-line color-no-hex, function-allowed-list */
.timeline-kind.comment { background: #eb2f96; } /* stylelint-disable-line color-no-hex, function-allowed-list */
.timeline-kind.like { background: #52c41a; } /* stylelint-disable-line color-no-hex, function-allowed-list */
.timeline-kind.login { background: var(--purple-600); }

@media (width <= 1024px) {
  .badge-wall {
    grid-template-columns: repeat(2, 1fr);
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

  .sec-toggle {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 4px;
  }

  .sec-title {
    font-size: 22px;
  }

  .sec-num {
    font-size: 24px;
  }

  .timeline-row {
    grid-template-columns: auto 1fr;
    gap: 16px;
    padding: 16px 0;
  }

  .timeline-kind {
    grid-column: 2;
    justify-self: start;
    margin-top: 6px;
  }

  .timeline-no {
    font-size: 18px;
    width: 32px;
  }

  .gs-stats {
    grid-template-columns: 1fr 1fr;
  }

  .gs-stat {
    padding: 18px 12px;
  }

  .gs-stat:nth-child(2) {
    border-right: none;
  }

  .gs-stat:nth-child(1), .gs-stat:nth-child(2) {
    border-bottom: 1px solid var(--ink-200);
  }

  .gs-num {
    font-size: 32px;
  }

  .badge-wall {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .badge-card {
    padding: 14px 12px;
  }

  .badge-icon {
    width: 36px;
    height: 36px;
    font-size: 15px;
  }

  .badge-name {
    font-size: 13px;
  }

  .badge-desc {
    font-size: 10px;
  }
}
</style>
