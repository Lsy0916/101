/**
 * 旧 JS 模块的类型门面（allowJs:false 下供新 TS 代码引用旧模块）。
 * 仅声明新代码实际使用的最小表面；阶段 5/6 旧模块删除时本文件一并删除。
 */

declare module '@/stores/auth' {
  export interface AuthStore {
    token: string
    userInfo: Record<string, unknown>
    roleId: string
    rememberMe: boolean
    isLoggedIn: boolean
    isStudent: boolean
    isTeacher: boolean
    isAdmin: boolean
    refreshAuthStatus(): void
    logout(): void
  }
  export function useAuthStore(): AuthStore
}

declare module '@/composables/settings' {
  import type { Ref } from 'vue'

  export interface ThemeController {
    isDark: Ref<boolean>
    themeMode: Ref<'light' | 'dark' | 'auto'>
    setThemeMode(mode: 'light' | 'dark' | 'auto'): void
  }
  export function useTheme(): ThemeController

  export interface LocaleController {
    locale: Ref<string>
    setLocale(lang: string): void
  }
  export function useLocale(): LocaleController
}
