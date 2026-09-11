<template>
  <div class="detail-page">
    <!-- 杂志编辑式标题区 -->
    <header class="page-header">
      <div class="header-back" @click="router.push('/time-capsule')">
        <el-icon><ArrowLeft /></el-icon>
        <span>{{ $t('capsule.detail.back') }}</span>
      </div>
      <span class="header-eyebrow">— Capsule Detail</span>
      <h1 class="header-title" v-html="$t('capsule.detail.title')"></h1>
    </header>

    <!-- 胶囊详情 · 编辑式 -->
    <main v-if="capsule" class="capsule-detail">
      <!-- 标题区 -->
      <div class="detail-title-area" v-reveal>
        <span class="detail-emoji">{{ emotionEmoji }}</span>
        <h2 class="detail-title">{{ capsule.title }}</h2>
        <div class="detail-meta">
          <span class="meta-text">{{ $t('capsule.detail.created', { date: capsule.createDate }) }}</span>
          <span class="meta-sep">·</span>
          <span v-if="capsule.remainingDays > 0" class="meta-status pending">
            {{ $t('capsule.detail.remaining', { days: capsule.remainingDays }) }}
          </span>
          <span v-else class="meta-status opened">{{ $t('capsule.detail.opened') }}</span>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="detail-content" v-reveal="{ delay: 100 }">
        <div v-if="capsule.content" class="rich-content drop-cap" v-html="capsule.content"></div>

        <div v-if="capsule.images && capsule.images.length > 0" class="detail-images">
          <div
            v-for="(img, i) in capsule.images"
            :key="i"
            class="detail-image"
            :style="{ backgroundImage: `url(${img})` }"
            @click="previewImage(i)"
          ></div>
        </div>
      </div>

      <!-- 收件信息 · 编辑式定义列表 -->
      <div class="detail-info" v-reveal>
        <div class="info-eyebrow">— Recipient</div>
        <div class="info-rows">
          <div class="info-row">
            <span class="info-label">{{ $t('capsule.detail.info.method') }}</span>
            <span class="info-value">{{ capsule.openMethod === 'email' ? $t('capsule.detail.methodValue.email') : $t('capsule.detail.methodValue.letter') }}</span>
          </div>
          <div v-if="capsule.emailRecipient" class="info-row">
            <span class="info-label">{{ $t('capsule.detail.info.email') }}</span>
            <span class="info-value">{{ capsule.emailRecipient }}</span>
          </div>
          <div v-if="capsule.letterName" class="info-row">
            <span class="info-label">{{ $t('capsule.detail.info.recipient') }}</span>
            <span class="info-value">{{ capsule.letterName }}</span>
          </div>
          <div v-if="capsule.letterPhone" class="info-row">
            <span class="info-label">{{ $t('capsule.detail.info.phone') }}</span>
            <span class="info-value">{{ capsule.letterPhone }}</span>
          </div>
          <div v-if="capsule.letterAddress" class="info-row">
            <span class="info-label">{{ $t('capsule.detail.info.address') }}</span>
            <span class="info-value">{{ capsule.letterAddress }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ $t('capsule.detail.info.anonymous') }}</span>
            <span class="info-value">{{ capsule.isAnonymous ? $t('capsule.detail.anonymousValue.yes') : $t('capsule.detail.anonymousValue.no') }}</span>
          </div>
        </div>
      </div>

      <!-- 开启时间 · 编辑式大字 + 倒计时环 -->
      <div class="detail-date" v-reveal="{ delay: 100 }">
        <div class="info-eyebrow">— Open Date</div>
        <div class="date-flex">
          <div class="date-text-col">
            <div class="date-display">{{ capsule.openDate }}</div>
            <div v-if="capsule.remainingDays > 0" class="date-count">{{ $t('capsule.detail.countdown', { days: capsule.remainingDays }) }}</div>
            <div v-else class="date-count opened-text">{{ $t('capsule.detail.capsuleOpened') }}</div>
          </div>
          <CountdownRing
            v-if="capsule.remainingDays > 0"
            :days="capsule.remainingDays"
            :total="365"
            :size="120"
            :unit="$t('capsule.detail.dayUnit')"
          />
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="detail-actions">
        <button class="action-btn primary" @click="router.push('/time-capsule/create')">
          <span>{{ $t('capsule.detail.actions.rewrite') }}</span>
          <span class="btn-arrow">→</span>
        </button>
        <button class="action-btn ghost" @click="deleteCapsule">
          <span>{{ $t('capsule.detail.actions.delete') }}</span>
        </button>
      </div>
    </main>

    <!-- 加载状态 -->
    <div v-else class="loading-state">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ $t('capsule.detail.loading') }}</span>
    </div>

    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible" width="auto" :show-close="true" class="image-preview-dialog">
      <img v-if="previewSrc" :src="previewSrc" class="preview-image" :alt="$t('capsule.detail.previewAlt')" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CountdownRing from '@/components/CountdownRing.vue'
