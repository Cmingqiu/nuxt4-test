# API 请求封装使用指南

## 📁 创建的文件

```
app/
├── types/
│   └── api.ts              # 类型定义
├── plugins/
│   └── api.ts              # $api 插件（拦截器）
├── composables/
│   └── useAPI.ts           # useAPI 封装
└── pages/
    └── api-demo.vue        # 使用示例页面
```

---

## 🚀 功能特性

| 功能               | 说明                                                   |
| ------------------ | ------------------------------------------------------ |
| **统一 baseURL**   | 通过 `runtimeConfig` 配置，支持环境变量覆盖            |
| **自动携带 Token** | 自动从 Cookie 读取 token 并添加到请求头                |
| **统一错误处理**   | 401 自动跳转登录，其他错误统一提示                     |
| **类型安全**       | 完整的 TypeScript 类型推断                             |
| **多种请求方法**   | `useGet`、`usePost`、`usePut`、`useDelete`、`usePatch` |
| **分页请求**       | `usePageList` 专门处理分页列表                         |
| **懒加载**         | `useLazyAPI` 不阻塞页面渲染                            |
| **仅客户端**       | `useClientAPI` 跳过 SSR                                |
| **文件下载**       | `downloadFile`、`useDownload` 支持进度回调             |

---

## 📝 使用方式

### 基础用法

```typescript
// GET 请求
const { data, status, error } = await useAPI<User>('/users/1');

// data.value 直接是 User 类型，无需再 .data
console.log(data.value?.name);
```

### 快捷方法

```typescript
// GET 带参数
const { data } = await useGet<User[]>('/users', { role: 'admin' });

// POST 请求
const { data } = await usePost<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT / PATCH / DELETE
await usePut<User>('/users/1', { name: 'Updated' });
await usePatch<User>('/users/1', { status: 'active' });
await useDelete('/users/1');
```

### 分页列表

```typescript
const { data } = await usePageList<User>('/users', {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

// data.value 直接是 PaginatedData<User> 类型
// data.value?.list  - 列表数据
// data.value?.total - 总条数
```

### 高级用法

```typescript
// 懒加载（不阻塞渲染）
const { data, status } = useLazyAPI<User>('/users/1');
// status.value === 'pending' 时显示 loading

// 仅客户端请求
const { data } = useClientAPI<Preferences>('/user/preferences');

// 手动触发
const { execute } = useAPI<User>('/users', { immediate: false });
await execute(); // 手动调用

// 监听参数自动刷新
const page = ref(1);
const { data } = await useAPI<User[]>('/users', {
  query: { page },
  watch: [page]
});
```

---

## ⚙️ 环境变量配置

创建 `.env` 文件设置 API 地址：

```bash
# 公开配置（客户端可见）
NUXT_PUBLIC_API_URL=https://api.example.com

# 私有配置（仅服务端）
NUXT_API_SECRET=your-secret-key
```

---

## 🔄 获取原始响应

如果需要获取完整的 `{ code, data, message }` 格式：

```typescript
// 方式1：使用 raw 选项
const { data } = await useAPI<User>('/users/1', { raw: true });
console.log(data.value?.code);
console.log(data.value?.data);
console.log(data.value?.message);

// 方式2：使用 useRawAPI
const { data } = await useRawAPI<User>('/users/1');
```

---

---

## 📥 文件下载

文件下载功能已整合到 useAPI 架构中：

- **默认使用 `$api`（ofetch）**：复用统一的 baseURL、token、拦截器
- **需要进度时自动降级**：使用原生 fetch 支持流式读取

### 基础下载（使用 $api）

```typescript
// 简单下载 - 复用 $api 的拦截器
await downloadFile('/files/report.pdf');

// 指定文件名
await downloadFile('/files/123', { filename: '报告.pdf' });
```

### POST 请求下载（导出场景）

```typescript
// 适用于需要传参的导出接口
await downloadFile('/export/users', {
  method: 'POST',
  body: { ids: [1, 2, 3], format: 'xlsx' },
  filename: '用户列表.xlsx'
});
```

### 带进度回调（自动降级为原生 fetch）

```typescript
// 需要进度时，自动使用原生 fetch（支持流式读取）
await downloadFile('/files/large-file.zip', {
  filename: '大文件.zip',
  onProgress: ({ loaded, total, percent }) => {
    console.log(`下载进度: ${percent}%`);
  },
  onSuccess: filename => {
    console.log(`${filename} 下载成功`);
  },
  onError: error => {
    console.error('下载失败:', error.message);
  }
});
```

### 响应式下载（推荐用于 UI 交互）

```typescript
const { download, downloading, progress, error } = useDownload();
```

```vue
<template>
  <button @click="() => download('/files/report.pdf')" :disabled="downloading">
    {{ downloading ? `下载中 ${progress}%` : '下载文件' }}
  </button>
  <p v-if="error" class="error">{{ error.message }}</p>
</template>
```

### 实现说明

| 场景       | 使用方式         | 说明                           |
| ---------- | ---------------- | ------------------------------ |
| 无进度需求 | `$api`（ofetch） | 复用拦截器、统一错误处理       |
| 需要进度   | 原生 fetch       | 支持 `ReadableStream` 流式读取 |

> **为什么需要进度时降级为原生 fetch？**
>
> ofetch（$fetch）不支持响应流的逐块读取，无法计算下载进度。
> 原生 fetch 的 `response.body.getReader()` 可以实现流式读取。

---

## 👀 查看示例

访问 `/api-demo` 页面查看完整的使用示例和效果演示。
