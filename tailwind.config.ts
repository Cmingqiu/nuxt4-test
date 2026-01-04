import type { Config } from 'tailwindcss';

export default {
  // 暗黑模式配置 - 使用 class 策略
  darkMode: 'class',

  // 内容扫描路径
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './composables/**/*.{js,ts}'
  ],

  theme: {
    extend: {
      // 颜色系统 - 映射现有 SCSS 变量
      colors: {
        // 主色调 - 电光蓝
        primary: {
          DEFAULT: '#00d4ff',
          dark: '#0099cc',
          light: '#66e5ff'
        },
        // 强调色 - 霓虹紫
        accent: {
          DEFAULT: '#a855f7',
          dark: '#7c3aed',
          light: '#c084fc'
        },
        // 辅助色
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        // 中性色 - 暗色主题
        dark: {
          DEFAULT: '#0a0a0f',
          soft: '#12121a',
          muted: '#1a1a25'
        },
        // 中性色 - 亮色主题
        light: {
          DEFAULT: '#ffffff',
          soft: '#f8fafc',
          muted: '#e2e8f0'
        },
        // 文字颜色
        text: {
          primary: {
            DEFAULT: '#ffffff',
            light: '#ffffff',
            dark: '#0a0a0f'
          },
          secondary: {
            DEFAULT: '#94a3b8',
            light: '#94a3b8',
            dark: '#475569'
          },
          muted: {
            DEFAULT: '#64748b',
            light: '#64748b',
            dark: '#334155'
          }
        }
      },

      // 字体系统
      fontFamily: {
        primary: [
          'Outfit',
          'Noto Sans SC',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },

      // 字体大小 - 使用 clamp 实现响应式
      fontSize: {
        xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.2rem + 1.5vw, 2rem)',
        '3xl': 'clamp(1.875rem, 1.4rem + 2.375vw, 2.5rem)',
        '4xl': 'clamp(2.25rem, 1.6rem + 3.25vw, 3.5rem)',
        '5xl': 'clamp(3rem, 2rem + 5vw, 5rem)'
      },

      // 间距系统
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem'
      },

      // 圆角
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        base: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px'
      },

      // 阴影系统
      boxShadow: {
        glow: '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-accent': '0 0 20px rgba(168, 85, 247, 0.3)'
      },

      // 容器宽度
      maxWidth: {
        container: '1280px'
      },

      // 过渡动画
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '350ms',
        spring: '500ms'
      },

      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      }
    }
  },

  plugins: []
} satisfies Config;
