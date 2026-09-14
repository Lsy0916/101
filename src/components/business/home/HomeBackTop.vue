<template>
  <div
    class="back-to-top-container"
    :class="{ 'visible': scrollY > 100 }"
    @mouseenter="showNavMenu = true"
    @mouseleave="showNavMenu = false"
  >
    <transition name="fade-slide">
      <div v-show="showNavMenu" class="nav-menu">
        <div class="nav-menu-title">{{ $t('home.nav.quick') }}</div>
        <div
          v-for="item in navSections"
          :key="item.id"
          class="menu-item"
          @click.stop="scrollToSection(item.id)"
        >
          <span>{{ $t(item.nameKey) }}</span>
          <div class="item-dot"></div>
        </div>
      </div>
    </transition>

    <div class="back-to-top-btn" @click="scrollToSection('top')">
      <div class="btn-content">
        <el-icon class="main-icon"><ArrowUp /></el-icon>
        <span class="btn-text">TOP</span>
      </div>
      <div class="nav-hint">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 【business】HomeBackTop —— 回到顶部 + 快速导航菜单
 * - 自持 scroll 监听控制显隐；锚点滚动为纯 DOM 操作
 * - services/features 为历史遗留锚点（对应区块已不存在，点击无效果），保持原行为
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from '@element-plus/icons-vue'

// 导航菜单相关
const showNavMenu = ref(false)

const navSections = [
  { id: 'top', nameKey: 'home.nav.top' },
  { id: 'news', nameKey: 'home.nav.news' },
  { id: 'about', nameKey: 'home.nav.about' },
  { id: 'services', nameKey: 'home.nav.services' },
  { id: 'features', nameKey: 'home.nav.features' },
  { id: 'contact', nameKey: 'home.nav.contact' }
]

const scrollToSection = (id: string) => {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// 节流函数优化性能
const throttle = (fn: (...args: unknown[]) => void, delay: number) => {
  let last = 0
  return (...args: unknown[]) => {
    const now = Date.now()
    if (now - last >= delay) {
      fn(...args)
      last = now
    }
  }
}

// 滚动事件处理
const scrollY = ref(0)
const handleScroll = throttle(() => {
  scrollY.value = window.scrollY
}, 100)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top-container {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.back-to-top-container.visible {
  opacity: 1;
  pointer-events: auto;
}

.back-to-top-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--brand-primary);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-primary) 30%, transparent);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.main-icon {
  font-size: 18px;
  margin-bottom: 2px;
}

.btn-text {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.5px;
}

.nav-hint {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 3px;
  opacity: 0.6;
}

.dot {
  width: 3px;
  height: 3px;
  background: white;
  border-radius: 50%;
}

.back-to-top-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 24px color-mix(in srgb, var(--brand-primary) 40%, transparent);
}

.back-to-top-btn:hover .btn-content {
  transform: translateY(-2px);
}

.nav-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: color-mix(in srgb, white 80%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 15px 40px color-mix(in srgb, black 12%, transparent);
  min-width: 160px;
  border: 1px solid color-mix(in srgb, white 60%, transparent);
  transform-origin: bottom right;
}

.nav-menu-title {
  display: block;
  font-size: 11px;
  color: var(--ink-400);
  font-weight: 600;
  padding: 4px 12px 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.menu-item {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-700);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  white-space: nowrap;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.item-dot {
  width: 5px;
  height: 5px;
  background: var(--brand-primary);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: white;
  color: var(--brand-primary);
  box-shadow: 0 4px 12px color-mix(in srgb, black 5%, transparent);
  padding-left: 20px;
}

.menu-item:hover .item-dot {
  opacity: 1;
  transform: scale(1);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}
</style>
