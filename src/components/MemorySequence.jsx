import React from 'react';

export default function MemorySequence({ sequence }) {
  return (
    <div className="memory-sequence">
      {sequence.map((item, i) => (
        <span key={i} className="memory-item" style={{ animationDelay: `${i * 0.2}s` }}>
          {item}
        </span>
      ))}
    </div>
  );
}