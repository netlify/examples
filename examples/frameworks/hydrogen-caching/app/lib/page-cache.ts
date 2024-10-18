import type {ProductFragment} from 'storefrontapi.generated';

// Remix resource routes result in the same URL serving both an HTML page response and a JSON data
// response, so we need to check for `?_data=` to avoid conflating them in the cache.
// See https://remix.run/docs/en/main/guides/resource-routes.
const CACHE_REMIX_RESOURCE_ROUTES = {
  'Netlify-Vary': 'query=_data',
};

export const NO_CACHE = {
  ...CACHE_REMIX_RESOURCE_ROUTES,
  'Cache-Control': 'private, no-store, no-cache, must-revalidate',
};

export const CACHE_1_DAY = {
  ...CACHE_REMIX_RESOURCE_ROUTES,
  'Cache-Control': 'public, max-age=0',
};

export const CACHE_1_HOUR_SWR = {
  ...CACHE_REMIX_RESOURCE_ROUTES,
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'Netlify-CDN-Cache-Control':
    'public, max-age=3600, stale-while-revalidate=60',
};

export const getProductCacheTag = (productId: string) => `product:${productId}`;

// TODO(serhalp) This is leaking `getVariantUrl` details. Refactor.
export const getProductNetlifyVary = (product: ProductFragment) =>
  `query=${['_data', ...product.options.map(({name}) => name)].join('|')}`;
