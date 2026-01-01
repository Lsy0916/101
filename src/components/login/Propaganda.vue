<!--登陆页面左侧宣传介绍部分-->

<template>
  <div class="presentation-box">
    <h1>生涯心旅</h1>
    <p>专为大学生打造的职业规划与心理减压平台</p>
    <div class="features">
      <div class="feature feature-step-1">
        <h3>职业规划指导</h3>
        <p>专业职业规划师提供个性化指导</p>
      </div>
      <div class="feature feature-step-2">
        <h3>心理压力缓解</h3>
        <p>专业的心理支持帮助缓解职业焦虑</p>
      </div>
      <div class="feature feature-step-3">
        <h3>成长路径规划</h3>
        <p>科学的技能提升路径助你成长</p>
      </div>
    </div>
    <div class="quote">
      <p>"规划未来，舒缓压力，成就更好的自己"</p>
    </div>
  </div>
</template>

<script setup>
// 宣传组件不需要复杂的逻辑，保持简洁
// 如果需要，可以添加一些动画控制或内容管理功能
</script>

<style scoped lang="scss">
.presentation-box {
  flex: 0 0 40%; /* 按照规范设置为40% */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2.5rem;
  transform: translateX(-10px);
  opacity: 1;
  min-width: 400px;
  max-width: 700px; /* 按照规范最大宽度不超过50vw */
  animation: slideInFromLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
  will-change: transform, opacity;
  contain: layout style paint;
  overflow: visible; /* 确保内容不会被裁剪 */
  position: relative; /* 添加定位上下文 */
}

.presentation-box h1 {
  font-size: 2.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #667eea;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  background: linear-gradient(to right, #10a5e2, #9dd2f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  text-align: center;
}

.presentation-box p {
  font-size: 1.3rem;
  color: #a0c4ff;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  text-align: center;
}

.presentation-box .features {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
  overflow: visible;
}

/* 确保动画结束后保持最终状态 */
.presentation-box .feature {
  display: flex;                    /* 使用弹性布局 */
  box-sizing: border-box;           /* 添加box-sizing属性 */
  flex-direction: column;           /* 垂直方向排列子元素 */
  align-items: center;              /* 水平居中对齐内容 */
  padding: 1.5rem;                  /* 内边距1.5rem提供内部空间 */
  background: rgba(255, 255, 255, 0.15); /* 半透明白色背景 */
  border-radius: 12px;              /* 12px圆角边框 */
  will-change: transform;            /* 提示浏览器优化动画性能 */
  transition: all 0.3s ease;         /* 添加过渡效果 */
  backface-visibility: hidden;      /* 隐藏元素背面，优化3D动画性能 */
  perspective: 100px;               /* 设置3D透视效果 */
  backdrop-filter: blur(5px);       /* 背景模糊滤镜，实现毛玻璃效果 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* 半透明白色边框 */
  width: 100%;                      /* 宽度占满父容器 */
  max-width: 450px;                 /* 最大宽度450px，保持一致性 */
  text-align: center;               /* 文本居中对齐 */
  position: relative;               /* 相对定位 */
  z-index: 2;                       /* 层 级设置为2 */
  overflow: visible;                /* 允许内容溢出显示 */
  cursor: pointer;                  /* 添加光标样式，表明可点击 */
  animation-fill-mode: both;         /* 确保动画结束后保持最终状态 */
}

.presentation-box .feature:hover {
  transform: scale(1.05) !important; /* 鼠标悬停时放大 */
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12px 40px rgba(31, 38, 135, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

.presentation-box .feature h3 {
  font-size: 1.4rem;
  color: #ffffff;
  margin: 0.5rem 0 0.5rem 0;
  font-weight: 600;
  background: linear-gradient(to right, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.presentation-box .feature p {
  font-size: 1.1rem;
  color: #c5d9ff;
  margin: 0;
  text-align: center;
}

.presentation-box .feature-step-1 {
  margin-left: 0;
  animation: fadeInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both; /* 按照规范调整缓动函数 */
}

.presentation-box .feature-step-2 {
  margin-left: 15%;
  animation: fadeInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both; /* 按照规范调整缓动函数 */
}

.presentation-box .feature-step-3 {
  margin-left: 30%;
  animation: fadeInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s both; /* 按照规范调整缓动函数 */
}

.presentation-box .quote {
  margin-top: 2.5rem;
  padding: 1rem;
  border-left: 4px solid #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.25), rgba(118, 75, 162, 0.15));
  border-radius: 0 8px 8px 0;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.2);
  text-align: center;
}

.presentation-box .quote p {
  font-style: italic;
  color: #f0f4ff;
  font-size: 1.2rem;
  margin: 0;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  text-align: left;
  padding-left: 1rem;
  padding-right: 2rem;
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

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@media (max-width: 1199px) {
  .presentation-box {
    display: none !important; /* 确保在小屏幕上隐藏宣传内容 */
  }
}
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }

  .presentation-box h1 {
    font-size: 2.2rem;
  }

  .presentation-box p {
    font-size: 1.1rem;
  }
}
</style>