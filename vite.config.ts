import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // GitHub Pages 项目站点部署在 /101/ 子路径下；
    // 仅构建时启用，本地 dev/仍为根路径
    base: command === 'build' ? '/101/' : '/',
    plugins: [
      vue(),
      // vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      allowedHosts: [
        'probable-skimmer-daughter.ngrok-free.dev',
        '.ngrok-free.dev',
        'springboot.free.idcfengye.com',
      ],
      host: '0.0.0.0',
      port: 3000,
      proxy: {
        // REST：转发到本地后端
        '/api': {
          target: env.VITE_PROXY_TARGET || 'http://127.0.0.1:8080',
          changeOrigin: true,
        },
        // SignalR WebSocket（阶段 4 使用；ws: true 是关键）
        '/hubs': {
          target: env.VITE_PROXY_TARGET || 'http://127.0.0.1:8080',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  }
})
