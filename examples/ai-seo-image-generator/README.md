[Deploy to Netlify]: https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples&create_from_path=examples/ai-seo-image-generator&utm_campaign=dx-examples

![Netlify Examples](https://github.com/netlify/examples/assets/5865/4145aa2f-b915-404f-af02-deacee24f7bf)

# AI SEO Image Generator

This example demonstrates how to build an AI-powered image generation system for blog posts using Netlify's platform primitives. Images are generated on-demand using Google Gemini from each post's metadata, then cached and served through Netlify's Image CDN at multiple optimized sizes.

## Netlify Primitives in Action

This project showcases several Netlify primitives working together:

- **[AI Gateway](https://docs.netlify.com/build/ai-gateway/overview/)**: Provides access to Google Gemini for image generation without managing API keys.
- **[Netlify Functions](https://docs.netlify.com/functions/overview/)**: Serverless functions serve images and handle generation requests.
- **[Netlify Blobs](https://docs.netlify.com/blobs/overview/)**: Key-value storage persists generated images and tracks in-progress generations.
- **[Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/)**: Transforms and serves images at multiple optimized sizes (hero, featured, medium, thumbnail).
- **[Advanced Caching](https://docs.netlify.com/build/caching/caching-overview/)**: Enables targeted cache invalidation when images are regenerated.

## How It Works

1. **User visits a blog post** or listing page that references an image
2. **Image request hits the CDN** which routes to the Netlify Function
3. **Function checks Blob storage** for an existing generated image
4. **If found** → serves the cached image with long-lived cache headers
5. **If not found** → triggers AI generation via `waitUntil()` and returns a placeholder immediately
6. **Google Gemini generates** a photorealistic image based on the post's `og:title` and `og:description`
7. **Image is stored** in Blobs and served on subsequent requests
8. **Image CDN** transforms the single source image into multiple sizes (1200px hero, 720px medium, 360px thumbnail, etc.)

The same generated image works for both UI display and SEO meta tags (`og:image`).

## Agent Runner Recipe

**This example is portable.** The image generation system can be added to any blog hosted on Netlify using the included `PROMPT.md` file with [Netlify Agent Runner](https://docs.netlify.com/build/build-with-ai/agent-runners/overview/).

### Use in Your Own Blog

1. Copy the `PROMPT.md` file to your blog project
2. Customize the configuration variables (URL patterns, image sizes, generation prompt)
3. Run the prompt with Netlify Agent Runner or any AI coding assistant
4. The agent will analyze your blog structure and integrate the image generation system

The recipe handles framework detection, template integration, and all the necessary wiring automatically.

## Clone and Deploy

Deploy your own version by clicking the button below:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)][Deploy to Netlify]

This will:

1. Clone this example to your GitHub account
2. Create a new site in your Netlify account
3. Build and deploy the site with AI Gateway automatically enabled

Once deployed, visit any blog post. The first load shows a placeholder while the image generates, then the AI-generated image appears on refresh.

## Local Development

After deploying with the button above:

```bash
# Clone YOUR newly created repo (not netlify/examples)
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Link to your Netlify site
netlify link

# Start the dev server
netlify dev
```

The `netlify link` command connects your local environment to the deployed site, enabling Blob storage access.

## Tech Stack

- **Frontend**: Astro + TypeScript
- **Backend**: Netlify Functions (modern `.mts` format)
- **Storage**: Netlify Blobs
- **AI**: Google Gemini via AI Gateway
- **Images**: Netlify Image CDN

## Optional: Image Regeneration Endpoint

The example includes an optional admin endpoint to force-regenerate images. This is useful during development or if you need to update an image after changing a post's content.

To enable it, set `REGEN_API_KEY` in your environment variables (locally or in Netlify). The endpoint is intentionally disabled without this key to prevent unintended generation costs.

```bash
# Regenerate an image locally or in production
curl "https://yoursite.netlify.app/api/regenerate/{slug}?key=YOUR_REGEN_API_KEY"
```

## More Examples

Explore other examples in the [Netlify examples repository](https://github.com/netlify/examples).
