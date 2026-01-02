<script setup lang="ts">
interface Props {
  isScrolled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isScrolled: false
});

const route = useRoute();

// 移动端菜单状态
const isMobileMenuOpen = ref(false);

// 导航链接
const navLinks = [
  { name: '首页', path: '/' },
  { name: '关于我们', path: '/about' },
  { name: '服务', path: '/services' },
  { name: '案例', path: '/cases' },
  { name: '联系我们', path: '/contact' }
];

// 关闭移动端菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// 路由变化时关闭菜单
watch(() => route.path, closeMobileMenu);

// 禁止背景滚动
watch(isMobileMenuOpen, (isOpen: boolean) => {
  if (import.meta.client) {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
});
</script>

<template>
  <header
    class="header"
    :class="{
      'header--scrolled': isScrolled,
      'header--menu-open': isMobileMenuOpen
    }">
    <div class="header__container container">
      <!-- Logo -->
      <NuxtLink to="/" class="header__logo" @click="closeMobileMenu">
        <span class="header__logo-icon">◆</span>
        <span class="header__logo-text">科技未来</span>
      </NuxtLink>

      <!-- 桌面端导航 -->
      <nav class="header__nav desktop-only">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="header__nav-link"
          :class="{ 'header__nav-link--active': route.path === link.path }">
          {{ link.name }}
        </NuxtLink>
      </nav>

      <!-- 桌面端 CTA 按钮 -->
      <div class="header__actions desktop-only">
        <NuxtLink to="/contact" class="btn btn--primary btn--sm">
          立即咨询
        </NuxtLink>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
        class="header__menu-btn mobile-only"
        :class="{ 'header__menu-btn--open': isMobileMenuOpen }"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        aria-label="切换菜单">
        <span class="header__menu-icon"></span>
      </button>
    </div>

    <!-- 移动端导航菜单 -->
    <Transition name="menu">
      <nav v-if="isMobileMenuOpen" class="header__mobile-nav mobile-only">
        <div class="header__mobile-nav-inner">
          <NuxtLink
            v-for="(link, index) in navLinks"
            :key="link.path"
            :to="link.path"
            class="header__mobile-link"
            :class="{ 'header__mobile-link--active': route.path === link.path }"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="closeMobileMenu">
            {{ link.name }}
          </NuxtLink>

          <div class="header__mobile-cta">
            <NuxtLink
              to="/contact"
              class="btn btn--primary"
              @click="closeMobileMenu">
              立即咨询
            </NuxtLink>
          </div>
        </div>
      </nav>
    </Transition>
  </header>
</template>

<style lang="scss" scoped>
@use 'sass:map';
@use '@/assets/scss/variables' as *;
@use '@/assets/scss/mixins' as *;

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: map.get($z-index, 'fixed');
  @include transition(all);

  &::before {
    content: '';
    @include absolute-fill;
    @include glass-dark(20px, 0);
    border-bottom: 1px solid transparent;
    @include transition(all);
  }

  &--scrolled::before {
    background: rgba(10, 10, 15, 0.8);
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }

  &--menu-open::before {
    background: rgba(10, 10, 15, 0.95);
  }

  &__container {
    position: relative;
    height: 100%;
    @include flex-between;
  }

  // Logo
  &__logo {
    @include flex(row, flex-start, center);
    gap: spacing('2');
    font-size: font-size('xl');
    font-weight: map.get($font-weights, 'bold');
    color: var(--color-text-primary);
    text-decoration: none;
    @include transition(transform);

    &:hover {
      transform: scale(1.02);
      color: var(--color-text-primary);
    }
  }

  &__logo-icon {
    font-size: 1.5em;
    @include gradient-text(
      linear-gradient(135deg, color('primary') 0%, color('accent') 100%)
    );
  }

  &__logo-text {
    @include gradient-text(
      linear-gradient(135deg, color('primary') 0%, color('accent') 100%)
    );
  }

  // 桌面端导航
  &__nav {
    @include flex(row, center, center);
    gap: spacing('1');
  }

  &__nav-link {
    position: relative;
    padding: spacing('2') spacing('4');
    font-size: font-size('sm');
    font-weight: map.get($font-weights, 'medium');
    color: var(--color-text-secondary);
    text-decoration: none;
    border-radius: map.get($radius, 'md');
    @include transition(all);

    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, color('primary'), color('accent'));
      border-radius: 1px;
      transform: translateX(-50%);
      @include transition(width);
    }

    &:hover {
      color: var(--color-text-primary);
      background: rgba(255, 255, 255, 0.05);
    }

    &--active {
      color: var(--color-primary);

      &::after {
        width: 20px;
      }
    }
  }

  // 操作区
  &__actions {
    @include flex(row, flex-end, center);
    gap: spacing('3');
  }

  // 移动端菜单按钮
  &__menu-btn {
    @include button-reset;
    position: relative;
    width: 40px;
    height: 40px;
    @include flex-center;

    &:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
      border-radius: map.get($radius, 'md');
    }
  }

  &__menu-icon {
    position: relative;
    width: 24px;
    height: 2px;
    background: var(--color-text-primary);
    border-radius: 1px;
    @include transition(all, 300ms);

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
      border-radius: inherit;
      @include transition(all, 300ms);
    }

    &::before {
      top: -8px;
    }

    &::after {
      bottom: -8px;
    }
  }

  &__menu-btn--open &__menu-icon {
    background: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
      background: var(--color-text-primary);
    }

    &::after {
      bottom: 0;
      transform: rotate(-45deg);
      background: var(--color-text-primary);
    }
  }

  // 移动端导航
  &__mobile-nav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-dark);
    overflow-y: auto;
    @include safe-area-padding;
  }

  &__mobile-nav-inner {
    @include flex(column, flex-start, stretch);
    padding: spacing('6');
    gap: spacing('2');
  }

  &__mobile-link {
    display: block;
    padding: spacing('4') spacing('4');
    font-size: font-size('lg');
    font-weight: map.get($font-weights, 'medium');
    color: var(--color-text-secondary);
    text-decoration: none;
    border-radius: map.get($radius, 'lg');
    @include transition(all);
    animation: slideIn 300ms ease forwards;
    opacity: 0;
    transform: translateX(-20px);

    &:hover,
    &--active {
      color: var(--color-primary);
      background: rgba(0, 212, 255, 0.1);
    }
  }

  &__mobile-cta {
    margin-top: spacing('6');
    padding-top: spacing('6');
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    animation: slideIn 300ms ease forwards;
    animation-delay: 250ms;
    opacity: 0;

    .btn {
      width: 100%;
    }
  }
}

// 菜单过渡动画
.menu-enter-active,
.menu-leave-active {
  transition: opacity 300ms ease, transform 300ms ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
