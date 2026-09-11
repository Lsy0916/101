<script setup lang="ts">
/**
 * 移动端默认布局（Q4）：阶段 5 复用 AppShell 与响应式视图同构；
 * 后续逐页 Vant 化时替换为移动端专用布局（van-tabbar / van-nav-bar）。
 */
import AppShell from '@/layouts/components/AppShell.vue'
</script>

<template>
  <AppShell />
</template>
