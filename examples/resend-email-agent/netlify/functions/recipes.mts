import type { Context } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import type { RecipeEntry, RecipeOverride, RecipeCard, RecipeDetail } from './lib/types.js';

/**
 * Recipes API Endpoints
 *
 * GET /api/recipes - List all recipes
 * GET /api/recipes/:id - Get recipe detail
 */
export default async function handler(
  request: Request,
  context: Context
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const pathParts = url.pathname.replace('/api/recipes', '').split('/').filter(Boolean);

  // GET /api/recipes - List all recipes
  if (pathParts.length === 0) {
    return listRecipes();
  }

  // GET /api/recipes/:id - Get recipe detail
  const recipeId = pathParts[0];
  return getRecipeDetail(recipeId);
}

/**
 * List all recipes with minimal card data
 */
async function listRecipes(): Promise<Response> {
  const recipesStore = getStore('recipes');

  try {
    // List all blobs with recipes- prefix
    const { blobs } = await recipesStore.list({ prefix: 'recipes-' });

    // Filter to just entry.json files and extract unique recipe IDs
    const entryBlobs = blobs.filter((b) => b.key.endsWith('/entry.json'));

    const cards: RecipeCard[] = [];

    for (const blob of entryBlobs) {
      try {
        const entryData = await recipesStore.get(blob.key);
        if (!entryData) continue;

        const entry: RecipeEntry = JSON.parse(entryData);

        // Also check for overrides to get the correct title
        let title = entry.recipe.title;
        try {
          const overrideKey = `${entry.id}/override.json`;
          const overrideData = await recipesStore.get(overrideKey);
          if (overrideData) {
            const override: RecipeOverride = JSON.parse(overrideData);
            if (override.recipe?.title) {
              title = override.recipe.title;
            }
          }
        } catch {
          // No override, use entry title
        }

        cards.push({
          id: entry.id,
          title,
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

    // Sort by receivedAt descending (newest first)
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
    // Load entry.json
    const entryKey = `${recipeId}/entry.json`;
    const entryData = await recipesStore.get(entryKey);

    if (!entryData) {
      return new Response(JSON.stringify({ error: 'Recipe not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const entry: RecipeEntry = JSON.parse(entryData);

    // Load and merge override.json if exists
    try {
      const overrideKey = `${recipeId}/override.json`;
      const overrideData = await recipesStore.get(overrideKey);

      if (overrideData) {
        const override: RecipeOverride = JSON.parse(overrideData);

        // Merge override.recipe over entry.recipe
        if (override.recipe) {
          entry.recipe = {
            ...entry.recipe,
            ...override.recipe,
            // Merge arrays only if they exist in override
            ingredients: override.recipe.ingredients ?? entry.recipe.ingredients,
            steps: override.recipe.steps ?? entry.recipe.steps,
            tags: override.recipe.tags ?? entry.recipe.tags,
          };
        }
      }
    } catch {
      // No override file, use entry as-is
    }

    // Hydrate URLs
    const detail: RecipeDetail = {
      ...entry,
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

export const config = {
  path: ['/api/recipes', '/api/recipes/*'],
};
