<template>
  <!-- 登录表单 -->
  <div v-if="!showRegisterForm && !showForgotPasswordForm" class="login-box">
    <div class="login-header">
      <span class="header-badge">欢迎登录</span>
      <h2>开启成长之旅</h2>
      <p>登录您的账号，探索专属成长路径</p>
    </div>

    <!-- 登录方式切换 -->
    <div class="login-type-tabs">
      <div
        v-for="tab in loginTabs"
        :key="tab.name"
        class="tab-item"
        :class="{ active: activeLoginType === tab.name }"
        @click="activeLoginType = tab.name"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="tab-content">
      <transition name="tab-fade" mode="out-in">
        <div :key="activeLoginType">
          <!--账号密码登录-->
          <AccountPasswordLogin v-if="activeLoginType === 'account'" @switch-to-forgot-password="showForgotPasswordForm = true" @login-success="onLoginSuccess" />
          <!--手机登录-->
          <PhoneLogin v-else-if="activeLoginType === 'phone'" @login-success="onLoginSuccess" />
          <!--邮箱登录-->
          <EmailLogin v-else-if="activeLoginType === 'email'" @login-success="onLoginSuccess" />
        </div>
      </transition>
    </div>

    <!-- 第三方登录方式 -->
    <div class="social-login">
      <div class="social-login-separator">
        <span class="social-login-text">{{ t('login.social.text') }}</span>
      </div>
      <div class="social-login-buttons">
        <el-tooltip :content="t('login.social.wechat')" placement="bottom">
          <button class="social-btn wechat-btn" :aria-label="t('login.social.wechat')" @click="debouncedHandleWechatLogin">
            <svg viewBox="0 0 1024 1024" width="22" height="22">
              <path d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z" fill="#07c160"/>
              <path d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z" fill="#07c160"/>
            </svg>
          </button>
        </el-tooltip>
        <el-tooltip content="QQ登录" placement="bottom">
          <button class="social-btn qq-btn" aria-label="QQ登录" @click="debouncedHandleQQLogin">
            <svg viewBox="0 0 1024 1024" width="22" height="22">
              <path d="M511.037 986.94c-85.502 0-163.986-26.686-214.517-66.544-25.66 7.149-58.486 18.655-79.202 32.921-17.725 12.202-15.516 24.647-12.32 29.67 14.027 22.069 240.622 14.092 306.04 7.219v-3.265z" fill="#FAAD08"/>
              <path d="M495.627 986.94c85.501 0 163.986-26.686 214.518-66.544 25.66 7.149 58.485 18.655 79.203 32.921 17.724 12.202 15.512 24.647 12.32 29.67-14.027 22.069-240.623 14.092-306.042 7.219v-3.265z" fill="#FAAD08"/>
              <path d="M496.137 472.026c140.73-0.935 253.514-27.502 291.73-37.696 9.11-2.432 13.984-6.789 13.984-6.789 0.032-1.25 0.578-22.348 0.578-33.232 0-183.287-88.695-367.458-306.812-367.47C277.5 26.851 188.8 211.021 188.8 394.31c0 10.884 0.55 31.982 0.583 33.232 0 0 3.965 4.076 11.231 6.048 35.283 9.579 150.19 37.482 294.485 38.437h1.037zM883.501 626.967c-8.66-27.825-20.484-60.273-32.455-91.434 0 0-6.886-0.848-10.366 0.158-107.424 31.152-237.624 51.006-336.845 49.808h-1.026c-98.664 1.186-227.982-18.44-335.044-49.288-4.09-1.176-12.168-0.677-12.168-0.677-11.97 31.16-23.793 63.608-32.453 91.433-41.3 132.679-27.92 187.587-17.731 188.818 21.862 2.638 85.099-99.88 85.099-99.88 0 104.17 94.212 264.125 309.947 265.596a765.877 765.877 0 0 1 5.725 0c215.738-1.471 309.947-161.424 309.947-265.595 0 0 63.236 102.519 85.102 99.88 10.186-1.231 23.566-56.14-17.732-188.819" fill="#12B7F5"/>
              <path d="M429.208 303.911c-29.76 1.323-55.195-32.113-56.79-74.62-1.618-42.535 21.183-78.087 50.95-79.417 29.732-1.305 55.149 32.116 56.765 74.64 1.629 42.535-21.177 78.08-50.925 79.397m220.448-74.62c-1.593 42.507-27.03 75.941-56.79 74.62-29.746-1.32-52.553-36.862-50.924-79.397 1.614-42.526 27.03-75.948 56.764-74.639 29.77 1.33 52.57 36.881 50.951 79.417" fill="#fff"/>
              <path d="M695.405 359.069c-7.81-18.783-86.466-39.709-183.843-39.709h-1.045c-97.376 0-176.033 20.926-183.842 39.709a6.66 6.66 0 0 0-0.57 2.672c0 1.353 0.418 2.575 1.072 3.612 6.58 10.416 93.924 61.885 183.341 61.885h1.045c89.416 0 176.758-51.466 183.34-61.883a6.775 6.775 0 0 0 1.069-3.622 6.66 6.66 0 0 0-0.567-2.664" fill="#FAAD08"/>
            </svg>
          </button>
        </el-tooltip>
      </div>
    </div>

    <div class="register-link">
      <span>{{ t('login.register.prompt') }}</span>
      <button class="register-btn" @click="showRegisterForm = true">{{ t('login.register.btn') }}</button>
    </div>
  </div>

  <!-- 注册 -->
  <div v-else-if="showRegisterForm" class="login-box register-form">
    <div class="login-header">
      <span class="header-badge">加入我们</span>
      <h2>创建账号</h2>
      <p>注册您的账户，开始探索之旅</p>
    </div>
    <RegisterForm @switch-to-login="showRegisterForm = false" />
  </div>

  <!-- 忘记密码 -->
  <div v-else-if="showForgotPasswordForm" class="login-box forgot-password-form">
    <div class="login-header">
      <span class="header-badge">{{ t('login.header.forgotBadge') }}</span>
      <h2>{{ t('login.header.forgotTitle') }}</h2>
      <p>{{ t('login.header.forgotDesc') }}</p>
    </div>
    <ForgotPasswordForm @switch-to-login="showForgotPasswordForm = false" />
  </div>

