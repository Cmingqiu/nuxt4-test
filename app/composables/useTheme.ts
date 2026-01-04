/**
 * 主题管理 Composable
 * 提供暗黑模式切换功能，支持系统偏好检测和持久化存储
 */

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'nuxt-theme'
const THEME_ATTRIBUTE = 'class'

/**
 * 获取系统主题偏好
 */
function getSystemTheme(): 'light' | 'dark' {
  if (import.meta.server) return 'dark'
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * 应用主题到 DOM
 */
function applyTheme(theme: 'light' | 'dark') {
  if (import.meta.server) return

  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/**
 * 获取实际主题（如果是 system，则返回系统偏好）
 */
function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme
}

/**
 * 主题管理 Composable
 */
export const useTheme = () => {
  // 当前主题状态
  const theme = useState<Theme>(THEME_STORAGE_KEY, () => {
    // 服务端默认返回 dark
    if (import.meta.server) return 'dark'
    
    // 客户端从 localStorage 读取，如果没有则使用系统偏好
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    return stored || 'system'
  })

  // 实际应用的主题（light 或 dark）
  const effectiveTheme = computed<'light' | 'dark'>(() => {
    return getEffectiveTheme(theme.value)
  })

  // 是否为暗黑模式
  const isDark = computed(() => effectiveTheme.value === 'dark')

  /**
   * 设置主题
   */
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    
    // 持久化到 localStorage
    if (import.meta.client) {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
      applyTheme(getEffectiveTheme(newTheme))
    }
  }

  /**
   * 切换主题（在 light 和 dark 之间切换，跳过 system）
   */
  const toggleTheme = () => {
    const current = effectiveTheme.value
    setTheme(current === 'dark' ? 'light' : 'dark')
  }

  /**
 * 初始化主题
 */
  const initTheme = () => {
    if (import.meta.server) return

    // 应用初始主题
    applyTheme(effectiveTheme.value)

    // 监听系统主题变化（仅在 theme 为 system 时有效）
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme.value === 'system') {
        applyTheme(getSystemTheme())
      }
    }

    // 使用 addEventListener 替代已废弃的 addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // 兼容旧浏览器
      mediaQuery.addListener(handleChange)
    }

    // 返回清理函数
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }

  // 客户端初始化
  if (import.meta.client) {
    onMounted(() => {
      initTheme()
    })
  }

  return {
    theme: readonly(theme),
    effectiveTheme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}

