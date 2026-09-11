<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <div class="contact-wrapper scroll-reveal">
        <div class="contact-info">
          <div class="contact-bg-shape"></div>
          <div class="contact-header">
            <h2>{{ $t('home.contact.title') }}</h2>
            <p>{{ $t('home.contact.desc') }}</p>
          </div>
          <div class="contact-methods">
            <div class="method-item">
              <div class="method-icon"><el-icon><Phone /></el-icon></div>
              <div class="method-text">
                <label>{{ $t('home.contact.phone') }}</label>
                <span>400-123-4567</span>
              </div>
            </div>
            <div class="method-item">
              <div class="method-icon"><el-icon><Message /></el-icon></div>
              <div class="method-text">
                <label>{{ $t('home.contact.email') }}</label>
                <span>contact@shengyaxinlv.com</span>
              </div>
            </div>
          </div>
        </div>
        <div class="contact-form-wrapper">
          <h3>{{ $t('home.contact.formTitle') }}</h3>
          <el-form ref="contactFormRef" :model="contactForm" :rules="contactRules" label-position="top" class="tech-form">
            <el-row :gutter="20">
              <el-col :span="12" :xs="24">
                <el-form-item prop="name" :label="$t('home.contact.name')">
                  <el-input v-model="contactForm.name" :placeholder="$t('home.contact.namePlaceholder')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item prop="email" :label="$t('home.contact.emailLabel')">
                  <el-input v-model="contactForm.email" :placeholder="$t('home.contact.emailPlaceholder')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="message" :label="$t('home.contact.message')">
              <el-input
                v-model="contactForm.message"
                type="textarea"
                :rows="4"
                :placeholder="$t('home.contact.messagePlaceholder')">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="submit-btn" @click="submitContactForm">
                {{ $t('home.contact.submit') }} <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * 【business】HomeContactSection —— 联系我们区块（信息栏 + 留言表单）
 * - 表单校验/提交反馈完全内聚，无路由/store 依赖，无需对外事件
 * - 校验文案 computed 化以支持语言切换实时更新
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { Phone, Message, ArrowRight } from '@element-plus/icons-vue'

const { t } = useI18n()

// 表单数据
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

// 表单校验规则（使用 computed 以支持语言切换时实时更新提示文案）
const contactRules = computed(() => ({
  name: [
    { required: true, message: t('home.validation.nameRequired'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('home.validation.emailRequired'), trigger: 'blur' },
    { type: 'email' as const, message: t('home.validation.emailFormat'), trigger: 'blur' }
  ],
  message: [
    { required: true, message: t('home.validation.messageRequired'), trigger: 'blur' }
  ]
}))

const contactFormRef = ref<FormInstance | null>(null)

const submitContactForm = async () => {
  try {
    const form = contactFormRef.value
    if (!form) return
    await form.validate()
    ElMessage.success(t('home.contact.submitSuccess'))
    contactForm.value = { name: '', email: '', message: '' }
  } catch {
    // 表单验证失败，Element Plus 会自动在表单项下方显示错误信息
  }
}
</script>

<style scoped>
/* 通用布局（区块内副本，与原页面 scoped 规则一致） */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1);
}

.scroll-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* 联系我们 - 现代表单 */
.contact-section {
  padding: 8rem 0;
}

.contact-wrapper {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 400px 1fr;
  border: 1px solid #eef2f6;
}

.contact-info {
  background: #f8fafc;
  position: relative;
  overflow: hidden;
  padding: 4rem;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-right: 1px solid #eef2f6;
}

.contact-bg-shape {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(0, 82, 217, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.contact-header h2 {
  color: #0a0f1a;
  margin-bottom: 1rem;
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1.1;
}

.contact-header p {
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.7;
}

.method-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.method-icon {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
  color: var(--brand-primary);
}

.method-text label {
  display: block;
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.method-text span {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.contact-form-wrapper {
  padding: 3rem;
  background: white;
}

.contact-form-wrapper h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 2rem;
  font-weight: 700;
}

.submit-btn {
  width: auto;
  padding: 12px 36px;
  border-radius: 8px;
  height: auto;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.submit-btn:hover {
  background-color: #003bb3;
  border-color: #003bb3;
}

.tech-form :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  padding: 8px 15px;
}

.tech-form :deep(.el-input__wrapper.is-focus) {
  background-color: white;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1) !important;
}

.tech-form :deep(.el-textarea__inner) {
  background-color: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  padding: 12px 15px;
}

.tech-form :deep(.el-textarea__inner:focus) {
  background-color: white;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1) !important;
}

@media (max-width: 992px) {
  .contact-wrapper {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .contact-info {
    padding: 2rem;
  }

  .contact-form-wrapper {
    padding: 2rem;
  }
}
</style>
