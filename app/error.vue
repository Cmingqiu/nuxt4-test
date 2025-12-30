<template>
  <div class="error-page">
    <div class="error-container">
      <!-- 错误图标 -->
      <div class="error-icon">
        <svg
          v-if="is404"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
        </svg>
        <svg
          v-else-if="is403"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <!-- 错误状态码 -->
      <h1 class="error-code">{{ error?.statusCode || 500 }}</h1>

      <!-- 错误标题 -->
      <h2 class="error-title">{{ errorTitle }}</h2>

      <!-- 错误描述 -->
      <p class="error-description">{{ errorDescription }}</p>

      <!-- 错误详情（开发环境） -->
      <details v-if="isDev && error?.message" class="error-details">
        <summary>查看详细信息</summary>
        <pre>{{ error.message }}</pre>
        <pre v-if="error.stack">{{ error.stack }}</pre>
      </details>

      <!-- 操作按钮 -->
      <div class="error-actions">
        <button class="btn btn-primary" @click="handleGoHome">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          返回首页
        </button>
        <button class="btn btn-secondary" @click="handleGoBack">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          返回上页
        </button>
        <button class="btn btn-ghost" @click="handleRetry">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          重试
        </button>
      </div>
    </div>

    <!-- 装饰背景 -->
    <div class="error-bg">
      <div class="error-bg-shape error-bg-shape-1"></div>
      <div class="error-bg-shape error-bg-shape-2"></div>
      <div class="error-bg-shape error-bg-shape-3"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

// 开发环境标识
const isDev = import.meta.dev;

// 判断错误类型
const is404 = computed(() => props.error?.statusCode === 404);
const is403 = computed(() => props.error?.statusCode === 403);
const is500 = computed(
  () => props.error?.statusCode === 500 || !props.error?.statusCode
);

// 错误标题
const errorTitle = computed(() => {
  const statusCode = props.error?.statusCode;

  const titles: Record<number, string> = {
    400: '请求错误',
    401: '未授权访问',
    403: '禁止访问',
    404: '页面不存在',
    405: '方法不允许',
    408: '请求超时',
    429: '请求过于频繁',
    500: '服务器错误',
    502: '网关错误',
    503: '服务不可用',
    504: '网关超时'
  };

  return titles[statusCode || 500] || props.error?.statusMessage || '发生错误';
});

// 错误描述
const errorDescription = computed(() => {
  const statusCode = props.error?.statusCode;

  const descriptions: Record<number, string> = {
    400: '您的请求格式不正确，请检查后重试。',
    401: '您需要登录后才能访问此页面。',
    403: '抱歉，您没有权限访问此页面。',
    404: '您访问的页面可能已被移动或删除。',
    405: '当前请求方法不被允许。',
    408: '请求时间过长，请检查网络后重试。',
    429: '您的请求过于频繁，请稍后再试。',
    500: '服务器遇到了一个问题，我们正在修复。',
    502: '网关服务暂时不可用，请稍后重试。',
    503: '服务暂时不可用，请稍后重试。',
    504: '网关响应超时，请稍后重试。'
  };

  return descriptions[statusCode || 500] || '发生了意外错误，请稍后重试。';
});

// 返回首页
const handleGoHome = () => {
  clearError({ redirect: '/' });
};

// 返回上一页
const handleGoBack = () => {
  if (window.history.length > 1) {
    clearError();
    window.history.back();
  } else {
    handleGoHome();
  }
};

// 重试（刷新页面）
const handleRetry = () => {
  clearError();
  window.location.reload();
};

// 控制台记录错误信息（方便调试）
if (isDev) {
  console.error('[Error Page]', {
    statusCode: props.error?.statusCode,
    statusMessage: props.error?.statusMessage,
    message: props.error?.message,
    stack: props.error?.stack
  });
}
</script>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: #e2e8f0;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.error-container {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 480px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-icon {
  margin-bottom: 1.5rem;

  svg {
    width: 80px;
    height: 80px;
    color: #f87171;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.error-code {
  font-size: 7rem;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 60px rgba(129, 140, 248, 0.3);
}

.error-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: #f1f5f9;
}

.error-description {
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.error-details {
  margin: 1.5rem 0;
  text-align: left;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);

  summary {
    cursor: pointer;
    color: #94a3b8;
    font-size: 0.875rem;
    padding: 0.5rem;

    &:hover {
      color: #e2e8f0;
    }
  }

  pre {
    margin: 0.5rem 0 0;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 8px;
    font-size: 0.75rem;
    overflow-x: auto;
    color: #fbbf24;
    white-space: pre-wrap;
    word-break: break-word;
  }
}

.error-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:active {
    transform: scale(0.97);
  }
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);

  &:hover {
    box-shadow: 0 6px 30px rgba(99, 102, 241, 0.5);
    transform: translateY(-2px);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.15);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
  }
}

.btn-ghost {
  background: transparent;
  color: #94a3b8;

  &:hover {
    color: #e2e8f0;
    background: rgba(255, 255, 255, 0.05);
  }
}

// 装饰背景
.error-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.error-bg-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}

.error-bg-shape-1 {
  width: 600px;
  height: 600px;
  background: #6366f1;
  top: -200px;
  left: -200px;
  animation: float 20s ease-in-out infinite;
}

.error-bg-shape-2 {
  width: 400px;
  height: 400px;
  background: #ec4899;
  bottom: -100px;
  right: -100px;
  animation: float 15s ease-in-out infinite reverse;
}

.error-bg-shape-3 {
  width: 300px;
  height: 300px;
  background: #8b5cf6;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float 18s ease-in-out infinite 2s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(30px, -30px);
  }
  50% {
    transform: translate(-20px, 20px);
  }
  75% {
    transform: translate(20px, 10px);
  }
}

// 响应式
@media (max-width: 640px) {
  .error-code {
    font-size: 5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .error-actions {
    flex-direction: column;

    .btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
