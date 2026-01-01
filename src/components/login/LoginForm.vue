<template>
  <!-- 登录表单 -->
  <div v-if="!showRegisterForm && !showForgotPasswordForm" class="login-box">
    <div class="login-header">
      <h2>生涯心旅</h2>
      <p>学生登录</p>
    </div>

    <!-- 登录方式切换 -->
    <el-tabs v-model="activeLoginType" type="border-card" class="login-type-tabs">
      <!--账号密码登录-->
      <el-tab-pane label="账号密码登录" name="account">
        <AccountPasswordLogin @switch-to-forgot-password="showForgotPasswordForm = true" />
      </el-tab-pane>
      <!--手机登录-->
      <el-tab-pane label="手机登录" name="phone">
        <PhoneLogin />
      </el-tab-pane>
      <!--邮箱登录-->
      <el-tab-pane label="邮箱登录" name="email">
        <EmailLogin />
      </el-tab-pane>
    </el-tabs>

    <!-- 第三方登录方式 -->
    <el-form-item class="social-login">
      <div class="social-login-separator">
        <span class="social-login-text">其他登录方式</span>
      </div>
      <div class="social-login-buttons">
        <el-tooltip content="微信登录" placement="bottom">
          <el-button
              type="default"
              size="large"
              circle
              class="social-btn wechat-btn"
              @click="debouncedHandleWechatLogin"
          >
            <svg t="1766631055837" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13154" width="2em" height="2em">
              <path d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z" fill="#28C445" p-id="13155"></path>
              <path d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z" fill="#28C445" p-id="13156"></path>
            </svg>
          </el-button>
        </el-tooltip>
        <el-tooltip content="QQ登录" placement="bottom">
          <el-button
              type="default"
              size="large"
              circle
              class="social-btn qq-btn"
              @click="debouncedHandleQQLogin"
          >
            <svg t="1766630792106" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10424" width="2em" height="2em">
              <path d="M511.037 986.94c-85.502 0-163.986-26.686-214.517-66.544-25.66 7.149-58.486 18.655-79.202 32.921-17.725 12.202-15.516 24.647-12.32 29.67 14.027 22.069 240.622 14.092 306.04 7.219v-3.265z" fill="#FAAD08" p-id="10425"></path>
              <path d="M495.627 986.94c85.501 0 163.986-26.686 214.518-66.544 25.66 7.149 58.485 18.655 79.203 32.921 17.724 12.202 15.512 24.647 12.32 29.67-14.027 22.069-240.623 14.092-306.042 7.219v-3.265z" fill="#FAAD08" p-id="10426"></path>
              <path d="M496.137 472.026c140.73-0.935 253.514-27.502 291.73-37.696 9.11-2.432 13.984-6.789 13.984-6.789 0.032-1.25 0.578-22.348 0.578-33.232 0-183.287-88.695-367.458-306.812-367.47C277.5 26.851 188.8 211.021 188.8 394.31c0 10.884 0.55 31.982 0.583 33.232 0 0 3.965 4.076 11.231 6.048 35.283 9.579 150.19 37.482 294.485 38.437h1.037zM883.501 626.967c-8.66-27.825-20.484-60.273-32.455-91.434 0 0-6.886-0.848-10.366 0.158-107.424 31.152-237.624 51.006-336.845 49.808h-1.026c-98.664 1.186-227.982-18.44-335.044-49.288-4.09-1.176-12.168-0.677-12.168-0.677-11.97 31.16-23.793 63.608-32.453 91.433-41.3 132.679-27.92 187.587-17.731 188.818 21.862 2.638 85.099-99.88 85.099-99.88 0 104.17 94.212 264.125 309.947 265.596a765.877 765.877 0 0 1 5.725 0c215.738-1.471 309.947-161.424 309.947-265.595 0 0 63.236 102.519 85.102 99.88 10.186-1.231 23.566-56.14-17.732-188.819" p-id="10427"></path>
              <path d="M429.208 303.911c-29.76 1.323-55.195-32.113-56.79-74.62-1.618-42.535 21.183-78.087 50.95-79.417 29.732-1.305 55.149 32.116 56.765 74.64 1.629 42.535-21.177 78.08-50.925 79.397m220.448-74.62c-1.593 42.507-27.03 75.941-56.79 74.62-29.746-1.32-52.553-36.862-50.924-79.397 1.614-42.526 27.03-75.948 56.764-74.639 29.77 1.33 52.57 36.881 50.951 79.417" fill="#FFFFFF" p-id="10428"></path>
              <path d="M695.405 359.069c-7.81-18.783-86.466-39.709-183.843-39.709h-1.045c-97.376 0-176.033 20.926-183.842 39.709a6.66 6.66 0 0 0-0.57 2.672c0 1.353 0.418 2.575 1.072 3.612 6.58 10.416 93.924 61.885 183.341 61.885h1.045c89.416 0 176.758-51.466 183.34-61.883a6.775 6.775 0 0 0 1.069-3.622 6.66 6.66 0 0 0-0.567-2.664" fill="#FAAD08" p-id="10429"></path>
              <path d="M464.674 239.335c1.344 16.946-7.87 32-20.55 33.645-12.701 1.647-24.074-10.755-25.426-27.71-1.326-16.954 7.873-32.008 20.534-33.64 12.722-1.652 24.114 10.76 25.442 27.705m77.97 8.464c2.702-4.392 21.149-27.488 59.328-19.078 10.028 2.208 14.667 5.457 15.646 6.737 1.445 1.888 1.84 4.576 0.375 8.196-2.903 7.174-8.894 6.979-12.217 5.575-2.144-0.907-28.736-16.948-53.232 6.99-1.685 1.648-4.7 2.212-7.558 0.258-2.856-1.956-4.038-5.923-2.342-8.678" p-id="10430"></path>
              <path d="M503.821 589.328h-1.031c-67.806 0.802-150.022-8.004-229.638-23.381-6.817 38.68-10.934 87.294-7.399 145.275 8.928 146.543 97.728 238.652 234.793 239.996h5.57c137.065-1.344 225.865-93.453 234.796-239.996 3.535-57.986-0.584-106.6-7.403-145.283-79.631 15.385-161.861 24.196-229.688 23.389" fill="#FFFFFF" p-id="10431"></path>
              <path d="M310.693 581.35v146.633s69.287 13.552 138.7 4.17V596.897c-43.974-2.413-91.4-7.79-138.7-15.546" fill="#EB1C26" p-id="10432"></path><path d="M806.504 427.238s-130.112 43.08-302.66 44.309h-1.025c-172.264-1.224-302.217-44.161-302.66-44.309L156.58 541.321c108.998 34.464 244.093 56.677 346.238 55.387l1.024-0.002c102.152 1.297 237.226-20.917 346.24-55.385l-43.579-114.083z" fill="#EB1C26" p-id="10433"></path>
            </svg>
          </el-button>
        </el-tooltip>
      </div>
    </el-form-item>

    <el-form-item class="register-link">
      <div class="register-text">
        没有账号？<el-link type="primary" @click="showRegisterForm = true">立即注册</el-link>
      </div>
    </el-form-item>
  </div>

  <!-- 注册 -->
  <div v-else-if="showRegisterForm" class="login-box register-form">
    <div class="register-header">
      <h2>学生注册</h2>
      <p>创建您的账户</p>
    </div>
    <!-- 注册表单 -->
    <RegisterForm @switch-to-login="showRegisterForm = false" />
  </div>

  <!-- 忘记密码 -->
  <div v-else-if="showForgotPasswordForm" class="login-box forgot-password-form">
    <div class="forgot-password-header">
      <h2>忘记密码</h2>
      <p>重置您的密码</p>
    </div>
    <!-- 忘记密码表单 -->
    <ForgotPasswordForm @switch-to-login="showForgotPasswordForm = false" />
  </div>

