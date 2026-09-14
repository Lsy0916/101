<template>
  <section id="about" class="about-section">
    <div class="container">
      <div class="about-content">
        <div class="about-text scroll-reveal">
          <div class="section-tag">{{ $t('home.about.badge') }}</div>
          <h2>{{ $t('home.about.title1') }}<br>{{ $t('home.about.title2') }}</h2>
          <p>{{ $t('home.about.p1') }}</p>
          <p>{{ $t('home.about.p2') }}</p>
          <div class="about-stats">
            <div class="stat-item">
              <div class="stat-number"><BaseAnimatedCounter :target="10" suffix="k+" /></div>
              <div class="stat-label">{{ $t('home.about.statUsers') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number"><BaseAnimatedCounter :target="50" suffix="+" /></div>
              <div class="stat-label">{{ $t('home.about.statExperts') }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-number"><BaseAnimatedCounter :target="98" suffix="%" /></div>
              <div class="stat-label">{{ $t('home.about.statSatisfaction') }}</div>
            </div>
          </div>
        </div>
        <div class="about-image-wrapper scroll-reveal">
          <div class="about-image-bg"></div>
          <div class="about-image">
            <img :src="imgNist" :alt="$t('home.about.alt')" class="about-img-full" loading="lazy">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * 【business】HomeAboutSection —— 关于我们区块（双栏 + 数字统计）
 * - 纯展示组件：文案 i18n 驱动，数字滚动由 BaseAnimatedCounter 承担
 * - 滚动显现样式由页面层 IntersectionObserver 统一触发
 */
import BaseAnimatedCounter from '@/components/base/BaseAnimatedCounter.vue'
import imgNist from '@/assets/images/nist-bg.jpg'
</script>

<style scoped>
/* 通用布局（区块内副本，与原页面 scoped 规则一致） */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 关于我们 - 视差与创新布局 */
.about-section {
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

.section-tag {
  color: var(--ink-400);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 1rem;
  font-size: 0.75rem;
}

.about-text h2 {
  font-size: clamp(32px, 4vw, 54px);
  color: var(--navy-950);
  margin-bottom: 1.5rem;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -1.5px;
}

.about-text p {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--ink-500);
  margin-bottom: 1.5rem;
}

.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--mist-050);
}

.stat-number {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 800;
  color: var(--navy-950);
  margin-bottom: 0.25rem;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  color: var(--ink-400);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.about-image-wrapper {
  position: relative;
  perspective: 1000px;
}

.about-image {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px color-mix(in srgb, black 15%, transparent);
  transform: rotateY(-5deg);
  transition: transform 0.5s ease;
  height: auto;
  width: 100%;
}

.about-image-wrapper:hover .about-image {
  transform: rotateY(0);
}

.about-img-full {
  width: 100%;
  height: auto;
  display: block;
}

@media (width <= 992px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about-image-wrapper {
    order: -1;
    margin-bottom: 2rem;
  }
}
</style>
