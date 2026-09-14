<template>
  <div class="profile-page">
    <!-- ===== Hero 封面 ===== -->
    <ProfileHero
      :name="profileForm.name"
      :role="roleLabel"
      :school="profileForm.school"
      :student-id="profileForm.studentId"
      :bio="psychForm.bio"
      @edit-profile="scrollToSection('sec-profile')"
      @view-stats="scrollToSection('sec-stats')"
    />

    <!-- ===== 01 基础资料 ===== -->
    <ProfileBasicSection id="sec-profile" v-model:form="profileForm" />

    <!-- ===== 02 心理档案 ===== -->
    <ProfilePsychSection v-model:form="psychForm" />

    <!-- ===== 03 活动统计 ===== -->
    <ProfileStatsSection id="sec-stats" />

    <!-- ===== 04 成长足迹 ===== -->
    <ProfileGrowthSection @view-all="handleViewAll" />

    <!-- ===== 05 危险操作 ===== -->
    <ProfileDangerSection @confirm-delete="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/useUserStore'
import { logout } from '@/composables/useAuth'
import ProfileHero from '@/components/business/profile/ProfileHero.vue'
import ProfileBasicSection from '@/components/business/profile/ProfileBasicSection.vue'
import ProfilePsychSection from '@/components/business/profile/ProfilePsychSection.vue'
import ProfileStatsSection from '@/components/business/profile/ProfileStatsSection.vue'
import ProfileGrowthSection from '@/components/business/profile/ProfileGrowthSection.vue'
import ProfileDangerSection from '@/components/business/profile/ProfileDangerSection.vue'

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

const roleLabel = computed(() => {
  const r = userStore.role || info.roleId || 'student'
  if (r === 'teacher') return t('profile.card.profile.roleTeacher')
  if (r === 'admin') return t('profile.card.profile.roleAdmin')
  return t('profile.card.profile.roleStudent')
})

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleViewAll() {
  router.push('/square')
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

@media (max-width: 768px) {
  .profile-page {
    padding: 20px 18px 60px;
  }
}
</style>
