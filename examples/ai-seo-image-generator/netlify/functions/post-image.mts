import { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { generateAndStoreImage, isGenerationInProgress } from "./utils/generate-image.js";
import { fetchPostMetadata } from "./utils/parse-meta-tags.js";

async function fetchDefaultImage(origin: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(`${origin}/images/default.png`);
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

    // Try to get the image from blob storage
    const blobImage = await postImageStore.get(slug, { type: "arrayBuffer" });

    if (blobImage) {
      // Return the cached image with Netlify cache headers
      return new Response(blobImage, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000, immutable",
          "Netlify-Cache-Tag": `post-image-${slug}`,
          "CDN-Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // No blob found - check if generation is already in progress
    const inProgress = await isGenerationInProgress(slug);

    if (!inProgress) {
      // Fetch post metadata from the blog post page
      const metadata = await fetchPostMetadata(origin, slug);

      if (metadata) {
        // Use waitUntil to generate image in background without blocking response
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
    } else {
      console.log(`Generation already in progress for ${slug}, skipping`);
    }

    // Return default image WITHOUT caching (so we check for blob on next request)
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

    // Try to return default image on error
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
