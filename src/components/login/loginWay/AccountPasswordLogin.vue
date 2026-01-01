<!--账号密码登录方式-->

<template>
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
              ref="captchaCanvasRef"
              width="100"
              height="40"
          />
        </div>
      </div>
    </el-form-item>

    <el-form-item class="login-options">
      <div class="login-options-container">
        <el-checkbox v-model="loginForm.remember" label="保存登录信息" />
        <el-link type="primary" @click="onForgotPassword" underline="never">忘记密码？</el-link>
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
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';

// 引入Element Plus图标
import { School, User, Lock } from '@element-plus/icons-vue';

// 定义事件
const emit = defineEmits(['switch-to-forgot-password']);

// 登录表单数据
const loginForm = reactive({
  school: '',
  userId: '',
  password: '',
  captcha: '',
  remember: false
});

// 登录表单引用
const loginFormRef = ref();

// 验证码Canvas引用
const captchaCanvasRef = ref();

// 验证码
const captchaText = ref('');

// 加载状态
const loading = ref(false);

// 学校选项
const schools = ref([
  { value: 'tsinghua', label: '清华大学' },
  { value: 'pku', label: '北京大学' },
  { value: 'fudan', label: '复旦大学' },
  { value: 'sjtu', label: '上海交通大学' },
  { value: 'zju', label: '浙江大学' }
]);

// 登录表单验证规则
const loginRules = reactive({
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  userId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 1, max: 20, message: '学号长度为1-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码为4位字符', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== captchaText.value.toLowerCase()) {
          callback(new Error('验证码错误'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
  ]
});

// 生成验证码 - 优化性能
const generateCaptcha = async () => {
  await nextTick(); // 确保DOM更新完成
  
  if (!captchaCanvasRef.value) return;
  
  const canvas = captchaCanvasRef.value;
  const ctx = canvas.getContext('2d');
  
  // 设置画布实际尺寸
  canvas.width = 100;
  canvas.height = 40;
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 设置背景
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#f0f2f5');
  gradient.addColorStop(1, '#e6f7ff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 生成随机验证码文本
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  captchaText.value = '';
  for (let i = 0; i < 4; i++) {
    captchaText.value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // 绘制验证码 - 优化绘制性能
  ctx.font = 'bold 20px Arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  
  // 绘制字符，添加随机变化
  for (let i = 0; i < captchaText.value.length; i++) {
    // 随机颜色
    const r = Math.floor(Math.random() * 155 + 100);
    const g = Math.floor(Math.random() * 155 + 100);
    const b = Math.floor(Math.random() * 155 + 100);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    
    // 添加随机旋转和位置
    const x = 15 + i * 20;
    const y = 20;
    const angle = (Math.random() - 0.5) * 0.4; // 小幅度旋转
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillText(captchaText.value[i], 0, 0);
    ctx.restore();
  }
  
  // 绘制少量干扰线 - 减少数量以提高性能
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 4; i++) { // 减少干扰线数量
    ctx.strokeStyle = `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
};

// 登录处理函数
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  // 验证表单
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      // 设置加载状态
      loading.value = true;
      
      // 调用登录API
      const authStore = useAuthStore();
      authStore.login({
        roleId: 'student',
        loginType: 'account', // 账号密码登录
        ...loginForm
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

// 忘记密码处理函数
const onForgotPassword = () => {
  emit('switch-to-forgot-password');
};

// 组件挂载时生成验证码
onMounted(() => {
  generateCaptcha();
});
</script>

<style scoped lang="scss">
.login-form {
  width: 100%;
}

.captcha-form-item {
  .captcha-input-container {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .captcha-image {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    background: #f5f5f5;
    border: 1px solid #d9d9d9;
  }
}

.login-options {
  margin-bottom: 20px;
}

.login-options-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
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