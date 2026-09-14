<!-- 咨询须知面板 · 流程横幅 + 编辑式 bento 网格 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CircleCheckFilled, InfoFilled, Lock, Reading, RefreshLeft, School, Warning, ArrowRight } from '@element-plus/icons-vue'

const { t, tm } = useI18n()

const counselingProcess = computed(() => [
  { title: t('counseling.process.step1.title'), desc: t('counseling.process.step1.desc') },
  { title: t('counseling.process.step2.title'), desc: t('counseling.process.step2.desc') },
  { title: t('counseling.process.step3.title'), desc: t('counseling.process.step3.desc') },
  { title: t('counseling.process.step4.title'), desc: t('counseling.process.step4.desc') }
])

const confidentialityItems = computed(() => tm('counseling.confidentiality.items') as string[])

const prepBeforeItems = computed(() => tm('counseling.prep.beforeItems') as string[])
const prepDuringItems = computed(() => tm('counseling.prep.duringItems') as string[])
const prepAfterItems = computed(() => tm('counseling.prep.afterItems') as string[])

const cancellationItems = computed(() => tm('counseling.cancellation.items') as string[])

const serviceInfo = computed(() => [
  { label: t('counseling.service.info.target'), value: t('counseling.service.info.targetValue') },
  { label: t('counseling.service.info.nature'), value: t('counseling.service.info.natureValue') },
  { label: t('counseling.service.info.duration'), value: t('counseling.service.info.durationValue') },
  { label: t('counseling.service.info.frequency'), value: t('counseling.service.info.frequencyValue') },
  { label: t('counseling.service.info.format'), value: t('counseling.service.info.formatValue') },
  { label: t('counseling.service.info.cycle'), value: t('counseling.service.info.cycleValue') }
])
</script>

<template>
  <div v-reveal="{ delay: 100 }" class="notice-layout">
    <!-- 流程图 · 全宽编辑式横幅 -->
    <section class="notice-hero">
      <div class="hero-eyebrow">
        <span class="hero-no">No.00</span>
        <span class="hero-line"></span>
        <span class="hero-label">{{ $t('counseling.process.heroLabel') }}</span>
      </div>
      <div class="process-flow">
        <div v-for="(p, i) in counselingProcess" :key="i" class="process-step">
          <div class="ps-num">{{ String(i + 1).padStart(2, '0') }}</div>
          <div class="ps-content">
            <div class="ps-title">{{ p.title }}</div>
            <div class="ps-desc">{{ p.desc }}</div>
          </div>
          <el-icon v-if="i < counselingProcess.length - 1" class="ps-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </section>

    <!-- 编辑式 bento 网格 · 非对称节奏 -->
    <div class="notice-grid">
      <!-- 01 保密原则 -->
      <section class="notice-section ns-01">
        <div class="ns-stamp">01</div>
        <h3 class="section-title"><el-icon><Lock /></el-icon> {{ $t('counseling.section.confidentiality') }}</h3>
        <ul class="notice-list">
          <li v-for="(c, i) in confidentialityItems" :key="i">{{ c }}</li>
        </ul>
        <div class="notice-warn">
          <el-icon><Warning /></el-icon>
          <span>{{ $t('counseling.confidentiality.warning') }}</span>
        </div>
      </section>

      <!-- 02 咨询准备 · 横向三栏 -->
      <section class="notice-section ns-02">
        <div class="ns-stamp">02</div>
        <h3 class="section-title"><el-icon><Reading /></el-icon> {{ $t('counseling.section.preparation') }}</h3>
        <div class="prep-row">
          <div class="prep-block">
            <h4>{{ $t('counseling.prep.before') }}</h4>
            <ul class="notice-list">
              <li v-for="(item, i) in prepBeforeItems" :key="i">{{ item }}</li>
            </ul>
          </div>
          <div class="prep-block">
            <h4>{{ $t('counseling.prep.during') }}</h4>
            <ul class="notice-list">
              <li v-for="(item, i) in prepDuringItems" :key="i">{{ item }}</li>
            </ul>
          </div>
          <div class="prep-block">
            <h4>{{ $t('counseling.prep.after') }}</h4>
            <ul class="notice-list">
              <li v-for="(item, i) in prepAfterItems" :key="i">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 03 服务说明 · 横向表格 -->
      <section class="notice-section ns-03">
        <div class="ns-stamp">03</div>
        <h3 class="section-title"><el-icon><School /></el-icon> {{ $t('counseling.section.service') }}</h3>
        <div class="service-info-banner">
          <el-icon><CircleCheckFilled /></el-icon>
          <div>
            <div class="sib-title">{{ $t('counseling.service.freeTitle') }}</div>
            <div class="sib-desc">{{ $t('counseling.service.freeDesc') }}</div>
          </div>
        </div>
        <div class="service-table">
          <div v-for="(s, i) in serviceInfo" :key="i" class="service-row">
            <div class="sr-label">{{ s.label }}</div>
            <div class="sr-value">{{ s.value }}</div>
          </div>
        </div>
        <div class="notice-warn info">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ $t('counseling.service.firstWarning') }}</span>
        </div>
      </section>

      <!-- 04 取消与改约 -->
      <section class="notice-section ns-04">
        <div class="ns-stamp">04</div>
        <h3 class="section-title"><el-icon><RefreshLeft /></el-icon> {{ $t('counseling.section.cancellation') }}</h3>
        <ul class="notice-list">
          <li v-for="(item, i) in cancellationItems" :key="i">{{ item }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ============ 通用 section ============ */
.notice-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.section-title {
  font-size: 17px;
  color: var(--ink-900);
  font-weight: 700;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.3px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--slate-100);
}

