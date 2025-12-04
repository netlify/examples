# AI Blog Image Generator - Agent Recipe

Use this prompt with any AI coding agent to add automatic AI-powered image generation to your blog hosted on Netlify.

---

## Configuration Variables

Customize these values before running the prompt with your agent:

```
BLOG_POST_URL_PATTERN: /blog/:slug/
IMAGE_ASPECT_RATIO: 16:9
IMAGE_GENERATION_PROMPT: (see below - customize for your blog's theme)
```

### Default Image

The system needs a fallback image to display while AI images are generating. You have two options:

**Option A: Attach an image to this prompt** (Recommended)
If your AI coding agent supports file attachments, attach your default image directly to the prompt and set the configuration value to `attached`:

```
Default image path: attached
```

The agent will save the attached image to your project.

**Option B: Specify a path to an existing image**
If you already have a default image in your project, or your agent doesn't support attachments, replace the placeholder in "My Configuration" below with your actual path:

```
Default image path: /images/default.png
```

The path should be the public URL path (e.g., `/images/default.png`), not the filesystem path (e.g., `public/images/default.png`).

### Image Sizes (adjust based on your design)

| Name | Width | Height | Usage |
|------|-------|--------|-------|
| hero | 1200 | 675 | Blog post hero images |
| featured | 500 | 281 | Featured/highlighted posts |
| medium | 720 | 405 | Blog listing pages |
| thumb | 360 | 203 | Grid/card thumbnails |

### Image Generation Prompt

Customize this prompt for your blog's theme and style. The prompt receives `title` and `description` from your post's meta tags.

```
Create a photorealistic editorial photograph for a magazine-style blog hero image.

SUBJECT: Based on the title: {title}
CONTEXT: {description}

STYLE REQUIREMENTS:
- Professional photography style
- Warm, inviting lighting
- 16:9 aspect ratio, horizontal orientation
- High quality, detailed, photorealistic rendering
- Cinematic depth of field

RESTRICTIONS:
- DO NOT include any text, titles, captions, or watermarks
- DO NOT include any logos or branding
- Pure photography only - no graphic design elements
```

---

## Prompt for Your AI Agent

Copy everything below this line and provide it to your AI coding agent:

---

### Task: Add AI-Powered Image Generation to My Blog

I want to add automatic AI-generated images to my blog using Google Gemini and Netlify. When a blog post is loaded and doesn't have an image yet, the system should automatically generate one based on the post's title and description.

### My Configuration

```
Blog post URL pattern: [BLOG_POST_URL_PATTERN]
Aspect ratio: [IMAGE_ASPECT_RATIO]
Default image path: [DEFAULT_IMAGE_PATH or "attached" if image is attached to this prompt]
```

Image sizes I need:
- hero: [WIDTH]x[HEIGHT] - [USAGE]
- featured: [WIDTH]x[HEIGHT] - [USAGE]
- medium: [WIDTH]x[HEIGHT] - [USAGE]
- thumb: [WIDTH]x[HEIGHT] - [USAGE]

### IMPORTANT: Agent Validation Instructions

**Before doing ANY implementation work, you MUST validate the configuration above.**

Check for these unconfigured placeholder patterns. If ANY of these exact strings appear in "My Configuration" above, STOP and tell the user to properly configure their values:

- `[BLOG_POST_URL_PATTERN]` - User must replace with their actual blog URL pattern (e.g., `/blog/:slug/`, `/posts/:slug/`)
- `[IMAGE_ASPECT_RATIO]` - User must replace with their desired aspect ratio (e.g., `16:9`, `4:3`, `1:1`)
- `[DEFAULT_IMAGE_PATH or "attached"` - User must either attach an image OR replace with an actual path
- `[WIDTH]` or `[HEIGHT]` or `[USAGE]` - User must replace with actual image dimensions

**Default image validation:**
1. If the default image path is exactly `attached`:
   - Check if an image file was attached to this prompt
   - If yes, save it to `public/images/default.png` (or equivalent static directory for the framework)
   - If no image is attached, STOP and tell the user: "You set the default image path to 'attached' but no image file was attached to this prompt. Please attach an image and try again."
2. If the default image path is a URL path like `/images/default.png`:
   - Verify that file exists in the project's static/public directory
   - If the file doesn't exist, STOP and tell the user: "Configuration Error: The default image at [their specified path] doesn't exist. Please create this file or attach an image to this prompt instead."

**If validation fails**, respond with a clear message like:
> "I found unconfigured placeholder values in your configuration. Please update the following before I can proceed:
> - [list the specific placeholders that need to be replaced]"

### Requirements

