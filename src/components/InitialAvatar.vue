<template>
  <div
    class="initial-avatar"
    :style="avatarStyle"
    :class="{ 'is-anonymous': isAnonymous }"
  >
    <span v-if="isAnonymous" class="anon-icon">?</span>
    <span v-else>{{ initial }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: { type: String, default: '' },
  size: { type: Number, default: 44 },
  isAnonymous: { type: Boolean, default: false }
})

const colors = [
  '#0052d9', '#1890ff', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#ef4444'
]

const initial = computed(() => {
  if (!props.name) return '?'
  return props.name.charAt(0).toUpperCase()
})

const bgColor = computed(() => {
  if (props.isAnonymous) return '#9ca3af'
  const hash = props.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return colors[hash % colors.length]
})

const avatarStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
  background: bgColor.value,
  fontSize: Math.max(12, props.size * 0.42) + 'px'
}))
</script>

<style scoped>
.initial-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  letter-spacing: 0;
  flex-shrink: 0;
  user-select: none;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

.anon-icon {
  font-size: 1.2em;
  font-weight: 900;
}
</style>
