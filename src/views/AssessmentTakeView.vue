<template>
  <div class="immersive-assessment">
    <!-- 沉浸式顶栏 -->
    <header class="take-header">
      <div class="header-left">
        <button class="exit-btn" @click="confirmExit">
          <el-icon><Close /></el-icon>
          <span>退出</span>
        </button>
        <div class="divider"></div>
        <div class="scale-meta">
          <span class="scale-name">{{ currentScale?.name }}</span>
          <span class="scale-progress-text">{{ currentIndex + 1 }} / {{ currentScale?.questions.length }}</span>
        </div>
      </div>
      <div class="header-center">
        <div class="top-progress-track">
          <div class="top-progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="top-progress-pct">{{ progress }}%</span>
      </div>
      <div class="header-right">
        <div class="timer">
          <el-icon><Timer /></el-icon>
          <span>{{ formatTime(timeElapsed) }}</span>
        </div>
      </div>
    </header>

    <!-- 答题主体区 -->
    <main class="take-body">
      <!-- 装饰性大号背景编号 -->
      <span class="bg-question-num">Q{{ String(currentIndex + 1).padStart(2, '0') }}</span>
      <transition name="q-slide" mode="out-in">
        <div :key="currentIndex" class="question-container">
          <AssessmentQuestionCard
            :index="currentIndex"
            :total="currentScale?.questions.length || 0"
            :question="currentQuestion"
            :options="currentOptions"
            :answer="currentAnswer"
            :category-label="categoryLabel"
            @select="handleSelect"
          />
        </div>
      </transition>
    </main>

    <!-- 沉浸式底栏 -->
    <footer class="take-footer">
      <div class="footer-inner">
        <button
          :disabled="currentIndex === 0"
          class="nav-btn"
          @click="prevQuestion"
        >
          <el-icon><ArrowLeft /></el-icon>
          <span>上一题</span>
        </button>

        <div class="step-dots">
          <span
            v-for="(_, idx) in currentScale?.questions"
            :key="idx"
            class="dot"
            :class="{ active: idx === currentIndex, completed: isAnswered(idx) }"
          ></span>
        </div>

        <button
          v-if="!isLastQuestion"
          :disabled="currentAnswer === undefined"
          class="nav-btn-primary"
          @click="nextQuestion"
        >
          <span>下一题</span>
          <el-icon><ArrowRight /></el-icon>
        </button>
        <button
          v-else
          :loading="submitting"
          :disabled="!allAnswered"
          class="nav-btn-primary"
          @click="handleSubmit"
        >
          <span>提交报告</span>
          <el-icon><Finished /></el-icon>
        </button>
      </div>
    </footer>

    <!-- 提交中遮罩 -->
    <transition name="fade">
      <div v-if="submitting" class="submitting-overlay">
        <div class="loading-box">
          <div class="loading-spinner"></div>
          <p>正在分析您的回答，生成深度报告...</p>
          <p class="loading-sub">请稍候</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { Close, Timer, ArrowLeft, ArrowRight, Finished } from '@element-plus/icons-vue'
import AssessmentQuestionCard from '@/components/business/assessment/AssessmentQuestionCard.vue'
import { ASSESSMENT_STORAGE_KEY, scales, scaleOptions } from '@/components/business/assessment/data'
import type { OptionItem, ScaleResult } from '@/components/business/assessment/types'

interface ScaleMeta {
  key: string
  name: string
  color: string
  category: 'mental' | 'career'
}

const route = useRoute()
const router = useRouter()

// --- 状态管理 ---
const currentIndex = ref(0)
const answers = ref<Record<number, number | string>>({})
const timeElapsed = ref(0)
const submitting = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

// --- 量表分类元信息 ---
const mentalScales: ScaleMeta[] = [
  { key: 'phq9', name: '抑郁自评 PHQ-9', color: '#0052d9', category: 'mental' },
  { key: 'gad7', name: '焦虑自评 GAD-7', color: '#059669', category: 'mental' },
  { key: 'pss', name: '压力感知 PSS-10', color: '#d97706', category: 'mental' }
]

