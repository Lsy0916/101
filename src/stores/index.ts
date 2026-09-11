import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

/**
 * 全局唯一 Pinia 实例。
 * 阶段 3 起由 main.ts app.use(pinia) 挂载；
 * api/interceptors.ts 通过 useXxxStore(pinia) 在组件外使用同一实例。
 */
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
