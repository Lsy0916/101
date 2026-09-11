<script setup lang="ts">
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'
import { useLocale } from '@/composables/useLocale'
import DefaultLayout from '@/layouts/mobile/DefaultLayout.vue'

// 【过渡态】阶段 3 移动端复用现有响应式视图（Element Plus 系），因此
// ConfigProvider 与 EP locale 同步逻辑与 PC 一致；阶段 5 Vant 化后改由
// Vant 的 ConfigProvider 承担，Element Plus 引用随之移除。
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
    <DefaultLayout />
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
