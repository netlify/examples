import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { RegionsPage } from './pages/RegionsPage';
import { BirdDetailPage } from './pages/BirdDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/regions" element={<RegionsPage />} />
        <Route path="/birds/:slug" element={<BirdDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
