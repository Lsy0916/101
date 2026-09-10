<!--注册表单组件-->

<template>
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
      <el-link type="primary" @click="emit('switch-to-login')" underline="never">
        <el-icon><Back /></el-icon>
        返回登录
      </el-link>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus';
import { School, User, Lock, Back } from '@element-plus/icons-vue';

// 定义事件
const emit = defineEmits(['switch-to-login']);

// 注册表单数据
const registerForm = reactive({
  school: '',
  userId: '',
  password: '',
  confirmPassword: '',
  captcha: ''
});

// 注册表单引用
const registerFormRef = ref();

// 验证码Canvas引用
const captchaCanvas = ref();

// 验证码
const captchaText = ref('');

// 注册加载状态
const registerLoading = ref(false);

// 学校选项
const schools = ref([
  { value: 'tsinghua', label: '清华大学' },
  { value: 'pku', label: '北京大学' },
  { value: 'fudan', label: '复旦大学' },
  { value: 'sjtu', label: '上海交通大学' },
  { value: 'zju', label: '浙江大学' }
]);

// 注册表单验证规则
const registerRules = reactive({
  school: [
    { required: true, message: '请选择学校', trigger: 'change' }
  ],
  userId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 1, max: 20, message: '学号长度为1-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, 
      message: '密码至少包含一个字母和一个数字', 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      }, 
      trigger: 'blur' 
    }
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

// 生成验证码
const generateCaptcha = () => {
  if (!captchaCanvas.value) return;
  
  const canvas = captchaCanvas.value;
  const ctx = canvas.getContext('2d');
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 生成随机验证码文本
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  captchaText.value = '';
  for (let i = 0; i < 4; i++) {
    captchaText.value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // 绘制验证码
  ctx.font = '20px Arial';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  
  // 绘制字符
  for (let i = 0; i < captchaText.value.length; i++) {
    ctx.fillStyle = `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(captchaText.value[i], 20 + i * 20, 20);
  }
  
  // 绘制干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgb(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 155 + 100)})`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
};

// 注册处理函数
const handleRegister = async () => {
  if (!registerFormRef.value) return;

  // 验证表单（使用 try/catch 捕获校验失败的 Promise 拒绝，避免未处理拒绝告警）
  try {
    await registerFormRef.value.validate();
    // 设置加载状态
    registerLoading.value = true;

    // 调用注册API
    const authStore = useAuthStore();
    authStore.register({
      ...registerForm
    }).then(result => {
      if (result.success) {
        ElMessage.success(result.message);
        // 注册成功后返回登录页面
        emit('switch-to-login');
      } else {
        ElMessage.error(result.message);
      }
    }).catch(error => {
      ElMessage.error(error.message || '注册失败');
    }).finally(() => {
      registerLoading.value = false;
    });
  } catch {
    // 表单验证失败，Element Plus 会自动在表单项下方显示错误信息
  }
};

// 组件挂载时生成验证码
onMounted(() => {
  generateCaptcha();
});
</script>

<style scoped lang="scss">
.register-button {
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

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.45);
}

.register-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.back-to-login {
  text-align: center;
  margin-top: 12px;
}

.captcha-form-item .captcha-input-container {
  display: flex;
  gap: 10px;
  align-items: center;
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
</style>