const careerScales: ScaleMeta[] = [
  { key: 'riasec', name: '职业兴趣 RIASEC', color: '#7c3aed', category: 'career' },
  { key: 'mbti', name: '性格倾向 MBTI', color: '#db2777', category: 'career' }
]

// --- 计算属性 ---
const currentScaleKey = computed(() => String(route.params.id))
const currentScale = computed(() => scales[currentScaleKey.value])
const currentScaleInfo = computed(() => [...mentalScales, ...careerScales].find(s => s.key === currentScaleKey.value))
const currentQuestion = computed(() => currentScale.value?.questions[currentIndex.value])
const currentOptions = computed<OptionItem[]>(() => (currentScale.value ? scaleOptions[currentScale.value.optionType] : []))
const currentAnswer = computed(() => (currentQuestion.value ? answers.value[currentQuestion.value.id] : undefined))
const categoryLabel = computed(() => (currentScaleInfo.value?.category === 'mental' ? '心理健康' : '生涯发展'))
const isLastQuestion = computed(() => currentIndex.value === (currentScale.value?.questions.length - 1))
const progress = computed(() => {
  if (!currentScale.value) return 0
  return Math.round(((currentIndex.value + 1) / currentScale.value.questions.length) * 100)
})
const allAnswered = computed(() => {
  if (!currentScale.value) return false
  return currentScale.value.questions.every(q => answers.value[q.id] !== undefined)
})

// --- 方法 ---
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function handleSelect(qId: number | undefined, val: number | string) {
  if (qId === undefined) return
  answers.value[qId] = val
  // 如果不是最后一题，自动跳到下一题 (延迟一小会儿增加反馈感)
  if (!isLastQuestion.value) {
    setTimeout(() => {
      nextQuestion()
    }, 300)
  }
}

function nextQuestion() {
  if (!isLastQuestion.value) currentIndex.value++
}

function isAnswered(idx: number) {
  const q = currentScale.value?.questions[idx]
  return q ? answers.value[q.id] !== undefined : false
}

function prevQuestion() {
  if (currentIndex.value > 0) currentIndex.value--
}

function confirmExit() {
  ElMessageBox.confirm('测试尚未完成，退出将不会保存当前进度，确定退出吗？', '确认退出', {
    confirmButtonText: '确定退出',
    cancelButtonText: '继续答题',
    type: 'warning'
  }).then(() => {
    router.push({ name: 'assessment' })
  }).catch(() => {})
}

function handleSubmit() {
  submitting.value = true
  setTimeout(() => {
    const scale = currentScale.value
    if (!scale) {
      submitting.value = false
      return
    }
    let total = 0
    const details: Record<string, number> = {}

    // 初始化 details
    if (currentScaleKey.value === 'riasec') {
      ['R', 'I', 'A', 'S', 'E', 'C'].forEach(k => details[k] = 0)
    } else if (currentScaleKey.value === 'mbti') {
      ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].forEach(k => details[k] = 0)
    }

    scale.questions.forEach(q => {
      const val = answers.value[q.id]
      if (val === undefined) return
      if (currentScaleKey.value === 'mbti') {
        if (typeof val !== 'string') return
        const char = val.charAt(0)
        const weight = parseInt(val.charAt(1))
        const dim = q.dim ?? ''
        const typeChar = char === 'A' ? dim[0] : dim[1]
        details[typeChar] += weight
      } else {
        const numericVal = parseInt(String(val))
        total += numericVal
        if (q.type) details[q.type] += numericVal
      }
    })

    const res: ScaleResult = scale.calc(total, details)
    const record = {
      ...res,
      score: total,
      date: dayjs().format('YYYY-MM-DD HH:mm'),
      scaleKey: currentScaleKey.value,
      scaleName: scale.name,
      details: details,
      duration: timeElapsed.value
    }

    // 保存到本地
    const history = JSON.parse(localStorage.getItem(ASSESSMENT_STORAGE_KEY) || '[]')
    history.unshift(record)
    localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(history.slice(0, 30)))

    submitting.value = false
    ElMessage.success('测评已完成！')
    router.push({ name: 'assessment', query: { scale: currentScaleKey.value, view: 'result' } })
  }, 1500)
}

