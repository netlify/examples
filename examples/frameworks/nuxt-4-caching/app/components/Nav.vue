<template>
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
