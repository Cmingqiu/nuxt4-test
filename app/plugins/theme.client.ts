/**
 * 主题初始化插件
 * 在客户端挂载时初始化主题，避免闪烁
 */

export default defineNuxtPlugin({
  name: 'theme-init',
  setup() {
    const { initTheme } = useTheme()
    
    // 在客户端立即初始化主题
    if (import.meta.client) {
      // 使用 nextTick 确保 DOM 已准备好
      nextTick(() => {
        initTheme()
      })
    }
  }
})

