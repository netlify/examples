import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (req: Request) => {
  // Get the pending list
  const pendingStore = getStore("pending-topics");
  const pendingList = (await pendingStore.get("list", { type: "json" })) || [];

  if (pendingList.length === 0) {
    return new Response(JSON.stringify({ topics: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fetch all pending topics
  const topicsStore = getStore("blog-topics");
  const topics = [];

  for (const blobKey of pendingList) {
    const topicData = await topicsStore.get(blobKey, { type: "json" });
    if (topicData) {
      topics.push({
        blobKey,
        ...topicData,
      });
    }
  }

  return new Response(JSON.stringify({ topics }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  path: "/api/list-pending-topics",
};