onMounted(() => {
  if (!currentScale.value) {
    ElMessage.error('量表不存在')
    router.push({ name: 'assessment' })
    return
  }
  timer = setInterval(() => {
    timeElapsed.value++
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 沉浸式答题 - 黑白极简专注风格 */
.immersive-assessment {
  position: fixed;
  inset: 0;
  background: var(--neutral-025);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif;
}

/* 装饰性大号背景编号 */
.bg-question-num {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(280px, 42vw, 520px);
  font-weight: 900;
  color: black;
  opacity: 0.028;
  letter-spacing: -16px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  font-variant-numeric: tabular-nums;
}

/* 顶栏 */
.take-header {
  height: 72px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid var(--neutral-075);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.exit-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--neutral-600);
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.exit-btn:hover {
  color: var(--danger-600);
  background: var(--danger-50);
}

.divider {
  width: 1px;
  height: 24px;
  background: var(--neutral-150);
}

.scale-meta {
  display: flex;
  flex-direction: column;
}

.scale-name {
  font-weight: 600;
  color: var(--neutral-900);
  font-size: 14px;
  line-height: 1.3;
}

.scale-progress-text {
  font-size: 12px;
  color: var(--neutral-400);
  margin-top: 2px;
}

.header-center {
  flex: 1;
  max-width: 440px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.top-progress-track {
  flex: 1;
  height: 3px;
  background: var(--neutral-075);
  border-radius: 0;
  overflow: hidden;
}

.top-progress-fill {
  height: 100%;
  background: var(--neutral-900);
  border-radius: 0;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.top-progress-pct {
  font-size: 12px;
  color: var(--neutral-400);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
  min-width: 36px;
  text-align: right;
}

.header-right .timer {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--neutral-800);
  font-family: 'SF Mono', 'JetBrains Mono', Menlo, monospace;
  font-size: 14px;
  background: var(--neutral-050);
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid var(--neutral-100);
}

/* 主体 */
.take-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;
  position: relative;
}

.question-container {
  width: 100%;
  max-width: 720px;
  position: relative;
  z-index: 1;
}

/* 底栏 */
.take-footer {
  height: 88px;
  background: white;
  border-top: 1px solid var(--neutral-075);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  z-index: 10;
}

.footer-inner {
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--neutral-600);
  padding: 12px 20px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 500;
}

.nav-btn:hover:not(:disabled) {
  color: var(--neutral-900);
  background: var(--neutral-050);
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--neutral-900);
  color: white;
  border: none;
  cursor: pointer;
  padding: 14px 32px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px color-mix(in srgb, black 20%, transparent);
}

.nav-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, black 25%, transparent);
}

.nav-btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.step-dots {
  display: flex;
  gap: 8px;
  align-items: center;
}

.step-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neutral-150);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-dots .dot.active {
  width: 28px;
  border-radius: 4px;
  background: var(--neutral-900);
}

.step-dots .dot.completed {
  background: var(--neutral-400);
}

/* 提交遮罩 */
.submitting-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, white 92%, transparent);
  backdrop-filter: blur(12px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-box {
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--neutral-100);
  border-top-color: var(--neutral-900);
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-box p {
  font-size: 16px;
  color: var(--neutral-900);
  font-weight: 600;
  margin: 0;
}

.loading-sub {
  font-size: 13px !important;
  color: var(--neutral-400) !important;
  font-weight: 400 !important;
  margin-top: 6px !important;
}

/* 页面切换动画 */
.q-slide-enter-active, .q-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.q-slide-enter-from { opacity: 0; transform: translateX(24px) scale(0.98); }
.q-slide-leave-to { opacity: 0; transform: translateX(-24px) scale(0.98); }

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (width <= 768px) {
  .take-header { height: 64px; padding: 0 16px; }
  .header-center { display: none; }
  .scale-name { font-size: 13px; }
  .take-footer { height: 76px; padding: 0 16px; }
  .step-dots { display: none; }
  .nav-btn span { display: none; }
  .nav-btn-primary { padding: 12px 24px; font-size: 14px; }
}
</style>
