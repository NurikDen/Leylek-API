import { useState, useEffect } from 'react';
import TraitSelector from '../components/TraitSelector';
import NameDetail from '../components/NameDetail';
import { getTraits, searchNames, searchHistory, favorites } from '../services/api';
import type { TraitInfo, NameProfileWithScore, NameProfile, SearchRequest } from '../types';
import '../styles/main.css';

function SearchPage() {
  const [traits, setTraits] = useState<TraitInfo[]>([]);
  const [gender, setGender] = useState<'male' | 'female' | 'both'>('both');
  const [traitValues, setTraitValues] = useState<Record<string, number>>({});
  const [result, setResult] = useState<NameProfileWithScore | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedName, setSelectedName] = useState<NameProfile | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    getTraits()
      .then((data) => {
        setTraits(data);
        const initialValues: Record<string, number> = {};
        data.forEach((t) => (initialValues[t.key] = 0));
        setTraitValues(initialValues);
      })
      .catch(console.error);
  }, []);

  const handleTraitChange = (key: string, value: number) => {
    setTraitValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const request: SearchRequest = {
        gender,
        traits: traitValues,
        limit: 10,
      };
      
      const response = await searchNames(request);
      if (response.results.length > 0) {
        setResult(response.results[0]);
        setIsFavorite(favorites.isFavorite(response.results[0].name));
        searchHistory.add(request, response.results[0]);
      } else {
        setResult(null);
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameClick = async () => {
    if (result) {
      try {
        const { getName } = await import('../services/api');
        const profile = await getName(result.name);
        setSelectedName(profile);
      } catch (error) {
        console.error('Failed to fetch name details:', error);
      }
    }
  };

  const toggleFavorite = (profile: NameProfile) => {
    const newFavStatus = !isFavorite;
    if (newFavStatus) {
      favorites.add(profile);
    } else {
      favorites.remove(profile.name);
    }
    setIsFavorite(newFavStatus);
  };

  return (
    <div className="page-content">
      <section className="search-section">
        <h2>Find Your Perfect Name</h2>

        <div className="gender-selector">
          <label>Gender:</label>
          <div className="gender-buttons">
            <button
              className={`gender-btn ${gender === 'male' ? 'active' : ''}`}
              onClick={() => setGender('male')}
            >
              Male
            </button>
            <button
              className={`gender-btn ${gender === 'female' ? 'active' : ''}`}
              onClick={() => setGender('female')}
            >
              Female
            </button>
            <button
              className={`gender-btn ${gender === 'both' ? 'active' : ''}`}
              onClick={() => setGender('both')}
            >
              Both
            </button>
          </div>
        </div>

        <h3 style={{ marginBottom: '1rem' }}>Select Trait Importance</h3>
        <TraitSelector
          traits={traits}
          values={traitValues}
          onChange={handleTraitChange}
        />

        <button className="search-btn" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Names'}
        </button>
      </section>

      <section className="results-section">
        {loading && <div className="loading">Searching for perfect name...</div>}

        {!loading && searched && !result && (
          <div className="no-results">No names found. Try adjusting your traits.</div>
        )}

        {!loading && result && (
          <>
            <h2>Name Match</h2>
            <div className="single-result" onClick={handleNameClick}>
              <div className="result-name-header">
                <span className="gender-icon">
                  {result.gender === 'male' ? '\u2642' : '\u2640'}
                </span>
                <h3 className="result-name">{result.name}</h3>
                <button
                  className="favorite-btn-large"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(result);
                  }}
                >
                  {isFavorite ? '\u2764' : '\u2661'}
                </button>
              </div>
              <p className="result-meaning">{result.meaning}</p>
              <div className="result-meta">
                <span className="gender-badge">{result.gender === 'male' ? 'Male' : 'Female'}</span>
                {result.match_score > 0 && (
                  <span className="score">Match: {result.match_score.toFixed(1)}%</span>
                )}
              </div>
              <div className="trait-scores-display">
                {Object.entries(result.trait_scores).map(([key, value]) => (
                  <div key={key} className="trait-score-item">
                    <span>{key}</span>
                    <span><strong>{value}</strong></span>
                  </div>
                ))}
              </div>
              {result.celebrities.length > 0 && (
                <div className="celebrities-preview">
                  <h4>Notable People</h4>
                  <ul>
                    {result.celebrities.slice(0, 2).map((person, idx) => (
                      <li key={idx}>{person}</li>
                    ))}
                    {result.celebrities.length > 2 && (
                      <li className="more-celebrities">+{result.celebrities.length - 2} more...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {selectedName && (
        <NameDetail 
          name={selectedName} 
          onClose={() => setSelectedName(null)}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(selectedName)}
        />
      )}
    </div>
  );
}

export default SearchPage;
