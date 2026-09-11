<template>
  <div class="settings-page">
    <!-- ============ Editorial Masthead ============ -->
    <header class="masthead">
      <div class="masthead-col masthead-mark">
        <span class="vol-mark">№</span>
        <span class="vol-text">VOL. 2026</span>
        <span class="vol-sub">{{ t('settings.eyebrow') }}</span>
      </div>
      <div class="masthead-col masthead-title-block">
        <p class="masthead-eyebrow">{{ t('settings.eyebrow') }}</p>
        <h1 class="masthead-title" v-html="t('settings.title')"></h1>
        <p class="masthead-deck">{{ t('settings.desc') }}</p>
      </div>
      <div class="masthead-col masthead-toc">
        <p class="toc-label">Index</p>
        <ol class="toc-list">
          <li v-for="(sec, i) in sections" :key="sec.id">
            <a
              href="javascript:void(0)"
              class="toc-link"
              :class="{ active: activeSection === sec.id }"
              @click.prevent="scrollToSection(sec.id)"
            >
              <span class="toc-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="toc-text">{{ sec.label }}</span>
            </a>
          </li>
        </ol>
      </div>
    </header>

    <!-- ============ Sections ============ -->
    <main class="settings-main custom-scroll">
      <!-- 01 · Account Security -->
      <section id="sec-security" class="editorial-section">
        <div class="section-marker">
          <span class="marker-num">01</span>
          <span class="marker-rule"></span>
          <el-icon class="marker-icon"><Lock /></el-icon>
          <span class="marker-label">{{ t('settings.card.security.title') }}</span>
        </div>
        <div class="section-headline-row">
          <h2 class="section-headline">{{ t('settings.card.security.title') }}</h2>
          <p class="section-deck">{{ t('settings.card.security.desc') }}</p>
        </div>

        <div class="editorial-grid two-col">
          <!-- Column 1 · Password -->
          <div class="editorial-col">
            <h3 class="col-title">{{ t('settings.card.security.changePassword') }}</h3>
            <el-form :model="pwdForm" label-position="top" class="pwd-form">
              <div class="field-stack">
                <el-form-item :label="t('settings.card.security.oldPassword')">
                  <el-input v-model="pwdForm.old" type="password" show-password />
                </el-form-item>
                <el-form-item :label="t('settings.card.security.newPassword')">
                  <el-input v-model="pwdForm.new" type="password" show-password />
                </el-form-item>
                <el-form-item :label="t('settings.card.security.confirmPassword')">
                  <el-input v-model="pwdForm.confirm" type="password" show-password />
                </el-form-item>
              </div>
            </el-form>
            <div class="field-actions">
              <button class="editorial-btn" @click="updatePassword">
                {{ t('settings.card.security.updatePassword') }}
              </button>
            </div>
          </div>

          <!-- Column 2 · Contacts + Devices -->
          <div class="editorial-col">
            <h3 class="col-title">{{ t('settings.card.security.boundAccounts') }}</h3>
            <ul class="entry-list">
              <li class="entry-row">
                <span class="entry-mark"><el-icon><Iphone /></el-icon></span>
                <div class="entry-text">
                  <span class="entry-key">{{ t('settings.card.security.phone') }}</span>
                  <span class="entry-value">{{ maskedPhone }}</span>
                </div>
                <button class="link-btn" @click="openContactDialog('phone')">
                  {{ t('settings.card.security.modify') }}
                </button>
              </li>
              <li class="entry-row">
                <span class="entry-mark"><el-icon><Message /></el-icon></span>
                <div class="entry-text">
                  <span class="entry-key">{{ t('settings.card.security.email') }}</span>
                  <span class="entry-value">{{ maskedEmail }}</span>
                </div>
                <button class="link-btn" @click="openContactDialog('email')">
                  {{ t('settings.card.security.modify') }}
                </button>
              </li>
            </ul>

            <h3 class="col-title col-title-spaced">{{ t('settings.card.security.loginDevices') }}</h3>
            <ul class="device-list">
              <li
                v-for="device in devices"
                :key="device.id"
                class="device-row"
                :class="{ current: device.current }"
              >
                <div class="device-head">
                  <span class="device-name">{{ device.name }}</span>
                  <span v-if="device.current" class="device-tag">{{ t('settings.card.security.currentDevice') }}</span>
                </div>
                <dl class="device-meta">
                  <div class="meta-item">
                    <dt>{{ t('settings.card.security.deviceIp') }}</dt>
                    <dd>{{ device.ip }}</dd>
                  </div>
                  <div class="meta-item">
                    <dt>{{ t('settings.card.security.deviceBrowser') }}</dt>
                    <dd>{{ device.browser }}</dd>
                  </div>
                  <div class="meta-item">
                    <dt>{{ t('settings.card.security.lastLogin') }}</dt>
                    <dd>{{ device.lastLogin }}</dd>
                  </div>
                </dl>
                <button
                  v-if="!device.current"
                  class="link-btn link-btn-danger"
                  @click="revokeDevice(device)"
                >
                  {{ t('settings.card.security.revokeDevice') }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 02 · Notifications -->
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

      <!-- 03 · Privacy -->
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

      <!-- 04 · Preferences -->
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

      <!-- 05 · Data Management -->
      <section id="sec-data" class="editorial-section">
        <div class="section-marker">
          <span class="marker-num">05</span>
          <span class="marker-rule"></span>
          <el-icon class="marker-icon"><FolderOpened /></el-icon>
          <span class="marker-label">{{ t('settings.card.data.title') }}</span>
        </div>
        <div class="section-headline-row">
          <h2 class="section-headline">{{ t('settings.card.data.title') }}</h2>
          <p class="section-deck">{{ t('settings.card.data.desc') }}</p>
        </div>
        <div class="editorial-grid two-col">
          <!-- Export -->
          <div class="editorial-col">
            <h3 class="col-title">{{ t('settings.card.data.exportBtn') }}</h3>
            <p class="col-deck">{{ t('settings.card.data.exportDesc') }}</p>
            <div class="field">
              <label class="field-label">{{ t('settings.card.data.dateRange') }}</label>
              <el-date-picker
                v-model="exportForm.dateRange"
                type="daterange"
                range-separator="—"
                :start-placeholder="t('settings.card.data.startDate')"
                :end-placeholder="t('settings.card.data.endDate')"
                style="width: 100%"
              />
            </div>
            <div class="field">
              <label class="field-label">{{ t('settings.card.data.dataTypes') }}</label>
              <div class="checkbox-grid">
                <el-checkbox v-model="exportForm.types.assessment">
                  {{ t('settings.card.data.typeAssessment') }}
                </el-checkbox>
                <el-checkbox v-model="exportForm.types.counseling">
                  {{ t('settings.card.data.typeCounseling') }}
                </el-checkbox>
                <el-checkbox v-model="exportForm.types.activity">
                  {{ t('settings.card.data.typeActivity') }}
                </el-checkbox>
                <el-checkbox v-model="exportForm.types.profile">
                  {{ t('settings.card.data.typeProfile') }}
                </el-checkbox>
              </div>
            </div>
            <div class="field-actions">
              <button class="editorial-btn" @click="exportData">
                {{ t('settings.card.data.exportBtn') }}
              </button>
            </div>
          </div>
          <!-- Clear cache -->
          <div class="editorial-col">
            <h3 class="col-title col-title-danger">{{ t('settings.card.data.clearBtn') }}</h3>
            <p class="col-deck">{{ t('settings.card.data.clearCacheDesc') }}</p>
            <div class="field">
              <label class="field-label">{{ t('settings.card.data.cacheTypes') }}</label>
              <div class="checkbox-grid">
                <el-checkbox v-model="cacheForm.types.temp">
                  {{ t('settings.card.data.cacheTemp') }}
                </el-checkbox>
                <el-checkbox v-model="cacheForm.types.history">
                  {{ t('settings.card.data.cacheHistory') }}
                </el-checkbox>
                <el-checkbox v-model="cacheForm.types.assessment">
                  {{ t('settings.card.data.cacheAssessment') }}
                </el-checkbox>
                <el-checkbox v-model="cacheForm.types.form">
                  {{ t('settings.card.data.cacheForm') }}
                </el-checkbox>
              </div>
            </div>
            <div class="field-actions">
              <button class="editorial-btn editorial-btn-danger" @click="clearCache">
                {{ t('settings.card.data.clearBtn') }}
              </button>
            </div>
          </div>
        </div>
      </section>
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

    <!-- ============ Modify Contact Dialog ============ -->
    <el-dialog
      v-model="contactDialog.visible"
      :title="contactDialog.type === 'phone'
        ? t('settings.card.security.dialog.modifyPhone')
        : t('settings.card.security.dialog.modifyEmail')"
      width="520px"
      class="contact-dialog"
      :close-on-click-modal="false"
      align-center
    >
      <!-- Step indicator -->
      <div class="dialog-steps">
        <div
          v-for="n in 3"
          :key="n"
          class="ds-item"
          :class="{ active: contactDialog.step >= n, current: contactDialog.step === n }"
        >
          <span class="ds-num">{{ n }}</span>
          <span class="ds-label">{{ stepLabels[n - 1] }}</span>
        </div>
      </div>

      <!-- Step 1 · Identity verification (verification code only) -->
      <div v-if="contactDialog.step === 1" class="dialog-body">
        <div class="field">
          <label class="field-label">
            {{ t('settings.card.security.dialog.sendCodeToCurrent', { type: currentTypeLabel }) }}
          </label>
          <div class="code-row">
            <el-input
              v-model="contactDialog.currentCode"
              :placeholder="t('settings.card.security.dialog.codePlaceholder')"
            />
            <button
              class="send-btn"
              :disabled="contactDialog.countdown > 0"
              @click="sendCode('current')"
            >
              {{ contactDialog.countdown > 0
                ? t('settings.card.security.dialog.resendIn', { n: contactDialog.countdown })
                : t('settings.card.security.dialog.getCode') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2 · New contact -->
      <div v-if="contactDialog.step === 2" class="dialog-body">
        <div class="field">
          <label class="field-label">
            {{ t('settings.card.security.dialog.newValueLabel', { type: currentTypeLabel }) }}
          </label>
          <el-input
            v-model="contactDialog.newValue"
            :placeholder="t('settings.card.security.dialog.newValuePlaceholder', { type: currentTypeLabel })"
          />
        </div>
      </div>

      <!-- Step 3 · Verify new contact -->
      <div v-if="contactDialog.step === 3" class="dialog-body">
        <div class="summary-row">
          <span class="summary-label">{{ currentTypeLabel }}</span>
          <strong class="summary-value">{{ contactDialog.newValue }}</strong>
        </div>
        <div class="field">
          <label class="field-label">
            {{ t('settings.card.security.dialog.sendCodeToNew', { type: currentTypeLabel }) }}
          </label>
          <div class="code-row">
            <el-input
              v-model="contactDialog.newCode"
              :placeholder="t('settings.card.security.dialog.codePlaceholder')"
            />
            <button
              class="send-btn"
              :disabled="contactDialog.countdown > 0 || !contactDialog.newValue"
              @click="sendCode('new')"
            >
              {{ contactDialog.countdown > 0
                ? t('settings.card.security.dialog.resendIn', { n: contactDialog.countdown })
                : t('settings.card.security.dialog.getCode') }}
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button class="editorial-btn editorial-btn-ghost" @click="closeContactDialog">
            {{ t('common.cancel') }}
          </button>
          <button
            v-if="contactDialog.step > 1"
            class="editorial-btn editorial-btn-ghost"
            @click="contactDialog.step--"
          >
            {{ t('settings.card.security.dialog.prev') }}
          </button>
          <button
            v-if="contactDialog.step < 3"
            class="editorial-btn"
            @click="nextStep"
          >
            {{ t('settings.card.security.dialog.next') }}
          </button>
          <button
            v-else
            class="editorial-btn"
            @click="submitContactDialog"
          >
            {{ t('settings.card.security.dialog.submit') }}
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Lock, Iphone, Message, Bell, Hide, Setting, FolderOpened, Check
} from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { themeMode, setThemeMode, isDark } = useTheme()
const { locale, setLocale } = useLocale()

/* ===== Password ===== */
const pwdForm = reactive({ old: '', new: '', confirm: '' })

function updatePassword() {
  if (!pwdForm.old || !pwdForm.new || !pwdForm.confirm) {
    ElMessage.warning(t('settings.card.security.fillRequired'))
    return
  }
  if (pwdForm.new !== pwdForm.confirm) {
    ElMessage.error(t('settings.card.security.passwordMismatch'))
    return
  }
  ElMessage.success(t('settings.card.security.passwordChanged'))
  pwdForm.old = ''
  pwdForm.new = ''
  pwdForm.confirm = ''
}

/* ===== Contacts ===== */
const phone = ref('138****8888')
const email = ref('ex****@example.com')
const maskedPhone = computed(() => phone.value)
const maskedEmail = computed(() => email.value)

const contactDialog = reactive({
  visible: false,
  type: 'phone',
  step: 1,
  currentCode: '',
  newValue: '',
  newCode: '',
  countdown: 0
})

let countdownTimer: ReturnType<typeof setInterval> | null = null

const currentTypeLabel = computed(() =>
  contactDialog.type === 'phone'
    ? t('settings.card.security.dialog.typePhone')
    : t('settings.card.security.dialog.typeEmail')
)

const stepLabels = computed(() => [
  t('settings.card.security.dialog.step1'),
  t('settings.card.security.dialog.step2', { type: currentTypeLabel.value }),
  t('settings.card.security.dialog.step3', { type: currentTypeLabel.value })
])

function openContactDialog(type: string) {
  contactDialog.visible = true
  contactDialog.type = type
  contactDialog.step = 1
  contactDialog.currentCode = ''
  contactDialog.newValue = ''
  contactDialog.newCode = ''
  contactDialog.countdown = 0
  stopCountdown()
}

function closeContactDialog() {
  contactDialog.visible = false
  stopCountdown()
}

function startCountdown() {
  stopCountdown()
  contactDialog.countdown = 60
  countdownTimer = setInterval(() => {
    contactDialog.countdown--
    if (contactDialog.countdown <= 0) {
      stopCountdown()
    }
  }, 1000)
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  contactDialog.countdown = 0
}

function sendCode(target: string) {
  startCountdown()
  const key = target === 'current' ? 'verifyCodeSent' : 'newCodeSent'
  ElMessage.success(t(`settings.card.security.dialog.${key}`, { type: currentTypeLabel.value }))
}

function validateContact(value: string, type: string) {
  if (type === 'phone') {
    return /^1[3-9]\d{9}$/.test(value)
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function nextStep() {
  if (contactDialog.step === 1) {
    if (!/^\d{6}$/.test(contactDialog.currentCode)) {
      ElMessage.error(t('settings.card.security.dialog.codeError'))
      return
    }
    contactDialog.step = 2
    stopCountdown()
  } else if (contactDialog.step === 2) {
    if (!validateContact(contactDialog.newValue, contactDialog.type)) {
      ElMessage.error(
        contactDialog.type === 'phone'
          ? t('settings.card.security.dialog.phoneFormat')
          : t('settings.card.security.dialog.emailFormat')
      )
      return
    }
    contactDialog.step = 3
    stopCountdown()
  }
}

function submitContactDialog() {
  if (!/^\d{6}$/.test(contactDialog.newCode)) {
    ElMessage.error(t('settings.card.security.dialog.codeError'))
    return
  }
  const v = contactDialog.newValue
  if (contactDialog.type === 'phone') {
    phone.value = v.slice(0, 3) + '****' + v.slice(-4)
  } else {
    const [name, domain] = v.split('@')
    email.value = name.slice(0, 2) + '****@' + domain
  }
  ElMessage.success(t('settings.card.security.dialog.success'))
  closeContactDialog()
}

/* ===== Devices ===== */
interface DeviceItem {
  id: number
  name: string
  current: boolean
  ip: string
  browser: string
  lastLogin: string
}

const devices = ref<DeviceItem[]>([
  {
    id: 1,
    name: 'Windows · Chrome',
    current: true,
    ip: '192.168.1.108',
    browser: 'Chrome 121 / Windows 11',
    lastLogin: '2026-07-02 14:32'
  },
  {
    id: 2,
    name: 'iPhone · Safari',
    current: false,
    ip: '117.136.12.45',
    browser: 'Safari / iOS 17.2',
    lastLogin: '2026-06-30 09:15'
  },
  {
    id: 3,
    name: 'iPad · Safari',
    current: false,
    ip: '114.114.21.8',
    browser: 'Safari / iPadOS 17.1',
    lastLogin: '2026-06-20 20:48'
  }
])

function revokeDevice(device: DeviceItem) {
  ElMessageBox.confirm(
    t('settings.card.security.deviceRevokeConfirm'),
    t('settings.card.security.deviceRevokeTitle'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  )
    .then(() => {
      devices.value = devices.value.filter((d) => d.id !== device.id)
      ElMessage.success(t('settings.card.security.deviceRevoked'))
    })
    .catch(() => {})
}

/* ===== Notifications ===== */
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

/* ===== Privacy ===== */
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

/* ===== Preferences ===== */
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

/* ===== Data ===== */
const exportForm = reactive({
  dateRange: [] as string[],
  types: {
    assessment: true,
    counseling: false,
    activity: false,
    profile: false
  }
})

const cacheForm = reactive({
  types: {
    temp: false,
    history: false,
    assessment: false,
    form: false
  }
})

function exportData() {
  const hasType = Object.values(exportForm.types).some(Boolean)
  if (!hasType) {
    ElMessage.warning(t('settings.card.data.selectAtLeastOne'))
    return
  }
  ElMessage.success(t('settings.card.data.exportSuccess'))
}

function clearCache() {
  const hasType = Object.values(cacheForm.types).some(Boolean)
  if (!hasType) {
    ElMessage.warning(t('settings.card.data.selectAtLeastOne'))
    return
  }
  ElMessageBox.confirm(t('settings.card.data.clearConfirm'), {
    confirmButtonText: t('common.confirm'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  })
    .then(() => {
      Object.keys(cacheForm.types).forEach((k) => { cacheForm.types[k as keyof typeof cacheForm.types] = false })
      ElMessage.success(t('settings.card.data.clearSuccess'))
    })
    .catch(() => {})
}

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
  stopCountdown()
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

/* ============ Masthead ============ */
.masthead {
  display: grid;
  grid-template-columns: 200px 1fr 220px;
  border-top: 4px solid #111827;
  border-bottom: 1px solid #111827;
  margin-top: 32px;
  margin-bottom: 56px;
}
.masthead-col {
  padding: 28px 24px;
  border-right: 1px solid #e5e7eb;
}
.masthead-col:last-child {
  border-right: none;
}
.masthead-mark {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.vol-mark {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
  color: #0052d9;
}
.vol-text {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #111827;
}
.vol-sub {
  margin-top: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #6b7280;
}
.masthead-title-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.masthead-eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #0052d9;
}
.masthead-title {
  margin: 0 0 14px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 56px;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -1.5px;
  color: #111827;
}
.masthead-title :deep(em) {
  font-style: italic;
  background: linear-gradient(135deg, #0052d9, #1890ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.masthead-deck {
  margin: 0;
  max-width: 540px;
  font-size: 15px;
  line-height: 1.65;
  color: #4b5563;
}
.masthead-toc {
  display: flex;
  flex-direction: column;
}
.toc-label {
  margin: 0 0 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #6b7280;
}
.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.toc-link {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 7px 0;
  text-decoration: none;
  color: #374151;
  font-size: 13px;
  border-bottom: 1px solid transparent;
  transition: color 0.2s;
}
.toc-link:hover {
  color: #0052d9;
}
.toc-link.active {
  color: #0052d9;
}
.toc-link.active .toc-num {
  color: #0052d9;
}
.toc-num {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
  min-width: 22px;
}
.toc-text {
  flex: 1;
}

/* ============ Sections ============ */
.settings-main {
  display: flex;
  flex-direction: column;
}
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
  color: #0052d9;
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

/* ============ Grids ============ */
.editorial-grid {
  display: grid;
}
.two-col { grid-template-columns: 1fr 1fr; }
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

/* ============ Column Titles ============ */
.col-title {
  margin: 0 0 18px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #111827;
}
.col-title-spaced { margin-top: 36px; }
.col-title-danger { color: #dc2626; }
.col-deck {
  margin: 0 0 18px;
  font-size: 13px;
  font-style: italic;
  color: #6b7280;
  line-height: 1.5;
}

/* ============ Fields ============ */
.field-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.pwd-form :deep(.el-form-item__label) {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #374151;
  padding-bottom: 6px;
}
.pwd-form :deep(.el-input__wrapper) {
  border-radius: 0 !important;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}
.field-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #374151;
}
.field-status {
  margin: 8px 0 0;
  font-size: 12px;
  font-style: italic;
  color: #0052d9;
}
.field-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* ============ Editorial Button ============ */
.editorial-btn {
  padding: 10px 28px;
  background: #111827;
  color: #fff;
  border: 1px solid #111827;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}
.editorial-btn:hover {
  background: #0052d9;
  border-color: #0052d9;
}
.editorial-btn-ghost {
  background: transparent;
  color: #111827;
}
.editorial-btn-ghost:hover {
  background: #111827;
  color: #fff;
  border-color: #111827;
}
.editorial-btn-danger {
  background: #dc2626;
  border-color: #dc2626;
}
.editorial-btn-danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

/* ============ Entry List (Contacts) ============ */
.entry-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.entry-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}
.entry-row:last-child { border-bottom: none; }
.entry-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: #0052d9;
  border: 1px solid #e5e7eb;
}
.entry-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.entry-key {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #6b7280;
}
.entry-value {
  font-size: 15px;
  color: #111827;
  letter-spacing: 0.5px;
}

/* ============ Link Button ============ */
.link-btn {
  background: none;
  border: none;
  padding: 4px 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #0052d9;
  cursor: pointer;
  border-bottom: 1px solid #0052d9;
  transition: all 0.2s;
}
.link-btn:hover {
  color: #1890ff;
  border-bottom-color: #1890ff;
}
.link-btn-danger {
  color: #dc2626;
  border-bottom-color: #dc2626;
}
.link-btn-danger:hover {
  color: #b91c1c;
  border-bottom-color: #b91c1c;
}

/* ============ Devices ============ */
.device-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.device-row {
  padding: 18px 0;
  border-bottom: 1px solid #e5e7eb;
}
.device-row:last-child { border-bottom: none; }
.device-row.current {
  padding-left: 16px;
  border-left: 3px solid #0052d9;
}
.device-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.device-name {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}
.device-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #0052d9;
  border: 1px solid #0052d9;
  padding: 2px 6px;
}
.device-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin: 0 0 10px;
}
.meta-item { margin: 0; }
.meta-item dt {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 2px;
}
.meta-item dd {
  margin: 0;
  font-size: 13px;
  color: #374151;
}

/* ============ Switch List ============ */
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
  border-bottom: 1px solid #e5e7eb;
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
  color: #111827;
}
.switch-hint {
  font-size: 12px;
  font-style: italic;
  color: #9ca3af;
  line-height: 1.4;
}

/* ============ Visibility Options ============ */
.visibility-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 28px;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
.vis-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 20px;
  cursor: pointer;
  border-right: 1px solid #e5e7eb;
  transition: background 0.2s;
}
.vis-option:last-child { border-right: none; }
.vis-option:hover { background: #f0f7ff; }
.vis-option.checked { background: #f0f7ff; }
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
  color: #9ca3af;
}
.vis-option.checked .vis-num { color: #0052d9; }
.vis-label {
  font-size: 14px;
  font-weight: 700;
  color: #374151;
}
.vis-option.checked .vis-label { color: #0052d9; }
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
.vis-option.checked .vis-check { color: #0052d9; }

/* ============ Home Options ============ */
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
.home-option.checked .home-label { color: #0052d9; }
.home-option.checked::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: #0052d9;
}

/* ============ Checkbox Grid ============ */
.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
  padding: 8px 0;
}

/* ============ Mobile TOC ============ */
.mobile-toc { display: none; }

/* ============ Custom Scrollbar ============ */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #c1c8d0 transparent;
}
.custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb { background: #c1c8d0; }
.custom-scroll::-webkit-scrollbar-thumb:hover { background: #0052d9; }

/* ============ Element Plus overrides ============ */
:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 0 !important;
  box-shadow: 0 0 0 1px #d1d5db inset !important;
}
:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #0052d9 inset !important;
}
:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #0052d9 inset !important;
}
:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #0052d9;
  border-color: #0052d9;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) { color: #0052d9; }
:deep(.el-switch.is-checked .el-switch__core) {
  background-color: #0052d9;
  border-color: #0052d9;
}
:deep(.el-date-editor.el-input__wrapper) { border-radius: 0 !important; }
:deep(.el-date-editor .el-range-input) { font-family: inherit; }

/* ============ Responsive ============ */
@media (max-width: 1024px) {
  .settings-page { padding: 0 24px 80px; }
  .masthead {
    grid-template-columns: 1fr;
    margin-top: 24px;
    margin-bottom: 32px;
  }
  .masthead-col {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    padding: 20px 0;
  }
  .masthead-col:last-child { border-bottom: none; }
  .masthead-toc { display: none; }
  .masthead-title { font-size: 40px; }

  .section-headline-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .section-headline { font-size: 26px; }

  .two-col, .three-col { grid-template-columns: 1fr; }
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
    color: #0052d9;
    border-bottom-color: #0052d9;
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
  .masthead-title { font-size: 32px; }
  .visibility-grid { grid-template-columns: 1fr; }
  .vis-option {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  .vis-option:last-child { border-bottom: none; }
  .checkbox-grid { grid-template-columns: 1fr; }
  .device-meta {
    flex-direction: column;
    gap: 8px;
  }
  .field-actions { justify-content: stretch; }
  .field-actions .editorial-btn {
    flex: 1;
    text-align: center;
  }
}
</style>

<!-- Non-scoped styles for teleported el-dialog content -->
<style>
.contact-dialog {
  border-radius: 0 !important;
  border: 1px solid #111827;
}
.contact-dialog .el-dialog__header {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}
.contact-dialog .el-dialog__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}
.contact-dialog .el-dialog__body { padding: 24px; }
.contact-dialog .el-dialog__footer {
  padding: 16px 24px 20px;
  border-top: 1px solid #e5e7eb;
}
.contact-dialog .dialog-steps {
  display: flex;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}
.contact-dialog .ds-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0 4px;
  position: relative;
}
.contact-dialog .ds-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 14px;
  left: 50%;
  width: 100%;
  height: 1px;
  background: #e5e7eb;
  z-index: 0;
}
.contact-dialog .ds-item.active:not(:last-child)::after { background: #0052d9; }
.contact-dialog .ds-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 14px;
  font-weight: 700;
  color: #9ca3af;
  position: relative;
  z-index: 1;
}
.contact-dialog .ds-item.active .ds-num {
  border-color: #0052d9;
  color: #0052d9;
}
.contact-dialog .ds-item.current .ds-num {
  background: #0052d9;
  color: #fff;
}
.contact-dialog .ds-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9ca3af;
  text-align: center;
}
.contact-dialog .ds-item.active .ds-label { color: #111827; }
.contact-dialog .ds-item.current .ds-label { color: #0052d9; }
.contact-dialog .dialog-body { min-height: 140px; }
.contact-dialog .code-row {
  display: flex;
  gap: 8px;
}
.contact-dialog .code-row .el-input { flex: 1; }
.contact-dialog .send-btn {
  flex-shrink: 0;
  padding: 0 16px;
  background: #0052d9;
  color: #fff;
  border: 1px solid #0052d9;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.contact-dialog .send-btn:hover:not(:disabled) {
  background: #1890ff;
  border-color: #1890ff;
}
.contact-dialog .send-btn:disabled {
  background: #e5e7eb;
  border-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}
.contact-dialog .summary-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  background: #f0f7ff;
  border-left: 3px solid #0052d9;
}
.contact-dialog .summary-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #6b7280;
}
.contact-dialog .summary-value {
  font-size: 15px;
  color: #0052d9;
}
.contact-dialog .dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.contact-dialog .field-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #374151;
}
.contact-dialog .el-input__wrapper { border-radius: 0 !important; }
</style>
