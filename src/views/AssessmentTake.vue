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
          <div class="q-card-immersive">
            <div class="q-header">
              <div class="q-badge-row">
                <span class="q-badge">Q{{ currentIndex + 1 }}</span>
                <span class="q-category-tag">{{ currentScaleInfo?.category === 'mental' ? '心理健康' : '生涯发展' }}</span>
                <span class="q-progress-mark">{{ currentIndex + 1 }} / {{ currentScale?.questions.length }}</span>
              </div>
              <h2 class="q-text">{{ currentQuestion?.text }}</h2>
            </div>

            <div class="q-options-immersive">
              <div
                v-for="(opt, idx) in currentOptions"
                :key="opt.value"
                class="opt-card"
                :class="{ selected: currentAnswer === opt.value }"
                :style="{ '--delay': idx * 0.05 + 's' }"
                @click="handleSelect(currentQuestion?.id, opt.value)"
              >
                <div class="opt-content">
                  <div class="opt-index">{{ String.fromCharCode(65 + idx) }}</div>
                  <span class="opt-label">{{ opt.label }}</span>
                </div>
                <div class="opt-check">
                  <el-icon v-if="currentAnswer === opt.value"><Check /></el-icon>
                </div>
              </div>
            </div>
          </div>
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
import {
  Close,
  Timer,
  Check,
  ArrowLeft,
  ArrowRight,
  Finished
} from '@element-plus/icons-vue'

// --- 类型定义 ---
interface ScaleResult {
  level: string
  levelTag: string
  title: string
  insight: string
  suggestion: string
}

interface ScaleQuestion {
  id: number
  text: string
  type?: string
  dim?: string
}

interface ScaleDefinition {
  name: string
  optionType: 'frequency' | 'agreement' | 'mbti'
  questions: ScaleQuestion[]
  calc: (score: number, details: Record<string, number>) => ScaleResult
}

interface OptionItem {
  label: string
  value: number | string
}

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

// --- 从 AssessmentCenter 引入的数据 (实际开发中建议放在 store 或公共 data 文件) ---
const mentalScales: ScaleMeta[] = [
  { key: 'phq9', name: '抑郁自评 PHQ-9', color: '#0052d9', category: 'mental' },
  { key: 'gad7', name: '焦虑自评 GAD-7', color: '#059669', category: 'mental' },
  { key: 'pss', name: '压力感知 PSS-10', color: '#d97706', category: 'mental' }
]

const careerScales: ScaleMeta[] = [
  { key: 'riasec', name: '职业兴趣 RIASEC', color: '#7c3aed', category: 'career' },
  { key: 'mbti', name: '性格倾向 MBTI', color: '#db2777', category: 'career' }
]

const scaleOptions: Record<'frequency' | 'agreement' | 'mbti', OptionItem[]> = {
  frequency: [
    { label: '完全没有', value: 0 },
    { label: '有几天', value: 1 },
    { label: '一半以上的天数', value: 2 },
    { label: '几乎每天', value: 3 }
  ],
  agreement: [
    { label: '非常不同意', value: 1 },
    { label: '不同意', value: 2 },
    { label: '一般', value: 3 },
    { label: '同意', value: 4 },
    { label: '非常同意', value: 5 }
  ],
  mbti: [
    { label: '非常符合 A', value: 'A2' },
    { label: '比较符合 A', value: 'A1' },
    { label: '比较符合 B', value: 'B1' },
    { label: '非常符合 B', value: 'B2' }
  ]
}

