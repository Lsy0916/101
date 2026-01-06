<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  User,
  ArrowDown,
  Moon,
  Sunny,
  Monitor,
  Check,
  Menu as MenuIcon
} from '@element-plus/icons-vue'
import { useTheme, useLocale } from '../composables/settings'

const router = useRouter()
const { isDark, themeMode, setThemeMode } = useTheme()
const { locale, setLocale } = useLocale()
const isScrolled = ref(false)
const showMobileMenu = ref(false)

const handleThemeCommand = (command) => {
  setThemeMode(command)
}

const handleLocaleCommand = (command) => {
  setLocale(command)
}

const getLocaleLabel = (code) => {
  const map = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en-US': 'English'
  }
  return map[code] || '简体中文'
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const menuData = [
  {
    label: '测评中心',
    key: 'evaluation',
    children: [
      {
        title: '心理量表',
        items: [
          { label: '抑郁自评 (PHQ-9)', key: 'phq9' },
          { label: '焦虑自评 (GAD-7)', key: 'gad7' },
          { label: '压力感量表 (PSS)', key: 'pss' }
        ]
      },
      {
        title: '职业量表',
        items: [
          { label: '霍兰德兴趣 (RIASEC)', key: 'riasec' },
          { label: '性格测试 (MBTI)', key: 'mbti' },
          { label: '职业锚测评', key: 'anchor' }
        ]
      }
    ]
  },
  {
    label: '生涯规划',
    key: 'planning',
    children: [
      {
        title: '目标设定',
        items: [
          { label: '学期计划', key: 'semester' },
          { label: '里程碑管理', key: 'milestone' }
        ]
      },
      {
        title: '技能成长',
        items: [
          { label: '技能树看板', key: 'skill-tree' },
          { label: '课程路径', key: 'courses' }
        ]
      }
    ]
  },
  {
    label: '资源中心',
    key: 'resources',
    children: [
      {
        title: '职业百科',
        items: [
          { label: '行业趋势', key: 'trends' },
          { label: '校友经验', key: 'alumni' }
        ]
      },
      {
        title: '机会发现',
        items: [
          { label: '实习信息', key: 'internship' },
          { label: '校园活动', key: 'activities' }
        ]
      }
    ]
  }
]

function goHome() {
  showMobileMenu.value = false
  router.push('/')
}

function handleNav(item) {
  showMobileMenu.value = false
  // 这里可以根据 item.key 跳转到具体路由，目前先跳转到首页作为示例
  router.push({ path: '/', query: { tab: item.key } })
}

function handleCommand(command) {
  if (command === 'logout') {
    router.push('/login')
  }
}
</script>

<template>
  <header class="nav-header" :class="{ 'is-scrolled': isScrolled }">
    <div class="nav-container">
      <!-- Logo -->
      <div class="nav-left">
        <div class="nav-logo" @click="goHome">
          <div class="logo-box">
            <img src="@/assets/logo.svg" alt="Logo" class="logo-img"/>
          </div>
          <span class="logo-text">生涯心旅</span>
        </div>
      </div>

      <!-- Desktop Menu -->
      <nav class="nav-center desktop-only">
        <div v-for="menu in menuData" :key="menu.key" class="menu-item-group">
          <div class="menu-item">
            {{ menu.label }}
            <el-icon class="arrow-icon"><ArrowDown /></el-icon>
          </div>
          <!-- Mega Menu -->
          <div class="mega-menu">
            <div class="mega-menu-inner">
              <div v-for="group in menu.children" :key="group.title" class="mega-column">
                <h4 class="mega-title">{{ group.title }}</h4>
                <ul class="mega-list">
                  <li v-for="item in group.items" :key="item.key" class="mega-item">
                    {{ item.label }}
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
          <!-- Theme Toggle Dropdown -->
          <el-dropdown @command="handleThemeCommand" trigger="click">
            <button class="icon-btn">
              <el-icon v-if="themeMode === 'light'"><Sunny /></el-icon>
              <el-icon v-else-if="themeMode === 'dark'"><Moon /></el-icon>
              <el-icon v-else><Monitor /></el-icon>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="light">
                  <el-icon><Sunny /></el-icon> 浅色
                  <el-icon v-if="themeMode === 'light'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
                <el-dropdown-item command="dark">
                  <el-icon><Moon /></el-icon> 深色
                  <el-icon v-if="themeMode === 'dark'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
                <el-dropdown-item command="auto">
                  <el-icon><Monitor /></el-icon> 跟随系统
                  <el-icon v-if="themeMode === 'auto'" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- Locale Toggle Dropdown -->
          <el-dropdown @command="handleLocaleCommand" trigger="click">
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

          <el-dropdown @command="handleCommand" trigger="click">
            <div class="user-profile">
              <el-avatar :size="32" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
              <span class="username desktop-only">王同学</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">账号设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

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
    title="菜单导航"
    :with-header="true"
    class="mobile-drawer"
    append-to-body
  >
    <div class="mobile-nav">
      <div class="mobile-menu-content">
        <el-collapse accordion>
          <el-collapse-item v-for="menu in menuData" :key="menu.key" :name="menu.key">
            <template #title>
              <span class="mobile-collapse-title">{{ menu.label }}</span>
            </template>
            <div v-for="group in menu.children" :key="group.title" class="mobile-group">
              <p class="mobile-group-title">{{ group.title }}</p>
              <div
                v-for="item in group.items"
                :key="item.key"
                class="mobile-item"
                @click="handleNav(item)"
              >
                <span class="mobile-item-dot"></span>
                {{ item.label }}
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="mobile-footer-actions">
            <div class="mobile-action-section">
              <p class="mobile-section-title">外观主题</p>
              <div class="mobile-action-grid">
                <div
                  class="mobile-grid-item"
                  :class="{ active: themeMode === 'light' }"
                  @click="setThemeMode('light')"
                >
                  <el-icon><Sunny /></el-icon>
                  <span>浅色</span>
                </div>
                <div
                  class="mobile-grid-item"
                  :class="{ active: themeMode === 'dark' }"
                  @click="setThemeMode('dark')"
                >
                  <el-icon><Moon /></el-icon>
                  <span>深色</span>
                </div>
                <div
                  class="mobile-grid-item"
                  :class="{ active: themeMode === 'auto' }"
                  @click="setThemeMode('auto')"
                >
                  <el-icon><Monitor /></el-icon>
                  <span>自动</span>
                </div>
              </div>
            </div>

            <div class="mobile-action-section">
              <p class="mobile-section-title">语言设置</p>
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
  height: 80px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-header:not(.is-scrolled) {
  background-color: transparent !important;
  background: transparent !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none !important;
}

