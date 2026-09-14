<template>
  <div class="ai-thread" :class="`is-${variant}`">
    <div ref="listRef" class="thread-messages">
      <!-- 欢迎消息 -->
      <div class="msg msg-ai">
        <div class="ai-avatar"><el-icon><Service /></el-icon></div>
        <div class="bubble">{{ greeting }}</div>
      </div>

      <!-- 会话消息 -->
      <div
        v-for="entry in entries"
        :key="entry.id"
        class="msg"
        :class="entry.role === 'user' ? 'msg-user' : 'msg-ai'"
      >
        <div v-if="entry.role === 'assistant'" class="ai-avatar"><el-icon><Service /></el-icon></div>
        <div class="bubble">
          <span class="bubble-text">{{ entry.content }}</span>
          <span v-if="entry.streaming && entry.content" class="stream-caret" />
          <span v-if="entry.streaming && !entry.content" class="typing-dots"><i /><i /><i /></span>
        </div>
      </div>

      <!-- 快捷提问（仅会话开始前展示） -->
      <div v-if="!entries.length && quickPrompts.length" class="quick-prompts">
        <button
          v-for="prompt in quickPrompts"
          :key="prompt"
          type="button"
          class="quick-btn"
          @click="emit('send', prompt)"
        >
          {{ prompt }}
        </button>
      </div>
    </div>

    <p v-if="disclaimer" class="thread-disclaimer">{{ disclaimer }}</p>

    <div class="thread-input">
      <input
        v-model="draft"
        class="thread-input-field"
        type="text"
        :placeholder="placeholder"
        :disabled="loading"
        @keydown.enter.prevent="submit"
      >
      <button
        v-if="loading"
        type="button"
        class="send-btn is-stop"
        :aria-label="stopLabel"
        :title="stopLabel"
        @click="emit('abort')"
      >
        <span class="stop-icon" />
      </button>
      <button
        v-else
        type="button"
        class="send-btn"
        :disabled="!draft.trim()"
        :aria-label="sendLabel"
        :title="sendLabel"
        @click="submit"
      >
        <el-icon><Promotion /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 【business】AiChatThread —— AI 对话线程（纯展示）
 * - 消息列表 / 流式打字气泡 / 快捷提问 / 输入行；文案全部由父级注入（i18n 解耦）
 * - 行为经 emits 上抛：send(文本)、abort(中断)；自动滚动到底部为纯 DOM 行为
 */
import { nextTick, onMounted, ref, watch } from 'vue'
import { Promotion, Service } from '@element-plus/icons-vue'
import type { AiChatEntry } from '@/composables/useAiChat'
import type { AiChatVariant } from './types'

interface Props {
  entries: AiChatEntry[]
  loading?: boolean
  /** 容器形态：fab = 悬浮面板，page = 全页对话 */
  variant?: AiChatVariant
  greeting: string
  placeholder: string
  sendLabel: string
  stopLabel: string
  quickPrompts?: string[]
  disclaimer?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  variant: 'fab',
  quickPrompts: () => [],
  disclaimer: ''
})

const emit = defineEmits<{
  send: [text: string]
  abort: []
}>()

const draft = ref('')

function submit() {
  const text = draft.value.trim()
  if (!text || props.loading) return
  emit('send', text)
  draft.value = ''
}

// ============ 自动滚动：新消息平滑滚动，流式增量即时贴底 ============
const listRef = ref<HTMLElement | null>(null)

async function scrollToBottom(smooth: boolean) {
  await nextTick()
  const el = listRef.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

watch(() => props.entries.length, () => scrollToBottom(true))
watch(
  () => props.entries.at(-1)?.content.length ?? 0,
  () => { if (props.entries.at(-1)?.streaming) scrollToBottom(false) }
)
onMounted(() => scrollToBottom(false))
</script>

<style scoped>
.ai-thread {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.thread-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  scrollbar-width: thin;
}

.msg {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.msg-user {
  flex-direction: row-reverse;
}

.ai-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: var(--brand-primary-faint);
  color: var(--brand-primary);
  font-size: 16px;
}

.bubble {
  max-width: 78%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.msg-ai .bubble {
  background: var(--brand-primary-wash);
  color: var(--ink-800);
  border: 1px solid var(--mist-200);
  border-top-left-radius: 4px;
}

.msg-user .bubble {
  background: var(--brand-primary);
  color: white;
  border-top-right-radius: 4px;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 22%, transparent);
}

/* 流式光标 */
.stream-caret {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 3px;
  vertical-align: -2px;
  background: var(--brand-primary);
  animation: caret-blink 0.9s steps(1) infinite;
}

@keyframes caret-blink {
  50% { opacity: 0; }
}

/* 等待首字的三点指示 */
.typing-dots {
  display: inline-flex;
  gap: 4px;
  padding: 4px 2px;
}

.typing-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-primary);
  opacity: 0.35;
  animation: dot-bounce 1.2s ease-in-out infinite;
}

.typing-dots i:nth-child(2) { animation-delay: 0.15s; }
.typing-dots i:nth-child(3) { animation-delay: 0.3s; }

@keyframes dot-bounce {
  30% { opacity: 1; transform: translateY(-3px); }
}

/* 快捷提问 */
.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-left: 44px;
}

.quick-btn {
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid var(--brand-primary-soft);
  background: transparent;
  color: var(--brand-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.quick-btn:hover {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: white;
}

/* 免责声明 */
.thread-disclaimer {
  margin: 0;
  padding: 6px 18px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--ink-400);
}

/* 输入行 */
.thread-input {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--mist-200);
}

.thread-input-field {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0 12px;
  border: 1px solid var(--mist-300);
  border-radius: 10px;
  background: white;
  color: var(--ink-800);
  font-size: 14px;
  outline: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.thread-input-field::placeholder { color: var(--mist-400); }

.thread-input-field:focus {
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 12%, transparent);
}

.send-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 10px;
  background: var(--brand-primary);
  color: white;
  display: grid;
  place-items: center;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn:not(:disabled):hover {
  background: var(--brand-primary-dark);
}

/* 停止按钮（生成中） */
.send-btn.is-stop {
  background: transparent;
  border: 1.5px solid var(--brand-primary);
  color: var(--brand-primary);
}

.stop-icon {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: currentcolor;
}

/* ============ page 形态：放宽呼吸感 ============ */
.is-page .thread-messages {
  padding: 28px 32px;
  gap: 20px;
}

.is-page .bubble {
  max-width: 72%;
  padding: 12px 16px;
  font-size: 14.5px;
}

.is-page .ai-avatar {
  width: 40px;
  height: 40px;
  font-size: 18px;
}

.is-page .thread-input {
  padding: 14px 24px;
}

.is-page .thread-input-field,
.is-page .send-btn {
  height: 44px;
}

.is-page .thread-input-field {
  border-radius: 12px;
}

.is-page .send-btn {
  border-radius: 12px;
  font-size: 18px;
}

.is-page .thread-disclaimer {
  padding: 8px 24px;
}

/* ============ 暗夜模式 ============ */
html.dark .msg-ai .bubble {
  background: var(--slate-800);
  color: var(--slate-100);
  border-color: var(--slate-700);
}

html.dark .thread-input-field {
  background: var(--slate-800);
  border-color: var(--slate-700);
  color: var(--slate-100);
}

html.dark .quick-btn {
  border-color: var(--slate-600);
  color: var(--brand-primary-soft);
}
</style>
