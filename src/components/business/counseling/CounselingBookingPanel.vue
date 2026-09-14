<!-- 预约咨询面板 · 四步表单 + 预约摘要 + 我的预约 -->
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ChatLineRound, Tickets, List, ArrowRight, School, Search, Star } from '@element-plus/icons-vue'
import { consultationTypes, counselors, COUNSELING_STORAGE_KEY } from './data'
import type { BookingItem } from './types'

const emit = defineEmits<{
  (e: 'go-notice'): void
}>()

const { t } = useI18n()

const bookingFormRef = ref<HTMLElement | null>(null)
const secType = ref<HTMLElement | null>(null)
const secCounselor = ref<HTMLElement | null>(null)
const secTime = ref<HTMLElement | null>(null)
const secInfo = ref<HTMLElement | null>(null)

const errors = reactive<Record<string, boolean | string>>({
  type: false,
  counselorId: false,
  dateIdx: false,
  slot: false,
  name: '',
  contact: '',
  agree: ''
})

const booking = reactive({
  type: 'individual',
  topics: [] as string[],
  specFilter: '',
  counselorId: null as number | null,
  dateIdx: -1,
  slot: '',
  mode: 'online',
  name: '',
  contact: '',

  description: '',
  isFirst: true,
  agree: false
})

const counselorSearch = ref('')

function selectCounselor(id: number) {
  booking.counselorId = id
  errors.counselorId = false
}

const filteredCounselors = computed(() => {
  const type = booking.type
  const kw = counselorSearch.value.trim().toLowerCase()
  const spec = booking.specFilter
  return counselors.filter(c => {
    const typeOk = !type || c.types.includes(type)
    const specOk = !spec || c.specialties.includes(spec)
    const kwOk = !kw || c.name.toLowerCase().includes(kw) || c.specialties.join('').toLowerCase().includes(kw) || c.title.toLowerCase().includes(kw)
    return typeOk && specOk && kwOk
  })
})

watch(() => booking.type, (newType) => {
  if (booking.counselorId) {
    const c = counselors.find(x => x.id === booking.counselorId)
    if (c && !c.types.includes(newType)) {
      booking.counselorId = null
    }
  }
})

const weekdays = computed(() => [
  t('counseling.weekdays.sun'), t('counseling.weekdays.mon'), t('counseling.weekdays.tue'),
  t('counseling.weekdays.wed'), t('counseling.weekdays.thu'), t('counseling.weekdays.fri'),
  t('counseling.weekdays.sat')
])

const nextDays = computed(() => {
  const days = []
  const wdays = weekdays.value
  const now = new Date()
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
    days.push({
      weekday: wdays[d.getDay()],
      dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      full: `${d.getMonth() + 1}月${d.getDate()}日 ${wdays[d.getDay()]}`
    })
  }
  return days
})

const timeSlots = computed(() => [
  { label: '09:00', value: '09:00', period: t('counseling.timeSlots.morning'), disabled: false },
  { label: '10:00', value: '10:00', period: t('counseling.timeSlots.morning'), disabled: false },
  { label: '11:00', value: '11:00', period: t('counseling.timeSlots.morning'), disabled: true },
  { label: '14:00', value: '14:00', period: t('counseling.timeSlots.afternoon'), disabled: false },
  { label: '15:00', value: '15:00', period: t('counseling.timeSlots.afternoon'), disabled: false },
  { label: '16:00', value: '16:00', period: t('counseling.timeSlots.afternoon'), disabled: true },
  { label: '19:00', value: '19:00', period: t('counseling.timeSlots.evening'), disabled: false },
  { label: '20:00', value: '20:00', period: t('counseling.timeSlots.evening'), disabled: false }
])

