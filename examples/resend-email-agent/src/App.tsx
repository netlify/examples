import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { CookingPot, Tags, UtensilsCrossed } from 'lucide-react';
import RecipeList from './pages/RecipeList';
import RecipeDetailPage from './pages/RecipeDetail';
import TagList from './pages/TagList';
import TagDetail from './pages/TagDetail';
import Admin from './pages/Admin';
import { useAuth } from './lib/AuthContext';

function App() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <div className="header-brand">
              <CookingPot size={28} className="header-logo" />
              <h1>
                <Link to="/">Grandma's Recipe Rescuer</Link>
              </h1>
            </div>
            <nav className="header-nav">
              <Link
                to="/"
                className={`header-link ${isActive('/') && !isActive('/tags') ? 'active' : ''}`}
              >
                <UtensilsCrossed size={16} style={{ marginRight: '0.375rem', verticalAlign: 'text-bottom' }} />
                Recipes
              </Link>
              <Link
                to="/tags"
                className={`header-link ${isActive('/tags') ? 'active' : ''}`}
              >
                <Tags size={16} style={{ marginRight: '0.375rem', verticalAlign: 'text-bottom' }} />
                Tags
              </Link>
              {isAuthenticated && (
                <button onClick={logout} className="sign-out-btn">
                  Sign Out
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          <Route path="/tags" element={<TagList />} />
          <Route path="/tag/:tag" element={<TagDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
