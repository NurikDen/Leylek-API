import type { NameProfileWithScore } from '../types';

interface NameCardProps {
  name: NameProfileWithScore;
  onClick: () => void;
}

function NameCard({ name, onClick }: NameCardProps) {
  const genderLabel = name.gender === 'male' ? 'Male' : 'Female';

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
