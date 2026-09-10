import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN.js'
import zhTW from './zh-TW.js'
import enUS from './en-US.js'

const STORAGE_KEY = 'locale'
const savedLocale = localStorage.getItem(STORAGE_KEY) || 'zh-CN'

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

export const elementLocaleMap = {
  'zh-CN': () => import('element-plus/es/locale/lang/zh-cn'),
  'zh-TW': () => import('element-plus/es/locale/lang/zh-tw'),
  'en-US': () => import('element-plus/es/locale/lang/en')
}

export default i18n
