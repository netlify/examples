import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, UtensilsCrossed } from 'lucide-react';
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
        <div className="empty-state-icon">
          <ChefHat />
        </div>
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
      <h1 className="page-title">
        Your <span className="page-title-highlight">Recipes</span>
      </h1>
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
    </div>
  );
}
