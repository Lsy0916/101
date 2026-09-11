import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'dev-server.js',
      '*.config.js',
      'public/**',
      // 阶段3 过渡：lang="ts" 的 .vue 携带 TS 语法，espree 无法解析；
      // 阶段6 接入 typescript-eslint 后移除本段
      'src/App.pc.vue',
      'src/App.mobile.vue',
      'src/layouts/pc/DefaultLayout.vue',
      'src/layouts/mobile/DefaultLayout.vue'
    ]
  },
  ...pluginVue.configs['flat/recommended'],
  skipFormatting,
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/attribute-hyphenation': 'off'
    }
  }
]
