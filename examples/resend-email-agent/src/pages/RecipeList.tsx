import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRecipes, formatDate } from '../lib/api';
import type { RecipeCard } from '../lib/types';

export default function RecipeList() {
  const [recipes, setRecipes] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecipes();
      setRecipes(data);
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
        <div className="error">{error}</div>
        <button onClick={loadRecipes} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="empty-state">
        <h2>No Recipes Yet</h2>
        <p>
          Send an email with a recipe photo or PDF to your Resend inbound
          address to get started!
        </p>
      </div>
    );
  }

  return (
    <div>
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
    </div>
  );
}
