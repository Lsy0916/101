<template>
  <div class="ai-companion-page">
    <ModuleCover
      :eyebrow="$t('counseling.companion.eyebrow')"
      no="No.06"
      :title="$t('counseling.companion.title')"
      :desc="$t('counseling.companion.desc')"
    />

    <section class="companion-card">
      <AiChatThread
        :entries="messages"
        :loading="isSending"
        variant="page"
        :greeting="$t('counseling.companion.greeting')"
        :placeholder="$t('counseling.companion.placeholder')"
        :send-label="$t('counseling.companion.send')"
        :stop-label="$t('counseling.companion.stop')"
        :quick-prompts="quickPrompts"
        :disclaimer="$t('counseling.companion.disclaimer')"
        @send="send"
        @abort="abort"
      />
    </section>

    <p class="companion-footnote">
      {{ $t('counseling.companion.footnote') }}
      <RouterLink class="footnote-link" :to="{ name: 'counseling' }">
        {{ $t('counseling.companion.bookLink') }}
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * AI 伴侣（页面层）：counseling 模块子页，全页日常陪伴对话。
 * 与 AI 咨询师并存：伴侣偏日常倾听与轻松陪伴，咨询师偏专业心理支持。
 * AI 回复为算法生成，仅供情绪陪伴——页面需明确免责与专业求助引导。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ModuleCover from '@/components/business/common/ModuleCover.vue'
import AiChatThread from '@/components/business/ai/AiChatThread.vue'
import { useAiChat } from '@/composables/useAiChat'

const { tm } = useI18n()
const { messages, isSending, send, abort } = useAiChat('companion')

// 快捷提问数组来自 i18n（tm 取原始消息数组）
const quickPrompts = computed(() => tm('counseling.companion.quickPrompts') as string[])
</script>

<style scoped>
.ai-companion-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px 96px;
  color: var(--ink-800);
}

.companion-card {
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

.companion-footnote {
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
  .ai-companion-page { padding: 24px 32px 80px; }
}

@media (width <= 900px) {
  .ai-companion-page { padding: 20px 24px 64px; }

  .companion-card {
    height: calc(100vh - 320px);
    min-height: 460px;
  }
}

/* ============ 暗夜模式 ============ */
html.dark .companion-card {
  background: var(--slate-900);
  border-color: var(--slate-700);
}

html.dark .companion-footnote {
  color: var(--slate-400);
}
</style>
