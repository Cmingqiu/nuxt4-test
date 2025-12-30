/**
 * useErrorHandler - 统一的错误处理 Composable
 *
 * 提供：
 * - 异步操作错误捕获
 * - Toast 消息提示
 * - 错误状态管理
 * - 重试机制
 */

import type { FetchError } from 'ofetch';
import type { ApiError } from '~/types/api';

// Toast 消息类型
export type ToastType = 'success' | 'error' | 'warning' | 'info';

// Toast 消息
export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
}

// 全局 Toast 状态
const toasts = ref<ToastMessage[]>([]);

// 生成唯一 ID
function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Toast 消息管理
 */
export function useToast() {
  /**
   * 显示 Toast 消息
   */
  const show = (options: Omit<ToastMessage, 'id'>): string => {
    const id = generateId();
    const toast: ToastMessage = {
      id,
      closable: true,
      duration: 4000,
      ...options
    };

    toasts.value.push(toast);

    // 自动关闭
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        close(id);
      }, toast.duration);
    }

    return id;
  };

  /**
   * 关闭 Toast
   */
  const close = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  /**
   * 关闭所有 Toast
   */
  const closeAll = () => {
    toasts.value = [];
  };

  // 便捷方法
  const success = (title: string, message?: string) =>
    show({ type: 'success', title, message });

  const error = (title: string, message?: string) =>
    show({ type: 'error', title, message, duration: 6000 });

  const warning = (title: string, message?: string) =>
    show({ type: 'warning', title, message });

  const info = (title: string, message?: string) =>
    show({ type: 'info', title, message });

  return {
    toasts: readonly(toasts),
    show,
    close,
    closeAll,
    success,
    error,
    warning,
    info
  };
}

/**
 * 解析错误信息
 */
export function parseError(error: unknown): {
  message: string;
  statusCode?: number;
  details?: Record<string, unknown>;
} {
  // FetchError (ofetch)
  if (error && typeof error === 'object' && 'data' in error) {
    const fetchError = error as FetchError<ApiError>;
    const data = fetchError.data;

    if (data) {
      return {
        message: data.message || fetchError.message || '请求失败',
        statusCode: fetchError.statusCode,
        details: data.details
      };
    }

    return {
      message: fetchError.message || '请求失败',
      statusCode: fetchError.statusCode
    };
  }

  // Nuxt Error
  if (error && typeof error === 'object' && 'statusCode' in error) {
    const nuxtError = error as {
      statusCode: number;
      statusMessage?: string;
      message?: string;
    };
    return {
      message: nuxtError.statusMessage || nuxtError.message || '发生错误',
      statusCode: nuxtError.statusCode
    };
  }

  // 标准 Error
  if (error instanceof Error) {
    return {
      message: error.message || '发生错误'
    };
  }

  // 字符串错误
  if (typeof error === 'string') {
    return { message: error };
  }

  // 未知错误
  return { message: '发生未知错误' };
}

/**
 * 获取用户友好的错误消息
 */
export function getFriendlyErrorMessage(
  statusCode?: number,
  fallback?: string
): string {
  if (!statusCode) {
    return fallback || '发生未知错误';
  }

  const messages: Record<number, string> = {
    400: '请求参数错误',
    401: '请先登录',
    403: '没有访问权限',
    404: '请求的资源不存在',
    405: '请求方法不支持',
    408: '请求超时',
    409: '数据冲突',
    410: '资源已被删除',
    413: '上传文件过大',
    422: '数据验证失败',
    429: '请求过于频繁，请稍后再试',
    500: '服务器内部错误',
    502: '网关错误',
    503: '服务暂时不可用',
    504: '网关超时'
  };

  return messages[statusCode] || fallback || '发生未知错误';
}

/**
 * 错误边界 Hook
 *
 * @example
 * ```ts
 * const { execute, loading, error, data } = useAsyncError(
 *   async () => await $api('/users'),
 *   { showError: true }
 * );
 *
 * // 执行
 * await execute();
 * ```
 */
export function useAsyncError<T>(
  asyncFn: () => Promise<T>,
  options: {
    showError?: boolean;
    retries?: number;
    retryDelay?: number;
    onError?: (error: unknown) => void;
    onSuccess?: (data: T) => void;
  } = {}
) {
  const {
    showError = true,
    retries = 0,
    retryDelay = 1000,
    onError,
    onSuccess
  } = options;

  const loading = ref(false);
  const error = ref<unknown>(null);
  const data = ref<T | null>(null);
  const retryCount = ref(0);

  const toast = useToast();

  const execute = async (): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    retryCount.value = 0;

    const attemptExecute = async (): Promise<T> => {
      try {
        const result = await asyncFn();
        data.value = result;
        onSuccess?.(result);
        return result;
      } catch (e) {
        retryCount.value++;

        // 重试逻辑
        if (retryCount.value <= retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return attemptExecute();
        }

        throw e;
      }
    };

    try {
      return await attemptExecute();
    } catch (e) {
      error.value = e;
      onError?.(e);

      // 显示错误提示
      if (showError) {
        const parsed = parseError(e);
        const friendlyMessage = getFriendlyErrorMessage(
          parsed.statusCode,
          parsed.message
        );
        toast.error('操作失败', friendlyMessage);
      }

      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    execute,
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    retryCount: readonly(retryCount)
  };
}

/**
 * try-catch 包装器
 *
 * @example
 * ```ts
 * const [result, error] = await tryCatch(() => api.fetchData());
 * if (error) {
 *   console.error(error);
 * } else {
 *   console.log(result);
 * }
 * ```
 */
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * 同步 try-catch 包装器
 */
export function tryCatchSync<T>(fn: () => T): [T, null] | [null, Error] {
  try {
    const result = fn();
    return [result, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * 错误边界组件状态
 */
export function useErrorBoundary() {
  const error = ref<Error | null>(null);
  const hasError = computed(() => error.value !== null);

  const setError = (e: unknown) => {
    error.value = e instanceof Error ? e : new Error(String(e));
  };

  const clearError = () => {
    error.value = null;
  };

  const reset = () => {
    clearError();
  };

  return {
    error: readonly(error),
    hasError,
    setError,
    clearError,
    reset
  };
}
