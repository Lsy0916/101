<!-- 我的面板（AssessmentCenterView mine tab）：个人信息数据栏 + 历史时间轴 + 勋章，成长数据从 history 派生 -->
<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Promotion, Clock, Medal } from '@element-plus/icons-vue'
import ModuleCover from '@/components/business/common/ModuleCover.vue'
import type { AssessmentRecord, ScaleInfo } from './types'

const props = defineProps<{
  history: AssessmentRecord[]
  scales: ScaleInfo[]
}>()

const emit = defineEmits<{
  (e: 'view', record: AssessmentRecord): void
  (e: 'retake', record: AssessmentRecord): void
  (e: 'clear-history'): void
  (e: 'go-assess'): void
}>()

// --- 成长数据（由历史记录派生） ---
const growthPoints = computed(() => props.history.length * 10)
const totalCompleted = computed(() => props.history.length)

// 历史记录按时间倒序
const sortedHistory = computed(() => {
  return [...props.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 加入日期（首次测评日期或默认）
const joinDate = computed(() => {
  if (props.history.length === 0) return '2024-09-01'
  const earliest = [...props.history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
  return earliest.date
})

// 测评天数（不同日期的数量）
const assessmentDays = computed(() => {
  const dates = new Set(props.history.map(h => h.date))
  return dates.size
})

// 成长状态文案
const growthStatus = computed(() => {
  const count = totalCompleted.value
  if (count === 0) return '即将启程'
  if (count < 3) return '初露锋芒'
  if (count < 6) return '稳步成长'
  if (count < 10) return '深度探索'
  return '自我大师'
})

// 用户等级（基于成长积分）
const userLevel = computed(() => {
  const p = growthPoints.value
  if (p >= 150) return 5
  if (p >= 100) return 4
  if (p >= 60) return 3
  if (p >= 30) return 2
  return 1
})

// 等级进度（当前等级内的百分比）
const levelProgress = computed(() => {
  const p = growthPoints.value
  const thresholds = [0, 30, 60, 100, 150]
  const lv = userLevel.value
  if (lv >= 5) return 100
  const current = thresholds[lv - 1]
  const next = thresholds[lv]
  return Math.min(100, Math.round(((p - current) / (next - current)) * 100))
})

// 距下一级所需积分
const pointsToNext = computed(() => {
  const p = growthPoints.value
  const thresholds = [0, 30, 60, 100, 150]
  const lv = userLevel.value
  if (lv >= 5) return 0
  return thresholds[lv] - p
})

// 勋章列表
const badges = computed(() => {
  const count = totalCompleted.value
  const categories_done = new Set(props.history.map(h => {
    const scale = props.scales.find(s => s.key === h.scaleKey)
    return scale?.category
  })).size
  const hasMental = props.history.some(h => {
    const s = props.scales.find(sc => sc.key === h.scaleKey)
    return s?.category === 'mental'
  })
  const hasCareer = props.history.some(h => {
    const s = props.scales.find(sc => sc.key === h.scaleKey)
    return s?.category === 'career'
  })

  return [
    { key: 'first', icon: '🌱', name: '初心萌芽', desc: '完成第一次测评', unlocked: count >= 1 },
    { key: 'multi', icon: '🔀', name: '多元探索', desc: '完成2种不同类型测评', unlocked: categories_done >= 2 },
    { key: 'mental', icon: '💚', name: '心理关怀', desc: '完成心理健康类测评', unlocked: hasMental },
    { key: 'career', icon: '🧭', name: '生涯启航', desc: '完成生涯发展类测评', unlocked: hasCareer },
    { key: 'depth', icon: '🔍', name: '深度探索', desc: '完成3次以上测评', unlocked: count >= 3 },
    { key: 'master', icon: '🏆', name: '自我大师', desc: '完成5次以上测评', unlocked: count >= 5 }
  ]
})

const unlockedBadges = computed(() => badges.value.filter(b => b.unlocked).length)
</script>

<template>
  <div class="mine-wrapper">
    <!-- 模块封面 · 编辑式 -->
    <ModuleCover
      eyebrow="— My Profile"
      :no="`No.${String(userLevel).padStart(2, '0')}`"
      :title="$t('assessment.cover.mine.title')"
      :desc="$t('assessment.cover.mine.desc')"
    />

    <!-- 个人信息 · 编辑式定义列表 -->
    <div v-reveal="{ delay: 80 }" class="profile-editorial">
      <div class="profile-stats">
        <div class="profile-stat">
          <span class="ps-num">{{ totalCompleted }}</span>
          <span class="ps-label">{{ $t('assessment.profile.completed') }}</span>
        </div>
        <div class="profile-divider"></div>
        <div class="profile-stat">
          <span class="ps-num">{{ growthPoints }}</span>
          <span class="ps-label">{{ $t('assessment.profile.growthPoints') }}</span>
        </div>
        <div class="profile-divider"></div>
        <div class="profile-stat">
          <span class="ps-num">{{ assessmentDays }}</span>
          <span class="ps-label">{{ $t('assessment.profile.assessmentDays') }}</span>
        </div>
        <div class="profile-divider"></div>
        <div class="profile-stat">
          <span class="ps-num">{{ unlockedBadges }}</span>
          <span class="ps-label">{{ $t('assessment.profile.badges') }}</span>
        </div>
        <div class="profile-divider"></div>
        <div class="profile-stat level">
          <span class="ps-num">Lv.{{ userLevel }}</span>
          <span class="ps-label">{{ $t('assessment.profile.growthLevel') }}</span>
        </div>
      </div>
      <div class="profile-meta-row">
        <span class="pm-item"><el-icon><Calendar /></el-icon> {{ $t('assessment.profile.joinedOn', { date: joinDate }) }}</span>
        <span class="pm-sep">·</span>
        <span class="pm-item"><el-icon><Promotion /></el-icon> {{ growthStatus }}</span>
        <span class="pm-sep">·</span>
        <span class="pm-item">{{ $t('assessment.profile.toNextLevel', { points: pointsToNext }) }}</span>
      </div>
      <div class="level-bar-wrap">
        <div class="level-bar-track">
          <div class="level-bar-fill" :style="{ width: levelProgress + '%' }"></div>
        </div>
        <span class="level-bar-pct">{{ levelProgress }}%</span>
      </div>
    </div>

    <!-- 历史测评时间轴 -->
    <div v-reveal class="history-section">
      <div class="section-header">
        <h3><el-icon><Clock /></el-icon> {{ $t('assessment.profile.historyTitle') }}</h3>
        <el-button v-if="history.length > 0" link type="primary" @click="emit('clear-history')">{{ $t('assessment.profile.clearHistory') }}</el-button>
      </div>
      <div v-if="history.length > 0" class="timeline">
        <div v-for="(record, idx) in sortedHistory" :key="idx" class="timeline-item">
          <div class="timeline-dot" :class="'dot-' + record.levelTag"></div>
          <div class="timeline-card">
            <div class="timeline-top">
              <span class="timeline-title">{{ record.scaleName }}</span>
              <span class="timeline-date"><el-icon><Clock /></el-icon> {{ record.date }}</span>
            </div>
            <div class="timeline-body">
              <el-tag :type="record.levelTag" size="small" effect="light" round>{{ record.level }}</el-tag>
              <span class="timeline-score">{{ record.score }}{{ $t('assessment.unit.score') }}</span>
              <span class="timeline-result-title">{{ record.title }}</span>
            </div>
            <div class="timeline-actions">
              <el-button size="small" type="primary" plain @click="emit('view', record)">{{ $t('assessment.profile.viewDetails') }}</el-button>
              <el-button size="small" plain @click="emit('retake', record)">{{ $t('assessment.profile.retake') }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <el-empty :description="$t('assessment.profile.historyEmpty')">
          <el-button type="primary" @click="emit('go-assess')">{{ $t('assessment.profile.goAssess') }}</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 我的勋章 -->
    <div v-reveal="{ delay: 100 }" class="badges-section">
      <div class="section-header">
        <h3><el-icon><Medal /></el-icon> {{ $t('assessment.profile.badgesTitle') }}</h3>
        <span class="badges-count">{{ unlockedBadges }}/{{ badges.length }} {{ $t('assessment.profile.unlocked') }}</span>
      </div>
      <div class="badges-grid">
        <div
          v-for="badge in badges"
          :key="badge.key"
          class="badge-card"
          :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }"
        >
          <div class="badge-icon">{{ badge.icon }}</div>
          <div class="badge-info">
            <div class="badge-name">{{ badge.name }}</div>
            <div class="badge-desc">{{ badge.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mine-wrapper {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding-top: 8px;
}

/* 个人信息 · 编辑式横向数据栏 */
.profile-editorial {
  padding: 28px 0 24px;
  border-bottom: 1px solid #eef2f6;
}
.profile-stats {
  display: flex;
  align-items: stretch;
  gap: 0;
  flex-wrap: wrap;
}
.profile-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 32px;
  flex: 1;
  min-width: 120px;
}
.profile-stat:first-child { padding-left: 0; }
.profile-stat.level .ps-num { color: var(--brand-primary); }
.ps-num {
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 800;
  color: #0a0f1a;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}
.ps-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.profile-divider {
  width: 1px;
  background: #eef2f6;
  align-self: stretch;
}

.profile-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  font-size: 13px;
  color: #6b7280;
}
.pm-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.2px;
}
.pm-item .el-icon { font-size: 13px; color: #9ca3af; }
.pm-sep { color: #d1d5db; }

.level-bar-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
}
.level-bar-track {
  flex: 1;
  height: 4px;
  background: #f1f5f9;
  border-radius: 0;
  overflow: hidden;
}
.level-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #0052d9, #1890ff);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.level-bar-pct {
  font-size: 12px;
  color: var(--brand-primary);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

/* 区块通用 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding: 0 4px;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.2px;
}

.section-header h3 .el-icon {
  color: var(--brand-primary);
}

.badges-count {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}

/* 时间轴 */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  padding-left: 8px;
}

.timeline-item {
  display: flex;
  gap: 18px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 24px;
  bottom: -16px;
  width: 2px;
  background: #eef2f6;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid #fff;
  flex-shrink: 0;
  margin-top: 18px;
  z-index: 1;
  box-shadow: 0 0 0 2px #eef2f6;
}

.timeline-dot.dot-success { background: #059669; box-shadow: 0 0 0 2px #d1fae5; }
.timeline-dot.dot-info { background: #0052d9; box-shadow: 0 0 0 2px #dbeafe; }
.timeline-dot.dot-warning { background: #d97706; box-shadow: 0 0 0 2px #fef3c7; }
.timeline-dot.dot-danger { background: #ef4444; box-shadow: 0 0 0 2px #fee2e2; }
.timeline-dot.dot-primary { background: #7c3aed; box-shadow: 0 0 0 2px #ede9fe; }

.timeline-card {
  flex: 1;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  padding: 18px 22px;
  transition: all 0.3s ease;
}

.timeline-card:hover {
  border-color: #d0e7ff;
  box-shadow: 0 6px 18px -6px rgba(0, 82, 217, 0.1);
  transform: translateX(4px);
}

.timeline-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.timeline-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.timeline-body {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.timeline-score {
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-primary);
}

.timeline-result-title {
  font-size: 13px;
  color: #6b7280;
}

.timeline-actions {
  display: flex;
  gap: 10px;
}

:deep(.timeline-actions .el-button) {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 48px 24px;
}

/* 勋章 */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.badge-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  padding: 18px 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.badge-card.unlocked {
  border-color: #d0e7ff;
  background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%);
}

.badge-card.unlocked:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px -8px rgba(0, 82, 217, 0.2);
}

.badge-card.locked {
  opacity: 0.55;
  background: #f8fafc;
}

.badge-card.locked .badge-icon {
  filter: grayscale(1);
}

.badge-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #eef2f6;
}

.badge-card.unlocked .badge-icon {
  border-color: #d0e7ff;
}

.badge-info {
  flex: 1;
  min-width: 0;
}

.badge-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3px;
}

.badge-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

/* 响应式 */
@media (max-width: 900px) {
  .badges-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .badges-grid { grid-template-columns: 1fr; }
}
</style>
