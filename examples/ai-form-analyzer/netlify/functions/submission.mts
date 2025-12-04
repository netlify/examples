import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

export default async (request: Request, context: Context) => {
  if (request.method !== "GET") {
    return Response.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    // Extract key from path parameter
    const key = context.params?.key;

    if (!key) {
      return Response.json(
        { message: "Missing 'key' parameter" },
        { status: 400 }
      );
    }

    const store = getStore("meeting-requests");
    const data = await store.get(key, { type: "text" });

    if (!data) {
      return Response.json(
        { message: "Submission not found" },
        { status: 404 }
      );
    }

    const submission = JSON.parse(data);

    return Response.json({ submission });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return Response.json(
      {
        message: "Error fetching submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: "/api/submission/:key",
};
