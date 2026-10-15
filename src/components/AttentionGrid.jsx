import React, { useState } from 'react';

export default function AttentionGrid({ symbols, target, onComplete }) {
  const [clicked, setClicked] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);

  const targets = symbols.map((s, i) => s === target ? i : -1).filter(i => i !== -1);

  const handleClick = (index, symbol) => {
    if (completed || clicked.has(index)) return;
    const isHit = symbol === target;
    setClicked(prev => new Set([...prev, index]));
    setFeedback(isHit ? 'hit' : 'miss');
    setTimeout(() => setFeedback(null), 400);
  };

  const handleDone = () => {
    if (completed) return;
    setCompleted(true);
    const hits = targets.filter(i => clicked.has(i)).length;
    const falseAlarms = [...clicked].filter(i => !targets.includes(i)).length;
    onComplete({ hits, falseAlarms, misses: targets.length - hits, total: targets.length });
  };

  return (
    <div className="attention-container">
      <div className="attention-grid">
        {symbols.map((s, i) => {
          const isClicked = clicked.has(i);
          const isTarget = s === target;
          let cls = 'target-cell';
          if (isClicked) cls += isTarget ? ' hit' : ' miss';
          return (
            <button
              key={i}
              type="button"
              className={cls}
              onClick={() => handleClick(i, s)}
              disabled={completed || isClicked}
              aria-label={`Symbol ${i + 1}: ${s === target ? 'target' : 'not target'}`}
            >
              {s}
            </button>
          );
        })}
      </div>
      <p className="attention-hint">
        Found: {targets.filter(i => clicked.has(i)).length} / {targets.length} targets
      </p>
      <button className="btn-primary" onClick={handleDone} disabled={completed}>I'm Done ✓</button>
    </div>
  );
}
