<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { theme, isDark, setTheme, toggleTheme } = useTheme();

// 主题选项
const themeOptions: Array<{
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: string;
}> = [
  { value: 'light', label: '浅色', icon: '☀️' },
  { value: 'dark', label: '深色', icon: '🌙' },
  { value: 'system', label: '跟随系统', icon: '💻' }
];

// 是否显示下拉菜单
const showDropdown = ref(false);

// 点击外部关闭下拉菜单
const toggleRef = ref<HTMLElement | null>(null);

// 手动实现点击外部关闭
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (toggleRef.value && !toggleRef.value.contains(event.target as Node)) {
      showDropdown.value = false;
    }
  };

  if (import.meta.client) {
    document.addEventListener('click', handleClickOutside);
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
  }
});

// 选择主题
const selectTheme = (newTheme: 'light' | 'dark' | 'system') => {
  setTheme(newTheme);
  showDropdown.value = false;
};

// 当前主题的显示信息
const currentThemeInfo = computed(() => {
  return themeOptions.find(opt => opt.value === theme.value) || themeOptions[1];
});
</script>

<template>
  <div ref="toggleRef" class="theme-toggle">
    <!-- 快速切换按钮 -->
    <button
      type="button"
      class="theme-toggle__button"
      :aria-label="`切换到${isDark ? '浅色' : '深色'}模式`"
      @click="toggleTheme">
      <span
        class="theme-toggle__icon"
        :class="{ 'theme-toggle__icon--dark': isDark }">
        <span v-if="isDark">🌙</span>
        <span v-else>☀️</span>
      </span>
    </button>

    <!-- 下拉菜单 -->
    <Transition name="dropdown">
      <div v-if="showDropdown" class="theme-toggle__dropdown">
        <button
          v-for="option in themeOptions"
          :key="option.value"
          type="button"
          class="theme-toggle__option"
          :class="{ 'theme-toggle__option--active': theme === option.value }"
          @click="selectTheme(option.value)">
          <span class="theme-toggle__option-icon">{{ option.icon }}</span>
          <span class="theme-toggle__option-label">{{ option.label }}</span>
          <span
            v-if="theme === option.value"
            class="theme-toggle__option-check">
            ✓
          </span>
        </button>
      </div>
    </Transition>

    <!-- 详细设置按钮（可选，用于显示下拉菜单） -->
    <button
      v-if="false"
      type="button"
      class="theme-toggle__settings"
      aria-label="主题设置"
      @click="showDropdown = !showDropdown">
      <span>⚙️</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.theme-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.theme-toggle__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: transform 0.3s ease;

  &--dark {
    transform: rotate(180deg);
  }
}

.theme-toggle__dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 10rem;
  padding: 0.5rem;
  background: var(--color-dark-soft);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1000;
}

.theme-toggle__option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--color-text-secondary);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--color-text-primary);
  }

  &--active {
    background: rgba(0, 212, 255, 0.1);
    color: var(--color-primary);
  }
}

.theme-toggle__option-icon {
  font-size: 1.125rem;
  line-height: 1;
}

.theme-toggle__option-label {
  flex: 1;
}

.theme-toggle__option-check {
  color: var(--color-primary);
  font-weight: 600;
}

// 下拉菜单过渡动画
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

// 暗黑模式样式
:global(.dark) {
  .theme-toggle__button {
    background: rgba(255, 255, 255, 0.05);
  }

  .theme-toggle__dropdown {
    background: rgba(18, 18, 26, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

// 浅色模式样式
:global(:not(.dark)) {
  .theme-toggle__button {
    background: rgba(0, 0, 0, 0.05);
  }

  .theme-toggle__dropdown {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
