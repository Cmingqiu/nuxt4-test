/**
 * API 插件 - 创建全局 $api 实例
 *
 * 功能：
 * - 统一 baseURL 管理
 * - 自动携带认证 token
 * - 统一请求/响应拦截
 * - 统一错误处理
 * - 用户友好的错误提示
 */

import type { ApiError, ApiResponse } from '~/types/api';
import {
  getFriendlyErrorMessage,
  useToast
} from '~/composables/useErrorHandler';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiUrl as string;
  const toast = useToast();

  const api = $fetch.create({
    baseURL,

    // 请求拦截器
    onRequest({ options }) {
      // 获取 token（支持 SSR）
      const token = useCookie('token');

      // 设置默认请求头
      const headers = (options.headers ||= new Headers());

      // 添加 Content-Type
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      // 添加认证 token
      if (token.value) {
        headers.set('Authorization', `Bearer ${token.value}`);
      }

      // 可以添加其他通用请求头
      // headers.set('X-Request-Id', generateRequestId())
    },

    // 请求错误拦截器
    onRequestError({ error }) {
      // 网络错误、请求被取消等
      console.error('[API Request Error]', error.message);

      // 只在客户端显示网络错误提示
      if (import.meta.client) {
        toast.error('网络错误', '请检查网络连接后重试');
      }
    },

    // 响应拦截器
    onResponse({ response }) {
      // 可以在这里处理响应数据
      // 比如：自动解包 { code, data, message } 格式
      const data = response._data as ApiResponse;

      // 业务逻辑错误（code 不为 0 或 200）
      if (
        data &&
        typeof data.code === 'number' &&
        data.code !== 0 &&
        data.code !== 200
      ) {
        // 这里可以根据业务需求决定是否抛出错误
        console.warn('[API Business Error]', data.message);

        // 显示业务错误提示
        if (import.meta.client && data.message) {
          toast.warning('操作提示', data.message);
        }
      }
    },

    // 响应错误拦截器
    onResponseError({ response, options }) {
      const status = response.status;
      const data = response._data as ApiError | undefined;

      // 获取请求配置中的 showError 选项（默认为 true）
      const showError = (options as any).showError !== false;

      // 根据状态码处理不同错误
      switch (status) {
        case 401:
          // 未授权 - 清除 token 并跳转登录
          const token = useCookie('token');
          token.value = null;

          // 只在客户端跳转
          if (import.meta.client) {
            // 保存当前路径，登录后可以跳转回来
            const redirectPath = window.location.pathname;
            if (redirectPath !== '/login') {
              sessionStorage.setItem('redirectAfterLogin', redirectPath);
            }

            // 显示提示
            if (showError) {
              toast.warning('登录已过期', '请重新登录');
            }

            navigateTo('/login');
          }
          break;

        case 403:
          // 无权限
          console.error('[API] 无访问权限');
          if (import.meta.client && showError) {
            toast.error('权限不足', '您没有权限执行此操作');
          }
          break;

        case 404:
          // 资源不存在
          console.error('[API] 请求的资源不存在');
          if (import.meta.client && showError) {
            toast.error('资源不存在', '请求的数据不存在或已被删除');
          }
          break;

        case 422:
          // 数据验证错误
          console.error('[API] 数据验证失败', data);
          if (import.meta.client && showError) {
            const message = data?.message || '请检查输入数据';
            toast.warning('验证失败', message);
          }
          break;

        case 429:
          // 请求频率限制
          console.error('[API] 请求过于频繁');
          if (import.meta.client && showError) {
            toast.warning('请求频繁', '请稍后再试');
          }
          break;

        case 500:
        case 502:
        case 503:
          // 服务器错误
          console.error('[API] 服务器错误，请稍后重试');
          if (import.meta.client && showError) {
            toast.error('服务器错误', '服务器遇到了问题，请稍后重试');
          }
          break;

        case 504:
          // 网关超时
          console.error('[API] 网关超时');
          if (import.meta.client && showError) {
            toast.error('请求超时', '服务器响应超时，请稍后重试');
          }
          break;

        default:
          console.error('[API Error]', data?.message || '请求失败');
          if (import.meta.client && showError) {
            const message =
              data?.message || getFriendlyErrorMessage(status, '请求失败');
            toast.error('请求失败', message);
          }
      }
    }
  });

  // 暴露给整个应用使用
  return {
    provide: {
      api
    }
  };
});

// 为 $api 添加类型声明
declare module '#app' {
  interface NuxtApp {
    $api: typeof $fetch;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: typeof $fetch;
  }
}
