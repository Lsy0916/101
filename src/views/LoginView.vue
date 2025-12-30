<!-- 通用登录页面 -->
<template>
  <div class="login-container">
    <div class="theme-toggle">
      <el-switch
        v-model="darkMode"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        @change="toggleDarkMode"
      />
    </div>

    <div class="login-box">
      <div class="login-header">
        <h2>校园机房管理系统</h2>
        <p>请选择您的身份登录</p>
      </div>

      <div class="role-selection">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="8">
            <div class="role-card" @click="goToStudent">
              <div class="role-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="role-name">学生</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="role-card" @click="goToTeacher">
              <div class="role-icon">
                <el-icon><UserFilled /></el-icon>
              </div>
              <div class="role-name">教师</div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="8">
            <div class="role-card" @click="goToAdmin">
              <div class="role-icon">
                <el-icon><Lock /></el-icon>
              </div>
              <div class="role-name">管理员</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <div class="login-footer">
        <p>请选择对应身份登录系统</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, UserFilled, Lock, Sunny, Moon } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { debounce } from '@/utils/debounce.js'
import { ref } from 'vue'

const router = useRouter()
const darkMode = ref(false)

const goToStudent = debounce(() => {
  router.push('/student')
}, 1000, true)

const goToTeacher = debounce(() => {
  router.push('/teacher')
}, 1000, true)

const goToAdmin = debounce(() => {
  router.push('/admin')
}, 1000, true)

const toggleDarkMode = (val) => {
  darkMode.value = val
  if (val) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

// 初始化暗色模式
const savedDarkMode = localStorage.getItem('darkMode') === 'true'
darkMode.value = savedDarkMode
if (savedDarkMode) {
  document.documentElement.classList.add('dark')
}
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
  max-width: 600px;
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
  margin-bottom: 35px;
}

.login-header h2 {
  margin: 0 0 10px;
  font-size: 28px;
  color: #333;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.role-selection {
  margin: 25px 0;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 15px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 130px;
  border: none;
  margin-bottom: 10px;
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.role-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.role-icon {
  font-size: 36px;
  margin-bottom: 12px;
  color: #409eff;
  transition: transform 0.3s ease;
}

.role-card:hover .role-icon {
  transform: scale(1.1);
}

.role-name {
  font-size: 17px;
  font-weight: bold;
  color: #333;
}

.login-footer {
  text-align: center;
  margin-top: 25px;
}

.login-footer p {
  margin: 0;
  color: #666;
  font-size: 14px;
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

.login-container.dark .role-card {
  background: rgba(50, 50, 50, 0.85);
}

.login-container.dark .role-card:hover {
  background: rgba(60, 60, 60, 0.95);
}

.login-container.dark .role-name {
  color: #fff;
}

.login-container.dark .login-footer p {
  color: #aaa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-box {
    margin: 0;
    padding: 30px 20px;
    max-width: 100%;
    border-radius: 0;
  }
  
  .role-selection {
    margin: 18px 0;
  }
  
  .role-card {
    padding: 22px 12px;
    min-height: 120px;
  }
  
  .role-icon {
    font-size: 32px;
  }
  
  .role-name {
    font-size: 16px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .login-box {
    margin: 0;
    padding: 25px 15px;
    max-width: 100%;
    border-radius: 0;
    width: 90%;
  }
  
  .login-header h2 {
    font-size: 22px;
  }
  
  .role-card {
    padding: 20px 10px;
    min-height: 110px;
  }
  
  .role-icon {
    font-size: 28px;
  }
  
  .role-name {
    font-size: 15px;
  }
  
  .role-selection {
    margin: 15px 0;
  }
}

/* 额外的超大屏和中等屏断点 */
@media (min-width: 1400px) {
  .login-box {
    max-width: 650px;
  }
}

@media (max-width: 360px) {
  .login-box {
    padding: 20px 12px;
    width: 95%;
  }
  
  .role-card {
    padding: 18px 8px;
    min-height: 100px;
  }
  
  .role-icon {
    font-size: 24px;
  }
  
  .role-name {
    font-size: 14px;
  }
}
</style>