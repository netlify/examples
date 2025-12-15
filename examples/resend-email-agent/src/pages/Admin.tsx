import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Admin Access</h2>

      {isAuthenticated ? (
        <div>
          <p style={{ color: 'green', marginBottom: '1rem' }}>
            You are logged in as admin.
          </p>
          <button onClick={handleLogout} className="btn btn-secondary">
            Log Out
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            style={{ marginLeft: '0.5rem' }}
          >
            Go to Recipes
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
}
