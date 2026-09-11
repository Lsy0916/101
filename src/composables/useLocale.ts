import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AppLocale } from '@/locales'

/**
 * 语言切换（TS 版，替代旧 composables/settings.js#useLocale）。
 * 单一数据源沿用 vue-i18n + localStorage 'locale' + html[lang]，行为等价。
 */
export function useLocale() {
  const { locale } = useI18n()

  function setLocale(lang: string): void {
    locale.value = lang
    localStorage.setItem('locale', lang)
    document.documentElement.setAttribute('lang', lang)
  }

  document.documentElement.setAttribute('lang', locale.value)

  return { locale: locale as Ref<AppLocale>, setLocale }
}
