<template>
  <div class="capsule-list-page" @click="closeAll">
    <!-- 装饰性背景水印 -->
    <span class="watermark" aria-hidden="true">CAPSULE</span>

    <!-- 顶部编辑式标题区 · 非对称 -->
    <header class="page-header">
      <div class="header-left">
        <div v-reveal class="header-eyebrow">
          <span class="eyebrow-line"></span>
          <span class="eyebrow-text">{{ $t('capsule.list.eyebrow') }}</span>
        </div>
        <h1 v-reveal="60" class="header-title" v-html="$t('capsule.list.title')"></h1>
        <p v-reveal="120" class="header-desc">
          {{ $t('capsule.list.desc') }}
        </p>
      </div>
      <div v-reveal="80" class="header-right">
        <!-- 邮戳印章 -->
        <div class="postmark">
          <div class="pm-date">{{ postmarkDate }}</div>
          <div class="pm-bar"></div>
          <div class="pm-text">CAPSULE<br>OFFICE</div>
        </div>
      </div>
    </header>

    <!-- 统计数据栏 · 横向编辑式 -->
    <div v-reveal="140" class="stats-bar">
      <div class="stat-block">
        <span class="stat-value">{{ String(totalCount).padStart(2, '0') }}</span>
        <span class="stat-label">{{ $t('capsule.list.stats.total') }}</span>
      </div>
      <span class="stat-divider"></span>
      <div class="stat-block">
        <span class="stat-value stat-pending">{{ String(pendingCount).padStart(2, '0') }}</span>
        <span class="stat-label">{{ $t('capsule.list.stats.pending') }}</span>
      </div>
      <span class="stat-divider"></span>
      <div class="stat-block">
        <span class="stat-value stat-opened">{{ String(openedCount).padStart(2, '0') }}</span>
        <span class="stat-label">{{ $t('capsule.list.stats.opened') }}</span>
      </div>
      <span class="stat-divider"></span>
      <div class="stat-block">
        <span class="stat-value stat-auditing">{{ String(auditingCount).padStart(2, '0') }}</span>
        <span class="stat-label">{{ $t('capsule.list.stats.auditing') }}</span>
      </div>
    </div>

    <!-- 筛选导航 · 下划线式 -->
    <nav v-reveal="160" class="filter-nav">
      <div
        v-for="tab in filterTabs"
        :key="tab.type"
        :class="['nav-item', { active: filterType === tab.type }]"
        @click.stop="filterType = tab.type"
      >
        <span class="nav-label">{{ tab.label }}</span>
        <span class="nav-count">({{ getTabCount(tab.type) }})</span>
      </div>
    </nav>

    <!-- 胶囊档案列表 -->
    <main v-if="filteredCapsules.length > 0" class="capsule-archive">
      <TransitionGroup name="capsule-anim" tag="div" class="archive-list">
      <div
        v-for="(item, idx) in filteredCapsules"
        :key="item.id"
        v-reveal="idx * 50"
        class="archive-entry"
      >
        <!-- 大号背景编号 -->
        <span class="entry-bg-num" aria-hidden="true">{{ String(idx + 1).padStart(2, '0') }}</span>

        <!-- 可滑动内容 -->
        <div
          class="swipe-track"
          :class="{ 'no-transition': drag.id === item.id && drag.dragging }"
          :style="{ transform: `translateX(${getOffset(item.id)}px)` }"
        >
          <!-- 信封式卡片 -->
          <div
            class="envelope"
            :class="'env-' + statusKey(item)"
            @click.stop="onCardClick(item)"
            @pointerdown="onPointerDown($event, item)"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <!-- 信封顶部虚线 -->
            <div class="env-flap"></div>

            <!-- 左侧：编号 + 心情 -->
            <div class="env-left">
              <span class="env-serial">{{ String(idx + 1).padStart(2, '0') }}</span>
              <span class="env-emoji">{{ item.emotionEmoji }}</span>
            </div>

            <!-- 中间：标题 + 元信息 -->
            <div class="env-center">
              <h3 class="env-title">{{ item.title }}</h3>
              <div class="env-meta">
                <span class="meta-date">{{ item.openDate }}</span>
                <span class="meta-dot">·</span>
                <span v-if="item.openMethod" class="meta-method">{{ methodLabel(item.openMethod) }}</span>
                <template v-if="item.status === 'pending' && item.remainingDays > 0">
                  <span class="meta-dot">·</span>
                  <span class="meta-countdown">{{ $t('capsule.list.countdown', { days: item.remainingDays }) }}</span>
                </template>
              </div>
            </div>

            <!-- 右侧：状态标签 -->
            <div class="env-right">
              <span class="status-tag" :class="'tag-' + statusKey(item)">
                {{ statusLabel(item) }}
              </span>
            </div>
          </div>
        </div>

        <!-- 滑出删除面板 -->
        <div class="delete-panel" @click.stop="deleteCapsule(item.id)">
          <el-icon class="delete-icon"><Delete /></el-icon>
          <span class="delete-text">{{ $t('capsule.list.delete') }}</span>
        </div>
      </div>
      </TransitionGroup>

      <!-- 档案结尾标记 -->
      <div class="archive-end">
        <span class="end-line"></span>
        <span class="end-text">ARCHIVE END</span>
        <span class="end-line"></span>
      </div>
    </main>

    <!-- 空状态 -->
    <div v-else class="empty-archive">
      <div class="empty-stamp">
        <span class="stamp-text">EMPTY</span>
      </div>
      <h2 class="empty-title" v-html="$t('capsule.list.empty.title')"></h2>
      <p class="empty-hint">{{ $t('capsule.list.empty.hint') }}</p>
      <button class="empty-btn" @click="createCapsule">
        <span>{{ $t('capsule.list.empty.btn') }}</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>

    <!-- 右下角新建按钮 -->
    <button class="fab-button" @click.stop="createCapsule">
      <span class="fab-plus">+</span>
      <span class="fab-label">{{ $t('capsule.list.fab') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

interface CapsuleItem {
  id: number
  title: string
  openDate: string
  status: string
  sendStatus: string
  auditStatus: number
  remainingDays: number
  emotionEmoji: string
  openMethod: string
}

const router = useRouter()
const { t } = useI18n()

const now = new Date()
const currentYear = now.getFullYear()
const postmarkDate = `${currentYear}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`

const filterType = ref('all')

// 左滑删除相关状态
const DELETE_WIDTH = 92
const REVEAL_THRESHOLD = 40
const offsets = reactive<Record<number, number>>({})
const drag = reactive<{ id: number | null; startX: number; startY: number; startOffset: number; dragging: boolean; moved: boolean }>({
  id: null, startX: 0, startY: 0, startOffset: 0, dragging: false, moved: false
})
const wasDragged = ref(false)

const filterTabs = computed(() => [
  { type: 'all', label: t('capsule.list.filter.all') },
  { type: 'pending', label: t('capsule.list.filter.pending') },
  { type: 'opened', label: t('capsule.list.filter.opened') }
])

// 模拟数据
const capsules = ref<CapsuleItem[]>([
  {
    id: 1,
    title: '写给一年后的自己：保持热爱',
    openDate: '2027-06-20',
    status: 'pending',
    sendStatus: 'success',
    auditStatus: 1,
    remainingDays: 327,
    emotionEmoji: '🌟',
    openMethod: 'email'
  },
  {
    id: 2,
    title: '毕业季的告白',
    openDate: '2026-06-18',
    status: 'opened',
    sendStatus: 'success',
    auditStatus: 1,
    remainingDays: 0,
    emotionEmoji: '🤩',
    openMethod: 'email'
  },
  {
    id: 3,
    title: '关于成长的一些思考',
    openDate: '2027-01-01',
    status: 'pending',
    sendStatus: 'success',
    auditStatus: 1,
    remainingDays: 200,
    emotionEmoji: '😌',
    openMethod: 'letter'
  },
  {
    id: 4,
    title: '致迷茫的自己',
    openDate: '2026-06-10',
    status: 'opened',
    sendStatus: 'failed',
    auditStatus: 1,
    remainingDays: 0,
    emotionEmoji: '😢',
    openMethod: 'email'
  },
  {
    id: 5,
    title: '审核中的那封信',
    openDate: '2027-03-15',
    status: 'pending',
    sendStatus: 'success',
    auditStatus: 0,
    remainingDays: 260,
    emotionEmoji: '😊',
    openMethod: 'letter'
  }
])

const totalCount = computed(() => capsules.value.length)
const pendingCount = computed(() => capsules.value.filter(c => c.status === 'pending' && c.auditStatus === 1).length)
const openedCount = computed(() => capsules.value.filter(c => c.status === 'opened').length)
const auditingCount = computed(() => capsules.value.filter(c => c.auditStatus === 0).length)

const filteredCapsules = computed(() => {
  if (filterType.value === 'all') return capsules.value
  if (filterType.value === 'pending') {
    return capsules.value.filter(c => c.status === 'pending')
  }
  return capsules.value.filter(c => c.status === 'opened')
})

const getTabCount = (type: string) => {
  if (type === 'all') return capsules.value.length
  if (type === 'pending') return capsules.value.filter(c => c.status === 'pending').length
  return capsules.value.filter(c => c.status === 'opened').length
}

const statusKey = (item: CapsuleItem): string => {
  if (item.auditStatus === 0) return 'auditing'
  if (item.auditStatus === 2) return 'rejected'
  if (item.status === 'pending') return 'pending'
  if (item.sendStatus === 'failed') return 'failed'
  return 'opened'
}

const statusLabel = (item: CapsuleItem): string => {
  if (item.auditStatus === 0) return t('capsule.list.status.auditing')
  if (item.auditStatus === 2) return t('capsule.list.status.rejected')
  if (item.status === 'pending') return t('capsule.list.status.pending')
  if (item.sendStatus === 'failed') return t('capsule.list.status.failed')
  return t('capsule.list.status.opened')
}

const methodLabel = (m: string) => (m === 'letter' ? t('capsule.list.method.letter') : t('capsule.list.method.email'))

// --- 左滑删除手势 ---
const getOffset = (id: number) => offsets[id] || 0

const closeAll = () => {
  Object.keys(offsets).forEach((k) => {
    const id = Number(k)
    if (offsets[id] !== 0) offsets[id] = 0
  })
}

const onCardClick = (item: CapsuleItem) => {
  if (wasDragged.value) {
    wasDragged.value = false
    return
  }
  if (getOffset(item.id) !== 0) {
    offsets[item.id] = 0
    return
  }
  viewCapsule(item.id)
}

const onPointerDown = (e: PointerEvent, item: CapsuleItem) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  if ((e.target as HTMLElement).closest('.delete-panel')) return
  wasDragged.value = false
  drag.id = item.id
  drag.startX = e.clientX
  drag.startY = e.clientY
  drag.startOffset = offsets[item.id] || 0
  drag.dragging = false
  drag.moved = false
  try {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  } catch {}
}

const onPointerMove = (e: PointerEvent) => {
  if (drag.id === null) return
  const dx = e.clientX - drag.startX
  const dy = e.clientY - drag.startY
  if (!drag.dragging) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
    if (Math.abs(dy) > Math.abs(dx)) {
      drag.id = null
      return
    }
    drag.dragging = true
    drag.moved = true
  }
  let next = drag.startOffset + dx
  if (next > 0) next = next * 0.3
  if (next < -DELETE_WIDTH) next = -DELETE_WIDTH + (next + DELETE_WIDTH) * 0.3
  offsets[drag.id] = next
}

