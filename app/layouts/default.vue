<template>
  <div class="default-layout">
    <h1>Default Layout</h1>
    <slot />
    <footer class="default-layout-footer">footer</footer>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
