import { useState } from 'react';
import { Save, X, Pencil } from 'lucide-react';
import { saveOverride } from '../lib/api';
import type { RecipeDetail, RecipeData } from '../lib/types';

interface Props {
  recipe: RecipeDetail;
  onSaved: () => void;
  onCancel: () => void;
}

export default function RecipeEditor({ recipe, onSaved, onCancel }: Props) {
  const [formData, setFormData] = useState({
    title: recipe.recipe.title,
    ingredients: recipe.recipe.ingredients.join('\n'),
    steps: recipe.recipe.steps.join('\n'),
    tags: recipe.recipe.tags.join(', '),
    yields: recipe.recipe.yields || '',
    cook_time: recipe.recipe.cook_time || '',
    notes: recipe.recipe.notes || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const override: Partial<RecipeData> = {
        title: formData.title,
        ingredients: formData.ingredients
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        steps: formData.steps
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        tags: formData.tags
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        yields: formData.yields || null,
        cook_time: formData.cook_time || null,
        notes: formData.notes || null,
      };

      await saveOverride(recipe.id, override);
      setSuccess('Recipe saved successfully!');
      setTimeout(() => {
        onSaved();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editor-panel">
      <h3>
        <Pencil size={18} style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
        Edit Recipe
      </h3>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            rows={8}
          />
          <small>One ingredient per line</small>
        </div>

        <div className="form-group">
          <label htmlFor="steps">Instructions</label>
          <textarea
            id="steps"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            rows={8}
          />
          <small>One step per line</small>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="italian, comfort-food, grandma"
          />
          <small>Comma-separated</small>
        </div>

        <div className="form-group">
          <label htmlFor="yields">Yields</label>
          <input
            type="text"
            id="yields"
            name="yields"
            value={formData.yields}
            onChange={handleChange}
            placeholder="8 servings"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cook_time">Cook Time</label>
          <input
            type="text"
            id="cook_time"
            name="cook_time"
            value={formData.cook_time}
            onChange={handleChange}
            placeholder="60 min"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="editor-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
