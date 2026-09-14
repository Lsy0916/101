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

/* ============ 悬浮按钮 ============ */
.fab-button {
  position: relative;
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: var(--brand-primary);
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 6px 20px color-mix(in srgb, var(--brand-primary) 35%, transparent);
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fab-button:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 28px color-mix(in srgb, var(--brand-primary) 45%, transparent);
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

/* ============ 对话面板 ============ */
.fab-panel {
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 560px;
  max-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 20px;
  background: white;
  border: 1px solid var(--mist-200);
  box-shadow: 0 24px 64px color-mix(in srgb, var(--navy-950) 16%, transparent);
  transform-origin: bottom right;
}

.fab-panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-deep));
  color: white;
  flex-shrink: 0;
}

.header-avatar {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 20px;
  background: color-mix(in srgb, white 18%, transparent);
}

.header-text {
  flex: 1;
  min-width: 0;
}

.header-text h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.header-text p {
  margin: 0;
  font-size: 11px;
  opacity: 0.8;
  line-height: 1.4;
}

.header-action {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: white;
  display: grid;
  place-items: center;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.25s ease;
}

.header-action:hover:not(:disabled) {
  background: color-mix(in srgb, white 20%, transparent);
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

/* ============ 暗夜模式 ============ */
html.dark .fab-panel {
  background: var(--slate-900);
  border-color: var(--slate-700);
}

html.dark .fab-badge {
  box-shadow: 0 0 0 2px var(--slate-900);
}
</style>
