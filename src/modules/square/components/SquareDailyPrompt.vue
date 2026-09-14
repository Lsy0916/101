<!-- 广场列表页 · 今日话题卡 -->
<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'join'): void
}>()
</script>

<template>
  <section class="daily-prompt-section">
    <div class="daily-prompt-card">
      <div class="prompt-left">
        <span class="prompt-label">{{ $t('square.list.community.dailyPrompt.label') }}</span>
        <p class="prompt-question">{{ $t('square.list.community.dailyPrompt.question') }}</p>
        <button class="prompt-join" @click="emit('join')">
          <span>{{ $t('square.list.community.dailyPrompt.join') }}</span>
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
      <div class="prompt-deco">“</div>
    </div>
  </section>
</template>

<style scoped>
/* ===== 今日话题 ===== */
.daily-prompt-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 56px;
  position: relative;
  z-index: 1;
}

.daily-prompt-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 36px;
  background: linear-gradient(120deg, var(--brand-primary) 0%, var(--color-info) 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.prompt-left {
  flex: 1;
  min-width: 0;
}

.prompt-label {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 2px;
  color: color-mix(in srgb, white 70%, transparent);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding: 3px 10px;
  background: color-mix(in srgb, white 15%, transparent);
  border-radius: 4px;
}

.prompt-question {
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
  color: white;
  margin: 0 0 14px;
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.prompt-join {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: color-mix(in srgb, white 18%, transparent);
  border: 1px solid color-mix(in srgb, white 30%, transparent);
  color: white;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  backdrop-filter: blur(4px);
}

.prompt-join:hover {
  background: color-mix(in srgb, white 28%, transparent);
  transform: translateX(4px);
}

.prompt-join .el-icon {
  font-size: 12px;
}

.prompt-deco {
  font-size: 120px;
  font-weight: 900;
  color: color-mix(in srgb, white 12%, transparent);
  line-height: 0.7;
  font-family: Georgia, serif;
  flex-shrink: 0;
}

@media (width <= 992px) {
  .daily-prompt-section {
    padding-left: 32px;
    padding-right: 32px;
  }

  .prompt-deco {
    display: none;
  }
}

@media (width <= 768px) {
  .daily-prompt-section {
    padding: 0 20px;
  }

  .daily-prompt-card {
    padding: 20px 22px;
    border-radius: 16px;
  }
}
</style>