.section-title .el-icon {
  color: var(--brand-primary);
  font-size: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--brand-primary-faint) 0%, var(--blue-050) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ============ 咨询须知 · 编辑式 bento 布局 ============ */
.notice-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* —— 流程图全宽 hero —— */
.notice-hero {
  position: relative;
  padding: 28px 32px 30px;
  background: linear-gradient(135deg, var(--brand-primary-wash) 0%, var(--brand-primary-faint) 100%);
  border: 1px solid var(--brand-primary-soft);
  border-radius: 22px;
  overflow: hidden;
}

.notice-hero::before {
  content: 'PROCESS';
  position: absolute;
  top: -20px;
  right: -10px;
  font-size: 110px;
  font-weight: 900;
  color: var(--brand-primary);
  opacity: 0.05;
  letter-spacing: -4px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  position: relative;
  z-index: 1;
}

.hero-no {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--brand-primary);
  background: white;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--brand-primary-soft);
}
.hero-line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--brand-primary-soft), transparent); }

.hero-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  color: var(--ink-500);
  text-transform: uppercase;
}

.process-flow {
  display: flex;
  align-items: stretch;
  gap: 0;
  position: relative;
  z-index: 1;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1;
  position: relative;
  padding: 0 28px;
  text-align: center;
}
.process-step:first-child { padding-left: 0; }
.process-step:last-child { padding-right: 0; }

/* 步骤间贯穿连接线 · 与数字圆同轴 */
.process-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 24px;
  left: calc(50% + 28px);
  width: calc(100% - 56px);
  height: 2px;
  background: var(--brand-primary-soft);
  border-radius: 1px;
  z-index: 0;
}

.process-step .ps-arrow {
  position: absolute;
  top: 24px;
  left: calc(100% - 14px);
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--brand-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  font-size: 14px;
  z-index: 2;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--brand-primary) 10%, transparent);
}

.ps-num {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--brand-primary);
  color: var(--brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 16px color-mix(in srgb, var(--brand-primary) 15%, transparent);
  font-family: Georgia, 'Times New Roman', serif;
  position: relative;
  z-index: 1;
}

.ps-content {
  background: var(--brand-primary-wash);
  border: 1px solid var(--mist-050);
  border-radius: 14px;
  padding: 16px 20px;
  transition: all 0.3s ease;
  text-align: center;
  max-width: 220px;
  box-sizing: border-box;
}

.ps-content:hover {
  border-color: var(--brand-primary-soft);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary) 8%, transparent);
  transform: translateY(-2px);
}
.ps-title { font-size: 15px; font-weight: 700; color: var(--ink-800); margin-bottom: 6px; letter-spacing: -0.2px; }
.ps-desc { font-size: 12.5px; color: var(--ink-500); line-height: 1.65; }

