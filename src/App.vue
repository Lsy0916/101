<script setup>
import { computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import { useLocale } from './composables/settings'
import MainLayout from './layouts/MainLayout.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import en from 'element-plus/es/locale/lang/en'

const { locale } = useLocale()

const elementLocale = computed(() => {
  const map = {
    'zh-CN': zhCn,
    'zh-TW': zhTw,
    'en-US': en
  }
  return map[locale.value] || zhCn
})
</script>

<template>
  <el-config-provider :locale="elementLocale">
    <MainLayout />
  </el-config-provider>
</template>

<style>
/* 全局样式 */
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  border: none;
}

#app {
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
}
</style>
