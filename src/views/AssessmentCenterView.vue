<template>
  <div class="assessment-page">
    <!-- 主体功能区 -->
    <el-tabs v-model="mainTab" class="main-tabs" @tab-change="handleTabChange">
      <!-- 测评广场 -->
      <el-tab-pane :label="$t('assessment.tabs.scales')" name="scales">
        <ModuleCover
          eyebrow="— Assessment"
          :no="`No.${String(scaleList.length).padStart(2, '0')}`"
          :title="$t('assessment.cover.scales.title')"
          :desc="$t('assessment.cover.scales.desc')"
        />
        <AssessmentScalePanel
          v-model:active-category="activeCategory"
          v-model:search-query="searchQuery"
          :categories="panelCategories"
          :scales="filteredScales"
          :completed-keys="completedKeys"
          @select="handleScaleClick"
        />
      </el-tab-pane>

      <!-- 我的 -->
      <el-tab-pane :label="$t('assessment.tabs.mine')" name="mine">
        <AssessmentMinePanel
          :history="allHistory"
          :scales="scaleList"
          @view="viewHistory"
          @retake="retakeAssessment"
          @clear-history="clearAllHistory"
          @go-assess="mainTab = 'scales'"
        />
      </el-tab-pane>

      <!-- 成长看板 -->
      <el-tab-pane :label="$t('assessment.tabs.dashboard')" name="dashboard">
        <AssessmentDashboardPanel
          :history="allHistory"
          :scales="scaleList"
          @view="viewHistory"
          @open-scale="openScaleIntro"
        />
      </el-tab-pane>
    </el-tabs>

    <!-- 测评介绍 / 结果弹窗 -->
    <AssessmentScaleDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :scale-key="activeScaleKey"
      :result="result"
      @start="startAssessment"
      @download="mockDownload"
      @share="mockShare"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import ModuleCover from '@/components/business/common/ModuleCover.vue'
import AssessmentScalePanel from '@/components/business/assessment/AssessmentScalePanel.vue'
import AssessmentMinePanel from '@/components/business/assessment/AssessmentMinePanel.vue'
import AssessmentDashboardPanel from '@/components/business/assessment/AssessmentDashboardPanel.vue'
import AssessmentScaleDialog from '@/components/business/assessment/AssessmentScaleDialog.vue'
import { ASSESSMENT_STORAGE_KEY, categories, scaleList, scales } from '@/components/business/assessment/data'
import type { AssessmentRecord, ScaleInfo } from '@/components/business/assessment/types'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const mainTab = ref('scales')
const searchQuery = ref('')
const activeCategory = ref('all')

