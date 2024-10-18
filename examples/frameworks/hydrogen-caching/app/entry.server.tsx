import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@netlify/remix-runtime';
import {CACHE_1_HOUR_SWR} from '~/lib/page-cache';

// @ts-ignore -- This is a Vite virtual module. It will be resolved at build time.
export {default} from 'virtual:netlify-server-entry';

export function handleDataRequest(
  response: Response,
  {request}: LoaderFunctionArgs | ActionFunctionArgs,
) {
  // If a loader has defined custom cache headers, assume they know what they're doing. Otherwise,
  // apply these defaults. We do this here because there is no Remix mechanism to define default
  // loader headers, nor is there a mechanism for routes to inherit parent route loader headers.
  const hasCustomCacheControl =
    response.headers.has('Netlify-CDN-Cache-Control') ||
    response.headers.has('CDN-Cache-Control') ||
    response.headers.has('Cache-Control');
  const isCacheable =
    // X-Remix-Response indicates this is sending a "response" as opposed to a redirect (I think).
    // Probably should do something less leaky here if we merge this.
    request.method === 'GET' && response.headers.has('X-Remix-Response');
  if (!hasCustomCacheControl && isCacheable) {
    for (const [key, value] of Object.entries(CACHE_1_HOUR_SWR)) {
      response.headers.set(key, value);
    }
  }
  return response;
}