import ReadProgress from '@/components/ReadProgress.vue'

interface CapsuleDetailItem {
  id: number
  title: string
  createDate: string
  content: string
  images: string[]
  openMethod: string
  emailRecipient?: string
  letterName?: string
  letterPhone?: string
  letterAddress?: string
  isAnonymous: boolean
  openDate: string
  remainingDays: number
  emotion: string
}

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

// 模拟数据
const mockCapsules: Record<number, CapsuleDetailItem> = {
  1: {
    id: 1,
    title: '写给一年后的自己：保持热爱',
    createDate: '2026-06-20',
    content: '<p>希望一年后的你，依然能记得此刻许下的愿望。无论生活给你什么，都要勇敢地走下去。</p><p>愿你不忘初心，砥砺前行。</p>',
    images: [],
    openMethod: 'email',
    emailRecipient: 'future-me@example.com',
    isAnonymous: false,
    openDate: '2027-06-20',
    remainingDays: 327,
    emotion: 'hopeful'
  },
  2: {
    id: 2,
    title: '毕业季的告白',
    createDate: '2026-06-18',
    content: '<p>四年时光匆匆而过，感谢遇见的每一个人。这段文字将在毕业一周年时开启，愿那时的我们都能成为更好的自己。</p>',
    images: [],
    openMethod: 'email',
    emailRecipient: 'graduation@example.com',
    isAnonymous: true,
    openDate: '2026-06-18',
    remainingDays: 0,
    emotion: 'excited'
  },
  3: {
    id: 3,
    title: '关于成长的一些思考',
    createDate: '2026-06-15',
    content: '<p>成长不是一蹴而就的事情，它藏在每一个平凡的日子里。把这段话封存，等到未来再回头看看当时的自己。</p>',
    images: [],
    openMethod: 'letter',
    letterName: '张三',
    letterPhone: '138****8888',
    letterAddress: '北京市海淀区某某街道',
    isAnonymous: false,
    openDate: '2027-01-01',
    remainingDays: 200,
    emotion: 'calm'
  },
  4: {
    id: 4,
    title: '致迷茫的自己',
    createDate: '2026-06-10',
    content: '<p>如果你正在读这封信，说明时间已经过去很久了。还记得当初的迷茫吗？希望现在的你已经找到了答案。</p>',
    images: [],
    openMethod: 'email',
    emailRecipient: 'self@example.com',
    isAnonymous: false,
    openDate: '2026-06-10',
    remainingDays: 0,
    emotion: 'sad'
  }
}

const capsule = computed(() => {
  const id = Number(route.params.id)
  return mockCapsules[id] || null
})

const emotionEmoji = computed(() => {
  if (!capsule.value) return '🌟'
  const map: Record<string, string> = {
    happy: '😊', excited: '🤩', calm: '😌', sad: '😢', hopeful: '🌟'
  }
  return map[capsule.value.emotion] || '🌟'
})

// 图片预览
const previewVisible = ref(false)
const previewSrc = ref('')

const previewImage = (index: number) => {
  if (capsule.value?.images?.[index]) {
    previewSrc.value = capsule.value.images[index]
    previewVisible.value = true
  }
}

const deleteCapsule = () => {
  ElMessageBox.confirm(t('capsule.detail.deleteConfirm'), t('capsule.detail.deleteTitle'), {
    confirmButtonText: t('capsule.detail.deleteOk'),
    cancelButtonText: t('capsule.detail.deleteCancelled'),
    type: 'warning'
  }).then(() => {
    ElMessage.success(t('capsule.detail.deleteSuccess'))
    router.push('/time-capsule')
  }).catch(() => {})
}
</script>

<style scoped>
/* 时光胶囊 - 详情页（仿小程序 capsule-details） */
.detail-page {
  min-height: 100vh;
  background: #f8fbff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'PingFang SC', sans-serif;
  color: #111827;
  padding-bottom: 60px;
  position: relative;
  overflow-x: hidden;
}