</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { debounce } from '@/utils/debounce';
import AccountPasswordLogin from './loginWay/AccountPasswordLogin.vue';
import PhoneLogin from './loginWay/PhoneLogin.vue';
import EmailLogin from './loginWay/EmailLogin.vue';
import RegisterForm from './other/RegisterForm.vue';
import ForgotPasswordForm from './other/ForgotPasswordForm.vue';

// 登录表单状态管理
const showRegisterForm = ref(false);
const showForgotPasswordForm = ref(false);
const activeLoginType = ref('account'); // 默认账号密码登录

// 第三方登录处理函数
const handleWechatLogin = () => {
  console.log('微信登录');
  // 这里可以实现微信登录逻辑
};

const handleQQLogin = () => {
  console.log('QQ登录');
  // 这里可以实现QQ登录逻辑
};

// 使用防抖函数，防止用户快速点击
const debouncedHandleWechatLogin = debounce(handleWechatLogin, 1000);
const debouncedHandleQQLogin = debounce(handleQQLogin, 1000);

// 组件挂载时预加载必要的资源
onMounted(() => {
  // 预加载第三方登录图标资源
  // 可以在这里添加其他预加载逻辑
});
</script>

<style scoped lang="scss">
.login-box {
  width: 100%;
  max-width: 420px;
  padding: 35px;
  margin: 0 4rem 0 4rem;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  transition: all 0.3s ease;
  animation: slideInFromLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both; /* 按照规范调整缓动函数 */
  will-change: transform, opacity;
  contain: layout style paint;
  opacity: 0; /* 初始透明度为0 */
  animation: slideInFromLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s forwards; /* 优化动画 */
}

