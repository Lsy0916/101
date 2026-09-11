import type { RouteRecordRaw } from 'vue-router'

/**
 * 移动端路由表。
 * 【过渡态】Q4 决议：阶段 3 移动端复用现有响应式视图（组件与 PC 相同），
 * 路由 name 保持与 PC 一致；后续逐页替换为 Vant 版组件，
 * 届时两端路由表各自独立演化（移动端将引入 tabbar 主页结构）。
 */
export const mobileRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/mobile/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomePageView.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
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
      {
        path: 'counseling',
        name: 'counseling',
        component: () => import('@/views/CounselingCenterView.vue'),
      },
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
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login/LoginView.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue'),
        meta: { hideNavbar: true, hideFooter: true },
      },
    ],
  },
]
