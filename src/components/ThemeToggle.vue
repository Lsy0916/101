<template>
  <div class="theme-toggle">
    <el-dropdown trigger="click" @command="handleCommand">
      <button class="theme-btn">
        <el-icon class="theme-icon">
          <Monitor v-if="themeMode === 'auto'" />
          <Sunny v-else-if="themeMode === 'light'" />
          <Moon v-else />
        </el-icon>
        <span class="theme-label">{{ currentLabel }}</span>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="light" :class="{ active: themeMode === 'light' }">
            <el-icon><Sunny /></el-icon>
            <span>{{ $t('nav.theme.light') }}</span>
            <el-icon v-if="themeMode === 'light'" class="check"><Check /></el-icon>
          </el-dropdown-item>
          <el-dropdown-item command="auto" :class="{ active: themeMode === 'auto' }">
            <el-icon><Monitor /></el-icon>
            <span>{{ $t('nav.theme.auto') }}</span>
            <el-icon v-if="themeMode === 'auto'" class="check"><Check /></el-icon>
          </el-dropdown-item>
          <el-dropdown-item command="dark" :class="{ active: themeMode === 'dark' }">
            <el-icon><Moon /></el-icon>
            <span>{{ $t('nav.theme.dark') }}</span>
            <el-icon v-if="themeMode === 'dark'" class="check"><Check /></el-icon>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Moon, Sunny, Monitor, Check } from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'
import type { ThemeMode } from '@/composables/useTheme'

const { t } = useI18n()
const { themeMode, setThemeMode } = useTheme()

const currentLabel = computed(() => {
  if (themeMode.value === 'auto') return t('nav.theme.auto')
  if (themeMode.value === 'light') return t('nav.theme.light')
  return t('nav.theme.dark')
})

function handleCommand(mode: ThemeMode) {
  setThemeMode(mode)
}
</script>

<style scoped>
.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  backdrop-filter: blur(8px);
}

.theme-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.theme-icon {
  font-size: 16px;
}

.theme-label {
  white-space: nowrap;
}
</style>

<style>
.theme-toggle .el-dropdown-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

.theme-toggle .el-dropdown-menu__item.active {
  color: #0052d9;
  font-weight: 600;
}

.theme-toggle .el-dropdown-menu__item .check {
  margin-left: auto;
  color: #0052d9;
}
</style>
