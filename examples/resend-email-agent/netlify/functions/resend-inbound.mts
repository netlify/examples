import type { Context } from '@netlify/functions';
import { Webhook } from 'svix';
import { getStore } from '@netlify/blobs';
import type { ResendInboundPayload, ProcessRecipePayload } from './lib/types.js';

/**
 * Resend Inbound Webhook Handler
 *
 * Receives email.received webhooks from Resend, verifies Svix signature,
 * and enqueues background processing.
 */
export default async function handler(
  request: Request,
  context: Context
): Promise<Response> {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('RESEND_WEBHOOK_SECRET not configured');
    return new Response('Server configuration error', { status: 500 });
  }

  // Read raw body for signature verification
  const rawBody = await request.text();

  // Extract Svix headers
  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  // Debug logging
  console.log('=== Webhook Debug ===');
  console.log('Secret prefix:', webhookSecret.substring(0, 10) + '...');
  console.log('Secret length:', webhookSecret.length);
  console.log('svix-id:', svixId);
  console.log('svix-timestamp:', svixTimestamp);
  console.log('svix-signature:', svixSignature);
  console.log('Raw body length:', rawBody.length);
  console.log('Raw body preview:', rawBody.substring(0, 200));
  console.log('=== End Debug ===');

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Missing Svix headers');
    return new Response('Missing signature headers', { status: 400 });
  }

  // Verify webhook signature
  const wh = new Webhook(webhookSecret);
  let payload: ResendInboundPayload;

  try {
    payload = wh.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ResendInboundPayload;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    console.error('This usually means:');
    console.error('1. RESEND_WEBHOOK_SECRET does not match the signing secret from Resend');
    console.error('2. The request body was modified in transit');
    console.error('3. The timestamp is too old (replay attack protection)');
    return new Response('Invalid signature', { status: 400 });
  }

  // Only process email.received events
  if (payload.type !== 'email.received') {
    console.log(`Ignoring event type: ${payload.type}`);
    return new Response('OK', { status: 200 });
  }

  const { email_id, subject, from, to } = payload.data;
  console.log(`Received email: ${email_id} - "${subject}" from ${from}`);

  // Idempotency check: see if we've already processed this email
  const receiptsStore = getStore('receipts');
  const receiptKey = `email-${email_id}`;

  try {
    const existingReceipt = await receiptsStore.get(receiptKey);
    if (existingReceipt) {
      console.log(`Email ${email_id} already processed, skipping`);
      return new Response('OK', { status: 200 });
    }
  } catch {
    // Receipt doesn't exist, continue processing
  }

  // Mark as received to prevent duplicate processing
  await receiptsStore.set(receiptKey, JSON.stringify({
    receivedAt: new Date().toISOString(),
    status: 'enqueued',
  }));

  // Enqueue background processing
  const backgroundPayload: ProcessRecipePayload = {
    email_id,
    subject,
    from,
    to,
  };

  // Use waitUntil to process in background after response is sent
  context.waitUntil(processInBackground(backgroundPayload));

  return new Response('OK', { status: 200 });
}

async function processInBackground(payload: ProcessRecipePayload): Promise<void> {
  const siteUrl = (process.env.SITE_URL || 'http://localhost:8888').replace(/\/$/, '');
  // Background functions must be invoked at /.netlify/functions/ path, not via redirects
  const backgroundUrl = `${siteUrl}/.netlify/functions/process-recipe-background`;

  console.log(`Calling background function at: ${backgroundUrl}`);

  try {
    const backgroundResponse = await fetch(backgroundUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!backgroundResponse.ok && backgroundResponse.status !== 202) {
      const text = await backgroundResponse.text();
      console.error(
        `Failed to enqueue background task: ${backgroundResponse.status} - ${text}`
      );
    } else {
      console.log(`Background task enqueued for email ${payload.email_id}`);
    }
  } catch (err) {
    console.error('Error enqueuing background task:', err);
  }
}

export const config = {
  path: '/api/resend-inbound',
};
