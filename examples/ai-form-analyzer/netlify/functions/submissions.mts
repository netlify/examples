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
    // Extract page from path parameter, default to 1
    const pageParam = context.params?.page;
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const perPage = 12;

    const store = getStore("meeting-requests");

    // List all keys
    const { blobs } = await store.list();

    // Sort by timestamp (descending) - extract timestamp from key
    const sortedBlobs = blobs.sort((a, b) => {
      const timestampA = parseInt(a.key.split("-")[0], 10);
      const timestampB = parseInt(b.key.split("-")[0], 10);
      return timestampB - timestampA;
    });

    // Calculate pagination
    const totalCount = sortedBlobs.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedBlobs = sortedBlobs.slice(startIndex, endIndex);

    // Fetch the actual data for this page
    const submissions = await Promise.all(
      paginatedBlobs.map(async (blob) => {
        const data = await store.get(blob.key, { type: "text" });
        return JSON.parse(data);
      })
    );

    return Response.json({
      submissions,
      pagination: {
        page,
        perPage,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return Response.json(
      {
        message: "Error fetching submissions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: ["/api/submissions", "/api/submissions/page/:page"],
};
