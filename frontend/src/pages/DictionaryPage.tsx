import { useState, useEffect } from 'react';
import { getDictionary, favorites } from '../services/api';
import type { NameProfileWithScore, NameProfile } from '../types';
import NameDetail from '../components/NameDetail';
import '../styles/main.css';

function DictionaryPage() {
  const [names, setNames] = useState<NameProfileWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'both'>('both');
  const [selectedName, setSelectedName] = useState<NameProfile | null>(null);
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadAllNames();
  }, [gender]);

  const loadAllNames = async () => {
    setLoading(true);
    try {
      const response = await getDictionary(gender, searchQuery || undefined);
      setNames(response.names);
      // Initialize favorite status
      const status: Record<string, boolean> = {};
      response.names.forEach(name => {
        status[name.name] = favorites.isFavorite(name.name);
      });
      setFavoriteStatus(status);
    } catch (error) {
      console.error('Failed to load names:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '' || names.length === 0) {
        loadAllNames();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleNameClick = async (name: string) => {
    try {
      const { getName } = await import('../services/api');
      const profile = await getName(name);
      setSelectedName(profile);
    } catch (error) {
      console.error('Failed to fetch name details:', error);
    }
  };

  const toggleFavorite = (name: NameProfileWithScore) => {
    const isFav = favoriteStatus[name.name] || false;
    if (isFav) {
      favorites.remove(name.name);
    } else {
      favorites.add(name);
    }
    // Update local state immediately
    setFavoriteStatus(prev => ({
      ...prev,
      [name.name]: !isFav
    }));
  };

  return (
    <div className="page-content dictionary-page">
      <section className="dictionary-header">
        <h2>Name Dictionary</h2>

        <div className="dictionary-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search names or meanings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="filter-controls">
            <div className="gender-selector-small">
              <button
                className={`gender-btn-small ${gender === 'male' ? 'active' : ''}`}
                onClick={() => setGender('male')}
              >
                Male
              </button>
              <button
                className={`gender-btn-small ${gender === 'female' ? 'active' : ''}`}
                onClick={() => setGender('female')}
              >
                Female
              </button>
              <button
                className={`gender-btn-small ${gender === 'both' ? 'active' : ''}`}
                onClick={() => setGender('both')}
              >
                Both
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="dictionary-results">
        {loading && <div className="loading">Loading names...</div>}

        {!loading && names.length === 0 && (
          <div className="no-results">No names found.</div>
        )}

        {!loading && names.length > 0 && (
          <>
            <p className="results-count">{names.length} names</p>
            <div className="dictionary-list">
              {names.map((name) => (
                <div
                  key={name.name}
                  className="dictionary-item"
                  onClick={() => handleNameClick(name.name)}
                >
                  <div className="dict-name-header">
                    <span className="dict-gender-icon">
                      {name.gender === 'male' ? '\u2642' : '\u2640'}
                    </span>
                    <h3 className="dict-name">{name.name}</h3>
                    <button
                      className="dict-favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(name);
                      }}
                    >
                      {favoriteStatus[name.name] ? '\u2764' : '\u2661'}
                    </button>
                  </div>
                  <p className="dict-meaning">{name.meaning}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {selectedName && (
        <NameDetail
          name={selectedName}
          onClose={() => setSelectedName(null)}
          isFavorite={favoriteStatus[selectedName.name] || false}
          onToggleFavorite={() => toggleFavorite({...selectedName, match_score: 0})}
        />
      )}
    </div>
  );
}

export default DictionaryPage;
