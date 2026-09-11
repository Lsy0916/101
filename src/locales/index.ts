import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import enUS from './en-US'

export type AppLocale = 'zh-CN' | 'zh-TW' | 'en-US'

const STORAGE_KEY = 'locale'
const KNOWN_LOCALES: AppLocale[] = ['zh-CN', 'zh-TW', 'en-US']

const stored = localStorage.getItem(STORAGE_KEY) as AppLocale | null
const savedLocale: AppLocale =
  stored && KNOWN_LOCALES.includes(stored) ? stored : 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'en-US': enUS
  },
  warnHtmlMessage: false
})

export const elementLocaleMap: Record<AppLocale, () => Promise<unknown>> = {
  'zh-CN': () => import('element-plus/es/locale/lang/zh-cn'),
  'zh-TW': () => import('element-plus/es/locale/lang/zh-tw'),
  'en-US': () => import('element-plus/es/locale/lang/en')
}

export default i18n
