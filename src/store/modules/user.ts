import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type UserRole = 'student' | 'teacher' | 'admin' | ''

export interface UserInfo {
  id: string
  name: string
  avatar?: string
  roleId: string
}

/**
 * 用户 store：只保存全局状态，不发请求。
 * 登录 / 登出等 API 调用由 server 层 + composables（阶段 4/5）完成，
 * 成功后调用这里的 action 更新状态。
 * token / profile 持久化由 pinia-plugin-persistedstate 完成（key = 'user'）。
 */
export const useUserStore = defineStore(
  'user',
  () => {
    // ---------- state ----------
    const token = ref('')
    const profile = ref<UserInfo | null>(null)
    const rememberMe = ref(false)

    // ---------- getters ----------
    const isLoggedIn = computed(() => token.value !== '')
    const role = computed<UserRole>(() => (profile.value?.roleId as UserRole) ?? '')
    const isStudent = computed(() => role.value === 'student')
    const isTeacher = computed(() => role.value === 'teacher')
    const isAdmin = computed(() => role.value === 'admin')

    // ---------- actions（纯状态变更） ----------
    function setToken(value: string): void {
      token.value = value
    }

    function setProfile(value: UserInfo | null): void {
      profile.value = value
    }

    function setRememberMe(value: boolean): void {
      rememberMe.value = value
    }

    /** 清空认证状态（401 拦截器与登出共用） */
    function reset(): void {
      token.value = ''
      profile.value = null
      rememberMe.value = false
    }

    return {
      token,
      profile,
      rememberMe,
      isLoggedIn,
      role,
      isStudent,
      isTeacher,
      isAdmin,
      setToken,
      setProfile,
      setRememberMe,
      reset,
    }
  },
  { persist: true },
)
