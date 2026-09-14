<!-- 02 心理档案区块 · MBTI/压力/睡眠/兴趣标签/个人简介 -->
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Edit, View, Plus, Close } from '@element-plus/icons-vue'
import type { PsychFormData } from './types'

const form = defineModel<PsychFormData>('form', { required: true })

const { t } = useI18n()

const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']

const psychBackup = ref<PsychFormData | null>(null)

const psychEditing = ref(false)

const stressLabel = computed(() => {
  if (form.value.stressLevel === 'low') return t('profile.card.psychological.stressLow')
  if (form.value.stressLevel === 'mid') return t('profile.card.psychological.stressMid')
  if (form.value.stressLevel === 'high') return t('profile.card.psychological.stressHigh')
  return '—'
})

const sleepLabel = computed(() => {
  if (form.value.sleepQuality === 'poor') return t('profile.card.psychological.sleepPoor')
  if (form.value.sleepQuality === 'fair') return t('profile.card.psychological.sleepFair')
  if (form.value.sleepQuality === 'good') return t('profile.card.psychological.sleepGood')
  return '—'
})

const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref<{ focus: () => void } | null>(null)

function showTagInput() {
  tagInputVisible.value = true
  nextTick(() => tagInputRef.value?.focus?.())
}

function addTag() {
  const v = tagInputValue.value.trim()
  if (v && !form.value.interests.includes(v)) {
    form.value.interests.push(v)
  }
  tagInputValue.value = ''
  tagInputVisible.value = false
}

function removeTag(i: number) {
  form.value.interests.splice(i, 1)
}

function togglePsychEdit() {
  if (!psychEditing.value) {
    psychBackup.value = { ...form.value, interests: [...form.value.interests] }
  }
  psychEditing.value = !psychEditing.value
}

function cancelPsychEdit() {
  if (psychBackup.value) {
    Object.assign(form.value, psychBackup.value)
    form.value.interests = [...psychBackup.value.interests]
  }
  psychEditing.value = false
}

function savePsych() {
  if (form.value.bio && form.value.bio.length > 200) {
    ElMessage.warning(t('counseling.validation.formIncomplete'))
    return
  }
  ElMessage.success(t('profile.card.psychological.saveSuccess'))
  psychEditing.value = false
}
</script>

