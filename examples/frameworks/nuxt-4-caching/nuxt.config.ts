// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-13",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        // See https://example-styles.netlify.app/.
        {
          rel: "preload",
          href: "https://example-styles.netlify.app/fonts/PacaembuVar-latin.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "",
        },
        {
          rel: "preload",
          href: "https://example-styles.netlify.app/fonts/MulishVar-latin.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://example-styles.netlify.app/styles.css",
        },
      ],
    },
  },
  routeRules: {
    "/prerendered": { prerender: true },
    "/ssr": {
      ssr: true,
    },
    "/ssr-cached": {
      ssr: true,
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, max-age=15, durable",
      },
    },
    "/csr": {
      ssr: false,
    },
    "/csr-cached": {
      ssr: false,
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Netlify-CDN-Cache-Control": "public, max-age=15, durable",
      },
    },
    "/isr": { isr: 15 },
    "/isr-true": { isr: true },
  },
});
