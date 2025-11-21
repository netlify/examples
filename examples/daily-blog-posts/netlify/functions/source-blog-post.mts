import Anthropic from "@anthropic-ai/sdk";
import type { Config } from "@netlify/functions";

async function fetchRandomWikipediaTopic() {
  // Follow redirects from wikiroulette to get a random Wikipedia article
  const response = await fetch("https://wikiroulette.co/", {
    redirect: "follow",
  });

  const url = response.url;
  const html = await response.text();

  // Extract the article title from the page
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(" - Wikipedia", "").trim() : "Unknown";

  // Extract the first paragraph (usually the article summary)
  const paragraphMatch = html.match(/<p[^>]*>(?!<\/p>)([\s\S]*?)<\/p>/);
  let summary = "";
  if (paragraphMatch) {
    // Strip HTML tags and clean up
    summary = paragraphMatch[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\[\d+\]/g, "")
      .trim();
  }

  return { title, url, summary };
}

export default async (req: Request) => {
  const client = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"],
  });

  const model = "claude-haiku-4-5-20251001";

  // Fetch a random Wikipedia topic
  const topic = await fetchRandomWikipediaTopic();
  console.log("Fetched topic:", topic);

  const USER_PROMPT = `You are helping to create content for a blog about random acts of creativity.

I found a random Wikipedia article: "${topic.title}"
${topic.summary ? `\nSummary: ${topic.summary}` : ""}
${topic.url ? `\nURL: ${topic.url}` : ""}

Use this as inspiration for something creative that someone can make at home. It could be a craft, a recipe, a DIY project, an experiment, or anything else that involves making something.

Return your response as a JSON object with this structure:
{
  "title": "Creative project title",
  "description": "Brief description (2-3 sentences)",
  "wikipediaArticle": "${topic.url}",
  "materials": ["material1", "material2"],
  "steps": ["step1", "step2"]
}`;

  const response = await client.messages.create({
    model,
    messages: [
      {
        role: "user",
        content: USER_PROMPT,
      },
    ],
    max_tokens: 2000,
  });

  const textContent = response.content.find((block) => block.type === "text");
  const result = textContent ? textContent.text : "";

  console.log("Anthropic response:", result);
  console.log("Token usage:", response.usage);

  return new Response(result, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config: Config = {
  // schedule: "0 17 * * *", // every day at 5:00 PM UTC
  path: "/api/source-blog-post",
};
