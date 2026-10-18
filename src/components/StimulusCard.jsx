import { useEffect, useRef, useState } from 'react';

/**
 * "Study" screen for memory questions.
 *
 * Shows the stimulus (a list, digits or a short passage) for `seconds` seconds,
 * then calls onDone(studyMs) so the parent can hide it and ask the question.
 * The student can also press "I'm ready" to skip the rest of the countdown.
 */
export default function StimulusCard({ stimulus, seconds, onDone }) {
  const startedAt = useRef(Date.now());
  const finished = useRef(false);
  const [remaining, setRemaining] = useState(seconds);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    onDone(Date.now() - startedAt.current);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const secondsLeft = Math.max(
        0,
        Math.ceil(seconds - (Date.now() - startedAt.current) / 1000)
      );
      setRemaining(secondsLeft);
      if (secondsLeft <= 0) finish();
    }, 250);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  // "kite, spoon, moon" or "4, 1, 7" are shown as separate chips.
  // Sentences and passages are shown as a paragraph.
  const parts = stimulus.split(/,\s*|\s+(?=[▲●■★])/).map((part) => part.trim()).filter(Boolean);
  const isList =
    !/[.!?;]/.test(stimulus) && parts.length > 1 && parts.every((part) => part.length <= 16);

  return (
    <div className="stimulus-card">
      <span className="stimulus-label">Remember this</span>

      {isList ? (
        <div className="stimulus-chips">
          {parts.map((part, i) => (
            <span key={i} className="stimulus-chip">
              {part}
            </span>
          ))}
        </div>
      ) : (
        <p className="stimulus-text">{stimulus}</p>
      )}

      <div className="stimulus-timer" aria-hidden="true">
        <div
          className="stimulus-timer-bar"
          style={{ animationDuration: `${seconds}s` }}
        />
      </div>

      <div className="stimulus-footer">
        <span className="stimulus-countdown" aria-live="off">
          Hiding in {remaining}s
        </span>
        <button type="button" className="btn-secondary" onClick={finish}>
          I'm ready →
        </button>
      </div>
    </div>
  );
}
