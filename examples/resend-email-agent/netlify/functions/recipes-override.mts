import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import type { RecipeOverride, RecipeEntry } from './lib/types.js';

/**
 * Recipe Override API Endpoints
 *
 * PUT /api/recipes/:id/override - Save manual edits
 * POST /api/recipes/:id/reprocess - Re-run OCR processing
 */
export default async function handler(
  request: Request,
  _context: Context
): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.replace('/api/recipes/', '').split('/').filter(Boolean);

  if (pathParts.length < 2) {
    return new Response('Invalid path', { status: 400 });
  }

  const recipeId = pathParts[0];
  const action = pathParts[1];

  // Auth check
  const authError = checkAuth(request);
  if (authError) {
    return authError;
  }

  if (request.method === 'PUT' && action === 'override') {
    return saveOverride(recipeId, request);
  }

  if (request.method === 'POST' && action === 'reprocess') {
    return reprocessRecipe(recipeId);
  }

  return new Response('Method not allowed', { status: 405 });
}

/**
 * Check authorization if ADMIN_TOKEN is configured
 */
function checkAuth(request: Request): Response | null {
  const adminToken = process.env.ADMIN_TOKEN;

  // If no token configured, allow all requests (demo mode)
  if (!adminToken) {
    return null;
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Authorization required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  if (token !== adminToken) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return null;
}

/**
 * Save override data for a recipe
 */
async function saveOverride(recipeId: string, request: Request): Promise<Response> {
  const recipesStore = getStore('recipes');

  // Verify recipe exists
  const entryKey = `${recipeId}/entry.json`;
  try {
    const entry = await recipesStore.get(entryKey);
    if (!entry) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Recipe not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse and validate override data
  let overrideData: RecipeOverride;
  try {
    const body = await request.json();

    // Validate structure - only allow recipe fields
    overrideData = {
      recipe: {},
    };

    if (body.recipe) {
      const allowedFields = ['title', 'ingredients', 'steps', 'tags', 'yields', 'cook_time', 'notes'];
      for (const field of allowedFields) {
        if (field in body.recipe) {
          (overrideData.recipe as Record<string, unknown>)[field] = body.recipe[field];
        }
      }
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Save override
  const overrideKey = `${recipeId}/override.json`;
  await recipesStore.set(overrideKey, JSON.stringify(overrideData, null, 2));

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Re-trigger background processing for a recipe
 */
async function reprocessRecipe(recipeId: string): Promise<Response> {
  const recipesStore = getStore('recipes');

  // Get original entry to retrieve email_id
  const entryKey = `${recipeId}/entry.json`;
  let entry: RecipeEntry;

  try {
    const entryData = await recipesStore.get(entryKey);
    if (!entryData) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    entry = JSON.parse(entryData);
  } catch {
    return new Response(JSON.stringify({ error: 'Recipe not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Delete existing entry so background function can reprocess
  // Keep override.json intact so user edits are preserved
  try {
    await recipesStore.delete(entryKey);
    await recipesStore.delete(`${recipeId}/ocr.txt`);
  } catch {
    // Files may not exist, continue
  }

  // Enqueue background reprocessing
  const siteUrl = process.env.SITE_URL || 'http://localhost:8888';
  const backgroundUrl = `${siteUrl}/.netlify/functions/process-recipe-background`;

  try {
    const response = await fetch(backgroundUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email_id: entry.emailId,
        subject: entry.subject,
        from: entry.sender.name
          ? `"${entry.sender.name}" <${entry.sender.address}>`
          : entry.sender.address,
        to: [],
      }),
    });

    if (!response.ok && response.status !== 202) {
      console.error(`Failed to enqueue reprocess: ${response.status}`);
      return new Response(
        JSON.stringify({ error: 'Failed to enqueue reprocessing' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ success: true, status: 'reprocessing' }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error triggering reprocess:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to trigger reprocessing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  path: ['/api/recipes/*/override', '/api/recipes/*/reprocess'],
};
