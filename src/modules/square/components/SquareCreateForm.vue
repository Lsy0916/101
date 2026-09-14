<!-- 发布页 · 表单整体：心情/内容/话题/照片/开关 + 提交 + 成功弹窗 -->
<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus, CircleCheckFilled } from '@element-plus/icons-vue'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'published'): void
}>()

const MAX_CONTENT = 500
const MAX_PHOTOS = 6

const emotion = ref('hopeful')
const emotionList = computed(() => [
  { id: 'happy', emoji: '😊', label: t('square.create.moods.happy') },
  { id: 'excited', emoji: '🤩', label: t('square.create.moods.excited') },
  { id: 'calm', emoji: '😌', label: t('square.create.moods.calm') },
  { id: 'sad', emoji: '😢', label: t('square.create.moods.sad') },
  { id: 'hopeful', emoji: '🌟', label: t('square.create.moods.hopeful') }
])

const content = ref('')
const contentCount = computed(() => content.value.length)

const topics = ref<string[]>([])
const topicInput = ref('')
const MAX_TOPICS = 3

const addTopic = () => {
  const tag = topicInput.value.trim().replace(/^#/, '')
  if (!tag) return
  if (topics.value.length >= MAX_TOPICS) {
    ElMessage.warning(t('square.create.topicMaxTip'))
    return
  }
  if (topics.value.includes(tag)) {
    topicInput.value = ''
    return
  }
  topics.value.push(tag)
  topicInput.value = ''
}

const removeTopic = (index: number) => {
  topics.value.splice(index, 1)
}

const imagePaths = ref<string[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

const isAnonymous = ref(false)
const allowComment = ref(true)
const isSubmitting = ref(false)
const showSuccess = ref(false)
let submitTimer: ReturnType<typeof setTimeout> | null = null

const chooseImage = () => {
  if (imagePaths.value.length >= MAX_PHOTOS) {
    ElMessage.warning(t('square.create.photo.maxWarning'))
    return
  }
  fileInputRef.value?.click()
}

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  const remaining = MAX_PHOTOS - imagePaths.value.length
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

const canSubmit = computed(() => {
  const hasContent = content.value.trim().length > 0
  const hasPhotos = imagePaths.value.length > 0
  return hasContent || hasPhotos
})

const submitPost = () => {
  if (!canSubmit.value) {
    ElMessage.warning(t('square.create.validation.content'))
    return
  }
  isSubmitting.value = true
  submitTimer = setTimeout(() => {
    isSubmitting.value = false
    showSuccess.value = true
  }, 1500)
}

const backToSquare = () => {
  showSuccess.value = false
  emit('published')
}

// 组件卸载前清理定时器，避免内存泄漏
onBeforeUnmount(() => {
  if (submitTimer) {
    clearTimeout(submitTimer)
    submitTimer = null
  }
})
</script>

<template>
  <main class="form-container">
    <!-- 01. 此刻心情 -->
    <section class="form-card">
      <div class="section-title"><span class="section-num">01</span>{{ $t('square.create.sections.mood') }}</div>
      <div class="emotion-tags">
        <div
          v-for="e in emotionList"
          :key="e.id"
          :class="['emotion-tag', { active: emotion === e.id }]"
          @click="emotion = e.id"
        >
          <span class="emotion-emoji">{{ e.emoji }}</span>
          <span class="emotion-label">{{ e.label }}</span>
        </div>
      </div>
    </section>

    <!-- 02. 心得内容 -->
    <section class="form-card">
      <div class="section-title">
        <span class="section-num">02</span>{{ $t('square.create.sections.content') }}
        <span class="optional-hint">{{ $t('square.create.hints.contentOptional') }}</span>
      </div>
      <div class="content-wrapper">
        <textarea
          v-model="content"
          class="content-textarea"
          :placeholder="$t('square.create.placeholders.content')"
          :maxlength="MAX_CONTENT"
          rows="6"
        ></textarea>
        <span class="content-count">{{ contentCount }}/{{ MAX_CONTENT }}</span>
      </div>
    </section>

    <!-- 03. 话题标签 -->
    <section class="form-card">
      <div class="section-title"><span class="section-num">03</span>{{ $t('square.create.sections.topic') }}</div>
      <div class="topic-input-wrap">
        <div class="topic-tags">
          <span v-for="(tag, i) in topics" :key="i" class="topic-tag">
            #{{ tag }}
            <button class="topic-remove" @click="removeTopic(i)">×</button>
          </span>
        </div>
        <input
          v-if="topics.length < MAX_TOPICS"
          v-model="topicInput"
          class="topic-input"
          :placeholder="$t('square.create.topicPlaceholder')"
          @keydown.enter.prevent="addTopic"
        />
      </div>
    </section>

    <!-- 04. 添加照片 -->
    <section class="form-card">
      <div class="section-title"><span class="section-num">04</span>{{ $t('square.create.sections.photo') }}</div>
      <div v-if="imagePaths.length > 0" class="image-grid">
        <div v-for="(img, i) in imagePaths" :key="i" class="image-item">
          <img :src="img" class="uploaded-image" :alt="$t('square.create.photo.alt')" />
          <div class="delete-btn" @click="deleteImage(i)">×</div>
        </div>
        <div v-if="imagePaths.length < MAX_PHOTOS" class="image-item add-image-btn" @click="chooseImage">
          <div class="add-content">
            <el-icon class="add-icon"><Plus /></el-icon>
            <span class="add-text">{{ $t('square.create.photo.add') }}</span>
          </div>
        </div>
      </div>
      <div v-else class="image-uploader" @click="chooseImage">
        <el-icon class="upload-icon"><Plus /></el-icon>
        <span class="upload-text">{{ $t('square.create.photo.upload') }}</span>
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

    <!-- 05. 匿名发布 -->
    <section class="form-card form-card-row">
      <div class="section-title no-margin"><span class="section-num">05</span>{{ $t('square.create.sections.anonymous') }}</div>
      <el-switch v-model="isAnonymous" active-color="#0052d9" />
    </section>

    <!-- 06. 允许评论 -->
    <section class="form-card form-card-row">
      <div class="section-title no-margin"><span class="section-num">06</span>{{ $t('square.create.sections.comment') }}</div>
      <el-switch v-model="allowComment" active-color="#0052d9" />
    </section>

    <!-- 提交按钮 -->
    <section class="submit-section">
      <button
        class="submit-btn"
        :disabled="!canSubmit || isSubmitting"
        @click="submitPost"
      >
        <span>{{ isSubmitting ? $t('square.create.submitting') : $t('square.create.submit') }}</span>
        <span v-if="!isSubmitting && canSubmit" class="submit-arrow">→</span>
      </button>
    </section>
  </main>

  <!-- 成功弹窗 -->
  <el-dialog v-model="showSuccess" :title="$t('square.create.success.title')" width="440px" center>
    <div class="success-dialog-content">
      <el-icon class="success-big-icon"><CircleCheckFilled /></el-icon>
      <h3>{{ $t('square.create.success.body') }}</h3>
      <el-button type="primary" @click="backToSquare">{{ $t('square.create.success.btn') }}</el-button>
    </div>
  </el-dialog>
</template>

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

.form-card {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 18px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-card:hover {
  border-color: #d0e7ff;
  box-shadow: 0 6px 20px rgba(0, 82, 217, 0.05);
}

.form-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.optional-hint {
  color: #9ca3af;
  font-size: 12px;
  font-weight: normal;
  margin-left: 8px;
  text-transform: none;
  letter-spacing: 0.3px;
}

/* 心情选择器 */
.emotion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.emotion-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 14px;
  background: #f8fbff;
  border: 1px solid #eef2f6;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 72px;
}

.emotion-emoji {
  font-size: 26px;
  line-height: 1;
}

.emotion-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.emotion-tag:hover {
  border-color: #d0e7ff;
  background: #f0f7ff;
  transform: translateY(-2px);
}

.emotion-tag.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.25);
}

