import type { RouteRecordRaw } from 'vue-router'

/**
 * PC 路由表。
 * - 路由 name 与旧 router/index.js 完全一致，现有 router.push({ name }) 零改动
 * - 全部懒加载（旧版 9 个视图为静态 import，此处一并优化为主包瘦身）
 * - 视图暂指向现有位置（阶段 5 分批搬迁至 views/pc/），meta 语义原样保留
 */
export const pcRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/pc/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomePage.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
      // ---- 时光胶囊 ----
      {
        path: 'time-capsule',
        name: 'time-capsule',
        component: () => import('@/modules/time-capsule/views/CapsuleList.vue'),
      },
      {
        path: 'time-capsule/create',
        name: 'capsule-create',
        component: () => import('@/modules/time-capsule/views/CapsuleCreate.vue'),
      },
      {
        path: 'time-capsule/:id',
        name: 'capsule-detail',
        component: () => import('@/modules/time-capsule/views/CapsuleDetail.vue'),
      },
      // ---- 心事广场 ----
      {
        path: 'square',
        name: 'square',
        component: () => import('@/modules/square/views/SquareList.vue'),
      },
      {
        path: 'square/create',
        name: 'square-create',
        component: () => import('@/modules/square/views/SquareCreate.vue'),
      },
      {
        path: 'square/:id',
        name: 'square-detail',
        component: () => import('@/modules/square/views/SquareDetail.vue'),
      },
      // ---- 心理测评 ----
      {
        path: 'assessment',
        name: 'assessment',
        component: () => import('@/views/AssessmentCenter.vue'),
      },
      {
        path: 'assessment/take/:id',
        name: 'assessment-take',
        component: () => import('@/views/AssessmentTake.vue'),
        meta: { hideNavbar: true, hideFooter: true },
      },
      // ---- 心晴阅读 ----
      {
        path: 'articles',
        name: 'articles',
        component: () => import('@/views/ArticleCenter.vue'),
      },
      {
        path: 'articles/list',
        name: 'article-list',
        component: () => import('@/views/ArticleList.vue'),
      },
      {
        path: 'articles/:id',
        name: 'article-detail',
        component: () => import('@/views/ArticleDetail.vue'),
      },
      // ---- 咨询中心 ----
      {
        path: 'counseling',
        name: 'counseling',
        component: () => import('@/views/CounselingCenter.vue'),
      },
      // ---- 用户 ----
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/Settings.vue'),
        meta: { requiresAuth: true },
      },
      // ---- 登录（旧版在 MainLayout 内以透明导航呈现，保持一致） ----
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login/LoginView.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
      // ---- 404 兜底（子路径 catch-all 覆盖全部未匹配路由） ----
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/404.vue'),
        meta: { hideNavbar: true, hideFooter: true },
      },
    ],
  },
]
