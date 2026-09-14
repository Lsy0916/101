<!-- 02 · 通知偏好：五项开关两栏排布 -->
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Bell } from '@element-plus/icons-vue'

const { t } = useI18n()

const notifications = reactive({
  booking: true,
  assessment: true,
  comment: false,
  activity: true,
  marketing: false
})

const notifItems = computed<Array<{ key: keyof typeof notifications; label: string; hint: string }>>(() => [
  { key: 'booking', label: t('settings.card.notifications.items.booking'), hint: t('settings.card.notifications.hints.booking') },
  { key: 'assessment', label: t('settings.card.notifications.items.assessment'), hint: t('settings.card.notifications.hints.assessment') },
  { key: 'comment', label: t('settings.card.notifications.items.comment'), hint: t('settings.card.notifications.hints.comment') },
  { key: 'activity', label: t('settings.card.notifications.items.activity'), hint: t('settings.card.notifications.hints.activity') },
  { key: 'marketing', label: t('settings.card.notifications.items.marketing'), hint: t('settings.card.notifications.hints.marketing') }
])

function saveNotifications() {
  ElMessage.success(t('settings.card.notifications.saveSuccess'))
}
</script>

<template>
  <section id="sec-notifications" class="editorial-section">
    <div class="section-marker">
      <span class="marker-num">02</span>
      <span class="marker-rule"></span>
      <el-icon class="marker-icon"><Bell /></el-icon>
      <span class="marker-label">{{ t('settings.card.notifications.title') }}</span>
    </div>
    <div class="section-headline-row">
      <h2 class="section-headline">{{ t('settings.card.notifications.title') }}</h2>
      <p class="section-deck">{{ t('settings.card.notifications.desc') }}</p>
    </div>
    <div class="editorial-grid two-col">
      <div class="editorial-col">
        <ul class="switch-list">
          <li
            v-for="item in notifItems.slice(0, 3)"
            :key="item.key"
            class="switch-row"
          >
            <div class="switch-text">
              <span class="switch-label">{{ item.label }}</span>
              <span class="switch-hint">{{ item.hint }}</span>
            </div>
            <el-switch v-model="notifications[item.key]" />
          </li>
        </ul>
      </div>
      <div class="editorial-col">
        <ul class="switch-list">
          <li
            v-for="item in notifItems.slice(3)"
            :key="item.key"
            class="switch-row"
          >
            <div class="switch-text">
              <span class="switch-label">{{ item.label }}</span>
              <span class="switch-hint">{{ item.hint }}</span>
            </div>
            <el-switch v-model="notifications[item.key]" />
          </li>
        </ul>
        <div class="field-actions">
          <button class="editorial-btn" @click="saveNotifications">
            {{ t('settings.card.notifications.save') }}
          </button>
        </div>
      </div>
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

/* ============ 网格 ============ */
.editorial-grid {
  display: grid;
}
.two-col { grid-template-columns: 1fr 1fr; }

.editorial-col {
  padding: 0 32px;
  border-right: 1px solid var(--ink-200);
}
.editorial-col:first-child { padding-left: 0; }

.editorial-col:last-child {
  padding-right: 0;
  border-right: none;
}

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

.switch-hint {
  font-size: 12px;
  font-style: italic;
  color: var(--ink-400);
  line-height: 1.4;
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
  .two-col { grid-template-columns: 1fr; }

  .editorial-col {
    padding: 24px 0;
    border-right: none;
    border-bottom: 1px solid var(--ink-200);
  }
  .editorial-col:first-child { padding-top: 0; }

  .editorial-col:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

@media (width <= 768px) {
  .field-actions { justify-content: stretch; }

  .field-actions .editorial-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
