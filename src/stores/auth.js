// 认证 Store
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {loginApi, UserInfoByIdApi} from '@/api/user'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref({})
  const roleId = ref('')
  const rememberMe = ref(false)

  // 初始化用户信息
  const storedUserInfo = localStorage.getItem('userInfo')

  if (storedUserInfo) {
    try {
      userInfo.value = JSON.parse(storedUserInfo)

      // 从userInfo中提取roleId
      roleId.value = userInfo.value.roleId || ''
    } catch (e) {
      console.error('解析用户信息失败', e)
      userInfo.value = {}
      roleId.value = ''
    }
  }

  // 检查是否记住登录信息
  const savedUserId = localStorage.getItem('savedUserId')
  const savedPassword = localStorage.getItem('savedPassword')
  if (savedUserId && savedPassword) {
    rememberMe.value = true
  }

  // 监听状态变化，自动保存到localStorage
  watch([token, userInfo, roleId], () => {
    if (token.value) {
      localStorage.setItem('token', token.value)
    } else {
      localStorage.removeItem('token')
    }

    if (Object.keys(userInfo.value).length > 0) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    } else {
      localStorage.removeItem('userInfo')
    }

    if (roleId.value) {
      // roleId通常包含在userInfo中，这里单独保存是为了方便访问
    }
  }, { deep: true })

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)
  const isStudent = computed(() => roleId.value === 'student')
  const isTeacher = computed(() => roleId.value === 'teacher')
  const isAdmin = computed(() => roleId.value === 'admin')
  // 用户信息
  const userDate = ref('')
  // 登录方法
  const login = async (loginData) => {
    try {
      // 临时：跳过 API 校验，直接登录用于查看效果
      const mockToken = 'mock-token-' + Date.now()
      const mockUserInfo = {
        name: loginData.userId || loginData.phone || loginData.email || '测试用户',
        roleId: loginData.roleId || 'student',
        userId: loginData.userId || '',
        school: loginData.school || ''
      }

      token.value = mockToken
      userInfo.value = mockUserInfo
      roleId.value = loginData.roleId || 'student'

      localStorage.setItem('token', mockToken)
      localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))

      return {
        success: true,
        data: {
          token: mockToken,
          userInfo: mockUserInfo,
          roleId: roleId.value
        },
        message: '登录成功'
      }
    } catch (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: '登录过程中发生错误'
      }
    }
  }

  // 注册方法
  const register = async (registerData) => {
    try {
      // 模拟注册API调用
      // 在实际项目中，这里应该调用真实的注册API
      // const response = await registerApi(registerData)
      
      // 模拟API响应
      const response = {
        status: 200,
        data: {
          message: '注册成功',
          userId: registerData.userId
        }
      }
      
      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || '注册成功'
        }
      } else {
        return {
          success: false,
          message: response?.message || '注册失败'
        }
      }
    } catch (error) {
      console.error('注册失败:', error)
      let errorMessage = '注册过程中发生错误'
      if (error.message) {
        if (error.message.includes('500')) {
          errorMessage = '服务器内部错误，请稍后再试'
        } else if (error.message.includes('409')) {
          errorMessage = '用户已存在'
        } else if (error.message.includes('400')) {
          errorMessage = '注册信息格式不正确'
        } else {
          errorMessage = error.message
        }
      }
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }
  
  // 忘记密码方法
  const forgotPassword = async (forgotPasswordData) => {
    try {
      // 模拟忘记密码API调用
      // 在实际项目中，这里应该调用真实的忘记密码API
      // const response = await forgotPasswordApi(forgotPasswordData)
      
      // 模拟API响应
      const response = {
        status: 200,
        data: {
          message: '密码重置成功'
        }
      }
      
      if (response.status === 200) {
        return {
          success: true,
          message: response.data.message || '密码重置成功'
        }
      } else {
        return {
          success: false,
          message: response?.message || '密码重置失败'
        }
      }
    } catch (error) {
      console.error('密码重置失败:', error)
      let errorMessage = '密码重置过程中发生错误'
      if (error.message) {
        if (error.message.includes('500')) {
          errorMessage = '服务器内部错误，请稍后再试'
        } else if (error.message.includes('404')) {
          errorMessage = '用户不存在'
        } else {
          errorMessage = error.message
        }
      }
      
      return {
        success: false,
        message: errorMessage
      }
    }
  }
  
  // 登出方法
  const logout = () => {
    token.value = ''
    userInfo.value = {}
    roleId.value = ''
    userDate.value = ''
    rememberMe.value = false

    // 清除 localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    // 清除缓存
    localStorage.removeItem('authStatus')
    // 刷新页面
    window.location.reload()
  }

  // 获取用户信息
  const getUserInfoById = async (userId) => {
    try {
      // 检查userId参数
      if (!userId) {
        throw new Error('请提供有效的用户ID')
      }

      // 生成userId对象
      userId = { userId: userId }

      const response = await UserInfoByIdApi(userId, roleId.value)

      // 检查响应状态
      if (response && (response.status === 200 || response.success === true)) {
        userDate.value = response.data

        return {
          success: true,
          data: userDate.value,
          message: '获取用户信息成功'
        }
      } else {
        throw new Error(response?.message || '获取用户信息失败')
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 根据错误类型提供更具体的错误信息
      let errorMessage = '获取用户信息失败'
      if (error.message) {
        if (error.message.includes('500')) {
          errorMessage = '服务器内部错误，请稍后再试'
        } else if (error.message.includes('404')) {
          errorMessage = '请求的资源不存在'
        } else if (error.message.includes('网络错误')) {
          errorMessage = '网络连接失败，请检查网络设置'
        } else {
          errorMessage = error.message
        }
      }

      return {
        success: false,
        message: errorMessage
      }
    }
  }

  // 页面刷新时保持登录状态的方法
  const refreshAuthStatus = () => {
    const storedToken = localStorage.getItem('token')
    const storedUserInfo = localStorage.getItem('userInfo')

    if (storedToken && storedUserInfo) {
      token.value = storedToken
      try {
        userInfo.value = JSON.parse(storedUserInfo)
        roleId.value = userInfo.value.roleId || ''
      } catch (e) {
        console.error('解析存储的用户信息时出错:', e)
        userInfo.value = {}
        roleId.value = ''
      }
    }
  }

  return {
    token,
    userInfo,
    roleId,
    userDate,
    rememberMe,
    isLoggedIn,
    isStudent,
    isTeacher,
    isAdmin,
    login,
    logout,
    register,
    forgotPassword,
    getUserInfoById,
    refreshAuthStatus
  }
})
