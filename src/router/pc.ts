import type { RouteRecordRaw } from 'vue-router'

/**
 * PC 路由表。
 * - 路由 name 保持与旧版一致，现有 router.push({ name }) 零改动
 * - 全部懒加载；页面文件按「模块名 + View」命名规范
 */
export const pcRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/pc/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomePageView.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
      // ---- 时光胶囊 ----
      {
        path: 'time-capsule',
        name: 'time-capsule',
        component: () => import('@/modules/time-capsule/views/CapsuleListView.vue'),
      },
      {
        path: 'time-capsule/create',
        name: 'capsule-create',
        component: () => import('@/modules/time-capsule/views/CapsuleCreateView.vue'),
      },
      {
        path: 'time-capsule/:id',
        name: 'capsule-detail',
        component: () => import('@/modules/time-capsule/views/CapsuleDetailView.vue'),
      },
      // ---- 心事广场 ----
      {
        path: 'square',
        name: 'square',
        component: () => import('@/modules/square/views/SquareListView.vue'),
      },
      {
        path: 'square/create',
        name: 'square-create',
        component: () => import('@/modules/square/views/SquareCreateView.vue'),
      },
      {
        path: 'square/:id',
        name: 'square-detail',
        component: () => import('@/modules/square/views/SquareDetailView.vue'),
      },
      // ---- 心理测评 ----
      {
        path: 'assessment',
        name: 'assessment',
        component: () => import('@/views/AssessmentCenterView.vue'),
      },
      {
        path: 'assessment/take/:id',
        name: 'assessment-take',
        component: () => import('@/views/AssessmentTakeView.vue'),
        meta: { hideNavbar: true, hideFooter: true },
      },
      // ---- 心晴阅读 ----
      {
        path: 'articles',
        name: 'articles',
        component: () => import('@/views/ArticleCenterView.vue'),
      },
      {
        path: 'articles/list',
        name: 'article-list',
        component: () => import('@/views/ArticleListView.vue'),
      },
      {
        path: 'articles/:id',
        name: 'article-detail',
        component: () => import('@/views/ArticleDetailView.vue'),
      },
      // ---- 咨询中心 ----
      {
        path: 'counseling',
        name: 'counseling',
        component: () => import('@/views/CounselingCenterView.vue'),
      },
      {
        path: 'counseling/ai-chat',
        name: 'counseling-ai-chat',
        component: () => import('@/views/AiConsultView.vue'),
      },
      {
        path: 'counseling/companion',
        name: 'counseling-companion',
        component: () => import('@/views/AiCompanionView.vue'),
      },
      // ---- 用户 ----
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/SettingsView.vue'),
        meta: { requiresAuth: true },
      },
      // ---- 登录（旧版在 MainLayout 内以透明导航呈现，保持一致） ----
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
      // ---- 404 兜底（子路径 catch-all 覆盖全部未匹配路由） ----
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue'),
        meta: { hideNavbar: true, hideFooter: true },
      },
    ],
  },
]
