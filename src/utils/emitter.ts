import mitt from 'mitt'

/** SignalR 推送消息信封（阶段 4 signalr/events.ts 会按 type 收窄） */
export interface SignalRMessagePayload {
  type: string
  data: unknown
  receivedAt: number
}

/** 全局事件契约：新增事件必须先在此登记类型，禁止 any */
export type Events = {
  'user:login': { userId: string }
  'user:logout': void
  'ui:loading': boolean
  'signalr:connected': void
  'signalr:disconnected': { reason?: string }
  'signalr:message': SignalRMessagePayload
}

export const emitter = mitt<Events>()

export type EventKey = keyof Events
