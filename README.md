<<<<<<< HEAD
<div align="center">
  <img src="https://vuejs.org/images/logo.png" width="100" alt="Vue Logo"/>
  <h1>学校机房上机管理系统</h1>
  <p>基于 Vue 3 + Vite + Element Plus 构建的现代化管理系统</p>
  
  ![Vue.js](https://img.shields.io/badge/Vue.js-3.x-42b883?style=flat-square&logo=vue.js)
  ![Element Plus](https://img.shields.io/badge/Element--Plus-2.x-409eff?style=flat-square&logo=element)
  ![Pinia](https://img.shields.io/badge/Pinia-3.x-yellow?style=flat-square&logo=pinia)
  ![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite)
  ![License](https://img.shields.io/github/license/vuejs/vue?style=flat-square)
</div>

## 📋 项目简介

学校机房上机管理系统是一个专为学校计算机实验室设计的综合管理平台。该系统采用现代化的前端技术栈，提供直观友好的用户界面，支持多角色访问，实现了从机房预约到座位管理的全流程数字化管控。

### 🎯 核心价值

- 提高机房资源利用率
- 简化预约流程，提升用户体验
- 实现精细化管理和数据统计
- 支持多角色协同工作

## 🌟 主要功能

### 👥 多角色权限体系

| 角色 | 权限描述 |
|------|----------|
| **学生** | 查看课表、预约机房座位、查看个人预约记录 |
| **教师** | 管理学生预约、查看课程安排、审核预约申请 |
| **管理员** | 系统配置、用户管理、机房管理、座位管理、预约审核 |

### 🛠️ 核心功能模块

#### 1. 用户认证与权限管理
- JWT Token 认证机制
- 基于角色的访问控制 (RBAC)
- 动态路由权限分配
- 会话管理与自动登出

#### 2. 机房管理
- 机房信息维护（编号、名称、设备配置等）
- 座位数量与状态监控
- 机房使用状态实时查看
- 机房开放时间设置

#### 3. 座位预约系统
- 可视化座位选择界面
- 时间段预约机制
- 座位状态实时更新
- 预约冲突检测

#### 4. 课表管理
- 个性化课程表展示
- 课程时间与机房预约联动
- 课表导入与导出功能

#### 5. 预约审核流程
- 待审核预约列表
- 审核状态跟踪
- 预约修改与取消
- 审核历史记录

### 🎨 界面特色

- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **深色模式** - 护眼夜间模式支持
- ✅ **现代化UI** - 基于 Element Plus 组件库
- ✅ **流畅交互** - 动画过渡效果
- ✅ **数据可视化** - 图表展示统计数据

## 🚀 技术架构

### 核心技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **框架** | [Vue 3](https://vuejs.org/) | 3.5+ | 渐进式 JavaScript 框架 |
| **构建工具** | [Vite](https://vitejs.dev/) | 7.x | 下一代前端构建工具 |
| **状态管理** | [Pinia](https://pinia.vuejs.org/) | 3.x | Vue 官方状态管理库 |
| **UI 组件库** | [Element Plus](https://element-plus.org/) | 2.11+ | Vue 3 组件库 |
| **路由** | [Vue Router](https://router.vuejs.org/) | 4.x | Vue.js 官方路由 |
| **HTTP客户端** | [Axios](https://axios-http.com/) | 1.x | Promise based HTTP client |
| **工具库** | [Day.js](https://day.js.org/) | 1.x | 日期处理库 |
| **Mock服务** | [Mock.js](http://mockjs.com/) | 1.x | 模拟数据生成器 |

### 项目结构概览

```
src/
├── api/              # API接口封装
│   ├── admin.js      # 管理员相关接口
│   ├── captcha.js    # 验证码相关接口
│   ├── reservation.js # 预约相关接口
│   ├── room.js       # 机房相关接口
│   ├── schedule.js   # 课表相关接口
│   └── user.js       # 用户相关接口
├── assets/           # 静态资源文件
│   └── css/          # 全局样式
├── components/       # 全局通用组件
│   └── SeatMap.vue   # 座位地图组件
├── composables/      # 组合式函数
│   └── usePagination.js # 分页组合函数
├── layouts/          # 布局组件
│   └── MainLayout.vue # 主布局
├── router/           # 路由配置
│   └── index.js      # 路由定义与守卫
├── stores/           # 状态管理(Pinia)
│   ├── auth.js       # 认证状态
│   ├── booking.js    # 预约状态
│   └── counter.js    # 示例状态
├── styles/           # 样式文件
│   └── element.css   # Element Plus 样式定制
├── utils/            # 工具函数
│   ├── debounce.js   # 防抖函数
│   ├── emailCode.js  # 邮箱验证码
│   ├── parseUserInfo.js # 用户信息解析
│   ├── request.js    # 请求拦截封装
│   ├── timeUtils.js  # 时间工具函数
│   └── updateData.js # 数据更新工具
└── views/            # 页面视图
    ├── admin/        # 管理员页面
    ├── student/      # 学生页面
    ├── teacher/      # 教师页面
    ├── 404.vue       # 404页面
    └── LoginView.vue # 登录页面
```

## 🛠️ 开发环境搭建

### 系统要求

- Node.js >= 20.19.0 或 >= 22.12.0
- npm 或 pnpm 包管理器
- 现代浏览器 (Chrome/Firefox/Edge 最新版)

### 快速开始

```bash
# 克隆项目
git clone <repository-url>
cd vue

# 安装依赖
npm install
# 或使用 pnpm
# pnpm install

# 启动开发服务器
npm run dev
```

### 构建与部署

```bash
# 生产环境构建
npm run build

# 本地预览构建结果
npm run preview
```

### 推荐开发环境配置

#### 浏览器调试工具

为了更好的开发体验，请安装对应的浏览器调试插件：

**基于 Chromium 的浏览器 (Chrome, Edge, Brave 等):**
- [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
- [在 Chrome DevTools 中开启自定义对象格式化](http://bit.ly/object-formatters)

**Firefox:**
- [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- [在 Firefox DevTools 中开启自定义对象格式化](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## 🔐 测试账户

系统提供以下默认测试账户用于快速体验不同角色功能：

| 角色 | 用户名        | 密码 | 说明 |
|------|------------|------|------|
| 学生 | `user`     | `123456` | 可预约机房座位 |
| 教师 | `teacher` | `123456` | 可管理学生预约 |
| 管理员 | `admin`    | `123456` | 拥有全部管理权限 |

> ⚠️ 注意：这些是默认测试账户，请在生产环境中及时修改密码或删除。


## 📄 License

本项目仅供学习交流使用。

### 开发规范

1. 遵循 [Vue.js 风格指南](https://vuejs.org/style-guide/)
2. 使用 ES6+ 语法
3. 组件命名遵循 PascalCase
4. 提交前运行代码检查
=======
# 101
101
>>>>>>> 55a09d9cfe615e4ce51b4bc8979e7a29b05eb923
