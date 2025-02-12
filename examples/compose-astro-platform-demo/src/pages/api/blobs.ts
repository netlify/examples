import type { APIRoute } from 'astro';
import { getStore } from '@netlify/blobs';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const blobStore = getStore({ name: 'shapes', consistency: 'strong' });
    const data = await blobStore.list();
    const keys = data.blobs.map(({ key }) => key);
    return new Response(
      JSON.stringify({
        keys,
      }),
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        keys: [],
        error: 'Failed listing blobs',
      }),
    );
  }
};
