/**
 * 主题初始化插件
 * 在客户端挂载时初始化主题，避免闪烁
 * 必须在 DOM 渲染前执行
 */

export default defineNuxtPlugin({
  name: 'theme-init',
  setup() {
    if (import.meta.client) {
      const { initTheme, setTheme } = useTheme()
      
      // 确保主题已应用（内联脚本已经处理了初始加载，这里确保同步）
      const stored = localStorage.getItem('nuxt-theme') || 'system'
      const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      const effectiveTheme = stored === 'system' ? getSystemTheme() : stored
      
      // 如果 HTML 元素还没有正确的 class，立即应用
      const root = document.documentElement
      if (effectiveTheme === 'dark' && !root.classList.contains('dark')) {
        root.classList.add('dark')
      } else if (effectiveTheme === 'light' && root.classList.contains('dark')) {
        root.classList.remove('dark')
      }
      
      // 初始化主题监听
      initTheme()
      
      console.log('[Theme Plugin] 主题插件已加载，当前主题:', stored, '实际:', effectiveTheme)
    }
  }
})