const scales: Record<string, ScaleDefinition> = {
  phq9: {
    name: '抑郁自评量表 PHQ-9',
    optionType: 'frequency',
    questions: [
      { id: 1, text: '做事提不起劲，或没有乐趣' },
      { id: 2, text: '感到心情低落、沮丧或绝望' },
      { id: 3, text: '入睡困难、睡得不稳或睡得太多' },
      { id: 4, text: '感到疲倦或没有劲' },
      { id: 5, text: '胃口不好或吃得太多' },
      { id: 6, text: '觉得自己很糟，或觉得自己很失败' },
      { id: 7, text: '对事物专注有困难，例如看报纸或看电视' },
      { id: 8, text: '动作或说话速度缓慢到别人都能察觉' },
      { id: 9, text: '有不如死掉或想伤害自己的念头' }
    ],
    calc: (score) => ({
      level: score <= 4 ? '健康' : score <= 9 ? '轻度' : score <= 14 ? '中度' : '重度',
      levelTag: score <= 4 ? 'success' : score <= 9 ? 'info' : score <= 14 ? 'warning' : 'danger',
      title: score <= 4 ? '情绪状态良好' : '需要关注情绪',
      insight: '系统已完成深度分析。',
      suggestion: '保持良好的生活习惯。'
    })
  },
  gad7: {
    name: '焦虑自评量表 GAD-7',
    optionType: 'frequency',
    questions: [
      { id: 1, text: '感到紧张、焦虑或心情不安' },
      { id: 2, text: '无法停止或控制担忧' },
      { id: 3, text: '对各种各样的事情担忧过多' },
      { id: 4, text: '很难放松下来' },
      { id: 5, text: '由于不安而无法静坐' },
      { id: 6, text: '变得容易烦躁或急躁' },
      { id: 7, text: '感到好像有什么可怕的事会发生' }
    ],
    calc: (score) => ({
      level: score <= 4 ? '正常' : score <= 9 ? '轻度' : '显著',
      levelTag: score <= 4 ? 'success' : score <= 9 ? 'info' : 'warning',
      title: score <= 4 ? '心态平和' : '建议情绪疏导',
      insight: '焦虑水平分析完成。',
      suggestion: '尝试深呼吸和正念。'
    })
  },
  riasec: {
    name: '霍兰德职业兴趣 RIASEC',
    optionType: 'agreement',
    questions: [
      { id: 1, text: '我喜欢修补电器设备或机械', type: 'R' },
      { id: 2, text: '我喜欢进行科学实验或研究', type: 'I' },
      { id: 3, text: '我喜欢创作绘画、设计或摄影', type: 'A' },
      { id: 4, text: '我喜欢参加公益活动或帮助他人', type: 'S' },
      { id: 5, text: '我喜欢说服他人或领导团队', type: 'E' },
      { id: 6, text: '我喜欢整理文档或处理精确数据', type: 'C' },
      { id: 7, text: '我喜欢操作复杂的工具或仪器', type: 'R' },
      { id: 8, text: '我喜欢分析复杂的逻辑问题', type: 'I' },
      { id: 9, text: '我喜欢写诗、写小说或进行表演', type: 'A' },
      { id: 10, text: '我喜欢教导他人知识或技能', type: 'S' },
      { id: 11, text: '我喜欢策划并启动一个商业项目', type: 'E' },
      { id: 12, text: '我喜欢按照既定流程精确办事', type: 'C' }
    ],
    calc: (score, details) => {
      const sorted = Object.entries(details).sort((a, b) => b[1] - a[1])
      const code = sorted.slice(0, 3).map(i => i[0]).join('')
      return {
        level: code,
        levelTag: 'primary',
        title: '职业兴趣代码：' + code,
        insight: '您的职业兴趣倾向分析完成。',
        suggestion: '建议关注匹配度较高的行业。'
      }
    }
  },
  mbti: {
    name: '性格倾向自评 (简版 MBTI)',
    optionType: 'mbti',
    questions: [
      { id: 1, text: '在社交聚会中，我倾向于：A.活跃参与；B.静观其变', dim: 'EI' },
      { id: 2, text: '我更喜欢：A.关注现实细节；B.想象未来可能性', dim: 'SN' },
      { id: 3, text: '决策时我更看重：A.逻辑分析；B.情感价值', dim: 'TF' },
      { id: 4, text: '生活方式上我倾向：A.有计划有组织；B.随性且开放', dim: 'JP' },
      { id: 5, text: '独自一人让我：A.感到无聊；B.感到充能', dim: 'EI' },
      { id: 6, text: '我更信任：A.经验；B.直觉', dim: 'SN' },
      { id: 7, text: '我会被描述为：A.理性的；B.感性的', dim: 'TF' },
      { id: 8, text: '面对最后期限，我：A.提前完成；B.最后一刻冲刺', dim: 'JP' },
      { id: 9, text: '说话前：A.经常直接说出；B.先在脑中构思', dim: 'EI' },
      { id: 10, text: '处理问题时：A.脚踏实地；B.脑洞大开', dim: 'SN' }
    ],
    calc: (score, details) => {
      const type = (details.E >= details.I ? 'E' : 'I') +
                   (details.S >= details.N ? 'S' : 'N') +
                   (details.T >= details.F ? 'T' : 'F') +
                   (details.J >= details.P ? 'J' : 'P')
      return {
        level: type,
        levelTag: 'danger',
        title: '您的性格类型是 ' + type,
        insight: '性格倾向深度分析完成。',
        suggestion: '了解性格有助于提升沟通效率。'
      }
    }
  }
}

