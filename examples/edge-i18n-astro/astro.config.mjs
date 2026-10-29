// @ts-check
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja", "es", "fr"],
    routing: {
      prefixDefaultLocale: true,
      // Astro 6 made this default to false; "/" must still redirect to "/en/".
      redirectToDefaultLocale: true,
    },
  },
});