.emotion-tag.active .emotion-label {
  color: #ffffff;
}

/* 话题输入 */
.topic-input-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 12px 14px;
  background: #f8fbff;
  border: 1px solid #eef2f6;
  border-radius: 12px;
  transition: border-color 0.25s ease;
}

.topic-input-wrap:focus-within {
  border-color: var(--brand-primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.08);
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.topic-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: rgba(0, 82, 217, 0.08);
  color: var(--brand-primary);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.topic-remove {
  background: transparent;
  border: none;
  color: var(--brand-primary);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0 0 0 2px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.topic-remove:hover {
  opacity: 1;
}

.topic-input {
  flex: 1;
  min-width: 120px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #1f2937;
  font-family: inherit;
}

.topic-input::placeholder {
  color: #9ca3af;
}

/* 内容输入 */
.content-wrapper {
  position: relative;
}

.content-textarea {
  width: 100%;
  min-height: 160px;
  padding: 16px 18px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  font-size: 15px;
  line-height: 1.8;
  color: #1f2937;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.content-textarea:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.08);
}

.content-textarea::placeholder {
  color: #9ca3af;
}

.content-count {
  position: absolute;
  right: 8px;
  bottom: -22px;
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

/* 图片上传 */
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
  border-color: var(--brand-primary);
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

/* 提交按钮 */
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
  box-shadow: 0 12px 28px rgba(0, 82, 217, 0.35);
  transform: translateY(-3px);
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

/* 成功弹窗 */
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
  font-size: 20px;
  margin-bottom: 24px;
  color: #1f2937;
  font-weight: 700;
}

:deep(.el-switch.is-checked .el-switch__core) {
  background-color: var(--brand-primary) !important;
  border-color: var(--brand-primary) !important;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #eef2f6;
}

:deep(.el-button--primary) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

:deep(.el-button--primary:hover) {
  background: #0040b0;
  border-color: #0040b0;
}

@media (max-width: 768px) {
  .emotion-tags {
    gap: 12px;
  }
  .emotion-tag {
    width: 48px;
    height: 48px;
    font-size: 22px;
    border-radius: 12px;
  }
  .submit-section {
    padding: 28px 0 12px;
  }
}
</style>