const onPointerUp = () => {
  if (drag.id === null) return
  const id = drag.id
  const offset = offsets[id] || 0
  const moved = drag.moved
  Object.keys(offsets).forEach((k) => {
    const key = Number(k)
    if (key !== id && offsets[key] !== 0) offsets[key] = 0
  })
  if (offset < -REVEAL_THRESHOLD) {
    offsets[id] = -DELETE_WIDTH
  } else {
    offsets[id] = 0
  }
  drag.id = null
  drag.dragging = false
  if (moved) wasDragged.value = true
}

const viewCapsule = (id: number) => {
  router.push(`/time-capsule/${id}`)
}

const createCapsule = () => {
  router.push('/time-capsule/create')
}

const deleteCapsule = (id: number) => {
  ElMessageBox.confirm(t('capsule.list.deleteConfirm'), t('capsule.list.deleteTitle'), {
    confirmButtonText: t('capsule.list.deleteOk'),
    cancelButtonText: t('capsule.list.deleteCancelled'),
    type: 'warning',
    confirmButtonClass: 'el-button--danger'
  }).then(() => {
    const idx = capsules.value.findIndex(c => c.id === id)
    if (idx > -1) capsules.value.splice(idx, 1)
    offsets[id] = 0
    ElMessage.success(t('capsule.list.deleteSuccess'))
  }).catch(() => {
    offsets[id] = 0
  })
}
</script>

