<template>
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
            @on-created="handleCreated"
            @on-change="handleEditorChange"
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
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted, watch, onBeforeUnmount, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Message, Postcard, CircleCheckFilled, Plus
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'

const router = useRouter()
const { t } = useI18n()

const isSubmitting = ref(false)
const showSuccess = ref(false)

const title = ref('')
const openDate = ref(dayjs().add(1, 'day').format('YYYY-MM-DD'))
const datePickerRef = ref<{ focus: () => void } | null>(null)

const openDateText = computed(() => openDate.value || t('capsule.create.placeholders.date'))

const disabledDate = (time: Date): boolean => {
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

const wangEditor = shallowRef<IDomEditor>()
const valueHtml = ref('')
const toolbarConfig = {}
const editorConfig = computed(() => ({ placeholder: t('capsule.create.placeholders.editor') }))

const handleCreated = (editor: IDomEditor) => {
  wangEditor.value = editor
}

const handleEditorChange = (editor: IDomEditor) => {
  richContent.value = editor.getHtml()
}

const contentLength = computed(() => {
  return richContent.value.replace(/<[^>]*>/g, '').length
})

const imagePaths = ref<string[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const chooseImage = () => {
  if (imagePaths.value.length >= 6) {
    ElMessage.warning(t('capsule.create.photo.maxWarning'))
    return
  }
  fileInputRef.value?.click()
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  const remaining = 6 - imagePaths.value.length
  files.slice(0, remaining).forEach(file => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      imagePaths.value.push(ev.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
  target.value = ''
}

const deleteImage = (index: number) => {
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

const draftTimer = ref<ReturnType<typeof setTimeout> | null>(null)
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
  background: white;
  border: 1px solid var(--mist-050);
  border-radius: 18px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-section:hover {
  border-color: var(--brand-primary-soft);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--brand-primary) 5%, transparent);
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-900);
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
  color: var(--ink-400);
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
  color: #ff4d4f; /* stylelint-disable-line color-no-hex, function-allowed-list */
  font-size: 16px;
  margin-right: 4px;
  font-weight: bold;
}

.optional-hint {
  color: var(--ink-400);
  font-size: 12px;
  font-weight: normal;
  margin-left: 8px;
}

.tip-text {
  font-size: 12px;
  color: var(--ink-400);
  margin-top: 8px;
  display: block;
}

.hint {
  font-size: 12px;
  color: var(--ink-400);
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
  border-bottom: 1px solid var(--mist-050);
  color: var(--ink-800);
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  width: 100%;
}

.title-input:focus,
.info-input:focus {
  border-bottom-color: var(--brand-primary);
}

.title-input::placeholder,
.info-input::placeholder {
  color: var(--ink-400);
}

.title-count {
  font-size: 12px;
  color: var(--ink-400);
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
  border-bottom: 1px solid var(--mist-050);
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.date-picker-row:hover {
  border-bottom-color: var(--brand-primary);
}

.date-text {
  font-size: 15px;
  color: var(--ink-800);
  letter-spacing: 0.3px;
}

.arrow {
  font-size: 16px;
  color: var(--ink-400);
  transition: transform 0.3s ease;
}

.date-picker-row:hover .arrow {
  transform: translateX(4px);
  color: var(--brand-primary);
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
  border: 1px solid var(--mist-050);
  transition: all 0.3s ease;
  cursor: pointer;
}

.method-option:hover {
  border-color: var(--brand-primary-soft);
  background: var(--brand-primary-faint);
}

.method-option.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  box-shadow: 0 4px 14px color-mix(in srgb, var(--brand-primary) 18%, transparent);
}

.method-icon {
  font-size: 28px;
  color: var(--ink-500);
  margin-bottom: 8px;
}

.method-option.active .method-icon {
  color: white;
}

.method-text {
  font-size: 14px;
  color: var(--ink-500);
  letter-spacing: 0.3px;
}

.method-option.active .method-text {
  color: white;
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
  border-left: 2px solid var(--mist-050);
}

.content-wrapper {
  position: relative;
}

.wang-editor-wrap {
  border: 1px solid var(--mist-050);
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.wang-editor-wrap:focus-within {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 8%, transparent);
}

.wang-toolbar {
  border-bottom: 1px solid var(--mist-050) !important;
  background: var(--brand-primary-wash) !important;
  padding: 6px 8px !important;
}

.wang-editor {
  min-height: 220px;
  padding: 12px 16px !important;
  font-size: 15px;
  line-height: 1.8;
  color: var(--ink-800);
}

:deep(.w-e-toolbar .w-e-menu) {
  color: var(--ink-600);
  border-radius: 6px;
  transition: all 0.2s ease;
}

:deep(.w-e-toolbar .w-e-menu:hover) {
  color: var(--brand-primary);
  background: var(--brand-primary-faint);
}

:deep(.w-e-toolbar .w-e-menu.w-e-active) {
  color: var(--brand-primary);
  background: var(--brand-primary-faint);
}

:deep(.w-e-text-container) {
  background: white !important;
}

:deep(.w-e-text-placeholder) {
  color: var(--ink-400);
  font-style: normal;
}

.content-count {
  position: absolute;
  right: 0;
  bottom: -4px;
  font-size: 12px;
  color: var(--ink-400);
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
  border: 1px dashed var(--brand-primary-soft);
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-uploader:hover {
  background: var(--brand-primary-faint);
  border-color: var(--brand-primary);
}

.upload-icon {
  font-size: 32px;
  color: var(--ink-400);
  margin-bottom: 12px;
}

.upload-text {
  font-size: 13px;
  color: var(--ink-400);
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
  background: var(--slate-50);
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
  background: color-mix(in srgb, var(--brand-primary) 80%, transparent);
  color: white;
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
  background: var(--brand-primary);
}

.add-image-btn {
  background: transparent;
  border: 1px dashed var(--brand-primary-soft);
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-image-btn:hover {
  background: var(--brand-primary-faint);
  border-color: var(--brand-primary);
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
  color: var(--ink-400);
  margin-bottom: 4px;
}

.add-text {
  font-size: 11px;
  color: var(--ink-400);
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
  border: 1px solid var(--mist-050);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.emotion-tag:hover {
  border-color: var(--brand-primary-soft);
  background: var(--brand-primary-faint);
  transform: translateY(-2px);
}

.emotion-tag.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 20%, transparent);
}

.submit-section {
  padding: 36px 0 12px;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--brand-primary), var(--color-info));
  color: white;
  font-size: 13px;
  padding: 18px 0;
  border-radius: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  box-shadow: 0 6px 18px color-mix(in srgb, var(--brand-primary) 22%, transparent);
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
  background: linear-gradient(135deg, var(--brand-primary-dark), var(--blue-600));
  color: white;
  box-shadow: 0 10px 26px color-mix(in srgb, var(--brand-primary) 30%, transparent);
  transform: translateY(-2px);
}

.submit-btn:hover:not(:disabled) .submit-arrow {
  transform: translateX(6px);
}

.submit-arrow {
  transition: transform 0.3s ease;
}

.submit-btn:disabled {
  background: var(--brand-primary-soft);
  color: white;
  cursor: not-allowed;
  box-shadow: none;
}

.success-dialog-content {
  text-align: center;
  padding: 16px 0;
}

.success-big-icon {
  font-size: 56px;
  color: var(--green-800);
  margin-bottom: 16px;
}

.success-dialog-content h3 {
  font-size: 22px;
  margin-bottom: 10px;
  color: var(--ink-800);
}

.success-dialog-content p {
  color: var(--ink-600);
  margin-bottom: 24px;
  line-height: 1.6;
  font-size: 14px;
}

.success-dialog-content b {
  color: var(--brand-primary);
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: var(--brand-primary) !important;
  border-color: var(--brand-primary) !important;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--mist-050);
}

:deep(.el-button--primary) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

:deep(.el-button--primary:hover) {
  background: var(--brand-primary-dark);
  border-color: var(--brand-primary-dark);
}

@media (width <= 768px) {
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
