// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      MODEL_PROVIDER: process.env.MODEL_PROVIDER,
    },
    MODEL_API_KEY: process.env.MODEL_API_KEY,
  },
  modules: ['@nuxtjs/tailwindcss']
})
