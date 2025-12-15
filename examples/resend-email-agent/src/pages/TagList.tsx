import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTags } from '../lib/api';
import type { TagInfo } from '../lib/types';

export default function TagList() {
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTags();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading tags...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (tags.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Tags Yet</h2>
        <p>Tags will appear here once recipes are added.</p>
        <Link to="/">View all recipes</Link>
      </div>
    );
  }

  return (
    <div className="tag-list-page">
      <Link to="/" className="back-link">
        &larr; Back to Recipes
      </Link>

      <h1 className="page-title">Browse by Tag</h1>

      <div className="tag-grid">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            to={`/tag/${encodeURIComponent(tag.slug)}`}
            className="tag-card"
          >
            <span className="tag-name">{tag.displayName}</span>
            <span className="tag-count">
              {tag.count} {tag.count === 1 ? 'recipe' : 'recipes'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
