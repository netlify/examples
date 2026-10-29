import type {Route} from './+types/[sitemap.xml]';
import {getSitemapIndex} from '@shopify/hydrogen';
import {CACHE_1_DAY} from '~/lib/page-cache';

export async function loader({
  request,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
  });

  for (const [key, value] of Object.entries(CACHE_1_DAY)) {
    response.headers.set(key, value);
  }

  return response;
}
