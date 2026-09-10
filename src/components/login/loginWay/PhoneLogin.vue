<!--手机号验证码登录方式-->

<template>
  <el-form
      ref="phoneLoginFormRef"
      :model="phoneLoginForm"
      :rules="phoneLoginRules"
      class="login-form"
      @keyup.enter="handlePhoneLogin"
  >
    <el-form-item prop="school">
      <el-select
          v-model="phoneLoginForm.school"
          placeholder="请选择学校"
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

    <el-form-item prop="phone">
      <el-input
          v-model="phoneLoginForm.phone"
          placeholder="请输入手机号"
          prefix-icon="Iphone"
          size="large"
          clearable
      />
    </el-form-item>

    <el-form-item prop="code" class="captcha-form-item">
      <div class="captcha-input-container">
        <el-input
            v-model="phoneLoginForm.code"
            placeholder="请输入验证码"
            size="large"
            maxlength="6"
        />
        <el-button
            :disabled="phoneCountdown > 0"
            @click="sendPhoneCode"
            size="large"
            class="code-btn"
        >
          {{ phoneCountdown > 0 ? t('login.form.codeResend', { n: phoneCountdown }) : t('login.form.getCode') }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
          type="primary"
          size="large"
          class="login-button"
          :loading="loading"
          @click="handlePhoneLogin"
          block
          round
      >
        <el-icon><Iphone /></el-icon>
        手机登录
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
import { School, Iphone } from '@element-plus/icons-vue';

const router = useRouter();
const { t } = useI18n();

// 登录表单数据
const phoneLoginForm = reactive({
  school: '',
  phone: '',
  code: ''
});

// 登录表单引用
const phoneLoginFormRef = ref();

// 加载状态
const loading = ref(false);

// 倒计时
const phoneCountdown = ref(0);
let countdownTimer = null;

// 学校选项
const schools = ref([
  { value: 'tsinghua', label: '清华大学' },
  { value: 'pku', label: '北京大学' },
  { value: 'fudan', label: '复旦大学' },
  { value: 'sjtu', label: '上海交通大学' },
  { value: 'zju', label: '浙江大学' }
]);

// 手机登录表单验证规则
const phoneLoginRules = reactive({
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$/, 
      message: '请输入正确的手机号码', 
      trigger: 'blur' 
    }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { 
      pattern: /^\d{6}$/, 
      message: '验证码为6位数字', 
      trigger: 'blur' 
    }
  ]
});

// 发送手机验证码
const sendPhoneCode = async () => {
  if (!phoneLoginFormRef.value) return;
  
  // 验证手机号
  const phoneValid = await phoneLoginFormRef.value.validateField('phone').catch(() => false);
  if (!phoneValid) return;

  // 模拟发送验证码成功
  ElMessage.success(t('login.form.codeSent'));
  
  // 开始倒计时
  phoneCountdown.value = 60;
  countdownTimer = setInterval(() => {
    phoneCountdown.value--;
    if (phoneCountdown.value <= 0) {
      clearInterval(countdownTimer);
    }
  }, 1000);
};

// 手机登录处理函数
const handlePhoneLogin = async () => {
  // 临时：跳过校验，只要输入即可登录用于查看效果
  loading.value = true;

  const authStore = useAuthStore();
  authStore.login({
    roleId: 'student',
    loginType: 'phone',
    phone: phoneLoginForm.phone,
    code: phoneLoginForm.code
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
  margin-top: 8px; /* 减少按钮上方间距 */
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