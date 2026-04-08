import { useState, useEffect } from 'react';
import { favorites, getName } from '../services/api';
import type { NameProfile } from '../types';
import NameDetail from '../components/NameDetail';
import '../styles/main.css';

function FavoritesPage() {
  const [favoriteNames, setFavoriteNames] = useState<NameProfile[]>([]);
  const [selectedName, setSelectedName] = useState<NameProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favs = favorites.get();
      // Load full profiles for each favorite
      const profiles: NameProfile[] = [];
      for (const fav of favs) {
        try {
          const profile = await getName(fav.name);
          profiles.push(profile);
        } catch (error) {
          console.error(`Failed to load ${fav.name}:`, error);
        }
      }
      setFavoriteNames(profiles);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameClick = async (name: string) => {
    try {
      const profile = await getName(name);
      setSelectedName(profile);
    } catch (error) {
      console.error('Failed to fetch name details:', error);
    }
  };

  const toggleFavorite = (name: string) => {
    favorites.remove(name);
    // Remove from local state immediately
    setFavoriteNames(prev => prev.filter(n => n.name !== name));
    if (selectedName?.name === name) {
      setSelectedName(null);
    }
  };

  return (
    <div className="page-content favorites-page">
      <section className="favorites-header">
        <h2>Favorite Names</h2>
        <p className="favorites-count">{favoriteNames.length} names saved</p>
      </section>

      <section className="favorites-results">
        {loading && <div className="loading">Loading favorites...</div>}

        {!loading && favoriteNames.length === 0 && (
          <div className="no-results">
            <p>No favorites yet!</p>
            <p>Click the 🤍 button on any name to add it here.</p>
          </div>
        )}

        {!loading && favoriteNames.length > 0 && (
          <div className="favorites-list">
            {favoriteNames.map((name) => (
              <div
                key={name.name}
                className="favorite-item"
                onClick={() => handleNameClick(name.name)}
              >
                <div className="fav-name-header">
                  <span className="fav-gender-icon">
                    {name.gender === 'male' ? '♂' : '♀'}
                  </span>
                  <h3 className="fav-name">{name.name}</h3>
                  <button
                    className="fav-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(name.name);
                    }}
                    title="Remove from favorites"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <p className="fav-meaning">{name.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedName && (
        <NameDetail 
          name={selectedName} 
          onClose={() => setSelectedName(null)}
          isFavorite={true}
          onToggleFavorite={() => toggleFavorite(selectedName.name)}
        />
      )}
    </div>
  );
}

export default FavoritesPage;
