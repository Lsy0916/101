<script setup lang="ts">
/**
 * PC 默认布局。
 * 过渡策略：直接复用旧 MainLayout（Navbar / Footer / CommandPalette /
 * grain-overlay / 页面过渡），保证既有页面行为与视觉零变化；
 * 阶段 5 迁移 Navbar/Footer 后重写为独立 PC 布局并删除 MainLayout。
 */
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <MainLayout />
</template>
