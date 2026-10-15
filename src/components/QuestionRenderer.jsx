import React, { useEffect, useState } from 'react';
import MemorySequence from './MemorySequence';
import AttentionGrid from './AttentionGrid';
import StroopDisplay from './StroopDisplay';
import FlexibilityCard from './FlexibilityCard';
import OptionButton from './OptionButton';

export default function QuestionRenderer({ question, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setSelected(null);
    setDisabled(false);
  }, [question.id]);

  const handleChoice = (choice) => {
    if (disabled) return;
    setSelected(choice);
    setDisabled(true);
    const isCorrect = choice === question.answer;
    setTimeout(() => onAnswer(choice, isCorrect), 400);
  };

  const getButtonState = (index) => {
    if (selected === null) return '';
    if (index === question.answer) return 'correct';
    if (index === selected) return 'wrong';
    return '';
  };

  switch (question.type) {
    case 'reasoning':
      return (
        <div className="reasoning-q">
          <h3>{question.q}</h3>
          <div className="option-grid">
            {question.options.map((opt, i) => (
              <OptionButton
                key={i}
                label={`${String.fromCharCode(65 + i)}. ${opt}`}
                onClick={() => handleChoice(i)}
                disabled={disabled}
                state={getButtonState(i)}
              />
            ))}
          </div>
          {question.explanation && disabled && (
            <p className="explanation">{question.explanation}</p>
          )}
        </div>
      );

    case 'memory':
      return (
        <div>
          <MemorySequence sequence={question.sequence} />
          <div className="memory-prompt">{question.question}</div>
          <div className="option-grid">
            {question.options.map((opt, i) => (
              <OptionButton
                key={i}
                label={opt}
                onClick={() => handleChoice(i)}
                disabled={disabled}
                state={getButtonState(i)}
              />
            ))}
          </div>
        </div>
      );

    case 'attention':
      return (
        <div>
          <h3>{question.instruction}</h3>
          <p className="attention-sub">Find all <b>{question.target}</b> symbols</p>
          <AttentionGrid
            symbols={question.symbols}
            target={question.target}
            onComplete={(result) =>
              onAnswer(result, result.misses === 0 && result.falseAlarms === 0)
            }
          />
        </div>
      );

    case 'inhibition':
      return (
        <StroopDisplay
          word={question.word}
          color={question.color}
          options={question.options}
          answer={question.answer}
          selected={selected}
          disabled={disabled}
          onAnswer={handleChoice}
        />
      );

    case 'flexibility':
      return (
        <FlexibilityCard
          rule={question.rule}
          items={question.items}
          answer={question.answer}
          onAnswer={handleChoice}
        />
      );

    default:
      return <div>Unknown question type</div>;
  }
}