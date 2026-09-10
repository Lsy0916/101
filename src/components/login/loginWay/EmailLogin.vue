<!--邮箱验证码登录方式-->

<template>
  <el-form
      ref="emailLoginFormRef"
      :model="emailLoginForm"
      :rules="emailLoginRules"
      class="login-form"
      @keyup.enter="handleEmailLogin"
  >
    <el-form-item prop="school">
      <el-select
          v-model="emailLoginForm.school"
          :placeholder="t('login.form.schoolPlaceholder')"
          size="large"
          clearable
          filterable
      >
        <template #prefix>
          <el-icon><School /></el-icon>
        </template>
        <el-option
            v-for="school in schools"
            :key="school.value"
            :label="school.label"
            :value="school.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="email">
      <el-input
          v-model="emailLoginForm.email"
          :placeholder="t('login.form.emailPlaceholder')"
          prefix-icon="Message"
          size="large"
          clearable
      />
    </el-form-item>

    <el-form-item prop="code" class="captcha-form-item">
      <div class="captcha-input-container">
        <el-input
            v-model="emailLoginForm.code"
            :placeholder="t('login.form.codePlaceholder')"
            size="large"
            maxlength="6"
        />
        <el-button
            :disabled="emailCountdown > 0"
            @click="handleSendEmailCode"
            size="large"
            class="code-btn"
        >
          {{ emailCountdown > 0 ? t('login.form.codeResend', { n: emailCountdown }) : t('login.form.getCode') }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
          type="primary"
          size="large"
          class="login-button"
          :loading="loading"
          @click="handleEmailLogin"
          block
          round
      >
        <el-icon><Message /></el-icon>
        {{ t('login.form.emailBtn') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import { sendEmailCode as apiSendEmailCode } from '@/api/captcha';
import { School, Message } from '@element-plus/icons-vue';

const router = useRouter();
const { t } = useI18n();

// 登录表单数据
const emailLoginForm = reactive({
  school: '',
  email: '',
  code: ''
});

// 登录表单引用
const emailLoginFormRef = ref();

// 加载状态
const loading = ref(false);

// 倒计时
const emailCountdown = ref(0);
let countdownTimer = null;

// 学校选项
const schools = ref([
  { value: 'tsinghua', label: '清华大学' },
  { value: 'nist', label: '宁夏理工学院' }
]);

// 邮箱登录表单验证规则
const emailLoginRules = computed(() => ({
  school: [
    { required: true, message: t('login.form.schoolRequired'), trigger: 'change' }
  ],
  email: [
    { required: true, message: t('login.form.emailRequired'), trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: t('login.form.emailFormat'),
      trigger: 'blur'
    }
  ],
  code: [
    { required: true, message: t('login.form.codeRequired'), trigger: 'blur' },
    {
      pattern: /^\d{6}$/,
      message: t('login.form.codeFormat'),
      trigger: 'blur'
    }
  ]
}));

// 发送邮箱验证码
const handleSendEmailCode = async () => {
  if (!emailLoginFormRef.value) return;

  // 验证邮箱
  const emailValid = await emailLoginFormRef.value.validateField('email').catch(() => false);
  if (!emailValid) return;

  try {
    // 调用发送邮箱验证码的API
    const response = await apiSendEmailCode({
      email: emailLoginForm.email,
      type: 'login' // 登录验证码
    });

    if (response.status === 200) {
      ElMessage.success(t('login.form.codeSent'));

      // 开始倒计时
      emailCountdown.value = 60;
      countdownTimer = setInterval(() => {
        emailCountdown.value--;
        if (emailCountdown.value <= 0) {
          clearInterval(countdownTimer);
        }
      }, 1000);
    } else {
      ElMessage.error(response.message || t('login.form.codeSendFail'));
    }
  } catch {
    ElMessage.error(t('login.form.codeSendRetry'));
  }
};

// 邮箱登录处理函数
const handleEmailLogin = async () => {
  // 临时：跳过校验，只要输入即可登录用于查看效果
  loading.value = true;

  const authStore = useAuthStore();
  authStore.login({
    roleId: 'student',
    loginType: 'email',
    email: emailLoginForm.email,
    code: emailLoginForm.code
  }).then(result => {
    if (result.success) {
      ElMessage.success(result.message);
      router.push({ name: 'home' });
    } else {
      ElMessage.error(result.message);
    }
  }).catch(error => {
    ElMessage.error(error.message || t('login.form.loginFail'));
  }).finally(() => {
    loading.value = false;
  });
};

// 组件卸载前清理倒计时定时器，避免内存泄漏
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>

<style scoped lang="scss">
.captcha-form-item .captcha-input-container {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-form-item .captcha-input-container .code-btn {
  flex: none;
  min-width: 120px;
}

.login-button {
  width: 100%;
  margin-top: 8px;
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 1px;
  transform: translateY(0);
  background: linear-gradient(135deg, #0052d9, #1890ff);
  border: none;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.4);
}

.login-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.35);
}
</style>
