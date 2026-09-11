<template>
  <span ref="el" class="animated-counter">
    <span v-if="prefix" class="counter-prefix">{{ prefix }}</span>
    <span class="counter-num">{{ display }}</span>
    <span v-if="suffix" class="counter-suffix">{{ suffix }}</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    target?: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
  }>(),
  {
    target: 0,
    duration: 1800,
    prefix: '',
    suffix: '',
    decimals: 0,
  },
)

const el = ref<HTMLElement | null>(null)
const current = ref(0)
const started = ref(false)

const display = ref(formatNum(0))

function formatNum(n: number): string {
  return n.toLocaleString('zh-CN', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals,
  })
}

function animate() {
  const start = performance.now()
  const from = 0
  const to = props.target
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  const step = (now: number) => {
    const elapsed = now - start
    const t = Math.min(elapsed / props.duration, 1)
    const val = from + (to - from) * ease(t)
    current.value = val
    display.value = formatNum(val)
    if (t < 1) {
      requestAnimationFrame(step)
    } else {
      display.value = formatNum(to)
    }
  }
  requestAnimationFrame(step)
}

let observer: IntersectionObserver | null = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.value) {
          started.value = true
          animate()
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.4 }
  )
  if (el.value) observer.observe(el.value)
})

onUnmounted(() => {
  if (observer && el.value) observer.unobserve(el.value)
})
</script>

<style scoped>
.animated-counter {
  display: inline-flex;
  align-items: baseline;
  font-variant-numeric: tabular-nums;
}

.counter-num {
  font-weight: inherit;
  letter-spacing: inherit;
}

.counter-prefix,
.counter-suffix {
  font-size: 0.5em;
  font-weight: 600;
  opacity: 0.5;
  margin: 0 0.1em;
}
</style>
