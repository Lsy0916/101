<!-- 登录页左侧品牌展示区（重构版：大气、随意错落排版） -->

<template>
  <div class="presentation-box">

    <!-- 主标题区 -->
    <div class="hero-title">
      <h1>生涯心旅</h1>
      <p class="hero-subtitle">
        专为大学生打造的<br />
        职业规划与心理减压平台
      </p>
    </div>

    <!-- 分隔线 -->
    <div class="divider"></div>

    <!-- 引言（左对齐，斜体，随意感） -->
    <blockquote class="hero-quote">
      <span class="quote-mark">「</span>
      在这里，每一步成长都被看见，<br />
      每一份焦虑都被温柔以待。
      <span class="quote-mark quote-mark-end">」</span>
    </blockquote>

    <!-- 特性列表（错落缩进 + 编号横线风格） -->
    <ul class="feature-list">
      <li class="feature-item feature-step-1">
        <span class="feature-index">01</span>
        <span class="feature-line"></span>
        <div class="feature-content">
          <h3>职业规划指导</h3>
          <p>专业职业规划师提供个性化指导</p>
        </div>
      </li>
      <li class="feature-item feature-step-2">
        <span class="feature-index">02</span>
        <span class="feature-line"></span>
        <div class="feature-content">
          <h3>心理压力缓解</h3>
          <p>专业心理支持帮助缓解职业焦虑</p>
        </div>
      </li>
      <li class="feature-item feature-step-3">
        <span class="feature-index">03</span>
        <span class="feature-line"></span>
        <div class="feature-content">
          <h3>成长路径规划</h3>
          <p>科学的技能提升路径助你成长</p>
        </div>
      </li>
    </ul>

  </div>
</template>

<script setup lang="ts">
// 品牌展示组件 - 重构版：错落随意排版，背景透出 nist-bg.jpg
</script>

<style scoped>
.presentation-box {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  color: white;
  position: relative;
  padding: 8px 0;
  animation: slideInFromLeft 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* 主标题：大字，大气 */
.hero-title {
  margin-bottom: 36px;
  animation: fadeIn 0.7s ease 0.25s both;
}

.hero-title h1 {
  margin: 0 0 24px;

  /* 流式字号：随视口宽度缩放，适配不同分辨率 */
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -2px;
  color: white;
  text-shadow: 0 4px 24px color-mix(in srgb, black 45%, transparent);
}

.hero-subtitle {
  margin: 0;
  margin-left: 4px;
  font-size: 18px;
  line-height: 1.8;
  color: color-mix(in srgb, white 82%, transparent);
  letter-spacing: 0.5px;
  text-shadow: 0 1px 8px color-mix(in srgb, black 35%, transparent);
  font-weight: 400;
  max-width: 360px;
}

/* 分隔线：极简 */
.divider {
  width: 56px;
  height: 2px;
  background: color-mix(in srgb, white 50%, transparent);
  margin-bottom: 32px;
  animation: fadeIn 0.7s ease 0.35s both;
}

/* 引言：左对齐，斜体，文字偏柔 */
.hero-quote {
  margin: 0 0 48px;
  padding: 0;
  border: none;
  font-size: 16px;
  line-height: 1.95;
  color: color-mix(in srgb, white 88%, transparent);
  font-style: italic;
  letter-spacing: 0.6px;
  font-weight: 300;
  max-width: 420px;
  text-shadow: 0 1px 6px color-mix(in srgb, black 40%, transparent);
  animation: fadeIn 0.7s ease 0.45s both;
}

.quote-mark {
  font-size: 22px;
  font-weight: 600;
  color: color-mix(in srgb, white 55%, transparent);
  font-style: normal;
  font-family: Georgia, serif;
  margin-right: 4px;
}

.quote-mark-end {
  margin-right: 0;
  margin-left: 4px;
}

/* 特性列表：错落缩进 + 横线编号风格，无背景卡片 */
.feature-list {
  list-style: none;
  margin: 0 0 48px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 18px;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 错落缩进：第二项最右，第三项稍回 */
.feature-step-1 {
  margin-left: 0;
  animation: fadeIn 0.7s ease 0.55s both;
}

.feature-step-2 {
  margin-left: 64px;
  animation: fadeIn 0.7s ease 0.65s both;
}

.feature-step-3 {
  margin-left: 24px;
  animation: fadeIn 0.7s ease 0.75s both;
}

.feature-item:hover {
  transform: translateX(6px);
}

.feature-index {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  color: color-mix(in srgb, white 55%, transparent);
  letter-spacing: 2px;
  font-family: Georgia, serif;
  min-width: 28px;
}

.feature-line {
  flex-shrink: 0;
  width: 32px;
  height: 1px;
  background: color-mix(in srgb, white 40%, transparent);
}

.feature-content h3 {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.3px;
}

.feature-content p {
  margin: 0;
  font-size: 13px;
  color: color-mix(in srgb, white 70%, transparent);
  line-height: 1.5;
  letter-spacing: 0.2px;
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式：< 1200px 隐藏品牌区 */
@media (width <= 1199px) {
  .presentation-box {
    display: none !important;
  }
}
</style>
