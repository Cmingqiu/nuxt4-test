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

| 功能 | 说明 |
|------|------|
| **统一 baseURL** | 通过 `runtimeConfig` 配置，支持环境变量覆盖 |
| **自动携带 Token** | 自动从 Cookie 读取 token 并添加到请求头 |
| **统一错误处理** | 401 自动跳转登录，其他错误统一提示 |
| **类型安全** | 完整的 TypeScript 类型推断 |
| **多种请求方法** | `useGet`、`usePost`、`usePut`、`useDelete`、`usePatch` |
| **分页请求** | `usePageList` 专门处理分页列表 |
| **懒加载** | `useLazyAPI` 不阻塞页面渲染 |
| **仅客户端** | `useClientAPI` 跳过 SSR |

---

## 📝 使用方式

### 基础用法

```typescript
// GET 请求
const { data, status, error } = await useAPI<User>('/users/1')

// 访问数据：data.value?.data（返回格式：{ code, data, message }）
```

### 快捷方法

```typescript
// GET 带参数
const { data } = await useGet<User[]>('/users', { role: 'admin' })

// POST 请求
const { data } = await usePost<User>('/users', { 
  name: 'John', 
  email: 'john@example.com' 
})

// PUT / PATCH / DELETE
await usePut<User>('/users/1', { name: 'Updated' })
await usePatch<User>('/users/1', { status: 'active' })
await useDelete('/users/1')
```

### 分页列表

```typescript
const { data } = await usePageList<User>('/users', {
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// data.value?.data.list  - 列表数据
// data.value?.data.total - 总条数
```

### 高级用法

```typescript
// 懒加载（不阻塞渲染）
const { data, status } = useLazyAPI<User>('/users/1')
// status.value === 'pending' 时显示 loading

// 仅客户端请求
const { data } = useClientAPI<Preferences>('/user/preferences')

// 手动触发
const { execute } = useAPI<User>('/users', { immediate: false })
await execute() // 手动调用

// 监听参数自动刷新
const page = ref(1)
const { data } = await useAPI<User[]>('/users', {
  query: { page },
  watch: [page]
})
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

## 👀 查看示例

访问 `/api-demo` 页面查看完整的使用示例和效果演示。

