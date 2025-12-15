import { getStore } from '@netlify/blobs';

export interface TagEntry {
  slug: string;
  displayName: string;
  createdAt: string;
}

/**
 * Normalize a tag to its slug form (lowercase, trimmed)
 */
export function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}

/**
 * Get the tag registry store
 */
function getTagStore() {
  return getStore('tag-registry');
}

/**
 * Get a tag entry by slug
 */
export async function getTag(slug: string): Promise<TagEntry | null> {
  const store = getTagStore();
  try {
    const data = await store.get(slug);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Get all registered tags
 */
export async function getAllTags(): Promise<TagEntry[]> {
  const store = getTagStore();
  const { blobs } = await store.list();

  const tags: TagEntry[] = [];
  for (const blob of blobs) {
    try {
      const data = await store.get(blob.key);
      if (data) {
        tags.push(JSON.parse(data));
      }
    } catch {
      // Skip invalid entries
    }
  }

  return tags;
}

/**
 * Register a tag if it doesn't exist, or get the existing one.
 * Returns the canonical display name.
 */
export async function registerTag(tag: string): Promise<string> {
  const slug = normalizeTag(tag);
  if (!slug) return tag;

  const store = getTagStore();

  // Check if tag already exists
  const existing = await getTag(slug);
  if (existing) {
    return existing.displayName;
  }

  // Register new tag with the provided casing as display name
  const entry: TagEntry = {
    slug,
    displayName: tag.trim(),
    createdAt: new Date().toISOString(),
  };

  await store.set(slug, JSON.stringify(entry));
  return entry.displayName;
}

/**
 * Register multiple tags and return a map of slug -> displayName
 */
export async function registerTags(tags: string[]): Promise<Map<string, string>> {
  const displayNames = new Map<string, string>();

  for (const tag of tags) {
    const slug = normalizeTag(tag);
    if (slug) {
      const displayName = await registerTag(tag);
      displayNames.set(slug, displayName);
    }
  }

  return displayNames;
}

/**
 * Get canonical display names for a list of tags.
 * Registers any tags that don't exist yet.
 */
export async function getCanonicalTags(tags: string[]): Promise<string[]> {
  const canonical: string[] = [];

  for (const tag of tags) {
    const slug = normalizeTag(tag);
    if (!slug) continue;

    const displayName = await registerTag(tag);
    canonical.push(displayName);
  }

  return canonical;
}

/**
 * Update a tag's display name (admin function)
 */
export async function updateTagDisplayName(slug: string, newDisplayName: string): Promise<boolean> {
  const store = getTagStore();

  const existing = await getTag(slug);
  if (!existing) {
    return false;
  }

  existing.displayName = newDisplayName.trim();
  await store.set(slug, JSON.stringify(existing));
  return true;
}
