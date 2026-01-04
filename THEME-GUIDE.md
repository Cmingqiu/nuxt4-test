# 主题系统使用指南

本项目已集成 Tailwind CSS 并实现了完整的暗黑模式支持。

## 📦 已安装的依赖

- `@nuxtjs/tailwindcss` - Nuxt Tailwind CSS 模块
- `tailwindcss` - Tailwind CSS 核心
- `postcss` - CSS 后处理器
- `autoprefixer` - 自动添加浏览器前缀

## 🎨 主题系统

### 使用主题 Composable

在任何组件中使用 `useTheme` composable：

```vue
<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { theme, isDark, setTheme, toggleTheme } = useTheme();
</script>

<template>
  <div>
    <p>当前主题: {{ theme }}</p>
    <p>是否为暗黑模式: {{ isDark }}</p>
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>
```

### 主题选项

- `light` - 浅色主题
- `dark` - 深色主题
- `system` - 跟随系统偏好（默认）

### 主题切换组件

已创建 `ThemeToggle` 组件，可在任何地方使用：

```vue
<template>
  <ThemeToggle />
</template>
```

## 🎯 Tailwind CSS 使用

### 颜色系统

Tailwind 配置已映射了现有的 SCSS 变量：

```vue
<!-- 主色调 -->
<div class="bg-primary text-primary-dark">主色背景</div>

<!-- 强调色 -->
<div class="bg-accent text-accent-light">强调色</div>

<!-- 背景色（支持主题切换） -->
<div class="bg-dark dark:bg-light">背景色</div>
<div class="bg-dark-soft dark:bg-light-soft">柔和背景</div>

<!-- 文字颜色（支持主题切换） -->
<p class="text-text-primary dark:text-text-primary-dark">主要文字</p>
<p class="text-text-secondary">次要文字</p>
```

### 暗黑模式类

使用 `dark:` 前缀来定义暗黑模式下的样式：

```vue
<div class="bg-white dark:bg-dark text-black dark:text-white">
  这个元素在浅色模式下是白色背景，暗黑模式下是深色背景
</div>
```

### 响应式设计

使用 Tailwind 的响应式前缀：

```vue
<div class="text-sm md:text-base lg:text-lg">
  响应式文字大小
</div>
```

## 🎨 SCSS 与 Tailwind 共存

项目同时支持 SCSS 和 Tailwind CSS：

### SCSS 变量

继续使用现有的 SCSS 变量系统：

```scss
.my-component {
  background: var(--color-bg);
  color: var(--color-text-primary);
  padding: spacing('4');
}
```

### CSS 变量

主题相关的 CSS 变量会自动切换：

- `--color-bg` - 背景色
- `--color-bg-soft` - 柔和背景
- `--color-bg-muted` - 静音背景
- `--color-text-primary` - 主要文字
- `--color-text-secondary` - 次要文字
- `--color-text-muted` - 静音文字

## 📝 最佳实践

### 1. 使用 Tailwind 工具类进行快速开发

```vue
<div class="flex items-center justify-between p-4 rounded-lg bg-bg-soft">
  <h2 class="text-xl font-semibold text-text-primary">标题</h2>
  <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
    按钮
  </button>
</div>
```

### 2. 使用 SCSS 进行复杂样式

对于复杂的动画、混入等，继续使用 SCSS：

```vue
<style lang="scss" scoped>
.complex-component {
  @include glass-dark(20px, 0.5);
  @include transition(all);

  &:hover {
    transform: translateY(-4px);
  }
}
</style>
```

### 3. 主题切换时的过渡效果

所有使用 CSS 变量的元素会自动过渡：

```scss
.element {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

### 4. 组件样式

在组件中使用 Tailwind 类名，同时保持 SCSS 的灵活性：

```vue
<template>
  <div class="card p-6 rounded-xl">
    <h3 class="text-2xl font-bold mb-4">标题</h3>
    <p class="text-text-secondary">内容</p>
  </div>
</template>

<style lang="scss" scoped>
.card {
  background: var(--color-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.05);

  // 浅色主题适配
  :global(:not(.dark)) & {
    border-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
```

## 🔧 配置文件

### Tailwind 配置

`tailwind.config.ts` - 包含所有颜色、字体、间距等配置

### 主题配置

- `app/composables/useTheme.ts` - 主题管理逻辑
- `app/components/ThemeToggle.vue` - 主题切换组件
- `app/plugins/theme.client.ts` - 主题初始化插件

## 🚀 开发建议

1. **优先使用 Tailwind** - 对于常见的布局和样式，优先使用 Tailwind 工具类
2. **SCSS 用于复杂场景** - 复杂的动画、混入、函数等使用 SCSS
3. **CSS 变量用于主题** - 所有主题相关的颜色使用 CSS 变量
4. **保持一致性** - 使用 Tailwind 配置中定义的颜色和间距，保持设计系统一致性

## 📚 参考资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Nuxt Tailwind 模块](https://tailwindcss.nuxtjs.org/)
- [Tailwind 暗黑模式](https://tailwindcss.com/docs/dark-mode)
