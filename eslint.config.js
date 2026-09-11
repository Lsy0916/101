import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'dev-server.js',
      '*.config.js',
      '*.config.ts',
      'public/**'
    ]
  },
  // 先展开：tseslint base 块不带 files，会把默认 parser 设为 TS parser
  ...tseslint.configs.recommended,
  // 后展开：对 .vue 覆盖回 vue-eslint-parser，script 内容再交给 TS parser
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser }
    }
  },
  skipFormatting,
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      // 旧 JS 过渡文件（阶段 6 删除）存在 this 别名，先降 warn
      '@typescript-eslint/no-this-alias': 'warn',
      // TS 文件由 tsc 负责 undefined 检查；旧 JS 文件保留 warn 以暴露隐式全局
      'no-undef': 'warn',
      'no-console': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/attribute-hyphenation': 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      'no-undef': 'off'
    }
  },
  // ---- 分层边界（架构规范：依赖方向单向）----
  // base 组件只依赖 vue 与自身样式；文案/颜色经 props、slot 与 CSS 变量注入
  {
    files: ['src/components/base/**/*.{vue,ts}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/api', '@/api/*'], message: 'base 组件禁止请求接口' },
            { group: ['@/stores', '@/stores/*'], message: 'base 组件禁止访问 store' },
            { group: ['@/realtime', '@/realtime/*'], message: 'base 组件禁止接触 SignalR' },
            { group: ['@/events', '@/events/*'], message: 'base 组件禁止使用事件总线' },
            { group: ['vue-router'], message: 'base 组件禁止路由跳转' }
          ]
        }
      ]
    }
  },
  // business 组件：数据经 props 传入、行为经 emits 抛出，页面负责取数与跳转
  {
    files: ['src/components/business/**/*.{vue,ts}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/api', '@/api/*'], message: 'business 组件禁止请求接口，数据由页面传入' },
            { group: ['@/stores', '@/stores/*'], message: 'business 组件禁止访问 store' },
            { group: ['@/realtime', '@/realtime/*'], message: 'business 组件禁止接触 SignalR' },
            { group: ['vue-router'], message: 'business 组件禁止路由跳转，通过 emits 通知页面' }
          ]
        }
      ]
    }
  }
]