function validateBooking() {
  let valid = true
  let firstErrorRef: HTMLElement | null = null

  if (!booking.type) { errors.type = true; valid = false; if (!firstErrorRef) firstErrorRef = secType.value }
  if (!booking.counselorId) { errors.counselorId = true; valid = false; if (!firstErrorRef) firstErrorRef = secCounselor.value }
  if (booking.dateIdx < 0) { errors.dateIdx = true; valid = false; if (!firstErrorRef) firstErrorRef = secTime.value }
  if (!booking.slot) { errors.slot = true; valid = false; if (!firstErrorRef) firstErrorRef = secTime.value }
  if (!booking.name) { errors.name = t('counseling.validation.nameRequired'); valid = false; if (!firstErrorRef) firstErrorRef = secInfo.value }
  if (!booking.contact) { errors.contact = t('counseling.validation.contactRequired'); valid = false; if (!firstErrorRef) firstErrorRef = secInfo.value }
  if (!booking.agree) { errors.agree = t('counseling.validation.agreeRequired'); valid = false; if (!firstErrorRef) firstErrorRef = secInfo.value }

  if (!valid && firstErrorRef) {
    firstErrorRef.scrollIntoView({ behavior: 'smooth', block: 'center' })
    ElMessage.warning(t('counseling.validation.formIncomplete'))
  }
  return valid
}

function getTypeName(key: string) {
  return consultationTypes.find(t => t.key === key)?.name || ''
}
function getCounselor(id: number | null) {
  return counselors.find(c => c.id === id) || { name: '' }
}

// 我的预约
const myBookings = ref<BookingItem[]>([])
const statusMap = computed<Record<string, string>>(() => ({
  pending: t('counseling.bookingStatus.pending'),
  confirmed: t('counseling.bookingStatus.confirmed'),
  completed: t('counseling.bookingStatus.completed'),
  cancelled: t('counseling.bookingStatus.cancelled')
}))

