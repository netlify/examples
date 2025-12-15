import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import type { RecipeEntry, RecipeOverride, TagInfo } from './lib/types.js';
import { normalizeTag, registerTag, getTag, updateTagDisplayName } from './lib/tags.js';

/**
 * Tags API Endpoints
 *
 * GET /api/tags - List all unique tags with recipe counts
 * PUT /api/tags/:slug - Update tag display name (auth required)
 */
export default async function handler(
  request: Request,
  _context: Context
): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.replace('/api/tags', '').split('/').filter(Boolean);

  // GET /api/tags - List all tags
  if (request.method === 'GET' && pathParts.length === 0) {
    return listTags();
  }

  // PUT /api/tags/:slug - Update tag display name
  if (request.method === 'PUT' && pathParts.length === 1) {
    const authError = checkAuth(request);
    if (authError) return authError;
    return updateTag(pathParts[0], request);
  }

  return new Response('Not found', { status: 404 });
}

/**
 * Check authorization if ADMIN_TOKEN is configured
 */
function checkAuth(request: Request): Response | null {
  const adminToken = process.env.ADMIN_TOKEN;

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
 * Update a tag's display name
 */
async function updateTag(slug: string, request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const { displayName } = body;

    if (!displayName || typeof displayName !== 'string' || !displayName.trim()) {
      return new Response(JSON.stringify({ error: 'displayName is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const success = await updateTagDisplayName(slug, displayName.trim());

    if (!success) {
      return new Response(JSON.stringify({ error: 'Tag not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * List all unique tags across all recipes with counts.
 * Uses the tag registry for canonical display names.
 */
async function listTags(): Promise<Response> {
  const recipesStore = getStore('recipes');

  try {
    const { blobs } = await recipesStore.list({ prefix: 'recipes-' });
    const entryBlobs = blobs.filter((b) => b.key.endsWith('/entry.json'));

    // Count tags by slug
    const tagCounts = new Map<string, number>();

    for (const blob of entryBlobs) {
      try {
        const entryData = await recipesStore.get(blob.key);
        if (!entryData) continue;

        const entry: RecipeEntry = JSON.parse(entryData);
        let tags = entry.recipe.tags || [];

        // Check for overrides
        try {
          const overrideKey = `${entry.id}/override.json`;
          const overrideData = await recipesStore.get(overrideKey);
          if (overrideData) {
            const override: RecipeOverride = JSON.parse(overrideData);
            if (override.recipe?.tags) {
              tags = override.recipe.tags;
            }
          }
        } catch {
          // No override
        }

        // Count tags by normalized slug
        for (const tag of tags) {
          const slug = normalizeTag(tag);
          if (slug) {
            tagCounts.set(slug, (tagCounts.get(slug) || 0) + 1);
            // Register the tag if not already registered (uses first-seen casing)
            await registerTag(tag);
          }
        }
      } catch (err) {
        console.error(`Error parsing recipe entry ${blob.key}:`, err);
      }
    }

    // Build tag list with display names from registry
    const tagList: TagInfo[] = [];

    for (const [slug, count] of tagCounts) {
      const tagEntry = await getTag(slug);
      tagList.push({
        slug,
        displayName: tagEntry?.displayName || slug,
        count,
      });
    }

    // Sort by count (descending), then alphabetically by display name
    tagList.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.displayName.localeCompare(b.displayName);
    });

    return new Response(JSON.stringify(tagList), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error listing tags:', err);
    return new Response(JSON.stringify({ error: 'Failed to list tags' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  path: ['/api/tags', '/api/tags/*'],
};
