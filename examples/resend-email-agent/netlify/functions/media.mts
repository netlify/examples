import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

/**
 * Media Streaming Endpoint
 *
 * Streams binary content from the media store with proper content-type headers.
 * GET /api/media?key=<blob-key>&download=1
 */
export default async function handler(
  request: Request,
  _context: Context
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const download = url.searchParams.get('download') === '1';

  if (!key) {
    return new Response('Missing key parameter', { status: 400 });
  }

  const mediaStore = getStore('media');

  try {
    // Get blob with metadata
    const result = await mediaStore.getWithMetadata(key, { type: 'arrayBuffer' });

    if (!result || !result.data) {
      return new Response('Not found', { status: 404 });
    }

    const { data, metadata } = result;

    // Determine content type
    let contentType = 'application/octet-stream';
    if (metadata?.contentType) {
      contentType = metadata.contentType as string;
    } else {
      // Try to detect from key extension
      const ext = key.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        pdf: 'application/pdf',
      };
      if (ext && mimeTypes[ext]) {
        contentType = mimeTypes[ext];
      }
    }

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    };

    // Add download disposition if requested
    if (download) {
      const filename = metadata?.filename || key.split('/').pop() || 'download';
      headers['Content-Disposition'] = `attachment; filename="${filename}"`;
    }

    return new Response(data, { headers });
  } catch (err) {
    console.error('Error streaming media:', err);
    return new Response('Not found', { status: 404 });
  }
}

export const config = {
  path: '/api/media',
};
