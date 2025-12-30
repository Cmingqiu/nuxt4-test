/**
 * 全局错误处理插件
 *
 * 功能：
 * - 捕获 Vue 组件错误
 * - 捕获异步错误
 * - 统一错误日志
 * - 错误上报（可扩展）
 */

import type { NuxtError } from '#app';

interface ErrorContext {
  type: 'vue' | 'app' | 'unhandled' | 'promise';
  component?: string;
  info?: string;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface ErrorReport {
  error: {
    name: string;
    message: string;
    stack?: string;
  };
  context: ErrorContext;
}

// 错误日志存储（用于调试）
const errorLog: ErrorReport[] = [];

// 最大错误日志数量
const MAX_ERROR_LOG = 50;

/**
 * 格式化错误信息
 */
function formatError(error: unknown): { name: string; message: string; stack?: string } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error
    };
  }

  return {
    name: 'UnknownError',
    message: JSON.stringify(error)
  };
}

/**
 * 创建错误上下文
 */
function createErrorContext(
  type: ErrorContext['type'],
  component?: string,
  info?: string
): ErrorContext {
  return {
    type,
    component,
    info,
    timestamp: Date.now(),
    url: import.meta.client ? window.location.href : '',
    userAgent: import.meta.client ? navigator.userAgent : 'SSR'
  };
}

/**
 * 记录错误
 */
function logError(report: ErrorReport): void {
  // 添加到日志
  errorLog.push(report);

  // 限制日志数量
  if (errorLog.length > MAX_ERROR_LOG) {
    errorLog.shift();
  }

  // 开发环境打印详细信息
  if (import.meta.dev) {
    console.group(`[${report.context.type.toUpperCase()} Error]`);
    console.error('Error:', report.error.message);
    if (report.context.component) {
      console.info('Component:', report.context.component);
    }
    if (report.context.info) {
      console.info('Info:', report.context.info);
    }
    if (report.error.stack) {
      console.debug('Stack:', report.error.stack);
    }
    console.groupEnd();
  }
}

/**
 * 上报错误到服务器（可扩展）
 */
async function reportError(report: ErrorReport): Promise<void> {
  // 开发环境不上报
  if (import.meta.dev) {
    return;
  }

  try {
    // TODO: 替换为实际的错误上报服务
    // 例如: Sentry, LogRocket, 自建服务等
    // await $fetch('/api/errors', {
    //   method: 'POST',
    //   body: report
    // })
  } catch {
    // 上报失败时静默处理
    console.warn('[Error Reporter] Failed to report error');
  }
}

/**
 * 处理错误
 */
function handleError(
  error: unknown,
  type: ErrorContext['type'],
  component?: string,
  info?: string
): void {
  const formattedError = formatError(error);
  const context = createErrorContext(type, component, info);
  const report: ErrorReport = {
    error: formattedError,
    context
  };

  // 记录错误
  logError(report);

  // 上报错误
  reportError(report);
}

/**
 * 获取组件名称
 */
function getComponentName(instance: any): string {
  if (!instance) return 'Unknown';

  // 尝试获取组件名称
  const name =
    instance.type?.name ||
    instance.type?.__name ||
    instance.$options?.name ||
    instance.type?.displayName;

  if (name) return name;

  // 尝试从文件路径获取
  const file = instance.type?.__file;
  if (file) {
    return file.split('/').pop()?.replace('.vue', '') || 'Unknown';
  }

  return 'Anonymous';
}

export default defineNuxtPlugin((nuxtApp) => {
  // 1. Vue 错误处理器
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    const componentName = getComponentName(instance);
    handleError(error, 'vue', componentName, info);
  };

  // 2. Vue 警告处理器（仅开发环境）
  if (import.meta.dev) {
    nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
      const componentName = getComponentName(instance);
      console.warn(`[Vue Warn] ${msg}`);
      if (componentName !== 'Unknown') {
        console.info(`Component: ${componentName}`);
      }
      if (trace) {
        console.debug('Trace:', trace);
      }
    };
  }

  // 3. Nuxt vue:error 钩子
  nuxtApp.hook('vue:error', (error, instance, info) => {
    const componentName = getComponentName(instance);
    handleError(error, 'vue', componentName, info);
  });

  // 4. Nuxt app:error 钩子
  nuxtApp.hook('app:error', (error: NuxtError | Error) => {
    handleError(error, 'app');
  });

  // 5. 客户端全局错误处理
  if (import.meta.client) {
    // 未捕获的错误
    window.addEventListener('error', (event) => {
      // 忽略脚本加载错误
      if (event.message === 'Script error.') {
        return;
      }

      handleError(event.error || event.message, 'unhandled');
    });

    // 未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason, 'promise');
    });
  }

  // 暴露错误处理工具
  return {
    provide: {
      errorHandler: {
        /**
         * 手动报告错误
         */
        report: (error: unknown, context?: Partial<ErrorContext>) => {
          const formattedError = formatError(error);
          const fullContext = {
            ...createErrorContext('app'),
            ...context
          };
          const report: ErrorReport = {
            error: formattedError,
            context: fullContext
          };
          logError(report);
          reportError(report);
        },

        /**
         * 获取错误日志
         */
        getLog: () => [...errorLog],

        /**
         * 清除错误日志
         */
        clearLog: () => {
          errorLog.length = 0;
        }
      }
    }
  };
});

// 类型声明
declare module '#app' {
  interface NuxtApp {
    $errorHandler: {
      report: (error: unknown, context?: Partial<ErrorContext>) => void;
      getLog: () => ErrorReport[];
      clearLog: () => void;
    };
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $errorHandler: {
      report: (error: unknown, context?: Partial<ErrorContext>) => void;
      getLog: () => ErrorReport[];
      clearLog: () => void;
    };
  }
}

