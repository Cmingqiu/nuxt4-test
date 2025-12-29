/**
 * API 插件 - 创建全局 $api 实例
 * 
 * 功能：
 * - 统一 baseURL 管理
 * - 自动携带认证 token
 * - 统一请求/响应拦截
 * - 统一错误处理
 */

import type { ApiError, ApiResponse } from '~/types/api'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl as string

  const api = $fetch.create({
    baseURL,
    
    // 请求拦截器
    onRequest({ options }) {
      // 获取 token（支持 SSR）
      const token = useCookie('token')
      
      // 设置默认请求头
      const headers = options.headers ||= new Headers()
      
      // 添加 Content-Type
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
      }
      
      // 添加认证 token
      if (token.value) {
        headers.set('Authorization', `Bearer ${token.value}`)
      }
      
      // 可以添加其他通用请求头
      // headers.set('X-Request-Id', generateRequestId())
    },
    
    // 请求错误拦截器
    onRequestError({ error }) {
      // 网络错误、请求被取消等
      console.error('[API Request Error]', error.message)
    },
    
    // 响应拦截器
    onResponse({ response }) {
      // 可以在这里处理响应数据
      // 比如：自动解包 { code, data, message } 格式
      const data = response._data as ApiResponse
      
      // 业务逻辑错误（code 不为 0 或 200）
      if (data && typeof data.code === 'number' && data.code !== 0 && data.code !== 200) {
        // 这里可以根据业务需求决定是否抛出错误
        console.warn('[API Business Error]', data.message)
      }
    },
    
    // 响应错误拦截器
    onResponseError({ response }) {
      const status = response.status
      const data = response._data as ApiError | undefined
      
      // 根据状态码处理不同错误
      switch (status) {
        case 401:
          // 未授权 - 清除 token 并跳转登录
          const token = useCookie('token')
          token.value = null
          
          // 只在客户端跳转
          if (import.meta.client) {
            navigateTo('/login')
          }
          break
          
        case 403:
          // 无权限
          console.error('[API] 无访问权限')
          break
          
        case 404:
          // 资源不存在
          console.error('[API] 请求的资源不存在')
          break
          
        case 500:
        case 502:
        case 503:
          // 服务器错误
          console.error('[API] 服务器错误，请稍后重试')
          break
          
        default:
          console.error('[API Error]', data?.message || '请求失败')
      }
    }
  })

  // 暴露给整个应用使用
  return {
    provide: {
      api
    }
  }
})

// 为 $api 添加类型声明
declare module '#app' {
  interface NuxtApp {
    $api: typeof $fetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: typeof $fetch
  }
}