<template>
  <section class="mag-section">
    <div class="sec-head">
      <span class="sec-num">02</span>
      <div class="sec-titles">
        <h2 class="sec-title">{{ t('profile.card.psychological.title') }}</h2>
        <p class="sec-desc">{{ t('profile.card.psychological.desc') }}</p>
      </div>
      <button class="sec-toggle" @click="togglePsychEdit">
        <el-icon><component :is="psychEditing ? View : Edit" /></el-icon>
        <span>{{ psychEditing ? t('common.view') : t('common.edit') }}</span>
      </button>
    </div>

    <!-- 查看模式 -->
    <dl v-if="!psychEditing" class="field-list">
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.psychological.mbti') }}</dt>
        <dd class="field-value strong">{{ form.mbti || '—' }}</dd>
      </div>
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.psychological.stressLevel') }}</dt>
        <dd class="field-value">{{ stressLabel }}</dd>
      </div>
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.psychological.sleepQuality') }}</dt>
        <dd class="field-value">{{ sleepLabel }}</dd>
      </div>
      <div class="field-row field-row--block">
        <dt class="field-label">{{ t('profile.card.psychological.interests') }}</dt>
        <dd class="field-value">
          <span v-if="!form.interests.length">—</span>
          <span v-for="(tag, i) in form.interests" :key="i" class="tag-chip">{{ tag }}</span>
        </dd>
      </div>
      <div class="field-row field-row--block">
        <dt class="field-label">{{ t('profile.card.psychological.bio') }}</dt>
        <dd class="field-value prose">{{ form.bio || '—' }}</dd>
      </div>
    </dl>

    <!-- 编辑模式 -->
    <el-form v-else :model="form" label-position="top" class="mag-form">
      <div class="form-grid two">
        <el-form-item :label="t('profile.card.psychological.mbti')">
          <el-select v-model="form.mbti" :placeholder="t('profile.card.psychological.mbtiPlaceholder')" clearable filterable>
            <el-option v-for="m in mbtiTypes" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('profile.card.psychological.stressLevel')">
          <el-radio-group v-model="form.stressLevel">
            <el-radio-button value="low">{{ t('profile.card.psychological.stressLow') }}</el-radio-button>
            <el-radio-button value="mid">{{ t('profile.card.psychological.stressMid') }}</el-radio-button>
            <el-radio-button value="high">{{ t('profile.card.psychological.stressHigh') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('profile.card.psychological.sleepQuality')">
          <el-radio-group v-model="form.sleepQuality">
            <el-radio-button value="poor">{{ t('profile.card.psychological.sleepPoor') }}</el-radio-button>
            <el-radio-button value="fair">{{ t('profile.card.psychological.sleepFair') }}</el-radio-button>
            <el-radio-button value="good">{{ t('profile.card.psychological.sleepGood') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item :label="t('profile.card.psychological.interests')">
        <div class="tag-area">
          <span v-for="(tag, i) in form.interests" :key="i" class="tag-chip removable">
            {{ tag }}
            <el-icon class="tag-close" @click="removeTag(i)"><Close /></el-icon>
          </span>
          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            size="small"
            class="tag-input"
            :placeholder="t('profile.card.psychological.interestPlaceholder')"
            @keyup.enter="addTag"
            @blur="addTag"
          />
          <button v-else type="button" class="tag-add" @click="showTagInput">
            <el-icon><Plus /></el-icon>
          </button>
        </div>
      </el-form-item>
      <el-form-item :label="t('profile.card.psychological.bio')">
        <el-input
          v-model="form.bio"
          type="textarea"
          :rows="4"
          maxlength="200"
          show-word-limit
          class="custom-scroll"
        />
      </el-form-item>
      <div class="form-actions">
        <el-button class="ghost-btn" @click="cancelPsychEdit">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" class="solid-btn" @click="savePsych">{{ t('profile.card.psychological.save') }}</el-button>
      </div>
    </el-form>
  </section>
</template>

<style scoped>
/* ============ 杂志区块通用 ============ */
.mag-section {
  border-top: 1px solid var(--ink-200);
  padding: 48px 0 40px;
}

.sec-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: start;
  margin-bottom: 36px;
}

.sec-num {
  font-size: 28px;
  font-weight: 700;
  font-style: italic;
  color: var(--brand-primary);
  line-height: 1;
  padding-top: 2px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', STSong, serif;
}

.sec-titles {
  min-width: 0;
}

.sec-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: var(--ink-900);
  line-height: 1.2;
  letter-spacing: -0.3px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', STSong, serif;
}

.sec-desc {
  margin: 0;
  font-size: 14px;
  color: var(--ink-500);
  line-height: 1.6;
  max-width: 540px;
}

.sec-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--brand-primary);
  background: var(--brand-primary-faint);
  border: 1px solid var(--brand-primary-soft);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sec-toggle:hover {
  background: var(--brand-primary-soft);
}

/* ============ 字段列表（查看模式） ============ */
.field-list {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}

.field-row {
  padding: 18px 24px 18px 0;
  border-bottom: 1px solid var(--mist-075);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-row:not(:nth-child(3n)) {
  border-right: 1px solid var(--mist-075);
  padding-right: 24px;
}

.field-row:nth-child(3n) {
  padding-left: 24px;
}

.field-row--block {
  grid-column: 1 / -1;
  border-right: none !important;
  padding-left: 0 !important;
  padding-right: 0;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-400);
}

.field-value {
  margin: 0;
  font-size: 15px;
  color: var(--ink-800);
  line-height: 1.5;
  font-weight: 500;
}

.field-value.strong {
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: var(--brand-primary);
  letter-spacing: 1px;
}

.field-value.prose {
  font-weight: 400;
  color: var(--ink-700);
  line-height: 1.7;
  white-space: pre-wrap;
}

.tag-chip {
  display: inline-block;
  margin: 2px 6px 2px 0;
  padding: 4px 12px;
  font-size: 13px;
  color: var(--brand-primary);
  background: var(--brand-primary-faint);
  border: 1px solid var(--brand-primary-soft);
}

.tag-chip.removable {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tag-close {
  cursor: pointer;
  font-size: 12px;
  opacity: 0.6;
}

.tag-close:hover {
  opacity: 1;
}

/* ============ 表单（编辑模式） ============ */
.mag-form {
  max-width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px 24px;
}

.form-grid.two {
  grid-template-columns: repeat(2, 1fr);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--mist-075);
}

.solid-btn {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  border-radius: 0;
  font-weight: 600;
  padding: 10px 28px;
}

.solid-btn:hover {
  background: var(--brand-primary-deep);
  border-color: var(--brand-primary-deep);
}

.ghost-btn {
  border-radius: 0;
  font-weight: 600;
  padding: 10px 24px;
}

/* ============ 标签输入 ============ */
.tag-area {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px dashed var(--brand-primary);
  background: transparent;
  color: var(--brand-primary);
  cursor: pointer;
  transition: background 0.2s;
}

.tag-add:hover {
  background: var(--brand-primary-faint);
}

.tag-input {
  width: 150px;
}

/* ============ 自定义滚动条 ============ */
.custom-scroll :deep(.el-textarea__inner) {
  scrollbar-width: thin;
  scrollbar-color: var(--brand-primary-soft) transparent;
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  background: var(--brand-primary-soft);
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar-thumb:hover {
  background: var(--brand-primary);
}

/* ============ Element 表单微调 ============ */
.mag-form :deep(.el-form-item__label) {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-500);
  padding-bottom: 6px;
}

.mag-form :deep(.el-input__wrapper),
.mag-form :deep(.el-textarea__inner),
.mag-form :deep(.el-select__wrapper) {
  border-radius: 0;
}

@media (width <= 1024px) {
  .field-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .field-row:not(:nth-child(3n)) {
    border-right: none;
  }

  .field-row:nth-child(odd) {
    border-right: 1px solid var(--mist-075);
    padding-right: 24px;
  }

  .field-row:nth-child(even) {
    padding-left: 24px;
  }

  .form-grid,
  .form-grid.two {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width <= 768px) {
  .mag-section {
    padding: 36px 0 28px;
  }

  .sec-head {
    grid-template-columns: auto 1fr;
    gap: 16px;
    margin-bottom: 26px;
  }

  .sec-toggle {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 4px;
  }

  .sec-title {
    font-size: 22px;
  }

  .sec-num {
    font-size: 24px;
  }

  .field-list {
    grid-template-columns: 1fr;
  }

  .field-row,
  .field-row:nth-child(odd),
  .field-row:nth-child(even),
  .field-row:nth-child(3n) {
    border-right: none;
    padding-left: 0;
    padding-right: 0;
  }

  .form-grid,
  .form-grid.two {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .form-actions .el-button {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>
