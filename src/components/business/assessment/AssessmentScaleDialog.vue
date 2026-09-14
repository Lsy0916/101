<!-- 测评弹窗（AssessmentCenterView）：intro 介绍模式 / result 结果报告模式 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Timer, Collection, Star, InfoFilled, ArrowRight, Compass, Promotion } from '@element-plus/icons-vue'
import { getCategoryName, scaleList, scales } from './data'
import type { AssessmentRecord } from './types'

const props = defineProps<{
  visible: boolean
  mode: 'intro' | 'result'
  scaleKey: string
  result: AssessmentRecord | null
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'start'): void
  (e: 'download'): void
  (e: 'share'): void
}>()

const { t } = useI18n()

const dialogVisible = computed({
  get: () => props.visible,
  set: (val: boolean) => emit('update:visible', val)
})

// 介绍模式数据（来自量表定义与列表元信息）
const currentScale = computed(() => scales[props.scaleKey] || null)
const currentScaleInfo = computed(() => scaleList.find(s => s.key === props.scaleKey))

// 分数单位：MBTI 显示「类型」，其余显示「分」
const scoreUnit = computed(() => (props.result?.scaleKey === 'mbti' ? '类型' : t('assessment.unit.score')))

// MBTI 四维度条
const mbtiScores = computed(() => {
  if (!props.result || props.result.scaleKey !== 'mbti') return []
  const d = props.result.details
  const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]
  const names: Record<string, string> = { E: '外向', I: '内向', S: '实感', N: '直觉', T: '思考', F: '情感', J: '判断', P: '感知' }
  return pairs.map(p => {
    const leftVal = d[p[0]]
    const rightVal = d[p[1]]
    const total = leftVal + rightVal || 1
    const isLeft = leftVal >= rightVal
    return {
      left: names[p[0]],
      right: names[p[1]],
      percent: (Math.max(leftVal, rightVal) / total) * 100,
      isLeft
    }
  })
})

// RIASEC 六维度条
const riasecScores = computed(() => {
  if (!props.result || props.result.scaleKey !== 'riasec') return []
  const d = props.result.details
  const names: Record<string, string> = { R: '现实', I: '研究', A: '艺术', S: '社会', E: '企业', C: '常规' }
  const colors: Record<string, string> = { R: '#ef4444', I: '#3b82f6', A: '#8b5cf6', S: '#10b981', E: '#f59e0b', C: '#6b7280' }
  return Object.keys(names).map(k => ({ key: k, name: names[k], score: d[k], color: colors[k] }))
})

