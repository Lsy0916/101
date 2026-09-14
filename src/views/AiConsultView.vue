<template>
  <div class="ai-consult-page">
    <ModuleCover
      :eyebrow="$t('counseling.aiChat.eyebrow')"
      no="No.05"
      :title="$t('counseling.aiChat.title')"
      :desc="$t('counseling.aiChat.desc')"
    />

    <section class="consult-card">
      <AiChatThread
        :entries="messages"
        :loading="isSending"
        variant="page"
        :greeting="$t('counseling.aiChat.greeting')"
        :placeholder="$t('counseling.aiChat.placeholder')"
        :send-label="$t('counseling.aiChat.send')"
        :stop-label="$t('counseling.aiChat.stop')"
        :quick-prompts="quickPrompts"
        :disclaimer="$t('counseling.aiChat.disclaimer')"
        @send="send"
        @abort="abort"
      />
    </section>

    <p class="consult-footnote">
      {{ $t('counseling.aiChat.footnote') }}
      <RouterLink class="footnote-link" :to="{ name: 'counseling' }">
        {{ $t('counseling.aiChat.bookLink') }}
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * AI 咨询师（页面层）：counseling 模块子页，全页对话。
 * AI 回复为算法生成，仅供情绪陪伴与自我探索参考——页面需明确免责与专业求助引导。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ModuleCover from '@/components/business/common/ModuleCover.vue'
import AiChatThread from '@/components/business/ai/AiChatThread.vue'
import { useAiChat } from '@/composables/useAiChat'

const { tm } = useI18n()
const { messages, isSending, send, abort } = useAiChat('counselor')

// 快捷提问数组来自 i18n（tm 取原始消息数组）
const quickPrompts = computed(() => tm('counseling.aiChat.quickPrompts') as string[])
</script>

<style scoped>
.ai-consult-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px 96px;
  color: var(--ink-800);
}

.consult-card {
  height: calc(100vh - 400px);
  min-height: 520px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: white;
  border: 1px solid var(--mist-200);
  border-radius: 24px;
  box-shadow: 0 16px 48px color-mix(in srgb, var(--navy-950) 8%, transparent);
}

.consult-footnote {
  margin: 16px 4px 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--ink-400);
}

.footnote-link {
  margin-left: 6px;
  color: var(--brand-primary);
  font-weight: 600;
  text-decoration: none;
}

.footnote-link:hover { text-decoration: underline; }

@media (width <= 1200px) {
  .ai-consult-page { padding: 24px 32px 80px; }
}

@media (width <= 900px) {
  .ai-consult-page { padding: 20px 24px 64px; }

  .consult-card {
    height: calc(100vh - 320px);
    min-height: 460px;
  }
}

/* ============ 暗夜模式 ============ */
html.dark .consult-card {
  background: var(--slate-900);
  border-color: var(--slate-700);
}

html.dark .consult-footnote {
  color: var(--slate-400);
}
</style>
