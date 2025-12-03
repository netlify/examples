# After the Story - AI SEO Image Generator

## Project Overview

This is an Astro blog called "After the Story" that features fictional interviews with legendary characters about their lives after their stories ended. The project uses AI-powered image generation (Google Gemini / Nano Banana) with Netlify Functions and Blob storage.

**Site Title:** After the Story
**Tagline:** Interviews with legendary characters about their lives after the final chapter.

## Key Features

- Editorial-style blog design (serif fonts, clean layout, sharp corners)
- 10 fictional character interviews as blog posts
- **AI-generated images** using Google Gemini 2.5 Flash Image (Nano Banana)
- **Netlify Image CDN** for optimized image delivery at multiple sizes
- **On-demand generation** - images generated when first requested
- Date-prefixed blog files that don't show dates in URLs
- Server-side rendering with Netlify adapter

## Environment Variables

Required environment variables in Netlify:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI Studio API key for image generation |
| `REGEN_API_KEY` | Secret key for the regenerate endpoint (admin use) |

## Architecture

### Netlify Functions

Located in `netlify/functions/`:

```
netlify/functions/
├── post-image.mts           # Serves images, triggers generation
├── regenerate-image.mts     # Admin endpoint to regenerate images
└── utils/
    ├── generate-image.ts    # AI image generation logic
    └── parse-meta-tags.ts   # Extracts og:title/description from pages
```

### Image Generation Flow

1. Request comes to `/api/images/:slug`
2. Check `PostImage` blob store for existing image
3. If found → serve with caching headers
4. If not found:
   - Check `GenerationInProgress` store to prevent duplicates
   - Fetch post metadata by scraping `og:title` and `og:description` from `/blog/:slug/`
   - Use `waitUntil()` to generate image in background
   - Return default image immediately (uncached)
5. Generation stores image in `PostImage` blob store

### Netlify Image CDN

Images are served through Netlify Image CDN for optimization. Rewrites in `netlify.toml`:

| Path | Size | Usage |
|------|------|-------|
| `/images/hero/:slug` | 1200×675 | Blog post hero images |
| `/images/featured/:slug` | 500×281 | Featured post on home |
| `/images/medium/:slug` | 720×405 | Blog listing page |
| `/images/thumb/:slug` | 360×203 | Grid posts on home |

All sizes maintain **16:9 aspect ratio**.

### Blob Stores

| Store Name | Purpose |
|------------|---------|
| `PostImage` | Stores generated AI images |
| `GenerationInProgress` | Tracks in-flight generations to prevent duplicates |

## API Endpoints

### GET `/api/images/:slug`

Serves the image for a blog post. Triggers generation if image doesn't exist.

- Returns cached image with `Netlify-Cache-Tag: post-image-{slug}`
- Returns default image (uncached) while generating

### GET `/api/regenerate/:slug`

Admin endpoint to force regeneration of an image.

**Authentication:** Requires `key` query param or `x-api-key` header matching `REGEN_API_KEY`.

```bash
curl "https://yoursite.netlify.app/api/regenerate/harry-potter-wand-maker?key=YOUR_KEY"
```

**Actions:**
1. Deletes existing image from blob storage
2. Clears in-progress markers
3. Generates new image (via `waitUntil`)
4. Purges CDN cache for that image

## Blog Posts

All posts are dated between March-November 2025:

1. **251115-hercules-modern-gym-owner.md** (Nov 15, 2025)
2. **251012-frodo-baggins-motivational-speaker.md** (Oct 12, 2025)
3. **250908-sherlock-holmes-culinary-detective.md** (Sep 08, 2025)
4. **250820-wonder-woman-un-ambassador.md** (Aug 20, 2025)
5. **250716-harry-potter-wand-maker.md** (Jul 16, 2025)
6. **250624-luke-skywalker-intergalactic-gardener.md** (Jun 24, 2025)
7. **250530-arya-stark-cultural-explorer.md** (May 30, 2025)
8. **250418-katniss-everdeen-wildlife-advocate.md** (Apr 18, 2025)
9. **250322-batman-dark-knight-writer.md** (Mar 22, 2025)
10. **250308-peter-parker-science-educator.md** (Mar 08, 2025)

### File Naming Convention

- File: `251115-hercules-modern-gym-owner.md`
- URL: `/blog/hercules-modern-gym-owner/`

The date prefix is stripped from URLs in `src/pages/blog/[...slug].astro`.

## Image References in Templates

Images use the Netlify Image CDN paths (not the raw API):

```astro
<!-- Hero image (blog post) -->
<img src={`/images/hero/${slug}`} width="1200" height="675" />

<!-- Featured post -->
<img src={`/images/featured/${slug}`} width="500" height="281" />

<!-- Medium (blog listing) -->
<img src={`/images/medium/${slug}`} width="720" height="405" />

<!-- Thumbnail (grid) -->
<img src={`/images/thumb/${slug}`} width="360" height="203" />
```

## AI Image Prompt

The prompt in `netlify/functions/utils/generate-image.ts` generates:
- Photorealistic editorial photographs
- Magazine-style (TIME/Vanity Fair aesthetic)
- Character in their new environment/role
- Cinematic depth of field
- **No text overlays** - pure photography only

## Content Schema

Located in `src/content/config.ts`:
- Required: `title`, `description`, `pubDate`
- Optional: `updatedDate`
- No `heroImage` field (images are dynamic)

## Design System

### Layout
- Header/home width: 1200px max
- Blog post body: 720px max
- Hero images: 1200px width, 16:9 aspect ratio

### Skeleton Loader
Images use a `.skeleton-image` wrapper class (defined in `global.css`) that shows a pulsing gray animation while images load:
- Animated gradient background (shimmer effect)
- Maintains 16:9 aspect ratio to reserve space
- Hides alt text with `color: transparent`
- Image loads on top when ready

### Typography
- Font: Georgia, 'Times New Roman', serif
- Style: Editorial, professional
- No rounded corners (`border-radius: 0`)

### Colors
```css
--accent: #1a1a1a;
--black: 26, 26, 26;
--gray: 115, 115, 115;
--gray-light: 229, 229, 229;
--gray-dark: 64, 64, 64;
```

## Key Dependencies

- `@google/genai` - Google Gemini AI SDK
- `@netlify/functions` - Netlify Functions runtime
- `@netlify/blobs` - Netlify Blob storage
- `@astrojs/netlify` - Astro Netlify adapter

## Build & Development

```bash
npm run dev      # Local development
npm run build    # Build for production
```

- Build outputs to `dist/`
- Warnings about `getStaticPaths()` being ignored are expected in server mode
- Local dev requires Netlify CLI for full function support: `netlify dev`

## Portability

To use this image generation system in another project:

1. Copy `netlify/functions/` directory
2. Add `netlify.toml` with image CDN rewrites
3. Set `GEMINI_API_KEY` environment variable
4. Ensure blog posts have proper `og:title` and `og:description` meta tags
5. Reference images via `/images/{size}/{slug}` paths
