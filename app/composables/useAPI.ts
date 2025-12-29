/**
 * useAPI - 统一的 API 请求封装
 * 
 * 基于 useFetch 封装，提供：
 * - 统一的类型推断
 * - 自动使用 $api 实例（带拦截器）
 * - 支持泛型响应类型
 * - 便捷的快捷方法
 */

import type { FetchError } from 'ofetch'
import type { UseFetchOptions } from 'nuxt/app'
import type { ApiResponse, ApiError, PaginatedData, PaginationParams } from '~/types/api'

type PickFrom<T, K extends Array<string>> = T extends Array<any>
  ? T
  : T extends Record<string, any>
    ? keyof T extends K[number]
      ? T
      : K[number] extends never
        ? T
        : Pick<T, K[number] & keyof T>
    : T

type KeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>

/**
 * 通用 API 请求
 * @param url 请求地址
 * @param options useFetch 配置选项
 * @returns AsyncData 响应
 * 
 * @example
 * ```ts
 * // 基础用法
 * const { data, status, error } = await useAPI<User>('/users/1')
 * 
 * // POST 请求
 * const { data } = await useAPI<User>('/users', {
 *   method: 'POST',
 *   body: { name: 'John' }
 * })
 * ```
 */
export function useAPI<
  ResT = unknown,
  DataT = ApiResponse<ResT>,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = undefined,
>(
  url: string | (() => string),
  options?: UseFetchOptions<ApiResponse<ResT>, DataT, PickKeys, DefaultT>
) {
  return useFetch<ApiResponse<ResT>, FetchError<ApiError>, string, any, DataT, PickKeys, DefaultT>(url, {
    ...options,
    $fetch: useNuxtApp().$api
  })
}

/**
 * GET 请求快捷方法
 */
export function useGet<T = unknown>(
  url: string | (() => string),
  query?: Record<string, any>,
  options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'query'>
) {
  return useAPI<T>(url, {
    method: 'GET',
    query,
    ...options
  })
}

/**
 * POST 请求快捷方法
 */
export function usePost<T = unknown>(
  url: string | (() => string),
  body?: Record<string, any>,
  options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>
) {
  return useAPI<T>(url, {
    method: 'POST',
    body,
    ...options
  })
}

/**
 * PUT 请求快捷方法
 */
export function usePut<T = unknown>(
  url: string | (() => string),
  body?: Record<string, any>,
  options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>
) {
  return useAPI<T>(url, {
    method: 'PUT',
    body,
    ...options
  })
}

/**
 * DELETE 请求快捷方法
 */
export function useDelete<T = unknown>(
  url: string | (() => string),
  options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method'>
) {
  return useAPI<T>(url, {
    method: 'DELETE',
    ...options
  })
}

/**
 * PATCH 请求快捷方法
 */
export function usePatch<T = unknown>(
  url: string | (() => string),
  body?: Record<string, any>,
  options?: Omit<UseFetchOptions<ApiResponse<T>>, 'method' | 'body'>
) {
  return useAPI<T>(url, {
    method: 'PATCH',
    body,
    ...options
  })
}

/**
 * 分页列表请求
 * 
 * @example
 * ```ts
 * const { data, refresh } = await usePageList<User>('/users', {
 *   page: 1,
 *   pageSize: 10,
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc'
 * })
 * 
 * // data.value?.data.list - 用户列表
 * // data.value?.data.total - 总数
 * ```
 */
export function usePageList<T = unknown>(
  url: string | (() => string),
  params?: PaginationParams & Record<string, any>,
  options?: Omit<UseFetchOptions<ApiResponse<PaginatedData<T>>>, 'query'>
) {
  return useAPI<PaginatedData<T>>(url, {
    query: params,
    ...options
  })
}

/**
 * 懒加载请求 - 不阻塞页面渲染
 * 
 * @example
 * ```ts
 * const { data, status } = useLazyAPI<User>('/users/1')
 * // status.value === 'pending' 时显示 loading
 * ```
 */
export function useLazyAPI<T = unknown>(
  url: string | (() => string),
  options?: Omit<UseFetchOptions<ApiResponse<T>>, 'lazy'>
) {
  return useAPI<T>(url, {
    lazy: true,
    ...options
  })
}

/**
 * 仅客户端请求 - 不在服务端执行
 * 
 * @example
 * ```ts
 * // 某些只需要在客户端获取的数据
 * const { data } = useClientAPI<UserPreferences>('/user/preferences')
 * ```
 */
export function useClientAPI<T = unknown>(
  url: string | (() => string),
  options?: Omit<UseFetchOptions<ApiResponse<T>>, 'server'>
) {
  return useAPI<T>(url, {
    server: false,
    ...options
  })
}

