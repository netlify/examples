import Anthropic from "@anthropic-ai/sdk";
import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { WRITING_GUIDE } from "./lib/writing-guide.mts";

export default async (req: Request) => {
  const client = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"],
  });

  const model = "claude-haiku-4-5-20251001";

  // Get the oldest pending topic
  const pendingStore = getStore("pending-topics");
  const pendingList = (await pendingStore.get("list", { type: "json" })) || [];

  if (pendingList.length === 0) {
    return new Response(
      JSON.stringify({ message: "No pending topics to process" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const oldestBlobKey = pendingList[0];
  console.log("Processing topic:", oldestBlobKey);

  // Fetch the topic data
  const topicsStore = getStore("blog-topics");
  const topicData = await topicsStore.get(oldestBlobKey, { type: "json" });

  if (!topicData) {
    return new Response(
      JSON.stringify({ error: "Topic data not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log("Topic data:", topicData);

  // Generate today's date in the format "MMM DD YYYY"
  const today = new Date();
  const pubDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const USER_PROMPT = `You are writing a blog post for a site about random acts of creativity.

Here is the creative project that was sourced:
${JSON.stringify(topicData, null, 2)}

Write a complete blog post about this project following the voice, tone, and style guidelines below:

${WRITING_GUIDE}

---

The post should include:
- A catchy title
- A brief description (1-2 sentences for SEO/preview)
- Publication date: Use "${pubDate}"
- Hero image: Generate a placeholder URL in this format:
  https://placehold.co/1600x800/BGCOLOR/333333?font=Lora&text=URL_ENCODED_TITLE

  Where:
  - BGCOLOR is a bright, vibrant hex color (without the #). Use colors like: FFFFCC (pale yellow), FFB6C1 (light pink), B0E0E6 (powder blue), DDA0DD (plum), F0E68C (khaki), E0BBE4 (lavender), FFDAB9 (peach), C1FFC1 (pale green). Choose one that fits the mood of the post.
  - 333333 is the dark text color for good contrast
  - URL_ENCODED_TITLE is the post title with spaces replaced by + signs and special characters URL encoded

- Full markdown body content with:
  - An engaging introduction that tells a story and explains the inspiration
  - 3-5 sections with descriptive subheadings (#### format)
  - The narrative should weave in the materials and steps naturally
  - A compelling conclusion that paints a picture of the final result

Remember: Focus on the experience and joy of creating, not just technical instructions. Be whimsical, playful, and encouraging.

Return ONLY a valid JSON object with this structure. Do not include any markdown formatting, code blocks, or explanatory text - just the raw JSON:
{
  "title": "Blog post title",
  "description": "SEO-friendly description",
  "pubDate": "${pubDate}",
  "heroImage": "https://placehold.co/1600x800/BGCOLOR/333333?font=Lora&text=Title",
  "body": "Full markdown content here"
}`;

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
    return new Response(
      JSON.stringify({ error: "Failed to parse AI response as JSON" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
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
    }
  );
};

export const config: Config = {
  path: "/api/process-blog-post",
};
