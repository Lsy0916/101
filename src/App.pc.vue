<script setup lang="ts">
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
import { useLocale } from '@/composables/useLocale'

// 语言切换响应式同步到 Element Plus 组件（沿用旧 App.vue 行为）
const { locale } = useLocale()

const elementLocaleMap = {
  'zh-CN': zhCn,
  'zh-TW': zhTw,
  'en-US': en,
} as const

const elementLocale = computed(
  () => elementLocaleMap[locale.value as keyof typeof elementLocaleMap] ?? zhCn,
)
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <RouterView />
  </el-config-provider>
</template>

<style>
/* 全局根高度（沿用旧 App.vue 全局样式） */
html {
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
}

body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
  border: none;
}

#app {
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
}
</style>
