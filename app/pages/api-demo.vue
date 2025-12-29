<!--
  API 封装使用示例页面
  演示各种请求方式和场景
-->
<template>
  <div class="api-demo">
    <h1>API 封装使用示例</h1>

    <!-- 基础 GET 请求示例 -->
    <section class="demo-section">
      <h2>1. 基础请求（内部 API）</h2>
      <div v-if="demoStatus === 'pending'">加载中...</div>
      <div v-else-if="demoError">错误: {{ demoError.message }}</div>
      <pre v-else>{{ demoData }}</pre>
    </section>

    <!-- 外部 API 请求示例 -->
    <section class="demo-section">
      <h2>2. 外部 API 请求（使用 useAPI）</h2>
      <div v-if="usersStatus === 'pending'">加载中...</div>
      <div v-else-if="usersError">错误: {{ usersError.message }}</div>
      <div v-else>
        <p>返回数据：</p>
        <pre>{{ usersData }}</pre>
      </div>
    </section>

    <!-- 懒加载示例 -->
    <section class="demo-section">
      <h2>3. 懒加载请求（不阻塞渲染）</h2>
      <div v-if="lazyStatus === 'pending'">
        <span class="loading">⏳ 后台加载中...</span>
      </div>
      <pre v-else>{{ lazyData }}</pre>
    </section>

    <!-- 手动触发请求示例 -->
    <section class="demo-section">
      <h2>4. 手动触发请求</h2>
      <button @click="fetchManual" :disabled="manualStatus === 'pending'">
        {{ manualStatus === 'pending' ? '请求中...' : '点击发起请求' }}
      </button>
      <pre v-if="manualData">{{ manualData }}</pre>
    </section>

    <!-- 刷新数据示例 -->
    <section class="demo-section">
      <h2>5. 刷新数据</h2>
      <button @click="refreshDemo">刷新基础请求数据</button>
    </section>
  </div>
</template>

<script setup lang="ts">
// ============================================
// 示例 1: 内部 API 请求（直接使用 useFetch）
// ============================================
const {
  data: demoData,
  status: demoStatus,
  error: demoError,
  refresh: refreshDemo
} = await useFetch('/api/demo');

// ============================================
// 示例 2: 外部 API 请求（使用封装的 useAPI）
// ============================================
// 定义用户类型
interface User {
  id: number;
  name: string;
  email: string;
}

// 使用 useAPI 请求外部接口
const {
  data: usersData,
  status: usersStatus,
  error: usersError
} = await useAPI<User[]>('/users', {
  // 如果外部 API 无法访问，可以使用默认值
  default: () => ({ code: 0, data: [], message: 'ok' })
});

// ============================================
// 示例 3: 懒加载请求（不阻塞页面渲染）
// ============================================
const { data: lazyData, status: lazyStatus } = useLazyAPI<{ time: string }>(
  '/time',
  {
    default: () => ({ code: 0, data: { time: '' }, message: 'ok' })
  }
);

// ============================================
// 示例 4: 手动触发请求（immediate: false）
// ============================================
const {
  data: manualData,
  status: manualStatus,
  execute: fetchManual
} = useAPI<{ result: string }>('/manual-endpoint', {
  immediate: false, // 不立即执行
  default: () => ({ code: 0, data: { result: '' }, message: 'ok' })
});

// ============================================
// 其他常用场景示例（代码注释说明）
// ============================================

// GET 请求带参数
// const { data } = await useGet<User>('/users', { role: 'admin', status: 'active' })

// POST 请求
// const { data } = await usePost<User>('/users', { name: 'John', email: 'john@example.com' })

// PUT 请求
// const { data } = await usePut<User>('/users/1', { name: 'Updated Name' })

// DELETE 请求
// const { data } = await useDelete<void>('/users/1')

// PATCH 请求
// const { data } = await usePatch<User>('/users/1', { status: 'inactive' })

// 分页列表请求
// const { data: userList } = await usePageList<User>('/users', {
//   page: 1,
//   pageSize: 10,
//   sortBy: 'createdAt',
//   sortOrder: 'desc'
// })

// 仅客户端请求（不在服务端执行）
// const { data } = useClientAPI<UserPreferences>('/user/preferences')

// 监听参数变化自动刷新
// const page = ref(1)
// const { data } = await useAPI<User[]>('/users', {
//   query: { page },
//   watch: [page] // page 变化时自动重新请求
// })

// 转换响应数据
// const { data } = await useAPI<User[]>('/users', {
//   transform: (response) => {
//     // 直接返回 data 字段，简化使用
//     return response.data
//   }
// })
</script>

<style scoped>
.api-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

h1 {
  color: #333;
}

h2 {
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 15px;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 14px;
}

button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #3aa876;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  color: #666;
}
</style>
