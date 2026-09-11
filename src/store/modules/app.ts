import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DeviceType } from '@/utils/device'
import { isMobileUA } from '@/utils/device'
import type { AppLocale } from '@/locales'
import i18n from '@/locales'

export type ThemeType = 'light' | 'dark'

/**
 * 应用级全局状态：设备 / 主题 / 语言。
 * - device：入口分流结果，由 router 守卫（阶段 3）写入，不持久化
 * - theme：持久化用户偏好，写入时同步 html.dark class
 * - locale：单一数据源仍是 localStorage 'locale' + i18n（沿用现有机制），
 *   store 仅作响应式镜像，setLocale 同步三处，不单独持久化
 */
export const useAppStore = defineStore(
  'app',
  () => {
    const device = ref<DeviceType>(isMobileUA() ? 'mobile' : 'pc')
    const theme = ref<ThemeType>('light')
    const locale = ref<AppLocale>((i18n.global.locale.value as AppLocale) || 'zh-CN')

    /** 将当前主题应用到 DOM（class 由 dark-mode.css 体系消费） */
    function applyTheme(): void {
      document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }

    function setTheme(value: ThemeType): void {
      theme.value = value
      applyTheme()
    }

    function toggleTheme(): void {
      setTheme(theme.value === 'light' ? 'dark' : 'light')
    }

    function setDevice(value: DeviceType): void {
      device.value = value
    }

    function setLocale(value: AppLocale): void {
      locale.value = value
      i18n.global.locale.value = value
      localStorage.setItem('locale', value) // 兼容现有 key，保持单一数据源
    }

    // store 激活时恢复持久化的主题（刷新后 html.dark 不丢）
    applyTheme()

    return { device, theme, locale, setDevice, setTheme, toggleTheme, setLocale, applyTheme }
  },
  // 只持久化用户偏好；device 每次由真实环境决定
  { persist: { pick: ['theme'] } },
)
