import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  // const { next_run } = await req.json();

  // console.log("Received event! Next invocation at:", next_run);

  const accessToken = process.env.NTL_ACCESS_TOKEN;
  const siteId = process.env.SITE_ID;

  if (!accessToken || !siteId) {
    return new Response("Missing NTL_ACCESS_TOKEN or SITE_ID", { status: 500 });
  }

  const createParams = new URLSearchParams();
  createParams.set("site_id", siteId);

  const agent = "claude";
  const model = "claude-opus-4-20250514";

  const finalPrompt = `This is a site about random acts of creativity. Your job is to generate a new post.

Visit https://wikiroulette.co/ to get a random Wikipedia article. Use this article as inspiration for something creative you can make at home. It could be a craft, a recipe, a DIY project, an experiment, or anything else that involves making something.

If the article doesn't inspire you, you can try again until you find one that does.

Once you have an idea, write a blog post about it in src/content/blog following these instructions:

- Name the file with the current date in YYMMDD-<slug>.md format
- Add title, description, pubDate, and heroImage frontmatter fields
- For the image, find a relevant photo on Unsplash and use that URL
- Write at least 3 paragraphs describing the project, including materials needed and steps to complete it
- Make it fun and engaging to read

Remember, the goal is to inspire readers to try the project themselves, so be clear and enthusiastic!`;

  const response = await fetch(
    `https://api.netlify.com/api/v1/agent_runners?${createParams.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken ?? ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // ...(branch ? { branch } : {}),
        prompt: finalPrompt,
        agent,
        model,
      }),
    }
  );

  return response;
};

export const config: Config = {
  schedule: "0 17 * * *", // every day at 5:00 PM UTC
  // path: "/api/generate-blog-post",
};
