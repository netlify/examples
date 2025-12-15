import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipes, formatDate } from '../lib/api';
import type { RecipeCard } from '../lib/types';

export default function TagDetail() {
  const { tag: tagSlug } = useParams<{ tag: string }>();
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [displayName, setDisplayName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tagSlug) {
      loadRecipes(tagSlug);
    }
  }, [tagSlug]);

  async function loadRecipes(slug: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecipes(slug);
      setRecipes(data);

      // Get the canonical display name from the first recipe's tags
      if (data.length > 0) {
        const matchingTag = data[0].tags.find(
          (t) => t.toLowerCase() === slug.toLowerCase()
        );
        setDisplayName(matchingTag || slug);
      } else {
        setDisplayName(slug);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipes');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading recipes...</div>;
  }

  if (error) {
    return (
      <div>
        <Link to="/tags" className="back-link">
          &larr; Back to Tags
        </Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="tag-detail-page">
      <Link to="/tags" className="back-link">
        &larr; Back to Tags
      </Link>

      <div className="tag-detail-header">
        <h1 className="page-title">
          <span className="tag-label">{displayName}</span>
        </h1>
        <p className="tag-recipe-count">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <h2>No Recipes Found</h2>
          <p>No recipes found with the tag "{displayName}".</p>
          <Link to="/tags">Browse all tags</Link>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              to={`/recipe/${encodeURIComponent(recipe.id)}`}
              className="recipe-card"
            >
              {recipe.thumbUrl || recipe.originalUrl ? (
                <img
                  src={recipe.thumbUrl || recipe.originalUrl}
                  alt={recipe.title}
                  className="recipe-card-image"
                />
              ) : (
                <div className="recipe-card-placeholder">
                  <span role="img" aria-label="Recipe">
                    {'\u{1F373}'}
                  </span>
                </div>
              )}
              <div className="recipe-card-content">
                <h2 className="recipe-card-title">{recipe.title}</h2>
                <p className="recipe-card-date">{formatDate(recipe.receivedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