/* —— bento 非对称网格：4-8 / 8-4 zig-zag —— */
.notice-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  align-items: stretch;
}
.notice-section.ns-01 { grid-column: span 4; grid-row: 1; }
.notice-section.ns-02 { grid-column: span 8; grid-row: 1; }
.notice-section.ns-03 { grid-column: 1 / span 8; grid-row: 2; }
.notice-section.ns-04 { grid-column: 9 / span 4; grid-row: 2; }

.notice-grid .notice-section {
  position: relative;
  padding: 32px 32px 28px;
  background: white;
  border: 1px solid var(--mist-050);
  border-radius: 18px;
  box-shadow: 0 2px 12px color-mix(in srgb, var(--slate-900) 3%, transparent);
  min-height: 100%;
  box-sizing: border-box;
  transition: box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
  overflow: hidden;
}

.notice-grid .notice-section:hover {
  box-shadow: 0 14px 36px color-mix(in srgb, var(--brand-primary) 10%, transparent);
  transform: translateY(-4px);
  border-color: var(--brand-primary-soft);
}

/* 大号编辑式数字印章 */
.ns-stamp {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 88px;
  font-weight: 900;
  color: var(--brand-primary);
  opacity: 0.12;
  font-variant-numeric: tabular-nums;
  letter-spacing: -4px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  font-family: Georgia, 'Times New Roman', serif;
}

.notice-section.ns-02 .ns-stamp,
.notice-section.ns-03 .ns-stamp { right: auto; left: 20px; }

.notice-list { margin: 0; padding-left: 0; list-style: none; }

.notice-list li {
  font-size: 13px;
  color: var(--ink-600);
  line-height: 1.75;
  padding: 10px 0 10px 22px;
  border-bottom: 1px solid var(--slate-100);
  position: relative;
}

.notice-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 18px;
  width: 10px;
  height: 10px;
  background: var(--brand-primary-faint);
  border: 2px solid var(--brand-primary);
  border-radius: 50%;
}
.notice-list li:last-child { border-bottom: none; }

.notice-warn {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  padding: 12px 16px;
  background: color-mix(in srgb, var(--danger-500) 5%, transparent);
  border: 1px solid color-mix(in srgb, var(--danger-500) 15%, transparent);
  border-left: 3px solid var(--danger-500);
  border-radius: 10px;
  font-size: 12.5px;
  color: var(--danger-700);
  line-height: 1.65;
}
.notice-warn .el-icon { flex-shrink: 0; color: var(--danger-500); font-size: 16px; margin-top: 2px; }

.notice-warn.info {
  background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
  border-color: color-mix(in srgb, var(--brand-primary) 15%, transparent);
  border-left-color: var(--brand-primary);
  color: #1e40af; /* stylelint-disable-line color-no-hex, function-allowed-list */
}
.notice-warn.info .el-icon { color: var(--brand-primary); }

/* —— 咨询准备：横向三栏 —— */
.prep-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.prep-block {
  padding: 14px 16px;
  background: var(--brand-primary-wash);
  border-radius: 12px;
  border: 1px solid var(--mist-050);
  border-top: 2px solid var(--brand-primary);
}

.prep-block h4 {
  font-size: 12px;
  color: var(--brand-primary);
  margin: 0 0 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}

.prep-block h4::before {
  content: '';
  width: 14px;
  height: 2px;
  background: linear-gradient(90deg, var(--brand-primary), transparent);
  border-radius: 2px;
}
.prep-block .notice-list li { padding: 6px 0 6px 18px; font-size: 12px; }
.prep-block .notice-list li::before { top: 12px; width: 8px; height: 8px; border-width: 1.5px; }

/* 服务说明 · 蓝色 banner */
.service-info-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 8%, transparent) 0%, color-mix(in srgb, var(--color-info) 4%, transparent) 100%);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 15%, transparent);
  border-radius: 14px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

