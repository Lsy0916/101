<!-- 学生登录页面 -->
<template>
  <div class="login-container">
    <div class="theme-toggle">
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        @change="debouncedToggleDark"
      />
    </div>

    <div class="content-wrapper">
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

      <!-- 登录表单 -->
      <div v-if="!showRegisterForm && !showForgotPasswordForm" class="login-box">
        <div class="login-header">
          <h2>生涯心旅</h2>
          <p>学生登录</p>
        </div>

        <!-- 登录方式切换 -->
        <el-tabs v-model="activeLoginType" type="border-card" class="login-type-tabs">
          <el-tab-pane label="账号密码登录" name="account">
            <el-form
              ref="loginFormRef"
              :model="loginForm"
              :rules="loginRules"
              class="login-form"
              @keyup.enter="handleLogin"
            >
              <el-form-item prop="school">
                <el-select
                  v-model="loginForm.school"
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

              <el-form-item prop="userId">
                <el-input
                  v-model="loginForm.userId"
                  placeholder="请输入学号"
                  prefix-icon="User"
                  size="large"
                  clearable
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  prefix-icon="Lock"
                  size="large"
                  show-password
                />
              </el-form-item>

              <el-form-item prop="captcha" class="captcha-form-item">
                <div class="captcha-input-container">
                  <el-input
                    v-model="loginForm.captcha"
                    placeholder="请输入验证码"
                    size="large"
                    maxlength="4"
                  />
                  <div class="captcha-image" @click="generateCaptcha">
                    <canvas
                      ref="captchaCanvas"
                      width="100"
                      height="40"
                    />
                  </div>
                </div>
              </el-form-item>

              <el-form-item class="login-options">
                <div class="login-options-container">
                  <el-checkbox v-model="loginForm.remember" label="保存登录信息" />
                  <el-link type="primary" @click="showForgotPasswordForm = true" underline="never">忘记密码？</el-link>
                </div>
              </el-form-item>

              <el-form-item>
                <el-button
                  type="primary"
                  size="large"
                  class="login-button"
                  :loading="loading"
                  @click="handleLogin"
                  block
                  round
                >
                  <el-icon><User/></el-icon>
                  学生登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="手机登录" name="phone">
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
                    {{ phoneCountdown > 0 ? `${phoneCountdown}s后重发` : '获取验证码' }}
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
          </el-tab-pane>

          <el-tab-pane label="邮箱登录" name="email">
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
                    @click="sendEmailCode"
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
          </el-tab-pane>
        </el-tabs>

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
                <img src="../../assets/WeChat.svg" alt="WeChat" style="width: 2em; height: 2em;" />
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
                <img src="../../assets/QQ.svg" alt="QQ" style="width: 2em; height: 2em;" />
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

      <!-- 注册表单 -->
      <div v-else-if="showRegisterForm" class="login-box register-form">
        <div class="register-header">
          <h2>学生注册</h2>
          <p>创建您的账户</p>
        </div>

        <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          class="register-form-content"
          @keyup.enter="handleRegister"
        >
          <el-form-item prop="school">
            <el-select
              v-model="registerForm.school"
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

          <el-form-item prop="userId">
            <el-input
              v-model="registerForm.userId"
              placeholder="请输入学号"
              prefix-icon="User"
              size="large"
              clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item prop="captcha" class="captcha-form-item">
            <div class="captcha-input-container">
              <el-input
                v-model="registerForm.captcha"
                placeholder="请输入验证码"
                size="large"
                maxlength="4"
              />
              <div class="captcha-image" @click="generateCaptcha">
                <canvas
                  ref="captchaCanvas"
                  width="100"
                  height="40"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="register-button"
              :loading="registerLoading"
              @click="handleRegister"
              block
              round
            >
              <el-icon><User /></el-icon>
              注册账号
            </el-button>
          </el-form-item>

          <el-form-item class="back-to-login">
            <el-link type="primary" @click="showRegisterForm = false" underline="never">
              <el-icon><Back /></el-icon>
              返回登录
            </el-link>
          </el-form-item>
        </el-form>
      </div>

      <!-- 忘记密码表单 -->
      <div v-else class="login-box forgot-password-form">
        <div class="forgot-password-header">
          <h2>找回密码</h2>
          <p>重置您的登录密码</p>
        </div>

        <el-form
          ref="forgotPasswordFormRef"
          :model="forgotPasswordForm"
          :rules="forgotPasswordRules"
          class="forgot-password-form-content"
          @keyup.enter="handleForgotPassword"
        >
          <el-form-item prop="school">
            <el-select
              v-model="forgotPasswordForm.school"
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

          <el-form-item prop="userId">
            <el-input
              v-model="forgotPasswordForm.userId"
              placeholder="请输入学号"
              prefix-icon="User"
              size="large"
              clearable
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="forgotPasswordForm.email"
              placeholder="请输入注册邮箱"
              prefix-icon="Message"
              size="large"
              clearable
            />
          </el-form-item>

          <el-form-item prop="newPass">
            <el-input
              v-model="forgotPasswordForm.newPass"
              type="password"
              placeholder="请输入新密码"
              prefix-icon="Lock"
              size="large"
              show-password
            />
          </el-form-item>

          <el-form-item prop="captcha" class="captcha-form-item">
            <div class="captcha-input-container">
              <el-input
                v-model="forgotPasswordForm.captcha"
                placeholder="请输入验证码"
                size="large"
                maxlength="4"
              />
              <div class="captcha-image" @click="generateCaptcha">
                <canvas
                  ref="captchaCanvas"
                  width="100"
                  height="40"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              class="forgot-password-button"
              :loading="forgotPasswordLoading"
              @click="handleForgotPassword"
              block
              round
            >
              <el-icon><Key /></el-icon>
              重置密码
            </el-button>
          </el-form-item>

          <el-form-item class="back-to-login">
            <el-link type="primary" @click="showForgotPasswordForm = false" underline="never">
              <el-icon><Back /></el-icon>
              返回登录
            </el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { Sunny, Moon, User, Lock, School, Back, Key, Message, Iphone } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { debounce } from '@/utils/debounce.js'
