import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify/functions";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [react()],
});