1. **On-demand generation**: Images are generated the first time they're requested, not at build time
2. **Blob storage**: Generated images are stored in Netlify Blobs so they persist
3. **Image CDN**: Use Netlify Image CDN to serve optimized images at different sizes
4. **Graceful fallback**: Show a default image while generation is in progress
5. **Duplicate prevention**: Don't trigger multiple generations for the same image
6. **Admin regeneration**: Provide an authenticated endpoint to regenerate any image
7. **SEO integration**: The same generated image should work for both UI display and og:image meta tags

### Step 1: Research My Blog Structure

Before implementing, please research my codebase to understand:

1. **Framework**: What framework is my blog built with?
2. **Post structure**: How are blog posts organized? (files, database, CMS, etc.)
3. **URL routing**: What URL pattern do my blog posts use?
4. **Meta tags**: Where are og:title and og:description set? The image generator needs these.
5. **Existing images**: How are images currently handled in my templates/components?
6. **Netlify config**: Do I have an existing netlify.toml file?

### Step 2: Create Netlify Functions

Create the following files in `netlify/functions/`:

#### `netlify/functions/post-image.mts`

This function serves images and triggers generation if needed.

**Note:** Update `DEFAULT_IMAGE_PATH` below if the user specified a different path in their configuration.

```typescript
import { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { generateAndStoreImage, isGenerationInProgress } from "./utils/generate-image.js";
import { fetchPostMetadata } from "./utils/parse-meta-tags.js";

// UPDATE THIS if user specified a different default image path
const DEFAULT_IMAGE_PATH = "/images/default.png";

async function fetchDefaultImage(origin: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(`${origin}${DEFAULT_IMAGE_PATH}`);
    if (response.ok) {
      return await response.arrayBuffer();
    }
  } catch (error) {
    console.error("Failed to fetch default image:", error);
  }
  return null;
}

export default async (request: Request, context: Context) => {
  const { slug } = context.params;
  const url = new URL(request.url);
  const origin = url.origin;

  if (!slug) {
    return new Response("Slug is required", { status: 400 });
  }

  try {
    const postImageStore = getStore("PostImage");
    const blobImage = await postImageStore.get(slug, { type: "arrayBuffer" });

    if (blobImage) {
      return new Response(blobImage, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Netlify-Cache-Tag": `post-image-${slug}`,
          "CDN-Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const inProgress = await isGenerationInProgress(slug);

    if (!inProgress) {
      const metadata = await fetchPostMetadata(origin, slug);

      if (metadata) {
        context.waitUntil(
          generateAndStoreImage({
            slug,
            title: metadata.title,
            description: metadata.description,
          }).then((result) => {
            if (result.success) {
              console.log(`Image generated for ${slug}`);
            } else {
              console.error(`Image generation failed for ${slug}:`, result.error);
            }
          })
        );
      } else {
        console.error(`Could not fetch metadata for ${slug}`);
      }
    }

    const defaultImage = await fetchDefaultImage(origin);

    if (defaultImage) {
      return new Response(defaultImage, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    return new Response("Image not found", { status: 404 });
  } catch (error) {
    console.error("Error serving image:", error);
    const defaultImage = await fetchDefaultImage(origin);

    if (defaultImage) {
      return new Response(defaultImage, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    return new Response("Image not found", { status: 404 });
  }
};

export const config: Config = {
  path: "/api/images/:slug",
};
```

#### `netlify/functions/regenerate-image.mts`

Admin endpoint to force regeneration:

```typescript
import { Config, Context, purgeCache } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { generateAndStoreImage } from "./utils/generate-image.js";
import { fetchPostMetadata } from "./utils/parse-meta-tags.js";

const REGEN_API_KEY = process.env.REGEN_API_KEY;

export default async (request: Request, context: Context) => {
  const { slug } = context.params;
  const url = new URL(request.url);
  const origin = url.origin;

  const providedKey =
    url.searchParams.get("key") || request.headers.get("x-api-key");

  if (!REGEN_API_KEY) {
    return new Response(
      JSON.stringify({ error: "REGEN_API_KEY not configured on server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (providedKey !== REGEN_API_KEY) {
    return new Response(JSON.stringify({ error: "Invalid or missing API key" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const postImageStore = getStore("PostImage");
    try {
      await postImageStore.delete(slug);
    } catch {
      // Image may not exist
    }

    const inProgressStore = getStore("GenerationInProgress");
    try {
      await inProgressStore.delete(slug);
    } catch {
      // May not exist
    }

    const metadata = await fetchPostMetadata(origin, slug);

    if (!metadata) {
      return new Response(
        JSON.stringify({ error: `Could not fetch metadata for ${slug}` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    context.waitUntil(
      generateAndStoreImage({
        slug,
        title: metadata.title,
        description: metadata.description,
      }).then(async (result) => {
        if (result.success) {
          console.log(`Image regenerated for ${slug}`);
          try {
            await purgeCache({ tags: [`post-image-${slug}`] });
          } catch (error) {
            console.error(`Failed to purge cache:`, error);
          }
        } else {
          console.error(`Image regeneration failed for ${slug}:`, result.error);
        }
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        slug,
        message: `Image regeneration started for ${slug}`,
      }),
      { status: 202, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message, slug }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/regenerate/:slug",
};
```

