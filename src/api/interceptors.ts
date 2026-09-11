import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import pinia from '@/stores'
import { useUserStore } from '@/stores/useUserStore'
import { useTenantStore } from '@/stores/useTenantStore'
import { emitter } from '@/events'

/**
 * 统一拦截器：token 注入、X-Tenant-Id 注入（业务代码无感）、
 * 错误归一化、401 处理。
 *
 * 通过 useXxxStore(pinia) 在组件外使用全局唯一 Pinia 实例
 * （Pinia 官方支持的用法，无需等待 app.use(pinia)）。
 */
export function setupInterceptors(service: AxiosInstance): void {
  service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore(pinia)
    if (userStore.token) {
      config.headers.set('Authorization', `Bearer ${userStore.token}`)
    }

    // 多租户标识：所有业务请求统一注入，业务代码零感知
    const tenantStore = useTenantStore(pinia)
    config.headers.set('X-Tenant-Id', tenantStore.tenantId)

    return config
  })

  service.interceptors.response.use(
    // 成功分支直接放行（旧 request.js 中此处的 401/500 判断是死代码，已修正）
    (response) => response,
    (error: AxiosError) => Promise.reject(normalizeError(error)),
  )
}

function normalizeError(error: AxiosError): Error {
  if (error.response) {
    const { status, data } = error.response
    const businessMessage = (data as { message?: string } | undefined)?.message

    if (status === 401) {
      const userStore = useUserStore(pinia)
      userStore.reset()
      // 跨模块解耦通知：阶段 3 main.ts 订阅后 router.push 登录页（SPA 内跳转，不整页刷新）
      emitter.emit('user:logout')
      return new Error('登录已过期，请重新登录')
    }

    if (status >= 500) {
      return new Error('服务器暂时不可用，请稍后再试')
    }

    return new Error(businessMessage || `请求失败 (${status})`)
  }

  if (error.code === 'ECONNABORTED') {
    return new Error('请求超时，请稍后重试')
  }

  if (error.request) {
    return new Error('网络错误，请检查网络连接')
  }

  return new Error('请求配置错误')
}
