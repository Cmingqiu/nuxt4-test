// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    // '@nuxt/eslint',
    // '@nuxt/ui',
    // '@nuxt/image',
    // '@nuxt/content',
    // '@nuxt/hints',
    // '@nuxt/scripts'
  ],

  runtimeConfig: {
    // 服务端私有配置
    apiSecret: '', // NUXT_API_SECRET

    public: {
      // 客户端公开配置
      // 环境变量 NUXT_PUBLIC_API_URL 会自动覆盖此值
      apiUrl: '/api', // 默认使用内部 API
      apiTimeout: 30000 // 请求超时时间
    }
  }
});
