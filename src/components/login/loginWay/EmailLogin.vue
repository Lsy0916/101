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

    <el-form-item prop="email">
      <el-input
          v-model="emailLoginForm.email"
          placeholder="请输入邮箱"
          prefix-icon="Message"
          size="large"
          clearable
      />
    </el-form-item>

    <el-form-item prop="code" class="captcha-form-item">
      <div class="captcha-input-container">
        <el-input
            v-model="emailLoginForm.code"
            placeholder="请输入验证码"
            size="large"
            maxlength="6"
        />
        <el-button
            :disabled="emailCountdown > 0"
            @click="handleSendEmailCode"
            size="large"
            class="code-btn"
        >
          {{ emailCountdown > 0 ? `${emailCountdown}s后重发` : '获取验证码' }}
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
        邮箱登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import { sendEmailCode as apiSendEmailCode } from '@/api/captcha';
import { School, Message } from '@element-plus/icons-vue';

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
const emailLoginRules = reactive({
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱格式',
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
      ElMessage.success('验证码已发送');

      // 开始倒计时
      emailCountdown.value = 60;
      countdownTimer = setInterval(() => {
        emailCountdown.value--;
        if (emailCountdown.value <= 0) {
          clearInterval(countdownTimer);
        }
      }, 1000);
    } else {
      ElMessage.error(response.message || '验证码发送失败');
    }
  } catch (error) {
    console.error('发送邮箱验证码失败:', error);
    ElMessage.error('验证码发送失败，请稍后重试');
  }
};

// 邮箱登录处理函数
const handleEmailLogin = async () => {
  if (!emailLoginFormRef.value) return;

  // 验证表单
  await emailLoginFormRef.value.validate((valid) => {
    if (valid) {
      // 设置加载状态
      loading.value = true;

      // 调用登录API
      const authStore = useAuthStore();
      authStore.login({
        roleId: 'student',
        loginType: 'email', // 邮箱登录
        email: emailLoginForm.email,
        code: emailLoginForm.code
      }).then(result => {
        if (result.success) {
          ElMessage.success(result.message);
          // 登录成功后跳转到学生首页
          window.location.href = '/student';
        } else {
          ElMessage.error(result.message);
        }
      }).catch(error => {
        ElMessage.error(error.message || '登录失败');
      }).finally(() => {
        loading.value = false;
      });
    } else {
      console.log('表单验证失败');
      return false;
    }
  });
};
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
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.45);
}

.login-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}
</style>