.detail-page::before {
  content: 'OPEN';
  position: absolute;
  top: 80px;
  right: -30px;
  font-size: clamp(160px, 24vw, 300px);
  font-weight: 900;
  color: #0052d9;
  opacity: 0.04;
  letter-spacing: -10px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.page-header {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 56px 32px;
  position: relative;
  border-bottom: 1px solid #eef2f6;
  z-index: 1;
}

.header-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.2s;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.header-back:hover {
  color: #0052d9;
}

.header-eyebrow {
  display: block;
  font-size: 12px;
  letter-spacing: 3px;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.header-title {
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -2px;
  line-height: 1.02;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
  opacity: 0.85;
}

/* 详情主体 · 编辑式 */
.capsule-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 56px;
  position: relative;
  z-index: 1;
}

/* 标题区 */
.detail-title-area {
  padding: 36px 0 28px;
  border-bottom: 1px solid #eef2f6;
}

.detail-emoji {
  font-size: 32px;
  line-height: 1;
  display: block;
  margin-bottom: 16px;
}

.detail-title {
  font-size: clamp(28px, 4.5vw, 44px);
  font-weight: 800;
  color: #111827;
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.15;
  word-break: break-word;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  letter-spacing: 0.3px;
}

.meta-text {
  color: #9ca3af;
}

.meta-sep {
  color: #d0e7ff;
}

.meta-status {
  font-weight: 600;
}

.meta-status.pending { color: #ea580c; }
.meta-status.opened { color: #15803d; }

/* 内容区域 */
.detail-content {
  padding: 28px 0;
  border-bottom: 1px solid #eef2f6;
}

.rich-content {
  font-size: 15px;
  color: #1f2937;
  line-height: 1.85;
  letter-spacing: 0.2px;
}

.rich-content :deep(p) {
  margin: 10px 0;
  line-height: 1.85;
}

.rich-content :deep(strong),
.rich-content :deep(b) {
  font-weight: 700;
}

.rich-content :deep(em),
.rich-content :deep(i) {
  font-style: italic;
}

.rich-content :deep(u) {
  text-decoration: underline;
}

.rich-content :deep(ul),
.rich-content :deep(ol) {
  padding-left: 24px;
  margin: 10px 0;
}

.rich-content :deep(ul li) {
  list-style-type: disc;
}

.rich-content :deep(ol li) {
  list-style-type: decimal;
}

/* 图片 */
.detail-images {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.detail-image {
  width: 100%;
  height: 110px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  background-color: #f8fafc;
  cursor: pointer;
  transition: opacity 0.2s;
}

.detail-image:hover {
  opacity: 0.85;
}

/* 收件信息 · 编辑式定义列表 */
.detail-info {
  padding: 28px 0;
  border-bottom: 1px solid #eef2f6;
}

.info-eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.info-rows {
  display: flex;
  flex-direction: column;
}

.info-row {
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 1px solid #eef2f6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 12px;
  color: #9ca3af;
  min-width: 80px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
  flex-shrink: 0;
}

.info-value {
  font-size: 14px;
  color: #1f2937;
  flex: 1;
  letter-spacing: 0.2px;
}

/* 开启时间 · 编辑式大字 */
.detail-date {
  padding: 28px 0;
  border-bottom: 1px solid #eef2f6;
}

.date-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.date-text-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-display {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  color: #111827;
  letter-spacing: -1px;
  line-height: 1.1;
  margin: 8px 0;
  font-variant-numeric: tabular-nums;
}

.date-count {
  font-size: 13px;
  color: #ea580c;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.opened-text {
  color: #15803d;
}

/* 操作按钮 */
.detail-actions {
  display: flex;
  gap: 12px;
  padding: 32px 0 12px;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 0;
  border-radius: 14px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: inherit;
}

.action-btn.primary {
  background: #0052d9;
  color: #fff;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.22);
}

.action-btn.primary:hover {
  background: #0040b0;
  color: #fff;
  box-shadow: 0 10px 26px rgba(0, 82, 217, 0.3);
  transform: translateY(-2px);
}

.action-btn.primary:hover .btn-arrow {
  transform: translateX(6px);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.action-btn.ghost {
  background: transparent;
  color: #1f2937;
  box-shadow: inset 0 0 0 1px #eef2f6;
}

.action-btn.ghost:hover {
  box-shadow: inset 0 0 0 1px #0052d9;
  color: #0052d9;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #eef2f6;
  border-top-color: #0052d9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #9ca3af;
}

/* 图片预览 */
.image-preview-dialog :deep(.el-dialog) {
  background: transparent;
  box-shadow: none;
  border-radius: 16px;
}

.image-preview-dialog :deep(.el-dialog__header) {
  border: none;
  padding: 0;
}

.preview-image {
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px 16px 20px;
  }

  .header-title {
    font-size: 36px;
    letter-spacing: -1px;
  }

  .capsule-detail {
    padding: 0 16px;
  }

  .detail-title {
    font-size: 28px;
  }

  .detail-images {
    grid-template-columns: repeat(2, 1fr);
  }

  .info-row {
    flex-direction: column;
    gap: 4px;
  }

  .info-label {
    min-width: 0;
  }

  .detail-actions {
    flex-direction: column;
  }
}
</style>