import { sendEmailVerificationCode } from '@/utils/emailCode.js'

// 使用 Pinia store
const authStore = useAuthStore()

// 路由
const router = useRouter()
const route = useRoute()

// 表单引用
const loginFormRef = ref()
const phoneLoginFormRef = ref()
const emailLoginFormRef = ref()
const registerFormRef = ref()
const forgotPasswordFormRef = ref()

// 状态
const loading = ref(false)
const registerLoading = ref(false)
const forgotPasswordLoading = ref(false)
const isDark = ref(false)
const showRegisterForm = ref(false)
const showForgotPasswordForm = ref(false)
const captchaText = ref('')
const activeLoginType = ref('account') // 新增：当前登录方式

// 验证码倒计时
const phoneCountdown = ref(0)
const emailCountdown = ref(0)
let phoneCountdownTimer = null
let emailCountdownTimer = null

// 学校列表
const schools = ref([
  { value: 'university1', label: '清华大学' },
  { value: 'university2', label: '北京大学' },
  { value: 'university3', label: '复旦大学' },
  { value: 'university4', label: '上海交通大学' },
  { value: 'university5', label: '中山大学' },
  { value: 'university6', label: '华南理工大学' },
  { value: 'university7', label: '华中科技大学' },
  { value: 'university8', label: '西安交通大学' },
  { value: 'university9', label: '哈尔滨工业大学' },
  { value: 'university10', label: '北京航空航天大学' }
])

// 表单数据
const loginForm = reactive({
  school: '',
  userId: '',
  password: '',
  captcha: '', // 验证码
  roleId: 'student',
  remember: false
})

// 手机登录表单数据
const phoneLoginForm = reactive({
  phone: '',
  code: '',
  school: '',
  roleId: 'student'
})

// 邮箱登录表单数据
const emailLoginForm = reactive({
  email: '',
  code: '',
  school: '',
  roleId: 'student'
})

// 注册表单数据
const registerForm = reactive({
  school: '',
  userId: '',
  password: '',
  confirmPassword: '',
  captcha: '', // 验证码
  roleId: 'student'
})

// 忘记密码表单数据
const forgotPasswordForm = reactive({
  school: '',
  userId: '',
  email: '',
  captcha: '',
  newPass: ''
})

