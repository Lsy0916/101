<template>
  <div class="profile-page">
    <!-- ===== Hero 封面 ===== -->
    <header class="hero">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-topline">
          <span class="hero-eyebrow">{{ t('profile.eyebrow') }} / PROFILE</span>
          <span class="hero-issue">No.{{ issueNo }}</span>
        </div>

        <h1 class="hero-title" v-html="t('profile.title')"></h1>
        <p class="hero-sub">{{ t('profile.desc') }}</p>

        <div class="hero-divider" aria-hidden="true"></div>

        <div class="hero-grid">
          <div class="hero-portrait">
            <InitialAvatar :name="profileForm.name || 'U'" :size="96" />
            <span class="hero-role">{{ roleLabel }}</span>
          </div>
          <div class="hero-detail">
            <div class="hero-name">{{ profileForm.name || t('nav.user.guest') }}</div>
            <div class="hero-meta">
              <span class="meta-item">
                <el-icon><School /></el-icon>{{ profileForm.school || '—' }}
              </span>
              <span class="meta-dot">/</span>
              <span class="meta-item">{{ t('profile.hero.studentId') }} · {{ profileForm.studentId || '—' }}</span>
              <span class="meta-dot">/</span>
              <span class="meta-item">{{ t('profile.hero.joinDate') }} · 2024-09-01</span>
            </div>
            <p class="hero-bio">{{ psychForm.bio || t('profile.hero.bioEmpty') }}</p>
          </div>
          <div class="hero-cta">
            <button class="cta-btn" @click="scrollToSection('sec-profile')">
              <el-icon><Edit /></el-icon>{{ t('profile.hero.editProfile') }}
            </button>
            <button class="cta-btn ghost" @click="scrollToSection('sec-stats')">
              <el-icon><Histogram /></el-icon>{{ t('profile.hero.viewStats') }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== 01 基础资料 ===== -->
    <section id="sec-profile" class="mag-section">
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
          <dd class="field-value">{{ profileForm.name || '—' }}</dd>
        </div>
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.profile.studentId') }}</dt>
          <dd class="field-value">{{ profileForm.studentId || '—' }}</dd>
        </div>
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.profile.gender') }}</dt>
          <dd class="field-value">{{ genderLabel }}</dd>
        </div>
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.profile.school') }}</dt>
          <dd class="field-value">{{ profileForm.school || '—' }}</dd>
        </div>
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.profile.major') }}</dt>
          <dd class="field-value">{{ profileForm.major || '—' }}</dd>
        </div>
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.profile.enrollYear') }}</dt>
          <dd class="field-value">{{ profileForm.enrollYear || '—' }}</dd>
        </div>
      </dl>

      <!-- 编辑模式 -->
      <el-form v-else :model="profileForm" label-position="top" class="mag-form">
        <div class="form-grid">
          <el-form-item :label="t('profile.card.profile.name') + ' *'">
            <el-input v-model="profileForm.name" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item :label="t('profile.card.profile.studentId') + ' *'">
            <el-input v-model="profileForm.studentId" maxlength="20" />
          </el-form-item>
          <el-form-item :label="t('profile.card.profile.gender')">
            <el-select v-model="profileForm.gender" clearable>
              <el-option :label="t('profile.card.profile.genderMale')" value="male" />
              <el-option :label="t('profile.card.profile.genderFemale')" value="female" />
              <el-option :label="t('profile.card.profile.genderOther')" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('profile.card.profile.school')">
            <el-input v-model="profileForm.school" maxlength="40" />
          </el-form-item>
          <el-form-item :label="t('profile.card.profile.major')">
            <el-input v-model="profileForm.major" maxlength="30" />
          </el-form-item>
          <el-form-item :label="t('profile.card.profile.enrollYear')">
            <el-input v-model="profileForm.enrollYear" placeholder="2024" maxlength="4" />
          </el-form-item>
        </div>
        <div class="form-actions">
          <el-button class="ghost-btn" @click="cancelProfileEdit">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" class="solid-btn" @click="saveProfile">{{ t('profile.card.profile.save') }}</el-button>
        </div>
      </el-form>
    </section>

    <!-- ===== 02 心理档案 ===== -->
    <section class="mag-section">
      <div class="sec-head">
        <span class="sec-num">02</span>
        <div class="sec-titles">
          <h2 class="sec-title">{{ t('profile.card.psychological.title') }}</h2>
          <p class="sec-desc">{{ t('profile.card.psychological.desc') }}</p>
        </div>
        <button class="sec-toggle" @click="togglePsychEdit">
          <el-icon><component :is="psychEditing ? View : Edit" /></el-icon>
          <span>{{ psychEditing ? t('common.view') : t('common.edit') }}</span>
        </button>
      </div>

      <!-- 查看模式 -->
      <dl v-if="!psychEditing" class="field-list">
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.psychological.mbti') }}</dt>
          <dd class="field-value strong">{{ psychForm.mbti || '—' }}</dd>
        </div>
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.psychological.stressLevel') }}</dt>
          <dd class="field-value">{{ stressLabel }}</dd>
        </div>
        <div class="field-row">
          <dt class="field-label">{{ t('profile.card.psychological.sleepQuality') }}</dt>
          <dd class="field-value">{{ sleepLabel }}</dd>
        </div>
        <div class="field-row field-row--block">
          <dt class="field-label">{{ t('profile.card.psychological.interests') }}</dt>
          <dd class="field-value">
            <span v-if="!psychForm.interests.length">—</span>
            <span v-for="(tag, i) in psychForm.interests" :key="i" class="tag-chip">{{ tag }}</span>
          </dd>
        </div>
        <div class="field-row field-row--block">
          <dt class="field-label">{{ t('profile.card.psychological.bio') }}</dt>
          <dd class="field-value prose">{{ psychForm.bio || '—' }}</dd>
        </div>
      </dl>

      <!-- 编辑模式 -->
      <el-form v-else :model="psychForm" label-position="top" class="mag-form">
        <div class="form-grid two">
          <el-form-item :label="t('profile.card.psychological.mbti')">
            <el-select v-model="psychForm.mbti" :placeholder="t('profile.card.psychological.mbtiPlaceholder')" clearable filterable>
              <el-option v-for="m in mbtiTypes" :key="m" :label="m" :value="m" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('profile.card.psychological.stressLevel')">
            <el-radio-group v-model="psychForm.stressLevel">
              <el-radio-button value="low">{{ t('profile.card.psychological.stressLow') }}</el-radio-button>
              <el-radio-button value="mid">{{ t('profile.card.psychological.stressMid') }}</el-radio-button>
              <el-radio-button value="high">{{ t('profile.card.psychological.stressHigh') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="t('profile.card.psychological.sleepQuality')">
            <el-radio-group v-model="psychForm.sleepQuality">
              <el-radio-button value="poor">{{ t('profile.card.psychological.sleepPoor') }}</el-radio-button>
              <el-radio-button value="fair">{{ t('profile.card.psychological.sleepFair') }}</el-radio-button>
              <el-radio-button value="good">{{ t('profile.card.psychological.sleepGood') }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item :label="t('profile.card.psychological.interests')">
          <div class="tag-area">
            <span v-for="(tag, i) in psychForm.interests" :key="i" class="tag-chip removable">
              {{ tag }}
              <el-icon class="tag-close" @click="removeTag(i)"><Close /></el-icon>
            </span>
            <el-input
              v-if="tagInputVisible"
              ref="tagInputRef"
              v-model="tagInputValue"
              size="small"
              class="tag-input"
              :placeholder="t('profile.card.psychological.interestPlaceholder')"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <button v-else type="button" class="tag-add" @click="showTagInput">
              <el-icon><Plus /></el-icon>
            </button>
          </div>
        </el-form-item>
        <el-form-item :label="t('profile.card.psychological.bio')">
          <el-input
            v-model="psychForm.bio"
            type="textarea"
            :rows="4"
            maxlength="200"
            show-word-limit
            class="custom-scroll"
          />
        </el-form-item>
        <div class="form-actions">
          <el-button class="ghost-btn" @click="cancelPsychEdit">{{ t('common.cancel') }}</el-button>
          <el-button type="primary" class="solid-btn" @click="savePsych">{{ t('profile.card.psychological.save') }}</el-button>
        </div>
      </el-form>
    </section>

    <!-- ===== 03 活动统计 ===== -->
    <section id="sec-stats" class="mag-section">
      <div class="sec-head">
        <span class="sec-num">03</span>
        <div class="sec-titles">
          <h2 class="sec-title">{{ t('profile.card.stats.title') }}</h2>
          <p class="sec-desc">{{ t('profile.card.stats.desc') }}</p>
        </div>
      </div>
      <div class="stats-row">
        <div v-for="(s, i) in stats" :key="s.key" class="stat-block">
          <span class="stat-index">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="stat-num">{{ s.value }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ===== 04 成长足迹 ===== -->
    <section class="mag-section">
      <div class="sec-head">
        <span class="sec-num">04</span>
        <div class="sec-titles">
          <h2 class="sec-title">{{ t('profile.card.growth.title') }}</h2>
          <p class="sec-desc">{{ t('profile.card.growth.desc') }}</p>
        </div>
        <button class="sec-toggle" @click="router.push('/square')">
          <el-icon><View /></el-icon>
          <span>{{ t('profile.card.growth.viewAll') }}</span>
        </button>
      </div>

      <!-- 成长概览 -->
      <div class="growth-summary">
        <div class="gs-header">
          <span class="gs-label">{{ t('profile.card.growth.summary') }}</span>
          <span class="gs-line"></span>
        </div>
        <div class="gs-stats">
          <div class="gs-stat">
            <span class="gs-num">{{ growthSummary.total }}</span>
            <span class="gs-key">{{ t('profile.card.growth.totalActivities') }}</span>
          </div>
          <div class="gs-stat">
            <span class="gs-num">{{ growthSummary.activeDays }}</span>
            <span class="gs-key">{{ t('profile.card.growth.activeDays') }}</span>
          </div>
          <div class="gs-stat">
            <span class="gs-num">{{ growthSummary.streak }}</span>
            <span class="gs-key">{{ t('profile.card.growth.streak') }}</span>
          </div>
          <div class="gs-stat">
            <span class="gs-num">{{ growthSummary.badgeCount }}</span>
            <span class="gs-key">{{ t('profile.card.growth.badges') }}</span>
          </div>
        </div>
      </div>

      <!-- 徽章墙 -->
      <div class="badge-wall">
        <div
          v-for="badge in badges"
          :key="badge.key"
          class="badge-card"
          :class="{ earned: badge.earned }"
        >
          <span class="badge-icon" :class="badge.icon">{{ badge.letter }}</span>
          <div class="badge-info">
            <span class="badge-name">{{ badge.name }}</span>
            <span class="badge-desc">{{ badge.desc }}</span>
          </div>
        </div>
      </div>

      <!-- 时间线 -->
      <div class="timeline-groups">
        <div v-for="group in timelineGroups" :key="group.year" class="timeline-group">
          <div class="tg-year-mark">
            <span class="tg-year">{{ group.year }}</span>
            <span class="tg-rule"></span>
          </div>
          <ol class="timeline-list">
            <li v-for="(item, i) in group.items" :key="i" class="timeline-row">
              <span class="timeline-no">{{ String(i + 1).padStart(2, '0') }}</span>
              <div class="timeline-body">
                <span class="timeline-text">{{ item.text }}</span>
                <span class="timeline-date">{{ item.date }}</span>
              </div>
              <span class="timeline-kind" :class="item.type">{{ item.kind }}</span>
            </li>
          </ol>
        </div>
        <p class="timeline-end">{{ t('profile.card.growth.noMore') }}</p>
      </div>
    </section>

    <!-- ===== 05 危险操作 ===== -->
    <section class="mag-section danger-section">
      <div class="sec-head">
        <span class="sec-num danger">!</span>
        <div class="sec-titles">
          <h2 class="sec-title">{{ t('profile.card.danger.title') }}</h2>
          <p class="sec-desc">{{ t('profile.card.danger.desc') }}</p>
        </div>
      </div>
      <div class="danger-action">
        <el-button type="danger" plain class="danger-btn" @click="handleDelete">
          <el-icon><Warning /></el-icon>
          {{ t('profile.card.danger.deleteBtn') }}
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Histogram, Warning, School, Edit, View, Plus, Close
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/useUserStore'
import { logout } from '@/composables/useAuth'
import InitialAvatar from '@/components/InitialAvatar.vue'

interface UserExtra {
  name?: string
  studentId?: string
  userId?: string
  school?: string
  enrollYear?: string
  gender?: string
  major?: string
  mbti?: string
  interests?: string[]
  bio?: string
  stressLevel?: string
  sleepQuality?: string
  roleId?: string
}

interface GrowthItem {
  type: string
  kind: string
  text: string
  date: string
}

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const info = (userStore.profile || {}) as UserExtra

const profileForm = reactive({
  name: info.name || '',
  studentId: info.studentId || info.userId || '',
  school: info.school || '',
  enrollYear: info.enrollYear || '',
  gender: info.gender || '',
  major: info.major || ''
})

const psychForm = reactive({
  mbti: info.mbti || '',
  interests: info.interests ? [...info.interests] : ['阅读', '音乐'],
  bio: info.bio || '',
  stressLevel: info.stressLevel || 'mid',
  sleepQuality: info.sleepQuality || 'fair'
})

// 备份用于取消编辑时还原
let profileBackup = { ...profileForm }
let psychBackup = { ...psychForm, interests: [...psychForm.interests] }

const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']

const issueNo = computed(() => String(new Date().getMonth() + 1).padStart(2, '0'))

const profileEditing = ref(false)
const psychEditing = ref(false)

const roleLabel = computed(() => {
  const r = userStore.role || info.roleId || 'student'
  if (r === 'teacher') return t('profile.card.profile.roleTeacher')
  if (r === 'admin') return t('profile.card.profile.roleAdmin')
  return t('profile.card.profile.roleStudent')
})

const genderLabel = computed(() => {
  if (profileForm.gender === 'male') return t('profile.card.profile.genderMale')
  if (profileForm.gender === 'female') return t('profile.card.profile.genderFemale')
  if (profileForm.gender === 'other') return t('profile.card.profile.genderOther')
  return '—'
})

const stressLabel = computed(() => {
  if (psychForm.stressLevel === 'low') return t('profile.card.psychological.stressLow')
  if (psychForm.stressLevel === 'mid') return t('profile.card.psychological.stressMid')
  if (psychForm.stressLevel === 'high') return t('profile.card.psychological.stressHigh')
  return '—'
})

const sleepLabel = computed(() => {
  if (psychForm.sleepQuality === 'poor') return t('profile.card.psychological.sleepPoor')
  if (psychForm.sleepQuality === 'fair') return t('profile.card.psychological.sleepFair')
  if (psychForm.sleepQuality === 'good') return t('profile.card.psychological.sleepGood')
  return '—'
})

const stats = computed(() => [
  { key: 'assessments', value: 12, label: t('profile.card.stats.assessments') },
  { key: 'counseling', value: 3, label: t('profile.card.stats.counseling') },
  { key: 'moments', value: 8, label: t('profile.card.stats.moments') },
  { key: 'favorites', value: 24, label: t('profile.card.stats.favorites') },
  { key: 'capsules', value: 5, label: t('profile.card.stats.capsules') }
])

const growthTimeline = computed(() => [
  { type: 'milestone', kind: 'M', text: t('profile.card.growth.items.milestone') + ' · 100', date: '2025-06-20' },
  { type: 'assessment', kind: 'A', text: t('profile.card.growth.items.assessment') + ' · 抑郁自评量表', date: '2025-06-15' },
  { type: 'square', kind: 'S', text: t('profile.card.growth.items.square') + ' · 考前焦虑应对', date: '2025-06-08' },
  { type: 'comment', kind: 'C', text: t('profile.card.growth.items.comment') + ' · 时光胶囊', date: '2025-05-28' },
  { type: 'counseling', kind: 'C', text: t('profile.card.growth.items.counseling'), date: '2025-05-20' },
  { type: 'article', kind: 'F', text: t('profile.card.growth.items.article') + ' · 心理韧性', date: '2025-05-10' },
  { type: 'like', kind: 'L', text: t('profile.card.growth.items.like'), date: '2025-04-22' },
  { type: 'capsule', kind: 'T', text: t('profile.card.growth.items.capsule'), date: '2025-04-01' },
  { type: 'assessment', kind: 'A', text: t('profile.card.growth.items.assessment') + ' · MBTI', date: '2024-12-15' },
  { type: 'counseling', kind: 'C', text: t('profile.card.growth.items.counseling'), date: '2024-12-10' },
  { type: 'capsule', kind: 'T', text: t('profile.card.growth.items.capsule'), date: '2024-12-05' },
  { type: 'login', kind: 'L', text: t('profile.card.growth.items.login'), date: '2024-09-01' }
])

const growthSummary = computed(() => ({
  total: 48,
  activeDays: 127,
  streak: 12,
  badgeCount: 4
}))

const badges = computed(() => [
  { key: 'first', icon: 'badge-first', letter: 'I', name: t('profile.card.growth.badgeFirst'), desc: t('profile.card.growth.badgeFirstDesc'), earned: true },
  { key: 'explorer', icon: 'badge-explorer', letter: 'E', name: t('profile.card.growth.badgeExplorer'), desc: t('profile.card.growth.badgeExplorerDesc'), earned: true },
  { key: 'persistent', icon: 'badge-persistent', letter: 'P', name: t('profile.card.growth.badgePersistent'), desc: t('profile.card.growth.badgePersistentDesc'), earned: true },
  { key: 'collector', icon: 'badge-collector', letter: 'C', name: t('profile.card.growth.badgeCollector'), desc: t('profile.card.growth.badgeCollectorDesc'), earned: true }
])

const timelineGroups = computed(() => {
  const groups: Record<string, GrowthItem[]> = {}
  growthTimeline.value.forEach((item) => {
    const year = item.date.split('-')[0]
    if (!groups[year]) groups[year] = []
    groups[year].push(item)
  })
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((year) => ({
      year: year === '2025' ? t('profile.card.growth.year2025') : t('profile.card.growth.year2024'),
      items: groups[year]
    }))
})

const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref<{ focus: () => void } | null>(null)

function showTagInput() {
  tagInputVisible.value = true
  nextTick(() => tagInputRef.value?.focus?.())
}

function addTag() {
  const v = tagInputValue.value.trim()
  if (v && !psychForm.interests.includes(v)) {
    psychForm.interests.push(v)
  }
  tagInputValue.value = ''
  tagInputVisible.value = false
}

function removeTag(i: number) {
  psychForm.interests.splice(i, 1)
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function toggleProfileEdit() {
  if (!profileEditing.value) {
    profileBackup = { ...profileForm }
  }
  profileEditing.value = !profileEditing.value
}

function cancelProfileEdit() {
  Object.assign(profileForm, profileBackup)
  profileEditing.value = false
}

function togglePsychEdit() {
  if (!psychEditing.value) {
    psychBackup = { ...psychForm, interests: [...psychForm.interests] }
  }
  psychEditing.value = !psychEditing.value
}

function cancelPsychEdit() {
  Object.assign(psychForm, psychBackup)
  psychForm.interests = [...psychBackup.interests]
  psychEditing.value = false
}

function saveProfile() {
  if (!profileForm.name.trim()) {
    ElMessage.warning(t('home.validation.nameRequired'))
    return
  }
  if (!profileForm.studentId.trim()) {
    ElMessage.warning(t('counseling.validation.formIncomplete'))
    return
  }
  if (profileForm.enrollYear && !/^\d{4}$/.test(profileForm.enrollYear)) {
    ElMessage.warning(t('counseling.validation.formIncomplete'))
    return
  }
  ElMessage.success(t('profile.card.profile.saveSuccess'))
  profileEditing.value = false
}

function savePsych() {
  if (psychForm.bio && psychForm.bio.length > 200) {
    ElMessage.warning(t('counseling.validation.formIncomplete'))
    return
  }
  ElMessage.success(t('profile.card.psychological.saveSuccess'))
  psychEditing.value = false
}

function handleDelete() {
  ElMessageBox.confirm(
    t('profile.card.danger.confirmMsg'),
    t('profile.card.danger.confirmTitle'),
    {
      confirmButtonText: t('profile.card.danger.confirmBtn'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    logout()
    ElMessage.success(t('profile.card.danger.deleted'))
    router.push('/')
  }).catch(() => {})
}
</script>

<style scoped>
.profile-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px 80px;
  color: #1f2937;
}

/* ============ 字体定义 ============ */
.hero-title,
.sec-title,
.sec-num,
.stat-num,
.hero-name {
  font-family: Georgia, 'Times New Roman', 'Songti SC', 'STSong', serif;
}

/* ============ Hero 封面 ============ */
.hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #0a2a6b 0%, #0052d9 50%, #1890ff 100%);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 88% 18%, rgba(255, 255, 255, 0.14) 0%, transparent 42%),
    radial-gradient(circle at 12% 88%, rgba(24, 144, 255, 0.28) 0%, transparent 50%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding: 56px 56px 48px;
  color: #fff;
}

.hero-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
}

.hero-eyebrow {
  white-space: nowrap;
}

.hero-issue {
  font-family: Georgia, serif;
  font-style: italic;
  letter-spacing: 1px;
}

.hero-title {
  margin: 0 0 14px;
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -1px;
  color: #fff;
}

.hero-title :deep(em) {
  font-style: italic;
  font-weight: 400;
  color: #bae0ff;
}

.hero-sub {
  margin: 0 0 28px;
  max-width: 620px;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
}

.hero-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
  margin-bottom: 32px;
}

.hero-grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 36px;
  align-items: center;
}

.hero-portrait {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero-role {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 3px 12px;
}

.hero-detail {
  min-width: 0;
}

.hero-name {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
  line-height: 1.15;
}

.hero-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.meta-item .el-icon {
  font-size: 15px;
}

.meta-dot {
  color: rgba(255, 255, 255, 0.35);
  font-size: 13px;
}

.hero-bio {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.72);
  max-width: 560px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-cta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #fff;
  background: #fff;
  color: #0052d9;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.cta-btn:hover {
  background: #f0f7ff;
}

.cta-btn.ghost {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.cta-btn.ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.7);
}

/* ============ 杂志区块通用 ============ */
.mag-section {
  border-top: 1px solid #e5e7eb;
  padding: 48px 0 40px;
}

.mag-section:last-child {
  border-bottom: 1px solid #e5e7eb;
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
  color: #0052d9;
  line-height: 1;
  padding-top: 2px;
}

.sec-num.danger {
  color: #ef4444;
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
  color: #0052d9;
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

.field-row--block {
  grid-column: 1 / -1;
  border-right: none !important;
  padding-left: 0 !important;
  padding-right: 0;
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

.field-value.strong {
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: #0052d9;
  letter-spacing: 1px;
}

.field-value.prose {
  font-weight: 400;
  color: #374151;
  line-height: 1.7;
  white-space: pre-wrap;
}

.tag-chip {
  display: inline-block;
  margin: 2px 6px 2px 0;
  padding: 4px 12px;
  font-size: 13px;
  color: #0052d9;
  background: #f0f7ff;
  border: 1px solid #d0e7ff;
}

.tag-chip.removable {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tag-close {
  cursor: pointer;
  font-size: 12px;
  opacity: 0.6;
}

.tag-close:hover {
  opacity: 1;
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

.form-grid.two {
  grid-template-columns: repeat(2, 1fr);
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
  background: #0052d9;
  border-color: #0052d9;
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

/* ============ 标签输入 ============ */
.tag-area {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.tag-add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px dashed #0052d9;
  background: transparent;
  color: #0052d9;
  cursor: pointer;
  transition: background 0.2s;
}

.tag-add:hover {
  background: #f0f7ff;
}

.tag-input {
  width: 150px;
}

/* ============ 活动统计 ============ */
.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
}

.stat-block {
  padding: 8px 28px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid #e5e7eb;
}

.stat-block:first-child {
  border-left: none;
  padding-left: 0;
}

.stat-index {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #9ca3af;
  font-family: Georgia, serif;
  font-style: italic;
}

.stat-num {
  font-size: clamp(40px, 5vw, 56px);
  font-weight: 700;
  line-height: 1;
  color: #0052d9;
  letter-spacing: -1px;
}

.stat-label {
  font-size: 13px;
  color: #4b5563;
  letter-spacing: 0.5px;
}

/* ============ 成长足迹 ============ */
.growth-summary {
  margin-bottom: 36px;
}
.gs-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}
.gs-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #111827;
  white-space: nowrap;
}
.gs-line {
  flex: 1;
  height: 1px;
  background: #111827;
}
.gs-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}
.gs-stat {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid #e5e7eb;
}
.gs-stat:last-child {
  border-right: none;
}
.gs-num {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
  line-height: 1;
  color: #0052d9;
  letter-spacing: -1px;
}
.gs-key {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #6b7280;
}

/* ============ 徽章墙 ============ */
.badge-wall {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}
.badge-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.25s;
}
.badge-card.earned {
  border-color: #d0e7ff;
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
}
.badge-card.earned:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.1);
  border-color: #0052d9;
}
.badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 700;
  color: #9ca3af;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  flex-shrink: 0;
}
.badge-card.earned .badge-icon {
  color: #fff;
  background: linear-gradient(135deg, #0052d9, #1890ff);
  border-color: transparent;
}
.badge-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.badge-name {
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}
.badge-card.earned .badge-name {
  color: #0052d9;
}
.badge-desc {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
}

/* ============ 时间线分组 ============ */
.timeline-groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.timeline-group {
  margin-bottom: 16px;
}
.tg-year-mark {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}
.tg-year {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 700;
  font-style: italic;
  color: #0052d9;
  line-height: 1;
}
.tg-rule {
  flex: 1;
  height: 1px;
  background: #d0e7ff;
}
.timeline-end {
  text-align: center;
  font-size: 12px;
  font-style: italic;
  color: #9ca3af;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 20px 0 0;
  border-top: 1px solid #f0f2f5;
}

/* ============ 时间线列表 ============ */
.timeline-list {
  list-style: none;
  margin: 0;
  padding: 0;
  counter-reset: none;
}

.timeline-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.2s;
}

