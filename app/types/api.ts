/**
 * API 相关类型定义
 */

// 统一的 API 响应格式
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// API 错误响应格式
export interface ApiError {
  code: number
  message: string
  details?: Record<string, unknown>
}

// 分页请求参数
export interface PaginationParams {
  page?: number
  pageSize?: number
  // 支持其他排序参数
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 分页响应数据
export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 常用的请求方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// 请求配置扩展
export interface RequestConfig {
  // 是否显示 loading
  showLoading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 自定义错误处理
  onError?: (error: ApiError) => void
  // 请求超时时间（毫秒）
  timeout?: number
  // 是否需要认证
  requireAuth?: boolean
}

