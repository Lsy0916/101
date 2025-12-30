<!-- 教师登录页面 -->
<template>
  <div class="login-container">
    <div class="theme-toggle">
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        @change="toggleDark"
      />
    </div>

    <div class="login-box">
      <div class="login-header">
        <h2>校园机房管理系统</h2>
        <p>教师登录</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="userId">
          <el-input
            v-model="loginForm.userId"
            placeholder="请输入工号"
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

        <el-form-item>
          <el-checkbox v-model="loginForm.remember" label="保存登录信息" />
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
            <el-icon><UserFilled /></el-icon>
            教师登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, onMounted, onBeforeUnmount} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Sunny, Moon, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { debounce } from '@/utils/debounce.js'

// 使用 Pinia store
const authStore = useAuthStore()

// 路由
const router = useRouter()

// 表单引用
const loginFormRef = ref()

// 状态
const loading = ref(false)
const isDark = ref(false)

// 表单数据
const loginForm = reactive({
  userId: '',
  password: '',
  roleId: 'teacher',
  remember: false
})

// 表单验证规则
const loginRules = {
  userId: [
    { required: true, message: '请输入工号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
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
        remember: loginForm.remember
      })

      if (result.success) {
        // 确保是老师角色
        const data = result.data

        if (data.roleId === 'teacher') {
          ElMessage.success('老师登录成功')
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

// 页面关闭前的处理
const handleBeforeUnload = () => {
  // 如果用户没有选择记住登录信息，则清除本地存储
  if (!loginForm.remember) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
}

onMounted(() => {
  // 恢复深色模式设置
  const darkMode = localStorage.getItem('darkMode') === 'true'
  isDark.value = darkMode
  if (darkMode) {
    document.documentElement.classList.add('dark')
  }

  // 如果用户选择了记住登录信息，则尝试自动登录
  const savedUserId = localStorage.getItem('savedUserId')
  const savedPassword = localStorage.getItem('savedPassword')

  if (savedUserId && savedPassword) {
    loginForm.userId = savedUserId
    loginForm.password = savedPassword
    loginForm.remember = true
  }

  // 添加页面关闭事件监听器
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 组件销毁前移除事件监听器
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
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

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 0;
  margin: 0;
  overflow: hidden;
  contain: layout style paint;
}

.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 35px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
  animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
  transform: translateX(-50px);
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
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 10px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-form .el-input__wrapper {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 8px;
  transition: all 0.3s ease;
  padding: 0 12px;
}

.login-form .el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #c0c4cc inset;
  background: rgba(255, 255, 255, 1);
}

.login-form .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #409eff inset;
  background: rgba(255, 255, 255, 1);
}

.login-button {
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

/* 深色主题适配 */
.login-container.dark {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.login-container.dark .login-box {
  background: rgba(30, 30, 30, 0.98);
  border: 1px solid rgba(80, 80, 80, 0.8);
}

.login-container.dark .login-header h2 {
  color: #fff;
}

.login-container.dark .login-header p {
  color: #ccc;
}

.login-container.dark .login-form .el-input__wrapper {
  background: rgba(40, 40, 40, 0.9);
  box-shadow: 0 0 0 1px #434343 inset;
}

.login-container.dark .login-form .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #409eff inset;
  background: rgba(40, 40, 40, 1);
}

.login-container.dark .captcha-image {
  background: #3a3a3a;
  border: 1px solid #555;
}

.login-container.dark .social-login-separator::before,
.login-container.dark .social-login-separator::after {
  border-bottom: 1px solid #555;
}

.login-container.dark .social-login-text {
  color: #909399;
}

.login-container.dark .social-btn {
  background-color: #3a3a3a;
  border: 1px solid #555;
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    margin: 0;
    padding: 30px 20px;
    max-width: 100%;
    border-radius: 0;
    width: 90%;
    min-width: 280px;
  }
  
  .login-header h2 {
    font-size: 22px;
  }
  
  .login-button {
    height: 44px;
  }
  
  .login-form .el-form-item {
    margin-bottom: 18px;
  }
}

/* 额外的响应式断点 */
@media (max-width: 768px) {
  .login-box {
    margin: 0 auto;
    padding: 30px 20px;
    width: 90%;
    max-width: 100%;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
}
</style>