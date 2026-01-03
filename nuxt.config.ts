// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SSR 模式
  ssr: true,

  // Vite 配置
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/scss/variables" as *;
            @use "@/assets/scss/mixins" as *;
          `
        }
      }
    }
  },

  // 全局 CSS
  css: ['@/assets/scss/main.scss'],

  modules: [
    // '@nuxt/eslint',
    // '@nuxt/ui',
    // '@nuxt/image',
    // '@nuxt/content',
    // '@nuxt/hints',
    // '@nuxt/scripts',
    // '@nuxtjs/device'
  ],

  runtimeConfig: {
    // 服务端私有配置
    apiSecret: '', // NUXT_API_SECRET
    // API 代理目标服务器（服务端私有，不会暴露给客户端）
    apiTarget: '', // NUXT_API_TARGET - 例如: https://api.example.com

    public: {
      // 客户端公开配置
      // 环境变量 NUXT_PUBLIC_API_URL 会自动覆盖此值
      apiUrl: '/api', // 默认使用内部 API
      apiTimeout: 30000 // 请求超时时间
    }
  },
  app: {
    head: {
      title: '官方网站',
      htmlAttrs: {
        lang: 'zh-CN'
      },
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        },
        { name: 'description', content: '现代化响应式官方网站' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700&display=swap'
        }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  // 路由配置
  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/services': { prerender: true },
    '/contact': { prerender: true }

    // 方式1： API 代理已通过 server/api/[...].ts 处理
    // 该路由会处理所有 /api/** 请求，移除 /api 前缀后代理到目标服务器
    // 目标服务器可通过环境变量 NUXT_API_TARGET 或 NUXT_PUBLIC_API_URL 配置

    // 方式2： API 代理 - 将 /api 路径代理到目标服务器
    // 注意：如果目标服务器需要移除 /api 前缀，请使用 server/middleware 处理
    /*  '/api/**': {
      proxy: 'https://api.example.com/**'
    } */
    // 图片资源代理示例
    /* '/uploads/**': {
      proxy: 'http://cdn.example.com/**'
    } */
  }
});
