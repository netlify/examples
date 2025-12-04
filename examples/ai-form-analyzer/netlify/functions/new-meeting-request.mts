import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

interface MeetingRequest {
  name: string;
  company: string;
  email: string;
  preferredTime: string;
  notes: string;
}

interface SubmissionData extends MeetingRequest {
  key: string;
  submittedAt: string;
  analysisState: "pending" | "analyzing" | "completed" | "spam" | "error";
  isSpam?: boolean;
  summary?: string;
  recommendation?: string;
  analysisError?: string;
  spamReasoning?: string;
}

function generateBlobKey(name: string): string {
  const timestamp = Date.now();
  const kebabName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${timestamp}-${kebabName}`;
}

export default async (request: Request, context: Context) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return Response.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const data: MeetingRequest = await request.json();

    // Validate required fields
    const requiredFields: (keyof MeetingRequest)[] = [
      "name",
      "company",
      "email",
      "preferredTime",
      "notes",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return Response.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return Response.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate preferred time is at least 24 hours in the future
    const preferredTime = new Date(data.preferredTime);
    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    if (preferredTime < twentyFourHoursFromNow) {
      return Response.json(
        { message: "Preferred meeting time must be at least 24 hours in the future" },
        { status: 400 }
      );
    }

    // Check for test mode - if email ends with "@test-error.com", simulate an error
    if (data.email.endsWith("@test-error.com")) {
      return Response.json(
        { message: "Test error: Simulated server error for testing purposes" },
        { status: 500 }
      );
    }

    // Generate blob key and store submission with initial analysis state
    const blobKey = generateBlobKey(data.name);
    const submissionData: SubmissionData = {
      ...data,
      submittedAt: new Date().toISOString(),
      key: blobKey,
      analysisState: "pending",
    };

    const store = getStore("meeting-requests");
    await store.set(blobKey, JSON.stringify(submissionData));

    console.log("Meeting request received and stored:", blobKey);

    const url = new URL(request.url);
    console.log("[new-meeting-request] Request URL:", request.url);
    console.log("[new-meeting-request] Origin:", url.origin);

    // Submit to Netlify Forms (fire and forget)
    const formBody = new URLSearchParams({
      "form-name": "meeting-request",
      name: data.name,
      company: data.company,
      email: data.email,
      preferredTime: data.preferredTime,
      notes: data.notes,
    });

    const formsUrl = url.origin;
    console.log("[new-meeting-request] Submitting to Netlify Forms at:", formsUrl);
    console.log("[new-meeting-request] Form body:", formBody.toString());

    // Use waitUntil to ensure background tasks complete after response is sent
    const formsPromise = fetch(formsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
    })
      .then((response) => {
        console.log("[new-meeting-request] Netlify Forms response status:", response.status);
        return response.text();
      })
      .then((text) => {
        console.log("[new-meeting-request] Netlify Forms response body:", text.substring(0, 500));
      })
      .catch((error) => {
        console.error("[new-meeting-request] Failed to submit to Netlify Forms:", error);
      });

    // Trigger background analysis function
    const backgroundUrl = `${url.origin}/api/analyze-submission-background`;
    console.log("[new-meeting-request] Triggering background analysis at:", backgroundUrl);
    console.log("[new-meeting-request] Background payload:", JSON.stringify({ key: blobKey }));

    const analysisPromise = fetch(backgroundUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: blobKey }),
    })
      .then((response) => {
        console.log("[new-meeting-request] Background analysis response status:", response.status);
        return response.text();
      })
      .then((text) => {
        console.log("[new-meeting-request] Background analysis response:", text.substring(0, 500));
      })
      .catch((error) => {
        console.error("[new-meeting-request] Failed to trigger background analysis:", error);
      });

    // Keep function alive until background tasks complete
    context.waitUntil(Promise.all([formsPromise, analysisPromise]));

    // Return success response
    return Response.json(
      {
        message: "Meeting request submitted successfully",
        data: submissionData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing meeting request:", error);
    return Response.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: "/api/new-meeting-request"
};
