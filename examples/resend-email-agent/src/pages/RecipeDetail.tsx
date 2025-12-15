import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRecipe, formatDate } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import type { RecipeDetail } from '../lib/types';
import RecipeEditor from '../components/RecipeEditor';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecipe(id);
    }
  }, [id]);

  async function loadRecipe(recipeId: string) {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchRecipe(recipeId);
      setRecipe(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  }

  function handleSaved() {
    if (id) {
      loadRecipe(id);
    }
    setEditing(false);
  }

  if (loading) {
    return <div className="loading">Loading recipe...</div>;
  }

  if (error) {
    return (
      <div className="recipe-detail">
        <Link to="/" className="back-link">
          &larr; Back to Recipes
        </Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <Link to="/" className="back-link">
          &larr; Back to Recipes
        </Link>
        <div className="error">Recipe not found</div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <Link to="/" className="back-link">
        &larr; Back to Recipes
      </Link>

      <div className="recipe-detail-header">
        <h1 className="recipe-detail-title">{recipe.recipe.title}</h1>
        <div className="recipe-meta">
          <span>Received: {formatDate(recipe.receivedAt)}</span>
          {recipe.recipe.cook_time && (
            <span>Cook time: {recipe.recipe.cook_time}</span>
          )}
          {recipe.recipe.yields && <span>Yields: {recipe.recipe.yields}</span>}
        </div>
      </div>

      {isAuthenticated && (
        <>
          <button
            onClick={() => setEditing(!editing)}
            className="editor-toggle"
          >
            {editing ? 'Close Editor' : 'Edit Recipe'}
          </button>

          {editing && (
            <RecipeEditor
              recipe={recipe}
              onSaved={handleSaved}
              onCancel={() => setEditing(false)}
            />
          )}
        </>
      )}

      {recipe.originalUrl && (
        <div className="recipe-image-container">
          <img
            src={recipe.originalUrl}
            alt={recipe.recipe.title}
            className="recipe-image"
          />
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
            <a
              href={`${recipe.originalUrl}&download=1`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download original
            </a>
          </p>
        </div>
      )}

      {recipe.recipe.tags.length > 0 && (
        <div className="recipe-tags">
          {recipe.recipe.tags.map((tag, i) => (
            <span key={i} className="recipe-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="recipe-section">
        <h2>Ingredients</h2>
        <ul>
          {recipe.recipe.ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h2>Instructions</h2>
        <ol>
          {recipe.recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.recipe.notes && (
        <div className="recipe-section">
          <h2>Notes</h2>
          <div className="recipe-notes">{recipe.recipe.notes}</div>
        </div>
      )}
    </div>
  );
}
