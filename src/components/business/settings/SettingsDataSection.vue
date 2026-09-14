<!-- 05 · 数据管理：数据导出 / 缓存清理 -->
<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FolderOpened } from '@element-plus/icons-vue'

const { t } = useI18n()

const exportForm = reactive({
  dateRange: [] as string[],
  types: {
    assessment: true,
    counseling: false,
    activity: false,
    profile: false
  }
})

const cacheForm = reactive({
  types: {
    temp: false,
    history: false,
    assessment: false,
    form: false
  }
})

function exportData() {
  const hasType = Object.values(exportForm.types).some(Boolean)
  if (!hasType) {
    ElMessage.warning(t('settings.card.data.selectAtLeastOne'))
    return
  }
  ElMessage.success(t('settings.card.data.exportSuccess'))
}

function clearCache() {
  const hasType = Object.values(cacheForm.types).some(Boolean)
  if (!hasType) {
    ElMessage.warning(t('settings.card.data.selectAtLeastOne'))
    return
  }
  ElMessageBox.confirm(t('settings.card.data.clearConfirm'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(() => {
      Object.keys(cacheForm.types).forEach((k) => { cacheForm.types[k as keyof typeof cacheForm.types] = false })
      ElMessage.success(t('settings.card.data.clearSuccess'))
    })
    .catch(() => {})
}
</script>

<template>
  <section id="sec-data" class="editorial-section">
    <div class="section-marker">
      <span class="marker-num">05</span>
      <span class="marker-rule"></span>
      <el-icon class="marker-icon"><FolderOpened /></el-icon>
      <span class="marker-label">{{ t('settings.card.data.title') }}</span>
    </div>
    <div class="section-headline-row">
      <h2 class="section-headline">{{ t('settings.card.data.title') }}</h2>
      <p class="section-deck">{{ t('settings.card.data.desc') }}</p>
    </div>
    <div class="editorial-grid two-col">
      <!-- 导出 -->
      <div class="editorial-col">
        <h3 class="col-title">{{ t('settings.card.data.exportBtn') }}</h3>
        <p class="col-deck">{{ t('settings.card.data.exportDesc') }}</p>
        <div class="field">
          <label class="field-label">{{ t('settings.card.data.dateRange') }}</label>
          <el-date-picker
            v-model="exportForm.dateRange"
            type="daterange"
            range-separator="—"
            :start-placeholder="t('settings.card.data.startDate')"
            :end-placeholder="t('settings.card.data.endDate')"
            style="width: 100%"
          />
        </div>
        <div class="field">
          <label class="field-label">{{ t('settings.card.data.dataTypes') }}</label>
          <div class="checkbox-grid">
            <el-checkbox v-model="exportForm.types.assessment">
              {{ t('settings.card.data.typeAssessment') }}
            </el-checkbox>
            <el-checkbox v-model="exportForm.types.counseling">
              {{ t('settings.card.data.typeCounseling') }}
            </el-checkbox>
            <el-checkbox v-model="exportForm.types.activity">
              {{ t('settings.card.data.typeActivity') }}
            </el-checkbox>
            <el-checkbox v-model="exportForm.types.profile">
              {{ t('settings.card.data.typeProfile') }}
            </el-checkbox>
          </div>
        </div>
        <div class="field-actions">
          <button class="editorial-btn" @click="exportData">
            {{ t('settings.card.data.exportBtn') }}
          </button>
        </div>
      </div>
      <!-- 清理缓存 -->
      <div class="editorial-col">
        <h3 class="col-title col-title-danger">{{ t('settings.card.data.clearBtn') }}</h3>
        <p class="col-deck">{{ t('settings.card.data.clearCacheDesc') }}</p>
        <div class="field">
          <label class="field-label">{{ t('settings.card.data.cacheTypes') }}</label>
          <div class="checkbox-grid">
            <el-checkbox v-model="cacheForm.types.temp">
              {{ t('settings.card.data.cacheTemp') }}
            </el-checkbox>
            <el-checkbox v-model="cacheForm.types.history">
              {{ t('settings.card.data.cacheHistory') }}
            </el-checkbox>
            <el-checkbox v-model="cacheForm.types.assessment">
              {{ t('settings.card.data.cacheAssessment') }}
            </el-checkbox>
            <el-checkbox v-model="cacheForm.types.form">
              {{ t('settings.card.data.cacheForm') }}
            </el-checkbox>
          </div>
        </div>
        <div class="field-actions">
          <button class="editorial-btn editorial-btn-danger" @click="clearCache">
            {{ t('settings.card.data.clearBtn') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============ 区块通用 ============ */
.editorial-section {
  padding: 40px 0 56px;
  border-top: 1px solid var(--ink-200);
  scroll-margin-top: 80px;
}

.editorial-section:first-of-type {
  border-top: 1px solid var(--ink-900);
}

.section-marker {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}

.marker-num {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 30px;
  font-weight: 700;
  color: var(--brand-primary);
  line-height: 1;
}

.marker-rule {
  flex: 1;
  height: 1px;
  background: var(--ink-900);
}

.marker-icon {
  font-size: 16px;
  color: var(--ink-900);
}

.marker-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ink-900);
}

.section-headline-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: end;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--ink-200);
}

.section-headline {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--ink-900);
}

.section-deck {
  margin: 0;
  font-size: 15px;
  font-style: italic;
  line-height: 1.6;
  color: var(--ink-500);
}

/* ============ 网格 ============ */
.editorial-grid {
  display: grid;
}
.two-col { grid-template-columns: 1fr 1fr; }

.editorial-col {
  padding: 0 32px;
  border-right: 1px solid var(--ink-200);
}
.editorial-col:first-child { padding-left: 0; }

.editorial-col:last-child {
  padding-right: 0;
  border-right: none;
}

/* ============ 栏目标题 ============ */
.col-title {
  margin: 0 0 18px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-900);
}
.col-title-danger { color: var(--danger-600); }

.col-deck {
  margin: 0 0 18px;
  font-size: 13px;
  font-style: italic;
  color: var(--ink-500);
  line-height: 1.5;
}

/* ============ 字段 ============ */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--ink-700);
}

.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
  padding: 8px 0;
}

.field-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* ============ Editorial 按钮 ============ */
.editorial-btn {
  padding: 10px 28px;
  background: var(--ink-900);
  color: white;
  border: 1px solid var(--ink-900);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.editorial-btn:hover {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.editorial-btn-danger {
  background: var(--danger-600);
  border-color: var(--danger-600);
}

.editorial-btn-danger:hover {
  background: var(--danger-700);
  border-color: var(--danger-700);
}

@media (width <= 1024px) {
  .section-headline-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .section-headline { font-size: 26px; }
  .two-col { grid-template-columns: 1fr; }

  .editorial-col {
    padding: 24px 0;
    border-right: none;
    border-bottom: 1px solid var(--ink-200);
  }
  .editorial-col:first-child { padding-top: 0; }

  .editorial-col:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

@media (width <= 768px) {
  .checkbox-grid { grid-template-columns: 1fr; }
  .field-actions { justify-content: stretch; }

  .field-actions .editorial-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
