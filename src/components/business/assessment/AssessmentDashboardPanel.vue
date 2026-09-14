<!-- 成长看板面板（AssessmentCenterView dashboard tab）：侧栏导航 + 7 个内容区，可视化数据全部由 history 派生 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import {
  Check,
  MagicStick,
  QuestionFilled,
  Download,
  ArrowRight,
  Aim,
  TrophyBase,
  Histogram,
  Calendar,
  DataAnalysis,
  ArrowUpBold,
  ArrowDownBold,
  PieChart,
  Star,
  List,
  TrendCharts
} from '@element-plus/icons-vue'
import ModuleCover from '@/components/business/common/ModuleCover.vue'
import { getCategoryName } from './data'
import type { AssessmentRecord, ScaleInfo } from './types'

const props = defineProps<{
  history: AssessmentRecord[]
  scales: ScaleInfo[]
}>()

const emit = defineEmits<{
  (e: 'view', record: AssessmentRecord): void
  (e: 'open-scale', key: string): void
}>()

const { t } = useI18n()

const totalCompleted = computed(() => props.history.length)
const growthPoints = computed(() => props.history.length * 10)

// 测评天数（不同日期的数量）
const assessmentDays = computed(() => {
  const dates = new Set(props.history.map(h => h.date))
  return dates.size
})

// --- 成长看板侧边栏导航 ---
const activeDashboard = ref('overview')
const dashboardNav = [
  { key: 'overview', name: '数据概览', icon: DataAnalysis },
  { key: 'radar', name: '身心能量', icon: Aim },
  { key: 'trend', name: '情绪趋势', icon: TrendCharts },
  { key: 'distribution', name: '测评分布', icon: PieChart },
  { key: 'ai', name: 'AI 洞察', icon: MagicStick },
  { key: 'progress', name: '进步对比', icon: TrophyBase },
  { key: 'recommend', name: '智能推荐', icon: Star },
  { key: 'history', name: '历史足迹', icon: List }
]

// 平均分（归一化到 100）
const avgScore = computed(() => {
  const maxScores: Record<string, number> = { phq9: 27, gad7: 21, pss: 40, riasec: 18, mbti: 40 }
  const scored = props.history.filter(h => typeof h.score === 'number' && maxScores[h.scaleKey])
  if (scored.length === 0) return 0
  const sum = scored.reduce((acc, h) => acc + (h.score / maxScores[h.scaleKey]) * 100, 0)
  return Math.round(sum / scored.length)
})

// 最爱维度
const favoriteCategory = computed(() => {
  const catCount: Record<string, number> = {}
  props.history.forEach(h => {
    const scale = props.scales.find(s => s.key === h.scaleKey)
    if (scale) catCount[scale.category] = (catCount[scale.category] || 0) + 1
  })
  const sorted = Object.entries(catCount).sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return '尚未探索'
  return getCategoryName(sorted[0][0])
})

