<!-- 03 · 隐私控制：可见性三选一卡片 + 两个开关 -->
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Hide, Check } from '@element-plus/icons-vue'

const { t } = useI18n()

const privacy = reactive({
  visibility: 'friends',
  searchable: true,
  showProfile: false
})

const visibilityOpts = computed(() => [
  { value: 'public', label: t('settings.card.privacy.visibilityPublic') },
  { value: 'friends', label: t('settings.card.privacy.visibilityFriends') },
  { value: 'private', label: t('settings.card.privacy.visibilityPrivate') }
])

function savePrivacy() {
  ElMessage.success(t('settings.card.privacy.saveSuccess'))
}
</script>

<template>
  <section id="sec-privacy" class="editorial-section">
    <div class="section-marker">
      <span class="marker-num">03</span>
      <span class="marker-rule"></span>
      <el-icon class="marker-icon"><Hide /></el-icon>
      <span class="marker-label">{{ t('settings.card.privacy.title') }}</span>
    </div>
    <div class="section-headline-row">
      <h2 class="section-headline">{{ t('settings.card.privacy.title') }}</h2>
      <p class="section-deck">{{ t('settings.card.privacy.desc') }}</p>
    </div>
    <h3 class="col-title">{{ t('settings.card.privacy.visibility') }}</h3>
    <div class="visibility-grid">
      <label
        v-for="(opt, i) in visibilityOpts"
        :key="opt.value"
        class="vis-option"
        :class="{ checked: privacy.visibility === opt.value }"
      >
        <input v-model="privacy.visibility" type="radio" :value="opt.value" />
        <span class="vis-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="vis-label">{{ opt.label }}</span>
        <span class="vis-check"><el-icon><Check /></el-icon></span>
      </label>
    </div>
    <ul class="switch-list">
      <li class="switch-row">
        <div class="switch-text">
          <span class="switch-label">{{ t('settings.card.privacy.searchable') }}</span>
        </div>
        <el-switch v-model="privacy.searchable" />
      </li>
      <li class="switch-row">
        <div class="switch-text">
          <span class="switch-label">{{ t('settings.card.privacy.showProfile') }}</span>
        </div>
        <el-switch v-model="privacy.showProfile" />
      </li>
    </ul>
    <div class="field-actions">
      <button class="editorial-btn" @click="savePrivacy">
        {{ t('settings.card.privacy.save') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
/* ============ 区块通用 ============ */
.editorial-section {
  padding: 40px 0 56px;
  border-top: 1px solid var(--ink-200);
  scroll-margin-top: 80px;
}

.editorial-section:first-of-type {
  border-top: 1px solid var(--ink-900);
}

.section-marker {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}

.marker-num {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 30px;
  font-weight: 700;
  color: var(--brand-primary);
  line-height: 1;
}

.marker-rule {
  flex: 1;
  height: 1px;
  background: var(--ink-900);
}

.marker-icon {
  font-size: 16px;
  color: var(--ink-900);
}

.marker-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ink-900);
}

.section-headline-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: end;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--ink-200);
}

.section-headline {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--ink-900);
}

.section-deck {
  margin: 0;
  font-size: 15px;
  font-style: italic;
  line-height: 1.6;
  color: var(--ink-500);
}

/* ============ 栏目标题 ============ */
.col-title {
  margin: 0 0 18px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-900);
}

/* ============ 可见性选项 ============ */
.visibility-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 28px;
  border-top: 1px solid var(--ink-200);
  border-bottom: 1px solid var(--ink-200);
}

.vis-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 20px;
  cursor: pointer;
  border-right: 1px solid var(--ink-200);
  transition: background 0.2s;
}
.vis-option:last-child { border-right: none; }
.vis-option:hover { background: var(--brand-primary-faint); }
.vis-option.checked { background: var(--brand-primary-faint); }

.vis-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.vis-num {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 20px;
  font-weight: 600;
  color: var(--ink-400);
}
.vis-option.checked .vis-num { color: var(--brand-primary); }

.vis-label {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-700);
}
.vis-option.checked .vis-label { color: var(--brand-primary); }

.vis-check {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  font-size: 12px;
  transition: color 0.2s;
}
.vis-option.checked .vis-check { color: var(--brand-primary); }

/* ============ 开关列表 ============ */
.switch-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--ink-200);
}
.switch-row:last-child { border-bottom: none; }

.switch-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.switch-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink-900);
}

/* ============ 字段与按钮 ============ */
.field-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.editorial-btn {
  padding: 10px 28px;
  background: var(--ink-900);
  color: white;
  border: 1px solid var(--ink-900);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.editorial-btn:hover {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

@media (width <= 1024px) {
  .section-headline-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .section-headline { font-size: 26px; }
}

@media (width <= 768px) {
  .visibility-grid { grid-template-columns: 1fr; }

  .vis-option {
    border-right: none;
    border-bottom: 1px solid var(--ink-200);
  }
  .vis-option:last-child { border-bottom: none; }
  .field-actions { justify-content: stretch; }

  .field-actions .editorial-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
