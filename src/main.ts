import { createApp } from 'vue'
import pinia from '@/store'
import i18n from '@/locales'
import { createAppRouter } from '@/router'
import { isMobileUA } from '@/utils/device'
import { useTenantStore } from '@/store/modules/tenant'
import { emitter } from '@/utils/emitter'
// TODO 阶段5：登录模块迁移后移除旧 authStore 引用
import { useAuthStore } from '@/stores/auth'
import { revealDirective } from '@/directives/reveal'
import 'default-passive-events' // 解决 passive event listener 警告

// 全局样式（顺序即层叠优先级，后者覆盖前者）：
// 1. Element Plus 官方变量  2. 项目 EP 主题覆盖  3. 全局样式 + base + dark-mode
// 4. 品牌变量映射（最后引入，--brand-primary 派生必须赢过 element.css 的硬编码色）
import 'element-plus/dist/index.css'
import './styles/element.css'
import './assets/css/main.css'
import './styles/brand.css'

async function bootstrap(): Promise<void> {
  // 入口级设备决策（唯一一次 UA 判断，此后组件内用响应式 isMobile）
  const mobile = isMobileUA()

  // 设备分包：App 壳 / 路由表 / UI 库插件 全部动态 import，
  // PC 用户不下载 Vant 与移动路由，反之亦然
  const [{ default: App }, router, { default: setupDevicePlugins }] = await Promise.all([
    mobile ? import('./App.mobile.vue') : import('./App.pc.vue'),
    createAppRouter(),
    mobile ? import('./plugins/mobile') : import('./plugins/pc'),
  ])

  const app = createApp(App)

  // 顺序要求：pinia 最先（守卫 / 拦截器 / bootstrap 均依赖）
  app.use(pinia)
  app.use(i18n)
  setupDevicePlugins(app)
  app.use(router)
  app.directive('reveal', revealDirective)

  // 多租户引导：有缓存立即渲染；无缓存最多等 1.5s；失败静默走保底配置。
  // （拦器器据此注入 X-Tenant-Id；bootstrap 内部全链路静默降级，绝不阻塞白屏）
  await useTenantStore(pinia).bootstrap()

  // 初始化旧认证状态（TODO 阶段5：由新 userStore 接管）
  useAuthStore().refreshAuthStatus()

  // 401 统一登出：SPA 内跳登录页（补齐旧 request.js 缺失的 401 处理）
  emitter.on('user:logout', () => {
    void router.push({ name: 'login' })
  })

  // 页面关闭时按需清除敏感信息（沿用旧行为）
  window.addEventListener('beforeunload', () => {
    const authStore = useAuthStore()
    if (authStore && !authStore.rememberMe) {
      sessionStorage.clear()
    }
  })

  await router.isReady()
  app.mount('#app')
}

void bootstrap()