#### `netlify/functions/utils/generate-image.ts`

Core image generation logic. **Customize the `buildPrompt` function for your blog's theme:**

```typescript
import { GoogleGenAI } from "@google/genai";
import { getStore } from "@netlify/blobs";

interface GenerateImageParams {
  slug: string;
  title: string;
  description: string;
}

interface GenerateImageResult {
  success: boolean;
  error?: string;
}

function buildPrompt(title: string, description: string): string {
  // CUSTOMIZE THIS PROMPT FOR YOUR BLOG'S THEME
  return `[YOUR CUSTOM IMAGE GENERATION PROMPT]

TITLE: ${title}
DESCRIPTION: ${description}

[YOUR STYLE REQUIREMENTS]

=== CRITICAL RESTRICTIONS ===
- DO NOT include any text, titles, captions, or watermarks in the image
- DO NOT include any logos, branding, or publication names
- The image should be ONLY the photograph with NO text of any kind
- Pure photography only - no graphic design elements`;
}

export async function isGenerationInProgress(slug: string): Promise<boolean> {
  const inProgressStore = getStore("GenerationInProgress");
  const entry = await inProgressStore.get(slug);
  return entry !== null;
}

async function markGenerationStarted(slug: string): Promise<void> {
  const inProgressStore = getStore("GenerationInProgress");
  await inProgressStore.set(slug, JSON.stringify({ startedAt: new Date().toISOString() }));
}

async function clearGenerationProgress(slug: string): Promise<void> {
  const inProgressStore = getStore("GenerationInProgress");
  try {
    await inProgressStore.delete(slug);
  } catch {
    // Ignore errors if blob doesn't exist
  }
}

export async function generateAndStoreImage({
  slug,
  title,
  description,
}: GenerateImageParams): Promise<GenerateImageResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { success: false, error: "GEMINI_API_KEY is not configured" };
  }

  if (await isGenerationInProgress(slug)) {
    return { success: false, error: "Generation already in progress" };
  }

  await markGenerationStarted(slug);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(title, description);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["image", "text"],
        imageConfig: {
          aspectRatio: "[IMAGE_ASPECT_RATIO]",
        },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      await clearGenerationProgress(slug);
      return { success: false, error: "No response parts received" };
    }

    const imagePart = parts.find(
      (part: { inlineData?: { mimeType: string } }) =>
        part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData?.data) {
      await clearGenerationProgress(slug);
      return { success: false, error: "No image data in response" };
    }

    const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");

    const postImageStore = getStore("PostImage");
    await postImageStore.set(slug, imageBuffer, {
      metadata: {
        contentType: imagePart.inlineData.mimeType,
        generatedAt: new Date().toISOString(),
        title,
      },
    });

    await clearGenerationProgress(slug);
    return { success: true };
  } catch (error) {
    await clearGenerationProgress(slug);
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to generate image for ${slug}:`, message);
    return { success: false, error: message };
  }
}
```

#### `netlify/functions/utils/parse-meta-tags.ts`

Extracts title and description from post pages. **Update the URL pattern to match your blog:**

```typescript
export interface PostMetadata {
  title: string;
  description: string;
}

export async function fetchPostMetadata(
  origin: string,
  slug: string
): Promise<PostMetadata | null> {
  try {
    // UPDATE THIS URL PATTERN TO MATCH YOUR BLOG
    const postUrl = `${origin}[BLOG_POST_URL_PATTERN]`.replace(':slug', slug);
    const response = await fetch(postUrl);

    if (!response.ok) {
      console.error(`Failed to fetch post page: ${response.status}`);
      return null;
    }

    const html = await response.text();
    return parseMetaTags(html);
  } catch (error) {
    console.error(`Error fetching post metadata for ${slug}:`, error);
    return null;
  }
}

function parseMetaTags(html: string): PostMetadata | null {
  const titleMatch = html.match(
    /<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i
  );

  const descMatch = html.match(
    /<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:description["']/i
  );

  const titleFallback = html.match(/<title>([^<]+)<\/title>/i);

  const descFallback = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i
  );

  const title = titleMatch?.[1] || titleFallback?.[1];
  const description = descMatch?.[1] || descFallback?.[1];

  if (!title || !description) {
    console.error("Could not extract title or description from meta tags");
    return null;
  }

  return {
    title: decodeHtmlEntities(title),
    description: decodeHtmlEntities(description),
  };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}