// --- 计算属性 ---
const currentScaleKey = computed(() => String(route.params.id))
const currentScale = computed(() => scales[currentScaleKey.value])
const currentScaleInfo = computed(() => [...mentalScales, ...careerScales].find(s => s.key === currentScaleKey.value))
const currentQuestion = computed(() => currentScale.value?.questions[currentIndex.value])
const currentOptions = computed<OptionItem[]>(() => (currentScale.value ? scaleOptions[currentScale.value.optionType] : []))
const currentAnswer = computed(() => (currentQuestion.value ? answers.value[currentQuestion.value.id] : undefined))
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

    const res = scale.calc(total, details)
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
    const history = JSON.parse(localStorage.getItem('edu_assessment_records') || '[]')
    history.unshift(record)
    localStorage.setItem('edu_assessment_records', JSON.stringify(history.slice(0, 30)))

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
  top: 0; left: 0; right: 0; bottom: 0;
  background: #fafafa;
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
  color: #000;
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
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid #f0f0f0;
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
  color: #666;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-family: inherit;
}

.exit-btn:hover {
  color: #dc2626;
  background: #fef2f2;
}

.divider {
  width: 1px;
  height: 24px;
  background: #e5e5e5;
}

.scale-meta {
  display: flex;
  flex-direction: column;
}

.scale-name {
  font-weight: 600;
  color: #111;
  font-size: 14px;
  line-height: 1.3;
}

.scale-progress-text {
  font-size: 12px;
  color: #999;
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
  background: #f0f0f0;
  border-radius: 0;
  overflow: hidden;
}

.top-progress-fill {
  height: 100%;
  background: #111;
  border-radius: 0;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.top-progress-pct {
  font-size: 12px;
  color: #999;
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
  color: #333;
  font-family: 'SF Mono', 'JetBrains Mono', Menlo, monospace;
  font-size: 14px;
  background: #f5f5f5;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid #eee;
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

.q-card-immersive {
  background: #fff;
  border-radius: 24px;
  padding: 56px 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 12px 32px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.q-header {
  margin-bottom: 36px;
}

.q-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.q-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  background: #111;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.q-category-tag {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 500;
}

.q-progress-mark {
  margin-left: auto;
  font-size: 12px;
  color: #999;
  font-weight: 600;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}

.q-text {
  font-size: clamp(22px, 2.6vw, 30px);
  color: #111;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  letter-spacing: -0.3px;
}

/* 选项 */
.q-options-immersive {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.opt-card {
  padding: 20px 24px;
  border: 1.5px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  animation: slide-in 0.4s ease-out backwards;
  animation-delay: var(--delay);
  position: relative;
  overflow: hidden;
}

.opt-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #111;
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.opt-card.selected::before {
  transform: scaleY(1);
}

.opt-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.opt-index {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f9f9f9;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #888;
  font-size: 14px;
  transition: all 0.25s;
  flex-shrink: 0;
}

.opt-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.opt-check {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.25s;
  flex-shrink: 0;
}

.opt-card:hover {
  border-color: #111;
  transform: translateX(4px);
}

.opt-card:hover .opt-index {
  border-color: #111;
  color: #111;
}

.opt-card.selected {
  border-color: #111;
  background: #111;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.opt-card.selected .opt-label {
  color: #fff;
}

.opt-card.selected .opt-index {
  background: rgba(255, 255, 255, 0.15);
  border-color: transparent;
  color: #fff;
}

.opt-card.selected .opt-check {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slide-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 底栏 */
.take-footer {
  height: 88px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
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
  color: #666;
  padding: 12px 20px;
  border-radius: 12px;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 500;
}

.nav-btn:hover:not(:disabled) {
  color: #111;
  background: #f5f5f5;
}

.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #111;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 14px 32px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

.nav-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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
  background: #e5e5e5;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-dots .dot.active {
  width: 28px;
  border-radius: 4px;
  background: #111;
}

.step-dots .dot.completed {
  background: #999;
}

/* 提交遮罩 */
.submitting-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.92);
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
  border: 3px solid #eee;
  border-top-color: #111;
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-box p {
  font-size: 16px;
  color: #111;
  font-weight: 600;
  margin: 0;
}

.loading-sub {
  font-size: 13px !important;
  color: #999 !important;
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

@media (max-width: 768px) {
  .take-header { height: 64px; padding: 0 16px; }
  .header-center { display: none; }
  .scale-name { font-size: 13px; }
  .q-card-immersive {
    padding: 32px 24px;
    border-radius: 20px;
  }
  .q-text { font-size: 20px; }
  .opt-card { padding: 16px 18px; border-radius: 14px; }
  .opt-label { font-size: 15px; }
  .take-footer { height: 76px; padding: 0 16px; }
  .step-dots { display: none; }
  .nav-btn span { display: none; }
  .nav-btn-primary { padding: 12px 24px; font-size: 14px; }
}
</style>