// 月度目标
const monthlyGoalTarget = 4
const monthlyGoal = computed(() => {
  const now = new Date()
  const monthRecords = props.history.filter(h => {
    const d = new Date(h.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  return {
    current: monthRecords.length,
    target: monthlyGoalTarget,
    percent: Math.min(100, Math.round((monthRecords.length / monthlyGoalTarget) * 100))
  }
})

// --- 身心能量雷达图 ---
const radarLabels = ['情绪调节', '压力耐受', '职业驱动', '思维深度', '社交能量', '自我认知']

function getRadarPoints(radius: number) {
  return Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60 - 90) * Math.PI / 180
    return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`
  }).join(' ')
}

const radarDataPoints = computed(() => {
  const base = [60, 60, 50, 50, 60, 70]
  if (props.history.length > 0) {
    props.history.forEach(h => {
      if (h.scaleKey === 'phq9') base[0] = Math.min(95, 100 - h.score * 3)
      if (h.scaleKey === 'pss') base[1] = Math.min(95, 100 - h.score * 2)
      if (h.scaleKey === 'riasec') base[2] = 85
      if (h.scaleKey === 'mbti') base[5] = 90
    })
  }
  return base.map((val, i) => {
    const angle = (i * 60 - 90) * Math.PI / 180
    const r = (val / 100) * 80
    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
  }).join(' ')
})

// 群体均值（mock）
const radarAvgPoints = computed(() => {
  const avg = [55, 58, 52, 50, 55, 58]
  return avg.map((val, i) => {
    const angle = (i * 60 - 90) * Math.PI / 180
    const r = (val / 100) * 80
    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
  }).join(' ')
})

// --- 情绪趋势 ---
const trendRange = ref('all') // '7d' | '30d' | 'all'

const trendData = computed(() => {
  let data = props.history.filter(h => h.scaleKey === 'phq9' || h.scaleKey === 'gad7')
  const now = new Date()
  if (trendRange.value === '7d') {
    const ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    data = data.filter(h => new Date(h.date) >= ago)
  } else if (trendRange.value === '30d') {
    const ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    data = data.filter(h => new Date(h.date) >= ago)
  }
  return data.slice(0, 10).reverse().map(h => ({
    date: dayjs(h.date).format('MM-DD'),
    phq: h.scaleKey === 'phq9' ? (h.score / 27) * 100 : 0,
    gad: h.scaleKey === 'gad7' ? (h.score / 21) * 100 : 0
  }))
})

// 趋势平均线
const trendAvgLine = computed(() => {
  const valid = trendData.value.filter(p => p.phq > 0 || p.gad > 0)
  if (valid.length === 0) return 0
  const sum = valid.reduce((acc, p) => acc + Math.max(p.phq, p.gad), 0)
  return Math.round(sum / valid.length)
})

// --- AI 洞察 ---
const aiInsights = computed(() => {
  if (props.history.length === 0) return { summary: '', strength: '', risk: '', suggestion: '' }
  const hasPsych = props.history.some(h => ['phq9', 'gad7'].includes(h.scaleKey))
  const hasCareer = props.history.some(h => ['riasec', 'mbti'].includes(h.scaleKey))

  let summary = "您近期完成了多个维度的测评，展现出较好的自我探索意识。"
  let strength = "具备良好的自我觉察力，愿意主动关注内心状态。"
  let risk = "目前数据点较少，建议持续测评以监测状态变化。"
  let suggestion = "建议保持每两周一次的测评频率，建立个人成长基线。"

  if (hasPsych && hasCareer) {
    summary = "您的探索覆盖了心理健康与生涯发展两大核心维度，呈现全面的自我认知图谱。"
    strength = "性格倾向与职业兴趣高度契合，具备清晰的自我定位能力。"
    risk = "在面临高压力时，情绪调节能力仍有提升空间，可能影响职业效能发挥。"
    suggestion = "建议结合情绪管理练习与职业规划，形成个性化的成长方案。"
  } else if (hasPsych) {
    summary = "您关注心理健康状态，展现了良好的自我关怀意识。"
    strength = "能够主动识别情绪信号，这是心理韧性的重要基础。"
    risk = "仅关注情绪维度可能忽略职业与认知层面的潜能。"
    suggestion = "建议补充生涯发展类测评，全面探索自我潜能。"
  } else if (hasCareer) {
    summary = "您正在积极探索职业方向，展现了前瞻性的规划意识。"
    strength = "对职业兴趣与性格有清晰认知，有助于精准定位发展方向。"
    risk = "缺乏情绪状态基线数据，可能在压力下难以察觉情绪变化。"
    suggestion = "建议补充心理健康类测评，建立完整的自我认知图谱。"
  }

  return { summary, strength, risk, suggestion }
})

// --- 测评分布（环形图） ---
const categoryDistribution = computed(() => {
  const catCount: Record<string, number> = {}
  props.history.forEach(h => {
    const scale = props.scales.find(s => s.key === h.scaleKey)
    if (scale) {
      const name = getCategoryName(scale.category)
      catCount[name] = (catCount[name] || 0) + 1
    }
  })
  const colors = ['#0052d9', '#4d8bf5', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#6b7280']
  return Object.entries(catCount).map(([name, value], i) => ({
    name, value, color: colors[i % colors.length], percent: 0
  })).map(item => {
    const total = props.history.length
    return { ...item, percent: Math.round((item.value / total) * 100) }
  })
})

// 环形图 SVG 路径
const donutSegments = computed(() => {
  const data = categoryDistribution.value
  if (data.length === 0) return []
  const total = data.reduce((acc, d) => acc + d.value, 0)
  let cumulative = 0
  const radius = 70
  const cx = 90, cy = 90
  return data.map(d => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    cumulative += d.value
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0
    // 单段且占满时无法用 arc 绘制，需特殊处理
    if (data.length === 1 || (cumulative === total && d.value === total)) {
      return { ...d, path: '', isFull: true }
    }
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      isFull: false
    }
  })
})

// --- 进步对比（同量表历次分数变化） ---
const progressComparison = computed(() => {
  const grouped: Record<string, AssessmentRecord[]> = {}
  props.history.forEach(h => {
    if (!grouped[h.scaleKey]) grouped[h.scaleKey] = []
    grouped[h.scaleKey].push(h)
  })
  const comparisons: {
    scaleName: string
    scaleKey: string
    prevScore: number
    currScore: number
    diff: number
    trend: string
    date: string
    isLowerBetter: boolean
  }[] = []
  Object.entries(grouped).forEach(([key, records]) => {
    if (records.length >= 2) {
      const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const prev = sorted[sorted.length - 2]
      const curr = sorted[sorted.length - 1]
      const diff = curr.score - prev.score
      comparisons.push({
        scaleName: curr.scaleName,
        scaleKey: key,
        prevScore: prev.score,
        currScore: curr.score,
        diff,
        trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
        date: curr.date,
        isLowerBetter: ['phq9', 'gad7', 'pss', 'sas'].includes(key) // 分数越低越好
      })
    }
  })
  return comparisons
})

// --- 智能推荐 ---
const recommendations = computed(() => {
  const completedKeys = new Set(props.history.map(h => h.scaleKey))
  const recs = []
  if (completedKeys.has('phq9') && !completedKeys.has('gad7')) {
    recs.push({ key: 'gad7', reason: '完成焦虑测评，全面了解情绪状态' })
  }
  if (completedKeys.has('gad7') && !completedKeys.has('phq9')) {
    recs.push({ key: 'phq9', reason: '补充抑郁测评，建立情绪基线' })
  }
  if (completedKeys.has('riasec') && !completedKeys.has('mbti')) {
    recs.push({ key: 'mbti', reason: '结合性格类型，深化职业探索' })
  }
  if (completedKeys.has('mbti') && !completedKeys.has('riasec')) {
    recs.push({ key: 'riasec', reason: '探索职业兴趣，匹配性格倾向' })
  }
  // 补充未完成的可用测评
  if (recs.length < 3) {
    props.scales
      .filter(s => s.available && !completedKeys.has(s.key))
      .slice(0, 3 - recs.length)
      .forEach(s => {
        recs.push({ key: s.key, reason: '尝试新的测评维度，拓展自我认知' })
      })
  }
  return recs.slice(0, 3).map(rec => ({
    ...rec,
    scale: props.scales.find(s => s.key === rec.key)
  }))
})

// --- 历史足迹 ---
const historyFilter = ref('all')
const historyFilterOptions = computed(() => {
  const opts = [{ key: 'all', label: t('assessment.history.allScales') }]
  const doneKeys = [...new Set(props.history.map(h => h.scaleKey))]
  doneKeys.forEach(k => {
    const scale = props.scales.find(s => s.key === k)
    if (scale) opts.push({ key: k, label: scale.name })
  })
  return opts
})
const filteredHistory = computed(() => {
  if (historyFilter.value === 'all') return props.history
  return props.history.filter(h => h.scaleKey === historyFilter.value)
})

// 导出 CSV
function exportHistory() {
  if (props.history.length === 0) {
    ElMessage.warning(t('assessment.history.noExport'))
    return
  }
  const headers = [
    t('assessment.history.csvHeaders.date'),
    t('assessment.history.csvHeaders.scale'),
    t('assessment.history.csvHeaders.score'),
    t('assessment.history.csvHeaders.level'),
    t('assessment.history.csvHeaders.title')
  ]
  const rows = props.history.map(h => [h.date, h.scaleName, h.score, h.level, h.title])
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `assessment_history_${dayjs().format('YYYYMMDD')}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('assessment.history.exported'))
}
</script>

<template>
  <div class="dashboard-wrapper">
    <ModuleCover
      eyebrow="— Growth Dashboard"
      :no="`No.${String(totalCompleted).padStart(2, '0')}`"
      :title="$t('assessment.cover.dashboard.title')"
      :desc="$t('assessment.cover.dashboard.desc')"
    />
    <div v-reveal="{ delay: 80 }" class="dashboard-layout">
      <!-- 左侧导航 -->
      <aside class="dashboard-sidebar">
        <div
          v-for="item in dashboardNav"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeDashboard === item.key }"
          @click="activeDashboard = item.key"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.name }}</span>
        </div>
      </aside>

      <!-- 右侧内容 -->
      <div class="dashboard-content">
        <!-- 数据概览 -->
        <div v-show="activeDashboard === 'overview'" class="content-section">
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-icon"><el-icon><Check /></el-icon></div>
              <div class="kpi-info">
                <span class="kpi-value">{{ totalCompleted }}</span>
                <span class="kpi-label">{{ $t('assessment.dashboard.kpi.total') }}</span>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon"><el-icon><TrophyBase /></el-icon></div>
              <div class="kpi-info">
                <span class="kpi-value">{{ growthPoints }}</span>
                <span class="kpi-label">{{ $t('assessment.dashboard.kpi.points') }}</span>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon"><el-icon><Histogram /></el-icon></div>
              <div class="kpi-info">
                <span class="kpi-value">{{ avgScore }}</span>
                <span class="kpi-label">{{ $t('assessment.dashboard.kpi.avg') }}</span>
              </div>
            </div>
            <div class="kpi-card">
              <div class="kpi-icon"><el-icon><Calendar /></el-icon></div>
              <div class="kpi-info">
                <span class="kpi-value">{{ assessmentDays }}</span>
                <span class="kpi-label">{{ $t('assessment.dashboard.kpi.days') }}</span>
              </div>
            </div>
          </div>

          <div class="goal-banner">
            <div class="goal-info">
              <div class="goal-title"><el-icon><Aim /></el-icon> {{ $t('assessment.dashboard.monthlyGoal') }}</div>
              <div class="goal-desc">{{ $t('assessment.dashboard.goalDesc', { target: monthlyGoal.target, done: monthlyGoal.current, dim: favoriteCategory }) }}</div>
            </div>
            <div class="goal-progress-wrap">
              <div class="goal-progress-bar">
                <div class="goal-progress-fill" :style="{ width: monthlyGoal.percent + '%' }"></div>
              </div>
              <span class="goal-percent">{{ monthlyGoal.percent }}%</span>
            </div>
          </div>

          <div class="panel dashboard-card">
            <div class="card-header">
              <h3><el-icon><DataAnalysis /></el-icon> {{ $t('assessment.dashboard.quickEntry') }}</h3>
            </div>
            <div class="quick-entry-grid">
              <div v-for="item in dashboardNav.slice(1)" :key="item.key" class="quick-entry-item" @click="activeDashboard = item.key">
                <div class="quick-entry-icon"><el-icon><component :is="item.icon" /></el-icon></div>
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 身心能量 -->
        <div v-show="activeDashboard === 'radar'" class="content-section">
          <div class="panel dashboard-card">
            <div class="card-header">
              <h3>{{ $t('assessment.dashboard.radar') }}</h3>
              <el-tooltip :content="$t('assessment.dashboard.radarTip')">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <div class="radar-container radar-large">
              <svg viewBox="0 0 200 200" class="radar-svg">
                <polygon v-for="n in 5" :key="n" :points="getRadarPoints(n * 20)" class="radar-bg-poly" />
                <line
                  v-for="i in 6" :key="i" x1="100" y1="100"
                  :x2="100 + 80 * Math.cos((i * 60 - 90) * Math.PI / 180)"
                  :y2="100 + 80 * Math.sin((i * 60 - 90) * Math.PI / 180)" class="radar-axis" />
                <polygon :points="radarAvgPoints" class="radar-avg-poly" />
                <polygon :points="radarDataPoints" class="radar-data-poly" />
                <text
                  v-for="(label, i) in radarLabels" :key="i"
                  :x="100 + 95 * Math.cos((i * 60 - 90) * Math.PI / 180)"
                  :y="100 + 95 * Math.sin((i * 60 - 90) * Math.PI / 180)"
                  class="radar-label">{{ label }}</text>
              </svg>
            </div>
            <div class="radar-legend">
              <div class="legend-item"><span class="dot self"></span> {{ $t('assessment.dashboard.yourStatus') }}</div>
              <div class="legend-item"><span class="dot avg"></span> {{ $t('assessment.dashboard.groupAvg') }}</div>
            </div>
          </div>
        </div>

        <!-- 情绪趋势 -->
        <div v-show="activeDashboard === 'trend'" class="content-section">
          <div class="panel dashboard-card">
            <div class="card-header">
              <h3>{{ $t('assessment.dashboard.moodTrend') }}</h3>
              <div class="trend-controls">
                <div class="range-tabs">
                  <span :class="{ active: trendRange === '7d' }" @click="trendRange = '7d'">{{ $t('assessment.dashboard.range7') }}</span>
                  <span :class="{ active: trendRange === '30d' }" @click="trendRange = '30d'">{{ $t('assessment.dashboard.range30') }}</span>
                  <span :class="{ active: trendRange === 'all' }" @click="trendRange = 'all'">{{ $t('assessment.dashboard.rangeAll') }}</span>
                </div>
                <div class="chart-legend">
                  <span class="legend-dot phq"></span> PHQ-9
                  <span class="legend-dot gad"></span> GAD-7
                </div>
              </div>
            </div>
            <div class="trend-chart-container trend-large">
              <div class="y-axis">
                <span>{{ $t('assessment.dashboard.high') }}</span><span>{{ $t('assessment.dashboard.mid') }}</span><span>{{ $t('assessment.dashboard.low') }}</span>
              </div>
              <div class="chart-area">
                <div v-if="trendAvgLine > 0" class="avg-line" :style="{ bottom: trendAvgLine + '%' }">
                  <span class="avg-label">{{ $t('assessment.dashboard.avgLabel') }} {{ trendAvgLine }}%</span>
                </div>
                <div v-for="(point, idx) in trendData" :key="idx" class="trend-bar-group">
                  <div v-if="point.phq > 0" class="bar phq" :style="{ height: point.phq + '%' }"></div>
                  <div v-if="point.gad > 0" class="bar gad" :style="{ height: point.gad + '%' }"></div>
                  <div class="bar-date">{{ point.date }}</div>
                </div>
                <div v-if="trendData.length === 0" class="chart-empty">{{ $t('assessment.dashboard.noTrendData') }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 测评分布 -->
        <div v-show="activeDashboard === 'distribution'" class="content-section">
          <div class="panel dashboard-card">
            <div class="card-header">
              <h3><el-icon><PieChart /></el-icon> {{ $t('assessment.dashboard.typeDist') }}</h3>
            </div>
            <div v-if="categoryDistribution.length > 0" class="donut-wrapper donut-large">
              <svg viewBox="0 0 180 180" class="donut-svg donut-svg-large">
                <template v-for="(seg, i) in donutSegments" :key="i">
                  <path v-if="!seg.isFull" :d="seg.path" :fill="seg.color" opacity="0.85" />
                  <circle v-else cx="90" cy="90" r="70" :fill="seg.color" opacity="0.85" />
                </template>
                <text x="90" y="84" text-anchor="middle" class="donut-center-val">{{ totalCompleted }}</text>
                <text x="90" y="102" text-anchor="middle" class="donut-center-label">{{ $t('assessment.dashboard.totalLabel') }}</text>
              </svg>
              <div class="donut-legend">
                <div v-for="(d, i) in categoryDistribution" :key="i" class="donut-legend-item">
                  <span class="legend-dot" :style="{ background: d.color }"></span>
                  <span class="legend-name">{{ d.name }}</span>
                  <span class="legend-val">{{ d.value }} ({{ d.percent }}%)</span>
                </div>
              </div>
            </div>
            <div v-else class="chart-empty-state">
              <el-empty :description="$t('assessment.dashboard.distEmpty')" :image-size="80" />
            </div>
          </div>
        </div>

        <!-- AI 洞察 -->
        <div v-show="activeDashboard === 'ai'" class="content-section">
          <div class="panel dashboard-card ai-summary-card">
            <div class="ai-header">
              <div class="ai-icon"><el-icon><MagicStick /></el-icon></div>
              <h3>{{ $t('assessment.dashboard.aiInsight') }}</h3>
            </div>
            <div class="ai-body">
              <div v-if="history.length > 0" class="ai-insight-grid">
                <div class="insight-item">
                  <div class="i-title">{{ $t('assessment.dashboard.summary') }}</div>
                  <p>{{ aiInsights.summary }}</p>
                </div>
                <div class="insight-item insight-strength">
                  <div class="i-title">{{ $t('assessment.dashboard.strength') }}</div>
                  <p>{{ aiInsights.strength }}</p>
                </div>
                <div class="insight-item insight-risk">
                  <div class="i-title">{{ $t('assessment.dashboard.risk') }}</div>
                  <p>{{ aiInsights.risk }}</p>
                </div>
                <div class="insight-item insight-suggestion">
                  <div class="i-title">{{ $t('assessment.dashboard.suggestion') }}</div>
                  <p>{{ aiInsights.suggestion }}</p>
                </div>
              </div>
              <div v-else class="ai-empty">
                <p>{{ $t('assessment.dashboard.aiEmpty') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 进步对比 -->
        <div v-show="activeDashboard === 'progress'" class="content-section">
          <div class="panel dashboard-card">
            <div class="card-header">
              <h3><el-icon><TrendCharts /></el-icon> {{ $t('assessment.dashboard.progress') }}</h3>
            </div>
            <div v-if="progressComparison.length > 0" class="comparison-list">
              <div v-for="(cmp, idx) in progressComparison" :key="idx" class="comparison-item">
                <div class="cmp-info">
                  <div class="cmp-name">{{ cmp.scaleName }}</div>
                  <div class="cmp-date">{{ $t('assessment.dashboard.recent') }}{{ cmp.date }}</div>
                </div>
                <div class="cmp-scores">
                  <span class="cmp-prev">{{ cmp.prevScore }}</span>
                  <el-icon class="cmp-arrow" :class="cmp.trend">
                    <ArrowRight v-if="cmp.diff === 0" />
                    <ArrowUpBold v-else-if="(cmp.diff > 0 && !cmp.isLowerBetter) || (cmp.diff < 0 && cmp.isLowerBetter)" />
                    <ArrowDownBold v-else />
                  </el-icon>
                  <span class="cmp-curr">{{ cmp.currScore }}</span>
                  <span class="cmp-diff" :class="(cmp.isLowerBetter ? cmp.diff < 0 : cmp.diff > 0) ? 'good' : 'bad'">
                    {{ cmp.diff > 0 ? '+' : '' }}{{ cmp.diff }}
                  </span>
                </div>
                <div class="cmp-tag" :class="(cmp.isLowerBetter ? cmp.diff < 0 : cmp.diff > 0) ? 'good' : (cmp.diff === 0 ? 'stable' : 'bad')">
                  {{ cmp.isLowerBetter ? (cmp.diff < 0 ? $t('assessment.dashboard.improve') : cmp.diff > 0 ? $t('assessment.dashboard.attention') : $t('assessment.dashboard.flat')) : (cmp.diff > 0 ? $t('assessment.dashboard.up') : cmp.diff < 0 ? $t('assessment.dashboard.down') : $t('assessment.dashboard.flat')) }}
                </div>
              </div>
            </div>
            <div v-else class="chart-empty-state">
              <el-empty :description="$t('assessment.dashboard.progressEmpty')" :image-size="80" />
            </div>
          </div>
        </div>

        <!-- 智能推荐 -->
        <div v-show="activeDashboard === 'recommend'" class="content-section">
          <div class="panel dashboard-card recommend-card">
            <div class="card-header">
              <h3><el-icon><MagicStick /></el-icon> {{ $t('assessment.dashboard.recommend') }}</h3>
            </div>
            <div class="recommend-list">
              <div v-for="(rec, idx) in recommendations" :key="idx" class="recommend-item" @click="emit('open-scale', rec.key)">
                <div class="rec-icon" :class="'cat-' + (rec.scale?.category || '')">
                  <el-icon><component :is="rec.scale?.icon" /></el-icon>
                </div>
                <div class="rec-info">
                  <div class="rec-name">{{ rec.scale?.name }}</div>
                  <div class="rec-reason">{{ rec.reason }}</div>
                </div>
                <el-icon class="rec-arrow"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史足迹 -->
        <div v-show="activeDashboard === 'history'" class="content-section">
          <div class="panel dashboard-card">
            <div class="card-header">
              <h3><el-icon><List /></el-icon> {{ $t('assessment.dashboard.history') }}</h3>
              <div class="history-actions">
                <el-select v-model="historyFilter" size="small" class="history-filter" :placeholder="$t('assessment.dashboard.filterScale')">
                  <el-option v-for="opt in historyFilterOptions" :key="opt.key" :label="opt.label" :value="opt.key" />
                </el-select>
                <el-button link type="primary" @click="exportHistory">
                  <el-icon><Download /></el-icon> {{ $t('assessment.dashboard.exportCsv') }}
                </el-button>
              </div>
            </div>
            <div class="history-table-wrapper">
              <el-table :data="filteredHistory" stripe style="width: 100%" max-height="500">
                <el-table-column prop="date" :label="$t('assessment.dashboard.col.date')" width="120" />
                <el-table-column prop="scaleName" :label="$t('assessment.dashboard.col.scale')" />
                <el-table-column :label="$t('assessment.dashboard.col.score')" width="80">
                  <template #default="scope">{{ scope.row.score }}</template>
                </el-table-column>
                <el-table-column :label="$t('assessment.dashboard.col.conclusion')" width="120">
                  <template #default="scope">
                    <el-tag :type="scope.row.levelTag" size="small">{{ scope.row.level }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('assessment.dashboard.col.action')" width="80">
                  <template #default="scope">
                    <el-button link type="primary" @click="emit('view', scope.row)">{{ $t('assessment.dashboard.detail') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div v-if="history.length === 0" class="history-empty">{{ $t('assessment.dashboard.noHistory') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 面板基础 */
.panel {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #eef2f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  height: 100%;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* 看板 */
.dashboard-wrapper {
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-card {
  margin-bottom: 24px;
  border-radius: 6px;
  transition: box-shadow 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: 0 6px 18px rgba(10, 15, 26, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eef2f6;
}

.card-header h3 {
  font-size: 15px;
  color: #0a0f1a;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.1px;
}

.card-header h3 .el-icon {
  color: var(--brand-primary);
  font-size: 16px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #777;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 4px;
}

.legend-dot.phq { background: var(--brand-primary); }
.legend-dot.gad { background: #c3cad4; }

/* 雷达图 */
.radar-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.radar-svg {
  width: 100%;
  height: 100%;
}

.radar-bg-poly {
  fill: none;
  stroke: #eee;
  stroke-width: 1;
  stroke-dasharray: 4;
}

.radar-axis {
  stroke: #eee;
  stroke-width: 1;
}

.radar-avg-poly {
  fill: rgba(153, 153, 153, 0.08);
  stroke: #bbb;
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
  stroke-linejoin: round;
}

.radar-data-poly {
  fill: rgba(0, 82, 217, 0.15);
  stroke: var(--brand-primary);
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.radar-label {
  font-size: 11px;
  fill: #888;
  font-weight: 600;
  text-anchor: middle;
}

.radar-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
}

.legend-item .dot.self {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: var(--brand-primary);
}

.legend-item .dot.avg {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: transparent;
  border: 1px dashed #999;
}

/* AI 卡片 */
.ai-summary-card {
  background: #fff;
  border: 1px solid #eef2f6;
  position: relative;
  overflow: hidden;
}

.ai-summary-card::after {
  content: 'AI';
  position: absolute;
  top: -16px;
  right: -8px;
  font-size: 7rem;
  font-weight: 900;
  color: rgba(17, 17, 17, 0.03);
  pointer-events: none;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.ai-icon {
  width: 36px;
  height: 36px;
  background: #0a0f1a;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
}

.ai-header h3 {
  margin: 0;
  color: #0a0f1a;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.1px;
}

.i-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.i-title::before {
  content: '';
  width: 3px;
  height: 12px;
  background: var(--brand-primary);
  border-radius: 2px;
}

.insight-item.insight-strength .i-title::before { background: #10b981; }
.insight-item.insight-risk .i-title::before { background: #f59e0b; }
.insight-item.insight-suggestion .i-title::before { background: #7c3aed; }

.insight-item p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.ai-empty p {
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  margin: 0;
}

/* 趋势图 */
.trend-chart-container {
  display: flex;
  height: 220px;
  gap: 16px;
  padding: 16px 8px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #aaa;
  font-size: 11px;
  width: 20px;
  font-weight: 600;
}

.chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  border-bottom: 1px solid #eef2f6;
  padding-bottom: 28px;
  position: relative;
}

.trend-bar-group {
  display: flex;
  gap: 5px;
  align-items: flex-end;
  position: relative;
}

.bar {
  width: 12px;
  border-radius: 2px 2px 0 0;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bar.phq { background: var(--brand-primary); }
.bar.gad { background: #c3cad4; }

.bar-date {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  font-weight: 500;
}

.chart-empty {
  width: 100%;
  text-align: center;
  color: #aaa;
  font-size: 13px;
  align-self: center;
}

/* 历史表格 */
.history-table-wrapper {
  margin-top: 4px;
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
  --el-table-header-bg-color: #f8fafc;
  --el-table-tr-bg-color: transparent;
  --el-table-border-color: #eef2f6;
}

:deep(.el-table th.el-table__cell) {
  font-weight: 700;
  color: #1e293b;
  font-size: 13px;
}

:deep(.el-table .el-tag) {
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.history-empty {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  padding: 32px 0;
}

/* KPI 摘要栏 · 编辑式数据条 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 24px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 6px;
  overflow: hidden;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: transparent;
  border: none;
  border-left: 1px solid #eef2f6;
  border-radius: 0;
  padding: 22px 24px;
  transition: background 0.25s ease;
}

.kpi-card:first-child {
  border-left: none;
}

.kpi-card:hover {
  background: #fafbfc;
}

.kpi-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #f8fafc;
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.kpi-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-value {
  font-size: 30px;
  font-weight: 800;
  color: #0a0f1a;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.kpi-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 2px;
}

/* 月度目标横幅 · 编辑式 */
.goal-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 6px;
  padding: 22px 28px;
  color: inherit;
  margin-bottom: 24px;
  position: relative;
}

.goal-banner::before {
  content: '';
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  width: 2px;
  background: var(--brand-primary);
}

.goal-info {
  position: relative;
  z-index: 1;
}

.goal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #0a0f1a;
  margin-bottom: 8px;
}

.goal-title .el-icon {
  color: var(--brand-primary);
  font-size: 15px;
}

.goal-desc {
  font-size: 13px;
  color: #6b7280;
}

.goal-progress-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
  min-width: 240px;
}

.goal-progress-bar {
  flex: 1;
  height: 4px;
  background: #eef2f6;
  border-radius: 2px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: var(--brand-primary);
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.goal-percent {
  font-size: 26px;
  font-weight: 800;
  color: #0a0f1a;
  min-width: 58px;
  text-align: right;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

/* 环形图 */
.donut-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px 8px;
  min-height: 300px;
}

.donut-svg {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.donut-center-val {
  font-size: 26px;
  font-weight: 800;
  fill: #1e293b;
}

.donut-center-label {
  font-size: 11px;
  fill: #999;
  font-weight: 600;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.donut-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.donut-legend-item .legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.donut-legend-item .legend-name {
  color: #1e293b;
  font-weight: 600;
}

.donut-legend-item .legend-val {
  color: #6b7280;
  margin-left: auto;
  font-weight: 500;
}

.chart-empty-state {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

/* 趋势图增强 */
.trend-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.range-tabs {
  display: flex;
  gap: 16px;
  background: transparent;
  border-radius: 0;
  padding: 0;
}

.range-tabs span {
  padding: 4px 2px;
  font-size: 12px;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0;
  border-bottom: 1.5px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  font-weight: 500;
}

.range-tabs span:hover {
  color: #0a0f1a;
  border-bottom-color: #d0d5dd;
}

.range-tabs span.active {
  background: transparent;
  color: #0a0f1a;
  font-weight: 700;
  border-bottom-color: var(--brand-primary);
  box-shadow: none;
}

.avg-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #f59e0b;
  pointer-events: none;
  z-index: 1;
}

.avg-label {
  position: absolute;
  right: 4px;
  top: -15px;
  font-size: 10px;
  color: #b45309;
  font-weight: 700;
  background: transparent;
  padding: 0;
  border-radius: 0;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

/* 进步对比 · 编辑式数据行 */
.comparison-list {
  display: flex;
  flex-direction: column;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 4px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef2f6;
  border-radius: 0;
  transition: background 0.2s ease;
}

.comparison-item:first-child {
  border-top: 1px solid #eef2f6;
}

.comparison-item:hover {
  background: #fafbfc;
  border-color: #eef2f6;
  transform: none;
  box-shadow: none;
}

.cmp-info {
  flex: 1;
  min-width: 0;
}

.cmp-name {
  font-size: 14px;
  font-weight: 700;
  color: #0a0f1a;
  margin-bottom: 3px;
  letter-spacing: -0.1px;
}

.cmp-date {
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.cmp-scores {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cmp-prev {
  font-size: 15px;
  font-weight: 600;
  color: #c3cad4;
  font-variant-numeric: tabular-nums;
}

.cmp-arrow {
  font-size: 14px;
  color: #c3cad4;
}

.cmp-arrow.up { color: #059669; }
.cmp-arrow.down { color: #dc2626; }

.cmp-curr {
  font-size: 20px;
  font-weight: 800;
  color: #0a0f1a;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
}

.cmp-diff {
  font-size: 13px;
  font-weight: 700;
  padding: 0;
  border-radius: 0;
  font-variant-numeric: tabular-nums;
}

.cmp-diff.good {
  color: #059669;
  background: transparent;
}

.cmp-diff.bad {
  color: #dc2626;
  background: transparent;
}

.cmp-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 0;
  border-radius: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 1px;
}

.cmp-tag::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: currentColor;
}

.cmp-tag.good {
  color: #059669;
  background: transparent;
}

.cmp-tag.bad {
  color: #dc2626;
  background: transparent;
}

.cmp-tag.stable {
  color: #6b7280;
  background: transparent;
}

/* 智能推荐 */
.recommend-list {
  display: flex;
  flex-direction: column;
}

.recommend-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 15px 4px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef2f6;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.recommend-item:first-child {
  border-top: 1px solid #eef2f6;
}

.recommend-item:hover {
  background: #fafbfc;
  border-color: #eef2f6;
  transform: none;
  box-shadow: none;
}

.rec-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f8fafc;
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.recommend-item:hover .rec-icon {
  background: var(--brand-primary);
  color: #fff;
}

.rec-info {
  flex: 1;
  min-width: 0;
}

.rec-name {
  font-size: 14px;
  font-weight: 700;
  color: #0a0f1a;
  margin-bottom: 3px;
  letter-spacing: -0.1px;
  transition: color 0.2s ease;
}

.recommend-item:hover .rec-name {
  color: var(--brand-primary);
}

.rec-reason {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.rec-arrow {
  color: var(--brand-primary);
  font-size: 16px;
  transition: transform 0.3s ease;
}

.recommend-item:hover .rec-arrow {
  transform: translateX(4px);
}

/* 历史足迹增强 */
.history-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.history-filter) {
  width: 160px;
}

:deep(.history-filter .el-input__wrapper) {
  border-radius: 8px;
  background: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #eee;
}

:deep(.history-filter .el-input__wrapper:hover) {
  border-color: var(--brand-primary) !important;
}

/* 侧边栏导航布局 · 杂志目录式 */
.dashboard-layout {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.dashboard-sidebar {
  width: 208px;
  flex-shrink: 0;
  position: sticky;
  top: 16px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 6px;
  padding: 14px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: none;
  counter-reset: dashnav;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px 12px 16px;
  border-radius: 0;
  border-left: 2px solid transparent;
  cursor: pointer;
  font-size: 13.5px;
  color: #6b7280;
  font-weight: 500;
  counter-increment: dashnav;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  user-select: none;
}

.nav-item::before {
  content: counter(dashnav, decimal-leading-zero);
  font-size: 11px;
  font-weight: 600;
  color: #c3cad4;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
  min-width: 20px;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.nav-item .el-icon {
  display: none;
}

.nav-item:hover {
  background: #fafbfc;
  color: #0a0f1a;
}

.nav-item.active {
  background: transparent;
  color: #0a0f1a;
  font-weight: 700;
  border-left-color: var(--brand-primary);
  box-shadow: none;
}

.nav-item.active::before {
  color: var(--brand-primary);
  font-weight: 700;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
}

.content-section {
  animation: fadeInSection 0.35s ease;
}

@keyframes fadeInSection {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 快速入口 · 编辑式索引行 */
.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0 28px;
}

.quick-entry-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 15px 4px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef2f6;
  border-radius: 0;
  cursor: pointer;
  transition: color 0.2s ease;
  text-align: left;
}

.quick-entry-item::after {
  content: '→';
  margin-left: auto;
  font-size: 14px;
  color: var(--brand-primary);
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.25s ease;
}

.quick-entry-item:hover {
  background: transparent;
  border-color: #eef2f6;
  transform: none;
  box-shadow: none;
}

.quick-entry-item:hover::after {
  opacity: 1;
  transform: translateX(0);
}

.quick-entry-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f8fafc;
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.quick-entry-item:hover .quick-entry-icon {
  background: var(--brand-primary);
  color: #fff;
}

.quick-entry-item span {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  transition: color 0.2s ease;
}

.quick-entry-item:hover span {
  color: var(--brand-primary);
}

/* AI 洞察 2x2 网格 · 编辑式分栏 */
.ai-insight-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 32px;
}

.ai-insight-grid .insight-item {
  background: transparent;
  border: none;
  border-top: 1px solid #eef2f6;
  border-radius: 0;
  padding: 16px 2px 0;
  transition: border-color 0.25s ease;
}

.ai-insight-grid .insight-item:hover {
  border-color: #eef2f6;
  background: transparent;
  box-shadow: none;
}

/* 大尺寸图表容器 */
.radar-large {
  height: 420px !important;
}

.radar-large .radar-svg {
  max-width: 380px;
}

.trend-large {
  height: 320px !important;
}

.donut-large {
  min-height: 380px !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 24px 16px;
}

.donut-svg-large {
  width: 240px !important;
  height: 240px !important;
}

/* 成长看板响应式 */
@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .kpi-card { border-left: none; border-top: 1px solid #eef2f6; }
  .kpi-card:nth-child(-n+2) { border-top: none; }
  .kpi-card:nth-child(even) { border-left: 1px solid #eef2f6; }
  .ai-insight-grid { grid-template-columns: 1fr; }
  .donut-large { flex-direction: column !important; gap: 20px; }
}

@media (max-width: 900px) {
  .dashboard-layout { flex-direction: column; }
  .dashboard-sidebar {
    width: 100%;
    position: relative;
    top: 0;
    flex-direction: row;
    overflow-x: auto;
    padding: 4px;
    gap: 2px;
  }
  .nav-item {
    flex-shrink: 0;
    padding: 9px 14px;
    white-space: nowrap;
    border-left: none;
    border-bottom: 2px solid transparent;
  }
  .nav-item::before { display: none; }
  .nav-item.active { border-bottom-color: var(--brand-primary); }
  .quick-entry-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .kpi-card { border-left: none !important; border-top: 1px solid #eef2f6; }
  .kpi-card:first-child { border-top: none; }
  .goal-banner { flex-direction: column; align-items: flex-start; gap: 16px; }
  .goal-progress-wrap { width: 100%; min-width: 0; }
  .trend-controls { flex-direction: column; align-items: flex-start; gap: 8px; }
  .comparison-item { flex-wrap: wrap; }
  .history-actions { flex-direction: column; align-items: flex-end; }
  .radar-large { height: 320px !important; }
  .trend-large { height: 260px !important; }
  .donut-large { min-height: 300px !important; }
  .donut-svg-large { width: 180px !important; height: 180px !important; }
}
</style>
