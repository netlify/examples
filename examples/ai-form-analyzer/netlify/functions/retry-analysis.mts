import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

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

export default async (request: Request, context: Context) => {
  if (request.method !== "POST") {
    return Response.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const { key } = await request.json();

    if (!key) {
      return Response.json(
        { message: "Missing 'key' parameter" },
        { status: 400 }
      );
    }

    console.log("Retrying analysis for submission:", key);

    const store = getStore("meeting-requests");
    const data = await store.get(key, { type: "text" });

    if (!data) {
      return Response.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }

    const submission: SubmissionData = JSON.parse(data);

    // Reset to pending state and clear error
    submission.analysisState = "pending";
    delete submission.analysisError;
    delete submission.summary;
    delete submission.recommendation;
    delete submission.isSpam;
    delete submission.spamReasoning;

    await store.set(key, JSON.stringify(submission));

    // Trigger background analysis function
    const url = new URL(request.url);
    console.log("[retry-analysis] Request URL:", request.url);
    console.log("[retry-analysis] Origin:", url.origin);

    const backgroundUrl = `${url.origin}/api/analyze-submission-background`;
    console.log("[retry-analysis] Triggering background analysis at:", backgroundUrl);
    console.log("[retry-analysis] Payload:", JSON.stringify({ key }));

    const analysisPromise = fetch(backgroundUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    })
      .then((response) => {
        console.log("[retry-analysis] Background analysis response status:", response.status);
        return response.text();
      })
      .then((text) => {
        console.log("[retry-analysis] Background analysis response:", text.substring(0, 500));
      })
      .catch((error) => {
        console.error("[retry-analysis] Failed to trigger background analysis:", error);
      });

    // Keep function alive until background task completes
    context.waitUntil(analysisPromise);

    console.log("[retry-analysis] Analysis retry triggered for:", key);

    return Response.json({
      message: "Analysis retry triggered",
      key,
    });
  } catch (error) {
    console.error("Error retrying analysis:", error);
    return Response.json(
      {
        message: "Error retrying analysis",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: "/api/retry-analysis",
};
