import { getCollection } from "astro:content";
import { getStore } from "@netlify/blobs";

export interface Post {
  id: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    heroImage?: string;
    updatedDate?: Date;
  };
  body?: string;
  render?: () => Promise<{ Content: any }>;
}

/**
 * Fetches and merges posts from both the Astro content collection
 * and the dynamic completed-posts blob store, sorted by pubDate (newest first)
 */
export async function getAllPosts(): Promise<Post[]> {
  // Get posts from Astro content collection
  const collectionPosts = await getCollection("blog");

  const blobPosts: Post[] = [];

  try {
    // Get posts from completed-posts blob store
    const completedStore = getStore("completed-posts");
    const { blobs } = await completedStore.list();

    for (const blob of blobs) {
      const postData = await completedStore.get(blob.key, { type: "json" });
      if (postData) {
        // Generate a slug from the blob key (remove .json extension)
        const slug = blob.key.replace(/\.json$/, "");

        // Transform blob post to match content collection structure
        blobPosts.push({
          id: slug,
          data: {
            title: postData.title,
            description: postData.description,
            pubDate: new Date(postData.pubDate),
            heroImage: postData.heroImage,
          },
          body: postData.body,
        });
      }
    }
  } catch (error) {
    // If blob store is not available (e.g., during local dev without Netlify CLI),
    // just continue with collection posts only
    console.warn("Could not fetch posts from blob store:", error);
  }

  // Merge and sort by pubDate (newest first)
  const allPosts = [...collectionPosts, ...blobPosts];
  allPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return allPosts;
}
