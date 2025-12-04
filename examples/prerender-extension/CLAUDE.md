# Prerender Extension Demo

This is a demo project showcasing the [Netlify Prerender Extension](https://app.netlify.com/extensions/prerender).

## Project Overview

A React single-page application (SPA) built with Vite and TypeScript. The site is an educational guide to the birds of Costa Rica, featuring detail pages for 20 different bird species.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM (client-side routing)
- **Content**: Markdown files rendered with react-markdown
- **Styling**: CSS with custom properties (CSS variables)

## Project Structure

```
src/
├── components/
│   ├── atoms/       # Basic UI elements (Text, Heading, Container, etc.)
│   ├── molecules/   # Composite components (Card, BirdCard, NavLink)
│   ├── organisms/   # Complex components (Header, Footer, Hero, BirdGrid)
│   └── templates/   # Page layouts (PageLayout)
├── content/         # Markdown files for each bird species
├── data/
│   └── birds.ts     # Bird data array with metadata
├── hooks/
│   └── useMarkdown.ts  # Hook for loading markdown content
├── pages/           # Route components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   ├── RegionsPage.tsx
│   └── BirdDetailPage.tsx
└── utils/
    └── image.ts     # Netlify Image CDN helper
```

## Key Files

- `src/data/birds.ts` - Contains all bird metadata (name, scientific name, slug, habitat, etc.)
- `src/content/*.md` - Markdown content for each bird's detail page
- `src/utils/image.ts` - Helper function for Netlify Image CDN URLs
- `dist/_redirects` - SPA catch-all redirect (`/* -> /index.html`)

## Netlify Features Used

- **Image CDN**: Images are served through `/.netlify/images` with width/height/fit parameters
- **SPA Redirect**: All routes redirect to index.html for client-side routing

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Routes

- `/` - Home page with bird grid
- `/about` - About page
- `/regions` - Regions information
- `/birds/:slug` - Bird detail pages (e.g., `/birds/resplendent-quetzal`)

## Why This Example Exists

This is a classic SPA that renders content entirely client-side. Without prerendering:

- Search engine crawlers cannot see the page content
- Social media link previews don't work properly
- AI/LLM tools with web access cannot read the page content

The Netlify Prerender Extension solves this by generating static HTML for each page, making the content accessible to bots and crawlers while maintaining the SPA experience for users.
