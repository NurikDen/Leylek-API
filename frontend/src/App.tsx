import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TraitSelector from './components/TraitSelector';
import NameCard from './components/NameCard';
import NameDetail from './components/NameDetail';
import { getTraits, searchNames } from './services/api';
import type { TraitInfo, NameProfileWithScore, NameProfile } from './types';
import './styles/main.css';

function App() {
  const [traits, setTraits] = useState<TraitInfo[]>([]);
  const [gender, setGender] = useState<'male' | 'female' | 'both'>('both');
  const [traitValues, setTraitValues] = useState<Record<string, number>>({});
  const [results, setResults] = useState<NameProfileWithScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedName, setSelectedName] = useState<NameProfile | null>(null);

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
      const response = await searchNames({
        gender,
        traits: traitValues,
        limit: 10,
      });
      setResults(response.results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameClick = async (name: string) => {
    try {
      const { getName } = await import('./services/api');
      const profile = await getName(name);
      setSelectedName(profile);
    } catch (error) {
      console.error('Failed to fetch name details:', error);
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
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
          {loading && <div className="loading">Searching for perfect names...</div>}

          {!loading && searched && results.length === 0 && (
            <div className="no-results">No names found. Try adjusting your traits.</div>
          )}

          {!loading && results.length > 0 && (
            <>
              <h2>Your Name Match</h2>
              <div className="results-grid">
                {results.map((name) => (
                  <NameCard
                    key={name.name}
                    name={name}
                    onClick={() => handleNameClick(name.name)}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {selectedName && (
          <NameDetail name={selectedName} onClose={() => setSelectedName(null)} />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