.login-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  border-radius: inherit;
  z-index: -1;
}

.login-header {
  text-align: center;
  margin-bottom: 25px;
}

.login-header h2 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.captcha-form-item .captcha-input-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-form-item .captcha-input-container .code-btn {
  flex: none;
  min-width: 120px;
}

.captcha-image {
  width: 100px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #f0f2f5;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.captcha-image:hover {
  transform: scale(1.03);
  border-color: #409eff;
  box-shadow: 0 0 15px rgba(64, 158, 255, 0.3);
  background: #e6f7ff;
}

.captcha-image canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.login-button {
  width: 100%;
  margin-top: 8px; /* 减少按钮上方间距 */
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 1px;
  transform: translateY(0);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.45);
}

.login-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.login-options {
  margin-bottom: 12px; /* 减少间距 */
}

.login-options .login-options-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.register-link {
  text-align: center;
  margin-top: 12px; /* 减少间距 */
}

.register-link .register-text {
  font-size: 14px;
  color: #606266;
}

.social-login {
  margin-top: 20px; /* 减少间距 */
}

.social-login-separator {
  display: flex;
  align-items: center;
  margin-bottom: 15px; /* 减少间距 */
}

.social-login-separator::before,
.social-login-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #dcdfe6, transparent);
}

.social-login-text {
  color: #909399;
  font-size: 14px;
  padding: 0 15px;
  white-space: nowrap;
}

.social-login-buttons {
  display: flex;
  justify-content: center;
  gap: 20px; /* 减少间距 */
  width: 100%;
}

.social-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.social-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), transparent);
  z-index: 1;
}

.social-btn img {
  position: relative;
  z-index: 2;
  width: 22px;
  height: 22px;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.social-btn:hover img {
  transform: scale(1.1);
}

.wechat-btn {
  color: #07c160;
  border-color: #07c160;
  background: white;
}

.qq-btn {
  color: #12b7f5;
  border-color: #12b7f5;
  background: white;
}

.login-type-tabs {
  margin-bottom: 18px; /* 减少间距 */
}

.code-btn {
  width: 120px;
  border-radius: 8px;
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
  .presentation-box {
    display: none !important;
  }
}

@media (max-width: 768px) and (min-width: 481px) {
  .login-box {
    width: 90%;
  }

  .captcha-input-container {
    flex-direction: column;
  }

  .code-btn {
    width: 100%;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }

  .login-header h2 {
    font-size: 22px;
  }

  .login-button {
    height: 44px;
    font-size: 15px;
  }

  .social-login-buttons {
    gap: 15px;
  }

  .social-btn {
    width: 44px;
    height: 44px;
  }
}
</style>