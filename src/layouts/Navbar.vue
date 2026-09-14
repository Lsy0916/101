<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  User,
  ArrowDown,
  Moon,
  Sunny,
  Monitor,
  Check,
  Setting,
  SwitchButton,
  Menu as MenuIcon
} from '@element-plus/icons-vue'
import { useTheme } from '@/composables/useTheme'
import type { ThemeMode } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import type { AppLocale } from '@/locales'
import { useCommandPalette } from '@/composables/useCommandPalette'
import { useUserStore } from '@/stores/useUserStore'
import { logout } from '@/composables/useAuth'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { themeMode, setThemeMode } = useTheme()
const { locale, setLocale } = useLocale()
const { toggle: togglePalette } = useCommandPalette()
const isScrolled = ref(false)
const showMobileMenu = ref(false)

const isTransparentPage = computed(() => route.meta.transparentNavbar === true)
const shouldBeTransparent = computed(() => isTransparentPage.value && !isScrolled.value)

const handleThemeCommand = (command: ThemeMode) => {
  setThemeMode(command)
}

const handleLocaleCommand = (command: AppLocale) => {
  setLocale(command)
}

// 导航菜单数据结构（key 与路由 name 对应，跳转规则见 handleNav）
interface NavItem {
  key: string
  labelKey: string
}

interface MenuGroup {
  titleKey: string
  items: NavItem[]
}

interface MenuEntry {
  labelKey: string
  key: string
  children: MenuGroup[]
}

let scrollTicking = false
const handleScroll = () => {
  if (scrollTicking) return
  scrollTicking = true
  requestAnimationFrame(() => {
    const y = window.scrollY
    if (y > 30 && !isScrolled.value) {
      isScrolled.value = true
      document.documentElement.style.setProperty('--navbar-h', '64px')
    } else if (y < 10 && isScrolled.value) {
      isScrolled.value = false
      document.documentElement.style.setProperty('--navbar-h', '80px')
    }
    scrollTicking = false
  })
}

