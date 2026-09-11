import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, Router } from 'vue-router'
import { isMobileUA } from '@/utils/device'
import { setupRouterGuards } from './guards'

/**
 * 按设备异步创建路由：只有当前设备的路由表会进入 bundle。
 * （动态 import 保证移动端用户不下载 PC 路由与对应视图，反之亦然）
 */
export async function createAppRouter(): Promise<Router> {
  const mobile = isMobileUA()

  const routes: RouteRecordRaw[] = mobile
    ? (await import('./mobile')).mobileRoutes
    : (await import('./pc')).pcRoutes

  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, _from, savedPosition) {
      // 路由切换回顶 / 恢复位置 / 锚点平滑滚动（沿用旧行为）
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      return { top: 0 }
    },
  })

  setupRouterGuards(router, mobile)
  return router
}
