import type { App } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Vant from 'vant'
import 'vant/lib/index.css'

/**
 * 移动端插件：仅移动 bundle 加载。
 *
 * 【过渡态】Q4 决议：阶段 3 移动端复用现有响应式视图，而这些视图基于
 * Element Plus，因此移动 bundle 暂时同时注册 EP + Vant；
 * 阶段 5 逐页 Vant 化后，此处移除 Element Plus 相关注册。
 */
export default function setupMobilePlugins(app: App): void {
  for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, component)
  }
  app.use(ElementPlus, { locale: zhCn })
  app.use(Vant)
}
