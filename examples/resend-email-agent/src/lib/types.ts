// API response types (matching backend)

export interface RecipeCard {
  id: string;
  title: string;
  description: string | null;
  receivedAt: string;
  tags: string[];
  thumbUrl?: string;
  originalUrl?: string;
}

export interface TagInfo {
  slug: string;
  displayName: string;
  count: number;
}

export interface RecipeData {
  title: string;
  description: string | null;
  ingredients: string[];
  steps: string[];
  tags: string[];
  yields: string | null;
  cook_time: string | null;
  notes: string | null;
}

export interface RecipeDetail {
  id: string;
  receivedAt: string;
  subject: string;
  recipe: RecipeData;
  thumbUrl?: string;
  originalUrl?: string;
}
