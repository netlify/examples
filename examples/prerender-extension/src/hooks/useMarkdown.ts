import { useState, useEffect } from 'react';

export const useMarkdown = (slug: string) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        const response = await import(`../content/${slug}.md?raw`);
        setContent(response.default);
        setError(null);
      } catch (err) {
        setError(err as Error);
        setContent('');
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [slug]);

  return { content, loading, error };
};
