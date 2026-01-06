import { ref, watch, onMounted, onUnmounted } from 'vue'

// 主题模式: 'light' | 'dark' | 'auto'
const themeMode = ref(localStorage.getItem('theme-mode') || 'auto')
const isDark = ref(false)

// 语言: 'zh-CN' | 'zh-TW' | 'en-US'
const locale = ref(localStorage.getItem('locale') || 'zh-CN')

function updateTheme() {
  const isDarkNow = themeMode.value === 'dark' || 
    (themeMode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  isDark.value = isDarkNow
  if (isDarkNow) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const handleSystemThemeChange = () => {
  if (themeMode.value === 'auto') {
    updateTheme()
  }
}

export function useTheme() {
  onMounted(() => {
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    updateTheme()
  })

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  })

  const setThemeMode = (mode) => {
    themeMode.value = mode
    localStorage.setItem('theme-mode', mode)
    updateTheme()
  }

  return { isDark, themeMode, setThemeMode }
}

export function useLocale() {
  const setLocale = (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  return { locale, setLocale }
}