.service-info-banner::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, color-mix(in srgb, var(--brand-primary) 10%, transparent) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.service-info-banner .el-icon {
  font-size: 22px;
  color: var(--brand-primary);
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px color-mix(in srgb, var(--brand-primary) 10%, transparent);
  position: relative;
  z-index: 1;
}
.sib-title { font-size: 16px; font-weight: 700; color: var(--ink-800); letter-spacing: -0.2px; position: relative; z-index: 1; }
.sib-desc { font-size: 12px; color: var(--ink-500); margin-top: 4px; letter-spacing: 0.2px; position: relative; z-index: 1; }

.service-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: white;
  border: 1px solid var(--mist-050);
  border-radius: 14px;
  padding: 4px 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px color-mix(in srgb, var(--slate-900) 3%, transparent);
}

.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  background: transparent;
  border-bottom: 1px solid var(--slate-100);
  transition: background 0.2s ease;
}
.service-row:hover { background: var(--slate-50); }

.service-row:last-child { border-bottom: none; }

.sr-label {
  font-size: 13px;
  color: var(--ink-500);
  letter-spacing: 0.2px;
  font-weight: 500;
}
.sr-value { font-size: 14px; font-weight: 600; color: var(--ink-800); letter-spacing: -0.2px; }

@media (width <= 1200px) {
  .notice-grid { grid-template-columns: 1fr; gap: 24px; }

  .notice-section.ns-01,
  .notice-section.ns-02,
  .notice-section.ns-03,
  .notice-section.ns-04 { grid-column: 1; grid-row: auto; }
  .notice-layout { gap: 24px; }
  .prep-row { grid-template-columns: 1fr; }
}

@media (width <= 900px) {
  .process-flow { flex-direction: column; gap: 20px; padding: 28px 20px; }
  .process-step { padding: 0; flex-direction: row; align-items: center; }
  .ps-arrow { display: none; }
  .process-step::after { display: none; }
}

/* ============ 暗夜模式适配 ============ */
html.dark .process-flow {
  background: linear-gradient(135deg, var(--slate-800) 0%, var(--navy-900) 100%) !important;
  border-color: var(--slate-700) !important;
}

html.dark .notice-hero {
  background: linear-gradient(135deg, var(--slate-800) 0%, var(--navy-900) 100%) !important;
  border-color: var(--slate-700) !important;
}
html.dark .hero-no { background: var(--slate-900) !important; border-color: var(--slate-700) !important; color: var(--blue-300) !important; }
html.dark .hero-label { color: var(--slate-400) !important; }
html.dark .hero-line { background: linear-gradient(90deg, var(--slate-700), transparent) !important; }
html.dark .ps-num { background: var(--slate-900) !important; border-color: var(--blue-500) !important; color: var(--blue-300) !important; }
html.dark .ps-title { color: var(--slate-100) !important; }
html.dark .ps-desc { color: var(--slate-400) !important; }
html.dark .ns-stamp { color: var(--blue-500) !important; opacity: 0.12 !important; }

html.dark .section-title {
  color: var(--slate-100) !important;
  border-bottom-color: var(--slate-700) !important;
}

html.dark .section-title .el-icon {
  background: color-mix(in srgb, var(--brand-primary) 18%, transparent) !important;
}

html.dark .service-info-banner {
  background: color-mix(in srgb, var(--brand-primary) 12%, transparent) !important;
  border-color: color-mix(in srgb, var(--brand-primary) 25%, transparent) !important;
}

html.dark .service-info-banner .el-icon {
  background: var(--slate-800) !important;
}

html.dark .notice-list li {
  color: var(--slate-300) !important;
  border-bottom-color: var(--slate-700) !important;
}

html.dark .notice-list li::before {
  background: var(--slate-800) !important;
}

html.dark .notice-warn {
  background: color-mix(in srgb, var(--danger-500) 12%, transparent) !important;
  border-color: color-mix(in srgb, var(--danger-500) 25%, transparent) !important;
}

html.dark .notice-grid .notice-section,
html.dark .prep-block {
  background: var(--slate-800) !important;
  border-color: var(--slate-700) !important;
  box-shadow: 0 2px 12px color-mix(in srgb, black 30%, transparent) !important;
}

html.dark .ps-title,
html.dark .sib-title,
html.dark .sr-value {
  color: var(--slate-100) !important;
}

html.dark .ps-desc,
html.dark .sib-desc,
html.dark .sr-label {
  color: var(--slate-400) !important;
}
</style>
