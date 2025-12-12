import { Routes, Route, Link } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeDetailPage from './pages/RecipeDetail';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>
            <Link to="/">Grandma's Recipe Rescuer</Link>
          </h1>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
