import { useState, useEffect, useRef } from 'react';
import { getRandomName, favorites } from '../services/api';
import type { NameProfileWithScore } from '../types';
import '../styles/main.css';

function SurpriseMePage() {
  const [cardStack, setCardStack] = useState<NameProfileWithScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [gender, setGender] = useState<'male' | 'female' | 'both'>('both');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [cardHeight, setCardHeight] = useState(550);
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string, boolean>>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    loadCardStack();
  }, [gender]);

  useEffect(() => {
    // Measure card height and update container dynamically
    if (cardRef.current && containerRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardHeight(rect.height);
    }
  }, [cardStack]);

  const loadCardStack = async () => {
    setLoading(true);
    try {
      const cards: NameProfileWithScore[] = [];
      for (let i = 0; i < 5; i++) {
        const response = await getRandomName(gender);
        cards.push(response.name);
      }
      setCardStack(cards);
      // Initialize favorite status
      const status: Record<string, boolean> = {};
      cards.forEach(card => {
        status[card.name] = favorites.isFavorite(card.name);
      });
      setFavoriteStatus(status);
    } catch (error) {
      console.error('Failed to load names:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeRight = async () => {
    if (cardStack.length > 0) {
      const currentName = cardStack[0];
      favorites.add(currentName);
      setFavoriteStatus(prev => ({ ...prev, [currentName.name]: true }));
    }
    setSwipeDirection('right');
    setTimeout(async () => {
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
      setCardStack(prev => prev.slice(1));
      
      // Load a new card to keep stack at 5
      if (cardStack.length <= 2) {
        try {
          const response = await getRandomName(gender);
          const newName = response.name;
          setCardStack(prev => [...prev, newName]);
          setFavoriteStatus(prev => ({
            ...prev,
            [newName.name]: favorites.isFavorite(newName.name)
          }));
        } catch (error) {
          console.error('Failed to load new card:', error);
        }
      }
    }, 300);
  };

  const handleSwipeLeft = async () => {
    setSwipeDirection('left');
    setTimeout(async () => {
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
      setCardStack(prev => prev.slice(1));
      
      // Load a new card to keep stack at 5
      if (cardStack.length <= 2) {
        try {
          const response = await getRandomName(gender);
          const newName = response.name;
          setCardStack(prev => [...prev, newName]);
          setFavoriteStatus(prev => ({
            ...prev,
            [newName.name]: favorites.isFavorite(newName.name)
          }));
        } catch (error) {
          console.error('Failed to load new card:', error);
        }
      }
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    currentX.current = startX.current;
    currentY.current = startY.current;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    currentX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    currentY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const diffX = currentX.current - startX.current;
    const diffY = currentY.current - startY.current;
    setDragOffset({ x: diffX, y: diffY });
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = 100;
    
    if (diff > threshold) {
      handleSwipeRight();
    } else if (diff < -threshold) {
      handleSwipeLeft();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  if (loading || cardStack.length === 0) {
    return (
      <div className="page-content">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const currentName = cardStack[0];
  const isFavorite = favoriteStatus[currentName.name] || false;

  const rotation = dragOffset.x * 0.1;

  return (
    <div className="page-content surprise-page">
      <section className="surprise-header">
        <h2>Name cards</h2>
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
      </section>

      <section className="swipe-card-section">
        <div 
          className="card-container" 
          ref={containerRef}
          style={{ height: `${cardHeight + 40}px` }}
        >
          {/* Single swipeable card */}
          <div
            ref={cardRef}
            className={`swipe-card ${swipeDirection === 'right' ? 'swipe-right' : ''} ${swipeDirection === 'left' ? 'swipe-left' : ''}`}
            style={{
              transform: swipeDirection 
                ? undefined 
                : `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
              transition: isDragging.current ? 'none' : 'transform 0.3s ease-out'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
          >
            <div className="swipe-card-content">
              <h3 className="card-name">{currentName.name}</h3>
              <p className="card-meaning">{currentName.meaning}</p>

              <div className="card-traits">
                {Object.entries(currentName.trait_scores).map(([key, value]) => (
                  <div key={key} className="card-trait">
                    <span>{key}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              {currentName.celebrities.length > 0 && (
                <div className="card-celebrities">
                  <h4>Notable People</h4>
                  <ul>
                    {currentName.celebrities.map((person, idx) => (
                      <li key={idx}>{person}</li>
                    ))}
                  </ul>
                </div>
              )}

              {isFavorite && (
                <div className="favorite-badge">Favorited</div>
              )}

              <div className="card-footer">
                <span className="card-gender-icon-small">
                  {currentName.gender === 'male' ? '\u2642' : '\u2640'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="swipe-actions">
          <button className="swipe-btn left-btn" onClick={handleSwipeLeft} title="Skip">
            Skip
          </button>
          <button className="swipe-btn right-btn" onClick={handleSwipeRight} title="Add to Favorites">
            Favorite
          </button>
        </div>

        <p className="swipe-hint">Swipe left to skip, right to favorite</p>
      </section>
    </div>
  );
}

export default SurpriseMePage;