</template>

<script setup lang="ts">
/**
 * 【business】LoginForm —— 登录方式装配（账号/手机/邮箱 tab + 第三方登录 + 注册/忘记密码入口）
 * - 子表单的 login-success 事件透传给页面层，跳转与 store 写入由页面处理
 */
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { debounce } from '@/utils/debounce';
import AccountPasswordLogin from './login-way/AccountPasswordLogin.vue';
import PhoneLogin from './login-way/PhoneLogin.vue';
import EmailLogin from './login-way/EmailLogin.vue';
import RegisterForm from './other/RegisterForm.vue';
import ForgotPasswordForm from './other/ForgotPasswordForm.vue';

const { t } = useI18n();

type LoginType = 'account' | 'phone' | 'email';

// 透传子表单登录成功事件给页面层
const emit = defineEmits<{ (e: 'login-success', payload?: { remember?: boolean }): void }>();
const onLoginSuccess = (payload?: { remember?: boolean }) => emit('login-success', payload);

// 登录表单状态管理
const showRegisterForm = ref(false);
const showForgotPasswordForm = ref(false);
const activeLoginType = ref<LoginType>('account');

// 登录方式标签
const loginTabs = computed<{ name: LoginType; label: string }[]>(() => [
  { name: 'account', label: t('login.tabs.account') },
  { name: 'phone', label: t('login.tabs.phone') },
  { name: 'email', label: t('login.tabs.email') }
]);

// 第三方登录处理函数
const handleWechatLogin = () => {
  ElMessage.info(t('login.social.wechat') + ' ' + t('common.loading'));
};

const handleQQLogin = () => {
  ElMessage.info(t('login.social.qq') + ' ' + t('common.loading'));
};

const debouncedHandleWechatLogin = debounce(handleWechatLogin, 1000);
const debouncedHandleQQLogin = debounce(handleQQLogin, 1000);
</script>

<style scoped>
.login-box {
  width: 100%;
  max-width: 420px;
  flex-shrink: 0;
  padding: 28px 32px;
  background: color-mix(in srgb, white 96%, transparent);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, white 50%, transparent);
  box-shadow:
    0 20px 50px -12px color-mix(in srgb, black 35%, transparent),
    0 0 0 1px color-mix(in srgb, white 10%, transparent);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}

/* 标题区 */
.login-header {
  text-align: left;
  margin-bottom: 18px;
}

.header-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: var(--ink-500);
  background: var(--ink-100);
  padding: 5px 12px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.login-header h2 {
  margin: 0 0 6px;
  font-size: 24px;
  color: var(--ink-900);
  font-weight: 800;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.login-header p {
  margin: 0;
  color: var(--ink-500);
  font-size: 14px;
  letter-spacing: 0.3px;
}

/* 登录方式切换标签 */
.login-type-tabs {
  display: flex;
  background: var(--ink-100);
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 16px;
  gap: 2px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 13px;
  color: var(--ink-500);
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.tab-item:hover {
  color: var(--ink-900);
}

.tab-item.active {
  background: white;
  color: var(--brand-primary);
  font-weight: 700;
  box-shadow: 0 2px 8px color-mix(in srgb, var(--brand-primary) 12%, transparent);
}

.tab-content {
  min-height: 280px;
}

.tab-fade-enter-active {
  transition: all 0.3s ease;
}

.tab-fade-leave-active {
  transition: all 0.2s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 第三方登录 */
.social-login {
  margin-top: 14px;
}

.social-login-separator {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.social-login-separator::before,
.social-login-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--ink-200), transparent);
}

.social-login-text {
  color: var(--ink-400);
  font-size: 12px;
  padding: 0 14px;
  white-space: nowrap;
  font-weight: 500;
}

.social-login-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.social-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid var(--ink-200);
  background: white;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px color-mix(in srgb, black 12%, transparent);
  border-color: transparent;
}

.wechat-btn:hover {
  background: #07c160; /* stylelint-disable-line color-no-hex, function-allowed-list */
}

.qq-btn:hover {
  background: #12b7f5; /* stylelint-disable-line color-no-hex, function-allowed-list */
}

.wechat-btn:hover svg path,
.qq-btn:hover svg path {
  fill: white !important;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 12px;
  font-size: 14px;
  color: var(--ink-500);
}

.register-btn {
  margin-left: 6px;
  background: none;
  border: none;
  color: var(--brand-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.register-btn:hover {
  color: var(--color-info);
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (width <= 480px) {
  .login-box {
    padding: 28px 22px;
    max-width: 100%;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .social-login-buttons {
    gap: 14px;
  }

  .social-btn {
    width: 44px;
    height: 44px;
  }
}

/* 矮视口兜底：进一步压缩卡片内边距，保证整屏放得下 */
@media (height <= 760px) {
  .login-box {
    padding: 20px 28px;
  }

  .login-header {
    margin-bottom: 14px;
  }
}
</style>
