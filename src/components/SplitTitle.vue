<template>
  <component :is="tag" ref="el" class="split-title" :class="{ 'is-split': ready }">
    <template v-if="!ready"><slot /></template>
    <template v-else>
      <span
        v-for="(ch, i) in chars"
        :key="i"
        class="split-char"
        :style="{ transitionDelay: i * stagger + 'ms' }"
        :class="{ 'is-space': ch === ' ' }"
      >{{ ch === ' ' ? '\u00A0' : ch }}</span>
    </template>
  </component>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  tag: { type: String, default: 'h1' },
  stagger: { type: Number, default: 40 },
})

const el = ref(null)
const ready = ref(false)
const chars = computed(() => Array.from(props.text))

let observer
onMounted(() => {
  ready.value = true
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const spans = entry.target.querySelectorAll('.split-char')
          spans.forEach((s) => s.classList.add('is-in'))
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.3 }
  )
  if (el.value) observer.observe(el.value)

  // Fallback: 如果 IntersectionObserver 未在 1.2s 内触发，强制显示
  setTimeout(() => {
    if (el.value) {
      const spans = el.value.querySelectorAll('.split-char')
      spans.forEach((s) => s.classList.add('is-in'))
    }
  }, 1200)
})

onUnmounted(() => {
  if (observer && el.value) observer.unobserve(el.value)
})
</script>

<style scoped>
.split-char.is-space {
  white-space: pre;
}
</style>
