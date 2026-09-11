import { useRequest } from 'vue-request'
import pinia from '@/store'
import { useUserStore } from '@/store/modules/user'
import { emitter } from '@/utils/emitter'
import { stop } from '@/server/signalr/connection'
import * as authApi from '@/server/modules/auth'
import type { LoginParams, LoginResult, SendEmailCodeParams, UserInfo } from '@/server/modules/types'
import { mockForgotPassword, mockLogin, mockRegister } from '@/server/mock/auth'

/**
 * 认证 composables：server 层与组件之间的 vue-request 桥接。
 *
 * - mock 开关（Q1）：VITE_USE_MOCK_LOGIN==='true' 走 mock 分支（复刻旧
 *   stores/auth.js 行为），否则走真实接口；组件层无感，切后端只改环境变量
 * - 成功后统一写【新】userStore（persisted）并广播 user:login
 * - 组件内用法：const { run, loading, error } = useAuthLogin()
 */

const USE_MOCK = import.meta.env.VITE_USE_MOCK_LOGIN === 'true'

/** 登录服务（mock/真实自动切换） */
function loginService(params: LoginParams): Promise<LoginResult> {
  return USE_MOCK ? mockLogin(params) : authApi.login(params)
}

/** 登录成功：写 store + 广播 + 建立实时连接 */
function applyLoginSuccess(result: LoginResult): LoginResult {
  const userStore = useUserStore(pinia)
  userStore.setToken(result.token)
  userStore.setProfile({
    id: result.userInfo.userId ?? '',
    name: result.userInfo.name ?? '',
    avatar: result.userInfo.avatar,
    roleId: result.roleId,
  })
  emitter.emit('user:login', { userId: result.userInfo.userId ?? '' })
  // 实时通道随登录建立（失败静默，connection.ts 内部已降级）
  void import('@/server/signalr/connection').then(({ start }) => start())
  return result
}

/** 登录（manual useRequest：由表单触发） */
export function useAuthLogin() {
  const { run, loading, error, data } = useRequest(loginService, {
    manual: true,
    onSuccess: applyLoginSuccess,
  })

  return { run, loading, error, result: data }
}

/**
 * 注册 / 忘记密码：真实后端契约未提供（Q1），
 * 真实分支当前抛出明确错误，后端就绪后替换为对应 API。
 */
async function registerService(data: Record<string, unknown>): Promise<{ message: string }> {
  if (USE_MOCK) return mockRegister(data)
  throw new Error('注册接口后端契约未提供（阶段5 接入）')
}

async function forgotPasswordService(data: Record<string, unknown>): Promise<{ message: string }> {
  if (USE_MOCK) return mockForgotPassword(data)
  throw new Error('忘记密码接口后端契约未提供（阶段5 接入）')
}

export function useRegister() {
  return useRequest(registerService, { manual: true })
}

export function useForgotPassword() {
  return useRequest(forgotPasswordService, { manual: true })
}

/** 发送邮箱验证码（无状态动作，直接调 server 层） */
export function sendEmailCode(params: SendEmailCodeParams): Promise<void> {
  return authApi.sendEmailCode(params)
}

/**
 * 登出：清新 store + 清旧 localStorage key（阶段 5 迁移完成后旧 key 清理移除）+
 * 停实时连接 + 广播（main.ts 订阅后跳登录页）。
 */
export function logout(): void {
  useUserStore(pinia).reset()
  // 旧 store 的 localStorage key，未迁移视图仍在读，登出时一并清掉保证状态一致
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  localStorage.removeItem('authStatus')
  void stop()
  emitter.emit('user:logout')
}

/** 按学号查询用户信息（非请求态场景的直连示例） */
export function fetchUserInfoById(userId: string, roleId: string): Promise<UserInfo> {
  return authApi.getUserInfoById(userId, roleId)
}
