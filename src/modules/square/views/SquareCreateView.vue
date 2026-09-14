<script setup lang="ts">
import { useRouter } from 'vue-router'
import SquareCreateHeader from '../components/SquareCreateHeader.vue'
import SquareCreateForm from '../components/SquareCreateForm.vue'

const router = useRouter()

const backToSquare = () => {
  router.push('/square')
}
</script>

<template>
  <div class="square-create-page">
    <!-- 杂志编辑式标题区 -->
    <SquareCreateHeader @back="backToSquare" />

    <!-- 表单 · 卡片式分区 -->
    <SquareCreateForm @published="backToSquare" />
  </div>
</template>

<style scoped>
.square-create-page {
  min-height: 100vh;
  background: var(--brand-primary-wash);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif;
  color: var(--ink-900);
  padding-bottom: 60px;
  position: relative;
  overflow-x: hidden;
}

.square-create-page::before {
  content: 'POST';
  position: absolute;
  top: 80px;
  right: -20px;
  font-size: clamp(160px, 24vw, 300px);
  font-weight: 900;
  color: var(--brand-primary);
  opacity: 0.04;
  letter-spacing: -10px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}
</style>
