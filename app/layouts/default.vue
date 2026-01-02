<script setup lang="ts">
const route = useRoute();

// 页面滚动时的头部状态
const isScrolled = ref(false);

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<template>
  <div class="layout">
    <!-- 背景装饰 -->
    <div class="layout__background">
      <div class="layout__grid"></div>
      <div class="layout__gradient"></div>
      <div class="layout__orb layout__orb--1"></div>
      <div class="layout__orb layout__orb--2"></div>
    </div>

    <!-- 头部导航 -->
    <TheHeader :is-scrolled="isScrolled" />

    <!-- 主内容区 -->
    <main class="layout__main">
      <slot />
    </main>

    <!-- 页脚 -->
    <TheFooter />

    <!-- 全局 Toast 消息 -->
    <Toast />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__background {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
  }

  &__grid {
    @include absolute-fill;
    @include grid-background(60px, rgba(255, 255, 255, 0.02));
  }

  &__gradient {
    @include absolute-fill;
    background: radial-gradient(
        ellipse 80% 50% at 50% -20%,
        rgba(0, 212, 255, 0.15),
        transparent
      ),
      radial-gradient(
        ellipse 60% 40% at 100% 50%,
        rgba(168, 85, 247, 0.1),
        transparent
      );
  }

  &__orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    animation: float 20s ease-in-out infinite;

    &--1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(
        circle,
        rgba(0, 212, 255, 0.3) 0%,
        transparent 70%
      );
      top: -200px;
      right: -200px;
    }

    &--2 {
      width: 400px;
      height: 400px;
      background: radial-gradient(
        circle,
        rgba(168, 85, 247, 0.25) 0%,
        transparent 70%
      );
      bottom: 20%;
      left: -100px;
      animation-delay: -10s;
    }
  }

  &__main {
    flex: 1;
    padding-top: var(--header-height);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.05);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}
</style>
