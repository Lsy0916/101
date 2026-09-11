import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题（i18n key） */
    title?: string
    /** 需要登录 */
    requiresAuth?: boolean
    /** 角色白名单（后端权限接口落地后启用） */
    roles?: Array<'student' | 'teacher' | 'admin'>
    /** 移动端：显示底部 tabbar */
    tabbar?: boolean
    /** 布局控制（沿用现有页面 meta 语义） */
    hideNavbar?: boolean
    hideFooter?: boolean
    noPadding?: boolean
    transparentNavbar?: boolean
  }
}
