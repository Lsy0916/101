import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

export type DeviceType = 'pc' | 'mobile'

/**
 * 移动端 UA 特征。
 * 本项目唯一的 UA 检测，仅用于「入口分包」这一同步决策：
 * main.ts 加载前必须确定下载哪套 bundle，而 iPad 横屏时视口宽度
 * 与 PC 相同，纯视口判断会误判。组件内响应式适配一律用 isMobile。
 */
const MOBILE_UA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

/** 同步判断：入口处调用一次，决定加载哪套 bundle（切换设备需刷新生效） */
export function isMobileUA(): boolean {
  if (typeof window === 'undefined') return false
  return MOBILE_UA.test(window.navigator.userAgent)
}

/** 响应式视口检测（VueUse，自动管理监听，不手写 resize） */
const isViewportMobile = useMediaQuery('(max-width: 768px)')

/** 响应式设备标识：组件内细粒度适配用 */
export const isMobile = computed<boolean>(() => isViewportMobile.value || isMobileUA())

export const deviceType = computed<DeviceType>(() => (isMobile.value ? 'mobile' : 'pc'))
