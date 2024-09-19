import netlify from '@astrojs/netlify'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: netlify(),
  integrations: [tailwind(), react()],
  experimental: {
    serverIslands: true,
  },
})