function submitBooking() {
  if (!validateBooking()) return
  const c = counselors.find(x => x.id === booking.counselorId)
  if (!c) return
  const newBooking = {
    counselorName: c.name,
    counselorId: c.id,
    date: nextDays.value[booking.dateIdx].full,
    slot: booking.slot,
    typeName: getTypeName(booking.type),
    type: booking.type,
    mode: booking.mode,
    topics: [...booking.topics],
    description: booking.description,
    isFirst: booking.isFirst,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  myBookings.value.unshift(newBooking)
  saveBookings()
  ElMessage.success(t('counseling.message.bookingSuccess'))
  // 重置
  booking.counselorId = null
  booking.dateIdx = -1
  booking.slot = ''
  booking.name = ''
  booking.contact = ''
  booking.description = ''
  booking.agree = false
  booking.topics = []
  // 重置错误
  Object.keys(errors).forEach(k => { errors[k] = (typeof errors[k] === 'string') ? '' : false })
  // 滚动到顶部
  secType.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function cancelBooking(idx: number) {
  ElMessageBox.confirm(t('counseling.message.cancelConfirm'), t('counseling.message.cancelTitle'), { type: 'warning' }).then(() => {
    myBookings.value[idx].status = 'cancelled'
    saveBookings()
    ElMessage.success(t('counseling.message.cancelled'))
  }).catch(() => {})
}

function saveBookings() {
  localStorage.setItem(COUNSELING_STORAGE_KEY, JSON.stringify(myBookings.value))
}
function loadBookings() {
  const saved = localStorage.getItem(COUNSELING_STORAGE_KEY)
  if (saved) myBookings.value = JSON.parse(saved)
}

// 跨面板预约：由列表/弹窗「预约」触发（页面切 tab 后调用）
function prefill(id: number) {
  booking.type = 'individual'
  booking.counselorId = id
}

onMounted(() => {
  loadBookings()
})

defineExpose({ prefill })
</script>

<template>
  <div class="booking-layout">
    <div class="booking-main">
      <el-form ref="bookingFormRef" :model="booking" label-position="top" class="booking-form">
        <!-- 01 咨询类型 -->
        <section ref="secType" class="step-block" :class="{ error: errors.type }">
          <div class="step-marker">
            <span class="step-num">01</span>
          </div>
          <div class="step-body">
            <h3 class="step-title">{{ $t('counseling.step.type') }}<em v-if="true">*</em></h3>
            <div class="type-options">
              <button
                v-for="ct in consultationTypes"
                :key="ct.key"
                type="button"
                class="type-opt"
                :class="{ active: booking.type === ct.key }"
                @click="booking.type = ct.key; errors.type = false"
              >
                <span class="to-name">{{ ct.name }}</span>
                <span class="to-dur">{{ ct.duration }}min</span>
              </button>
            </div>
          </div>
        </section>

        <!-- 02 心理老师 -->
        <section ref="secCounselor" class="step-block" :class="{ error: errors.counselorId }">
          <div class="step-marker">
            <span class="step-num">02</span>
          </div>
          <div class="step-body">
            <div class="step-title-row">
              <h3 class="step-title">{{ $t('counseling.step.counselor') }}<em>*</em></h3>
              <div class="counselor-search">
                <el-icon><Search /></el-icon>
                <input v-model="counselorSearch" :placeholder="$t('counseling.counselors.searchPlaceholder')" />
                <span v-if="filteredCounselors.length" class="cs-count">{{ filteredCounselors.length }} {{ $t('counseling.counselors.count') }}</span>
              </div>
            </div>

            <div v-if="booking.type" class="type-hint">
              {{ $t('counseling.counselors.filteredHint', { type: getTypeName(booking.type) }) }}
            </div>

            <div v-if="filteredCounselors.length" class="counselor-pick-list">
              <el-popover
                v-for="c in filteredCounselors"
                :key="c.id"
                placement="top"
                :width="280"
                trigger="hover"
                :show-after="200"
                popper-class="counselor-popover"
              >
                <template #reference>
                  <div
                    class="counselor-pick-card"
                    :class="{ active: booking.counselorId === c.id }"
                    @click="selectCounselor(c.id)"
                  >
                    <span class="cp-name">{{ c.name }}</span>
                    <span class="cp-meta">{{ c.title }}</span>
                    <span class="cp-rating">★ {{ c.rating }}</span>
                  </div>
                </template>
                <div class="pop-detail">
                  <div class="pop-head">
                    <div class="pop-avatar" :style="{ background: c.color }">{{ c.name[0] }}</div>
                    <div>
                      <div class="pop-name">{{ c.name }}</div>
                      <div class="pop-title">{{ c.title }}</div>
                    </div>
                  </div>
                  <div class="pop-stats">
                    <span><el-icon><Star /></el-icon> {{ c.rating }}</span>
                    <span><el-icon><School /></el-icon> {{ c.exp }}{{ $t('counseling.counselors.yearsSuffix') }}</span>
                    <span><el-icon><ChatLineRound /></el-icon> {{ c.sessions }}{{ $t('counseling.counselors.sessionsUnit') }}</span>
                  </div>
                  <p class="pop-intro">{{ c.intro }}</p>
                </div>
              </el-popover>
            </div>
            <div v-else class="counselor-empty">
              <span>{{ $t('counseling.empty.noCounselor') }}</span>
            </div>
          </div>
        </section>

        <!-- 03 咨询时间 -->
        <section ref="secTime" class="step-block" :class="{ error: errors.dateIdx || errors.slot }">
          <div class="step-marker">
            <span class="step-num">03</span>
          </div>
          <div class="step-body">
            <h3 class="step-title">{{ $t('counseling.step.time') }}<em>*</em></h3>
            <div class="date-row">
              <div
                v-for="(d, i) in nextDays"
                :key="i"
                class="date-opt"
                :class="{ active: booking.dateIdx === i }"
                @click="booking.dateIdx = i; errors.dateIdx = false"
              >
                <span class="do-week">{{ d.weekday }}</span>
                <span class="do-date">{{ d.dateStr }}</span>
              </div>
            </div>
            <div class="time-mode">
              <div class="slot-row">
                <button
                  v-for="slot in timeSlots"
                  :key="slot.value"
                  type="button"
                  class="slot-opt"
                  :class="{ active: booking.slot === slot.value, disabled: slot.disabled }"
                  :disabled="slot.disabled"
                  @click="!slot.disabled && (booking.slot = slot.value, errors.slot = false)"
                >{{ slot.label }}</button>
              </div>
              <div class="mode-row">
                <button
                  type="button"
                  class="mode-opt"
                  :class="{ active: booking.mode === 'online' }"
                  @click="booking.mode = 'online'"
                >{{ $t('counseling.btn.online') }}</button>
                <button
                  type="button"
                  class="mode-opt"
                  :class="{ active: booking.mode === 'offline' }"
                  @click="booking.mode = 'offline'"
                >{{ $t('counseling.btn.offline') }}</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 04 个人信息 -->
        <section ref="secInfo" class="step-block">
          <div class="step-marker">
            <span class="step-num">04</span>
          </div>
          <div class="step-body">
            <h3 class="step-title">{{ $t('counseling.step.info') }}<em>*</em></h3>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item :label="$t('counseling.form.name')" :required="true" :error="errors.name ? $t('counseling.validation.nameRequired') : ''">
                  <el-input v-model="booking.name" :placeholder="$t('counseling.form.namePlaceholder')" @input="errors.name = ''" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('counseling.form.contact')" :required="true" :error="errors.contact ? $t('counseling.validation.contactRequired') : ''">
                  <el-input v-model="booking.contact" :placeholder="$t('counseling.form.contactPlaceholder')" @input="errors.contact = ''" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <template #label>{{ $t('counseling.form.description') }} <span class="optional">{{ $t('counseling.form.optional') }}</span></template>
              <el-input v-model="booking.description" type="textarea" :rows="3" :placeholder="$t('counseling.form.descPlaceholder')" maxlength="500" show-word-limit />
            </el-form-item>
            <div class="form-inline">
              <span class="form-inline-label">{{ $t('counseling.form.experience') }}</span>
              <el-switch v-model="booking.isFirst" :active-text="$t('counseling.form.first')" :inactive-text="$t('counseling.form.followup')" />
            </div>
            <el-form-item :error="errors.agree ? $t('counseling.validation.agreeRequired') : ''">
              <el-checkbox v-model="booking.agree" @change="errors.agree = ''">{{ $t('counseling.form.agreePrefix') }} <a href="#" @click.prevent="emit('go-notice')">{{ $t('counseling.form.noticeLink') }}</a> {{ $t('counseling.form.and') }} <a href="#">{{ $t('counseling.form.consentLink') }}</a></el-checkbox>
            </el-form-item>
          </div>
        </section>

        <div class="form-footer">
          <span class="form-hint">{{ $t('counseling.form.required').split('*')[0] }}<em>*</em>{{ $t('counseling.form.required').split('*')[1] }}</span>
          <el-button type="primary" size="large" @click="submitBooking">{{ $t('counseling.btn.confirmBooking') }}<el-icon class="el-icon--right"><ArrowRight /></el-icon></el-button>
        </div>
      </el-form>
    </div>

    <!-- 右侧：预约摘要 + 我的预约 -->
    <aside class="booking-aside">
      <div class="summary-card" :style="{ '--unset-text': $t('counseling.summary.empty') }">
        <h4><el-icon><Tickets /></el-icon> {{ $t('counseling.summary.title') }}</h4>
        <div class="summary-row"><span>{{ $t('counseling.summary.type') }}</span><b :class="{ unset: !booking.type }">{{ getTypeName(booking.type) }}</b></div>
        <div class="summary-row"><span>{{ $t('counseling.summary.counselor') }}</span><b :class="{ unset: !booking.counselorId }">{{ booking.counselorId ? getCounselor(booking.counselorId).name : '' }}</b></div>
        <div class="summary-row"><span>{{ $t('counseling.summary.date') }}</span><b :class="{ unset: booking.dateIdx < 0 }">{{ booking.dateIdx >= 0 ? nextDays[booking.dateIdx].full : '' }}</b></div>
        <div class="summary-row"><span>{{ $t('counseling.summary.time') }}</span><b :class="{ unset: !booking.slot }">{{ booking.slot || '' }}</b></div>
        <div class="summary-row"><span>{{ $t('counseling.summary.mode') }}</span><b>{{ booking.mode === 'online' ? $t('counseling.summary.onlineValue') : $t('counseling.summary.offlineValue') }}</b></div>
        <div class="summary-divider"></div>
        <div class="summary-row total"><span>{{ $t('counseling.summary.serviceType') }}</span><b class="free-tag">{{ $t('counseling.summary.freeTag') }}</b></div>
      </div>

      <div class="my-bookings">
        <div class="mb-header">
          <h4><el-icon><List /></el-icon> {{ $t('counseling.myBookings') }}</h4>
          <span class="mb-count">{{ myBookings.length }}</span>
        </div>
        <div v-if="myBookings.length > 0" class="mb-list">
          <div v-for="(b, i) in myBookings" :key="i" class="mb-item" :class="'status-' + b.status">
            <div class="mb-top">
              <span class="mb-counselor">{{ b.counselorName }}</span>
              <span class="mb-status" :class="'s-' + b.status">{{ statusMap[b.status] }}</span>
            </div>
            <div class="mb-info">{{ b.date }} {{ b.slot }} · {{ b.typeName }}</div>
            <div v-if="b.status === 'pending'" class="mb-actions">
              <el-button size="small" plain @click="cancelBooking(i)">{{ $t('counseling.booking.cancelBtn') }}</el-button>
            </div>
          </div>
        </div>
        <div v-else class="mb-empty">{{ $t('counseling.booking.empty') }}</div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* ============ 预约布局 · 大留白 ============ */
.booking-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 64px;
  align-items: flex-start;
}

.booking-main { min-width: 0; }

.booking-aside {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 步骤区块 · 大号编号 + 卡片式分隔 */
.step-block {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 36px;
  padding: 36px 28px;
  border-bottom: 1px solid #eef2f6;
  border-radius: 16px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.step-block::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 0;
  background: var(--brand-primary);
  border-radius: 0 3px 3px 0;
  transform: translateY(-50%);
  transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-block:first-child { padding-top: 28px; }
.step-block:last-of-type { border-bottom: none; padding-bottom: 28px; }
.step-block:hover {
  background: #f8fbff;
  box-shadow: 0 8px 24px rgba(0, 82, 217, 0.06);
}
.step-block:hover::before { height: 60%; }
.step-block.error { background: rgba(239, 68, 68, 0.03); }
.step-block.error::before { background: #ef4444; height: 60%; }

.step-marker { position: relative; }
.step-num {
  font-size: 68px;
  font-weight: 300;
  color: var(--brand-primary);
  letter-spacing: -3px;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
  display: block;
  opacity: 0.85;
}
.step-block.error .step-num { color: #ef4444; opacity: 1; }

.step-body { min-width: 0; }

.step-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px;
  letter-spacing: -0.4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.step-block.error .step-title { color: #ef4444; }
.step-title em {
  font-style: normal;
  color: #ef4444;
  font-size: 16px;
  margin-left: 4px;
}

.step-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.step-title-row .step-title { margin: 0; }

.optional {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  margin-left: 8px;
  letter-spacing: 0.3px;
  padding: 2px 8px;
  background: #f3f4f6;
  border-radius: 6px;
}

/* 咨询类型 · 卡片化大号文字 */
.type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.type-opt {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px 20px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.type-opt:hover {
  border-color: var(--brand-primary);
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.08);
}
.type-opt:hover .to-name { color: var(--brand-primary); }
.type-opt.active {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.2);
}
.type-opt.active .to-name { color: #ffffff; font-weight: 700; }
.type-opt.active .to-dur { color: rgba(255, 255, 255, 0.85); }

.to-name { font-size: 16px; color: #1f2937; font-weight: 600; transition: all 0.2s; letter-spacing: -0.2px; }
.to-dur { font-size: 11px; color: #9ca3af; font-variant-numeric: tabular-nums; letter-spacing: 0.3px; }

/* 心理老师 · 搜索框 */
.counselor-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: #ffffff;
  transition: all 0.25s ease;
  width: 280px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.03);
}
.counselor-search:focus-within {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1);
}
.counselor-search .el-icon { color: #9ca3af; font-size: 14px; }
.counselor-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #1f2937;
  font-family: inherit;
}
.counselor-search input::placeholder { color: #9ca3af; }
.cs-count {
  font-size: 11px;
  color: var(--brand-primary);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  background: #f0f7ff;
  padding: 2px 8px;
  border-radius: 8px;
}

.type-hint {
  font-size: 12px;
  color: var(--brand-primary);
  margin-bottom: 16px;
  padding: 8px 14px;
  background: #f0f7ff;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.2px;
  border: 1px solid rgba(0, 82, 217, 0.1);
}
.type-hint::before {
  content: '◆';
  font-size: 8px;
  color: var(--brand-primary);
}

.counselor-empty {
  padding: 32px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #e2e8f0;
}

/* 心理老师 · 列表（卡片化） */
.counselor-pick-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.counselor-pick-card {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  border: 1px solid #eef2f6;
  border-radius: 12px;
  background: #ffffff;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.counselor-pick-card:hover {
  border-color: var(--brand-primary);
  background: #f0f7ff;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.06);
}
.counselor-pick-card.active {
  border-color: var(--brand-primary);
  background: #f0f7ff;
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.1);
}
.counselor-pick-card.active .cp-name { color: var(--brand-primary); font-weight: 700; }
.counselor-pick-card.active .cp-rating {
  color: var(--brand-primary);
  position: relative;
  padding-right: 28px;
}
.counselor-pick-card.active .cp-rating::after {
  content: '✓';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 700;
  color: var(--brand-primary);
}

.cp-name { font-size: 15px; font-weight: 600; color: #1f2937; transition: color 0.2s; letter-spacing: -0.2px; }
.cp-meta { font-size: 12px; color: #9ca3af; letter-spacing: 0.2px; }
.cp-rating { font-size: 13px; color: #f59e0b; font-weight: 600; font-variant-numeric: tabular-nums; }

/* 日期 · 卡片化横向 */
.date-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 24px;
  padding: 4px 0 8px;
}
.date-opt {
  flex-shrink: 0;
  min-width: 76px;
  padding: 12px 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
}
.date-opt:hover {
  border-color: var(--brand-primary);
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.08);
}
.date-opt:hover .do-date { color: var(--brand-primary); }
.date-opt.active {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.2);
}
.date-opt.active .do-week { color: rgba(255, 255, 255, 0.85); }
.date-opt.active .do-date { color: #ffffff; font-weight: 700; }

.do-week { display: block; font-size: 11px; color: #9ca3af; margin-bottom: 4px; letter-spacing: 0.5px; }
.do-date { display: block; font-size: 17px; font-weight: 600; color: #1f2937; font-variant-numeric: tabular-nums; transition: all 0.2s; letter-spacing: -0.3px; }

/* 时段 + 方式 */
.time-mode { display: flex; flex-direction: column; gap: 20px; }

.slot-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.slot-opt {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.3px;
}
.slot-opt:hover:not(.disabled) {
  color: var(--brand-primary);
  border-color: var(--brand-primary);
  background: #f0f7ff;
}
.slot-opt.active {
  color: #ffffff;
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 82, 217, 0.2);
}
.slot-opt.disabled {
  color: #d1d5db;
  cursor: not-allowed;
  text-decoration: line-through;
  background: #f9fafb;
}

.mode-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.mode-opt {
  padding: 8px 18px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-family: inherit;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 20px;
  letter-spacing: 0.2px;
  font-weight: 500;
}
.mode-opt:hover { color: var(--brand-primary); border-color: var(--brand-primary); background: #f0f7ff; }
.mode-opt.active {
  color: #ffffff;
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 82, 217, 0.2);
}

/* 内联表单项 */
.form-inline {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #eef2f6;
}
.form-inline-label {
  font-size: 13px;
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.2px;
}

/* 表单 · 现代化输入 */
.booking-form :deep(.el-form-item) {
  margin-bottom: 22px;
}
.booking-form :deep(.el-form-item__label) {
  font-size: 13px;
  color: #1f2937;
  font-weight: 600;
  padding-bottom: 8px;
  line-height: 1.4;
  letter-spacing: 0.2px;
}
.booking-form :deep(.el-form-item__error) {
  font-size: 12px;
  padding-top: 4px;
  color: #ef4444;
}
.booking-form :deep(.el-input__wrapper) {
  border-radius: 10px;
  background: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  padding: 8px 14px;
  transition: all 0.25s ease;
}
.booking-form :deep(.el-input__wrapper:hover) {
  border-color: var(--brand-primary);
  background: #ffffff;
}
.booking-form :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: var(--brand-primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1) !important;
}
.booking-form :deep(.el-input__inner) {
  font-size: 14px;
  color: #1f2937;
  font-weight: 400;
}
.booking-form :deep(.el-textarea__inner) {
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  box-shadow: none;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.7;
  transition: all 0.25s ease;
  color: #1f2937;
}
.booking-form :deep(.el-textarea__inner:hover) {
  border-color: var(--brand-primary);
  background: #ffffff;
}
.booking-form :deep(.el-textarea__inner:focus) {
  border-color: var(--brand-primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1);
}
.booking-form :deep(.el-textarea__inner::placeholder) { color: #9ca3af; }
.booking-form a {
  color: var(--brand-primary);
  text-decoration: none;
  font-weight: 500;
}
.booking-form a:hover { text-decoration: underline; text-underline-offset: 3px; }
.booking-form :deep(.el-radio-button__inner) {
  border-color: #e2e8f0;
  border-radius: 10px !important;
  background: #f8fafc;
  color: #4b5563;
}
.booking-form :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--brand-primary); border-color: var(--brand-primary); box-shadow: none; color: #fff;
}
.booking-form :deep(.el-checkbox__label) { font-size: 13px; color: #4b5563; }
.booking-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  border-radius: 4px;
}
.booking-form :deep(.el-checkbox__inner) { border-radius: 4px; }
.booking-form :deep(.el-switch.is-checked .el-switch__core) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

/* 表单底部 */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid #e2e8f0;
}

:deep(.form-footer .el-button) { border-radius: 10px; font-weight: 600; }
:deep(.form-footer .el-button--primary) {
  background: linear-gradient(135deg, #0052d9 0%, #1890ff 100%);
  border-color: transparent;
  min-width: 200px;
  height: 52px;
  font-size: 15px;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.25);
}
:deep(.form-footer .el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 82, 217, 0.35);
  letter-spacing: 1.5px;
}

.form-hint {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.2px;
}
.form-hint em {
  color: #ef4444;
  font-style: normal;
  font-weight: 700;
}

/* 预约摘要 · 卡片化 */
.summary-card {
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  border: 1px solid #d0e7ff;
  border-radius: 16px;
  padding: 24px 24px;
  box-shadow: 0 4px 20px rgba(0, 82, 217, 0.06);
}

.summary-card h4 {
  font-size: 12px;
  color: var(--brand-primary);
  margin: 0 0 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 700;
}
.summary-card h4 .el-icon { color: var(--brand-primary); font-size: 14px; }

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 13px;
  align-items: center;
  border-bottom: 1px dashed #e2e8f0;
}
.summary-row:last-of-type { border-bottom: none; }
.summary-row span { color: #6b7280; font-size: 12px; }
.summary-row b { color: #1f2937; font-weight: 600; font-size: 13px; }
.summary-row b:empty::before,
.summary-row b.unset {
  content: var(--unset-text, '未选择');
  color: #cbd5e1;
  font-weight: 400;
  font-size: 12px;
  font-style: italic;
}
.summary-divider { height: 1px; background: linear-gradient(90deg, transparent, #d0e7ff, transparent); margin: 12px 0; }
.summary-row.total {
  padding-top: 14px;
  margin-top: 8px;
  border-top: 1px solid #d0e7ff;
  border-bottom: none;
}
.summary-row.total b { font-size: 13px; color: #111827; font-weight: 600; }
.summary-row.total b.free-tag {
  color: var(--brand-primary);
  background: rgba(0, 82, 217, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.5px;
}
.summary-row.total b.free-tag::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-primary);
}

.my-bookings {
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
}

.mb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.mb-header h4 {
  font-size: 12px;
  color: var(--brand-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 700;
}
.mb-header h4 .el-icon { color: var(--brand-primary); font-size: 14px; }
.mb-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-primary);
  background: #f0f7ff;
  padding: 2px 10px;
  border-radius: 10px;
  font-variant-numeric: tabular-nums;
}

.mb-list { display: flex; flex-direction: column; gap: 0; }
.mb-item {
  padding: 14px 0;
  background: transparent;
  border-radius: 0;
  border-left: none;
  border-bottom: 1px solid #f1f5f9;
}
.mb-item:last-child { border-bottom: none; }
.mb-item.status-completed { opacity: 0.6; }
.mb-item.status-cancelled { opacity: 0.5; }

.mb-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.mb-counselor { font-size: 14px; font-weight: 700; color: #1f2937; letter-spacing: -0.2px; }
.mb-status {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
  letter-spacing: 0.3px;
}
.mb-status.s-pending { color: #b45309; background: rgba(180, 83, 9, 0.1); }
.mb-status.s-confirmed { color: var(--brand-primary); background: rgba(0, 82, 217, 0.1); }
.mb-status.s-completed { color: #6b7280; background: #f3f4f6; }
.mb-status.s-cancelled { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.mb-info { font-size: 12px; color: #9ca3af; letter-spacing: 0.2px; }
.mb-actions { margin-top: 10px; }
.mb-empty { font-size: 13px; color: #9ca3af; text-align: center; padding: 24px 0; letter-spacing: 0.3px; }

@media (max-width: 1200px) {
  .booking-layout { grid-template-columns: 1fr 280px; gap: 48px; }
  .step-block { padding: 32px 24px; }
}

@media (max-width: 900px) {
  .booking-layout { grid-template-columns: 1fr; gap: 40px; }
  .booking-aside { position: relative; top: 0; flex-direction: row; flex-wrap: wrap; gap: 20px; }
  .summary-card, .my-bookings { flex: 1 1 280px; }
  .step-block { grid-template-columns: 64px 1fr; gap: 24px; padding: 28px 20px; }
  .step-num { font-size: 52px; }
  .step-title { font-size: 20px; }
}

@media (max-width: 768px) {
  .booking-aside { flex-direction: column; }
  .step-block { grid-template-columns: 1fr; gap: 12px; padding: 24px 18px; }
  .step-num { font-size: 40px; }
  .step-title { font-size: 18px; margin-bottom: 18px; }
  .form-footer { flex-direction: column-reverse; gap: 16px; align-items: stretch; }
  :deep(.form-footer .el-button--primary) { width: 100%; min-width: 0; }
  .type-options { gap: 8px; }
  .type-opt { padding: 10px 14px; }
  .to-name { font-size: 14px; }
}

/* ============ 暗夜模式适配 ============ */
html.dark .counselor-search,
html.dark .summary-card,
html.dark .my-bookings,
html.dark .counselor-pick-card {
  background: #1e293b !important;
  border-color: #334155 !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
}

html.dark .type-hint,
html.dark .cs-count {
  background: rgba(0, 82, 217, 0.15) !important;
  border-color: rgba(0, 82, 217, 0.25) !important;
}
</style>

<style>
/* el-popover 挂载于 body，需全局样式 */
.counselor-popover.el-popover.el-popper {
  padding: 18px 20px !important;
  border-radius: 14px !important;
  border: 1px solid #eef2f6 !important;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1) !important;
  background: #ffffff !important;
}
.pop-detail { font-size: 13px; }
.pop-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}
.pop-avatar {
  width: 44px; height: 44px; border-radius: 12px;
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
}
.pop-name { font-size: 16px; font-weight: 700; color: #1f2937; letter-spacing: -0.2px; }
.pop-title { font-size: 12px; color: #9ca3af; margin-top: 4px; letter-spacing: 0.2px; }
.pop-stats { display: flex; gap: 14px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
.pop-stats span { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; font-variant-numeric: tabular-nums; }
.pop-stats .el-icon { color: #0052d9; font-size: 13px; }
.pop-intro { font-size: 13px; color: #4b5563; line-height: 1.75; margin: 0; }
</style>