.timeline-row:hover {
  background: #fafbfc;
}

.timeline-no {
  font-size: 22px;
  font-weight: 700;
  font-style: italic;
  font-family: Georgia, serif;
  color: #d0e7ff;
  line-height: 1;
  width: 40px;
}

.timeline-row:hover .timeline-no {
  color: #0052d9;
}

.timeline-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.timeline-text {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
}

.timeline-date {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 1px;
}

.timeline-kind {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 12px;
  font-weight: 700;
  font-family: Georgia, serif;
  color: #fff;
  background: #0052d9;
  border-radius: 50%;
}

.timeline-kind.counseling { background: #1890ff; }
.timeline-kind.capsule { background: #722ed1; }
.timeline-kind.article { background: #fa8c16; }
.timeline-kind.milestone { background: #0052d9; }
.timeline-kind.square { background: #13c2c2; }
.timeline-kind.comment { background: #eb2f96; }
.timeline-kind.like { background: #52c41a; }
.timeline-kind.login { background: #722ed1; }

/* ============ 危险区 ============ */
.danger-section {
  border-top-color: #fecaca;
}

.danger-section .sec-title {
  color: #b91c1c;
}

.danger-action {
  display: flex;
  justify-content: flex-start;
}

.danger-btn {
  border-radius: 0;
  font-weight: 600;
  padding: 10px 24px;
}

/* ============ 自定义滚动条 ============ */
.custom-scroll :deep(.el-textarea__inner) {
  scrollbar-width: thin;
  scrollbar-color: #d0e7ff transparent;
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  background: #d0e7ff;
}

.custom-scroll :deep(.el-textarea__inner)::-webkit-scrollbar-thumb:hover {
  background: #0052d9;
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

/* ============ 响应式 ============ */
@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: auto 1fr;
    gap: 28px;
  }
  .hero-cta {
    grid-column: 1 / -1;
    flex-direction: row;
    margin-top: 8px;
  }
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
  .form-grid,
  .form-grid.two {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
  .stat-block:nth-child(4) {
    border-left: none;
    padding-left: 0;
  }
  .badge-wall {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px 18px 60px;
  }

  /* Hero */
  .hero-inner {
    padding: 36px 24px 32px;
  }
  .hero-topline {
    margin-bottom: 18px;
    font-size: 11px;
    letter-spacing: 2px;
  }
  .hero-title {
    font-size: clamp(34px, 10vw, 44px);
  }
  .hero-sub {
    font-size: 14px;
    margin-bottom: 22px;
  }
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }
  .hero-portrait {
    align-items: center;
  }
  .hero-detail {
    text-align: center;
  }
  .hero-meta {
    justify-content: center;
  }
  .hero-cta {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  .cta-btn {
    padding: 10px 20px;
    font-size: 13px;
  }

  /* 区块 */
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

  /* 字段列表 - 单列 */
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

  /* 表单 - 单列 */
  .form-grid,
  .form-grid.two {
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

  /* 统计 - 单列 */
  .stats-row {
    grid-template-columns: 1fr;
  }
  .stat-block {
    border-left: none;
    border-bottom: 1px solid #f0f2f5;
    padding: 16px 0;
    flex-direction: row;
    align-items: baseline;
    gap: 16px;
  }
  .stat-block:last-child {
    border-bottom: none;
  }
  .stat-index {
    width: 28px;
  }
  .stat-num {
    font-size: 38px;
  }
  .stat-label {
    margin-left: auto;
    text-align: right;
  }

  /* 时间线 */
  .timeline-row {
    grid-template-columns: auto 1fr;
    gap: 16px;
    padding: 16px 0;
  }
  .timeline-kind {
    grid-column: 2;
    justify-self: start;
    margin-top: 6px;
  }
  .timeline-no {
    font-size: 18px;
    width: 32px;
  }

  /* 成长概览 - 单列 */
  .gs-stats {
    grid-template-columns: 1fr 1fr;
  }
  .gs-stat {
    padding: 18px 12px;
  }
  .gs-stat:nth-child(2) {
    border-right: none;
  }
  .gs-stat:nth-child(1), .gs-stat:nth-child(2) {
    border-bottom: 1px solid #e5e7eb;
  }
  .gs-num {
    font-size: 32px;
  }

  /* 徽章墙 - 双列 */
  .badge-wall {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .badge-card {
    padding: 14px 12px;
  }
  .badge-icon {
    width: 36px;
    height: 36px;
    font-size: 15px;
  }
  .badge-name {
    font-size: 13px;
  }
  .badge-desc {
    font-size: 10px;
  }

  /* 危险区 */
  .danger-action .el-button {
    width: 100%;
  }
}
</style>
