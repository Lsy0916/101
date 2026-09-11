import type { UserConfig } from 'commitlint'

/**
 * 提交消息规范：Conventional Commits（type: subject）
 * 由 .husky/commit-msg 在提交时校验
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 中文 subject 无大小写形态，且常以 P1/TS 等缩写开头，关闭该规则避免误报
    'subject-case': [0],
    // 中文按 UTF-8 多字节计数易误报超长，body 行宽降为 warning 并放宽
    'body-max-line-length': [2, 'always', 200],
  },
} satisfies UserConfig
