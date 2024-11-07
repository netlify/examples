// @ts-ignore -- virtual entry point for the app, resolved by Vite at build time
import * as remixBuild from 'virtual:remix/server-build';
import type {Context} from '@netlify/edge-functions';
import {
  createHydrogenAppLoadContext,
  createRequestHandler,
} from '@netlify/remix-edge-adapter';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createAppLoadContext} from '~/lib/context';

export default async function (
  request: Request,
  netlifyContext: Context,
): Promise<Response | undefined> {
  try {
    const appLoadContext = await createHydrogenAppLoadContext(
      request,
      netlifyContext,
      createAppLoadContext,
    );
    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV,
    });

    const response = await handleRequest(request, appLoadContext);

    if (!response) {
      return;
    }

    if (appLoadContext.session.isPending) {
      response.headers.set('Set-Cookie', await appLoadContext.session.commit());
    }

    if (response.status === 404) {
      /**
       * Check for redirects only when there's a 404 from the app.
       * If the redirect doesn't exist, then `storefrontRedirect`
       * will pass through the 404 response.
       */
      return storefrontRedirect({
        request,
        response,
        storefront: appLoadContext.storefront,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
}
