<template>
  <div class="time-capsule-page">
    <!-- 杂志编辑式标题区 -->
    <header class="page-header">
      <div class="header-back" @click="router.push('/time-capsule')">
        <el-icon><ArrowLeft /></el-icon>
        <span>{{ $t('capsule.create.back') }}</span>
      </div>
      <span class="header-eyebrow">{{ $t('capsule.create.eyebrow') }}</span>
      <h1 class="header-title" v-html="$t('capsule.create.title')"></h1>
      <p class="header-subtitle">{{ $t('capsule.create.subtitle') }}</p>
    </header>

    <!-- 表单 · 编辑式分区 -->
    <main class="form-container">
      <!-- 01. 胶囊标题 -->
      <section class="form-section">
        <div class="section-title"><span class="section-num">01</span><span class="required-mark">*</span>{{ $t('capsule.create.sections.title') }}</div>
        <div class="title-row">
          <input
            v-model="title"
            class="title-input"
            :placeholder="$t('capsule.create.placeholders.title')"
            maxlength="30"
          />
          <span class="title-count">{{ title.length }}/30</span>
        </div>
      </section>

      <!-- 02. 开启时间 -->
      <section class="form-section">
        <div class="section-title"><span class="section-num">02</span><span class="required-mark">*</span>{{ $t('capsule.create.sections.openDate') }}</div>
        <div class="date-picker-row" @click="openDatePicker">
          <span class="date-text">{{ openDateText }}</span>
          <span class="arrow">→</span>
        </div>
        <el-date-picker
          ref="datePickerRef"
          v-model="openDate"
          type="date"
          :placeholder="$t('capsule.create.placeholders.date')"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          class="hidden-date-picker"
        />
        <p class="hint">{{ $t('capsule.create.hints.dateRange') }}</p>
      </section>

      <!-- 03. 开启方式 -->
      <section class="form-section">
        <div class="section-title"><span class="section-num">03</span><span class="required-mark">*</span>{{ $t('capsule.create.sections.method') }}</div>
        <div class="method-selector">
          <div
            v-for="m in methodList"
            :key="m.id"
            :class="['method-option', { active: openMethod === m.id }]"
            @click="openMethod = m.id"
          >
            <div class="method-icon">
              <el-icon><component :is="m.icon" /></el-icon>
            </div>
            <div class="method-text">{{ m.name }}</div>
          </div>
        </div>
      </section>

      <!-- 04. 邮件信息 -->
      <section v-if="openMethod === 'email'" class="form-section">
        <div class="section-title"><span class="section-num">04</span><span class="required-mark">*</span>{{ $t('capsule.create.sections.emailInfo') }}</div>
        <input
          v-model="emailRecipient"
          class="info-input"
          :placeholder="$t('capsule.create.placeholders.email')"
        />
      </section>

      <!-- 04. 手写信信息 -->
      <section v-if="openMethod === 'letter'" class="form-section">
        <div class="section-title"><span class="section-num">04</span><span class="required-mark">*</span>{{ $t('capsule.create.sections.letterInfo') }}</div>
        <input v-model="letterName" class="info-input" :placeholder="$t('capsule.create.placeholders.name')" />
        <input v-model="letterPhone" class="info-input" :placeholder="$t('capsule.create.placeholders.phone')" style="margin-top: 12px;" />
        <textarea v-model="letterAddress" class="info-input address-input" :placeholder="$t('capsule.create.placeholders.address')" maxlength="50"></textarea>
      </section>

      <!-- 05. 匿名发送 -->
      <section class="form-section">
        <div class="switch-row">
          <span class="section-title no-margin"><span class="section-num">05</span>{{ $t('capsule.create.sections.anonymous') }}</span>
          <el-switch v-model="isAnonymous" active-color="#0052d9" />
        </div>
        <p v-if="isAnonymous" class="tip-text">{{ $t('capsule.create.tips.anonymous') }}</p>
      </section>

      <!-- 06. 公开到广场 -->
      <section class="form-section">
        <div class="switch-row">
          <span class="section-title no-margin"><span class="section-num">06</span>{{ $t('capsule.create.sections.public') }}</span>
          <el-switch v-model="isPublic" active-color="#0052d9" />
        </div>
        <p v-if="isPublic" class="tip-text">{{ $t('capsule.create.tips.public') }}</p>
        <div v-if="isPublic" class="comment-setting">
          <div class="switch-row">
            <span class="section-title no-margin small">{{ $t('capsule.create.tips.disableComment') }}</span>
            <el-switch v-model="disableComment" active-color="#0052d9" />
          </div>
          <p class="tip-text">{{ disableComment ? $t('capsule.create.tips.commentOff') : $t('capsule.create.tips.commentOn') }}</p>
        </div>
      </section>

      <!-- 07. 胶囊内容 -->
      <section class="form-section">
        <div class="section-title">
          <span class="section-num">07</span><span class="required-mark">*</span>{{ $t('capsule.create.sections.content') }}
          <span class="optional-hint">{{ $t('capsule.create.hints.contentOptional') }}</span>
        </div>
        <div class="content-wrapper">
          <div class="wang-editor-wrap">
            <Toolbar :editor="wangEditor" :defaultConfig="toolbarConfig" mode="simple" class="wang-toolbar" />
            <Editor
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              mode="simple"
              class="wang-editor"
              @onCreated="handleCreated"
              @onChange="handleEditorChange"
            />
          </div>

          <span class="content-count">{{ contentLength }}/500</span>
        </div>
      </section>

      <!-- 08. 添加照片 -->
      <section class="form-section">
        <div class="section-title"><span class="section-num">08</span>{{ $t('capsule.create.sections.photo') }}</div>
        <div v-if="imagePaths.length > 0" class="image-grid">
          <div v-for="(img, i) in imagePaths" :key="i" class="image-item">
            <img :src="img" class="uploaded-image" :alt="$t('capsule.create.photo.alt')" />
            <div class="delete-btn" @click="deleteImage(i)">×</div>
          </div>
          <div v-if="imagePaths.length < 6" class="image-item add-image-btn" @click="chooseImage">
            <div class="add-content">
              <el-icon class="add-icon"><Plus /></el-icon>
              <span class="add-text">{{ $t('capsule.create.photo.add') }}</span>
            </div>
          </div>
        </div>
        <div v-else class="image-uploader" @click="chooseImage">
          <el-icon class="upload-icon"><Plus /></el-icon>
          <span class="upload-text">{{ $t('capsule.create.photo.upload') }}</span>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          class="hidden-file-input"
          @change="onFileChange"
        />
      </section>

      <!-- 09. 此刻心情 -->
      <section class="form-section">
        <div class="section-title"><span class="section-num">09</span>{{ $t('capsule.create.sections.mood') }}</div>
        <div class="emotion-tags">
          <div
            v-for="e in emotionList"
            :key="e.id"
            :class="['emotion-tag', { active: emotion === e.id }]"
            @click="emotion = e.id"
          >
            {{ e.emoji }}
          </div>
        </div>
      </section>

      <!-- 提交按钮 -->
      <section class="submit-section">
        <button
          class="submit-btn"
          :disabled="isSubmitting"
          @click="submitCapsule"
        >
          <span>{{ isSubmitting ? $t('capsule.create.submitting') : $t('capsule.create.submit') }}</span>
          <span v-if="!isSubmitting" class="submit-arrow">→</span>
        </button>
      </section>
    </main>

    <!-- 成功弹窗 -->
    <el-dialog v-model="showSuccess" :title="$t('capsule.create.success.title')" width="440px" center>
      <div class="success-dialog-content">
        <el-icon class="success-big-icon"><CircleCheckFilled /></el-icon>
        <h3>{{ $t('capsule.create.success.body') }}</h3>
        <p v-html="$t('capsule.create.success.desc', { date: openDateText })"></p>
        <el-button type="primary" @click="router.push('/time-capsule')">{{ $t('capsule.create.success.btn') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, shallowRef, onMounted, watch, onBeforeUnmount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Plus, Message, Postcard, CircleCheckFilled, ArrowLeft
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const router = useRouter()
const { t } = useI18n()

const isSubmitting = ref(false)
const showSuccess = ref(false)

const title = ref('')
const openDate = ref(dayjs().add(1, 'day').format('YYYY-MM-DD'))
const datePickerRef = ref(null)

const openDateText = computed(() => openDate.value || t('capsule.create.placeholders.date'))

const disabledDate = (time) => {
  const tomorrow = dayjs().startOf('day').add(1, 'day')
  const fiveYearsLater = dayjs().add(5, 'year')
  return time.getTime() < tomorrow.valueOf() || time.getTime() > fiveYearsLater.valueOf()
}

const openDatePicker = () => {
  const picker = datePickerRef.value
  if (picker) picker.focus?.()
}

const openMethod = ref('email')
const methodList = computed(() => [
  { id: 'email', name: t('capsule.create.methods.email'), icon: Message },
  { id: 'letter', name: t('capsule.create.methods.letter'), icon: Postcard }
])

const emailRecipient = ref('')
const letterName = ref('')
const letterPhone = ref('')
const letterAddress = ref('')

const isAnonymous = ref(false)
const isPublic = ref(false)
const disableComment = ref(false)

const richContent = ref('')

const wangEditor = shallowRef()
const valueHtml = ref('')
const toolbarConfig = {}
const editorConfig = computed(() => ({ placeholder: t('capsule.create.placeholders.editor') }))

const handleCreated = (editor) => {
  wangEditor.value = editor
}

const handleEditorChange = (editor) => {
  richContent.value = editor.getHtml()
}

const contentLength = computed(() => {
  return richContent.value.replace(/<[^>]*>/g, '').length
})

const imagePaths = ref([])
const fileInputRef = ref(null)

const chooseImage = () => {
  if (imagePaths.value.length >= 6) {
    ElMessage.warning(t('capsule.create.photo.maxWarning'))
    return
  }
  fileInputRef.value?.click()
}

const onFileChange = (e) => {
  const files = Array.from(e.target.files || [])
  const remaining = 6 - imagePaths.value.length
  files.slice(0, remaining).forEach(file => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      imagePaths.value.push(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
  e.target.value = ''
}

const deleteImage = (index) => {
  imagePaths.value.splice(index, 1)
}

const emotion = ref('hopeful')
const emotionList = [
  { id: 'happy', emoji: '😊' },
  { id: 'excited', emoji: '🤩' },
  { id: 'calm', emoji: '😌' },
  { id: 'sad', emoji: '😢' },
  { id: 'hopeful', emoji: '🌟' }
]

const submitCapsule = () => {
  if (!title.value.trim()) {
    ElMessage.warning(t('capsule.create.validation.title'))
    return
  }
  if (!openDate.value) {
    ElMessage.warning(t('capsule.create.validation.date'))
    return
  }

  const hasContent = richContent.value.replace(/<[^>]*>/g, '').trim()
  if (!hasContent && imagePaths.value.length === 0) {
    ElMessage.warning(t('capsule.create.validation.content'))
    return
  }

  if (openMethod.value === 'email') {
    if (!emailRecipient.value.trim()) {
      ElMessage.warning(t('capsule.create.validation.email'))
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailRecipient.value)) {
      ElMessage.warning(t('capsule.create.validation.emailFormat'))
      return
    }
  } else if (openMethod.value === 'letter') {
    if (!letterName.value.trim()) {
      ElMessage.warning(t('capsule.create.validation.letterName'))
      return
    }
    if (!letterPhone.value.trim()) {
      ElMessage.warning(t('capsule.create.validation.letterPhone'))
      return
    }
    if (!letterAddress.value.trim()) {
      ElMessage.warning(t('capsule.create.validation.letterAddress'))
      return
    }
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    showSuccess.value = true
    localStorage.removeItem('capsule_draft')
  }, 2000)
}

const draftTimer = ref(null)
watch(
  () => richContent.value,
  (val) => {
    if (draftTimer.value) clearTimeout(draftTimer.value)
    draftTimer.value = setTimeout(() => {
      localStorage.setItem('capsule_draft', val)
    }, 1000)
  }
)

onMounted(() => {
  const draft = localStorage.getItem('capsule_draft')
  if (draft) valueHtml.value = draft
})

onBeforeUnmount(() => {
  const editor = wangEditor.value
  if (editor) editor.destroy()
})

onUnmounted(() => {
  if (draftTimer.value) clearTimeout(draftTimer.value)
})
</script>

<style scoped>
/* 时光胶囊 - 新建页（仿小程序 new-capsule） */
.time-capsule-page {
  min-height: 100vh;
  background: #f8fbff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'PingFang SC', sans-serif;
  color: #111827;
  padding-bottom: 60px;
  position: relative;
  overflow-x: hidden;
}

.time-capsule-page::before {
  content: 'WRITE';
  position: absolute;
  top: 80px;
  right: -30px;
  font-size: clamp(160px, 24vw, 300px);
  font-weight: 900;
  color: #0052d9;
  opacity: 0.04;
  letter-spacing: -10px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.page-header {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 56px 32px;
  position: relative;
  border-bottom: 1px solid #eef2f6;
  z-index: 1;
}

.header-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.header-back:hover {
  color: #0052d9;
}

.header-eyebrow {
  display: block;
  font-size: 12px;
  letter-spacing: 3px;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.header-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  color: #111827;
  margin: 0 0 14px 0;
  letter-spacing: -2px;
  line-height: 1.02;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
  opacity: 0.85;
}

.header-subtitle {
  font-size: 13px;
  color: #6b7280;
  letter-spacing: 0.5px;
  margin: 0;
}

.form-container {
  max-width: 1000px;
  margin: 0 auto;
  background: transparent;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  padding: 28px 32px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 18px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-section:hover {
  border-color: #d0e7ff;
  box-shadow: 0 6px 20px rgba(0, 82, 217, 0.05);
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 18px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.section-num {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

.section-title.no-margin {
  margin-bottom: 0;
}

.section-title.small {
  font-size: 12px;
  text-transform: none;
  letter-spacing: 0.5px;
}

.required-mark {
  color: #ff4d4f;
  font-size: 16px;
  margin-right: 4px;
  font-weight: bold;
}

.optional-hint {
  color: #9ca3af;
  font-size: 12px;
  font-weight: normal;
  margin-left: 8px;
}

.tip-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
  display: block;
}

.hint {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 10px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.title-input,
.info-input {
  flex: 1;
  font-size: 15px;
  padding: 10px 0;
  background: transparent;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #eef2f6;
  color: #1f2937;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  width: 100%;
}

.title-input:focus,
.info-input:focus {
  border-bottom-color: #0052d9;
}

.title-input::placeholder,
.info-input::placeholder {
  color: #9ca3af;
}

.title-count {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}

.address-input {
  height: 80px;
  resize: none;
  margin-top: 12px;
  line-height: 1.6;
}

.date-picker-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background: transparent;
  border-radius: 0;
  border-bottom: 1px solid #eef2f6;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.date-picker-row:hover {
  border-bottom-color: #0052d9;
}

.date-text {
  font-size: 15px;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.arrow {
  font-size: 16px;
  color: #9ca3af;
  transition: transform 0.3s ease;
}

.date-picker-row:hover .arrow {
  transform: translateX(4px);
  color: #0052d9;
}

.hidden-date-picker {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
}

.method-selector {
  display: flex;
  gap: 16px;
}

.method-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
  background: transparent;
  border-radius: 12px;
  border: 1px solid #eef2f6;
  transition: all 0.3s ease;
  cursor: pointer;
}

.method-option:hover {
  border-color: #d0e7ff;
  background: #f0f7ff;
}

.method-option.active {
  background: #0052d9;
  border-color: #0052d9;
  box-shadow: 0 4px 14px rgba(0, 82, 217, 0.18);
}

.method-icon {
  font-size: 28px;
  color: #6b7280;
  margin-bottom: 8px;
}

.method-option.active .method-icon {
  color: #fff;
}

.method-text {
  font-size: 14px;
  color: #6b7280;
  letter-spacing: 0.3px;
}

.method-option.active .method-text {
  color: #fff;
  font-weight: 600;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-setting {
  margin-top: 16px;
  padding-left: 16px;
  border-left: 2px solid #eef2f6;
}

.content-wrapper {
  position: relative;
}

.wang-editor-wrap {
  border: 1px solid #eef2f6;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.wang-editor-wrap:focus-within {
  border-color: #0052d9;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.08);
}

.wang-toolbar {
  border-bottom: 1px solid #eef2f6 !important;
  background: #f8fbff !important;
  padding: 6px 8px !important;
}

.wang-editor {
  min-height: 220px;
  padding: 12px 16px !important;
  font-size: 15px;
  line-height: 1.8;
  color: #1f2937;
}

:deep(.w-e-toolbar .w-e-menu) {
  color: #4b5563;
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.w-e-toolbar .w-e-menu:hover) {
  color: #0052d9;
  background: #f0f7ff;
}

:deep(.w-e-toolbar .w-e-menu.w-e-active) {
  color: #0052d9;
  background: #f0f7ff;
}

:deep(.w-e-text-container) {
  background: #ffffff !important;
}

:deep(.w-e-text-placeholder) {
  color: #9ca3af;
  font-style: normal;
}

.content-count {
  position: absolute;
  right: 0;
  bottom: -4px;
  font-size: 12px;
  color: #9ca3af;
}

.image-uploader {
  width: 100%;
  height: 140px;
  background: transparent;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d0e7ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-uploader:hover {
  background: #f0f7ff;
  border-color: #0052d9;
}

.upload-icon {
  font-size: 32px;
  color: #9ca3af;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 13px;
  color: #9ca3af;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.image-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
}

.uploaded-image {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  object-fit: cover;
}

.image-item .delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  background: rgba(0, 82, 217, 0.8);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  line-height: 1;
  transition: background 0.2s ease;
}

.image-item .delete-btn:hover {
  background: rgba(0, 82, 217, 1);
}

.add-image-btn {
  background: transparent;
  border: 1px dashed #d0e7ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-image-btn:hover {
  background: #f0f7ff;
  border-color: #0052d9;
}

.add-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 24px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.add-text {
  font-size: 11px;
  color: #9ca3af;
}

.hidden-file-input {
  display: none;
}

.emotion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.emotion-tag {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid #eef2f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.emotion-tag:hover {
  border-color: #d0e7ff;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.emotion-tag.active {
  background: #0052d9;
  border-color: #0052d9;
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.2);
}

.submit-section {
  padding: 36px 0 12px;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #0052d9, #1890ff);
  color: #fff;
  font-size: 13px;
  padding: 18px 0;
  border-radius: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.22);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0040b0, #0077e6);
  color: #fff;
  box-shadow: 0 10px 26px rgba(0, 82, 217, 0.3);
  transform: translateY(-2px);
}

.submit-btn:hover:not(:disabled) .submit-arrow {
  transform: translateX(6px);
}

.submit-arrow {
  transition: transform 0.3s ease;
}

.submit-btn:disabled {
  background: #d0e7ff;
  color: #fff;
  cursor: not-allowed;
  box-shadow: none;
}

.success-dialog-content {
  text-align: center;
  padding: 16px 0;
}

.success-big-icon {
  font-size: 56px;
  color: #2e7d32;
  margin-bottom: 16px;
}

.success-dialog-content h3 {
  font-size: 22px;
  margin-bottom: 10px;
  color: #1f2937;
}

.success-dialog-content p {
  color: #4b5563;
  margin-bottom: 24px;
  line-height: 1.6;
  font-size: 14px;
}

.success-dialog-content b {
  color: #0052d9;
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #0052d9 !important;
  border-color: #0052d9 !important;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #eef2f6;
}

:deep(.el-button--primary) {
  background: #0052d9;
  border-color: #0052d9;
}

:deep(.el-button--primary:hover) {
  background: #0040b0;
  border-color: #0040b0;
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px 16px 20px;
  }

  .header-title {
    font-size: 36px;
    letter-spacing: -1px;
  }

  .form-section {
    padding: 24px 0;
  }

  .method-selector {
    gap: 12px;
  }

  .method-option {
    padding: 16px 8px;
  }

  .emotion-tags {
    gap: 12px;
  }

  .emotion-tag {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }

  .submit-section {
    padding: 28px 0 12px;
  }
}
</style>