```

### Step 3: Configure Netlify

Add or update `netlify.toml` with these settings:

```toml
[build]
  functions = "netlify/functions"

[images]
  remote_images = [".*"]

# Image CDN rewrites - transform images from the API endpoint
# Adjust sizes based on your configuration

[[redirects]]
  from = "/images/hero/:slug"
  to = "/.netlify/images?url=/api/images/:slug&w=[HERO_WIDTH]&h=[HERO_HEIGHT]&fit=cover"
  status = 200

[[redirects]]
  from = "/images/featured/:slug"
  to = "/.netlify/images?url=/api/images/:slug&w=[FEATURED_WIDTH]&h=[FEATURED_HEIGHT]&fit=cover"
  status = 200

[[redirects]]
  from = "/images/medium/:slug"
  to = "/.netlify/images?url=/api/images/:slug&w=[MEDIUM_WIDTH]&h=[MEDIUM_HEIGHT]&fit=cover"
  status = 200

[[redirects]]
  from = "/images/thumb/:slug"
  to = "/.netlify/images?url=/api/images/:slug&w=[THUMB_WIDTH]&h=[THUMB_HEIGHT]&fit=cover"
  status = 200
```

### Step 4: Install Dependencies

Add these packages to the project:

```bash
npm install @google/genai @netlify/functions @netlify/blobs
```

### Step 5: Set Environment Variables

In Netlify Dashboard > Site Settings > Environment Variables, add:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI Studio API key (get from https://aistudio.google.com/apikey) |
| `REGEN_API_KEY` | Secret key for admin regeneration endpoint (generate a random string) |

### Step 6: Set Up Default Image

The default image should already be in place from the validation step:

- **If user attached an image**: You saved it to `public/images/default.png` (or the framework's static directory)
- **If user specified a path**: You verified it exists

The default image path used in the functions should be `/images/default.png` (the public URL path, not the filesystem path).

If for some reason the default image is missing at this point, ask the user to provide one before proceeding.

### Step 7: Integrate with Blog Templates

Based on your research of my blog's structure, update the templates to use the generated images:

#### For UI Images

Replace existing image references with the CDN paths:

```html
<!-- Hero image -->
<img src="/images/hero/{slug}" width="1200" height="675" alt="..." />

<!-- Featured post -->
<img src="/images/featured/{slug}" width="500" height="281" alt="..." />

<!-- Blog listing -->
<img src="/images/medium/{slug}" width="720" height="405" alt="..." />

<!-- Thumbnail/grid -->
<img src="/images/thumb/{slug}" width="360" height="203" alt="..." />
```

#### For SEO Meta Tags

Update the og:image meta tag to use the hero size:

```html
<meta property="og:image" content="https://yourdomain.com/images/hero/{slug}" />
```

#### Loading States (Recommended)

Add a skeleton loader for images while they load:

```css
.skeleton-image {
  background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Step 8: Test the Integration

1. Deploy to Netlify
2. Visit a blog post page
3. The first load should show the default image
4. Refresh after a few seconds - the AI-generated image should appear
5. Test the regeneration endpoint:
   ```bash
   curl "https://yoursite.netlify.app/api/regenerate/{slug}?key=YOUR_REGEN_API_KEY"
   ```

### API Reference

#### GET `/api/images/:slug`

Serves the image for a blog post. Triggers generation if the image doesn't exist.

- Returns cached image with long cache headers
- Returns default image (uncached) while generating

#### GET `/api/regenerate/:slug`

Admin endpoint to force regeneration.

**Authentication**: Requires `key` query param or `x-api-key` header matching `REGEN_API_KEY`.

Returns `202 Accepted` with JSON body indicating regeneration started.

---

## Troubleshooting

### Image not generating

1. Check Netlify function logs for errors
2. Verify `GEMINI_API_KEY` is set correctly
3. Ensure your blog posts have `og:title` and `og:description` meta tags
4. Verify the blog post URL pattern in `parse-meta-tags.ts` is correct

### Stuck in "generating" state

Use the regeneration endpoint to clear the in-progress marker:

```bash
curl "https://yoursite.netlify.app/api/regenerate/{slug}?key=YOUR_KEY"
```

### Image CDN not working

1. Verify `[images] remote_images = [".*"]` is in netlify.toml
2. Check that redirects are configured correctly
3. Ensure you're using the `/images/{size}/{slug}` paths, not `/api/images/`