function getLevelColor(tag: string) {
  const map: Record<string, string> = { success: '#059669', info: '#0052d9', warning: '#d97706', danger: '#ef4444', primary: '#7c3aed' }
  return map[tag] || '#0052d9'
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="640px"
    class="scale-dialog"
    align-center
    :show-close="true"
  >
    <!-- 介绍模式 -->
    <div v-if="mode === 'intro' && currentScale" class="intro-content">
      <div class="intro-header">
        <div class="scale-type-tag" :class="'cat-' + currentScaleInfo?.category">
          {{ getCategoryName(currentScaleInfo?.category) }}
        </div>
        <h2>{{ currentScale.name }}</h2>
        <p class="scale-desc">{{ currentScale.description }}</p>
      </div>

      <div class="intro-details">
        <div class="detail-item">
          <el-icon><Timer /></el-icon>
          <div class="item-text">
            <span class="label">{{ $t('assessment.dialog.estimatedTime') }}</span>
            <span class="val">{{ currentScaleInfo?.duration }}</span>
          </div>
        </div>
        <div class="detail-item">
          <el-icon><Collection /></el-icon>
          <div class="item-text">
            <span class="label">{{ $t('assessment.dialog.questionCount') }}</span>
            <span class="val">{{ currentScaleInfo?.count }} {{ $t('assessment.unit.questions') }}</span>
          </div>
        </div>
        <div class="detail-item">
          <el-icon><Star /></el-icon>
          <div class="item-text">
            <span class="label">{{ $t('assessment.dialog.reliability') }}</span>
            <span class="val">{{ $t('assessment.dialog.reliabilityHigh') }}</span>
          </div>
        </div>
      </div>

      <div class="intro-tips">
        <h4><el-icon><InfoFilled /></el-icon> {{ $t('assessment.dialog.notice') }}</h4>
        <ul>
          <li>{{ $t('assessment.dialog.tip1') }}</li>
          <li>{{ $t('assessment.dialog.tip2') }}</li>
          <li>{{ $t('assessment.dialog.tip3') }}</li>
        </ul>
      </div>

      <div class="intro-actions">
        <button class="start-btn" @click="emit('start')">
          <span>{{ $t('assessment.dialog.start') }}</span>
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </div>

    <!-- 结果模式 -->
    <div v-else-if="mode === 'result' && result" class="result-content">
      <div class="result-summary-card">
        <div class="res-left">
          <div class="res-badge" :type="result?.levelTag">{{ result?.level }}</div>
          <h2>{{ result?.title }}</h2>
          <p class="res-date">{{ $t('assessment.dialog.completedOn', { date: result?.date }) }}</p>
        </div>
        <div class="res-right">
          <div class="res-score-circle" :style="{ borderColor: getLevelColor(result?.levelTag) }">
            <span class="score-val">{{ result?.score }}</span>
            <span class="score-unit">{{ scoreUnit }}</span>
          </div>
        </div>
      </div>

      <div class="result-body">
        <div class="insight-grid">
          <div class="insight-card">
            <h3><el-icon><Compass /></el-icon> {{ $t('assessment.dialog.deepAnalysis') }}</h3>
            <p>{{ result?.insight }}</p>
          </div>
          <div class="insight-card highlight">
            <h3><el-icon><Promotion /></el-icon> {{ $t('assessment.dialog.actionSuggestion') }}</h3>
            <p>{{ result?.suggestion }}</p>
          </div>
        </div>

        <div v-if="result?.scaleKey === 'mbti'" class="mbti-details">
          <h3>{{ $t('assessment.dialog.mbtiDim') }}</h3>
          <div class="mbti-bars">
            <div v-for="dim in mbtiScores" :key="dim.left" class="mbti-bar-item">
              <span class="dim-l">{{ dim.left }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: dim.percent + '%', left: dim.isLeft ? '0' : 'auto', right: dim.isLeft ? 'auto' : '0' }"></div>
              </div>
              <span class="dim-r">{{ dim.right }}</span>
            </div>
          </div>
        </div>

        <div v-if="result?.scaleKey === 'riasec'" class="riasec-details">
          <h3>{{ $t('assessment.dialog.riasecDim') }}</h3>
          <div class="riasec-bars">
            <div v-for="dim in riasecScores" :key="dim.key" class="r-bar-item">
              <div class="r-info">
                <span class="r-name">{{ dim.name }} ({{ dim.key }})</span>
                <span class="r-val">{{ dim.score }}</span>
              </div>
              <el-progress :percentage="(dim.score/15)*100" :color="dim.color" :show-text="false" />
            </div>
          </div>
        </div>
      </div>

      <div class="result-footer">
        <el-button @click="emit('start')">{{ $t('assessment.dialog.retake') }}</el-button>
        <el-button type="primary" @click="emit('download')">{{ $t('assessment.dialog.saveReport') }}</el-button>
        <el-button plain @click="emit('share')">{{ $t('assessment.dialog.share') }}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 弹窗 */
:deep(.scale-dialog) {
  border-radius: 24px;
  overflow: hidden;
}

:deep(.scale-dialog .el-dialog__header) {
  display: none;
}

:deep(.scale-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.scale-dialog .el-dialog__headerbtn) {
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 32px;
  height: 32px;
  background: color-mix(in srgb, black 5%, transparent);
  border-radius: 50%;
}

/* 介绍模式 */
.intro-content {
  padding: 40px 36px 32px;
}

.intro-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.intro-header::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--brand-primary);
  border-radius: 2px;
}

.scale-type-tag {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  background: var(--brand-primary-faint);
  color: var(--slate-800);
  letter-spacing: 0.5px;
}

.intro-header h2 {
  font-size: 26px;
  color: var(--slate-800);
  margin: 0 0 12px;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.scale-desc {
  color: var(--neutral-500);
  font-size: 14px;
  line-height: 1.7;
  margin: 0 auto;
  max-width: 440px;
}

.intro-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 26px;
}

.detail-item {
  padding: 20px 12px;
  background: var(--slate-50);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--mist-050);
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: var(--brand-primary-faint);
  border-color: var(--brand-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px -6px color-mix(in srgb, var(--brand-primary) 15%, transparent);
}

.detail-item .el-icon {
  font-size: 22px;
  color: var(--brand-primary);
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: center;
}

.item-text .label {
  font-size: 11px;
  color: var(--neutral-400);
  letter-spacing: 0.3px;
}

.item-text .val {
  font-size: 15px;
  font-weight: 700;
  color: var(--slate-800);
}

.intro-tips {
  text-align: left;
  background: linear-gradient(135deg, var(--brand-primary-faint) 0%, var(--brand-primary-wash) 100%);
  padding: 20px 22px;
  border-radius: 14px;
  border: 1px solid var(--brand-primary-soft);
  margin-bottom: 28px;
}

.intro-tips h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--slate-800);
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.intro-tips h4 .el-icon {
  color: var(--neutral-700);
}

