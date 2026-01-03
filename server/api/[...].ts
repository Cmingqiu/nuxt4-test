/**
 * API 代理路由
 * 处理所有 /api/** 请求，移除 /api 前缀后代理到目标服务器
 *
 * 使用方式：
 * - 请求 /api/users -> 代理到 https://api.example.com/users
 * - 请求 /api/products/123 -> 代理到 https://api.example.com/products/123
 */
export default defineEventHandler(async event => {
  const url = getRequestURL(event);

  // 获取运行时配置中的目标 API URL
  // 可以通过环境变量 NUXT_API_TARGET 来配置
  const config = useRuntimeConfig(event);

  // 从运行时配置获取目标 URL（服务端私有配置）
  // 环境变量 NUXT_API_TARGET 会自动注入到 config.apiTarget
  const targetUrl = config.apiTarget || 'https://api.example.com';

  // 获取路径参数（[...] 捕获所有路径段）
  // 在 Nuxt 4 中，通配符参数通过 getRouterParam 获取，参数名为 '_'
  const wildcardPath = getRouterParam(event, '_');

  // 如果通配符参数存在，使用它；否则从 URL 路径中提取（移除 /api 前缀）
  let apiPath = wildcardPath || '';

  // 如果通配符参数不存在，从完整路径中提取（移除 /api 前缀）
  if (!apiPath && url.pathname.startsWith('/api/')) {
    apiPath = url.pathname.replace(/^\/api\//, '');
  }

  // 构建目标路径（保留查询参数）
  const targetPath = `/${apiPath}${url.search}`;

  // 解析目标 URL 以获取主机名（用于设置 Host 头）
  const targetUrlObj = new URL(targetUrl);

  // 使用 sendProxy 代理请求到目标服务器
  return sendProxy(event, `${targetUrl}${targetPath}`, {
    // 设置自定义请求头，包括修改 Host 头（相当于 changeOrigin）
    headers: {
      Host: targetUrlObj.host,
      'X-Forwarded-Host': url.host,
      'X-Forwarded-Proto': url.protocol.replace(':', ''),
      'X-Forwarded-For': getRequestIP(event) || ''
    }
    // 如果需要，可以通过 fetchOptions 配置 fetch 选项
    // 例如：超时时间、重定向策略等
    // fetchOptions: {
    //   signal: AbortSignal.timeout(10000), // 10秒超时
    // },
  });
});
