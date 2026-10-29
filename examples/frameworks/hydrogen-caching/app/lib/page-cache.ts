import type {ProductFragment} from 'storefrontapi.generated';

// React Router serves a route's data at `<path>.data`, and `?_routes=` selects which route loaders
// run, so the same URL can return different data. Vary on it to avoid conflating them in the cache.
// See https://reactrouter.com/explanation/single-fetch.
const CACHE_DATA_REQUESTS = {
  'Netlify-Vary': 'query=_routes',
};

export const NO_CACHE = {
  ...CACHE_DATA_REQUESTS,
  'Cache-Control': 'private, no-store, no-cache, must-revalidate',
};

export const CACHE_1_DAY = {
  ...CACHE_DATA_REQUESTS,
  'Cache-Control': 'public, max-age=0',
};

export const CACHE_1_HOUR_SWR = {
  ...CACHE_DATA_REQUESTS,
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'Netlify-CDN-Cache-Control':
    'public, max-age=3600, stale-while-revalidate=60',
};

export const getProductCacheTag = (productId: string) => `product:${productId}`;

// TODO(serhalp) This is leaking `getVariantUrl` details. Refactor.
export const getProductNetlifyVary = (product: ProductFragment) =>
  `query=${['_routes', ...product.options.map(({name}) => name)].join('|')}`;
