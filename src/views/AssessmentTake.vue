<template>
  <div class="immersive-assessment">
    <!-- 背景装饰 -->
    <div class="bg-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <!-- 沉浸式顶栏 -->
    <header class="take-header">
      <div class="header-left">
        <el-button link @click="confirmExit" class="exit-btn">
          <el-icon><Close /></el-icon>
          <span>退出测试</span>
        </el-button>
        <div class="divider"></div>
        <div class="scale-meta">
          <span class="scale-name">{{ currentScale?.name }}</span>
          <span class="scale-progress-text">第 {{ currentIndex + 1 }} / {{ currentScale?.questions.length }} 题</span>
        </div>
      </div>
      <div class="header-center">
        <el-progress 
          :percentage="progress" 
          :show-text="false" 
          :stroke-width="8" 
          class="top-progress"
          :color="currentScaleInfo?.color"
        />
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
      <transition name="q-slide" mode="out-in">
        <div :key="currentIndex" class="question-container">
          <div class="q-card-immersive">
            <div class="q-header">
              <div class="q-badge-row">
                <span class="q-badge" :style="{ backgroundColor: currentScaleInfo?.color }">Q{{ currentIndex + 1 }}</span>
                <span class="q-category-tag">{{ currentScaleInfo?.category === 'mental' ? '心理健康' : '生涯发展' }}</span>
              </div>
              <h2 class="q-text">{{ currentQuestion?.text }}</h2>
            </div>

            <div class="q-options-immersive">
              <div 
                v-for="(opt, idx) in (currentScale?.options || scaleOptions[currentScale?.optionType])" 
                :key="opt.value"
                class="opt-card"
                :class="{ selected: answers[currentQuestion?.id] === opt.value }"
                :style="{ '--delay': idx * 0.05 + 's' }"
                @click="handleSelect(currentQuestion?.id, opt.value)"
              >
                <div class="opt-content">
                  <div class="opt-index">{{ String.fromCharCode(65 + idx) }}</div>
                  <span class="opt-label">{{ opt.label }}</span>
                </div>
                <div class="opt-check">
                  <el-icon v-if="answers[currentQuestion?.id] === opt.value"><Check /></el-icon>
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
        <el-button 
          size="large" 
          link
          :disabled="currentIndex === 0" 
          @click="prevQuestion"
          class="nav-btn"
        >
          <el-icon><ArrowLeft /></el-icon>
          <span>上一题</span>
        </el-button>
        
        <div class="step-dots">
          <span 
            v-for="(_, idx) in currentScale?.questions" 
            :key="idx" 
            class="dot"
            :class="{ active: idx === currentIndex, completed: answers[currentScale?.questions[idx].id] !== undefined }"
          ></span>
        </div>

        <el-button 
          v-if="!isLastQuestion"
          type="primary" 
          size="large" 
          round
          :disabled="answers[currentQuestion?.id] === undefined"
          @click="nextQuestion"
          class="nav-btn-primary"
        >
          <span>下一题</span>
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        <el-button 
          v-else
          type="success" 
          size="large" 
          round
          :loading="submitting"
          :disabled="!allAnswered"
          @click="handleSubmit"
          class="nav-btn-success"
        >
          <span>提交报告</span>
          <el-icon><Finished /></el-icon>
        </el-button>
      </div>
    </footer>

    <!-- 提交中遮罩 -->
    <div v-if="submitting" class="submitting-overlay">
      <div class="loading-box">
        <el-icon class="is-loading"><Loading /></el-icon>
        <p>AI 正在分析您的回答，生成深度报告...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  Finished,
  Loading
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// --- 状态管理 ---
const currentIndex = ref(0)
const answers = ref({})
const timeElapsed = ref(0)
const submitting = ref(false)
let timer = null

// --- 从 AssessmentCenter 引入的数据 (实际开发中建议放在 store 或公共 data 文件) ---
const mentalScales = [
  { key: 'phq9', name: '抑郁自评 PHQ-9', color: '#0052d9' },
  { key: 'gad7', name: '焦虑自评 GAD-7', color: '#059669' },
  { key: 'pss', name: '压力感知 PSS-10', color: '#d97706' }
]

