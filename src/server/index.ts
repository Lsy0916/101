/**
 * server 层统一出口：业务代码只从 '@/server' 导入。
 */
export { default as http } from './http'

// ---- 业务 modules ----
export * as authApi from './modules/auth'
export * as userApi from './modules/user'
export * as adminApi from './modules/admin'
export * as scheduleApi from './modules/schedule'
export * as labApi from './modules/lab'
export * as reservationApi from './modules/reservation'
export * from './modules/types'

// ---- SignalR ----
export { useSignalR } from './signalr'
export type {
  NotificationPayload,
  ForceLogoutPayload,
  RealtimeEnvelope,
  ServerEventMap,
  ServerEventName,
  ClientInvokeMap,
} from './signalr/events'
