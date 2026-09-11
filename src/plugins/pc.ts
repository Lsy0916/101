import type { App } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

/**
 * PC 端插件：仅 PC bundle 加载。
 * 注意：element-plus/dist/index.css 由 main.ts 统一引入（保证先于
 * styles/element.css 与 brand.css 的覆盖层叠），此处只注册组件与图标。
 */
export default function setupPCPlugins(app: App): void {
  // 全量注册图标（沿用旧 main.js 行为；二期可用 unplugin-icons 按需化）
  for (const [name, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(name, component)
  }
  // 组件级 Element locale 由 App.pc.vue 的 el-config-provider 响应式提供，
  // 此处的全局 locale 仅兜底（date-picker 等少量场景）
  app.use(ElementPlus, { locale: zhCn })
}
