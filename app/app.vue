<script setup lang="ts">
// 应用根组件
useHead({
  titleTemplate: (titleChunk?: string) => {
    return titleChunk
      ? `${titleChunk} - 科技未来`
      : '科技未来 - 引领数字化转型';
  }
});

const { title } = useAppConfig();
console.log('useAppConfig: ', title);
</script>

<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtLoadingIndicator color="red" :height="5" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
