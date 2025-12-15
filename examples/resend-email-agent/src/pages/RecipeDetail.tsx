import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Tag,
  Download,
  ListOrdered,
  ShoppingBasket,
  StickyNote,
  Pencil,
  Trash2,
} from 'lucide-react';
import { fetchRecipe, formatDate, deleteRecipe } from '../lib/api';
import { useAuth } from '../lib/AuthContext';
import type { RecipeDetail } from '../lib/types';
import RecipeEditor from '../components/RecipeEditor';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  async function handleDelete() {
    if (!id || !recipe) return;

    if (!confirm(`Are you sure you want to delete "${recipe.recipe.title}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await deleteRecipe(id);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Loading recipe...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-detail">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to Recipes
        </Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to Recipes
        </Link>
        <div className="error">Recipe not found</div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back to Recipes
      </Link>

      <div className="recipe-detail-header">
        <h1 className="recipe-detail-title">{recipe.recipe.title}</h1>
        <div className="recipe-meta">
          <span className="recipe-meta-item">
            <Calendar size={16} />
            {formatDate(recipe.receivedAt)}
          </span>
          {recipe.recipe.cook_time && (
            <span className="recipe-meta-item">
              <Clock size={16} />
              {recipe.recipe.cook_time}
            </span>
          )}
          {recipe.recipe.yields && (
            <span className="recipe-meta-item">
              <Users size={16} />
              {recipe.recipe.yields}
            </span>
          )}
        </div>
      </div>

      {isAuthenticated && (
        <>
          <div className="admin-actions">
            <button
              onClick={() => setEditing(!editing)}
              className="btn btn-primary"
            >
              <Pencil size={16} />
              {editing ? 'Close Editor' : 'Edit Recipe'}
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={deleting}
            >
              <Trash2 size={16} />
              {deleting ? 'Deleting...' : 'Delete Recipe'}
            </button>
          </div>

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
          <a
            href={`${recipe.originalUrl}&download=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="download-link"
          >
            <Download size={14} />
            Download original
          </a>
        </div>
      )}

      {recipe.recipe.tags.length > 0 && (
        <div className="recipe-tags">
          {recipe.recipe.tags.map((tag, i) => (
            <Link
              key={i}
              to={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
              className="recipe-tag recipe-tag-link"
            >
              <Tag size={14} />
              {tag}
            </Link>
          ))}
        </div>
      )}

      <div className="recipe-section">
        <h2>
          <ShoppingBasket size={20} />
          Ingredients
        </h2>
        <ul>
          {recipe.recipe.ingredients.map((ingredient, i) => (
            <li key={i}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h2>
          <ListOrdered size={20} />
          Instructions
        </h2>
        <ol>
          {recipe.recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.recipe.notes && (
        <div className="recipe-section">
          <h2>
            <StickyNote size={20} />
            Notes
          </h2>
          <div className="recipe-notes">{recipe.recipe.notes}</div>
        </div>
      )}
    </div>
  );
}
