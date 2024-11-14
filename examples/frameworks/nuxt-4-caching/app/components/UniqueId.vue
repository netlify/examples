<script setup lang="ts">
const { id } = defineProps<{
  id: number;
}>();
</script>

<template>
  <div class="container">
    <code>{{ id }}</code>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
}
</style>
