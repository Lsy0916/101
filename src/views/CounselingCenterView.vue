<template>
  <div class="counseling-page">
    <!-- AI 咨询师入口 -->
    <button type="button" class="ai-consult-entry" @click="router.push({ name: 'counseling-ai-chat' })">
      <span class="entry-icon"><el-icon><ChatDotRound /></el-icon></span>
      <span class="entry-text">
        <strong>{{ $t('counseling.aiChat.entryTitle') }}</strong>
        <small>{{ $t('counseling.aiChat.entryDesc') }}</small>
      </span>
      <el-icon class="entry-arrow"><ArrowRight /></el-icon>
    </button>

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

      <!-- ============ AI 伴侣（导航至独立对话子页） ============ -->
      <el-tab-pane :label="$t('counseling.tabs.companion')" name="companion" />
    </el-tabs>

    <!-- AI 客服（悬浮窗） -->
    <AiAssistantFab />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, ChatDotRound } from '@element-plus/icons-vue'
import ModuleCover from '@/components/business/common/ModuleCover.vue'
import AiAssistantFab from '@/components/business/ai/AiAssistantFab.vue'
import CounselingBookingPanel from '@/components/business/counseling/CounselingBookingPanel.vue'
import CounselingConsultantsPanel from '@/components/business/counseling/CounselingConsultantsPanel.vue'
import CounselingNoticePanel from '@/components/business/counseling/CounselingNoticePanel.vue'
import CounselingFaqPanel from '@/components/business/counseling/CounselingFaqPanel.vue'
import { counselors } from '@/components/business/counseling/data'

const route = useRoute()
const router = useRouter()

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
function handleTabChange(name: string | number) {
  // AI 伴侣为独立对话子页：点击页签即跳转（其余页签为页内面板）
  if (name === 'companion') void router.push({ name: 'counseling-companion' })
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

/* ============ AI 咨询师入口 ============ */
.ai-consult-entry {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin-bottom: 24px;
  padding: 16px 20px;
  border: 1px solid var(--brand-primary-soft);
  border-radius: 16px;
  background: linear-gradient(120deg, var(--brand-primary-faint), var(--brand-primary-wash));
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ai-consult-entry:hover {
  border-color: var(--brand-primary);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 16%, transparent);
  transform: translateY(-2px);
}

.entry-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: var(--brand-primary);
  color: white;
  font-size: 22px;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 30%, transparent);
}

.entry-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-text strong {
  font-size: 15px;
  font-weight: 700;
  color: var(--navy-950);
}

.entry-text small {
  font-size: 12.5px;
  color: var(--ink-400);
  line-height: 1.5;
}

.entry-arrow {
  color: var(--brand-primary);
  font-size: 18px;
  transition: transform 0.3s ease;
}

.ai-consult-entry:hover .entry-arrow {
  transform: translateX(4px);
}

html.dark .ai-consult-entry {
  background: var(--slate-800);
  border-color: var(--slate-700);
}

html.dark .entry-text strong {
  color: var(--slate-100);
}

html.dark .entry-text small {
  color: var(--slate-400);
}
</style>
