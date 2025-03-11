// @ts-check
import { defineConfig } from "astro/config";

import netlify from "@astrojs/netlify";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [tailwind()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja", "es", "fr"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
