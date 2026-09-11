import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SignalRMessagePayload } from '@/events'

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'reconnecting'

/**
 * 实时连接 store：只存连接状态与运行时数据，连接本身由
 * server/signalr/connection.ts（阶段 4）管理。
 * 刻意不持久化 —— 运行时状态不属于 localStorage。
 */
export const useRealtimeStore = defineStore('realtime', () => {
  const status = ref<ConnectionState>('disconnected')
  const reconnectAttempts = ref(0)
  const lastMessage = ref<SignalRMessagePayload | null>(null)
  const unreadCount = ref(0)

  function setStatus(value: ConnectionState): void {
    status.value = value
  }

  function recordReconnect(): void {
    reconnectAttempts.value += 1
  }

  function resetReconnect(): void {
    reconnectAttempts.value = 0
  }

  function touchMessage(payload: SignalRMessagePayload): void {
    lastMessage.value = payload
  }

  function increaseUnread(): void {
    unreadCount.value += 1
  }

  function clearUnread(): void {
    unreadCount.value = 0
  }

  return {
    status,
    reconnectAttempts,
    lastMessage,
    unreadCount,
    setStatus,
    recordReconnect,
    resetReconnect,
    touchMessage,
    increaseUnread,
    clearUnread,
  }
})
