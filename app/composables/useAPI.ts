/**
 * useAPI - 统一的 API 请求封装
 *
 * 基于 useFetch 封装，提供：
 * - 统一的类型推断
 * - 自动使用 $api 实例（带拦截器）
 * - 自动解包响应数据（data.value 直接是业务数据）
 * - 便捷的快捷方法
 */

import type { FetchError } from 'ofetch';
import type { UseFetchOptions } from 'nuxt/app';
import type {
  ApiResponse,
  ApiError,
  PaginatedData,
  PaginationParams
} from '~/types/api';
import { extractFilename, triggerDownload } from '~/utils/downloads';

type PickFrom<T, K extends Array<string>> = T extends Array<any>
  ? T
  : T extends Record<string, any>
  ? keyof T extends K[number]
    ? T
    : K[number] extends never
    ? T
    : Pick<T, K[number] & keyof T>
  : T;

type KeysOf<T> = Array<
  T extends T ? (keyof T extends string ? keyof T : never) : never
>;

// 扩展选项类型，支持自定义 transform
type UseAPIOptions<T> = Omit<UseFetchOptions<T>, 'transform'> & {
  // 是否保留原始响应格式（不解包）
  raw?: boolean;
};

/**
 * 通用 API 请求
 * @param url 请求地址
 * @param options useFetch 配置选项
 * @returns AsyncData 响应
 *
 * @example
 * ```ts
 * // 基础用法 - data.value 直接是 User 类型
 * const { data, status, error } = await useAPI<User>('/users/1')
 * console.log(data.value?.name) // 直接访问
 *
 * // POST 请求
 * const { data } = await useAPI<User>('/users', {
 *   method: 'POST',
 *   body: { name: 'John' }
 * })
 *
 * // 如需原始响应格式 { code, data, message }
 * const { data } = await useAPI<User>('/users/1', { raw: true })
 * console.log(data.value?.code, data.value?.data, data.value?.message)
 * ```
 */
export function useAPI<T = unknown>(
  url: string | (() => string),
  options?: UseAPIOptions<T>
) {
  const { raw = false, ...restOptions } = options || {};

  return useFetch<ApiResponse<T>, FetchError<ApiError>, string, any, T>(url, {
    ...restOptions,
    $fetch: useNuxtApp().$api,
    // 自动解包：将 { code, data, message } 转换为直接返回 data
    transform: raw ? undefined : (response: ApiResponse<T>) => response.data
  } as any);
}

/**
 * GET 请求快捷方法
 *
 * @example
 * ```ts
 * const { data } = await useGet<User[]>('/users', { role: 'admin' })
 * console.log(data.value) // User[] 类型
 * ```
 */
export function useGet<T = unknown>(
  url: string | (() => string),
  query?: Record<string, any>,
  options?: Omit<UseAPIOptions<T>, 'method' | 'query'>
) {
  return useAPI<T>(url, {
    method: 'GET',
    query,
    ...options
  });
}

/**
 * POST 请求快捷方法
 *
 * @example
 * ```ts
 * const { data } = await usePost<User>('/users', { name: 'John' })
 * console.log(data.value?.id) // 新创建用户的 ID
 * ```
 */
export function usePost<T = unknown>(
  url: string | (() => string),
  body?: Record<string, any>,
  options?: Omit<UseAPIOptions<T>, 'method' | 'body'>
) {
  return useAPI<T>(url, {
    method: 'POST',
    body,
    ...options
  });
}

/**
 * PUT 请求快捷方法
 */
export function usePut<T = unknown>(
  url: string | (() => string),
  body?: Record<string, any>,
  options?: Omit<UseAPIOptions<T>, 'method' | 'body'>
) {
  return useAPI<T>(url, {
    method: 'PUT',
    body,
    ...options
  });
}

/**
 * DELETE 请求快捷方法
 */
