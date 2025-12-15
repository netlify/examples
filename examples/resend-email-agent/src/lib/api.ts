import type { RecipeCard, RecipeDetail, RecipeData } from './types';
import { getAdminToken } from './auth';

const API_BASE = '/api';

/**
 * Verify an admin token with the backend
 */
export async function verifyToken(token: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return { valid: data.valid === true, error: data.error };
  } catch {
    return { valid: false, error: 'Failed to verify token' };
  }
}

/**
 * Fetch all recipes
 */
export async function fetchRecipes(): Promise<RecipeCard[]> {
  const response = await fetch(`${API_BASE}/recipes`);
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

/**
 * Fetch a single recipe by ID
 */
export async function fetchRecipe(id: string): Promise<RecipeDetail> {
  const response = await fetch(`${API_BASE}/recipes/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Recipe not found');
    }
    throw new Error('Failed to fetch recipe');
  }
  return response.json();
}

/**
 * Save recipe override
 */
export async function saveOverride(
  id: string,
  recipe: Partial<RecipeData>
): Promise<void> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = getAdminToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/recipes/${id}/override`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ recipe }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to save override');
  }
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