onMounted(() => {
  document.documentElement.style.setProperty('--navbar-h', '80px')
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const menuData: MenuEntry[] = [
  {
    labelKey: 'nav.menu.evaluation',
    key: 'evaluation',
    children: [
      {
        titleKey: 'nav.group.mentalScales',
        items: [
          { labelKey: 'nav.item.phq9', key: 'phq9' },
          { labelKey: 'nav.item.gad7', key: 'gad7' },
          { labelKey: 'nav.item.pss', key: 'pss' }
        ]
      },
      {
        titleKey: 'nav.group.careerScales',
        items: [
          { labelKey: 'nav.item.riasec', key: 'riasec' },
          { labelKey: 'nav.item.mbti', key: 'mbti' }
        ]
      }
    ]
  },
  {
    labelKey: 'nav.menu.articles',
    key: 'articles',
    children: [
      {
        titleKey: 'nav.group.hotPicks',
        items: [
          { labelKey: 'nav.item.daily', key: 'daily' },
          { labelKey: 'nav.item.featured', key: 'featured' }
        ]
      },
      {
        titleKey: 'nav.group.browseByCategory',
        items: [
          { labelKey: 'nav.item.articleList', key: 'article-list' },
          { labelKey: 'nav.item.psychology', key: 'psychology' },
          { labelKey: 'nav.item.career', key: 'career' },
          { labelKey: 'nav.item.stories', key: 'stories' }
        ]
      }
    ]
  },
  {
    labelKey: 'nav.menu.activities',
    key: 'activities',
    children: [
      {
        titleKey: 'nav.group.featuredActivities',
        items: [
          { labelKey: 'nav.item.timeCapsule', key: 'time-capsule' },
          { labelKey: 'nav.item.square', key: 'square' }
        ]
      }
    ]
  },
  {
    labelKey: 'nav.menu.counseling',
    key: 'counseling',
    children: [
      {
        titleKey: 'nav.group.professionalService',
        items: [
          { labelKey: 'nav.item.booking', key: 'booking' }
        ]
      },
      {
        titleKey: 'nav.group.aiColumn',
        items: [
          { labelKey: 'nav.item.aiConsult', key: 'ai-consult' },
          { labelKey: 'nav.item.aiCompanion', key: 'ai-companion' }
        ]
      },
      {
        titleKey: 'nav.group.counselingSupport',
        items: [
          { labelKey: 'nav.item.consultants', key: 'consultants' },
          { labelKey: 'nav.item.notice', key: 'notice' },
          { labelKey: 'nav.item.faq', key: 'faq' }
        ]
      }
    ]
  }
]

function goHome() {
  showMobileMenu.value = false
  router.push('/')
}

function handleNav(item: NavItem) {
  showMobileMenu.value = false

  // 处理时光胶囊跳转（活动中心父菜单与子项都进入胶囊广场）
  if (item.key === 'time-capsule' || item.key === 'activities') {
    router.push({ name: 'time-capsule' })
    return
  }

  // 处理交流广场跳转
  if (item.key === 'square') {
    router.push({ name: 'square' })
    return
  }

  // 处理文章资讯跳转
  if (item.key === 'articles' || item.key === 'article-list' || ['daily', 'featured', 'psychology', 'career', 'stories'].includes(item.key)) {
    if (item.key === 'article-list') {
      router.push({ name: 'article-list' })
    } else if (item.key === 'articles') {
      router.push({ name: 'articles' })
    } else {
      router.push({ name: 'articles', query: { category: item.key } })
    }
    return
  }

  // 识别测评相关的 key，跳转到测评中心并打开量表介绍
  const assessmentKeys = ['phq9', 'gad7', 'pss', 'riasec', 'mbti', 'evaluation']
  if (assessmentKeys.includes(item.key)) {
    if (item.key === 'evaluation') {
      router.push({ name: 'assessment' })
    } else {
      router.push({ name: 'assessment', query: { scale: item.key, view: 'intro' } })
    }
    return
  }

  // AI 专栏跳转
  if (item.key === 'ai-consult') {
    router.push({ name: 'counseling-ai-chat' })
    return
  }
  if (item.key === 'ai-companion') {
    router.push({ name: 'counseling-companion' })
    return
  }

  // 心理咨询相关跳转
  const counselingKeys = ['counseling', 'booking', 'consultants', 'notice', 'faq']
  if (counselingKeys.includes(item.key)) {
    if (item.key === 'counseling') {
      router.push({ name: 'counseling' })
    } else {
      router.push({ name: 'counseling', query: { tab: item.key } })
    }
    return
  }

  // 兜底：跳转首页
  router.push('/')
}

function handleCommand(command: string) {
  if (command === 'logout') {
    // 新认证体系：清新 userStore + 广播 user:logout（main.ts 订阅后跳登录页）
    logout()
  } else if (command === 'profile') {
    router.push({ name: 'profile' })
  } else if (command === 'settings') {
    router.push({ name: 'settings' })
  }
}
</script>

<template>
  <header class="nav-header" :class="{ 'is-scrolled': isScrolled, 'is-transparent': shouldBeTransparent }">
    <div class="nav-container">
      <!-- Logo -->
      <div class="nav-left">
        <div class="nav-logo" @click="goHome">
          <div class="logo-box">
            <img src="@/assets/logo.svg" alt="Logo" class="logo-img"/>
          </div>
          <span class="logo-text">{{ $t('nav.brand') }}</span>
        </div>
      </div>

      <!-- Desktop Menu -->
      <nav class="nav-center desktop-only">
        <div v-for="menu in menuData" :key="menu.key" class="menu-item-group">
          <div class="menu-item" @click="handleNav(menu)">
            {{ $t(menu.labelKey) }}
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </div>
          <!-- Mega Menu -->
          <div class="mega-menu">
            <div class="mega-menu-inner">
              <div v-for="group in menu.children" :key="group.titleKey" class="mega-column">
                <h4 class="mega-title">{{ $t(group.titleKey) }}</h4>
                <ul class="mega-list">
                  <li
                    v-for="item in group.items"
                    :key="item.key"
                    class="mega-item"
                    @click="handleNav(item)"
                  >
                    {{ $t(item.labelKey) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Actions -->
      <div class="nav-right">
        <div class="action-items">
          <!-- Command Palette Trigger -->
          <button class="cmd-trigger desktop-only" :aria-label="$t('nav.search')" @click="togglePalette">
            <svg class="cmd-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <span class="cmd-trigger-text">{{ $t('nav.search') }}</span>
          </button>

          <!-- Theme Toggle Dropdown -->
          <el-dropdown trigger="click" @command="handleThemeCommand">
            <button class="icon-btn">
              <el-icon v-if="themeMode === 'light'"><Sunny /></el-icon>
              <el-icon v-else-if="themeMode === 'dark'"><Moon /></el-icon>
              <el-icon v-else><Monitor /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="light">
                  <el-icon><Sunny /></el-icon> {{ $t('nav.theme.light') }}
                  <el-icon v-if="themeMode === 'light'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
                <el-dropdown-item command="dark">
                  <el-icon><Moon /></el-icon> {{ $t('nav.theme.dark') }}
                  <el-icon v-if="themeMode === 'dark'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
                <el-dropdown-item command="auto">
                  <el-icon><Monitor /></el-icon> {{ $t('nav.theme.auto') }}
                  <el-icon v-if="themeMode === 'auto'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- Locale Toggle Dropdown -->
          <el-dropdown trigger="click" @command="handleLocaleCommand">
            <button class="lang-btn">
              {{ locale === 'en-US' ? 'EN' : (locale === 'zh-TW' ? '繁' : '简') }}
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="zh-CN">
                  简体中文
                  <el-icon v-if="locale === 'zh-CN'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
                <el-dropdown-item command="zh-TW">
                  繁體中文
                  <el-icon v-if="locale === 'zh-TW'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
                <el-dropdown-item command="en-US">
                  English
                  <el-icon v-if="locale === 'en-US'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <el-dropdown v-if="userStore.isLoggedIn" trigger="click" popper-class="user-dropdown-popper" @command="handleCommand">
            <div class="user-profile">
              <BaseInitialAvatar :name="userStore.profile?.name || 'U'" :size="32" />
              <span class="username desktop-only">{{ userStore.profile?.name || $t('nav.user.guest') }}</span>
              <el-icon class="caret"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <div class="dropdown-header">
                  <BaseInitialAvatar :name="userStore.profile?.name || 'U'" :size="44" />
                  <div class="dropdown-header-info">
                    <span class="dropdown-header-name">{{ userStore.profile?.name || $t('nav.user.guest') }}</span>
                    <span class="dropdown-header-id">{{ userStore.profile?.id || '—' }}</span>
                  </div>
                </div>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  {{ $t('nav.user.profile') }}
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  {{ $t('nav.user.settings') }}
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  {{ $t('nav.user.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button v-else type="primary" plain class="login-btn-desktop" @click="router.push({ name: 'login' })">
            {{ $t('nav.user.login') }}
          </el-button>

          <button class="mobile-menu-btn mobile-only" @click="showMobileMenu = true">
            <el-icon><MenuIcon /></el-icon>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer - 移动到 header 外部并添加 append-to-body 确保不被截断 -->
  <el-drawer
    v-model="showMobileMenu"
    direction="rtl"
    size="85%"
    :title="$t('nav.mobile.menuTitle')"
    :with-header="true"
    class="mobile-drawer"
    append-to-body
  >
    <div class="mobile-nav">
      <div class="mobile-menu-content">
        <el-collapse accordion>
          <el-collapse-item v-for="menu in menuData" :key="menu.key" :name="menu.key">
            <template #title>
              <span class="mobile-collapse-title">{{ $t(menu.labelKey) }}</span>
            </template>
            <!-- 增加跳转到中心页面的入口 -->
            <div v-if="menu.key === 'evaluation'" class="mobile-center-link" @click="handleNav(menu)">
              <el-icon><Monitor /></el-icon> {{ $t('nav.mobile.enterCenter') }}
            </div>
            <div v-for="group in menu.children" :key="group.titleKey" class="mobile-group">
              <p class="mobile-group-title">{{ $t(group.titleKey) }}</p>
              <div
                v-for="item in group.items"
                :key="item.key"
                class="mobile-item"
                @click="handleNav(item)"
              >
                <span class="mobile-item-dot"></span>
                {{ $t(item.labelKey) }}
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="mobile-footer-actions">
            <div class="mobile-action-section">
              <p class="mobile-section-title">{{ $t('nav.mobile.appearance') }}</p>
              <div class="mobile-action-grid">
                <div
                  class="mobile-grid-item"
                  :class="{ active: themeMode === 'light' }"
                  @click="setThemeMode('light')"
                >
                  <el-icon><Sunny /></el-icon>
                  <span>{{ $t('nav.theme.light') }}</span>
                </div>
                <div
                  class="mobile-grid-item"
                  :class="{ active: themeMode === 'dark' }"
                  @click="setThemeMode('dark')"
                >
                  <el-icon><Moon /></el-icon>
                  <span>{{ $t('nav.theme.dark') }}</span>
                </div>
                <div
                  class="mobile-grid-item"
                  :class="{ active: themeMode === 'auto' }"
                  @click="setThemeMode('auto')"
                >
                  <el-icon><Monitor /></el-icon>
                  <span>{{ $t('nav.theme.auto') }}</span>
                </div>
              </div>
            </div>

            <div class="mobile-action-section">
              <p class="mobile-section-title">{{ $t('nav.mobile.language') }}</p>
              <div class="mobile-action-grid">
                <div
                  class="mobile-grid-item"
                  :class="{ active: locale === 'zh-CN' }"
                  @click="setLocale('zh-CN')"
                >
                  <span>简体</span>
                </div>
                <div
                  class="mobile-grid-item"
                  :class="{ active: locale === 'zh-TW' }"
                  @click="setLocale('zh-TW')"
                >
                  <span>繁體</span>
                </div>
                <div
                  class="mobile-grid-item"
                  :class="{ active: locale === 'en-US' }"
                  @click="setLocale('en-US')"
                >
                  <span>EN</span>
                </div>
              </div>
            </div>
          </div>
    </div>
  </el-drawer>
</template>

<style scoped>
.nav-header {
  height: var(--navbar-h, 80px);
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: white;
  box-shadow: 0 2px 10px color-mix(in srgb, black 5%, transparent);
}

.nav-header.is-transparent {
  background: transparent !important;
  border-bottom: 1px solid color-mix(in srgb, white 10%, transparent);
  box-shadow: none !important;
}

/* 顶部透明时，仅当悬停在菜单区域时取消透明 */
.nav-header.is-transparent:has(.nav-center:hover) {
  background-color: color-mix(in srgb, white 98%, transparent) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid color-mix(in srgb, black 5%, transparent);
  box-shadow: 0 4px 20px color-mix(in srgb, black 8%, transparent) !important;
}

.nav-header.is-scrolled {
  height: 64px;
  background-color: color-mix(in srgb, white 80%, transparent) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid color-mix(in srgb, black 5%, transparent);
  box-shadow: 0 4px 20px color-mix(in srgb, black 5%, transparent) !important;
}

.nav-header.is-transparent .logo-text {
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-header.is-transparent:has(.nav-center:hover) .logo-text {
  background: linear-gradient(90deg, var(--brand-primary), var(--color-info));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-header.is-transparent .menu-item {
  color: color-mix(in srgb, white 90%, transparent);
}

.nav-header.is-transparent:has(.nav-center:hover) .menu-item {
  color: var(--ink-700);
}

.nav-header.is-transparent .menu-item:hover {
  background: color-mix(in srgb, white 15%, transparent);
  color: white;
}

.nav-header.is-transparent:has(.nav-center:hover) .menu-item:hover {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
}

.nav-header.is-transparent .icon-btn {
  color: white;
}

.nav-header.is-transparent:has(.nav-center:hover) .icon-btn {
  color: var(--slate-500);
}

.nav-header.is-transparent .lang-btn {
  border-color: color-mix(in srgb, white 40%, transparent);
  color: white;
}

.nav-header.is-transparent:has(.nav-center:hover) .lang-btn {
  border-color: var(--slate-200);
  color: var(--slate-500);
}

.nav-header.is-transparent .username {
  color: white;
}

.nav-header.is-transparent:has(.nav-center:hover) .username {
  color: var(--slate-800);
}

.nav-header.is-transparent .mobile-menu-btn {
  color: white;
}

.nav-header.is-transparent:has(.nav-center:hover) .mobile-menu-btn {
  color: var(--slate-800);
}

.nav-header.is-transparent .cmd-trigger {
  background: transparent;
  border-color: color-mix(in srgb, white 40%, transparent);
  color: white;
}

.nav-header.is-transparent:has(.nav-center:hover) .cmd-trigger {
  background: var(--slate-50);
  border-color: var(--mist-050);
  color: var(--ink-500);
}

.nav-header.is-transparent .cmd-trigger:hover {
  background: color-mix(in srgb, white 15%, transparent);
  border-color: color-mix(in srgb, white 60%, transparent);
  color: white;
}

.nav-header.is-transparent:has(.nav-center:hover) .cmd-trigger:hover {
  background: var(--brand-primary-faint);
  border-color: var(--brand-primary-soft);
  color: var(--brand-primary);
}

.nav-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo Section */
.nav-left {
  flex-shrink: 0;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.nav-logo:hover {
  transform: scale(1.02);
}

.logo-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 2em;
  height: 2em;
 }

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, var(--brand-primary), var(--color-info));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

/* Desktop Menu Section */
.nav-center {
  display: flex;
  height: 100%;
  margin: 0 40px;
}

.menu-item-group {
  position: relative;
  height: 100%;
}

.menu-item {
  height: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1rem;
  font-weight: 500;
  color: var(--neutral-800);
  cursor: pointer;
  transition: all 0.3s ease;
}

.arrow-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.menu-item:hover {
  color: var(--brand-primary);
  background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
}

.menu-item-group:hover .arrow-icon {
  transform: rotate(180deg);
}

/* Mega Menu Styles */
.mega-menu {
  position: absolute;
  top: 100%;
  left: 0;
  transform: translateX(-20px);
  width: auto;
  min-width: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px color-mix(in srgb, black 12%, transparent);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  padding: 8px;
  border: 1px solid color-mix(in srgb, black 5%, transparent);
  pointer-events: none;
}

.menu-item-group:hover .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
  pointer-events: auto;
}

.mega-menu-inner {
  display: flex;
  gap: 32px;
  padding: 24px;
}

.mega-column {
  flex: 1;
  min-width: 180px;
}

.mega-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #8c8c8c; /* stylelint-disable-line color-no-hex, function-allowed-list */
  margin-bottom: 16px;
  padding-left: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.mega-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mega-item {
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #444; /* stylelint-disable-line color-no-hex, function-allowed-list */
  cursor: pointer;
  transition: all 0.2s ease;
}

.mega-item:hover {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
  transform: translateX(6px);
}

/* Action Section */
.nav-right {
  flex-shrink: 0;
}

.action-items {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--neutral-600);
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: color-mix(in srgb, black 5%, transparent);
  color: var(--brand-primary);
}

.cmd-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  background: var(--slate-50);
  border: 1px solid var(--mist-050);
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s ease;
  color: var(--ink-500);
}

.cmd-trigger:hover {
  border-color: var(--brand-primary-soft);
  background: var(--brand-primary-faint);
  color: var(--brand-primary);
}

.cmd-search-icon {
  flex-shrink: 0;
}

.cmd-trigger-text {
  font-size: 13px;
  letter-spacing: 0.3px;
}

.cmd-kbd {
  font-size: 10px;
  font-weight: 600;
  color: var(--ink-400);
  border: 1px solid var(--ink-200);
  padding: 1px 5px;
  border-radius: 3px;
  background: white;
  letter-spacing: 0.5px;
}

.cmd-trigger:hover .cmd-kbd {
  color: var(--brand-primary);
  border-color: var(--brand-primary-soft);
}

.lang-btn {
  background: transparent;
  border: 1px solid var(--slate-200);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--neutral-600);
  transition: all 0.3s ease;
}

.lang-btn:hover {
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px 5px 5px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

.user-profile:hover {
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent);
  border-color: var(--brand-primary-soft);
}

.user-profile .caret {
  font-size: 11px;
  color: var(--ink-500);
  transition: transform 0.25s ease;
}

.username {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--ink-800);
  transition: all 0.3s ease;
}

.login-btn-desktop {
  padding: 8px 20px !important;
  border-radius: 20px !important;
  font-weight: 600;
  font-size: 13px;
  border-color: var(--brand-primary) !important;
  color: var(--brand-primary) !important;
  background: color-mix(in srgb, var(--brand-primary) 6%, transparent) !important;
  transition: all 0.3s ease;
}

.login-btn-desktop:hover {
  background: var(--brand-primary) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary) 20%, transparent);
}

/* Mobile Specific */
.mobile-menu-btn {
  font-size: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--neutral-800);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-menu-btn:active {
  background: color-mix(in srgb, black 5%, transparent);
}

/* Drawer Styles Override */
:deep(.el-drawer__body) {
  padding: 0 !important;
  display: flex;
  flex-direction: column;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px 20px;
}

.mobile-menu-content {
  flex: 1;
  overflow-y: auto;
  margin: 0 -8px;
  padding: 0 8px;
}

/* 移除折叠面板的边框 */
:deep(.el-collapse) {
  border: none !important;
}

:deep(.el-collapse-item__header) {
  border-bottom: 1px solid var(--slate-100) !important;
}

:deep(.el-collapse-item__wrap) {
  border-bottom: none !important;
  background: transparent !important;
}

:deep(.el-collapse-item__content) {
  padding: 16px 0 !important;
}

/* 隐藏滚动条但保留功能 (可选) */
.mobile-menu-content::-webkit-scrollbar {
  width: 4px;
}

.mobile-menu-content::-webkit-scrollbar-thumb {
  background: var(--neutral-100);
  border-radius: 2px;
}

.mobile-collapse-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a; /* stylelint-disable-line color-no-hex, function-allowed-list */
}

