import type { Router } from 'vue-router'
// TODO 阶段5：登录模块迁移时切换为新 userStore，并删除旧 authStore 依赖与本类型门面
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/store/modules/app'
import { useTenantStore } from '@/store/modules/tenant'

/**
 * 路由守卫：登录校验（沿用旧语义）+ 页面标题 + 设备登记。
 */
export function setupRouterGuards(router: Router, isMobileDevice: boolean): void {
  router.beforeEach((to) => {
    // TODO 阶段5：切换为新 userStore
    const authStore = useAuthStore()
    authStore.refreshAuthStatus()

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
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
