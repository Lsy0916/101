import { onScopeDispose } from 'vue'
import { storeToRefs } from 'pinia'
import pinia from '@/stores'
import { useRealtimeStore } from '@/stores/useRealtimeStore'
import { emitter } from '@/events'
import type { Events } from '@/events'
import * as conn from './connection'
import type { ServerEventMap, ServerEventName } from './events'

/**
 * useSignalR：组件消费实时通道的唯一入口。
 *
 * - 状态：来自 realtime store（响应式）
 * - on()：在 setup 中调用时自动随组件卸载解除监听
 * - start()/stop()：页面组级控制（如登录后 start、登出时 stop）
 *
 * 推送数据的两种消费方式：
 * 1. emitter.on('signalr:message', envelope => ...) —— 一次性 UI 反应（toast 等）
 * 2. realtime store 的 lastMessage / unreadCount —— 持久展示
 */
export function useSignalR() {
  const realtime = useRealtimeStore(pinia)
  const { status, reconnectAttempts, lastMessage, unreadCount } = storeToRefs(realtime)

  /**
   * 订阅服务端推送事件。
   * @returns 取消订阅函数（setup 中调用时组件卸载自动执行）
   */
  function on<K extends ServerEventName>(
    event: K,
    handler: (data: ServerEventMap[K]) => void,
  ): () => void {
    const wrapped = (envelope: Events['signalr:message']) => {
      if (envelope.type === event) handler(envelope.data as ServerEventMap[K])
    }
    emitter.on('signalr:message', wrapped)

    const dispose = () => emitter.off('signalr:message', wrapped)
    // 在组件 setup 作用域内调用时自动清理（组件外调用则由调用方自行管理）
    try {
      onScopeDispose(dispose)
    } catch {
      /* 非组件作用域：无 onScopeDispose，忽略 */
    }
    return dispose
  }

  return {
    status,
    reconnectAttempts,
    lastMessage,
    unreadCount,
    start: conn.start,
    stop: conn.stop,
    invoke: conn.invoke,
    on,
  }
}

export type { RealtimeEnvelope, ServerEventMap, ServerEventName } from './events'
