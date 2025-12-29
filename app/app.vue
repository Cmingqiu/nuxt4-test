<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    <!-- <NuxtWelcome /> -->
    <NuxtLoadingIndicator color="red" :height="5" />
    <NuxtLayout>
      <NuxtLink v-for="link in links" :key="link.path" :to="link.path">{{
        link.name
      }}</NuxtLink>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const { title } = useAppConfig();

console.log('useAppConfig: ', title);
const links = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'About',
    path: '/about'
  }
];
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
