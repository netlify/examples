import Anthropic from "@anthropic-ai/sdk";
import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { generateBlogPostPrompt } from "./lib/writing-guide.mts";

export default async (_req: Request) => {
  const client = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"],
  });

  const model = "claude-haiku-4-5-20251001";

  // Get the oldest pending topic
  const pendingStore = getStore("pending-topics");
  const pendingList = (await pendingStore.get("list", { type: "json" })) || [];

  if (pendingList.length === 0) {
    return new Response(JSON.stringify({ message: "No pending topics to process" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const oldestBlobKey = pendingList[0];
  console.log("Processing topic:", oldestBlobKey);

  // Fetch the topic data
  const topicsStore = getStore("blog-topics");
  const topicData = await topicsStore.get(oldestBlobKey, { type: "json" });

  if (!topicData) {
    return new Response(JSON.stringify({ error: "Topic data not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Topic data:", topicData);

  // Generate today's date in the format "MMM DD YYYY"
  const today = new Date();
  const pubDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const USER_PROMPT = generateBlogPostPrompt(topicData, pubDate);

  const response = await client.messages.create({
    model,
    messages: [
      {
        role: "user",
        content: USER_PROMPT,
      },
    ],
    max_tokens: 4000,
  });

  const textContent = response.content.find((block) => block.type === "text");
  const result = textContent ? textContent.text : "";

  console.log("Anthropic response:", result);
  console.log("Token usage:", response.usage);

  // Strip markdown code block formatting (safety net)
  const cleanedResult = result
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```\s*$/, "")
    .trim();

  // Parse the JSON to validate it
  let parsedResult;
  try {
    parsedResult = JSON.parse(cleanedResult);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return new Response(JSON.stringify({ error: "Failed to parse AI response as JSON" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Store the completed blog post
  const completedStore = getStore("completed-posts");
  await completedStore.set(oldestBlobKey, JSON.stringify(parsedResult));

  // Remove from pending list
  const updatedPendingList = pendingList.slice(1);
  await pendingStore.set("list", JSON.stringify(updatedPendingList));

  console.log("Completed blog post:", oldestBlobKey);

  return new Response(
    JSON.stringify({
      success: true,
      blobKey: oldestBlobKey,
      post: parsedResult,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const config: Config = {
  // schedule: "0 18 * * *", // every day at 6:00 PM UTC (1 hour after topic sourcing)
  // Uncomment the line below and comment out the schedule above to use as an API endpoint instead
  path: "/api/create-blog-post",
};
