<script setup lang="ts">
const id = useState("id", () => new Date().getMilliseconds());
</script>

<template>
  <p>
    This page is <strong>not</strong> prerendered. It uses the default universal
    rendering mode. It is rendered on the fly by a serverless function (though
    this may be cached and served later), then hydrated on the client for
    subsequent interaction and navigation.
  </p>
  <p>It is configured to be cached on the Netlify CDN for 15 seconds.</p>
  <p>Below is a random number generated any time the page is rendered:</p>
  <code>{{ id }}</code>
</template>
