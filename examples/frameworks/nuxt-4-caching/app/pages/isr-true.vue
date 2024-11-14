<script setup lang="ts">
const id = useState("id", () => new Date().getMilliseconds());
</script>

<template>
  <section>
    <h3>ISR without a TTL</h3>

    <CsrWarningPanel />

    <p>
      This page is <strong>not</strong> prerendered. It uses the default
      universal rendering mode. It is rendered on the fly by a serverless
      function (though this may be cached and served later), then hydrated on
      the client for subsequent interaction and navigation.
    </p>
    <p>
      It is configured to be cached on the Netlify CDN, with Incremental Static
      Regeneration (ISR) configured to never consider the cache stale. The first
      request after a deploy will invoke the SSR function to render on the fly
      and the result will be cached and served for all subsequent requests. As
      the cache entry never becomes stale, the CDN will always serve it, unless
      invalidated (via cache purge API or a deploy).
    </p>
    <p>Below is a random number generated any time the page is rendered:</p>
    <UniqueId :id="id" />
  </section>
</template>
