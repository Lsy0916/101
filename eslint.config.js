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
  }
]
