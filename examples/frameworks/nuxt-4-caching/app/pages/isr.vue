<script setup lang="ts">
const id = useState("id", () => new Date().getMilliseconds());
</script>

<template>
  <section>
    <h3>ISR with a TTL</h3>

    <CsrWarningPanel />

    <p>
      This page is <strong>not</strong> prerendered. It uses the default
      universal rendering mode. It is rendered on the fly by a serverless
      function (though this may be cached and served later), then hydrated on
      the client for subsequent interaction and navigation.
    </p>
    <p>
      It is configured to be cached on the Netlify CDN, with Incremental Static
      Regeneration (ISR) configured to consider the cache stale after 15
      seconds. The first request after a deploy will invoke the SSR function to
      render on the fly and the result will be cached and served for subsequent
      requests. The first request more than 15 seconds after this will serve the
      stale page and the CDN will invoke the SSR function in the background to
      update the cache. Subsequent requests will be served the updated cached
      page.
    </p>
    <p>Below is a random number generated any time the page is rendered:</p>
    <UniqueId :id="id" />
  </section>
</template>