// 生成随机验证码文本
const generateCaptchaText = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 绘制验证码
const drawCaptcha = (canvas) => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 使用 requestAnimationFrame 优化渲染性能
  requestAnimationFrame(() => {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置画布背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f0f2f5');
    gradient.addColorStop(1, '#e6f7ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 生成验证码文本
    const txt = generateCaptchaText();
    captchaText.value = txt;

    // 绘制文字
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 为每个字符设置不同颜色
    for (let i = 0; i < txt.length; i++) {
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;
      ctx.fillText(txt[i], (i + 0.5) * canvas.width / 4, canvas.height / 2);
    }

    // 添加干扰线
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 添加干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

// 生成验证码
const generateCaptcha = () => {
  const captchaCanvas = document.querySelector('canvas');
  if (captchaCanvas) {
    drawCaptcha(captchaCanvas);
  }
}

// 防抖验证码生成函数，优化INP性能
const debouncedGenerateCaptcha = debounce(() => {
  generateCaptcha();
}, 300, true);

// 表单验证规则
const loginRules = {
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  userId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== captchaText.value.toLowerCase()) {
          callback(new Error('验证码不正确'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
}

// 手机登录验证规则
const phoneLoginRules = {
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' }
  ]
}

// 邮箱登录验证规则
const emailLoginRules = {
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位数字验证码', trigger: 'blur' }
  ]
}

const handleLogin = debounce(async () => {
  if (!loginFormRef.value) {
    ElMessage.error('请填写完整信息')
    return
  }

  await loginFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请填写完整信息')
      return
    }

    try {
      // 开启加载动画
      loading.value = true

      // 调用登录接口
      const result = await authStore.login({
        userId: loginForm.userId,
        password: loginForm.password,
        roleId: loginForm.roleId,
        remember: loginForm.remember,
        school: loginForm.school,
        captcha: loginForm.captcha
      })

      if (result.success) {
        // 确保是学生角色
        const data = result.data

        if (data.roleId === 'student') {
          ElMessage.success('学生登录成功')
          // 跳转到首页
          router.push('/dashboard')
        } else {
          ElMessage.error('请使用正确的登录入口')
          authStore.logout()
          router.push('/login')
        }
      } else {
        // 根据错误类型提供更具体的提示
        if (result.message && result.message.includes('服务器')) {
          ElMessage.error('服务器暂时不可用，请稍后再试')
        } else {
          ElMessage.error(result.message || '登录失败')
        }
        // 添加更多调试信息
        console.log('登录失败详情:', result)
      }
    } catch (error) {
      console.error('登录异常:', error)
      if (error.message && error.message.includes('服务器')) {
        ElMessage.error('服务器暂时不可用，请稍后再试')
      } else {
        ElMessage.error('登录过程中发生错误: ' + (error.message || '未知错误'))
      }
    } finally {
      loading.value = false
    }
  })
}, 1000, true)

// 手机登录处理
const handlePhoneLogin = debounce(async () => {
  if (!phoneLoginFormRef.value) {
    ElMessage.error('请填写完整信息')
    return
  }

  await phoneLoginFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请填写完整信息')
      return
    }

    try {
      loading.value = true

      // 调用登录接口（这里需要根据实际API进行调整）
      // 假设API支持手机号登录
      const result = await authStore.login({
        phone: phoneLoginForm.phone,
        code: phoneLoginForm.code,
        school: phoneLoginForm.school,
        roleId: phoneLoginForm.roleId,
        loginType: 'phone'
      })

      if (result.success) {
        // 确保是学生角色
        const data = result.data

        if (data.roleId === 'student') {
          ElMessage.success('手机登录成功')
          // 跳转到首页
          router.push('/dashboard')
        } else {
          ElMessage.error('请使用正确的登录入口')
          authStore.logout()
          router.push('/login')
        }
      } else {
        // 根据错误类型提供更具体的提示
        if (result.message && result.message.includes('服务器')) {
          ElMessage.error('服务器暂时不可用，请稍后再试')
        } else {
          ElMessage.error(result.message || '登录失败')
        }
        // 添加更多调试信息
        console.log('手机登录失败详情:', result)
      }
    } catch (error) {
      console.error('手机登录异常:', error)
      if (error.message && error.message.includes('服务器')) {
        ElMessage.error('服务器暂时不可用，请稍后再试')
      } else {
        ElMessage.error('手机登录过程中发生错误: ' + (error.message || '未知错误'))
      }
    } finally {
      loading.value = false
    }
  })
}, 1000, true)

