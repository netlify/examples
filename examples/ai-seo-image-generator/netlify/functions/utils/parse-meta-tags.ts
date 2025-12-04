export interface PostMetadata {
  title: string;
  description: string;
}

export async function fetchPostMetadata(
  origin: string,
  slug: string
): Promise<PostMetadata | null> {
  try {
    const postUrl = `${origin}/blog/${slug}/`;
    const response = await fetch(postUrl);

    if (!response.ok) {
      console.error(`Failed to fetch post page: ${response.status}`);
      return null;
    }

    const html = await response.text();
    return parseMetaTags(html);
  } catch (error) {
    console.error(`Error fetching post metadata for ${slug}:`, error);
    return null;
  }
}

function parseMetaTags(html: string): PostMetadata | null {
  // Extract og:title
  const titleMatch = html.match(
    /<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i
  );

  // Extract og:description
  const descMatch = html.match(
    /<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:description["']/i
  );

  // Fallback to standard title tag
  const titleFallback = html.match(/<title>([^<]+)<\/title>/i);

  // Fallback to meta description
  const descFallback = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  ) || html.match(
    /<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i
  );

  const title = titleMatch?.[1] || titleFallback?.[1];
  const description = descMatch?.[1] || descFallback?.[1];

  if (!title || !description) {
    console.error("Could not extract title or description from meta tags");
    return null;
  }

  // Decode HTML entities
  return {
    title: decodeHtmlEntities(title),
    description: decodeHtmlEntities(description),
  };
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}
