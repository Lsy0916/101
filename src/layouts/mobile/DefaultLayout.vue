<script setup lang="ts">
/**
 * 移动端默认布局。
 * 过渡策略（Q4）：阶段 3 移动端复用现有响应式视图，这些视图依赖
 * MainLayout 的 Navbar / Footer，因此移动布局暂与其同构；
 * 阶段 5 逐页 Vant 化时替换为移动端专用布局（van-tabbar / van-nav-bar）。
 */
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <MainLayout />
</template>
