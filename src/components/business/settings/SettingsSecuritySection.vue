<!-- 01 · 账号安全：密码修改 / 绑定联系方式 / 登录设备 + 三步换绑弹窗 -->
<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Lock, Iphone, Message } from '@element-plus/icons-vue'

const { t } = useI18n()

/* ===== 密码 ===== */
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

/* ===== 联系方式 ===== */
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

onBeforeUnmount(() => {
  stopCountdown()
})

/* ===== 登录设备 ===== */
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
</script>

<template>
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

    <!-- 三步换绑弹窗（teleport 到 body，样式走下方非 scoped 块） -->
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
      <!-- 步骤指示 -->
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

      <!-- Step 1 · 身份验证 -->
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

      <!-- Step 2 · 新联系方式 -->
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

      <!-- Step 3 · 验证新联系方式 -->
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

/* ============ 栏目标题 ============ */
.col-title {
  margin: 0 0 18px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink-900);
}
.col-title-spaced { margin-top: 36px; }

/* ============ 字段 ============ */
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
  color: var(--ink-700);
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
  color: var(--ink-700);
}

.field-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

/* ============ Editorial 按钮 ============ */
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

.editorial-btn-ghost {
  background: transparent;
  color: var(--ink-900);
}

.editorial-btn-ghost:hover {
  background: var(--ink-900);
  color: white;
  border-color: var(--ink-900);
}

/* ============ 联系方式列表 ============ */
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
  border-bottom: 1px solid var(--ink-200);
}
.entry-row:last-child { border-bottom: none; }

.entry-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 18px;
  color: var(--brand-primary);
  border: 1px solid var(--ink-200);
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
  color: var(--ink-500);
}

.entry-value {
  font-size: 15px;
  color: var(--ink-900);
  letter-spacing: 0.5px;
}

/* ============ Link 按钮 ============ */
.link-btn {
  background: none;
  border: none;
  padding: 4px 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--brand-primary);
  cursor: pointer;
  border-bottom: 1px solid var(--brand-primary);
  transition: all 0.2s;
}

.link-btn:hover {
  color: var(--color-info);
  border-bottom-color: var(--color-info);
}

.link-btn-danger {
  color: var(--danger-600);
  border-bottom-color: var(--danger-600);
}

.link-btn-danger:hover {
  color: var(--danger-700);
  border-bottom-color: var(--danger-700);
}

/* ============ 登录设备 ============ */
.device-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.device-row {
  padding: 18px 0;
  border-bottom: 1px solid var(--ink-200);
}
.device-row:last-child { border-bottom: none; }

.device-row.current {
  padding-left: 16px;
  border-left: 3px solid var(--brand-primary);
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
  color: var(--ink-900);
}

.device-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--brand-primary);
  border: 1px solid var(--brand-primary);
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
  color: var(--ink-400);
  margin-bottom: 2px;
}

.meta-item dd {
  margin: 0;
  font-size: 13px;
  color: var(--ink-700);
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

<!-- 弹窗 teleport 到 body，需要非 scoped 样式 -->
<style>
.contact-dialog {
  border-radius: 0 !important;
  border: 1px solid var(--ink-900);
}

.contact-dialog .el-dialog__header {
  margin: 0;
  padding: 20px 24px;
  border-bottom: 1px solid var(--ink-200);
}

.contact-dialog .el-dialog__title {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 700;
  color: var(--ink-900);
}
.contact-dialog .el-dialog__body { padding: 24px; }

.contact-dialog .el-dialog__footer {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--ink-200);
}

.contact-dialog .dialog-steps {
  display: flex;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--ink-200);
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
  background: var(--ink-200);
  z-index: 0;
}
.contact-dialog .ds-item.active:not(:last-child)::after { background: var(--brand-primary); }

.contact-dialog .ds-num {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ink-200);
  background: white;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-400);
  position: relative;
  z-index: 1;
}

.contact-dialog .ds-item.active .ds-num {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.contact-dialog .ds-item.current .ds-num {
  background: var(--brand-primary);
  color: white;
}

.contact-dialog .ds-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--ink-400);
  text-align: center;
}
.contact-dialog .ds-item.active .ds-label { color: var(--ink-900); }
.contact-dialog .ds-item.current .ds-label { color: var(--brand-primary); }
.contact-dialog .dialog-body { min-height: 140px; }

.contact-dialog .code-row {
  display: flex;
  gap: 8px;
}
.contact-dialog .code-row .el-input { flex: 1; }

.contact-dialog .send-btn {
  flex-shrink: 0;
  padding: 0 16px;
  background: var(--brand-primary);
  color: white;
  border: 1px solid var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.contact-dialog .send-btn:hover:not(:disabled) {
  background: var(--color-info);
  border-color: var(--color-info);
}

.contact-dialog .send-btn:disabled {
  background: var(--ink-200);
  border-color: var(--ink-200);
  color: var(--ink-400);
  cursor: not-allowed;
}

.contact-dialog .summary-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  background: var(--brand-primary-faint);
  border-left: 3px solid var(--brand-primary);
}

.contact-dialog .summary-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink-500);
}

.contact-dialog .summary-value {
  font-size: 15px;
  color: var(--brand-primary);
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
  color: var(--ink-700);
}
.contact-dialog .el-input__wrapper { border-radius: 0 !important; }
</style>
