<template>
  <div class="settings-page">
    <!-- ============ Editorial Masthead ============ -->
    <SettingsMasthead :sections="sections" :active-section="activeSection" @navigate="scrollToSection" />

    <!-- ============ Sections ============ -->
    <main class="settings-main custom-scroll">
      <SettingsSecuritySection />
      <SettingsNotificationsSection />
      <SettingsPrivacySection />
      <SettingsPreferencesSection />
      <SettingsDataSection />
    </main>

    <!-- ============ Mobile TOC strip ============ -->
    <nav class="mobile-toc" aria-label="Settings sections">
      <a
        v-for="(sec, i) in sections"
        :key="sec.id"
        href="javascript:void(0)"
        class="mtoc-item"
        :class="{ active: activeSection === sec.id }"
        @click.prevent="scrollToSection(sec.id)"
      >
        <span class="mtoc-num">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="mtoc-text">{{ sec.label }}</span>
      </a>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import SettingsMasthead from '@/components/business/settings/SettingsMasthead.vue'
import SettingsSecuritySection from '@/components/business/settings/SettingsSecuritySection.vue'
import SettingsNotificationsSection from '@/components/business/settings/SettingsNotificationsSection.vue'
import SettingsPrivacySection from '@/components/business/settings/SettingsPrivacySection.vue'
import SettingsPreferencesSection from '@/components/business/settings/SettingsPreferencesSection.vue'
import SettingsDataSection from '@/components/business/settings/SettingsDataSection.vue'

const { t } = useI18n()

/* ===== Sections / Navigation ===== */
const sections = computed(() => [
  { id: 'sec-security', label: t('settings.card.security.title') },
  { id: 'sec-notifications', label: t('settings.card.notifications.title') },
  { id: 'sec-privacy', label: t('settings.card.privacy.title') },
  { id: 'sec-preferences', label: t('settings.card.preferences.title') },
  { id: 'sec-data', label: t('settings.card.data.title') }
])

const activeSection = ref('sec-security')
let observer: IntersectionObserver | null = null

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(() => {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
  )
  sections.value.forEach((sec) => {
    const el = document.getElementById(sec.id)
    if (el) obs.observe(el)
  })
  observer = obs
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.settings-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 48px 100px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  color: #111827;
}

/* ============ Sections ============ */
.settings-main {
  display: flex;
  flex-direction: column;
}

/* ============ Mobile TOC ============ */
.mobile-toc { display: none; }

/* ============ 自定义滚动条 ============ */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #c1c8d0 transparent;
}
.custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: #c1c8d0; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--brand-primary); }

/* ============ Element Plus overrides ============ */
:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 0 !important;
  box-shadow: 0 0 0 1px #d1d5db inset !important;
}
:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--brand-primary) inset !important;
}
:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--brand-primary) inset !important;
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) { color: var(--brand-primary); }
:deep(.el-switch.is-checked .el-switch__core) {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}
:deep(.el-date-editor.el-input__wrapper) { border-radius: 0 !important; }
:deep(.el-date-editor .el-range-input) { font-family: inherit; }

/* ============ Responsive ============ */
@media (max-width: 1024px) {
  .settings-page { padding: 0 24px 80px; }

  .mobile-toc {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 50;
    background: #fff;
    border-top: 1px solid #111827;
    border-bottom: 1px solid #e5e7eb;
    overflow-x: auto;
    margin: 0 -24px 0;
    padding: 0 24px;
    scrollbar-width: none;
  }
  .mobile-toc::-webkit-scrollbar { display: none; }
  .mtoc-item {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 12px 18px;
    text-decoration: none;
    color: #6b7280;
    border-bottom: 2px solid transparent;
    transition: color 0.2s;
  }
  .mtoc-item.active {
    color: var(--brand-primary);
    border-bottom-color: var(--brand-primary);
  }
  .mtoc-num {
    font-family: Georgia, 'Times New Roman', serif;
    font-style: italic;
    font-size: 14px;
    font-weight: 600;
  }
  .mtoc-text {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .settings-page { padding: 0 16px 80px; }
}
</style>
