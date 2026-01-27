import repoLink from "../../components/repo-link.js";

export default {
  title: "Post-Cache Edge Function",
  metaDescription: "Run an Edge Function after the response is served from cache",
  page: function () {
    return `
    <section>
      <h1>Post-Cache Edge Functions</h1>
      <p>
        Post-cache edge functions run <strong>after</strong> the response is served from cache, allowing you to modify cached responses without invalidating the cache. This is useful for adding dynamic headers, analytics, or other post-processing to cached content.
      </p>
      <p>
        To create a post-cache edge function, set <code>cache = "manual"</code> in the edge function configuration:
      </p>
      <pre><code>import type { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);

  // Get the response from the origin/cache
  const response = await context.next();

  // Modify the response
  const modifiedResponse = new Response(response.body, response);
  modifiedResponse.headers.set(
    "X-Post-Cache-Processed",
    new Date().toISOString()
  );

  return modifiedResponse;
};

export const config: Config = {
  path: "/*",
  cache: "manual",
};</code></pre>

      <h2>Key Points</h2>
      <ul>
        <li>Post-cache functions run after non-cached edge functions</li>
        <li>They can modify responses that have been served from cache</li>
        <li>The <code>cache = "manual"</code> setting enables this behavior</li>
        <li>Useful for adding analytics, dynamic headers, or response transformation</li>
      </ul>

      <h2>See this in action</h2>
      <p>
        Use the links below to see the post-cache edge function in action. Check the response headers in your browser's developer tools to see the <code>X-Post-Cache-Processed</code> header.
      </p>
      <ul>
        <li><a href="/hello">View /hello without post-cache processing</a></li>
        <li><a href="/hello?method=post-cache">View /hello with post-cache edge function</a> (check response headers)</li>
        <li>${repoLink("post-cache.ts")}</li>
      </ul>
    </section>
  `;
  },
};
