import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/LoginView.vue'
import HomePage from '@/views/HomePage.vue'
import AssessmentCenter from '@/views/AssessmentCenter.vue'
import AssessmentTake from '@/views/AssessmentTake.vue'
import ArticleCenter from '@/views/ArticleCenter.vue'
import ArticleList from '@/views/ArticleList.vue'
import ArticleDetail from '@/views/ArticleDetail.vue'
import CounselingCenter from '@/views/CounselingCenter.vue'
import NotFound from '@/views/404.vue'
import { useAuthStore } from '@/stores/auth'

// 性能优化：路由懒加载
const CapsuleList = () => import('@/modules/time-capsule/views/CapsuleList.vue')
const CapsuleCreate = () => import('@/modules/time-capsule/views/CapsuleCreate.vue')
const CapsuleDetail = () => import('@/modules/time-capsule/views/CapsuleDetail.vue')

const SquareList = () => import('@/modules/square/views/SquareList.vue')
const SquareCreate = () => import('@/modules/square/views/SquareCreate.vue')
const SquareDetail = () => import('@/modules/square/views/SquareDetail.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { noPadding: true, transparentNavbar: true }
    },
    {
      path: '/time-capsule',
      name: 'time-capsule',
      component: CapsuleList
    },
    {
      path: '/time-capsule/create',
      name: 'capsule-create',
      component: CapsuleCreate
    },
    {
      path: '/time-capsule/:id',
      name: 'capsule-detail',
      component: CapsuleDetail
    },
    {
      path: '/square',
      name: 'square',
      component: SquareList
    },
    {
      path: '/square/create',
      name: 'square-create',
      component: SquareCreate
    },
    {
      path: '/square/:id',
      name: 'square-detail',
      component: SquareDetail
    },
    {
      path: '/assessment',
      name: 'assessment',
      component: AssessmentCenter
    },
    {
      path: '/assessment/take/:id',
      name: 'assessment-take',
      component: AssessmentTake,
      meta: { hideNavbar: true, hideFooter: true }
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticleCenter
    },
    {
      path: '/articles/list',
      name: 'article-list',
      component: ArticleList
    },
    {
      path: '/articles/:id',
      name: 'article-detail',
      component: ArticleDetail
    },
    {
      path: '/counseling',
      name: 'counseling',
      component: CounselingCenter
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/Settings.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: false, noPadding: true, transparentNavbar: true }
    },
    // 404 兜底路由（必须放在最后）
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: { hideNavbar: true, hideFooter: true }
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时返回顶部（如有 savedPosition 则恢复）
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  authStore.refreshAuthStatus()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
