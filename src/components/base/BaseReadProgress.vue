<template>
  <div class="read-progress" :style="{ width: progress + '%' }"></div>
</template>

<script setup lang="ts">
/**
 * 【base】BaseReadProgress —— 页面顶部阅读进度条
 * - 监听 window scroll/resize 自算进度（passive scroll）
 * - 进度条视觉样式在全局 main.css（.read-progress），组件自身零样式
 */
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const update = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
})

onUnmounted(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>
