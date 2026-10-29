import { defineConfig } from 'astro/config';
import sanityIntegration from '@sanity/astro';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import netlify from '@astrojs/netlify';

const { PUBLIC_SANITY_STUDIO_PROJECT_ID, PUBLIC_SANITY_STUDIO_DATASET } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  ''
);

export default defineConfig({
  output: 'static',
  integrations: [
    sanityIntegration({
      projectId: PUBLIC_SANITY_STUDIO_PROJECT_ID,
      dataset: PUBLIC_SANITY_STUDIO_DATASET,
      useCdn: false,
      studioBasePath: '/admin',
      // Astro 5 removed the 'hybrid' output this example used; @sanity/astro picks the hash router
      // for 'static', so keep the browser router (and its on-demand /admin/* route) as before.
      studioRouterHistory: 'browser',
    }),
    react(),
  ],
  adapter: netlify(),
});
