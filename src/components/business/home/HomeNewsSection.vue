<template>
  <section id="news" class="news-section">
    <div class="tech-bg-pattern"></div>
    <div class="container relative z-10">
      <div class="section-header scroll-reveal">
        <span class="section-badge">{{ $t('home.news.badge') }}</span>
        <h2>{{ $t('home.news.title') }}</h2>
        <p class="section-subtitle">{{ $t('home.news.subtitle') }}</p>
      </div>
      <div class="news-rows">
        <div
          v-for="(news, index) in allNews"
          :key="news.id"
          class="news-row scroll-reveal"
          :style="{ transitionDelay: `${index * 80}ms` }"
          @click="emit('read', news.id)"
        >
          <div class="news-row-num">
            <span class="num">{{ String(index + 1).padStart(2, '0') }}</span>
          </div>
          <div class="news-row-body">
            <div class="news-row-cat">{{ news.category }}</div>
            <h3 class="news-row-title">{{ news.title }}</h3>
            <p class="news-row-summary">{{ news.summary }}</p>
          </div>
          <div class="news-row-thumb">
            <img :src="news.image" :alt="news.title" loading="lazy">
          </div>
          <div class="news-row-meta">
            <span class="news-row-date">{{ news.date }}</span>
            <el-icon class="news-row-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * 【business】HomeNewsSection —— 最新动态区块（编辑式行列表）
 * - 数据由 i18n 消息驱动，图片循环复用
 * - 阅读行为经 read 事件上抛页面
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight } from '@element-plus/icons-vue'
import imgNist from '@/assets/images/nist-bg.jpg'
import imgTsinghua from '@/assets/images/tsinghua-bg.jpg'
import type { NewsItem } from './types'

const emit = defineEmits<{ (e: 'read', id: number): void }>()

const { tm } = useI18n()

// tm 返回类型对深层 locale 消息实例化过深，收敛为 unknown 后按需断言
const tmItems = tm as unknown as (key: string) => unknown

// 新闻数据（i18n 驱动，图片循环复用）
const allNews = computed(() => {
  const items = tmItems('home.news.items') as NewsItem[]
  if (!Array.isArray(items)) return []
  return items.map((item, i) => ({
    ...item,
    id: i + 1,
    image: i % 2 === 0 ? imgNist : imgTsinghua
  }))
})
</script>

<style scoped>
/* 通用布局（区块内副本，与原页面 scoped 规则一致） */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.relative { position: relative; }
.z-10 { z-index: 10; }

/* 滚动显现动画（页面层 IntersectionObserver 添加 is-visible） */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  margin-bottom: 4rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eef2f6;
}

.section-header h2 {
  font-size: clamp(32px, 4.5vw, 60px);
  font-weight: 800;
  color: #0a0f1a;
  margin: 0.5rem 0 1rem;
  letter-spacing: -1.5px;
  line-height: 1.05;
}

.section-subtitle {
  color: #6b7280;
  font-size: 1rem;
  max-width: 600px;
  margin: 0;
  line-height: 1.7;
}

/* 装饰性小标题 · 编辑式 eyebrow */
.section-badge {
  display: inline-block;
  padding: 0;
  background: none;
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0;
  margin-bottom: 0.5rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  border: none;
}

.tech-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  z-index: 0;
}

.news-section {
  position: relative;
  overflow: hidden;
  padding: 8rem 0;
}

.news-rows {
  display: flex;
  flex-direction: column;
}

.news-row {
  display: grid;
  grid-template-columns: 64px 1fr 220px 150px;
  gap: 32px;
  align-items: center;
  padding: 32px 0;
  border-bottom: 1px solid #eef2f6;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-row:first-child {
  border-top: 1px solid #0a0f1a;
}

.news-row:hover {
  transform: translateX(10px);
}

.news-row-num .num {
  font-size: 24px;
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  transition: color 0.25s;
}

.news-row:hover .news-row-num .num {
  color: var(--brand-primary);
}

.news-row-body {
  min-width: 0;
}

.news-row-cat {
  font-size: 11px;
  color: var(--brand-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 10px;
}

.news-row-title {
  font-size: clamp(18px, 1.6vw, 24px);
  font-weight: 700;
  color: #0a0f1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  letter-spacing: -0.3px;
  transition: color 0.25s;
}

.news-row:hover .news-row-title {
  color: var(--brand-primary);
}

.news-row-summary {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-row-thumb {
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-radius: 4px;
}

.news-row-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-row:hover .news-row-thumb img {
  transform: scale(1.06);
}

.news-row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

.news-row-date {
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.news-row-arrow {
  font-size: 20px;
  color: #0a0f1a;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-row:hover .news-row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .news-row {
    grid-template-columns: 40px 1fr;
    gap: 20px;
  }
  .news-row-thumb,
  .news-row-meta {
    display: none;
  }
}

@media (max-width: 768px) {
  .section-header h2 {
    font-size: 1.9rem;
    letter-spacing: -0.5px;
  }
}
</style>
