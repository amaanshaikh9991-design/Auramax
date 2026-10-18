import React, { useState } from 'react';
import OptionButton from './OptionButton';
import StimulusCard from './StimulusCard';

/**
 * Renders ONE question from cognitiveQuestionBank_grades1-12.js
 * (see getQuestionsForGrade for the shape of `question`).
 *
 * Every question is multiple choice:
 *   question.prompt       text shown above the choices
 *   question.options      4 choices
 *   question.answerIndex  index of the correct choice
 *
 * Memory questions also have question.stimulus. Those start on a "study" screen,
 * which is hidden after a few seconds, and only then show the prompt and choices.
 *
 * onAnswer(choiceIndex, isCorrect, { studyMs }) is called once, 400 ms after a choice
 * is tapped (so the student can see the green/red feedback).
 *
 * CognitiveTest.jsx renders this with key={question.id}, so all state below resets
 * automatically for every new question.
 */
export default function QuestionRenderer({ question, onAnswer }) {
  const [phase, setPhase] = useState(question.stimulus ? 'study' : 'answer');
  const [studyMs, setStudyMs] = useState(0);
  const [selected, setSelected] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const handleChoice = (index) => {
    if (disabled) return;
    setSelected(index);
    setDisabled(true);
    const isCorrect = index === question.answerIndex;
    setTimeout(() => onAnswer(index, isCorrect, { studyMs }), 400);
  };

  const getButtonState = (index) => {
    if (selected === null) return '';
    if (index === question.answerIndex) return 'correct';
    if (index === selected) return 'wrong';
    return '';
  };

  if (phase === 'study') {
    return (
      <StimulusCard
        stimulus={question.stimulus}
        seconds={question.stimulusSeconds}
        onDone={(ms) => {
          setStudyMs(ms);
          setPhase('answer');
        }}
      />
    );
  }

  return (
    <div className={`${question.type}-q`}>
      {question.stimulus && (
        <p className="memory-hint">The items are hidden now — answer from memory.</p>
      )}
      <h3>{question.prompt}</h3>
      <div className="option-grid">
        {question.options.map((option, i) => (
          <OptionButton
            key={i}
            label={`${String.fromCharCode(65 + i)}. ${option}`}
            onClick={() => handleChoice(i)}
            disabled={disabled}
            state={getButtonState(i)}
          />
        ))}
      </div>
    </div>
  );
}
