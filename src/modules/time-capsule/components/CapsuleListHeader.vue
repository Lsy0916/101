<template>
  <header class="page-header">
    <div class="header-left">
      <div v-reveal class="header-eyebrow">
        <span class="eyebrow-line"></span>
        <span class="eyebrow-text">{{ $t('capsule.list.eyebrow') }}</span>
      </div>
      <h1 v-reveal="60" class="header-title" v-html="$t('capsule.list.title')"></h1>
      <p v-reveal="120" class="header-desc">
        {{ $t('capsule.list.desc') }}
      </p>
    </div>
    <div v-reveal="80" class="header-right">
      <!-- 邮戳印章 -->
      <div class="postmark">
        <div class="pm-date">{{ postmarkDate }}</div>
        <div class="pm-bar"></div>
        <div class="pm-text">CAPSULE<br>OFFICE</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// 邮戳日期（当日）
const now = new Date()
const postmarkDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
</script>

<style scoped>
/* ============================================================
   顶部标题区 · 非对称编辑式
   ============================================================ */
.page-header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 56px 36px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.header-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.eyebrow-line {
  width: 40px;
  height: 1px;
  background: var(--brand-primary);
  flex-shrink: 0;
}

.eyebrow-text {
  font-size: 11px;
  letter-spacing: 2.5px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}

.header-title {
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 900;
  color: #111827;
  margin: 0 0 16px 0;
  letter-spacing: -3px;
  line-height: 0.95;
  font-family: 'Georgia', 'PingFang SC', serif;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: var(--brand-primary);
  opacity: 0.85;
  font-family: 'Georgia', serif;
}

.header-desc {
  font-size: 14px;
  color: #6b7280;
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.6;
}

/* 邮戳印章 */
.header-right {
  flex-shrink: 0;
  padding-top: 8px;
}

.postmark {
  width: 108px;
  height: 108px;
  border: 1.5px solid rgba(0, 82, 217, 0.55);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transform: rotate(-8deg);
  position: relative;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.postmark::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(0, 82, 217, 0.3);
  border-radius: 50%;
}

.postmark:hover {
  opacity: 0.9;
  transform: rotate(-4deg);
}

.pm-date {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-primary);
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}

.pm-bar {
  width: 60%;
  height: 1px;
  background: rgba(0, 82, 217, 0.4);
}

.pm-text {
  font-size: 8px;
  font-weight: 700;
  color: var(--brand-primary);
  letter-spacing: 1.5px;
  text-align: center;
  line-height: 1.3;
}

@media (max-width: 768px) {
  .page-header {
    padding: 24px 20px 20px;
    flex-direction: column;
    gap: 20px;
  }

  .header-right {
    align-self: flex-end;
    padding-top: 0;
  }

  .postmark {
    width: 84px;
    height: 84px;
  }

  .pm-date {
    font-size: 10px;
  }

  .pm-text {
    font-size: 7px;
  }

  .header-title {
    font-size: 44px;
    letter-spacing: -2px;
  }
}
</style>