.mobile-center-link {
  margin: 8px 16px 16px;
  padding: 12px;
  background: var(--brand-primary-faint);
  color: var(--brand-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: 1px solid var(--brand-primary-soft);
}

.mobile-center-link:active {
  background: var(--blue-050);
}

.mobile-group {
  padding: 12px 8px;
  background: #fcfcfc; /* stylelint-disable-line color-no-hex, function-allowed-list */
  border-radius: 8px;
  margin-bottom: 12px;
}

.mobile-group-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--slate-400);
  margin-bottom: 8px;
  padding-left: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-item {
  padding: 12px 16px;
  font-size: 1rem;
  color: var(--slate-600);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
  line-height: 1.4;
}

.mobile-item:active {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
  transform: translateX(4px);
}

.mobile-item-dot {
  width: 6px;
  height: 6px;
  background: var(--slate-300);
  border-radius: 50%;
  transition: background 0.2s;
  margin-top: 8px; /* 对齐多行文本 */
  flex-shrink: 0;
}

.mobile-item:active .mobile-item-dot {
  background: var(--brand-primary);
  transform: scale(1.2);
}

.check-icon {
  margin-left: auto;
  font-size: 14px;
  color: var(--brand-primary);
}

/* Mobile Footer Improvements */
.mobile-footer-actions {
  margin-top: auto;
  padding: 24px 0 10px;
  border-top: 1px solid var(--slate-100);
}