/* 顶部透明时，仅当悬停在菜单区域时取消透明 */
.nav-header:not(.is-scrolled):has(.nav-center:hover) {
  background-color: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.nav-header.is-scrolled {
  height: 64px;
  background-color: rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
}

.nav-header:not(.is-scrolled) .logo-text {
  background: white;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-header:not(.is-scrolled):has(.nav-center:hover) .logo-text {
  background: linear-gradient(90deg, #0052d9, #1890ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-header:not(.is-scrolled) .menu-item {
  color: rgba(255, 255, 255, 0.9);
}

.nav-header:not(.is-scrolled):has(.nav-center:hover) .menu-item {
  color: #374151;
}

.nav-header:not(.is-scrolled) .menu-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-header:not(.is-scrolled):has(.nav-center:hover) .menu-item:hover {
  background: rgba(0, 82, 217, 0.08);
  color: #0052d9;
}

.nav-header:not(.is-scrolled) .icon-btn {
  color: white;
}

.nav-header:not(.is-scrolled):has(.nav-center:hover) .icon-btn {
  color: #64748b;
}

.nav-header:not(.is-scrolled) .lang-btn {
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.nav-header:not(.is-scrolled):has(.nav-center:hover) .lang-btn {
  border-color: #e2e8f0;
  color: #64748b;
}

.nav-header:not(.is-scrolled) .username {
  color: white;
}

.nav-header:not(.is-scrolled):has(.nav-center:hover) .username {
  color: #1e293b;
}

.nav-header:not(.is-scrolled) .mobile-menu-btn {
  color: white;
}

.nav-header:not(.is-scrolled):has(.nav-center:hover) .mobile-menu-btn {
  color: #1e293b;
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
  background: linear-gradient(90deg, #0052d9, #1890ff);
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
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.arrow-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.menu-item:hover {
  color: #0052d9;
  background: rgba(0, 82, 217, 0.1);
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  padding: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
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
  color: #8c8c8c;
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
  color: #444;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mega-item:hover {
  background: rgba(0, 82, 217, 0.08);
  color: #0052d9;
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
  color: #666;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #0052d9;
}

.lang-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  border-color: #0052d9;
  color: #0052d9;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-profile:hover {
  background: rgba(0, 0, 0, 0.05);
}

.username {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
}

/* Mobile Specific */
.mobile-menu-btn {
  font-size: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-menu-btn:active {
  background: rgba(0, 0, 0, 0.05);
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
  border-bottom: 1px solid #f1f5f9 !important;
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
  background: #eee;
  border-radius: 2px;
}

.mobile-collapse-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.mobile-group {
  padding: 12px 8px;
  background: #fcfcfc;
  border-radius: 8px;
  margin-bottom: 12px;
}

.mobile-group-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
  padding-left: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mobile-item {
  padding: 12px 16px;
  font-size: 1rem;
  color: #475569;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
  line-height: 1.4;
}

.mobile-item:active {
  background: rgba(0, 82, 217, 0.08);
  color: #0052d9;
  transform: translateX(4px);
}

.mobile-item-dot {
  width: 6px;
  height: 6px;
  background: #cbd5e1;
  border-radius: 50%;
  transition: background 0.2s;
  margin-top: 8px; /* 对齐多行文本 */
  flex-shrink: 0;
}

.mobile-item:active .mobile-item-dot {
  background: #0052d9;
  transform: scale(1.2);
}

.check-icon {
  margin-left: auto;
  font-size: 14px;
  color: #0052d9;
}

/* Mobile Footer Improvements */
.mobile-footer-actions {
  margin-top: auto;
  padding: 24px 0 10px;
  border-top: 1px solid #f1f5f9;
}

.mobile-action-section {
  margin-bottom: 20px;
}

.mobile-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
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
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.mobile-grid-item span {
  font-size: 0.85rem;
  font-weight: 500;
}

.mobile-grid-item.active {
  background: rgba(0, 82, 217, 0.08);
  border-color: #0052d9;
  color: #0052d9;
}

.mobile-grid-item:active {
  transform: scale(0.95);
}

/* Responsive Utilities */
@media (max-width: 1200px) {
  .nav-container {
    padding: 0 24px;
  }
  .nav-center {
    margin: 0 20px;
  }
}

@media (max-width: 992px) {
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

@media (min-width: 993px) {
  .mobile-only {
    display: none;
  }
}
</style>
