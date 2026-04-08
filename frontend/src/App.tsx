import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage';
import SurpriseMePage from './pages/SurpriseMePage';
import DictionaryPage from './pages/DictionaryPage';
import FavoritesPage from './pages/FavoritesPage';
import './styles/main.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="main-nav">
      <Link 
        to="/" 
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        Search
      </Link>
      <Link 
        to="/surprise" 
        className={`nav-link ${location.pathname === '/surprise' ? 'active' : ''}`}
      >
        Name cards
      </Link>
      <Link 
        to="/dictionary" 
        className={`nav-link ${location.pathname === '/dictionary' ? 'active' : ''}`}
      >
        Dictionary
      </Link>
      <Link 
        to="/favorites" 
        className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
      >
        Favorites
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/surprise" element={<SurpriseMePage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
