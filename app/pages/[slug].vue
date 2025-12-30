<template>
  <div>
    <h1>Page: {{ route.path }}</h1>
    <div v-for="(value, key) in route.params" :key="key">
      <h2>{{ key }}: {{ value }}</h2>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
console.log('route: ', route);
</script>

<style lang="scss" scoped></style>
