import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import type { RecipeEntry, RecipeOverride, RecipeCard } from './lib/types.js';
import { normalizeTag, registerTag, getTag } from './lib/tags.js';

/**
 * Recipes API Endpoints
 *
 * GET /api/recipes - List all recipes (optional ?tag= filter)
 * GET /api/recipes/:id - Get recipe detail
 * PUT /api/recipes/:id/override - Save manual edits
 * DELETE /api/recipes/:id - Delete a recipe
 * GET /api/tags - List all unique tags with counts
 * GET /api/tags/:tag - Get recipes for a specific tag
 */
export default async function handler(
  request: Request,
  _context: Context
): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.replace('/api/recipes', '').split('/').filter(Boolean);

  // GET /api/recipes - List all recipes (with optional tag filter)
  if (request.method === 'GET' && pathParts.length === 0) {
    const tagFilter = url.searchParams.get('tag');
    return listRecipes(tagFilter);
  }

  // GET /api/recipes/:id - Get recipe detail
  if (request.method === 'GET' && pathParts.length === 1) {
    return getRecipeDetail(pathParts[0]);
  }

  // PUT /api/recipes/:id/override - Save override
  if (request.method === 'PUT' && pathParts.length === 2 && pathParts[1] === 'override') {
    const authError = checkAuth(request);
    if (authError) return authError;
    return saveOverride(pathParts[0], request);
  }

  // DELETE /api/recipes/:id - Delete recipe
  if (request.method === 'DELETE' && pathParts.length === 1) {
    const authError = checkAuth(request);
    if (authError) return authError;
    return deleteRecipe(pathParts[0]);
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
 * Get canonical display names for tags from the registry
 */
async function getCanonicalTagNames(tags: string[]): Promise<string[]> {
  const canonicalTags: string[] = [];
  for (const tag of tags) {
    const slug = normalizeTag(tag);
    if (!slug) continue;
    // Register if not exists (first-seen casing becomes canonical)
    await registerTag(tag);
    const entry = await getTag(slug);
    canonicalTags.push(entry?.displayName || tag);
  }
  return canonicalTags;
}

/**
 * List all recipes with minimal card data
 * Optionally filter by tag (case-insensitive)
 */
async function listRecipes(tagFilter: string | null): Promise<Response> {
  const recipesStore = getStore('recipes');

  try {
    const { blobs } = await recipesStore.list({ prefix: 'recipes-' });
    const entryBlobs = blobs.filter((b) => b.key.endsWith('/entry.json'));

    const cards: RecipeCard[] = [];

    for (const blob of entryBlobs) {
      try {
        const entryData = await recipesStore.get(blob.key);
        if (!entryData) continue;

        const entry: RecipeEntry = JSON.parse(entryData);

        let title = entry.recipe.title;
        let description = entry.recipe.description || null;
        let tags = entry.recipe.tags || [];

        try {
          const overrideKey = `${entry.id}/override.json`;
          const overrideData = await recipesStore.get(overrideKey);
          if (overrideData) {
            const override: RecipeOverride = JSON.parse(overrideData);
            if (override.recipe?.title) {
              title = override.recipe.title;
            }
            if (override.recipe?.description !== undefined) {
              description = override.recipe.description;
            }
            if (override.recipe?.tags) {
              tags = override.recipe.tags;
            }
          }
        } catch {
          // No override
        }

        // Filter by tag if specified (case-insensitive by slug)
        if (tagFilter) {
          const normalizedFilter = normalizeTag(tagFilter);
          const hasTag = tags.some((t) => normalizeTag(t) === normalizedFilter);
          if (!hasTag) continue;
        }

        // Get canonical display names for tags
        const canonicalTags = await getCanonicalTagNames(tags);

        cards.push({
          id: entry.id,
          title,
          description,
          tags: canonicalTags,
          receivedAt: entry.receivedAt,
          thumbUrl: entry.blobs.thumb
            ? `/api/media?key=${encodeURIComponent(entry.blobs.thumb)}`
            : undefined,
          originalUrl: entry.blobs.original
            ? `/api/media?key=${encodeURIComponent(entry.blobs.original)}`
            : undefined,
        });
      } catch (err) {
        console.error(`Error parsing recipe entry ${blob.key}:`, err);
      }
    }

    cards.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());

    return new Response(JSON.stringify(cards), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error listing recipes:', err);
    return new Response(JSON.stringify({ error: 'Failed to list recipes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Get detailed recipe data with overrides merged
 */
async function getRecipeDetail(recipeId: string): Promise<Response> {
  const recipesStore = getStore('recipes');

  try {
    const entryKey = `${recipeId}/entry.json`;
    const entryData = await recipesStore.get(entryKey);

    if (!entryData) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const entry: RecipeEntry = JSON.parse(entryData);

    try {
      const overrideKey = `${recipeId}/override.json`;
      const overrideData = await recipesStore.get(overrideKey);

      if (overrideData) {
        const override: RecipeOverride = JSON.parse(overrideData);

        if (override.recipe) {
          entry.recipe = {
            ...entry.recipe,
            ...override.recipe,
            ingredients: override.recipe.ingredients ?? entry.recipe.ingredients,
            steps: override.recipe.steps ?? entry.recipe.steps,
            tags: override.recipe.tags ?? entry.recipe.tags,
          };
        }
      }
    } catch {
      // No override file
    }

    // Get canonical display names for tags
    const canonicalTags = await getCanonicalTagNames(entry.recipe.tags || []);

    const detail = {
      id: entry.id,
      receivedAt: entry.receivedAt,
      subject: entry.subject,
      recipe: {
        ...entry.recipe,
        tags: canonicalTags,
      },
      thumbUrl: entry.blobs.thumb
        ? `/api/media?key=${encodeURIComponent(entry.blobs.thumb)}`
        : undefined,
      originalUrl: entry.blobs.original
        ? `/api/media?key=${encodeURIComponent(entry.blobs.original)}`
        : undefined,
    };

    return new Response(JSON.stringify(detail), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(`Error getting recipe ${recipeId}:`, err);
    return new Response(JSON.stringify({ error: 'Failed to get recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Save override data for a recipe
 */
async function saveOverride(recipeId: string, request: Request): Promise<Response> {
  const recipesStore = getStore('recipes');

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

  let overrideData: RecipeOverride;
  try {
    const body = await request.json();

    overrideData = { recipe: {} };

    if (body.recipe) {
      const allowedFields = ['title', 'description', 'ingredients', 'steps', 'tags', 'yields', 'cook_time', 'notes'];
      for (const field of allowedFields) {
        if (field in body.recipe) {
          (overrideData.recipe as Record<string, unknown>)[field] = body.recipe[field];
        }
      }

      // Register any new tags to establish their canonical display names
      if (body.recipe.tags && Array.isArray(body.recipe.tags)) {
        for (const tag of body.recipe.tags) {
          if (typeof tag === 'string' && tag.trim()) {
            await registerTag(tag);
          }
        }
      }
    }
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const overrideKey = `${recipeId}/override.json`;
  await recipesStore.set(overrideKey, JSON.stringify(overrideData, null, 2));

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Delete a recipe and all associated data
 */
async function deleteRecipe(recipeId: string): Promise<Response> {
  const recipesStore = getStore('recipes');
  const mediaStore = getStore('media');
  const receiptsStore = getStore('receipts');

  // Check if recipe exists and get entry data
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

  try {
    // Delete recipe data from recipes store
    await recipesStore.delete(entryKey);
    await recipesStore.delete(`${recipeId}/ocr.txt`).catch(() => {});
    await recipesStore.delete(`${recipeId}/override.json`).catch(() => {});

    // Delete media files
    if (entry.blobs.original) {
      await mediaStore.delete(entry.blobs.original).catch(() => {});
    }
    if (entry.blobs.thumb) {
      await mediaStore.delete(entry.blobs.thumb).catch(() => {});
    }

    // Delete receipt to allow re-processing if same email is sent again
    if (entry.emailId) {
      await receiptsStore.delete(`email-${entry.emailId}`).catch(() => {});
    }

    console.log(`Deleted recipe ${recipeId}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(`Error deleting recipe ${recipeId}:`, err);
    return new Response(JSON.stringify({ error: 'Failed to delete recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  path: ['/api/recipes', '/api/recipes/*'],
};
