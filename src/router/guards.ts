import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { useAppStore } from '@/stores/useAppStore'
import { useTenantStore } from '@/stores/useTenantStore'

/**
 * 路由守卫：登录校验（沿用旧语义）+ 页面标题 + 设备登记。
 * 认证态来自持久化 userStore（persistedstate 自动恢复，无需手动 refresh）。
 */
export function setupRouterGuards(router: Router, isMobileDevice: boolean): void {
  router.beforeEach((to) => {
    const userStore = useUserStore()

    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      return { name: 'login' } // 与旧守卫行为一致（不带 redirect 回跳）
    }
  })

  router.afterEach((to) => {
    // 标题：租户品牌名兜底，meta.title 为字面量前缀
    const brandName = useTenantStore().config.brand.name
    document.title = to.meta.title ? `${to.meta.title} · ${brandName}` : brandName

    // 设备类型写入全局 store（与入口分流结果一致）
    useAppStore().setDevice(isMobileDevice ? 'mobile' : 'pc')
  })
}
