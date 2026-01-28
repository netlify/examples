# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro blog site configured for deployment on Netlify. It uses Astro's content collections for managing blog posts and supports both Markdown and MDX formats.

## Development Commands

All commands run from the project root:

- `npm install` - Install dependencies
- `npm run dev` - Start local dev server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview production build locally
- `npm run astro ...` - Run Astro CLI commands (e.g., `npm run astro check` for type checking)

## Architecture

### Content Management

Blog posts are managed using Astro's Content Collections API:

- **Collection definition**: `src/content.config.ts` defines the blog collection with a Zod schema
- **Blog posts location**: `src/content/blog/` directory contains all blog posts (.md and .mdx files)
- **Schema**: Posts require `title`, `description`, and `pubDate` frontmatter. Optional fields include `updatedDate` and `heroImage`
- **Accessing posts**: Use `getCollection('blog')` to retrieve posts, which provides type-safe access based on the schema

### Routing

- Static pages live in `src/pages/` (e.g., index.astro, about.astro)
- Dynamic blog post route: `src/pages/blog/[...slug].astro` uses `getStaticPaths()` to generate routes from content collection
- Blog post slugs are derived from the file ID (filename without extension)

### Site Configuration

- `astro.config.mjs` - Configured with Netlify adapter, MDX, and Sitemap integrations
- `src/consts.ts` - Contains `SITE_TITLE` and `SITE_DESCRIPTION` constants used throughout the site
- Site URL is set to "https://example.com" in astro.config.mjs (update for production)

### RSS Feed

`src/pages/rss.xml.js` generates an RSS feed by querying the blog collection and using the @astrojs/rss package.

### Deployment

Uses `@astrojs/netlify` adapter for Netlify deployment with SSR capabilities.