export function useDelete<T = unknown>(
  url: string | (() => string),
  options?: Omit<UseAPIOptions<T>, 'method'>
) {
  return useAPI<T>(url, {
    method: 'DELETE',
    ...options
  });
}

/**
 * PATCH 请求快捷方法
 */
export function usePatch<T = unknown>(
  url: string | (() => string),
  body?: Record<string, any>,
  options?: Omit<UseAPIOptions<T>, 'method' | 'body'>
) {
  return useAPI<T>(url, {
    method: 'PATCH',
    body,
    ...options
  });
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
 * // data.value 直接是 PaginatedData<User> 类型
 * console.log(data.value?.list)   // User[]
 * console.log(data.value?.total)  // 总数
 * ```
 */
export function usePageList<T = unknown>(
  url: string | (() => string),
  params?: PaginationParams & Record<string, any>,
  options?: Omit<UseAPIOptions<PaginatedData<T>>, 'query'>
) {
  return useAPI<PaginatedData<T>>(url, {
    query: params,
    ...options
  });
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
  options?: Omit<UseAPIOptions<T>, 'lazy'>
) {
  return useAPI<T>(url, {
    lazy: true,
    ...options
  });
}

/**
 * 仅客户端请求 - 不在服务端执行
 *
 * @example
 * ```ts
 * const { data } = useClientAPI<UserPreferences>('/user/preferences')
 * ```
 */
export function useClientAPI<T = unknown>(
  url: string | (() => string),
  options?: Omit<UseAPIOptions<T>, 'server'>
) {
  return useAPI<T>(url, {
    server: false,
    ...options
  });
}

/**
 * 原始响应请求 - 返回完整的 { code, data, message } 格式
 *
 * @example
 * ```ts
 * const { data } = await useRawAPI<User>('/users/1')
 * console.log(data.value?.code)    // 状态码
 * console.log(data.value?.data)    // 业务数据
 * console.log(data.value?.message) // 消息
 * ```
 */
export function useRawAPI<T = unknown>(
  url: string | (() => string),
  options?: Omit<UseAPIOptions<T>, 'raw'>
) {
  return useAPI<T>(url, {
    raw: true,
    ...options
  } as any);
}

// ============================================
// 文件下载相关
// ============================================

interface DownloadOptions {
  /** 下载后的文件名（如不指定，从响应头或URL中提取） */
  filename?: string;
  /** 请求方法，默认 GET */
  method?: 'GET' | 'POST';
  /** POST 请求体 */
  body?: Record<string, any>;
  /** 查询参数 */
  query?: Record<string, any>;
  /** 下载进度回调（注意：使用此选项会降级为原生 fetch） */
  onProgress?: (progress: {
    loaded: number;
    total: number;
    percent: number;
  }) => void;
  /** 下载前回调，返回 false 取消下载 */
  onBefore?: () => boolean | void;
  /** 下载成功回调 */
  onSuccess?: (filename: string) => void;
  /** 下载失败回调 */
  onError?: (error: Error) => void;
}

/**
 * 下载文件 - 使用 $api 实例（复用拦截器和配置）
 *
 * 注意：
 * - 默认使用 $api（ofetch），复用统一的 baseURL、token、拦截器
 * - 如果需要进度回调，会自动降级为原生 fetch（因为 ofetch 不支持流式读取）
 *
 * @example
 * ```ts
 * // 基础用法（使用 $api）
 * await downloadFile('/files/report.pdf');
 *
 * // 指定文件名
 * await downloadFile('/files/123', { filename: '报告.pdf' });
 *
 * // POST 请求下载（适用于需要传参的导出）
 * await downloadFile('/export/users', {
 *   method: 'POST',
 *   body: { ids: [1, 2, 3], format: 'xlsx' },
 *   filename: '用户列表.xlsx'
 * });
 *
 * // 带进度回调（自动降级为原生 fetch）
 * await downloadFile('/files/large-file.zip', {
 *   onProgress: ({ percent }) => console.log(`下载进度: ${percent}%`)
 * });
 * ```
 */
export async function downloadFile(
  url: string,
  options: DownloadOptions = {}
): Promise<void> {
  const {
    filename,
    method = 'GET',
    body,
    query,
    onProgress,
    onBefore,
    onSuccess,
    onError
  } = options;

  // 下载前回调
  if (onBefore && onBefore() === false) {
    return;
  }

  try {
    let blob: Blob;
    let downloadFilename = filename;

    // 如果需要进度回调，使用原生 fetch（因为 ofetch 不支持流式读取）
    if (onProgress) {
      const result = await downloadWithProgress(url, {
        method,
        body,
        query,
        onProgress
      });
      blob = result.blob;
      downloadFilename = filename || result.filename;
    } else {
      // 使用 $api（ofetch）- 复用拦截器
      const $api = useNuxtApp().$api;

      const response = await $api.raw(url, {
        method,
        body,
        query,
        responseType: 'blob'
      });

      blob = response._data as Blob;
      downloadFilename =
        filename ||
        extractFilename(url, response.headers.get('Content-Disposition'));
    }

    // 触发浏览器下载
    triggerDownload(blob, downloadFilename);

    // 成功回调
    onSuccess?.(downloadFilename);
  } catch (error) {
    const err = error instanceof Error ? error : new Error('下载失败');
    onError?.(err);
    throw err;
  }
}

/**
 * 带进度的下载（内部函数，使用原生 fetch）
 */
async function downloadWithProgress(
  url: string,
  options: {
    method: 'GET' | 'POST';
    body?: Record<string, any>;
    query?: Record<string, any>;
    onProgress: NonNullable<DownloadOptions['onProgress']>;
  }
): Promise<{ blob: Blob; filename: string }> {
  const { method, body, query, onProgress } = options;
  const config = useRuntimeConfig();
  const token = useCookie('token');

  // 构建完整 URL
  let fullUrl = url.startsWith('http') ? url : `${config.public.apiUrl}${url}`;

  // 添加查询参数
  if (query) {
    const params = new URLSearchParams(
      Object.entries(query).map(([k, v]) => [k, String(v)])
    );
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + params.toString();
  }

  // 构建请求头
  const headers: Record<string, string> = {};
  if (token.value) {
    headers['Authorization'] = `Bearer ${token.value}`;
  }
  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  // 发起请求
  const response = await fetch(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    throw new Error(`下载失败: ${response.status} ${response.statusText}`);
  }

  // 获取文件名
  const filename = extractFilename(
    url,
    response.headers.get('Content-Disposition')
  );

  // 处理响应流
  const contentLength = response.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  let loaded = 0;

  const reader = response.body!.getReader();
  const chunks: ArrayBuffer[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value.buffer as ArrayBuffer);
    loaded += value.length;

    if (total > 0) {
      onProgress({
        loaded,
        total,
        percent: Math.round((loaded / total) * 100)
      });
    }
  }

  return {
    blob: new Blob(chunks),
    filename
  };
}

/**
 * 下载文件（响应式封装，带状态管理）
 *
 * @example
 * ```ts
 * const { download, downloading, progress, error } = useDownload();
 *
 * // 在模板中使用
 * // <button @click="() => download('/files/report.pdf')" :disabled="downloading">
 * //   {{ downloading ? `下载中 ${progress}%` : '下载' }}
 * // </button>
 * ```
 */
export function useDownload() {
  const downloading = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);

  const download = async (url: string, options: DownloadOptions = {}) => {
    downloading.value = true;
    progress.value = 0;
    error.value = null;

    try {
      await downloadFile(url, {
        ...options,
        onProgress: p => {
          progress.value = p.percent;
          options.onProgress?.(p);
        }
      });
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('下载失败');
      throw e;
    } finally {
      downloading.value = false;
    }
  };

  return {
    download,
    downloading: readonly(downloading),
    progress: readonly(progress),
    error: readonly(error)
  };
}
