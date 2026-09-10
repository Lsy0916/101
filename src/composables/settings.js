import { computed, watch, ref } from 'vue'
import { useColorMode } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

// 使用 VueUse useColorMode 管理用户偏好（'light' | 'dark' | 'auto'）
// modes 全部为空字符串 → VueUse 不向 html 添加 class，由下方 watcher 统一管理 .dark class
// emitAuto: true → colorMode.value 返回用户选择值（含 'auto'）而非解析后的 light/dark，
// 使切换器的勾选/图标反映"用户选择"而非"系统解析结果"
const colorMode = useColorMode({
  storageKey: 'theme-mode',
  initialValue: 'auto',
  emitAuto: true,
  modes: { auto: '', light: '', dark: '' }
})

// 系统深色偏好（响应式，避免模块级 addEventListener 泄漏）
const systemDark = ref(false)

if (typeof window !== 'undefined' && !window.__themeListenerAdded) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  systemDark.value = mediaQuery.matches
  const handler = (e) => { systemDark.value = e.matches }
  mediaQuery.addEventListener('change', handler)
  window.__themeListenerAdded = true
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      mediaQuery.removeEventListener('change', handler)
      window.__themeListenerAdded = false
    })
  }
} else if (typeof window !== 'undefined') {
  systemDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 当前是否实际为深色
const isDark = computed(() => {
  if (colorMode.value === 'dark') return true
  if (colorMode.value === 'auto') return systemDark.value
  return false
})

// 自主深色模式：通过 .dark class + CSS 变量实现，便于后续扩展
function applyDarkClass() {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// 监听 isDark 变化，自动切换 .dark class
watch(isDark, applyDarkClass, { immediate: true })

export function useTheme() {
  const setThemeMode = (mode) => {
    colorMode.value = mode
  }

  const themeMode = colorMode

  return { isDark, themeMode, setThemeMode }
}

// 语言切换 · 基于 vue-i18n（第三方组件）
export function useLocale() {
  const { locale } = useI18n()

  const setLocale = (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
    document.documentElement.setAttribute('lang', lang)
  }

  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', locale.value)
  }

  return { locale, setLocale }
}
