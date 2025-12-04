import Anthropic from "@anthropic-ai/sdk";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";
import { SYSTEM_PROMPT, validate } from "./utils/common";
import type { Config } from "@netlify/functions";

const MAX_OUTPUT_TOKENS = 20; // Anthropic requires max tokens (and tends to be chatty)

export default async function (req: Request) {
  const validatedRequest = await validate("ANTHROPIC_API_KEY", req);
  if (validatedRequest.error) return validatedRequest.error;

  const { message, model } = validatedRequest;

  const anthropic = new Anthropic();
  const params: MessageCreateParamsNonStreaming = {
    model,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    max_tokens: MAX_OUTPUT_TOKENS,
  };

  console.log(
    "=== Making Anthropic request ===\n",
    params,
    "\n================================"
  );
  const response = await anthropic.messages.create(params);

  if (response.content[0].type === "text") {
    return Response.json({
      answer: response.content[0].text,
      details: { maxTokens: MAX_OUTPUT_TOKENS },
    });
  } else {
    console.error("Unexpected model content:", response.content);
    return Response.json({ error: "Unexpcted content" }, { status: 500 });
  }
}

export const config: Config = {
  path: "/api/anthropic",
  // Max 30 requests per 60 seconds per client IP
  rateLimit: {
    windowLimit: 30,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
