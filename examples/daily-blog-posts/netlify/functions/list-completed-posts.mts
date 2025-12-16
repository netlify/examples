import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (_req: Request) => {
  const completedStore = getStore("completed-posts");

  // List all blobs in the completed-posts store
  const { blobs } = await completedStore.list();

  if (blobs.length === 0) {
    return new Response(JSON.stringify({ posts: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch all completed posts
  const posts = [];

  for (const blob of blobs) {
    const postData = await completedStore.get(blob.key, { type: "json" });
    if (postData) {
      posts.push({
        blobKey: blob.key,
        ...postData,
      });
    }
  }

  return new Response(JSON.stringify({ posts }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/list-completed-posts",
};
