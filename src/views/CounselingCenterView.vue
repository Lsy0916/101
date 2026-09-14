<template>
  <div class="counseling-page">
    <!-- 主体功能区 -->
    <el-tabs v-model="activeTab" class="main-tabs" @tab-change="handleTabChange">
      <!-- ============ 预约咨询 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.booking')" name="booking">
        <ModuleCover
          :eyebrow="$t('counseling.cover.booking.eyebrow')"
          no="No.01"
          :title="$t('counseling.cover.booking.title')"
          :desc="$t('counseling.cover.booking.desc')"
        />
        <CounselingBookingPanel ref="bookingPanelRef" @go-notice="activeTab = 'notice'" />
      </el-tab-pane>

      <!-- ============ 心理老师 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.counselors')" name="consultants">
        <ModuleCover
          :eyebrow="$t('counseling.cover.counselors.eyebrow')"
          no="No.02"
          :title="$t('counseling.cover.counselors.title')"
          :desc="counselors.length + $t('counseling.counselors.count') + $t('counseling.cover.counselors.desc')"
        />
        <CounselingConsultantsPanel @book="goBookWith" />
      </el-tab-pane>

      <!-- ============ 咨询须知 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.notice')" name="notice">
        <ModuleCover
          :eyebrow="$t('counseling.cover.notice.eyebrow')"
          no="No.03"
          :title="$t('counseling.cover.notice.title')"
          :desc="$t('counseling.cover.notice.desc')"
        />
        <CounselingNoticePanel />
      </el-tab-pane>

      <!-- ============ 常见问题 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.faq')" name="faq">
        <ModuleCover
          :eyebrow="$t('counseling.cover.faq.eyebrow')"
          no="No.04"
          :title="$t('counseling.cover.faq.title')"
          :desc="$t('counseling.cover.faq.desc')"
        />
        <CounselingFaqPanel @book="activeTab = 'booking'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ModuleCover from '@/components/business/common/ModuleCover.vue'
import CounselingBookingPanel from '@/components/business/counseling/CounselingBookingPanel.vue'
import CounselingConsultantsPanel from '@/components/business/counseling/CounselingConsultantsPanel.vue'
import CounselingNoticePanel from '@/components/business/counseling/CounselingNoticePanel.vue'
import CounselingFaqPanel from '@/components/business/counseling/CounselingFaqPanel.vue'
import { counselors } from '@/components/business/counseling/data'

const route = useRoute()

const tabQueryMap: Record<string, string> = { booking: 'booking', consultants: 'consultants', notice: 'notice', faq: 'faq' }
const activeTab = ref(tabQueryMap[String(route.query.tab)] || 'booking')

watch(() => route.query.tab, (newTab) => {
  const mapped = typeof newTab === 'string' ? tabQueryMap[newTab] : undefined
  if (mapped && mapped !== activeTab.value) {
    activeTab.value = mapped
  }
})

// 跨 tab 预约：预填表单 → 切到预约页签
const bookingPanelRef = ref<InstanceType<typeof CounselingBookingPanel> | null>(null)
function goBookWith(id: number | undefined) {
  if (id === undefined) return
  bookingPanelRef.value?.prefill(id)
  activeTab.value = 'booking'
}

// ============ tab 切换 ============
function handleTabChange(_name: string | number) {
  // 占位：可在此埋点
}
</script>

<style scoped>
/* ============================================================
   心理咨询中心 · 开放排版（贴合网站主题）
   品牌蓝 var(--brand-primary) 主导  浅蓝点缀 var(--brand-primary-faint)
   ============================================================ */

.counseling-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px 96px;
  color: var(--ink-800);
  font-feature-settings: "tnum" 1;
}

/* ============ Tabs · 极简文字 ============ */
:deep(.main-tabs .el-tabs__header) { margin-bottom: 40px; }
:deep(.main-tabs .el-tabs__nav) { gap: 32px; }

:deep(.main-tabs .el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-400);
  padding: 0 0 14px;
  height: auto;
  border: none;
  letter-spacing: 0.5px;
  transition: color 0.25s ease;
}
:deep(.main-tabs .el-tabs__item:hover) { color: var(--navy-950); }
:deep(.main-tabs .el-tabs__item.is-active) { color: var(--navy-950); font-weight: 700; }

:deep(.main-tabs .el-tabs__active-bar) {
  background: var(--navy-950);
  height: 2px;
  border-radius: 0;
}
:deep(.main-tabs .el-tabs__nav-wrap::after) { display: none; }

/* ============ 模块封面 · 本页节奏覆盖 ============ */
:deep(.module-cover) {
  padding: 8px 0 36px;
  margin-bottom: 40px;
}
:deep(.module-cover .cover-top) { margin-bottom: 18px; }

:deep(.module-cover .cover-title) {
  font-size: clamp(36px, 5vw, 64px);
  margin: 0 0 14px;
}
:deep(.module-cover .cover-desc) { margin: 0 0 22px; }
:deep(.module-cover .cover-no) { border-radius: 0; }

@media (width <= 1200px) {
  .counseling-page { padding: 24px 32px 80px; }
}

@media (width <= 900px) {
  .counseling-page { padding: 20px 24px 64px; }
}

@media (width <= 768px) {
  .counseling-page { padding: 16px 16px 48px; }
  :deep(.main-tabs .el-tabs__item) { font-size: 13px; padding: 0 0 12px; letter-spacing: 0.2px; }
  :deep(.main-tabs .el-tabs__nav) { gap: 20px; }
  :deep(.main-tabs .el-tabs__nav-wrap) { overflow-x: auto; }
}

/* ============ 暗夜模式适配 ============ */
html.dark .module-cover {
  border-bottom-color: var(--slate-700) !important;
}

html.dark .module-cover :deep(.cover-line) {
  background: linear-gradient(to right, var(--brand-primary) 0, var(--brand-primary) 56px, var(--slate-700) 56px, var(--slate-700) 100%);
}

html.dark .module-cover :deep(.cover-title) {
  color: var(--slate-100) !important;
}

html.dark .module-cover :deep(.cover-desc),
html.dark .module-cover :deep(.cover-eyebrow),
html.dark .module-cover :deep(.cover-no) {
  color: var(--slate-400) !important;
}
</style>
