# 主题切换调试指南

## 🔍 问题排查步骤

### 1. 检查浏览器控制台

打开浏览器开发者工具（F12），查看控制台输出：

- `[Theme Init]` - 内联脚本初始化日志
- `[Theme Plugin]` - 插件初始化日志
- `[Theme]` - 主题切换日志

### 2. 检查 HTML 元素

在控制台执行：
```javascript
// 检查当前主题类
document.documentElement.classList.contains('dark')

// 检查 localStorage
localStorage.getItem('nuxt-theme')

// 手动切换主题测试
document.documentElement.classList.toggle('dark')
```

### 3. 检查 CSS 变量

在控制台执行：
```javascript
// 获取当前 CSS 变量值
getComputedStyle(document.documentElement).getPropertyValue('--color-bg')
getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary')
```

### 4. 验证主题切换按钮

1. 点击头部导航栏的主题切换按钮（🌙/☀️）
2. 观察控制台是否有 `[Theme]` 日志
3. 检查 HTML 元素是否添加/移除了 `dark` 类
4. 检查页面背景和文字颜色是否变化

## 🛠️ 常见问题

### 问题 1: 点击按钮没有反应

**检查项：**
- 控制台是否有错误信息
- `useTheme` composable 是否正确导入
- 按钮的 `@click` 事件是否正确绑定

**解决方案：**
```vue
<!-- 在组件中添加调试 -->
<script setup>
const { toggleTheme, isDark } = useTheme()
console.log('当前主题状态:', isDark.value)
</script>
```

### 问题 2: 主题切换了但样式没变

**检查项：**
- HTML 元素是否有 `dark` 类
- CSS 变量是否正确定义
- CSS 选择器优先级是否正确

**解决方案：**
1. 确保 `:root.dark` 选择器优先级高于 `:root`
2. 检查是否有其他样式覆盖了 CSS 变量
3. 清除浏览器缓存并刷新

### 问题 3: 页面加载时闪烁

**原因：** 主题初始化太晚

**解决方案：**
- 确保内联脚本在 `<head>` 中执行
- 检查 `theme.client.ts` 插件是否正确加载

## 📝 手动测试步骤

1. **清除 localStorage**
   ```javascript
   localStorage.removeItem('nuxt-theme')
   location.reload()
   ```

2. **测试浅色主题**
   ```javascript
   localStorage.setItem('nuxt-theme', 'light')
   location.reload()
   ```

3. **测试深色主题**
   ```javascript
   localStorage.setItem('nuxt-theme', 'dark')
   location.reload()
   ```

4. **测试系统主题**
   ```javascript
   localStorage.setItem('nuxt-theme', 'system')
   location.reload()
   ```

## 🎯 预期行为

### 浅色主题
- 背景：白色 (`#ffffff`)
- 文字：深色 (`#0a0a0f`)
- HTML 元素：**没有** `dark` 类

### 深色主题
- 背景：深色 (`#0a0a0f`)
- 文字：白色 (`#ffffff`)
- HTML 元素：**有** `dark` 类

## 🔧 强制刷新

如果修改了 CSS 变量但看不到效果：

1. 硬刷新浏览器：`Ctrl + Shift + R` (Windows) 或 `Cmd + Shift + R` (Mac)
2. 清除浏览器缓存
3. 重启开发服务器：`pnpm dev`

