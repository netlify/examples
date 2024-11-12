<script setup lang="ts">
const id = useState("id", () => new Date().getMilliseconds());
</script>

<template>
  <p>
    This is a prerendered page. It is rendered once at build time and it is
    immutably cached. No function is invoked when requesting this page.
  </p>
  <p>Below is a random number generated any time the page is rendered:</p>
  <code>{{ id }}</code>
</template>
