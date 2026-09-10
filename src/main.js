import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { useAuthStore } from './stores/auth'
import { revealDirective } from './directives/reveal'
import 'default-passive-events' // 解决 passive event listener 警告

// 全局样式（顺序：先 Element Plus 基础样式，后自定义覆盖）
import './styles/element.css'   // Element Plus 主题变量覆盖
import './assets/css/main.css'  // 全局样式 + base.css（含 CSS 变量系统）

const app = createApp(App)
const pinia = createPinia()

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(ElementPlus, { locale: zhCn })

// 注册全局指令
app.directive('reveal', revealDirective)

// 初始化认证状态
const initAuth = () => {
  const authStore = useAuthStore()
  authStore.refreshAuthStatus()
}

// 在应用挂载前初始化认证状态
initAuth()

// 监听页面关闭事件，在页面关闭时根据需要清除本地存储的敏感信息
window.addEventListener('beforeunload', () => {
  const authStore = useAuthStore()
  if (authStore && !authStore.rememberMe) {
    sessionStorage.clear()
  }
})

app.mount('#app')