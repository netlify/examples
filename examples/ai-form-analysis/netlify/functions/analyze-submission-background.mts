import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import Anthropic from "@anthropic-ai/sdk";

interface SubmissionData {
  key: string;
  name: string;
  company: string;
  email: string;
  preferredTime: string;
  notes: string;
  submittedAt: string;
  analysisState: "pending" | "analyzing" | "completed" | "spam" | "error";
  isSpam?: boolean;
  summary?: string;
  recommendation?: string;
  analysisError?: string;
  spamReasoning?: string;
}

/**
 * Extracts JSON from text that may contain markdown code fences or additional prose
 */
function extractJSON(text: string): string {
  // First strip markdown code fences
  let cleaned = text
    .replace(/^```(?:json)?\s*\n/i, '')
    .replace(/\n```\s*$/, '')
    .trim();

  // Find the JSON object (from first { to its matching })
  const startIndex = cleaned.indexOf('{');
  if (startIndex === -1) {
    return cleaned; // No JSON object found, return as-is
  }

  // Find the matching closing brace
  let braceCount = 0;
  let endIndex = -1;

  for (let i = startIndex; i < cleaned.length; i++) {
    if (cleaned[i] === '{') braceCount++;
    if (cleaned[i] === '}') braceCount--;

    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return cleaned; // No matching brace found, return as-is
  }

  // Extract just the JSON object
  return cleaned.substring(startIndex, endIndex + 1);
}

export default async (request: Request, context: Context) => {
  console.log("[analyze-submission-background] Function invoked");
  console.log("[analyze-submission-background] Request method:", request.method);
  console.log("[analyze-submission-background] Request URL:", request.url);

  if (request.method !== "POST") {
    console.log("[analyze-submission-background] Rejecting non-POST request");
    return Response.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  let requestKey: string | null = null;

  try {
    const body = await request.json();
    console.log("[analyze-submission-background] Request body:", JSON.stringify(body));
    const { key } = body;
    requestKey = key; // Cache for error handler

    if (!key) {
      console.log("[analyze-submission-background] Missing key parameter");
      return Response.json(
        { message: "Missing 'key' parameter" },
        { status: 400 }
      );
    }

    console.log("[analyze-submission-background] Starting analysis for submission:", key);

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log("[analyze-submission-background] ANTHROPIC_API_KEY is not set");
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    console.log("[analyze-submission-background] API key is configured");

    const store = getStore("meeting-requests");
    console.log("[analyze-submission-background] Fetching submission from blob store");
    const data = await store.get(key, { type: "text" });

    if (!data) {
      console.log("[analyze-submission-background] Submission not found:", key);
      return Response.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }
    console.log("[analyze-submission-background] Submission retrieved successfully");

    const submission: SubmissionData = JSON.parse(data);

    // Update state to analyzing
    submission.analysisState = "analyzing";
    await store.set(key, JSON.stringify(submission));
    console.log("[analyze-submission-background] State updated to 'analyzing'");

    // Initialize Anthropic client
    console.log("[analyze-submission-background] Initializing Anthropic client");
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Analyze the submission
    const systemPrompt = `You are an AI assistant helping Synergy Supreme, a satirical consulting firm that offers services like "Paradigm Shifting", "Synergy Optimization", "Disruptive Innovation", "Agile Buzzword Integration", and "Thought Leadership As A Service".

Your job is to analyze incoming meeting requests and determine:
1. Whether the submission is spam or legitimate
2. If legitimate, provide a brief summary of the request
3. Provide a recommendation on whether the meeting would be valuable

Consider a request spam if it:
- Contains obvious promotional content or links
- Has nonsensical or gibberish text
- Is clearly automated or bot-generated
- Contains suspicious keywords or patterns
- Has obvious malicious intent

For legitimate requests, assess value based on:
- Clear articulation of needs
- Relevance to consulting services
- Potential for meaningful engagement
- Whether the request shows understanding of professional services

Respond in JSON format with this structure:
{
  "isSpam": boolean,
  "summary": "Brief 1-2 sentence summary of the request (only if not spam)",
  "recommendation": "Brief assessment of meeting value with reasoning (only if not spam)",
  "spamReasoning": "Explanation of why this was flagged as spam (only if spam)"
}`;

    const userPrompt = `Analyze this meeting request:

Name: ${submission.name}
Company: ${submission.company}
Email: ${submission.email}
Notes: ${submission.notes}

Please analyze and respond in the specified JSON format.`;

    console.log("[analyze-submission-background] Calling Anthropic API...");
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    console.log("[analyze-submission-background] Anthropic API call completed");

    // Parse the response
    const responseText = message.content[0].type === "text"
      ? message.content[0].text
      : "";

    console.log("[analyze-submission-background] AI Response:", responseText);

    // Extract JSON from response (handles code fences and additional text)
    const jsonOnly = extractJSON(responseText);
    const analysis = JSON.parse(jsonOnly);

    // Update submission with analysis results
    submission.isSpam = analysis.isSpam;

    if (analysis.isSpam) {
      submission.analysisState = "spam";
      submission.summary = "This submission was flagged as spam.";
      submission.spamReasoning = analysis.spamReasoning || "No reasoning provided.";
    } else {
      submission.analysisState = "completed";
      submission.summary = analysis.summary;
      submission.recommendation = analysis.recommendation;
    }

    await store.set(key, JSON.stringify(submission));

    console.log("[analyze-submission-background] Analysis completed for submission:", key, "- Spam:", analysis.isSpam);

    return Response.json({
      message: "Analysis completed",
      key,
      isSpam: analysis.isSpam,
    });
  } catch (error) {
    console.error("[analyze-submission-background] Error analyzing submission:", error);

    // Try to update the submission with error state using cached key
    try {
      if (requestKey) {
        console.log("[analyze-submission-background] Updating submission with error state:", requestKey);
        const store = getStore("meeting-requests");
        const data = await store.get(requestKey, { type: "text" });
        if (data) {
          const submission: SubmissionData = JSON.parse(data);
          submission.analysisState = "error";
          submission.analysisError = error instanceof Error ? error.message : "Unknown error";
          await store.set(requestKey, JSON.stringify(submission));
          console.log("[analyze-submission-background] Error state saved to blob");
        }
      }
    } catch (updateError) {
      console.error("[analyze-submission-background] Failed to update submission with error state:", updateError);
    }

    return Response.json(
      {
        message: "Error analyzing submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: "/api/analyze-submission-background",
};
