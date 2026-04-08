import { useState } from 'react';
import type { TraitInfo } from '../types';

interface TraitSelectorProps {
  traits: TraitInfo[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

function TraitSelector({ traits, values, onChange }: TraitSelectorProps) {
  return (
    <div className="traits-grid">
      {traits.map((trait) => (
        <div
          key={trait.key}
          className="trait-item"
        >
          <label>{trait.label}</label>
          <span className="tatar-label">{trait.label_tatar}</span>
          <input
            type="range"
            min="0"
            max="10"
            value={values[trait.key] || 0}
            onChange={(e) => onChange(trait.key, parseInt(e.target.value))}
            className="trait-slider"
          />
          <div className="trait-value">Importance: {values[trait.key] || 0}/10</div>
        </div>
      ))}
    </div>
  );
}

export default TraitSelector;
