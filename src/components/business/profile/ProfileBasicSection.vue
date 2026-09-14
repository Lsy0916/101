<!-- 01 基础资料区块 · 查看/编辑双模式 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Edit, View } from '@element-plus/icons-vue'
import type { ProfileFormData } from './types'

const form = defineModel<ProfileFormData>('form', { required: true })

const { t } = useI18n()

const profileBackup = ref<ProfileFormData | null>(null)

const profileEditing = ref(false)

const genderLabel = computed(() => {
  if (form.value.gender === 'male') return t('profile.card.profile.genderMale')
  if (form.value.gender === 'female') return t('profile.card.profile.genderFemale')
  if (form.value.gender === 'other') return t('profile.card.profile.genderOther')
  return '—'
})

function toggleProfileEdit() {
  if (!profileEditing.value) {
    profileBackup.value = { ...form.value }
  }
  profileEditing.value = !profileEditing.value
}

function cancelProfileEdit() {
  if (profileBackup.value) Object.assign(form.value, profileBackup.value)
  profileEditing.value = false
}

function saveProfile() {
  if (!form.value.name.trim()) {
    ElMessage.warning(t('home.validation.nameRequired'))
    return
  }
  if (!form.value.studentId.trim()) {
    ElMessage.warning(t('counseling.validation.formIncomplete'))
    return
  }
  if (form.value.enrollYear && !/^\d{4}$/.test(form.value.enrollYear)) {
    ElMessage.warning(t('counseling.validation.formIncomplete'))
    return
  }
  ElMessage.success(t('profile.card.profile.saveSuccess'))
  profileEditing.value = false
}
</script>

<template>
  <section class="mag-section">
    <div class="sec-head">
      <span class="sec-num">01</span>
      <div class="sec-titles">
        <h2 class="sec-title">{{ t('profile.card.profile.title') }}</h2>
        <p class="sec-desc">{{ t('profile.card.profile.desc') }}</p>
      </div>
      <button class="sec-toggle" @click="toggleProfileEdit">
        <el-icon><component :is="profileEditing ? View : Edit" /></el-icon>
        <span>{{ profileEditing ? t('common.view') : t('common.edit') }}</span>
      </button>
    </div>

    <!-- 查看模式 -->
    <dl v-if="!profileEditing" class="field-list">
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.profile.name') }}</dt>
        <dd class="field-value">{{ form.name || '—' }}</dd>
      </div>
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.profile.studentId') }}</dt>
        <dd class="field-value">{{ form.studentId || '—' }}</dd>
      </div>
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.profile.gender') }}</dt>
        <dd class="field-value">{{ genderLabel }}</dd>
      </div>
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.profile.school') }}</dt>
        <dd class="field-value">{{ form.school || '—' }}</dd>
      </div>
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.profile.major') }}</dt>
        <dd class="field-value">{{ form.major || '—' }}</dd>
      </div>
      <div class="field-row">
        <dt class="field-label">{{ t('profile.card.profile.enrollYear') }}</dt>
        <dd class="field-value">{{ form.enrollYear || '—' }}</dd>
      </div>
    </dl>

    <!-- 编辑模式 -->
    <el-form v-else :model="form" label-position="top" class="mag-form">
      <div class="form-grid">
        <el-form-item :label="t('profile.card.profile.name') + ' *'">
          <el-input v-model="form.name" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item :label="t('profile.card.profile.studentId') + ' *'">
          <el-input v-model="form.studentId" maxlength="20" />
        </el-form-item>
        <el-form-item :label="t('profile.card.profile.gender')">
          <el-select v-model="form.gender" clearable>
            <el-option :label="t('profile.card.profile.genderMale')" value="male" />
            <el-option :label="t('profile.card.profile.genderFemale')" value="female" />
            <el-option :label="t('profile.card.profile.genderOther')" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('profile.card.profile.school')">
          <el-input v-model="form.school" maxlength="40" />
        </el-form-item>
        <el-form-item :label="t('profile.card.profile.major')">
          <el-input v-model="form.major" maxlength="30" />
        </el-form-item>
        <el-form-item :label="t('profile.card.profile.enrollYear')">
          <el-input v-model="form.enrollYear" placeholder="2024" maxlength="4" />
        </el-form-item>
      </div>
      <div class="form-actions">
        <el-button class="ghost-btn" @click="cancelProfileEdit">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" class="solid-btn" @click="saveProfile">{{ t('profile.card.profile.save') }}</el-button>
      </div>
    </el-form>
  </section>
</template>

<style scoped>
/* ============ 杂志区块通用 ============ */
.mag-section {
  border-top: 1px solid #e5e7eb;
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
  font-family: Georgia, 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.sec-titles {
  min-width: 0;
}

.sec-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  letter-spacing: -0.3px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.sec-desc {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
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
  background: #f0f7ff;
  border: 1px solid #d0e7ff;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.sec-toggle:hover {
  background: #d0e7ff;
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
  border-bottom: 1px solid #f0f2f5;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-row:not(:nth-child(3n)) {
  border-right: 1px solid #f0f2f5;
  padding-right: 24px;
}

.field-row:nth-child(3n) {
  padding-left: 24px;
}

.field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9ca3af;
}

.field-value {
  margin: 0;
  font-size: 15px;
  color: #1f2937;
  line-height: 1.5;
  font-weight: 500;
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f2f5;
}

.solid-btn {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  border-radius: 0;
  font-weight: 600;
  padding: 10px 28px;
}

.solid-btn:hover {
  background: #0040a8;
  border-color: #0040a8;
}

.ghost-btn {
  border-radius: 0;
  font-weight: 600;
  padding: 10px 24px;
}

/* ============ Element 表单微调 ============ */
.mag-form :deep(.el-form-item__label) {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #6b7280;
  padding-bottom: 6px;
}

.mag-form :deep(.el-input__wrapper),
.mag-form :deep(.el-textarea__inner),
.mag-form :deep(.el-select__wrapper) {
  border-radius: 0;
}

@media (max-width: 1024px) {
  .field-list {
    grid-template-columns: repeat(2, 1fr);
  }
  .field-row:not(:nth-child(3n)) {
    border-right: none;
  }
  .field-row:nth-child(odd) {
    border-right: 1px solid #f0f2f5;
    padding-right: 24px;
  }
  .field-row:nth-child(even) {
    padding-left: 24px;
  }
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
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
  .form-grid {
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
