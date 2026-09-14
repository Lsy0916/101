<!-- 04 · 偏好设置：语言 / 主题 / 默认首页 -->
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Setting } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { themeMode, setThemeMode, isDark } = useTheme()
const { locale, setLocale } = useLocale()

const pref = reactive({ defaultHome: 'home' })

const homeOpts = computed(() => [
  { value: 'home', label: t('settings.card.preferences.homePage') },
  { value: 'assessment', label: t('settings.card.preferences.assessmentPage') },
  { value: 'articles', label: t('settings.card.preferences.articlesPage') }
])

const langModel = ref(locale.value)
const themeModel = ref(themeMode.value)

function onLangChange(val: string) {
  setLocale(val)
  ElMessage.success(t('settings.card.preferences.languageChanged'))
}

function onThemeChange(val: 'light' | 'dark' | 'auto') {
  setThemeMode(val)
  ElMessage.success(t('settings.card.preferences.themeChanged'))
}
</script>

<template>
  <section id="sec-preferences" class="editorial-section">
    <div class="section-marker">
      <span class="marker-num">04</span>
      <span class="marker-rule"></span>
      <el-icon class="marker-icon"><Setting /></el-icon>
      <span class="marker-label">{{ t('settings.card.preferences.title') }}</span>
    </div>
    <div class="section-headline-row">
      <h2 class="section-headline">{{ t('settings.card.preferences.title') }}</h2>
      <p class="section-deck">{{ t('settings.card.preferences.desc') }}</p>
    </div>
    <div class="editorial-grid three-col">
      <div class="editorial-col">
        <h3 class="col-title">{{ t('settings.card.preferences.language') }}</h3>
        <el-select v-model="langModel" style="width: 100%" @change="onLangChange">
          <el-option :label="t('settings.card.preferences.zhCN')" value="zh-CN" />
          <el-option :label="t('settings.card.preferences.zhTW')" value="zh-TW" />
          <el-option :label="t('settings.card.preferences.enUS')" value="en-US" />
        </el-select>
      </div>
      <div class="editorial-col">
        <h3 class="col-title">{{ t('settings.card.preferences.theme') }}</h3>
        <el-select v-model="themeModel" style="width: 100%" @change="onThemeChange">
          <el-option :label="t('nav.theme.light')" value="light" />
          <el-option :label="t('nav.theme.dark')" value="dark" />
          <el-option :label="t('nav.theme.auto')" value="auto" />
        </el-select>
        <p v-if="themeModel === 'auto'" class="field-status">
          {{ t('settings.card.preferences.themeAutoHint') }} ·
          {{ isDark ? t('settings.card.preferences.themeActualDark') : t('settings.card.preferences.themeActualLight') }}
        </p>
      </div>
      <div class="editorial-col">
        <h3 class="col-title">{{ t('settings.card.preferences.defaultHome') }}</h3>
        <div class="home-options">
          <label
            v-for="opt in homeOpts"
            :key="opt.value"
            class="home-option"
            :class="{ checked: pref.defaultHome === opt.value }"
          >
            <input v-model="pref.defaultHome" type="radio" :value="opt.value" />
            <span class="home-label">{{ opt.label }}</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============ 区块通用 ============ */
.editorial-section {
  padding: 40px 0 56px;
  border-top: 1px solid #e5e7eb;
  scroll-margin-top: 80px;
}
.editorial-section:first-of-type {
  border-top: 1px solid #111827;
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
  background: #111827;
}
.marker-icon {
  font-size: 16px;
  color: #111827;
}
.marker-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #111827;
}
.section-headline-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: end;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}
.section-headline {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.1;
  color: #111827;
}
.section-deck {
  margin: 0;
  font-size: 15px;
  font-style: italic;
  line-height: 1.6;
  color: #6b7280;
}

/* ============ 网格 ============ */
.editorial-grid {
  display: grid;
}
.three-col { grid-template-columns: 1fr 1fr 1fr; }
.editorial-col {
  padding: 0 32px;
  border-right: 1px solid #e5e7eb;
}
.editorial-col:first-child { padding-left: 0; }
.editorial-col:last-child {
  padding-right: 0;
  border-right: none;
}

/* ============ 栏目标题与状态 ============ */
.col-title {
  margin: 0 0 18px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #111827;
}
.field-status {
  margin: 8px 0 0;
  font-size: 12px;
  font-style: italic;
  color: var(--brand-primary);
}

/* ============ 默认首页选项 ============ */
.home-options {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e7eb;
}
.home-option {
  position: relative;
  display: flex;
  align-items: center;
  padding: 14px 0;
  cursor: pointer;
  border-bottom: 1px solid #e5e7eb;
  transition: padding 0.2s;
}
.home-option.checked { padding-left: 14px; }
.home-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.home-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}
.home-option.checked .home-label { color: var(--brand-primary); }
.home-option.checked::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: var(--brand-primary);
}

@media (max-width: 1024px) {
  .section-headline-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .section-headline { font-size: 26px; }
  .three-col { grid-template-columns: 1fr; }
  .editorial-col {
    padding: 24px 0;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  .editorial-col:first-child { padding-top: 0; }
  .editorial-col:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}
</style>
