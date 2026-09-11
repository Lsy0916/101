import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { TenantConfig, TenantFeatures } from '@/config/tenant/types'
import { getDefaultConfig, mergeTenantConfig } from '@/config/tenant/default'
import { resolveTenantId } from '@/config/tenant/resolve'
import { bootstrapTenantConfig, refreshTenantConfig } from '@/config/tenant/loader'

/** localStorage 品牌色缓存 key（index.html 防闪烁脚本读取） */
export const BRAND_PRIMARY_CACHE_KEY = 'tenant:brand-primary'

/**
 * 租户 store：持有租户 ID 与配置，负责把配置应用到 DOM。
 * 缓存策略由 config/tenant/loader.ts 管理（key 按租户隔离），
 * store 本身不持久化 —— 每次启动重新走 bootstrap（缓存优先）。
 */
export const useTenantStore = defineStore('tenant', () => {
  const tenantId = ref(resolveTenantId())
  const config = ref<TenantConfig>(getDefaultConfig())
  /** 本次启动配置来源：true = localStorage 缓存（已触发后台刷新） */
  const fromCache = ref(false)
  /** bootstrap 是否已完成（无论成败） */
  const loaded = ref(false)

  /**
   * 启动引导：main.ts（阶段 3）在 mount 前调用。
   * 内部全链路静默降级，任何异常都以保底配置收场，绝不白屏。
   */
  async function bootstrap(): Promise<void> {
    try {
      const result = await bootstrapTenantConfig(tenantId.value)
      config.value = result.config
      fromCache.value = result.fromCache
      applyConfig(result.config)

      // 有缓存 → 已用缓存渲染，后台静默刷新成功则热更新（用户无感）
      if (result.fromCache) {
        void refreshTenantConfig(tenantId.value)
          .then((fresh) => {
            if (fresh) {
              config.value = fresh
              applyConfig(fresh)
            }
          })
          .catch(() => {
            /* 刷新失败保留缓存配置 */
          })
      }
    } catch {
      // 防御性兜底：理论上 bootstrapTenantConfig 不会抛
      config.value = mergeTenantConfig(null, tenantId.value)
      applyConfig(config.value)
    } finally {
      loaded.value = true
    }
  }

  /** 把配置应用到全局：CSS 变量 / 标题 / favicon / 品牌色缓存 */
  function applyConfig(c: TenantConfig): void {
    try {
      const root = document.documentElement
      root.style.setProperty('--brand-primary', c.theme.primaryColor)
      if (c.theme.radius) root.style.setProperty('--brand-radius', c.theme.radius)
      if (c.theme.fontFamily) root.style.setProperty('--brand-font-family', c.theme.fontFamily)

      document.title = c.brand.name

      if (c.brand.favicon) {
        let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']")
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = c.brand.favicon
      }

      // 写入品牌色缓存，供下次加载 index.html 内联脚本防闪烁
      localStorage.setItem(BRAND_PRIMARY_CACHE_KEY, c.theme.primaryColor)
    } catch {
      /* DOM/localStorage 异常不影响应用运行 */
    }
  }

  /** 功能开关查询（路由表按需过滤、菜单渲染使用） */
  function isFeatureEnabled(key: keyof TenantFeatures): boolean {
    return config.value.features[key]
  }

  return { tenantId, config, fromCache, loaded, bootstrap, isFeatureEnabled }
})