.mobile-action-section {
  margin-bottom: 20px;
}

.mobile-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--slate-400);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.mobile-grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 8px;
  background: var(--slate-50);
  border: 1px solid var(--slate-100);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--slate-500);
}

.mobile-grid-item span {
  font-size: 0.85rem;
  font-weight: 500;
}

.mobile-grid-item.active {
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  border-color: var(--brand-primary);
  color: var(--brand-primary);
}

.mobile-grid-item:active {
  transform: scale(0.95);
}

/* Responsive Utilities */
@media (width <= 1200px) {
  .nav-container {
    padding: 0 24px;
  }

  .nav-center {
    margin: 0 20px;
  }
}

@media (width <= 992px) {
  .desktop-only {
    display: none;
  }

  .nav-center {
    display: none;
  }

  /* 在移动端隐藏主题和语言切换按钮 */
  .icon-btn,
  .lang-btn {
    display: none;
  }
}

@media (width >= 993px) {
  .mobile-only {
    display: none;
  }
}
</style>

<style>
/* 用户下拉菜单（teleported popper） */
.user-dropdown-popper.el-popper {
  border-radius: 16px !important;
  border: 1px solid var(--mist-050) !important;
  box-shadow: 0 12px 40px color-mix(in srgb, var(--brand-primary) 12%, transparent) !important;
  padding: 6px !important;
  overflow: hidden;
}

