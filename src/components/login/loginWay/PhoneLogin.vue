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
            size="large"
            class="code-btn"
            @click="sendPhoneCode"
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
          block
          round
          @click="handlePhoneLogin"
      >
        <el-icon><Iphone /></el-icon>
        手机登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthLogin } from '@/composables/useAuth'
import { School, Iphone } from '@element-plus/icons-vue'

const router = useRouter()
const { t } = useI18n()

// 登录表单数据
interface PhoneLoginFormState {
  school: string
  phone: string
  code: string
}

const phoneLoginForm = reactive<PhoneLoginFormState>({
  school: '',
  phone: '',
  code: '',
})

// 登录表单引用
const phoneLoginFormRef = ref<FormInstance>()

// 倒计时
const phoneCountdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 学校选项
interface SchoolOption {
  value: string
  label: string
}

const schools = ref<SchoolOption[]>([
  { value: 'tsinghua', label: '清华大学' },
  { value: 'pku', label: '北京大学' },
  { value: 'fudan', label: '复旦大学' },
  { value: 'sjtu', label: '上海交通大学' },
  { value: 'zju', label: '浙江大学' },
])

// 手机登录表单验证规则
const phoneLoginRules = reactive<FormRules<PhoneLoginFormState>>({
  school: [{ required: true, message: '请选择学校', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      pattern: /^\d{6}$/,
      message: '验证码为6位数字',
      trigger: 'blur',
    },
  ],
})

// 开始重发倒计时
function startCountdown(): void {
  phoneCountdown.value = 60
  countdownTimer = setInterval(() => {
    phoneCountdown.value--
    if (phoneCountdown.value <= 0 && countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

// 发送手机验证码（沿用旧实现：暂为前端模拟，后端短信契约就绪后接入 server 层）
const sendPhoneCode = async () => {
  if (!phoneLoginFormRef.value) return

  // 验证手机号
  const phoneValid = await phoneLoginFormRef.value.validateField('phone').catch(() => false)
  if (!phoneValid) return

  // 模拟发送验证码成功
  ElMessage.success(t('login.form.codeSent'))

  // 开始倒计时
  startCountdown()
}

// 登录：loading / 成功写 store / 实时通道建立均由 useAuthLogin 统一管理
const { run: runLogin, loading } = useAuthLogin({
  onSuccess: (result) => {
    ElMessage.success(result.message ?? '登录成功')
    router.push({ name: 'home' })
  },
  onError: (error) => {
    ElMessage.error(error.message || t('login.form.loginFail'))
  },
})

// 手机登录处理函数（沿用旧语义：暂跳过前端校验）
const handlePhoneLogin = () => {
  runLogin({
    roleId: 'student',
    loginType: 'phone',
    phone: phoneLoginForm.phone,
    code: phoneLoginForm.code,
  })
}

// 组件卸载前清理倒计时定时器，避免内存泄漏
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
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