<!-- 学生登录页面 -->
<template>
  <div class="login-container">
    <!-- 主题切换 -->
    <ThemeToggle />

    <div class="content-wrapper">
      <!-- 宣传组件 -->
      <Propaganda />
      <!-- 登录表单 -->
      <LoginForm/>
    </div>
  </div>
</template>

<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue';
import Propaganda from '@/components/login/Propaganda.vue';
import LoginForm from '@/components/login/LoginForm.vue';

import { ref, onMounted } from 'vue';

// 背景图片响应式数据
const bgImage = ref('');

// 预加载背景图片以优化LCP
onMounted(() => {
  // 创建一个Image对象来预加载背景图片
  const img = new Image();
  img.src = new URL('@/assets/images/tsinghua-bg.jpg', import.meta.url).href;

  // 可以考虑使用WebP格式或更小尺寸的图片来优化性能
  // 或者使用CSS背景图片的渐进式加载
});
</script>

<style scoped>
.login-container {
  background: url(@/assets/images/tsinghua-bg.jpg) no-repeat center center;
  background-size: cover;
  position: relative;
  padding: 0;
  margin: 0;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  contain: layout style paint; /* 优化容器性能 */
}

.content-wrapper {
  background: linear-gradient(to right, rgba(37, 37, 37, 0.6), rgba(255, 255, 255, 0)); /* 渐变背景,暗夜模式 */
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: space-between; /* 按规范设置为靠右对齐 */
  z-index: 3;
  opacity: 0;
  transform: translateX(-50px);
  will-change: transform, opacity; /* 提示浏览器优化动画 */
  contain: layout style paint; /* 限制浏览器计算范围 */
  animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both;
  overflow: visible; /* 确保内容不会被裁剪 */
  animation-fill-mode: forwards; /* 确保动画结束后保持最终状态 */
}

@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1199px) {
  .content-wrapper {
    justify-content: center;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    flex-direction: column;
    justify-content: center !important; /* 根据规范，在小屏幕上居中布局 */
    padding: 0.8rem;
    gap: 0.8rem;
    min-height: 100vh;
    align-items: center;
  }
}
</style>