const careerScales = [
  { key: 'riasec', name: '职业兴趣 RIASEC', color: '#7c3aed' },
  { key: 'mbti', name: '性格倾向 MBTI', color: '#db2777' }
]

const scaleOptions = {
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

const scales = {
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
const currentScaleKey = computed(() => route.params.id)
const currentScale = computed(() => scales[currentScaleKey.value])
const currentScaleInfo = computed(() => [...mentalScales, ...careerScales].find(s => s.key === currentScaleKey.value))
const currentQuestion = computed(() => currentScale.value?.questions[currentIndex.value])
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
function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function handleSelect(qId, val) {
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
    let total = 0
    const details = {}
    
    // 初始化 details
    if (currentScaleKey.value === 'riasec') {
      ['R', 'I', 'A', 'S', 'E', 'C'].forEach(k => details[k] = 0)
    } else if (currentScaleKey.value === 'mbti') {
      ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].forEach(k => details[k] = 0)
    }

    currentScale.value.questions.forEach(q => {
      const val = answers.value[q.id]
      if (currentScaleKey.value === 'mbti') {
        const char = val.charAt(0)
        const weight = parseInt(val.charAt(1))
        const typeChar = char === 'A' ? q.dim[0] : q.dim[1]
        details[typeChar] += weight
      } else {
        const numericVal = parseInt(val)
        total += numericVal
        if (q.type) details[q.type] += numericVal
      }
    })

    const res = currentScale.value.calc(total, details)
    const record = {
      ...res,
      score: total,
      date: dayjs().format('YYYY-MM-DD HH:mm'),
      scaleKey: currentScaleKey.value,
      scaleName: currentScale.value.name,
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

<style scoped lang="scss">
.immersive-assessment {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #f8fafc;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 背景装饰 */
.bg-blobs {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;

  .blob {
    position: absolute;
    filter: blur(80px);
    border-radius: 50%;
    opacity: 0.4;
    animation: blob-float 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
  }

  .blob-1 {
    width: 500px;
    height: 500px;
    background: #e0e7ff;
    top: -100px;
    right: -100px;
  }

  .blob-2 {
    width: 400px;
    height: 400px;
    background: #f0fdf4;
    bottom: -100px;
    left: -100px;
    animation-delay: -5s;
  }

  .blob-3 {
    width: 300px;
    height: 300px;
    background: #fff1f2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -10s;
  }
}

@keyframes blob-float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.take-header {
  height: 80px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  border-bottom: 1px solid rgba(241, 245, 249, 0.5);
  z-index: 10;

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
    .exit-btn { 
      font-size: 1rem; 
      color: #64748b; 
      font-weight: 500;
      &:hover { color: #ef4444; background: #fee2e2; }
      span { margin-left: 6px; }
    }
    .divider { width: 1px; height: 28px; background: #e2e8f0; }
    .scale-meta {
      display: flex; flex-direction: column;
      .scale-name { font-weight: 700; color: #0f172a; font-size: 1rem; }
      .scale-progress-text { font-size: 0.85rem; color: #64748b; margin-top: 2px; }
    }
  }

  .header-center { flex: 1; max-width: 460px; padding: 0 40px; }
  .header-right {
    .timer {
      display: flex; align-items: center; gap: 8px;
      color: #334155; font-family: 'JetBrains Mono', monospace; font-size: 1.15rem;
      background: #f1f5f9; padding: 8px 16px; border-radius: 12px;
      font-weight: 600;
      border: 1px solid #e2e8f0;
    }
  }
}

.take-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.question-container {
  width: 100%;
  max-width: 760px;
}

.q-card-immersive {
  background: white;
  border-radius: 40px;
  padding: 56px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;

  .q-header {
    margin-bottom: 48px;
    .q-badge-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .q-badge {
      display: inline-block; padding: 6px 14px; border-radius: 10px;
      color: white; font-weight: 800; font-size: 0.9rem; letter-spacing: 0.5px;
    }
    .q-category-tag {
      font-size: 0.85rem; color: #64748b; background: #f1f5f9;
      padding: 6px 12px; border-radius: 10px; font-weight: 600;
    }
    .q-text { font-size: 2.2rem; color: #0f172a; font-weight: 800; line-height: 1.35; }
  }

  .q-options-immersive {
    display: flex; flex-direction: column; gap: 16px;
    .opt-card {
      padding: 24px 32px; border: 2px solid #f1f5f9; border-radius: 24px;
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; align-items: center; justify-content: space-between;
      background: #f8fafc;
      animation: slide-in 0.5s ease-out backwards;
      animation-delay: var(--delay);

      .opt-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .opt-index {
        width: 36px; height: 36px; border-radius: 12px;
        background: white; border: 1px solid #e2e8f0;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; color: #64748b; font-size: 1rem;
        transition: all 0.3s;
      }

      .opt-label { font-size: 1.25rem; color: #334155; font-weight: 600; }
      .opt-check {
        width: 32px; height: 32px; border-radius: 50%; border: 2px solid #cbd5e1;
        display: flex; align-items: center; justify-content: center; color: white;
        transition: all 0.3s;
      }

      &:hover { 
        border-color: #0052d9; transform: translateX(8px); 
        background: #f0f7ff;
        .opt-index { border-color: #0052d9; color: #0052d9; }
      }

      &.selected {
        border-color: #0052d9; background: #0052d9;
        box-shadow: 0 10px 20px rgba(0, 82, 217, 0.15);
        .opt-label { color: white; }
        .opt-index { background: rgba(255,255,255,0.2); border-color: transparent; color: white; }
        .opt-check { border-color: white; color: white; background: rgba(255,255,255,0.2); }
      }
    }
  }
}

@keyframes slide-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.take-footer {
  height: 100px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(241, 245, 249, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px;
  z-index: 10;

  .footer-inner {
    width: 100%; max-width: 900px;
    display: flex; align-items: center; justify-content: space-between;
  }

  .nav-btn {
    font-size: 1.1rem;
    font-weight: 600;
    color: #64748b;
    padding: 12px 24px;
    &:hover { color: #0052d9; }
    span { margin-left: 8px; }
  }

  .nav-btn-primary, .nav-btn-success {
    padding: 14px 36px;
    font-size: 1.1rem;
    font-weight: 700;
    box-shadow: 0 10px 20px -5px rgba(0, 82, 217, 0.3);
    span { margin-right: 8px; }
  }

  .step-dots {
    display: flex; gap: 10px;
    .dot {
      width: 10px; height: 10px; border-radius: 50%; background: #e2e8f0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      &.active { width: 32px; border-radius: 6px; background: #0052d9; }
      &.completed { background: #94a3b8; }
    }
  }
}

.submitting-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.9); backdrop-filter: blur(15px);
  z-index: 3000; display: flex; align-items: center; justify-content: center;
  .loading-box {
    text-align: center;
    .is-loading { font-size: 4rem; color: #0052d9; margin-bottom: 24px; }
    p { font-size: 1.25rem; color: #0f172a; font-weight: 700; }
  }
}

/* 页面切换动画 */
.q-slide-enter-active, .q-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.q-slide-enter-from { opacity: 0; transform: translateX(30px) scale(0.98); }
.q-slide-leave-to { opacity: 0; transform: translateX(-30px) scale(0.98); }

@media (max-width: 768px) {
  .take-header { height: 72px; padding: 0 16px; .header-center { display: none; } }
  .q-card-immersive { 
    padding: 32px 24px; border-radius: 32px;
    .q-text { font-size: 1.6rem; }
  }
  .q-options-immersive .opt-card { padding: 20px; border-radius: 20px; .opt-label { font-size: 1.1rem; } }
  .take-footer { height: 88px; padding: 0 16px; }
  .step-dots { display: none !important; }
  .nav-btn span { display: none; }
}
</style>
