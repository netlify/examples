import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag, UtensilsCrossed, ChefHat } from 'lucide-react';
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
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Loading recipes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link to="/tags" className="back-link">
          <ArrowLeft size={16} />
          Back to Tags
        </Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="tag-detail-page">
      <Link to="/tags" className="back-link">
        <ArrowLeft size={16} />
        Back to Tags
      </Link>

      <div className="tag-detail-header">
        <h1 className="page-title">
          <span className="tag-label">
            <Tag size={24} />
            {displayName}
          </span>
        </h1>
        <p className="tag-recipe-count">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ChefHat />
          </div>
          <h2>No Recipes Found</h2>
          <p>No recipes found with the tag "{displayName}".</p>
          <Link to="/tags" className="btn btn-primary">
            Browse all tags
          </Link>
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
                  <UtensilsCrossed size={48} color="#F5A623" strokeWidth={1.5} />
                </div>
              )}
              <div className="recipe-card-content">
                <h2 className="recipe-card-title">{recipe.title}</h2>
                {recipe.description && (
                  <p className="recipe-card-description">{recipe.description}</p>
                )}
                <p className="recipe-card-date">{formatDate(recipe.receivedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
