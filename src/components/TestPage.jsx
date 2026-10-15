import React, { useState, useEffect, useCallback } from 'react';
import QuestionRenderer from '../components/QuestionRenderer';
import ProgressBar from '../components/ProgressBar';
import { QuestionBank, ModuleConfig } from '../data/questions';

export default function TestPage({ student, onFinish }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [startTime] = useState(Date.now());
  const [qStart, setQStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState('00:00');
  const [feedback, setFeedback] = useState('');

  // Build question list
  useEffect(() => {
    const list = ModuleConfig.flatMap((mod) =>
      QuestionBank[mod.type].map((item, idx) => ({
        ...item,
        module: mod.name,
        moduleKey: mod.key,
        type: mod.type,
        idx
      }))
    );
    setQuestions(list);
    setQStart(Date.now());
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      const s = Math.floor((Date.now() - startTime) / 1000);
      setElapsed(
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const currentQ = questions[index];

  const handleAnswer = useCallback(
    (answer, isCorrect) => {
      const rt = Date.now() - qStart;
      const response = {
        student_id: student.id,
        age: student.age,
        grade: student.grade,
        module: currentQ.moduleKey,
        module_name: currentQ.module,
        item: index + 1,
        correct: isCorrect ? 1 : 0,
        response_time_ms: Math.round(rt),
        error: isCorrect ? 0 : 1,
        attempts: 1,
        difficulty: Math.ceil((currentQ.idx + 1) / 3),
        answer: typeof answer === 'object' ? JSON.stringify(answer) : answer,
        timestamp: new Date().toISOString()
      };

      setResponses((prev) => [...prev, response]);
      setFeedback(isCorrect ? '✓ Correct!' : '✗ Recorded');

      setTimeout(() => {
        setFeedback('');
        if (index + 1 >= questions.length) {
          onFinish(responses.concat(response), Date.now() - startTime);
        } else {
          setIndex(index + 1);
          setQStart(Date.now());
        }
      }, 600);
    },
    [index, questions.length, qStart, currentQ, student, responses, onFinish]
  );

  if (!currentQ) return <div>Loading...</div>;

  return (
    <section className="page active">
      <div className="test-header">
        <div className="test-info">
          <span className="eyebrow">{currentQ.module}</span>
          <h2>{getModuleTitle(currentQ.type)}</h2>
        </div>
        <div className="test-meta">
          <div className="timer"> {elapsed}</div>
          <ProgressBar current={index + 1} total={questions.length} />
        </div>
      </div>

      <div className="card question-card">
        <QuestionRenderer question={currentQ} onAnswer={handleAnswer} />
      </div>

      <div className="feedback">{feedback}</div>
    </section>
  );
}

function getModuleTitle(type) {
  const titles = {
    reasoning: 'Pattern Detective 🔍',
    memory: 'Memory Mission 🧩',
    attention: 'Attention Hunter 🎯',
    inhibition: 'Stop-Go Challenge 🚦',
    flexibility: 'Rule Switch 🔄'
  };
  return titles[type] || 'Question';
}