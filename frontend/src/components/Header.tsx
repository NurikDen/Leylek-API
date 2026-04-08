import { useState, useEffect } from 'react';
import { getNameOfTheDay, favorites } from '../services/api';
import type { NameProfileWithScore, NameProfile } from '../types';
import NameDetail from './NameDetail';

function Header() {
  const [nameOfTheDay, setNameOfTheDay] = useState<NameProfileWithScore | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedName, setSelectedName] = useState<NameProfile | null>(null);

  useEffect(() => {
    getNameOfTheDay()
      .then((data) => setNameOfTheDay(data.name))
      .catch(console.error);
  }, []);

  const handleNameOfTheDayClick = async () => {
    if (nameOfTheDay) {
      try {
        const { getName } = await import('../services/api');
        const profile = await getName(nameOfTheDay.name);
        setSelectedName(profile);
        setShowModal(true);
      } catch (error) {
        console.error('Failed to fetch name details:', error);
      }
    }
  };

  const toggleFavorite = (profile: NameProfile) => {
    if (favorites.isFavorite(profile.name)) {
      favorites.remove(profile.name);
    } else {
      favorites.add(profile);
    }
  };

  return (
    <header className="header">
        <img
          src="/assets/leylek_icon_white.png"
          alt="Leylek Logo"
          className="header-logo"
        />
        {nameOfTheDay && (
          <button className="name-of-the-day-btn" onClick={handleNameOfTheDayClick}>
            Name of the Day
          </button>
        )}

      {showModal && selectedName && (
        <NameDetail 
          name={selectedName} 
          onClose={() => setShowModal(false)}
          isFavorite={favorites.isFavorite(selectedName.name)}
          onToggleFavorite={() => toggleFavorite(selectedName)}
        />
      )}
    </header>
  );
}

export default Header;
