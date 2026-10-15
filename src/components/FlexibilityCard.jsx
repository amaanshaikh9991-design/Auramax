import React, { useState } from 'react';

export default function FlexibilityCard({ rule, items, answer, onAnswer }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setTimeout(() => onAnswer(index), 300);
  };

  return (
    <div className="flex-container">
      <div className="flex-rule">{rule}</div>
      <div className="flex-stimulus">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            className={`flex-item ${selected === i ? (i === answer ? 'correct' : 'wrong') : ''}`}
            onClick={() => handleSelect(i)}
            disabled={selected !== null}
            aria-label={item.value}
          >
            {item.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}