.intro-tips ul {
  padding-left: 20px;
  color: var(--neutral-600);
  margin: 0;
}

.intro-tips li {
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 1.7;
}

.intro-actions {
  text-align: center;
}

.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 40px;
  background: var(--brand-primary);
  color: white;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-shadow: 0 8px 22px -6px color-mix(in srgb, black 30%, transparent);
  letter-spacing: 0.5px;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px -8px color-mix(in srgb, black 35%, transparent);
  background: var(--brand-primary-deeper);
}

.start-btn .el-icon {
  transition: transform 0.3s ease;
}

.start-btn:hover .el-icon {
  transform: translateX(4px);
}

/* 结果报告 */
.result-content {
  padding: 32px;
}

.result-summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--brand-primary-faint) 0%, var(--brand-primary-wash) 100%);
  padding: 28px;
  border-radius: 18px;
  margin-bottom: 24px;
  border: 1px solid var(--brand-primary-soft);
  position: relative;
  overflow: hidden;
}

.result-summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--brand-primary);
}

.res-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 12px;
}

.res-badge[type="success"] { background: #dcfce7; color: var(--success-600); } /* stylelint-disable-line color-no-hex, function-allowed-list */
.res-badge[type="info"] { background: var(--blue-100); color: var(--brand-primary); }
.res-badge[type="warning"] { background: var(--warning-100); color: var(--warning-600); }
.res-badge[type="danger"] { background: var(--danger-100); color: var(--danger-500); }
.res-badge[type="primary"] { background: var(--violet-100); color: var(--violet-600); }

.res-left h2 {
  font-size: 22px;
  color: var(--slate-800);
  margin: 0 0 6px;
  font-weight: 700;
}

.res-date {
  font-size: 12px;
  color: var(--neutral-400);
  font-weight: 500;
  margin: 0;
}

.res-score-circle {
  width: 100px;
  height: 100px;
  border: 5px solid var(--brand-primary);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  box-shadow: 0 8px 20px color-mix(in srgb, black 6%, transparent);
}

.score-val {
  font-size: 30px;
  font-weight: 800;
  color: var(--slate-800);
  line-height: 1;
}

.score-unit {
  font-size: 11px;
  color: var(--neutral-400);
  margin-top: 4px;
  font-weight: 600;
}

.insight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 22px;
}

.insight-card {
  padding: 22px;
  border-radius: 16px;
  border: 1px solid var(--mist-050);
  background: white;
}

.insight-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  margin: 0 0 12px;
  color: var(--slate-800);
  font-weight: 700;
}

.insight-card p {
  color: var(--neutral-700);
  line-height: 1.7;
  font-size: 13px;
  margin: 0;
}

.insight-card.highlight {
  background: var(--brand-primary-wash);
  border-color: var(--brand-primary-soft);
}

.mbti-details h3,
.riasec-details h3 {
  font-size: 15px;
  color: var(--slate-800);
  font-weight: 700;
  margin: 0 0 14px;
}

.mbti-bars {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: var(--slate-50);
  padding: 22px;
  border-radius: 16px;
  border: 1px solid var(--mist-050);
}

.mbti-bar-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dim-l, .dim-r {
  width: 36px;
  font-weight: 700;
  color: var(--slate-800);
  font-size: 13px;
}

.dim-l { text-align: right; }

.bar-track {
  flex: 1;
  height: 11px;
  background: var(--neutral-150);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(to right, var(--brand-primary), #4d8bf5); /* stylelint-disable-line color-no-hex, function-allowed-list */
  border-radius: 6px;
  transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.riasec-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--slate-50);
  padding: 22px;
  border-radius: 16px;
  border: 1px solid var(--mist-050);
}

.r-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #222; /* stylelint-disable-line color-no-hex, function-allowed-list */
}

.r-val {
  font-weight: 700;
  color: var(--slate-800);
}

:deep(.el-progress-bar__outer) {
  background-color: var(--neutral-150);
  border-radius: 6px;
  height: 10px !important;
}

:deep(.el-progress-bar__inner) {
  border-radius: 6px;
}

.result-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

:deep(.result-footer .el-button) {
  padding: 11px 24px;
  border-radius: 12px;
  font-weight: 600;
}

:deep(.result-footer .el-button--primary) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

:deep(.result-footer .el-button--primary:hover) {
  background: var(--brand-primary-deeper);
  border-color: var(--brand-primary-deeper);
}

@media (width <= 768px) {
  .insight-grid { grid-template-columns: 1fr; }
  .intro-details { grid-template-columns: 1fr; }
  .result-summary-card { flex-direction: column; gap: 20px; text-align: center; }
  .intro-content, .result-content { padding: 24px 20px; }
}
</style>
