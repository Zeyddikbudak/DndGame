import React from 'react';

const SpellPanel = ({ spells, onSpellSelect }) => {
  let spellsArray = [];
  if (Array.isArray(spells)) {
    spellsArray = spells;
  } else if (spells && typeof spells === 'object') {
    spellsArray = Object.values(spells);
  }
  // Eğer büyü listesi boşsa panel gösterilmez.
  if (spellsArray.length === 0) return null;

  return (
    <div
      className="spell-panel"
      style={{ border: '1px solid #4CAF50', padding: '10px', margin: '10px 0', backgroundColor: '#e8f5e9' }}
    >
      <h3>Mevcut Büyüler</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {spellsArray.map((spell, index) => (
          <li key={index} style={{ marginBottom: '5px' }}>
            <button
              style={{ padding: '5px 10px', fontSize: '14px', cursor: 'pointer' }}
              onClick={() => onSpellSelect(spell)}
            >
              {spell.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpellPanel;
