import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  redirects: {
    "/": "/index",
  },
  vite: {
    server: {
      hmr: { path: "/vite-hmr/" },
    },
  },
});
