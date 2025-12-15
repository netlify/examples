import { Routes, Route, Link } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeDetailPage from './pages/RecipeDetail';
import Admin from './pages/Admin';
import { useAuth } from './lib/AuthContext';

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app">
      <header className="header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>
            <Link to="/">Grandma's Recipe Rescuer</Link>
          </h1>
          {isAuthenticated && (
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: '1px solid white',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          )}
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
