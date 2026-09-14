import { onScopeDispose, ref } from 'vue'
import { streamAiChat } from '@/api/ai'
import type { AiChatMessage, AiChatPersona } from '@/api/ai'

/** 会话中的一条消息（含流式生成中的状态） */
export interface AiChatEntry {
  id: number
  role: AiChatMessage['role']
  content: string
  /** 是否正在流式生成（气泡展示打字指示） */
  streaming: boolean
}

/**
 * AI 对话会话状态（流式 + 可中断）。
 * 会话不持久化（隐私优先），组件卸载即销毁。
 */
export function useAiChat(persona: AiChatPersona = 'assistant') {
  const messages = ref<AiChatEntry[]>([])
  const isSending = ref(false)
  let nextId = 0
  let controller: AbortController | null = null

  /** 发送一条用户消息并接收流式回复（发送期间忽略新提交） */
  async function send(content: string): Promise<void> {
    const text = content.trim()
    if (!text || isSending.value) return
    messages.value.push({ id: ++nextId, role: 'user', content: text, streaming: false })
    const reply: AiChatEntry = { id: ++nextId, role: 'assistant', content: '', streaming: true }
    messages.value.push(reply)

    isSending.value = true
    controller = new AbortController()
    // 历史不含空占位回复
    const history: AiChatMessage[] = messages.value
      .filter(m => m !== reply)
      .map(({ role, content: c }) => ({ role, content: c }))
    try {
      const full = await streamAiChat(history, {
        persona,
        signal: controller.signal,
        onDelta: chunk => { reply.content += chunk }
      })
      reply.content = full
    } catch (error) {
      // 主动中断：保留已生成内容；其余异常给出降级提示
      if (controller.signal.aborted) return
      reply.content = reply.content || '抱歉，我刚刚走神了，请再试一次。'
      console.warn('[ai] 会话异常', error)
    } finally {
      reply.streaming = false
      isSending.value = false
      controller = null
    }
  }

  /** 中断当前生成（保留已生成内容） */
  function abort(): void {
    controller?.abort()
    controller = null
  }

  /** 清空会话（重新开始） */
  function reset(): void {
    abort()
    messages.value = []
  }

  onScopeDispose(abort)

  return { messages, isSending, send, abort, reset }
}
