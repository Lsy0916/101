# 代码规范约定

本项目前端基于 Vue 3 + Element Plus + Vite，遵循以下代码规范。

## 1. 文件命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 组件文件 | PascalCase.vue | `ArticleList.vue`、`InitialAvatar.vue` |
| 视图文件 | PascalCase.vue | `HomePage.vue`、`Profile.vue` |
| 模块视图 | 模块名/views/PascalCase.vue | `modules/time-capsule/views/CapsuleList.vue` |
| 工具函数 | camelCase.js | `debounce.js`、`request.js` |
| 组合式函数 | useXxx.js | `useTheme.js`、`useCommandPalette.js` |
| 常量文件 | constants.js 或 UPPER_SNAKE.js | `constants.js` |
| API 文件 | 资源名.js | `captcha.js`、`user.js` |
| 路由/入口 | 小写 | `index.js`、`main.js` |
| 样式文件 | kebab-case.scss | `variables.scss` |

## 2. 组件命名

- 组件名始终使用 PascalCase
- 通用组件多词命名（如 `InitialAvatar`、`CommandPalette`），避免与 HTML 元素冲突
- 路由页面允许单词命名（如 `Profile`、`Settings`）
- 全局注册组件用 PascalCase，局部导入组件用 PascalCase

## 3. 变量命名

| 类型 | 规则 | 示例 |
|------|------|------|
| 普通变量 | camelCase | `activeCategory`、`searchQuery` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PHOTO_COUNT`、`API_BASE_URL` |
| ref 变量 | camelCase + .value 访问 | `const loading = ref(false)` |
| reactive 对象 | camelCase | `const loginForm = reactive({...})` |
| computed | camelCase | `const filteredArticles = computed(...)` |
| props | camelCase | `userId`、`isAnonymous` |

## 4. 函数命名

| 场景 | 前缀/格式 | 示例 |
|------|-----------|------|
| 事件处理 | handleXxx | `handleLogin`、`handleScroll`、`handleCommand` |
| 异步获取 | fetchXxx / loadXxx | `fetchUserInfo`、`loadAssessments` |
| 判断返回布尔 | isXxx / hasXxx / shouldXxx | `isLoggedIn`、`hasPermission` |
| 转换/格式化 | toXxx / formatXxx | `toLocaleLabel`、`formatDate` |
| 工具获取/设置 | getXxx / setXxx | `getLocaleLabel`、`setThemeMode` |
| 生命周期相关 | onXxx / beforeXxx | `onMounted`、`onBeforeUnmount` |
| 发送请求 | sendXxx / apiXxx | `sendPhoneCode`、`apiSendEmailCode` |

## 5. 接口/API 命名

- API 函数：`动词 + 资源`（camelCase）
  - `getUserInfo`、`createCapsule`、`updateArticle`、`deleteBooking`
- URL 路径：kebab-case
  - `/api/time-capsule`、`/api/user-profile`
- 请求方法遵循 RESTful 语义
  - GET 查询、POST 创建、PUT/PATCH 更新、DELETE 删除
- API 文件按资源分组，集中在 `src/api/` 目录

## 6. Props 与 Emits

- Props：camelCase 声明，kebab-case 传递
  ```vue
  <!-- 声明 -->
  defineProps({ userId: String, isAnonymous: Boolean })
  <!-- 传递 -->
  <InitialAvatar :user-id="id" :is-anonymous="true" />
  ```
- Emits：kebab-case 事件名
  ```js
  defineEmits(['switch-to-forgot-password', 'switch-to-login'])
  ```

## 7. i18n key 命名

- 结构：`模块.子模块.key`
- 示例：`login.form.schoolPlaceholder`、`counseling.cover.booking.title`
- 数组型翻译：用 `items` / `xxxItems` 命名
  - `counseling.confidentiality.items`、`counseling.prep.beforeItems`
- 带参数翻译：用 `{param}` 占位
  - `'{n}s后重发'`、`'加入于 {date}'`
- HTML 内容翻译：模板用 `v-html="$t('key')"`，避免 XSS 警告
- 三语言文件结构完全对齐：zh-CN.js / zh-TW.js / en-US.js

## 8. CSS 命名

- 类名：kebab-case（如 `.login-button`、`.form-container`）
- BEM 风格用于复杂组件（如 `.swipe-track__item--active`）
- scoped 样式：所有组件样式用 `<style scoped>`
- 深度选择器：`:deep(.el-xxx)` 而非 `::v-deep`
- CSS 变量：`--navbar-h` 格式，kebab-case
- 品牌色变量（统一使用）：
  - 主色 `#0052d9`、辅色 `#1890ff`、浅蓝背景 `#f0f7ff`、边框 `#d0e7ff`
  - 文本 `#111827` / `#1f2937` / `#4b5563` / `#6b7280`
  - 卡片圆角 16-24px，中元素 10-14px，小元素 6-8px

## 9. 逻辑处理规范

### script setup 内部顺序
```vue
<script setup>
// 1. import 语句（vue → 第三方 → @/ 别名 → 相对路径）
// 2. Props / Emits 定义
// 3. 组合式函数调用（useRouter, useI18n, useAuthStore 等）
// 4. ref / reactive / shallowRef 声明
// 5. computed 计算属性
// 6. watch 监听器
// 7. 普通函数
// 8. 生命周期钩子（onMounted, onBeforeUnmount 等）
</script>
```

### 重要约定
- 图标组件数组用 `shallowRef` 而非 `ref`（避免 Vue markRaw 性能警告）
- 包含 `t()` 调用的 form validation rules 必须用 `computed` 而非 `reactive`（保持语言切换响应式）
- 复杂逻辑抽取为 `composables/useXxx.js`
- API 调用集中在 `src/api/`，不在组件内直接写 axios
- 常量集中在 `src/constants/`，不在组件内硬编码

## 10. 类似功能命名一致性

| 功能类型 | 命名模式 | 示例 |
|----------|----------|------|
| 列表页 | XxxList.vue | `ArticleList.vue`、`CapsuleList.vue`、`SquareList.vue` |
| 详情页 | XxxDetail.vue | `ArticleDetail.vue`、`CapsuleDetail.vue`、`SquareDetail.vue` |
| 创建页 | XxxCreate.vue | `CapsuleCreate.vue`、`SquareCreate.vue` |
| 表单 | XxxForm.vue | `LoginForm.vue`、`RegisterForm.vue` |
| 卡片 | XxxCard.vue | `InitialAvatar.vue`（头像组件） |
| 布局 | XxxLayout.vue / XxxNavbar.vue | `MainLayout.vue`、`Navbar.vue` |
| 登录方式 | XxxLogin.vue | `AccountPasswordLogin.vue`、`PhoneLogin.vue`、`EmailLogin.vue` |

## 11. 工具链使用

```bash
# ESLint 检查并自动修复
npm run lint

# ESLint 仅检查（不修改）
npm run lint:check

# Prettier 格式化
npm run format

# Prettier 仅检查
npm run format:check

# Stylelint 检查并修复
npm run lint:style

# Stylelint 仅检查
npm run lint:style:check
```

- 提交前运行 `npm run lint:check && npm run format:check` 确保代码规范
- IDE 推荐 VSCode + Volar + ESLint + Prettier 插件
- `.editorconfig` 保证不同编辑器一致的缩进和换行
