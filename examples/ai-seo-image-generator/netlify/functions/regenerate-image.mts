import { Config, Context, purgeCache } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { generateAndStoreImage } from "./utils/generate-image.js";
import { fetchPostMetadata } from "./utils/parse-meta-tags.js";

const REGEN_API_KEY = process.env.REGEN_API_KEY;

export default async (request: Request, context: Context) => {
  const { slug } = context.params;
  const url = new URL(request.url);
  const origin = url.origin;

  // Require API key
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
    // Delete existing image from blob storage
    const postImageStore = getStore("PostImage");
    try {
      await postImageStore.delete(slug);
      console.log(`Deleted existing image for ${slug}`);
    } catch {
      // Image may not exist, that's fine
      console.log(`No existing image to delete for ${slug}`);
    }

    // Clear any in-progress markers
    const inProgressStore = getStore("GenerationInProgress");
    try {
      await inProgressStore.delete(slug);
    } catch {
      // May not exist
    }

    // Fetch post metadata
    const metadata = await fetchPostMetadata(origin, slug);

    if (!metadata) {
      return new Response(
        JSON.stringify({ error: `Could not fetch metadata for ${slug}` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use waitUntil to generate image in background
    console.log(`Starting regeneration for ${slug}...`);
    context.waitUntil(
      generateAndStoreImage({
        slug,
        title: metadata.title,
        description: metadata.description,
      }).then(async (result) => {
        if (result.success) {
          console.log(`Image regenerated for ${slug}`);
          // Purge cache after successful generation
          try {
            await purgeCache({ tags: [`post-image-${slug}`] });
            console.log(`Purged cache for post-image-${slug}`);
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
    console.error(`Error regenerating image for ${slug}:`, message);
    return new Response(
      JSON.stringify({ error: message, slug }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config: Config = {
  path: "/api/regenerate/:slug",
};
