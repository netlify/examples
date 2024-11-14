<script setup lang="ts">
const id = useState("id", () => new Date().getMilliseconds());
</script>

<template>
  <section>
    <h3>Universal rendering (SSR + CSR)</h3>

    <CsrWarningPanel />

    <p>
      This page is <strong>not</strong> prerendered. It uses the default
      universal rendering mode. It is rendered on the fly by a serverless
      function, then hydrated on the client for subsequent interaction and
      navigation.
    </p>
    <p>No caching has been configured.</p>
    <p>Below is a random number generated any time the page is rendered:</p>
    <UniqueId :id="id" />
  </section>
</template>
