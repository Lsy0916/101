/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** REST 基础路径（开发期走 Vite 代理） */
  readonly VITE_API_BASE_URL: string
  /** 开发代理目标（仅 vite.config.ts 使用，不进业务代码） */
  readonly VITE_PROXY_TARGET?: string
  /** SignalR Hub 地址 */
  readonly VITE_SIGNALR_HUB_URL: string
  /** 单校私有部署租户 ID（留空走子域名识别） */
  readonly VITE_TENANT_ID?: string
  /** 生产主域名，子域名识别规则：{tenantId}.{VITE_APP_DOMAIN} */
  readonly VITE_APP_DOMAIN?: string
  /** 登录 mock 开关（'true' / 'false'） */
  readonly VITE_USE_MOCK_LOGIN: string
  /** AI 对话流式接口（SSE，未配置时走本地 mock 兜底） */
  readonly VITE_AI_CHAT_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
