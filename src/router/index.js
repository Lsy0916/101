import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/login/LoginView.vue'
import HomePage from '@/views/HomePage.vue'
import AssessmentCenter from '@/views/AssessmentCenter.vue'
import AssessmentTake from '@/views/AssessmentTake.vue'
import { useAuthStore } from '@/stores/auth'

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
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: false, noPadding: true, transparentNavbar: true }
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  // 在路由守卫中也刷新一次状态确保是最新的
  authStore.refreshAuthStatus()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 如果需要登录权限，但当前未登录，则重定向到登录页面
    next({ name: 'login' })
  } else {
    // 否则，继续导航
    next()
  }
})

export default router