.user-dropdown-popper .el-dropdown-menu {
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

.user-dropdown-popper .dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px 16px;
  margin-bottom: 4px;
  background: linear-gradient(135deg, var(--brand-primary-faint), #e6f0ff); /* stylelint-disable-line color-no-hex, function-allowed-list */
  border-radius: 12px;
  border-bottom: 1px solid var(--brand-primary-soft);
}

.user-dropdown-popper .dropdown-header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.user-dropdown-popper .dropdown-header-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink-900);
  line-height: 1.2;
}

.user-dropdown-popper .dropdown-header-id {
  font-size: 12px;
  color: var(--ink-500);
  letter-spacing: 0.3px;
}

.user-dropdown-popper .el-dropdown-menu__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  margin: 2px 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink-700);
  transition: all 0.2s ease;
}

.user-dropdown-popper .el-dropdown-menu__item .el-icon {
  font-size: 16px;
  color: var(--ink-500);
  transition: color 0.2s ease;
}

.user-dropdown-popper .el-dropdown-menu__item:hover {
  background: var(--brand-primary-faint) !important;
  color: var(--brand-primary) !important;
}

.user-dropdown-popper .el-dropdown-menu__item:hover .el-icon {
  color: var(--brand-primary);
}

.user-dropdown-popper .el-dropdown-menu__item.is-divided {
  margin-top: 6px;
  position: relative;
}

.user-dropdown-popper .el-dropdown-menu__item.is-divided::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 12px;
  right: 12px;
  height: 1px;
  background: var(--mist-050);
}

.user-dropdown-popper .el-dropdown-menu__item.is-divided:hover {
  color: var(--danger-500) !important;
  background: var(--danger-50) !important;
}

.user-dropdown-popper .el-dropdown-menu__item.is-divided:hover .el-icon {
  color: var(--danger-500);
}
</style>
