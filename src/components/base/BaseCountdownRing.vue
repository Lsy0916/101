<template>
  <div class="countdown-ring" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="ring-svg">
      <!-- 背景轨道 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        :stroke-width="strokeWidth"
      />
      <!-- 进度环 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        class="ring-progress"
        :style="{ transform: 'rotate(-90deg)', transformOrigin: 'center' }"
      />
    </svg>
    <div class="ring-center">
      <span class="ring-num">{{ days }}</span>
      <span class="ring-unit">{{ unit }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 【base】BaseCountdownRing —— 倒计时进度环
 * - props：days 剩余天数 / total 周期天数 / unit 中心文案（由调用方传入，base 不内置业务文案）
 * - 颜色经 props 注入，默认中性色，不感知品牌与业务
 */
import { computed, ref, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    days?: number
    total?: number
    size?: number
    strokeWidth?: number
    progressColor?: string
    trackColor?: string
    unit?: string
  }>(),
  {
    days: 0,
    total: 365,
    size: 140,
    strokeWidth: 4,
    progressColor: '#000',
    trackColor: '#e5e7eb',
    unit: '',
  },
)

const radius = computed(() => (props.size - props.strokeWidth) / 2 - 2)
const circumference = computed(() => 2 * Math.PI * radius.value)

const animatedOffset = ref(0)
const dashOffset = computed(() => animatedOffset.value)

onMounted(() => {
  const progress = Math.max(0, Math.min(1, 1 - props.days / props.total))
  const targetOffset = circumference.value * (1 - progress)
  requestAnimationFrame(() => {
    animatedOffset.value = targetOffset
  })
})
</script>

<style scoped>
.countdown-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
  inset: 0;
}

.ring-progress {
  transition: stroke-dashoffset 1.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.ring-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
  z-index: 1;
}

.ring-num {
  font-size: 2.4em;
  font-weight: 800;
  color: #000;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.ring-unit {
  font-size: 0.7em;
  color: #9ca3af;
  letter-spacing: 1px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
