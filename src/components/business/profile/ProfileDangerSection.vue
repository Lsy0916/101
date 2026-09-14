<!-- 05 危险操作区块 · 注销确认（登出与跳转由页面处理） -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Warning } from '@element-plus/icons-vue'

const emit = defineEmits<{
  (e: 'confirm-delete'): void
}>()

const { t } = useI18n()
</script>

<template>
  <section class="mag-section danger-section">
    <div class="sec-head">
      <span class="sec-num danger">!</span>
      <div class="sec-titles">
        <h2 class="sec-title">{{ t('profile.card.danger.title') }}</h2>
        <p class="sec-desc">{{ t('profile.card.danger.desc') }}</p>
      </div>
    </div>
    <div class="danger-action">
      <el-button type="danger" plain class="danger-btn" @click="emit('confirm-delete')">
        <el-icon><Warning /></el-icon>
        {{ t('profile.card.danger.deleteBtn') }}
      </el-button>
    </div>
  </section>
</template>

<style scoped>
/* ============ 杂志区块通用 ============ */
.mag-section {
  border-top: 1px solid #e5e7eb;
  padding: 48px 0 40px;
}

.mag-section:last-child {
  border-bottom: 1px solid #e5e7eb;
}

.sec-head {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 28px;
  align-items: start;
  margin-bottom: 36px;
}

.sec-num {
  font-size: 28px;
  font-weight: 700;
  font-style: italic;
  color: var(--brand-primary);
  line-height: 1;
  padding-top: 2px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.sec-num.danger {
  color: #ef4444;
}

.sec-titles {
  min-width: 0;
}

.sec-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  letter-spacing: -0.3px;
  font-family: Georgia, 'Times New Roman', 'Songti SC', 'STSong', serif;
}

.sec-desc {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  max-width: 540px;
}

/* ============ 危险区 ============ */
.danger-section {
  border-top-color: #fecaca;
}

.danger-section .sec-title {
  color: #b91c1c;
}

.danger-action {
  display: flex;
  justify-content: flex-start;
}

.danger-btn {
  border-radius: 0;
  font-weight: 600;
  padding: 10px 24px;
}

@media (max-width: 768px) {
  .mag-section {
    padding: 36px 0 28px;
  }
  .sec-head {
    grid-template-columns: auto 1fr;
    gap: 16px;
    margin-bottom: 26px;
  }
  .sec-title {
    font-size: 22px;
  }
  .sec-num {
    font-size: 24px;
  }
  .danger-action .el-button {
    width: 100%;
  }
}
</style>
