import { computed, ref, watch } from 'vue'
import { useColorMode } from '@vueuse/core'

export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题切换（TS 版，替代旧 composables/settings.js#useTheme）。
 *
 * - VueUse useColorMode 管理用户偏好，storageKey 沿用 'theme-mode'，
 *   既有用户的偏好无缝继承
 * - modes 全空字符串 → VueUse 不向 html 挂 class，统一由下方 watcher 管 .dark
 * - emitAuto: true → colorMode 返回用户选择值（含 'auto'），切换器 UI 反映"用户选择"
 * - 模块级单例：全应用共享同一份偏好状态
 */
const colorMode = useColorMode<ThemeMode>({
  storageKey: 'theme-mode',
  initialValue: 'auto',
  emitAuto: true,
  modes: { auto: '', light: '', dark: '' },
})

// 系统深色偏好（响应式；模块顶层仅执行一次，无重复监听问题）
const systemDark = ref(false)

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
systemDark.value = mediaQuery.matches
mediaQuery.addEventListener('change', onSystemChange)
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    mediaQuery.removeEventListener('change', onSystemChange)
  })
}

function onSystemChange(e: MediaQueryListEvent): void {
  systemDark.value = e.matches
}

/** 当前是否实际为深色（auto 时跟随系统） */
const isDark = computed(
  () => colorMode.value === 'dark' || (colorMode.value === 'auto' && systemDark.value),
)

// isDark 变化自动切换 html.dark（dark-mode.css 体系消费）
watch(
  isDark,
  (dark) => {
    document.documentElement.classList.toggle('dark', dark)
  },
  { immediate: true },
)

export function useTheme() {
  function setThemeMode(mode: ThemeMode): void {
    colorMode.value = mode
  }

  return { isDark, themeMode: colorMode, setThemeMode }
}
