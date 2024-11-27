// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	markdown: {
		shikiConfig: {
		  theme: 'material-theme-ocean',
		},
	  },
	integrations: [mdx(), sitemap()],
	vite: {
		server: {
		  hmr: { path: '/vite-hmr/' }
		}
	  },
	server: {
		port: 3000,
	  },
});