// 邮箱登录处理
const handleEmailLogin = debounce(async () => {
  if (!emailLoginFormRef.value) {
    ElMessage.error('请填写完整信息')
    return
  }

  await emailLoginFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请填写完整信息')
      return
    }

    try {
      loading.value = true

      // 调用登录接口（这里需要根据实际API进行调整）
      // 假设API支持邮箱登录
      const result = await authStore.login({
        email: emailLoginForm.email,
        code: emailLoginForm.code,
        school: emailLoginForm.school,
        roleId: emailLoginForm.roleId,
        loginType: 'email'
      })

      if (result.success) {
        // 确保是学生角色
        const data = result.data

        if (data.roleId === 'student') {
          ElMessage.success('邮箱登录成功')
          // 跳转到首页
          router.push('/dashboard')
        } else {
          ElMessage.error('请使用正确的登录入口')
          authStore.logout()
          router.push('/login')
        }
      } else {
        // 根据错误类型提供更具体的提示
        if (result.message && result.message.includes('服务器')) {
          ElMessage.error('服务器暂时不可用，请稍后再试')
        } else {
          ElMessage.error(result.message || '登录失败')
        }
        // 添加更多调试信息
        console.log('邮箱登录失败详情:', result)
      }
    } catch (error) {
      console.error('邮箱登录异常:', error)
      if (error.message && error.message.includes('服务器')) {
        ElMessage.error('服务器暂时不可用，请稍后再试')
      } else {
        ElMessage.error('邮箱登录过程中发生错误: ' + (error.message || '未知错误'))
      }
    } finally {
      loading.value = false
    }
  })
}, 1000, true)

// 发送手机验证码
const sendPhoneCode = debounce(async () => {
  if (!phoneLoginFormRef.value) {
    ElMessage.error('请先输入手机号')
    return
  }

  await phoneLoginFormRef.value.validateField('phone', (errorMessage) => {
    if (errorMessage) {
      ElMessage.error(errorMessage)
      return
    }

    // 启动倒计时
    phoneCountdown.value = 60
    phoneCountdownTimer = setInterval(() => {
      phoneCountdown.value--
      if (phoneCountdown.value <= 0) {
        clearInterval(phoneCountdownTimer)
      }
    }, 1000)

    // 这里应该调用发送手机验证码的API
    // 模拟发送成功
    ElMessage.success(`验证码已发送至 ${phoneLoginForm.phone}`)
  })
}, 1000, true)

// 发送邮箱验证码
const sendEmailCode = debounce(async () => {
  if (!emailLoginFormRef.value) {
    ElMessage.error('请先输入邮箱')
    return
  }

  await emailLoginFormRef.value.validateField('email', (errorMessage) => {
    if (errorMessage) {
      ElMessage.error(errorMessage)
      return
    }

    // 启动倒计时
    emailCountdown.value = 60
    emailCountdownTimer = setInterval(() => {
      emailCountdown.value--
      if (emailCountdown.value <= 0) {
        clearInterval(emailCountdownTimer)
      }
    }, 1000)

    // 调用发送邮箱验证码的API
    sendEmailVerificationCode({
      roleId: 'student',
      userId: emailLoginForm.email, // 这里可以是邮箱
      email: emailLoginForm.email
    })
  })
}, 1000, true)

// 微信登录处理
const handleWechatLogin = () => {
  ElMessage.warning('微信登录功能开发中，敬请期待')
  // 实际开发中，这里应该调用微信登录API
  // 例如：跳转到微信授权页面或打开微信扫码登录弹窗
}

// QQ登录处理
const handleQQLogin = () => {
  ElMessage.warning('QQ登录功能开发中，敬请期待')
  // 实际开发中，这里应该调用QQ登录API
  // 例如：跳转到QQ授权页面或打开QQ登录弹窗
}

// 优化的社交登录处理，使用防抖减少重复点击
const debouncedHandleWechatLogin = debounce(() => {
  handleWechatLogin();
}, 500, true);

const debouncedHandleQQLogin = debounce(() => {
  handleQQLogin();
}, 500, true);

// 注册表单验证规则
const registerRules = {
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  userId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 2, max: 20, message: '学号长度在2-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/,
      message: '密码至少包含一个字母和一个数字',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== captchaText.value.toLowerCase()) {
          callback(new Error('验证码不正确'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理注册
const handleRegister = debounce(async () => {
  if (!registerFormRef.value) {
    ElMessage.error('请填写完整信息')
    return
  }

  await registerFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请填写完整信息')
      return
    }

    try {
      registerLoading.value = true

      // 调用注册API
      const result = await authStore.register({
        school: registerForm.school,
        userId: registerForm.userId,
        password: registerForm.password,
        roleId: registerForm.roleId,
        captcha: registerForm.captcha
      })

      if (result.success) {
        ElMessage.success(result.message || '注册成功')
        // 注册成功后返回登录界面
        showRegisterForm.value = false
      } else {
        ElMessage.error(result.message || '注册失败')
      }
    } catch (error) {
      console.error('注册异常:', error)
      ElMessage.error('注册过程中发生错误: ' + (error.message || '未知错误'))
    } finally {
      registerLoading.value = false
    }
  })
}, 1000, true)

