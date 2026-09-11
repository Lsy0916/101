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

declare module '@/utils/debounce' {
  export function debounce<T extends (...args: never[]) => void>(
    func: T,
    wait: number,
    immediate?: boolean
  ): ((...args: Parameters<T>) => void) & { cancel(): void }
}

declare module '@/data/articles' {
  export interface ArticleItem {
    id: number
    title: string
    summary: string
    content: string
    category: string
    categoryLabel: string
    author: string
    authorTitle: string
    date: string
    views: number
    readTime: string
    image?: string
    featured: boolean
  }
  export const articles: ArticleItem[]
  export const categories: { label: string; key: string }[]
  export const categoryLabel: (key: string) => string
  export const getArticleById: (id: string | number | string[]) => ArticleItem | null
  export const getRelatedArticles: (article: ArticleItem, limit?: number) => ArticleItem[]
}

// ---- JS 编写的共享组件（TS 视图引用时的门面；组件 TS 化后删除对应块） ----

declare module '@/components/CommandPalette.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '@/components/ReadProgress.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '@/components/CountdownRing.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{
    days?: number
    total?: number
    size?: number
    strokeWidth?: number
    progressColor?: string
    trackColor?: string
    unit?: string
  }, Record<string, never>, unknown>
  export default component
}

declare module '@/components/InitialAvatar.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{ name?: string; size?: number }, Record<string, never>, unknown>
  export default component
}

declare module '@/components/AnimatedCounter.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{
    target?: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
  }, Record<string, never>, unknown>
  export default component
}

declare module '@/components/login/Propaganda.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}
