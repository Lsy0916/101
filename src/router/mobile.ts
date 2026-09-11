import type { RouteRecordRaw } from 'vue-router'

/**
 * 移动端路由表。
 * 【过渡态】Q4 决议：阶段 3 移动端复用现有响应式视图（组件与 PC 相同），
 * 路由 name 保持与 PC 一致；阶段 5 逐页替换为 Vant 版组件，
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
        component: () => import('@/views/HomePage.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
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
      {
        path: 'counseling',
        name: 'counseling',
        component: () => import('@/views/CounselingCenter.vue'),
      },
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
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login/LoginView.vue'),
        meta: { noPadding: true, transparentNavbar: true },
      },
      {
        path: ':pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/404.vue'),
        meta: { hideNavbar: true, hideFooter: true },
      },
    ],
  },
]
