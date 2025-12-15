import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, LogOut, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { verifyToken } from '../lib/api';

export default function Admin() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuth();
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter a token');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await verifyToken(token.trim());

    if (result.valid) {
      login(token.trim());
      navigate('/');
    } else {
      setError(result.error || 'Invalid token');
    }

    setLoading(false);
  }

  function handleLogout() {
    logout();
    setToken('');
  }

  return (
    <div className="admin-page">
      <h2>Admin Access</h2>

      <div className="admin-card">
        {isAuthenticated ? (
          <div className="admin-success">
            <div className="empty-state-icon" style={{ marginBottom: '1rem' }}>
              <CheckCircle />
            </div>
            <p>You are logged in as admin.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut size={16} />
                Log Out
              </button>
              <Link to="/" className="btn btn-primary">
                <ArrowRight size={16} />
                Go to Recipes
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="empty-state-icon" style={{ marginBottom: '1.5rem' }}>
              <Lock />
            </div>

            {error && <div className="error">{error}</div>}

            <div className="form-group">
              <label htmlFor="token">Admin Token</label>
              <input
                type="password"
                id="token"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setError(null);
                }}
                placeholder="Enter admin token"
                autoFocus
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