// 弹窗状态
const activeScaleKey = ref('')
const result = ref<AssessmentRecord | null>(null)
const allHistory = ref<AssessmentRecord[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'intro' | 'result'>('intro')

// 分类导航（附数量）
const panelCategories = computed(() =>
  categories.map(c => ({
    ...c,
    count: c.key === 'all' ? scaleList.length : scaleList.filter(s => s.category === c.key).length
  }))
)

const filteredScales = computed(() => {
  return scaleList.filter(scale => {
    const matchesSearch = scale.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          scale.desc.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          scale.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesCategory = activeCategory.value === 'all' || scale.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const completedKeys = computed(() => allHistory.value.map(h => h.scaleKey))

// --- 逻辑方法 ---

function handleTabChange(name: string | number) {
  if (name === 'dashboard' || name === 'mine') loadHistory()
}

function handleScaleClick(scale: ScaleInfo) {
  if (!scale.available) {
    ElMessage.info(t('assessment.comingSoonTip', { name: scale.name }))
    return
  }
  activeScaleKey.value = scale.key
  // 检查是否有历史结果且路由要求显示结果
  if (route.query.view === 'result' && route.query.scale === scale.key) {
    const lastRecord = allHistory.value.find(h => h.scaleKey === scale.key)
    if (lastRecord) {
      result.value = lastRecord
      dialogMode.value = 'result'
      dialogVisible.value = true
      return
    }
  }
  result.value = null
  dialogMode.value = 'intro'
  dialogVisible.value = true
}

// 从看板推荐打开介绍弹窗
function openScaleIntro(key: string) {
  activeScaleKey.value = key
  dialogMode.value = 'intro'
  dialogVisible.value = true
}

function startAssessment() {
  dialogVisible.value = false
  router.push({ name: 'assessment-take', params: { id: activeScaleKey.value } })
}

function loadHistory() {
  allHistory.value = JSON.parse(localStorage.getItem(ASSESSMENT_STORAGE_KEY) || '[]')
}

function viewHistory(row: AssessmentRecord) {
  activeScaleKey.value = row.scaleKey
  result.value = row
  mainTab.value = 'scales'
  dialogMode.value = 'result'
  dialogVisible.value = true
}

// 清空历史记录
function clearAllHistory() {
  ElMessageBox.confirm(t('assessment.history.clearConfirm'), t('assessment.history.clearTitle'), {
    confirmButtonText: t('assessment.history.clearOk'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  }).then(() => {
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY)
    allHistory.value = []
    ElMessage.success(t('assessment.history.cleared'))
  }).catch(() => {})
}

// 重新测评
function retakeAssessment(record: AssessmentRecord) {
  activeScaleKey.value = record.scaleKey
  dialogMode.value = 'intro'
  dialogVisible.value = true
}

// 结果报告占位动作
function mockDownload() { ElMessage.success(t('assessment.dialog.reportGenerated')) }
function mockShare() { ElMessage.info(t('assessment.dialog.shareCopied')) }

onMounted(() => {
  loadHistory()
  const s = route.query.scale
  const v = route.query.view
  if (typeof s === 'string' && scales[s]) {
    activeScaleKey.value = s
    if (v === 'result') {
      const lastRecord = allHistory.value.find(h => h.scaleKey === s)
      if (lastRecord) {
        result.value = lastRecord
        dialogMode.value = 'result'
        dialogVisible.value = true
      }
    } else if (v === 'intro') {
      dialogMode.value = 'intro'
      dialogVisible.value = true
    }
  }
})

// 监听路由参数变化，实现从答题页返回后显示结果
watch(() => [route.query.scale, route.query.view], ([newScale, newView]) => {
  if (typeof newScale === 'string' && scales[newScale]) {
    activeScaleKey.value = newScale
    if (newView === 'result') {
      const lastRecord = allHistory.value.find(h => h.scaleKey === newScale)
      if (lastRecord) {
        result.value = lastRecord
        dialogMode.value = 'result'
        dialogVisible.value = true
      }
    } else if (newView === 'intro') {
      dialogMode.value = 'intro'
      dialogVisible.value = true
    }
  }
})
</script>

<style scoped>
/* 测评中心 - 杂志编辑式 */
.assessment-page {
  padding: 24px 24px 80px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif;
  color: #111827;
  position: relative;
}

/* 标签页 · 极简文字 */
.main-tabs {
  margin-top: 0;
}

:deep(.main-tabs .el-tabs__header) {
  margin-bottom: 36px;
}

:deep(.main-tabs .el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.main-tabs .el-tabs__item) {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
  padding: 0 20px 14px 0;
  letter-spacing: 0.5px;
}

:deep(.main-tabs .el-tabs__item.is-active) {
  color: #0a0f1a;
  font-weight: 700;
}

:deep(.main-tabs .el-tabs__active-bar) {
  background: #0a0f1a;
  height: 2px;
  border-radius: 0;
}

@media (max-width: 768px) {
  .assessment-page { padding: 16px 14px 48px; }
  :deep(.main-tabs .el-tabs__item) { font-size: 14px; padding: 0 14px 12px 0; }
}
</style>
