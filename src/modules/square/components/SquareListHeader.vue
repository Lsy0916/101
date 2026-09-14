<!-- 广场列表页 · 编辑式标题区 + 实时统计 -->
<script setup lang="ts">
defineProps<{
  onlineCount: number
  todayNewCount: number
  interactions: number
}>()
</script>

<template>
  <header class="page-header">
    <div class="header-inner">
      <div class="header-left">
        <span class="header-eyebrow">{{ $t('square.list.eyebrow') }}</span>
        <h1 class="header-title" v-html="$t('square.list.title')"></h1>
        <p class="header-desc">{{ $t('square.list.desc') }}</p>
      </div>
      <div class="header-right">
        <div class="stat-block">
          <span class="stat-num">{{ onlineCount }}</span>
          <span class="stat-label">{{ $t('square.list.community.online') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <span class="stat-num">{{ todayNewCount }}</span>
          <span class="stat-label">{{ $t('square.list.community.todayNew') }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-block">
          <span class="stat-num">{{ interactions }}</span>
          <span class="stat-label">{{ $t('square.list.stats.interactions') }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===== 标题区 ===== */
.page-header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 56px 36px;
  position: relative;
  z-index: 1;
}

.header-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid #eef2f6;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.header-eyebrow {
  display: block;
  font-size: 12px;
  letter-spacing: 3px;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 14px;
  text-transform: uppercase;
}

.header-title {
  font-size: clamp(40px, 6vw, 68px);
  font-weight: 900;
  color: #111827;
  margin: 0 0 14px;
  letter-spacing: -2px;
  line-height: 1.02;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
  opacity: 0.85;
}

.header-desc {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  letter-spacing: 0.3px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.stat-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.stat-num {
  font-size: 30px;
  font-weight: 900;
  color: var(--brand-primary);
  letter-spacing: -1px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 11px;
  color: #9ca3af;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #eef2f6;
}

@media (max-width: 992px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
  }
  .header-right {
    gap: 20px;
  }
  .stat-num {
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 24px 20px 24px;
  }
  .header-title {
    font-size: 36px;
    letter-spacing: -1px;
  }
}
</style>
