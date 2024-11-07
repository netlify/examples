import {purgeCache} from '@netlify/functions';
import {createHmac} from 'node:crypto';

import {getProductCacheTag} from '~/lib/page-cache';

const isHmacValid = (
  hmac: string | null,
  secret: string,
  rawBody: string,
): boolean => {
  const expectedHmac = createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
  return hmac === expectedHmac;
};

// https://shopify.dev/docs/api/admin-rest/2024-07/resources/webhook#event-topics-products-update
interface ProductUpdatedPayload {
  topic: string;
  admin_graphql_api_id: string;
}

export default async function shopifyWebhookHandler(
  req: Request,
): Promise<Response> {
  const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!SHOPIFY_WEBHOOK_SECRET) {
    console.error(
      'SHOPIFY_WEBHOOK_SECRET is not set. Check .env.example for more information.',
    );
    return new Response('Unauthorized', {status: 401});
  }

  const topic = req.headers.get('X-Shopify-Topic');
  if (topic !== 'products/update') {
    console.warn('Ignoring unexpected webhook topic', {topic});
    return new Response('Accepted', {status: 202});
  }

  const hmac = req.headers.get('X-Shopify-Hmac-Sha256');
  const rawBody = await req.text();
  if (!isHmacValid(hmac, SHOPIFY_WEBHOOK_SECRET, rawBody)) {
    return new Response('Unauthorized', {status: 401});
  }

  const payload = JSON.parse(rawBody) as ProductUpdatedPayload;

  const {admin_graphql_api_id: productId} = payload;

  console.log('Purging cache for product', {productId});
  await purgeCache({tags: [getProductCacheTag(productId)]});
  console.log('Purged cache for product', {productId});

  return new Response('Accepted', {status: 202});
}
