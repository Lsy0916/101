<!-- 沉浸式答题 · 题目卡片（AssessmentTakeView），选择后上抛 select(qid, value) -->
<script setup lang="ts">
import { Check } from '@element-plus/icons-vue'
import type { OptionItem, ScaleQuestion } from './types'

defineProps<{
  index: number
  total: number
  question?: ScaleQuestion
  options: OptionItem[]
  answer?: number | string
  categoryLabel: string
}>()

const emit = defineEmits<{
  (e: 'select', qid: number, value: number | string): void
}>()
</script>

<template>
  <div class="q-card-immersive">
    <div class="q-header">
      <div class="q-badge-row">
        <span class="q-badge">Q{{ index + 1 }}</span>
        <span class="q-category-tag">{{ categoryLabel }}</span>
        <span class="q-progress-mark">{{ index + 1 }} / {{ total }}</span>
      </div>
      <h2 class="q-text">{{ question?.text }}</h2>
    </div>

    <div class="q-options-immersive">
      <div
        v-for="(opt, idx) in options"
        :key="opt.value"
        class="opt-card"
        :class="{ selected: answer === opt.value }"
        :style="{ '--delay': idx * 0.05 + 's' }"
        @click="question && emit('select', question.id, opt.value)"
      >
        <div class="opt-content">
          <div class="opt-index">{{ String.fromCharCode(65 + idx) }}</div>
          <span class="opt-label">{{ opt.label }}</span>
        </div>
        <div class="opt-check">
          <el-icon v-if="answer === opt.value"><Check /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.q-card-immersive {
  background: #fff;
  border-radius: 24px;
  padding: 56px 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 12px 32px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.q-header {
  margin-bottom: 36px;
}

.q-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.q-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  background: #111;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.5px;
}

.q-category-tag {
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 500;
}

.q-progress-mark {
  margin-left: auto;
  font-size: 12px;
  color: #999;
  font-weight: 600;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}

.q-text {
  font-size: clamp(22px, 2.6vw, 30px);
  color: #111;
  font-weight: 700;
  line-height: 1.4;
  margin: 0;
  letter-spacing: -0.3px;
}

/* 选项 */
.q-options-immersive {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.opt-card {
  padding: 20px 24px;
  border: 1.5px solid #eee;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  animation: slide-in 0.4s ease-out backwards;
  animation-delay: var(--delay);
  position: relative;
  overflow: hidden;
}

.opt-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #111;
  transform: scaleY(0);
  transform-origin: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.opt-card.selected::before {
  transform: scaleY(1);
}

.opt-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.opt-index {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f9f9f9;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #888;
  font-size: 14px;
  transition: all 0.25s;
  flex-shrink: 0;
}

.opt-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.opt-check {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.25s;
  flex-shrink: 0;
}

.opt-card:hover {
  border-color: #111;
  transform: translateX(4px);
}

.opt-card:hover .opt-index {
  border-color: #111;
  color: #111;
}

.opt-card.selected {
  border-color: #111;
  background: #111;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.opt-card.selected .opt-label {
  color: #fff;
}

.opt-card.selected .opt-index {
  background: rgba(255, 255, 255, 0.15);
  border-color: transparent;
  color: #fff;
}

.opt-card.selected .opt-check {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.2);
}

@keyframes slide-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .q-card-immersive {
    padding: 32px 24px;
    border-radius: 20px;
  }
  .q-text { font-size: 20px; }
  .opt-card { padding: 16px 18px; border-radius: 14px; }
  .opt-label { font-size: 15px; }
}
</style>
