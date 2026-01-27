![Netlify examples](https://user-images.githubusercontent.com/5865/159468750-df1c2783-39b2-40da-9c0f-971f72a7ea3f.png)

# Post-Cache Edge Functions with Netlify

Post-cache edge functions run **after** the response is served from cache, allowing you to modify cached responses without invalidating the cache. This is useful for adding dynamic headers, analytics, or other post-processing to cached content.

## Code example

Edge Functions are files held in the `netlify/edge-functions` directory.

```ts
import type { Config, Context } from "@netlify/edge-functions";

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
};
```

## Key Points

- Post-cache functions run after non-cached edge functions
- They can modify responses that have been served from cache
- The `cache = "manual"` setting enables this behavior
- Useful for adding analytics, dynamic headers, or response transformation

## Configuration

In `netlify.toml`, you can also configure post-cache edge functions:

```toml
[[edge_functions]]
  function = "post-cache"
  path = "/*"
  cache = "manual"
```

- [Explore the code for this Edge Function](../../netlify/edge-functions/post-cache.ts)

## View this example on the web

- https://edge-functions-examples.netlify.app/example/post-cache

## Deploy to Netlify

You can deploy this and all the other examples in this repo as a site of your own to explore and experiment with, by
clicking this button.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/netlify/examples/&create_from_path=examples/edge-functions/&utm_campaign=dx-examples&utm_source=edge-functions-examples&utm_medium=web&utm_content=Deploy%20Edge%20Functions%20Examples%20to%20Netlify)
