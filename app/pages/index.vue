<template>
  <div>index page {{ apiUrl }}</div>
</template>

<script lang="ts" setup>
const {
  public: { apiUrl }
} = useRuntimeConfig();

console.log('index: ', apiUrl);
const route = useRoute();
console.log('route: ', route);
</script>

<style lang="scss" scoped></style>
