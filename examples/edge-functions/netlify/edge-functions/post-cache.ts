import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);

  // Look for the query parameter, and return if we don't find it
  if (url.searchParams.get("method") !== "post-cache") {
    return;
  }

  console.log(`Post-cache edge function running for ${url}`);

  // Get the response from the origin/cache
  const response = await context.next();

  // Clone the response so we can modify headers
  const modifiedResponse = new Response(response.body, response);

  // Add a header to show this response was processed by a post-cache edge function
  modifiedResponse.headers.set(
    "X-Post-Cache-Processed",
    new Date().toISOString()
  );

  // Add a header showing cache status
  const cacheStatus = response.headers.get("x-nf-request-id")
    ? "processed"
    : "unknown";
  modifiedResponse.headers.set("X-Post-Cache-Status", cacheStatus);

  return modifiedResponse;
};

export const config: Config = {
  path: "/*",
  cache: "manual",
};
