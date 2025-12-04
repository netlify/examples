import {
  GoogleGenAI,
  type GenerateContentParameters,
  type GenerateContentConfig,
} from "@google/genai";
import { SYSTEM_PROMPT, validate } from "./utils/common";
import type { Config } from "@netlify/functions";

export default async function (req: Request) {
  const validatedRequest = await validate("GEMINI_API_KEY", req);
  if (validatedRequest.error) return validatedRequest.error;
  const { message, model } = validatedRequest;

  const params: GenerateContentParameters = {
    model,
    contents: message,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  };
  minimizeThinking(model, params.config!);

  console.log(
    "=== Making Gemini request ===\n",
    params,
    "\n============================="
  );
  const genAI = new GoogleGenAI({});
  const response = await genAI.models.generateContent(params);

  return Response.json({
    answer: response.text,
    details: { thinking: params.config?.thinkingConfig },
  });
}

function minimizeThinking(model: string, config: GenerateContentConfig) {
  const GEMINI_PRO_MIN_THINKING = 128;

  const supportsThinking =
    (model.includes("2.5") || model.includes("latest")) &&
    !model.includes("image");

  if (supportsThinking) {
    const canDisable = !model.includes("pro");
    config.thinkingConfig = {
      thinkingBudget: canDisable ? 0 : GEMINI_PRO_MIN_THINKING,
    };
  }
}

export const config: Config = {
  path: "/api/gemini",
  // Max 30 requests per 60 seconds per client IP
  rateLimit: {
    windowLimit: 30,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