// 忘记密码表单验证规则
const forgotPasswordRules = {
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  userId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  newPass: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,}$/,
      message: '密码至少包含一个字母和一个数字',
      trigger: 'blur'
    }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== captchaText.value.toLowerCase()) {
          callback(new Error('验证码不正确'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理忘记密码
const handleForgotPassword = debounce(async () => {
  if (!forgotPasswordFormRef.value) {
    ElMessage.error('请填写完整信息')
    return
  }

  await forgotPasswordFormRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.error('请填写完整信息')
      return
    }

    try {
      forgotPasswordLoading.value = true

      // 调用忘记密码API
      const result = await authStore.forgotPassword({
        school: forgotPasswordForm.school,
        userId: forgotPasswordForm.userId,
        email: forgotPasswordForm.email,
        newPass: forgotPasswordForm.newPass,
        captcha: forgotPasswordForm.captcha
      })

      if (result.success) {
        ElMessage.success(result.message || '密码重置成功')
        // 重置成功后返回登录界面
        showForgotPasswordForm.value = false
      } else {
        ElMessage.error(result.message || '密码重置失败')
      }
    } catch (error) {
      console.error('密码重置异常:', error)
      ElMessage.error('密码重置过程中发生错误: ' + (error.message || '未知错误'))
    } finally {
      forgotPasswordLoading.value = false
    }
  })
}, 1000, true)

// 返回登录
const backToLogin = () => {
  showRegisterForm.value = false
  showForgotPasswordForm.value = false
}

const toggleDark = (val) => {
  isDark.value = val
  if (val) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('darkMode', val)
}

// 使用防抖优化深色模式切换性能
const debouncedToggleDark = debounce((val) => {
  toggleDark(val);
}, 100, true);

// 页面关闭前的处理
const handleBeforeUnload = () => {
  // 如果用户没有选择记住登录信息，则清除本地存储
  if (!loginForm.remember) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
}

// 生命周期
onMounted(() => {
  // 生成初始验证码
  const captchaCanvas = document.querySelector('canvas');
  if (captchaCanvas) {
    drawCaptcha(captchaCanvas);
  }

  // 恢复深色模式设置
  const darkMode = localStorage.getItem('darkMode') === 'true'
  isDark.value = darkMode
  if (darkMode) {
    document.documentElement.classList.add('dark')
  }

  // 如果用户选择了记住登录信息，则尝试自动登录
  const savedUserId = localStorage.getItem('savedUserId')
  const savedPassword = localStorage.getItem('savedPassword')
  const savedPhone = localStorage.getItem('savedPhone')
  const savedEmail = localStorage.getItem('savedEmail')

  if (savedUserId && savedPassword) {
    loginForm.userId = savedUserId
    loginForm.password = savedPassword
    loginForm.remember = true
    activeLoginType.value = 'account'
  } else if (savedPhone) {
    phoneLoginForm.phone = savedPhone
    phoneLoginForm.remember = true
    activeLoginType.value = 'phone'
  } else if (savedEmail) {
    emailLoginForm.email = savedEmail
    emailLoginForm.remember = true
    activeLoginType.value = 'email'
  }

  // 为所有登录方式设置默认学校（如果需要）
  if (!loginForm.school) loginForm.school = ''
  if (!phoneLoginForm.school) phoneLoginForm.school = ''
  if (!emailLoginForm.school) emailLoginForm.school = ''

  // 添加页面关闭事件监听器
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 组件销毁前移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  // 清除倒计时定时器
  if (phoneCountdownTimer) clearInterval(phoneCountdownTimer)
  if (emailCountdownTimer) clearInterval(emailCountdownTimer)
})
</script>

<style scoped>
/* define design tokens so custom properties resolve */
:root{
  --muted: #6b7280;
  --card-bg: rgba(255,255,255,0.95);
}

.login-container {
  background: url(../../assets/images/login-bg.jpg) no-repeat center center;
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
}

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

@media (max-width: 1199px) {
  .presentation-box {
    display: none !important;
  }
  .content-wrapper {
    justify-content: center;
    padding: 1.5rem;
  }
}

@media (max-width: 768px) and (min-width: 481px) {
  .content-wrapper {
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
    gap: 1rem;
  }

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
  .presentation-box {
    display: none !important; /* 确保在小屏幕上隐藏宣传内容 */
  }
  .content-wrapper {
    flex-direction: column;
    justify-content: center !important; /* 根据规范，在小屏幕上居中布局 */
    padding: 0.8rem;
    gap: 0.8rem;
    min-height: 100vh;
    align-items: center;
  }

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

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>
