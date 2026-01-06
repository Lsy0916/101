<template>
  <div class="assessment-page">
    <!-- 顶部英雄区 -->
    <div class="assessment-hero">
      <div class="hero-content">
        <div class="hero-main">
          <div class="hero-badge animate__animated animate__fadeInDown">
            <el-icon><Star /></el-icon> Professional Insights
          </div>
          <h1 class="animate__animated animate__fadeInUp">测评与成长中心</h1>
          <p class="animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
            基于科学的心理学与生涯规划模型，多维度探索真实的自我。
            <br/>在这里，您的每一次测评都是通往更好自己的印记。
          </p>
          <div class="hero-tags animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
            <span class="tag"><el-icon><Check /></el-icon> 权威量表</span>
            <span class="tag"><el-icon><DataLine /></el-icon> 动态追踪</span>
            <span class="tag"><el-icon><MagicStick /></el-icon> 智能建议</span>
          </div>
        </div>
        <div class="hero-side animate__animated animate__fadeInRight">
          <div class="hero-stat-glass">
            <div class="stat-item">
              <div class="stat-value">{{ totalCompleted }}</div>
              <div class="stat-label">已完成测评</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">{{ growthPoints }}</div>
              <div class="stat-label">成长积分</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 背景装饰 -->
      <div class="hero-decoration">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
    </div>

    <!-- 主体功能区 -->
    <el-tabs v-model="mainTab" class="main-tabs" @tab-change="handleTabChange">
      <!-- 测评广场 -->
      <el-tab-pane label="测评广场" name="scales">
        <el-row :gutter="24">
          <!-- 左侧量表列表 -->
          <el-col :xs="24" :md="8">
            <div class="panel side-panel">
              <div class="panel-header">
                <h2>选择测评维度</h2>
                <span class="panel-subtitle">多维度探索您的心理健康与职业潜能</span>
              </div>
              
              <div class="filter-controls">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索量表名称..."
                  prefix-icon="Search"
                  clearable
                  class="search-input"
                />
                <div class="category-tabs">
                  <div 
                    class="cat-tab" 
                    :class="{ active: activeCategory === 'all' }"
                    @click="activeCategory = 'all'"
                  >全部</div>
                  <div 
                    class="cat-tab" 
                    :class="{ active: activeCategory === 'mental' }"
                    @click="activeCategory = 'mental'"
                  >心理健康</div>
                  <div 
                    class="cat-tab" 
                    :class="{ active: activeCategory === 'career' }"
                    @click="activeCategory = 'career'"
                  >生涯发展</div>
                </div>
              </div>

              <div class="category-section" v-if="filteredScales.length > 0">
                <div v-if="filteredMentalScales.length > 0">
                  <h3 class="category-title">心理健康 (Mental Health)</h3>
                  <div class="scale-grid">
                    <div 
                      v-for="scale in filteredMentalScales" 
                      :key="scale.key"
                      class="scale-mini-card"
                      :class="{ active: activeScaleKey === scale.key }"
                      @click="selectScale(scale.key)"
                    >
                      <div class="scale-icon-box" :style="{ background: scale.color + '15', color: scale.color }">
                        <el-icon><component :is="scale.icon" /></el-icon>
                      </div>
                      <div class="scale-mini-info">
                        <h4>{{ scale.name }}</h4>
                        <div class="mini-meta">
                          <span>{{ scale.duration }}</span>
                          <span class="dot">·</span>
                          <span>{{ scale.count }} 题</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="filteredCareerScales.length > 0" :style="{ marginTop: filteredMentalScales.length > 0 ? '24px' : '0' }">
                  <h3 class="category-title">生涯发展 (Career Path)</h3>
                  <div class="scale-grid">
                    <div 
                      v-for="scale in filteredCareerScales" 
                      :key="scale.key"
                      class="scale-mini-card"
                      :class="{ active: activeScaleKey === scale.key }"
                      @click="selectScale(scale.key)"
                    >
                      <div class="scale-icon-box" :style="{ background: scale.color + '15', color: scale.color }">
                        <el-icon><component :is="scale.icon" /></el-icon>
                      </div>
                      <div class="scale-mini-info">
                        <h4>{{ scale.name }}</h4>
                        <div class="mini-meta">
                          <span>{{ scale.duration }}</span>
                          <span class="dot">·</span>
                          <span>{{ scale.count }} 题</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="filter-empty">
                <el-empty description="没有找到匹配的量表" :image-size="80" />
              </div>

              <div class="panel-footer-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>测评结果仅供个人探索参考，不具备临床医疗诊断效力。</span>
              </div>
            </div>
          </el-col>

          <!-- 右侧测评/结果区 -->
          <el-col :xs="24" :md="16">
            <div class="panel main-content-panel" v-if="currentScale">
              <!-- 结果报告模式 (由 AssessmentTake 提交后返回) -->
              <div v-if="viewMode === 'result'" class="result-container animate__animated animate__fadeIn">
                <div class="result-header">
                  <div class="result-summary-card">
                    <div class="res-left">
                      <div class="res-badge" :type="result?.levelTag">{{ result?.level }}</div>
                      <h2>{{ result?.title }}</h2>
                      <p class="res-date">测评完成于: {{ result?.date }}</p>
                    </div>
                    <div class="res-right">
                      <div class="res-score-circle" :style="{ borderColor: getLevelColor(result?.levelTag) }">
                        <span class="score-val">{{ result?.score }}</span>
                        <span class="score-unit">{{ activeScaleKey === 'mbti' ? '类型' : '分' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="result-body">
                  <!-- 核心解析 -->
                  <div class="insight-grid">
                    <div class="insight-card">
                      <h3><el-icon><Compass /></el-icon> 深度解析</h3>
                      <p>{{ result?.insight }}</p>
                    </div>
                    <div class="insight-card highlight">
                      <h3><el-icon><Promotion /></el-icon> 行动建议</h3>
                      <p>{{ result?.suggestion }}</p>
                    </div>
                  </div>

                  <!-- 特殊量表视图：MBTI / RIASEC -->
                  <div v-if="activeScaleKey === 'mbti'" class="mbti-details">
                    <h3>维度倾向性</h3>
                    <div class="mbti-bars">
                      <div v-for="dim in mbtiScores" :key="dim.label" class="mbti-bar-item">
                        <span class="dim-l">{{ dim.left }}</span>
                        <div class="bar-track">
                          <div class="bar-fill" :style="{ width: dim.percent + '%', left: dim.isLeft ? '0' : 'auto', right: dim.isLeft ? 'auto' : '0' }"></div>
                        </div>
                        <span class="dim-r">{{ dim.right }}</span>
                      </div>
                    </div>
                  </div>

                  <div v-if="activeScaleKey === 'riasec'" class="riasec-details">
                    <h3>六大维度得分</h3>
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
                  <el-button icon="Refresh" @click="startAssessment">重新测评</el-button>
                  <el-button type="primary" icon="Download" @click="mockDownload">保存报告</el-button>
                  <el-button type="success" icon="Share" plain @click="mockShare">分享</el-button>
                </div>
              </div>

              <!-- 介绍模式 (开始测试前) -->
              <div v-else class="assessment-intro-container animate__animated animate__fadeIn">
                <div class="intro-header">
                  <div class="scale-type-tag" :style="{ background: currentScaleInfo?.color + '20', color: currentScaleInfo?.color }">
                    {{ activeScaleKey.includes('phq') || activeScaleKey.includes('gad') ? '心理健康' : '生涯规划' }}
                  </div>
                  <h2>{{ currentScale.name }}</h2>
                  <p class="scale-desc">{{ currentScale.description }}</p>
                </div>

                <div class="intro-details">
                  <div class="detail-item">
                    <el-icon><Timer /></el-icon>
                    <div class="item-text">
                      <span class="label">预计耗时</span>
                      <span class="val">{{ currentScaleInfo?.duration }}</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <el-icon><Collection /></el-icon>
                    <div class="item-text">
                      <span class="label">题目数量</span>
                      <span class="val">{{ currentScaleInfo?.count }} 题</span>
                    </div>
                  </div>
                  <div class="detail-item">
                    <el-icon><Star /></el-icon>
                    <div class="item-text">
                      <span class="label">测评信度</span>
                      <span class="val">高 (0.85+)</span>
                    </div>
                  </div>
                </div>

                <div class="intro-tips">
                  <h4><el-icon><InfoFilled /></el-icon> 测评须知</h4>
                  <ul>
                    <li>请在安静、不受干扰的环境下进行测评。</li>
                    <li>请根据您近两周的真实情况和第一直觉作答。</li>
                    <li>测评结果仅供自我探索参考，非临床诊断。</li>
                  </ul>
                </div>

                <div class="intro-actions">
                  <el-button type="primary" size="large" @click="startAssessment">
                    进入沉浸式答题模式
                    <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div class="panel main-content-panel empty-state" v-else>
              <div class="empty-content">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/self-assessment-illustration-download-in-svg-png-gif-file-formats--person-checking-performance-survey-quality-evaluation-pack-business-illustrations-4716186.png" alt="Empty" />
                <h3>开始您的探索之旅</h3>
                <p>从左侧列表中选择一个您感兴趣的量表，开始深入了解您的内在潜能与状态。</p>
                <div class="empty-actions">
                  <el-button type="primary" plain @click="selectScale('phq9')">先试试抑郁自评</el-button>
                  <el-button type="primary" plain @click="selectScale('riasec')">了解职业兴趣</el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 成长看板 (创新模块) -->
      <el-tab-pane label="成长看板" name="dashboard">
        <div class="dashboard-wrapper">
          <el-row :gutter="24">
            <!-- 左侧：雷达图与核心洞察 -->
            <el-col :xs="24" :md="10">
              <div class="panel dashboard-card">
                <div class="card-header">
                  <h3>身心能量雷达</h3>
                  <el-tooltip content="基于您最近各项测评的综合反馈">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
                <div class="radar-container">
                  <svg viewBox="0 0 200 200" class="radar-svg">
                    <!-- 背景多边形 -->
                    <polygon v-for="n in 5" :key="n" 
                      :points="getRadarPoints(n * 20)" 
                      class="radar-bg-poly" />
                    <!-- 轴线 -->
                    <line v-for="i in 6" :key="i"
                      x1="100" y1="100"
                      :x2="100 + 80 * Math.cos((i * 60 - 90) * Math.PI / 180)"
                      :y2="100 + 80 * Math.sin((i * 60 - 90) * Math.PI / 180)"
                      class="radar-axis" />
                    <!-- 数据多边形 -->
                    <polygon :points="radarDataPoints" class="radar-data-poly" />
                    <!-- 标签 -->
                    <text v-for="(label, i) in radarLabels" :key="i"
                      :x="100 + 95 * Math.cos((i * 60 - 90) * Math.PI / 180)"
                      :y="100 + 95 * Math.sin((i * 60 - 90) * Math.PI / 180)"
                      class="radar-label">{{ label }}</text>
                  </svg>
                </div>
                <div class="radar-legend">
                  <div class="legend-item"><span class="dot"></span> 您的状态</div>
                </div>
              </div>

              <div class="panel dashboard-card ai-summary-card">
                <div class="ai-header">
                  <div class="ai-icon"><el-icon><MagicStick /></el-icon></div>
                  <h3>AI 交叉分析洞察</h3>
                </div>
                <div class="ai-body">
                  <div v-if="allHistory.length > 0" class="ai-insight-list">
                    <div class="insight-item">
                      <div class="i-title">状态总结</div>
                      <p>{{ aiInsights.summary }}</p>
                    </div>
                    <div class="insight-item">
                      <div class="i-title">关联发现</div>
                      <p>{{ aiInsights.relation }}</p>
                    </div>
                  </div>
                  <div v-else class="ai-empty">
                    <p>完成至少 2 项不同维度的测评，AI 将为您揭示深层关联。</p>
                  </div>
                </div>
              </div>
            </el-col>

            <!-- 右侧：趋势图与历史足迹 -->
            <el-col :xs="24" :md="14">
              <div class="panel dashboard-card">
                <div class="card-header">
                  <h3>情绪趋势波动 (近期)</h3>
                  <div class="chart-legend">
                    <span class="legend-dot phq"></span> PHQ-9
                    <span class="legend-dot gad"></span> GAD-7
                  </div>
                </div>
                <div class="trend-chart-container">
                  <div class="y-axis">
                    <span>高</span><span>中</span><span>低</span>
                  </div>
                  <div class="chart-area">
                    <div v-for="(point, idx) in trendData" :key="idx" class="trend-bar-group">
                      <div class="bar phq" :style="{ height: point.phq + '%' }" v-if="point.phq > 0"></div>
                      <div class="bar gad" :style="{ height: point.gad + '%' }" v-if="point.gad > 0"></div>
                      <div class="bar-date">{{ point.date }}</div>
                    </div>
                    <div v-if="trendData.length === 0" class="chart-empty">暂无趋势数据</div>
                  </div>
                </div>
              </div>

              <div class="panel dashboard-card">
                <div class="card-header">
                  <h3>历史足迹</h3>
                  <el-button link type="primary">导出全部数据</el-button>
                </div>
                <div class="history-table-wrapper">
                  <el-table :data="allHistory" stripe style="width: 100%" max-height="300">
                    <el-table-column prop="date" label="测评日期" width="120" />
                    <el-table-column prop="scaleName" label="量表名称" />
                    <el-table-column label="结论" width="120">
                      <template #default="scope">
                        <el-tag :type="scope.row.levelTag" size="small">{{ scope.row.level }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                      <template #default="scope">
                        <el-button link type="primary" @click="viewHistory(scope.row)">详情</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div v-if="allHistory.length === 0" class="history-empty">还没有完成任何测评</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import {
  Check,
  DataLine,
  MagicStick,
  InfoFilled,
  Compass,
  Promotion,
  TrendCharts,
  Odometer,
  User,
  Collection,
  Star,
  QuestionFilled,
  Refresh,
  Download,
  Share,
  Search
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const mainTab = ref('scales')
const viewMode = ref('intro') // 'intro' | 'result'
const searchQuery = ref('')
const activeCategory = ref('all')
const scrollRef = ref(null)
const submitting = ref(false)

// 存储 Key
const STORAGE_KEY = 'edu_assessment_records'

// --- 数据定义 ---

const mentalScales = [
  { key: 'phq9', name: '抑郁自评 PHQ-9', duration: '3min', count: 9, icon: 'TrendCharts', color: '#0052d9', category: 'mental' },
  { key: 'gad7', name: '焦虑自评 GAD-7', duration: '3min', count: 7, icon: 'Odometer', color: '#059669', category: 'mental' },
  { key: 'pss', name: '压力感知 PSS-10', duration: '5min', count: 10, icon: 'Compass', color: '#d97706', category: 'mental' }
]

const careerScales = [
  { key: 'riasec', name: '职业兴趣 RIASEC', duration: '8min', count: 18, icon: 'User', color: '#7c3aed', category: 'career' },
  { key: 'mbti', name: '性格倾向 MBTI', duration: '10min', count: 20, icon: 'Collection', color: '#db2777', category: 'career' }
]

const allScales = computed(() => {
  const mentalWithCat = mentalScales.map(s => ({ ...s, category: 'mental' }))
  const careerWithCat = careerScales.map(s => ({ ...s, category: 'career' }))
  return [...mentalWithCat, ...careerWithCat]
})

const filteredScales = computed(() => {
  return allScales.value.filter(scale => {
    const matchesSearch = scale.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = activeCategory.value === 'all' || scale.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const filteredMentalScales = computed(() => filteredScales.value.filter(s => s.category === 'mental'))
const filteredCareerScales = computed(() => filteredScales.value.filter(s => s.category === 'career'))

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
    description: '通过评估过去两周的心情状态，了解您的情绪健康水平。',
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
    calc: (score) => {
      if (score <= 4) return { level: '健康', levelTag: 'success', title: '情绪状态良好', insight: '您目前情绪非常稳定，心理韧性较强。', suggestion: '继续保持良好的生活作息与社交习惯。' }
      if (score <= 9) return { level: '轻度', levelTag: 'info', title: '情绪稍有波动', insight: '近期可能面临一些压力，导致情绪轻微受压。', suggestion: '尝试深呼吸或冥想，多与亲友交流。' }
      if (score <= 14) return { level: '中度', levelTag: 'warning', title: '情绪负荷较重', insight: '您的情绪状态已开始影响日常生活。', suggestion: '建议咨询心理老师或尝试系统的压力管理。' }
      return { level: '重度', levelTag: 'danger', title: '需要尽快关注', insight: '情绪陷入显著低谷，请务必寻求专业帮助。', suggestion: '请立即联系专业心理咨询机构，您并不孤单。' }
    }
  },
  gad7: {
    name: '焦虑自评量表 GAD-7',
    description: '用于识别过去两周内的焦虑、紧张和担忧程度。',
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
    calc: (score) => {
      if (score <= 4) return { level: '正常', levelTag: 'success', title: '心态平和', insight: '您具备良好的焦虑过滤能力。', suggestion: '保持目前的压力应对策略。' }
      if (score <= 9) return { level: '轻度', levelTag: 'info', title: '存在一定担忧', insight: '对未来的不确定性感到一些不安。', suggestion: '练习正念，减少对结果的过度纠结。' }
      return { level: '显著', levelTag: 'warning', title: '建议情绪疏导', insight: '过度担忧可能已导致心理耗竭。', suggestion: '寻求支持，将担忧清单化并逐一解决。' }
    }
  },
  riasec: {
    name: '霍兰德职业兴趣 RIASEC',
    description: '探索您的职业兴趣倾向，匹配最适合的职业环境。',
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
      { id: 12, text: '我喜欢按照既定流程精确办事', type: 'C' },
      { id: 13, text: '我喜欢在户外从事体力活动', type: 'R' },
      { id: 14, text: '我喜欢钻研学术理论', type: 'I' },
      { id: 15, text: '我喜欢追求独特的美学表达', type: 'A' },
      { id: 16, text: '我喜欢倾听他人的情感烦恼', type: 'S' },
      { id: 17, text: '我喜欢在竞争环境中赢得胜利', type: 'E' },
      { id: 18, text: '我喜欢管理财务报表', type: 'C' }
    ],
    calc: (score, details) => {
      const sorted = Object.entries(details).sort((a, b) => b[1] - a[1])
      const code = sorted.slice(0, 3).map(i => i[0]).join('')
      const typeMap = { R: '现实', I: '研究', A: '艺术', S: '社会', E: '企业', C: '常规' }
      return {
        level: code,
        levelTag: 'primary',
        title: '职业兴趣代码：' + code,
        insight: `您最突出的兴趣是 ${typeMap[code[0]]} 型。这意味着您在 ${typeMap[code[0]]}、${typeMap[code[1]]} 领域有很强的动力。`,
        suggestion: `建议关注 ${code.includes('I') ? '科研、技术、医疗' : ''} ${code.includes('S') ? '教育、咨询、公共服务' : ''} ${code.includes('A') ? '传媒、设计、艺术' : ''} 等领域。`
      }
    }
  },
  mbti: {
    name: '性格倾向自评 (简版 MBTI)',
    description: '探索您的心理偏好，了解您获取能量、收集信息及决策的方式。',
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
      const descriptions = {
        'INTJ': '战略家，具有强大的逻辑与远见。',
        'ENFP': '传播者，热情洋溢且富有创意。',
        'ISTJ': '检查者，务实、可靠且注重秩序。',
        'ESTP': '企业家，大胆、敏捷且充满行动力。'
      }
      return {
        level: type,
        levelTag: 'danger',
        title: '您的性格类型是 ' + type,
        insight: descriptions[type] || `您的性格类型体现了独特的 ${type} 特质平衡。`,
        suggestion: '了解性格类型有助于更好地进行团队协作与自我调节。建议阅读相关类型的深度解析。'
      }
    }
  }
}

// --- 状态管理 ---

const activeScaleKey = ref('')
const answers = ref({})
const result = ref(null)
const allHistory = ref([])
const growthPoints = ref(0)

const currentScale = computed(() => scales[activeScaleKey.value] || null)
const currentScaleInfo = computed(() => [...mentalScales, ...careerScales].find(s => s.key === activeScaleKey.value))

const progress = computed(() => {
  if (!currentScale.value) return 0
  const answeredCount = Object.values(answers.value).filter(v => v !== '').length
  return Math.round((answeredCount / currentScale.value.questions.length) * 100)
})

const allAnswered = computed(() => {
  if (!currentScale.value) return false
  return Object.values(answers.value).every(v => v !== '')
})

const totalCompleted = computed(() => allHistory.value.length)

// --- 逻辑方法 ---

function handleTabChange(name) {
  if (name === 'dashboard') loadHistory()
}

function selectScale(key) {
  activeScaleKey.value = key
  result.value = null
  viewMode.value = 'intro'
  router.replace({ query: { ...route.query, scale: key, view: 'intro' } })
}

function startAssessment() {
  router.push({ name: 'assessment-take', params: { id: activeScaleKey.value } })
}

function initAnswers() {
  const map = {}
  currentScale.value.questions.forEach(q => { map[q.id] = '' })
  answers.value = map
}

function setAnswer(id, val) {
  answers.value[id] = val
}

function resetCurrentAssessment() {
  initAnswers()
  result.value = null
}

function submit() {
  submitting.value = true
  setTimeout(() => {
    let total = 0
    const details = {}

    // 初始化 details (针对 MBTI 和 RIASEC)
    if (activeScaleKey.value === 'riasec') {
      ['R', 'I', 'A', 'S', 'E', 'C'].forEach(k => details[k] = 0)
    } else if (activeScaleKey.value === 'mbti') {
      ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].forEach(k => details[k] = 0)
    }

    currentScale.value.questions.forEach(q => {
      const val = answers.value[q.id]
      
      if (activeScaleKey.value === 'mbti') {
        const char = val.charAt(0) // A or B
        const weight = parseInt(val.charAt(1)) // 1 or 2
        const dimPair = q.dim // e.g. "EI"
        const typeChar = char === 'A' ? dimPair[0] : dimPair[1]
        details[typeChar] += weight
      } else {
        const numericVal = parseInt(val)
        total += numericVal
        if (q.type) details[q.type] += numericVal
      }
    })

    const res = currentScale.value.calc(total, details)
    result.value = {
      ...res,
      score: total,
      date: dayjs().format('YYYY-MM-DD HH:mm'),
      scaleKey: activeScaleKey.value,
      scaleName: currentScale.value.name,
      details: details // 保存详细得分用于图表
    }

    saveToHistory(result.value)
    submitting.value = false
    ElMessage.success('测评报告已生成！成长值 +10')
  }, 800)
}

function saveToHistory(record) {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  history.unshift(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)))
  loadHistory()
}

function loadHistory() {
  allHistory.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  growthPoints.value = allHistory.value.length * 10
}

function viewHistory(row) {
  activeScaleKey.value = row.scaleKey
  result.value = row
  mainTab.value = 'scales'
}

// --- 可视化计算逻辑 ---

const radarLabels = ['情绪调节', '压力耐受', '职业驱动', '思维深度', '社交能量', '自我认知']

function getRadarPoints(radius) {
  return Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60 - 90) * Math.PI / 180
    return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`
  }).join(' ')
}

const radarDataPoints = computed(() => {
  // 基于历史记录动态计算
  const base = [60, 60, 50, 50, 60, 70]
  if (allHistory.value.length > 0) {
    allHistory.value.forEach(h => {
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

const trendData = computed(() => {
  const recent = allHistory.value
    .filter(h => h.scaleKey === 'phq9' || h.scaleKey === 'gad7')
    .slice(0, 6)
    .reverse()
  
  return recent.map(h => ({
    date: dayjs(h.date).format('MM-DD'),
    phq: h.scaleKey === 'phq9' ? (h.score / 27) * 100 : 0,
    gad: h.scaleKey === 'gad7' ? (h.score / 21) * 100 : 0
  }))
})

const aiInsights = computed(() => {
  if (allHistory.value.length === 0) return {}
  const hasPsych = allHistory.value.some(h => ['phq9', 'gad7'].includes(h.scaleKey))
  const hasCareer = allHistory.value.some(h => ['riasec', 'mbti'].includes(h.scaleKey))
  
  let summary = "您近期完成了多个维度的测评，展现出较好的自我探索意识。"
  let relation = "目前数据点较少，建议完成更多测评以解锁深度交叉分析。"

  if (hasPsych && hasCareer) {
    relation = "分析显示，您的性格倾向与职业兴趣高度契合，但在面临高压力时，情绪调节能力还有提升空间，这可能会影响您的职业效能发挥。"
  }
  
  return { summary, relation }
})

const riasecScores = computed(() => {
  if (!result.value || result.value.scaleKey !== 'riasec') return []
  const d = result.value.details
  const names = { R: '现实', I: '研究', A: '艺术', S: '社会', E: '企业', C: '常规' }
  const colors = { R: '#ef4444', I: '#3b82f6', A: '#8b5cf6', S: '#10b981', E: '#f59e0b', C: '#6b7280' }
  return Object.keys(names).map(k => ({ key: k, name: names[k], score: d[k], color: colors[k] }))
})

const mbtiScores = computed(() => {
  if (!result.value || result.value.scaleKey !== 'mbti') return []
  const d = result.value.details
  const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]
  const names = { E: '外向', I: '内向', S: '实感', N: '直觉', T: '思考', F: '情感', J: '判断', P: '感知' }
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

// --- 辅助方法 ---
function getLevelColor(tag) {
  const map = { success: '#059669', info: '#0052d9', warning: '#d97706', danger: '#ef4444', primary: '#7c3aed' }
  return map[tag] || '#0052d9'
}

function mockDownload() { ElMessage.success('报告已生成并准备下载 (Mock)') }
function mockShare() { ElMessage.info('分享链接已复制到剪贴板 (Mock)') }

onMounted(() => {
  loadHistory()
  const s = route.query.scale
  const v = route.query.view
  if (s && scales[s]) {
    activeScaleKey.value = s
    if (v === 'result') {
      viewMode.value = 'result'
      // 从历史记录中找最近的一次该量表的结果
      const lastRecord = allHistory.value.find(h => h.scaleKey === s)
      if (lastRecord) result.value = lastRecord
    } else {
      viewMode.value = 'intro'
    }
  }
})

// 监听路由参数变化，实现从导航栏切换量表
watch(() => route.query.scale, (newScale) => {
  if (newScale && scales[newScale] && newScale !== activeScaleKey.value) {
    selectScale(newScale)
  }
})

watch(() => route.query.view, (newView) => {
  if (newView === 'result') {
    viewMode.value = 'result'
    const lastRecord = allHistory.value.find(h => h.scaleKey === activeScaleKey.value)
    if (lastRecord) result.value = lastRecord
  } else if (newView === 'intro') {
    viewMode.value = 'intro'
  }
})
</script>

<style scoped lang="scss">
.assessment-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.assessment-hero {
  background: linear-gradient(135deg, #0052d9 0%, #00348a 100%);
  border-radius: 24px;
  padding: 60px 40px;
  color: white;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 82, 217, 0.2);

  .hero-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 2;
  }

  .hero-main {
    max-width: 600px;
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 24px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    h1 {
      font-size: 3.2rem;
      font-weight: 800;
      margin-bottom: 20px;
      letter-spacing: -1px;
      line-height: 1.2;
    }

    p {
      font-size: 1.15rem;
      opacity: 0.9;
      margin-bottom: 32px;
      line-height: 1.6;
    }

    .hero-tags {
      display: flex;
      gap: 16px;
      
      .tag {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.1);
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 0.9rem;
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    }
  }

  .hero-side {
    .hero-stat-glass {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 32px;
      display: flex;
      gap: 32px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);

      .stat-item {
        text-align: center;
        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          display: block;
          line-height: 1;
          margin-bottom: 8px;
        }
        .stat-label {
          font-size: 0.85rem;
          opacity: 0.8;
          font-weight: 500;
        }
      }

      .stat-divider {
        width: 1px;
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .hero-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;

    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      opacity: 0.4;
    }

    .blob-1 {
      width: 400px;
      height: 400px;
      background: #7c3aed;
      top: -100px;
      right: -100px;
    }

    .blob-2 {
      width: 300px;
      height: 300px;
      background: #00d2ff;
      bottom: -50px;
      left: 10%;
    }
  }
}

.panel {
  background: white; 
  border-radius: 28px; 
  padding: 32px;
  border: 1px solid #f1f5f9; 
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  height: 100%; 
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
    transform: translateY(-4px);
  }
}

.side-panel {
  padding: 32px 0;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  
  .panel-header {
    padding: 0 32px 28px;
    h2 { 
      font-size: 1.5rem; 
      color: #1e293b; 
      margin-bottom: 8px; 
      font-weight: 800;
      background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .panel-subtitle { font-size: 0.9rem; color: #64748b; line-height: 1.5; }
  }
}

.filter-controls {
  padding: 0 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 10;

  .search-input {
    :deep(.el-input__wrapper) {
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
      border: 1px solid #e2e8f0;
      padding: 10px 18px;
      transition: all 0.3s;
      
      &:hover, &.is-focus {
        border-color: #0052d9;
        box-shadow: 0 4px 20px rgba(0, 82, 217, 0.08) !important;
      }
    }
  }

  .category-tabs {
    display: flex;
    background: #f1f5f9;
    padding: 6px;
    border-radius: 16px;
    gap: 6px;

    .cat-tab {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      font-size: 0.9rem;
      color: #64748b;
      cursor: pointer;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;

      &:hover { color: #1e293b; background: rgba(255, 255, 255, 0.5); }
      &.active {
        background: #fff;
        color: #0052d9;
        font-weight: 700;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        transform: scale(1.02);
      }
    }
  }
}

.category-section {
  padding: 0 24px;
}

.filter-empty {
  padding: 60px 0;
  :deep(.el-empty__description) { margin-top: 12px; font-weight: 500; }
}

.category-title {
  font-size: 0.75rem; 
  color: #94a3b8; 
  text-transform: uppercase;
  letter-spacing: 1.5px; 
  margin: 24px 0 16px 8px; 
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, #e2e8f0, transparent);
  }
}

.scale-grid { display: flex; flex-direction: column; gap: 12px; }

.scale-mini-card {
  display: flex; align-items: center; gap: 16px; padding: 16px;
  border-radius: 20px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent; background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  &:hover { 
    transform: translateX(8px); 
    background: #f8fafc;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    background: #f0f7ff; 
    border-color: #0052d9; 
    box-shadow: 0 12px 24px -8px rgba(0, 82, 217, 0.2);
    
    .scale-mini-info h4 { color: #0052d9; }
    .scale-icon-box { transform: scale(1.1); }
  }

  .scale-icon-box {
    width: 48px; height: 48px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .scale-mini-info {
    h4 { font-size: 1.05rem; color: #1e293b; margin-bottom: 4px; font-weight: 700; }
    .mini-meta {
      display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b;
      .dot { font-weight: bold; opacity: 0.5; }
    }
  }
}

.main-content-panel { min-height: 650px; display: flex; flex-direction: column; }

.assessment-container {
  display: flex; flex-direction: column; height: 100%;
  .assessment-header {
    margin-bottom: 32px;
    .scale-type-tag {
      display: inline-block; padding: 4px 10px; border-radius: 6px;
      font-size: 0.75rem; font-weight: 700; margin-bottom: 12px;
    }
    h2 { font-size: 1.8rem; margin-bottom: 10px; color: #1e293b; font-weight: 800; }
    p { color: #64748b; font-size: 1rem; line-height: 1.5; }
    .progress-section {
      margin-top: 24px;
      .progress-header {
        display: flex; justify-content: space-between; margin-bottom: 8px;
        .progress-label { font-size: 0.85rem; color: #64748b; }
        .progress-val { font-size: 0.85rem; font-weight: 700; color: #0052d9; }
      }
    }
  }
}

.q-card {
  padding: 28px; border-radius: 20px; background: #f8fafc;
  margin-bottom: 20px; border: 1px solid #f1f5f9; transition: all 0.3s;
  
  &:hover { border-color: #e2e8f0; }
  &.is-answered { background: white; border-color: #e2e8f0; }

  .q-header {
    display: flex; gap: 16px; margin-bottom: 20px;
    .q-num {
      width: 28px; height: 28px; background: #0052d9; color: white;
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
    }
    .q-text { font-size: 1.15rem; color: #1e293b; font-weight: 600; line-height: 1.5; }
  }

  .q-options {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;
    .opt-item {
      padding: 12px 20px; border-radius: 14px; background: white;
      border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; gap: 12px;
      
      .opt-radio {
        width: 18px; height: 18px; border: 2px solid #cbd5e1; border-radius: 50%;
        position: relative; transition: all 0.2s;
        &::after {
          content: ''; position: absolute; left: 3px; top: 3px; width: 8px; height: 8px;
          background: white; border-radius: 50%; transform: scale(0); transition: 0.2s;
        }
      }

      .opt-label { font-size: 0.95rem; color: #475569; font-weight: 500; }

      &:hover { border-color: #0052d9; background: #f0f7ff; }
      &.selected {
        border-color: #0052d9; background: #0052d9;
        .opt-radio { border-color: white; &::after { transform: scale(1); } }
        .opt-label { color: white; }
      }
    }
  }
}

.result-container {
  padding: 8px;
  
  .result-summary-card {
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
    padding: 40px; 
    border-radius: 32px; 
    margin-bottom: 32px;
    border: 1px solid #e2e8f0;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(0, 82, 217, 0.05) 0%, transparent 70%);
      border-radius: 50%;
    }

    .res-left {
      z-index: 1;
      .res-badge {
        display: inline-block; padding: 6px 16px; border-radius: 12px;
        font-weight: 700; font-size: 0.85rem; margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        
        &[type="success"] { background: #dcfce7; color: #059669; }
        &[type="info"] { background: #dbeafe; color: #0052d9; }
        &[type="warning"] { background: #fef3c7; color: #d97706; }
        &[type="danger"] { background: #fee2e2; color: #ef4444; }
        &[type="primary"] { background: #ede9fe; color: #7c3aed; }
      }
      h2 { font-size: 2.2rem; color: #1e293b; margin-bottom: 12px; font-weight: 800; letter-spacing: -0.5px; }
      .res-date { font-size: 0.95rem; color: #94a3b8; font-weight: 500; display: flex; align-items: center; gap: 6px; }
    }

    .res-right {
      z-index: 1;
      .res-score-circle {
        width: 130px; height: 130px; border: 8px solid #0052d9; border-radius: 50%;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        background: white; box-shadow: 0 15px 30px rgba(0,0,0,0.08);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        
        &:hover { transform: scale(1.05) rotate(5deg); }
        
        .score-val { font-size: 2.8rem; font-weight: 900; color: #1e293b; line-height: 1; }
        .score-unit { font-size: 0.85rem; color: #94a3b8; margin-top: 4px; font-weight: 700; text-transform: uppercase; }
      }
    }
  }

  .insight-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;
    .insight-card {
      padding: 32px; border-radius: 28px; border: 1px solid #f1f5f9;
      background: white;
      transition: all 0.3s;
      
      &:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
      
      h3 { display: flex; align-items: center; gap: 12px; font-size: 1.2rem; margin-bottom: 20px; color: #1e293b; font-weight: 700; }
      p { color: #475569; line-height: 1.8; font-size: 1rem; }
      &.highlight { 
        background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%); 
        border-color: #dbeafe; 
        h3 { color: #0052d9; }
      }
    }
  }

  .result-footer {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 40px;
    
    .el-button {
      padding: 12px 28px;
      border-radius: 14px;
      font-weight: 600;
      transition: all 0.3s;
      
      &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    }
  }
}

.mbti-bars {
  display: flex; flex-direction: column; gap: 20px; margin-top: 24px;
  background: #f8fafc;
  padding: 32px;
  border-radius: 24px;
  
  .mbti-bar-item {
    display: flex; align-items: center; gap: 20px;
    .dim-l, .dim-r { width: 44px; font-weight: 800; color: #1e293b; font-size: 1.1rem; }
    .dim-l { text-align: right; }
    .bar-track {
      flex: 1; height: 16px; background: #e2e8f0; border-radius: 8px; position: relative;
      overflow: hidden;
      .bar-fill {
        position: absolute; height: 100%; background: linear-gradient(to right, #0052d9, #60a5fa); border-radius: 8px;
        transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    }
  }
}

.riasec-bars {
  display: flex; flex-direction: column; gap: 16px; margin-top: 24px;
  background: #f8fafc;
  padding: 32px;
  border-radius: 24px;

  .r-bar-item {
    .r-info { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 1rem; font-weight: 700; color: #1e293b; }
    :deep(.el-progress-bar__outer) { background-color: #e2e8f0; border-radius: 8px; height: 12px !important; }
    :deep(.el-progress-bar__inner) { border-radius: 8px; }
  }
}

.dashboard-wrapper {
  padding-top: 24px;
  .dashboard-card {
    margin-bottom: 32px;
    border-radius: 32px;
    transition: all 0.4s;
    
    &:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }

    .card-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;
      h3 { font-size: 1.25rem; color: #1e293b; font-weight: 800; display: flex; align-items: center; gap: 10px; }
    }
  }
}

.radar-container {
  height: 320px; display: flex; align-items: center; justify-content: center;
  padding: 20px;
  .radar-svg {
    width: 100%; height: 100%;
    .radar-bg-poly { fill: none; stroke: #e2e8f0; stroke-width: 1; stroke-dasharray: 4; }
    .radar-axis { stroke: #e2e8f0; stroke-width: 1; }
    .radar-data-poly { 
      fill: rgba(0, 82, 217, 0.15); 
      stroke: #0052d9; 
      stroke-width: 3; 
      stroke-linejoin: round;
      filter: drop-shadow(0 4px 8px rgba(0, 82, 217, 0.2));
    }
    .radar-label { font-size: 11px; fill: #64748b; font-weight: 700; text-anchor: middle; }
  }
}

.ai-summary-card {
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
  border: 1px solid #dbeafe;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: 'AI';
    position: absolute;
    top: -20px;
    right: -10px;
    font-size: 8rem;
    font-weight: 900;
    color: rgba(0, 82, 217, 0.03);
    pointer-events: none;
  }

  .ai-header {
    display: flex; align-items: center; gap: 14px; margin-bottom: 24px;
    .ai-icon { 
      width: 42px; height: 42px; background: #0052d9; color: white; border-radius: 14px; 
      display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
      box-shadow: 0 8px 16px rgba(0, 82, 217, 0.2);
    }
    h3 { margin: 0; color: #0052d9; font-size: 1.2rem; font-weight: 800; }
  }
  .ai-insight-list {
    display: flex; flex-direction: column; gap: 20px;
    .insight-item {
      .i-title { font-size: 0.95rem; font-weight: 800; color: #1e293b; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
      .i-title::before { content: ''; width: 4px; height: 14px; background: #0052d9; border-radius: 2px; }
      p { font-size: 0.95rem; color: #475569; line-height: 1.6; }
    }
  }
}

.trend-chart-container {
  display: flex; height: 240px; gap: 20px; padding: 20px 10px;
  .y-axis { display: flex; flex-direction: column; justify-content: space-between; color: #94a3b8; font-size: 0.8rem; width: 24px; font-weight: 600; }
  .chart-area {
    flex: 1; display: flex; align-items: flex-end; justify-content: space-around;
    border-bottom: 2px solid #f1f5f9; padding-bottom: 32px; position: relative;
    
    .trend-bar-group {
      display: flex; gap: 6px; align-items: flex-end; position: relative;
      
      .bar { 
        width: 14px; border-radius: 6px 6px 0 0; 
        transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1); 
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        
        &:hover { transform: scaleY(1.05); filter: brightness(1.1); }
      }
      .bar.phq { background: linear-gradient(to top, #0052d9, #60a5fa); }
      .bar.gad { background: linear-gradient(to top, #059669, #34d399); }
      .bar-date { position: absolute; bottom: -28px; left: 50%; transform: translateX(-50%); font-size: 0.75rem; color: #64748b; white-space: nowrap; font-weight: 600; }
    }
  }
}

.history-table-wrapper {
  margin-top: 8px;
  :deep(.el-table) {
    border-radius: 16px;
    overflow: hidden;
    --el-table-header-bg-color: #f8fafc;
    --el-table-tr-bg-color: transparent;
    
    th.el-table__cell { font-weight: 700; color: #1e293b; }
    .el-tag { font-weight: 700; border-radius: 8px; padding: 4px 10px; }
  }
}

@media (max-width: 768px) {
  .assessment-hero { flex-direction: column; text-align: center; padding: 32px; .hero-side { margin-top: 32px; gap: 32px; } }
  .insight-grid { grid-template-columns: 1fr; }
  .q-options { grid-template-columns: 1fr !important; }
}
.assessment-intro-container {
  padding: 40px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  .intro-header {
    margin-bottom: 40px;
    h2 { font-size: 2rem; color: #1e293b; margin: 16px 0; }
    .scale-desc { color: #64748b; font-size: 1.1rem; line-height: 1.6; }
  }

  .intro-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;

    .detail-item {
      padding: 24px;
      background: #f8fafc;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .el-icon { font-size: 1.5rem; color: #0052d9; }
      .item-text {
        display: flex;
        flex-direction: column;
        .label { font-size: 0.85rem; color: #94a3b8; }
        .val { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
      }
    }
  }

  .intro-tips {
    text-align: left;
    background: #fffbeb;
    padding: 24px;
    border-radius: 16px;
    border: 1px solid #fef3c7;
    margin-bottom: 40px;

    h4 { display: flex; align-items: center; gap: 8px; color: #92400e; margin-bottom: 12px; }
    ul { padding-left: 20px; color: #b45309; li { margin-bottom: 8px; } }
  }

  .intro-actions {
    .el-button { padding: 24px 48px; font-size: 1.2rem; border-radius: 16px; }
  }
}
</style>
