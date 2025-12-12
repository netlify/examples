import type { Context } from '@netlify/functions';
import { Resend } from 'resend';
import { getStore } from '@netlify/blobs';
import type { ProcessRecipePayload, RecipeEntry } from './lib/types.js';
import { extractRecipeFromAttachment, detectContentType } from './lib/ocr-stub.js';

/**
 * Background Function for Processing Recipe Emails
 *
 * This function runs asynchronously (Netlify returns 202 immediately).
 * It downloads attachments, performs OCR, and stores recipe data in Blobs.
 *
 * Filename must end with -background for Netlify to treat it as a background function.
 */
export default async function handler(
  request: Request,
  _context: Context
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY not configured');
    return new Response('Server configuration error', { status: 500 });
  }

  let payload: ProcessRecipePayload;
  try {
    payload = await request.json();
  } catch {
    console.error('Invalid JSON payload');
    return new Response('Invalid JSON', { status: 400 });
  }

  const { email_id, subject, from } = payload;
  console.log(`Processing recipe from email: ${email_id}`);

  const resend = new Resend(apiKey);
  const mediaStore = getStore('media');
  const recipesStore = getStore('recipes');
  const receiptsStore = getStore('receipts');

  try {
    // Generate a stable recipe ID
    const recipeId = `recipes-${email_id}`;

    // Check if already processed (idempotency)
    try {
      const existingEntry = await recipesStore.get(`${recipeId}/entry.json`);
      if (existingEntry) {
        console.log(`Recipe ${recipeId} already exists, skipping`);
        await receiptsStore.set(`email-${email_id}`, JSON.stringify({
          receivedAt: new Date().toISOString(),
          status: 'already_processed',
          recipeId,
        }));
        return new Response('Already processed', { status: 200 });
      }
    } catch {
      // Entry doesn't exist, continue processing
    }

    // Get attachments from Resend
    console.log(`Fetching attachments for email ${email_id}`);
    const attachmentsResponse = await resend.emails.get(email_id);

    if (!attachmentsResponse.data) {
      console.error('Failed to get email data:', attachmentsResponse.error);
      throw new Error(`Failed to get email: ${attachmentsResponse.error?.message}`);
    }

    const attachments = attachmentsResponse.data.attachments || [];
    console.log(`Found ${attachments.length} attachments`);

    if (attachments.length === 0) {
      console.log('No attachments found, creating entry without original');
    }

    // Process first usable attachment (image or PDF)
    let originalKey: string | null = null;
    let attachmentFilename = 'unknown';
    let attachmentBuffer: ArrayBuffer | null = null;

    for (const attachment of attachments) {
      const contentType = attachment.content_type || '';
      const isUsable =
        contentType.startsWith('image/') ||
        contentType === 'application/pdf' ||
        attachment.filename?.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/i);

      if (isUsable) {
        attachmentFilename = attachment.filename || `attachment-${Date.now()}`;
        console.log(`Processing attachment: ${attachmentFilename}`);

        // Fetch the attachment content
        // Note: Resend provides base64-encoded content in the attachment object
        if (attachment.content) {
          // Content is base64 encoded
          const binaryString = atob(attachment.content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          attachmentBuffer = bytes.buffer;
        }

        if (attachmentBuffer) {
          originalKey = `${recipeId}/original/${attachmentFilename}`;
          const detectedType = detectContentType(attachmentBuffer);

          await mediaStore.set(originalKey, new Uint8Array(attachmentBuffer), {
            metadata: {
              contentType: contentType || detectedType,
              filename: attachmentFilename,
            },
          });
          console.log(`Stored original attachment: ${originalKey}`);
          break;
        }
      }
    }

    // Perform OCR/extraction
    console.log('Extracting recipe data...');
    const ocrResult = await extractRecipeFromAttachment(
      attachmentBuffer || new ArrayBuffer(0),
      attachmentFilename,
      subject
    );

    // Store OCR text
    const ocrKey = `${recipeId}/ocr.txt`;
    await recipesStore.set(ocrKey, ocrResult.rawText);
    console.log(`Stored OCR text: ${ocrKey}`);

    // Parse sender info
    const senderMatch = from.match(/^(?:"?([^"<]+)"?\s*)?<?([^>]+)>?$/);
    const senderName = senderMatch?.[1]?.trim();
    const senderAddress = senderMatch?.[2]?.trim() || from;

    // Create entry manifest
    const entry: RecipeEntry = {
      id: recipeId,
      receivedAt: new Date().toISOString(),
      sender: {
        address: senderAddress,
        name: senderName,
      },
      subject,
      emailId: email_id,
      blobs: {
        original: originalKey || '',
        ocr: ocrKey,
      },
      recipe: ocrResult.recipe,
    };

    // Store entry
    const entryKey = `${recipeId}/entry.json`;
    await recipesStore.set(entryKey, JSON.stringify(entry, null, 2));
    console.log(`Stored entry: ${entryKey}`);

    // Update receipt status
    await receiptsStore.set(`email-${email_id}`, JSON.stringify({
      receivedAt: new Date().toISOString(),
      status: 'processed',
      recipeId,
    }));

    console.log(`Successfully processed recipe ${recipeId}`);
    return new Response(JSON.stringify({ success: true, recipeId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error processing recipe:', err);

    // Update receipt with error status
    await receiptsStore.set(`email-${email_id}`, JSON.stringify({
      receivedAt: new Date().toISOString(),
      status: 'error',
      error: err instanceof Error ? err.message : 'Unknown error',
    }));

    return new Response(
      JSON.stringify({ error: 'Processing failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
