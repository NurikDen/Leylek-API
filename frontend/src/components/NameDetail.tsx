import type { NameProfile } from '../types';

interface NameDetailProps {
  name: NameProfile;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function NameDetail({ name, onClose, isFavorite = false, onToggleFavorite }: NameDetailProps) {
  const genderLabel = name.gender === 'male' ? 'Male' : 'Female';
  const traitLabels: Record<string, string> = {
    beautiful: 'Матур',
    smart: 'Акыллы',
    strong: 'Көчле',
    believer: 'Иманлы',
    rich: 'Бай',
    patience: 'Сабыр',
    merciful: 'Мөрхәмәтле',
    honorable: 'Намус',
    generous: 'Юмарт',
    leadership: 'Җитәкче',
    creative: 'Иҗади',
    wise: 'Зирәк',
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(name.name)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{
            fontSize: '2.5rem',
            color: name.gender === 'male' ? '#333' : '#666',
            fontWeight: 'bold'
          }}>
            {name.gender === 'male' ? '♂' : '♀'}
          </span>
          <h2>{name.name}</h2>
          {onToggleFavorite && (
            <button
              className="favorite-btn-modal"
              onClick={onToggleFavorite}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '2rem',
                padding: '0.25rem'
              }}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <p><strong>Gender:</strong> {genderLabel}</p>
        <p><strong>Meaning:</strong> {name.meaning}</p>

        <div className="modal-actions">
          <button onClick={handleShare} className="share-btn">
            Share
          </button>
        </div>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>Trait Scores</h3>
        <div className="trait-scores-display">
          {Object.entries(name.trait_scores).map(([key, value]) => (
            <div key={key} className="trait-score-item">
              <span>{traitLabels[key]}</span>
              <span><strong>{value}</strong></span>
            </div>
          ))}
        </div>

        {name.celebrities.length > 0 && (
          <div className="celebrities-list">
            <h4>Notable People</h4>
            <ul>
              {name.celebrities.map((person, idx) => (
                <li key={idx}>{person}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default NameDetail;