<style scoped>
/* ============================================================
   时光邮局 · 我的胶囊列表页
   设计语言：黑白编辑式 + 邮戳信封 + 档案编号
   ============================================================ */

.capsule-list-page {
  min-height: 100vh;
  background: #f8fbff;
  background-image:
    radial-gradient(circle at 20% 10%, rgba(0,82,217,0.015) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0,82,217,0.012) 0%, transparent 50%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'PingFang SC', sans-serif;
  color: #111827;
  padding-bottom: 140px;
  position: relative;
  overflow-x: hidden;
}

/* 背景水印 */
.watermark {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(200px, 32vw, 420px);
  font-weight: 900;
  color: #0052d9;
  opacity: 0.035;
  letter-spacing: -10px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  font-family: 'Georgia', serif;
  white-space: nowrap;
}

/* ============================================================
   顶部标题区 · 非对称编辑式
   ============================================================ */
.page-header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 56px 36px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.header-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.eyebrow-line {
  width: 40px;
  height: 1px;
  background: #0052d9;
  flex-shrink: 0;
}

.eyebrow-text {
  font-size: 11px;
  letter-spacing: 2.5px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}

.header-title {
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 900;
  color: #111827;
  margin: 0 0 16px 0;
  letter-spacing: -3px;
  line-height: 0.95;
  font-family: 'Georgia', 'PingFang SC', serif;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
  opacity: 0.85;
  font-family: 'Georgia', serif;
}

