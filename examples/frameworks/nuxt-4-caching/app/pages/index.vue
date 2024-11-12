<template>
  <h3>Rendering and caching strategies</h3>

  <div class="panel">
    Keep in mind that when you click on a link below Nuxt performs client-side
    navigation, so no SSR nor prerendering is involved. Reload the page or open
    it in a new tab to see initial load behavior.
  </div>

  <div class="flex-btwn">
    <NuxtLink to="/prerendered">prerendered</NuxtLink>
    <NuxtLink to="/ssr">SSR + CSR</NuxtLink>
    <NuxtLink to="/ssr-cached">SSR + CSR + caching</NuxtLink>
    <NuxtLink to="/csr">CSR</NuxtLink>
    <NuxtLink to="/csr-cached">CSR + caching</NuxtLink>
    <NuxtLink to="/isr">ISR</NuxtLink>
    <NuxtLink to="/isr-true">ISR (no TTL)</NuxtLink>
  </div>
</template>
