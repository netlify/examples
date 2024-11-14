<script setup lang="ts">
const id = useState("id", () => new Date().getMilliseconds());
</script>

<template>
  <section>
    <h3>CSR</h3>

    <p>
      This page is <strong>not</strong> prerendered. It uses CSR only, without
      SSR. An empty app shell is rendered on the fly by a serverless function,
      then it is rendered on the client for subsequent interaction and
      navigation.
    </p>
    <p>No caching has been configured.</p>
    <p>Below is a random number generated any time the page is rendered:</p>
    <UniqueId :id="id" />
  </section>
</template>
