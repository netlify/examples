// Recipe entry manifest stored in Blobs
export interface RecipeEntry {
  id: string;
  receivedAt: string;
  sender: {
    address: string;
    name?: string;
  };
  subject: string;
  emailId: string;
  blobs: {
    original: string;
    ocr: string;
    thumb?: string;
  };
  recipe: RecipeData;
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

// Override stored separately - partial recipe data
export interface RecipeOverride {
  recipe?: Partial<RecipeData>;
}

// API response types
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

export interface RecipeDetail extends RecipeEntry {
  thumbUrl?: string;
  originalUrl?: string;
}

// Resend webhook payload types
export interface ResendInboundPayload {
  type: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    created_at: string;
  };
}

// Background function payload
export interface ProcessRecipePayload {
  email_id: string;
  subject: string;
  from: string;
  to: string[];
}
