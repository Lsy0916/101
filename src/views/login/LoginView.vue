<!-- 生涯心旅 - 登录页面（品牌蓝渐变背景） -->
<template>
  <div class="login-container">
    <!-- 品牌蓝渐变背景层 + 光晕装饰 -->
    <div class="bg-layer" aria-hidden="true"></div>
    <div class="bg-mask" aria-hidden="true"></div>

    <!-- 左右分屏内容 -->
    <div class="content-wrapper">
      <!-- 左侧：品牌宣传区（≥1200px 显示） -->
      <Propaganda />
      <!-- 右侧：登录表单区 -->
      <LoginForm />
    </div>
  </div>
</template>

<script setup>
import Propaganda from '@/components/login/Propaganda.vue';
import LoginForm from '@/components/login/LoginForm.vue';
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  margin: 0;
  /* 避开顶部 80px 高的透明导航栏，防止内容被覆盖 */
  padding-top: 80px;
  padding-bottom: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  box-sizing: border-box;
}

/* 背景图层：nist-bg.jpg 实景图 + 品牌蓝渐变兜底（图片加载失败时显示蓝底） */
.bg-layer {
  position: fixed;
  inset: 0;
  background-image: url('../../assets/images/nist-bg.jpg'), linear-gradient(135deg, #0a2a6b 0%, #0052d9 50%, #1890ff 100%);
  background-size: cover, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
  z-index: 0;
}

/* 光晕装饰层：营造空间感与品牌氛围 */
.bg-mask {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(24, 144, 255, 0.18) 0%, transparent 55%),
    radial-gradient(circle at 50% 100%, rgba(0, 82, 217, 0.12) 0%, transparent 60%);
  z-index: 1;
}

/* 左右分屏内容容器 */
.content-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  padding: 32px 48px 32px 32px;
  box-sizing: border-box;
  animation: contentRise 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes contentRise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式：< 1200px 隐藏品牌区，表单居中 */
@media (max-width: 1199px) {
  .content-wrapper {
    justify-content: center;
    gap: 0;
    padding: 32px 24px;
  }
}

/* 响应式：< 768px 调整内边距 */
@media (max-width: 768px) {
  .login-container {
    padding-top: 64px;
  }
  .content-wrapper {
    padding: 24px 16px;
  }
}
</style>
