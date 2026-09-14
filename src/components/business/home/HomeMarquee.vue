<template>
  <div class="marquee-band" aria-hidden="true">
    <div class="marquee-track">
      <span class="marquee-item">{{ $t('home.marquee.users') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.experts') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.satisfaction') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.aiPsych') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.support') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.slogan') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.users') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.experts') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.satisfaction') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.aiPsych') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.support') }}</span>
      <span class="marquee-dot">●</span>
      <span class="marquee-item">{{ $t('home.marquee.slogan') }}</span>
      <span class="marquee-dot">●</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 【business】HomeMarquee —— 跑马灯滚动信息条（纯展示，i18n 驱动）
 * 内容重复两遍以配合 -50% 位移实现无缝循环；
 * @keyframes marquee-scroll 定义在全局样式中。
 */
</script>

<style scoped>
/* 跑马灯滚动信息条 */
.marquee-band {
  overflow: hidden;
  border-top: 1px solid var(--mist-050);
  border-bottom: 1px solid var(--mist-050);
  background: var(--brand-primary-wash);
  padding: 14px 0;
}

.marquee-track {
  display: inline-flex;
  align-items: center;
  gap: 28px;
  white-space: nowrap;
  animation: marquee-scroll 36s linear infinite;
}

.marquee-band:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-item {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--ink-900);
  text-transform: uppercase;
}

.marquee-dot {
  font-size: 6px;
  color: var(--brand-primary);
  line-height: 1;
}
</style>
