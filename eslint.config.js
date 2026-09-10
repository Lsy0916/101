import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'dev-server.js', '*.config.js', 'public/**']
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
