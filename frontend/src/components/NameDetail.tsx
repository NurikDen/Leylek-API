import type { NameProfile } from '../types';

interface NameDetailProps {
  name: NameProfile;
  onClose: () => void;
}

function NameDetail({ name, onClose }: NameDetailProps) {
  const genderLabel = name.gender === 'male' ? 'Male' : 'Female';
  const traitLabels: Record<string, string> = {
    beautiful: 'Beautiful',
    smart: 'Smart',
    strong: 'Strong',
    believer: 'Believer',
    rich: 'Rich',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ 
            fontSize: '2.5rem', 
            color: name.gender === 'male' ? '#333' : '#666',
            fontWeight: 'bold'
          }}>
            {name.gender === 'male' ? '♂' : '♀'}
          </span>
          <h2>{name.name}</h2>
        </div>

        <p><strong>Gender:</strong> {genderLabel}</p>
        <p><strong>Meaning:</strong> {name.meaning}</p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.8rem' }}>Trait Scores</h3>
        <div className="trait-scores-display">
          {Object.entries(name.trait_scores).map(([key, value]) => (
            <div key={key} className="trait-score-item">
              <span>{traitLabels[key]}</span>
              <span><strong>{value}</strong>/10</span>
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
