import type { NameProfileWithScore } from '../types';

interface NameCardProps {
  name: NameProfileWithScore;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function NameCard({ name, onClick, isFavorite = false, onToggleFavorite }: NameCardProps) {
  const genderLabel = name.gender === 'male' ? 'Male' : 'Female';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  return (
    <div className="name-card" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{
          fontSize: '1.5rem',
          color: name.gender === 'male' ? '#333' : '#666',
          fontWeight: 'bold'
        }}>
          {name.gender === 'male' ? '♂' : '♀'}
        </span>
        <h3>{name.name}</h3>
        {onToggleFavorite && (
          <button
            className="favorite-btn-small"
            onClick={handleFavoriteClick}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.25rem'
            }}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <p className="meaning">{name.meaning}</p>
      <span className="gender-badge">{genderLabel}</span>
      {name.match_score > 0 && (
        <span className="score">Match: {name.match_score.toFixed(1)}%</span>
      )}
    </div>
  );
}

export default NameCard;