.header-desc {
  font-size: 14px;
  color: #6b7280;
  letter-spacing: 0.5px;
  margin: 0;
  line-height: 1.6;
}

/* 邮戳印章 */
.header-right {
  flex-shrink: 0;
  padding-top: 8px;
}

.postmark {
  width: 108px;
  height: 108px;
  border: 1.5px solid rgba(0, 82, 217, 0.55);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transform: rotate(-8deg);
  position: relative;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.postmark::before {
  content: '';
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(0, 82, 217, 0.3);
  border-radius: 50%;
}

.postmark:hover {
  opacity: 0.9;
  transform: rotate(-4deg);
}

.pm-date {
  font-size: 12px;
  font-weight: 700;
  color: #0052d9;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}

.pm-bar {
  width: 60%;
  height: 1px;
  background: rgba(0, 82, 217, 0.4);
}

.pm-text {
  font-size: 8px;
  font-weight: 700;
  color: #0052d9;
  letter-spacing: 1.5px;
  text-align: center;
  line-height: 1.3;
}

/* ============================================================
   统计数据栏
   ============================================================ */
.stats-bar {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 56px 28px;
  display: flex;
  align-items: stretch;
  gap: 0;
  position: relative;
  z-index: 1;
}

.stat-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 24px;
}

.stat-block:first-child {
  padding-left: 0;
}

.stat-block:last-child {
  padding-right: 0;
}

.stat-value {
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 900;
  color: #111827;
  letter-spacing: -1.5px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  font-family: 'Georgia', serif;
}

.stat-pending { color: #b45309; }
.stat-opened { color: #166534; }
.stat-auditing { color: #92400e; }

.stat-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.stat-divider {
  width: 1px;
  background: #eef2f6;
  align-self: stretch;
}

/* ============================================================
   筛选导航
   ============================================================ */
.filter-nav {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 56px;
  display: flex;
  gap: 8px;
  border-bottom: 1px solid #eef2f6;
  position: relative;
  z-index: 1;
}

.nav-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 16px 20px 16px 0;
  cursor: pointer;
  position: relative;
  transition: opacity 0.25s ease;
  opacity: 0.4;
}

.nav-item:hover {
  opacity: 0.7;
}

.nav-item.active {
  opacity: 1;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 0;
  height: 2px;
  background: #0052d9;
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-item.active::after {
  width: calc(100% - 20px);
}

.nav-label {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  letter-spacing: 0.3px;
}

.nav-item.active .nav-label {
  font-weight: 700;
}

.nav-count {
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  margin-left: 2px;
}

.nav-item.active .nav-count {
  color: #0052d9;
}

/* ============================================================
   胶囊档案列表
   ============================================================ */
.capsule-archive {
  max-width: 1280px;
  margin: 0 auto;
  padding: 8px 56px 24px;
  position: relative;
  z-index: 1;
}

/* 单条档案 */
.archive-entry {
  position: relative;
  border-bottom: 1px solid #eef2f6;
  overflow: hidden;
}

/* 大号背景编号 */
.entry-bg-num {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: clamp(80px, 11vw, 120px);
  font-weight: 900;
  color: #0052d9;
  opacity: 0.035;
  letter-spacing: -5px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  font-family: 'Georgia', serif;
  transition: opacity 0.3s ease;
}

.archive-entry:hover .entry-bg-num {
  opacity: 0.06;
}

/* 可滑动轨道 */
.swipe-track {
  position: relative;
  z-index: 2;
  background: #f8fbff;
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

.swipe-track.no-transition {
  transition: none !important;
}

/* 信封式卡片 */
.envelope {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 8px 24px 0;
  cursor: pointer;
  position: relative;
  transition: padding 0.3s ease;
}

.envelope:hover {
  padding-left: 16px;
}

/* 信封顶部虚线 */
.env-flap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-image: linear-gradient(to right, #d0e7ff 50%, transparent 50%);
  background-size: 8px 1px;
  background-repeat: repeat-x;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.envelope:hover .env-flap {
  opacity: 1;
}

/* 左侧编号区 */
.env-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  width: 48px;
}

.env-serial {
  font-size: 14px;
  font-weight: 700;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
  font-family: 'Georgia', serif;
  transition: color 0.3s ease;
}

.envelope:hover .env-serial {
  color: #0052d9;
}

.env-emoji {
  font-size: 26px;
  line-height: 1;
}

/* 中间内容区 */
.env-center {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.env-title {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.35;
  letter-spacing: 0.1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: transform 0.3s ease;
}

.envelope:hover .env-title {
  transform: translateX(4px);
}

.env-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-date {
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.3px;
}

.meta-dot {
  color: #d0e7ff;
  font-size: 12px;
}

.meta-method {
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.2px;
}

.meta-countdown {
  font-size: 12px;
  color: #b45309;
  font-weight: 600;
  letter-spacing: 0.2px;
}

/* 右侧状态标签 */
.env-right {
  flex-shrink: 0;
  padding-left: 12px;
}

.status-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 4px 10px;
  border: 1px solid;
  border-radius: 6px;
  white-space: nowrap;
}

.tag-pending {
  color: #b45309;
  border-color: #b45309;
}

.tag-opened {
  color: #166534;
  border-color: #166534;
}

.tag-auditing {
  color: #92400e;
  border-color: #92400e;
  border-style: dashed;
}

.tag-rejected,
.tag-failed {
  color: #991b1b;
  border-color: #991b1b;
}

/* 滑出删除面板 */
.delete-panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 92px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #ef4444;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-panel:hover {
  background: #dc2626;
}

.delete-icon {
  font-size: 20px;
}

.delete-text {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
}

/* 档案结尾标记 */
.archive-end {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 0 8px;
}

.end-line {
  width: 60px;
  height: 1px;
  background: #d0e7ff;
}

.end-text {
  font-size: 10px;
  color: #9ca3af;
  letter-spacing: 3px;
  font-weight: 700;
}

/* ============================================================
   空状态
   ============================================================ */
.empty-archive {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 32px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.empty-stamp {
  width: 80px;
  height: 80px;
  border: 2px solid #0052d9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 28px;
  opacity: 0.2;
  transform: rotate(-8deg);
}

.stamp-text {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #0052d9;
}

.empty-title {
  font-size: clamp(40px, 5.5vw, 64px);
  font-weight: 900;
  color: #111827;
  margin: 0 0 16px 0;
  letter-spacing: -2.5px;
  line-height: 1;
  font-family: 'Georgia', 'PingFang SC', serif;
}

.empty-title em {
  font-style: italic;
  font-weight: 300;
  opacity: 0.35;
}

.empty-hint {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 36px 0;
  letter-spacing: 0.3px;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: #0052d9;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.22);
}

.empty-btn:hover {
  background: #0040b0;
  color: #fff;
  box-shadow: 0 10px 26px rgba(0, 82, 217, 0.3);
  transform: translateY(-2px);
  gap: 16px;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.empty-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* ============================================================
   浮动新建按钮
   ============================================================ */
.fab-button {
  position: fixed;
  right: 40px;
  bottom: 80px;
  height: 52px;
  padding: 0 28px;
  background: #0052d9;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(0, 82, 217, 0.25);
  z-index: 100;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.fab-button:hover {
  background: #0040b0;
  color: #fff;
  box-shadow: 0 16px 40px rgba(0, 82, 217, 0.35);
  gap: 14px;
  transform: translateY(-2px);
}

.fab-button:active {
  transform: scale(0.97);
}

.fab-plus {
  font-size: 24px;
  color: #fff;
  font-weight: 300;
  line-height: 1;
}

.fab-button:hover .fab-plus {
  color: #fff;
}

.fab-label {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.fab-button:hover .fab-label {
  color: #fff;
}

/* Element Plus 样式覆盖 */
:deep(.el-button--danger) {
  background: #ef4444;
  border-color: #ef4444;
}

:deep(.el-button--danger:hover) {
  background: #dc2626;
  border-color: #dc2626;
}

:deep(.el-message-box) {
  border-radius: 16px;
}

/* ============================================================
   响应式
   ============================================================ */
@media (max-width: 768px) {
  .page-header {
    padding: 24px 20px 20px;
    flex-direction: column;
    gap: 20px;
  }

  .header-right {
    align-self: flex-end;
    padding-top: 0;
  }

  .postmark {
    width: 84px;
    height: 84px;
  }

  .pm-date {
    font-size: 10px;
  }

  .pm-text {
    font-size: 7px;
  }

  .header-title {
    font-size: 44px;
    letter-spacing: -2px;
  }

  .stats-bar {
    padding: 0 20px 20px;
  }

  .stat-block {
    padding: 0 12px;
  }

  .stat-value {
    font-size: 28px;
  }

  .filter-nav {
    padding: 0 20px;
  }

  .nav-item {
    padding: 14px 16px 14px 0;
  }

  .capsule-archive {
    padding: 8px 20px 16px;
  }

  .envelope {
    gap: 14px;
    padding: 18px 4px 18px 0;
  }

  .envelope:hover {
    padding-left: 8px;
  }

  .env-left {
    width: 36px;
  }

  .env-serial {
    font-size: 12px;
  }

  .env-emoji {
    font-size: 22px;
  }

  .env-title {
    font-size: 15px;
  }

  .meta-date,
  .meta-method,
  .meta-countdown {
    font-size: 11px;
  }

  .env-right {
    display: none;
  }

  .fab-button {
    right: 16px;
    bottom: 32px;
    height: 48px;
    padding: 0 22px;
  }

  .fab-plus {
    font-size: 22px;
  }

  .fab-label {
    font-size: 11px;
  }
}

/* ===== 删除动画 ===== */
.archive-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.archive-entry {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.capsule-anim-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.capsule-anim-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.capsule-anim-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.capsule-anim-leave-to {
  opacity: 0;
  transform: translateX(-120%) scale(0.92);
  max-height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.capsule-anim-move {
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
