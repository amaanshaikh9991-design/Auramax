import React from 'react';

const COLOR_MAP = {
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  yellow: '#ca8a04',
  purple: '#9333ea',
  orange: '#ea580c'
};

export default function StroopDisplay({ word, color, options, answer, selected, disabled, onAnswer }) {
  return (
    <div className="stroop-container">
      <div className="stroop-instruction">What COLOR is this word written in?</div>
      <div className="stroop-word" style={{ color: COLOR_MAP[color] }}>{word}</div>
      <div className="option-grid">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`option-btn ${selected === i ? (i === answer ? 'correct' : 'wrong') : ''}`}
            onClick={() => onAnswer(i)}
            disabled={disabled}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}