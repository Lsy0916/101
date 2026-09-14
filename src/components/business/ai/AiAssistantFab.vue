<template>
  <Teleport to="body">
    <div class="ai-assistant-fab">
      <Transition name="fab-pop">
        <section v-if="open" class="fab-panel" role="dialog" :aria-label="t('home.aiAssistant.title')">
          <header class="fab-panel-header">
            <div class="header-avatar"><el-icon><Service /></el-icon></div>
            <div class="header-text">
              <h3>{{ t('home.aiAssistant.title') }}</h3>
              <p>{{ t('home.aiAssistant.subtitle') }}</p>
            </div>
            <button
              type="button"
              class="header-action"
              :title="t('home.aiAssistant.restart')"
              :disabled="isSending"
              @click="reset"
            >
              <el-icon><RefreshLeft /></el-icon>
            </button>
            <button type="button" class="header-action" :title="t('common.close')" @click="close">
              <el-icon><Close /></el-icon>
            </button>
          </header>

          <AiChatThread
            :entries="messages"
            :loading="isSending"
            variant="fab"
            :greeting="t('home.aiAssistant.greeting')"
            :placeholder="t('home.aiAssistant.placeholder')"
            :send-label="t('home.aiAssistant.send')"
            :stop-label="t('home.aiAssistant.stop')"
            :quick-prompts="quickPrompts"
            :disclaimer="t('home.aiAssistant.disclaimer')"
            @send="send"
            @abort="abort"
          />
        </section>
      </Transition>

      <button type="button" class="fab-button" :aria-label="t('home.aiAssistant.fab')" @click="toggle">
        <Transition name="fab-icon" mode="out-in">
          <el-icon v-if="open" key="close" class="fab-icon"><Close /></el-icon>
          <el-icon v-else key="chat" class="fab-icon"><ChatDotRound /></el-icon>
        </Transition>
        <span v-if="!open" class="fab-badge" />
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 【business】AiAssistantFab —— AI 客服悬浮窗（自治组件）
 * - 内部自持 useAiChat(assistant) 会话；Teleport 到 body 避免祖先 transform 影响 fixed 定位
 * - 挂载即用：<AiAssistantFab />；右下角按钮，展开为对话面板（避让同位 BackTop：bottom 104px）
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChatDotRound, Close, RefreshLeft, Service } from '@element-plus/icons-vue'
import AiChatThread from './AiChatThread.vue'
import { useAiChat } from '@/composables/useAiChat'

const { t, tm } = useI18n()
const { messages, isSending, send, abort, reset } = useAiChat('assistant')

const open = ref(false)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

// 快捷提问数组来自 i18n（tm 取原始消息数组）
const quickPrompts = computed(() => tm('home.aiAssistant.quickPrompts') as string[])
</script>

<style scoped>
.ai-assistant-fab {
  position: fixed;
  right: 40px;
  bottom: 104px;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
}

/* ============ 悬浮按钮（品牌色印刷风） ============ */
.fab-button {
  position: relative;
  width: 56px;
  height: 56px;
  border: 1px solid var(--brand-primary);
  border-radius: 50%;
  background: var(--brand-primary);
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 4px 4px 0 color-mix(in srgb, var(--brand-primary) 22%, transparent);
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fab-button:hover {
  transform: translateY(-3px);
  background: var(--brand-primary-dark);
  box-shadow: 6px 7px 0 color-mix(in srgb, var(--brand-primary) 28%, transparent);
}

.fab-icon {
  font-size: 24px;
}

.fab-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--warning-500, var(--brand-primary));
  box-shadow: 0 0 0 2px white;
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  50% { transform: scale(1.25); opacity: 0.75; }
}

/* ============ 对话面板（品牌纸面 + 硬边框 + 印刷投影） ============ */
.fab-panel {
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 560px;
  max-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
  background: var(--brand-primary-wash);
  border: 1px solid var(--brand-primary);
  box-shadow:
    10px 10px 0 color-mix(in srgb, var(--brand-primary) 10%, transparent),
    0 24px 56px color-mix(in srgb, var(--navy-950) 14%, transparent);
  transform-origin: bottom right;
}

/* 刊头：纸面底 + 品牌双细线（报头式分隔） */
.fab-panel-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 14px;
  background: transparent;
  border-bottom: 1px solid var(--brand-primary);
  flex-shrink: 0;
}

.fab-panel-header::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 4px;
  height: 1px;
  background: color-mix(in srgb, var(--brand-primary) 32%, transparent);
  pointer-events: none;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 20px;
  background: var(--brand-primary);
  color: white;
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-text h3 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', 'Songti SC', 'Noto Serif SC', SimSun, serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.05em;
  line-height: 1.3;
  color: var(--brand-primary-deep);
}

.header-text p {
  margin: 2px 0 0;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--brand-primary);
  line-height: 1.4;
}

.header-action {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--brand-primary-deep);
  display: grid;
  place-items: center;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;
}

.header-action:hover:not(:disabled) {
  background: var(--brand-primary-faint);
  color: var(--brand-primary);
}

.header-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ============ 过渡动画 ============ */
.fab-pop-enter-active,
.fab-pop-leave-active {
  transition: all 0.32s cubic-bezier(0.23, 1, 0.32, 1);
}

.fab-pop-enter-from,
.fab-pop-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.92);
}

.fab-icon-enter-active,
.fab-icon-leave-active {
  transition: all 0.18s ease;
}

.fab-icon-enter-from,
.fab-icon-leave-to {
  opacity: 0;
  transform: rotate(-45deg) scale(0.6);
}

/* ============ 暗夜模式（品牌色不变，底色翻转） ============ */
html.dark .fab-panel {
  background: var(--slate-900);
  border-color: var(--brand-primary);
  box-shadow:
    10px 10px 0 color-mix(in srgb, black 32%, transparent),
    0 24px 56px color-mix(in srgb, black 40%, transparent);
}

html.dark .fab-panel-header {
  border-bottom-color: var(--brand-primary);
}

html.dark .fab-panel-header::after {
  background: color-mix(in srgb, var(--brand-primary) 45%, transparent);
}

html.dark .header-text h3 {
  color: var(--brand-primary-soft);
}

html.dark .header-text p {
  color: var(--brand-primary-soft);
}

html.dark .header-action {
  color: var(--brand-primary-soft);
}

html.dark .header-action:hover:not(:disabled) {
  background: color-mix(in srgb, var(--brand-primary) 25%, transparent);
  color: white;
}

html.dark .fab-button {
  box-shadow: 4px 4px 0 color-mix(in srgb, black 40%, transparent);
}

html.dark .fab-button:hover {
  box-shadow: 6px 7px 0 color-mix(in srgb, black 48%, transparent);
}

html.dark .fab-badge {
  box-shadow: 0 0 0 2px var(--slate-900);
}
</style>
