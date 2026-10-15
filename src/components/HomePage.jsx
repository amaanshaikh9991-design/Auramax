import React from 'react';
import AssessmentCard from '../components/AssessmentCard';

export default function HomePage({ onStart }) {
  return (
    <section className="page active">
      <div className="page-header">
        <span className="eyebrow">YOUR LITTLE SPACE 🌱</span>
        <h1>Hey there,<br />ready to explore your mind?</h1>
        <p className="subtitle">
          Take a moment for yourself. There are no right or wrong answers —
          just a fun way to understand how you think.
        </p>
      </div>

      <AssessmentCard onStart={onStart} />

      <div className="two-col">
        <div className="card journey-card">
          <span className="eyebrow">YOUR JOURNEY</span>
          <h3>A little look at your week</h3>
          <p>Your check-ins stay about your own experience. Notice patterns without judging them.</p>
          <button className="btn-ghost">View journey →</button>
        </div>
        <div className="card explore-card">
          <span className="eyebrow">EXPLORE</span>
          <h3>Something useful for today</h3>
          <p>Small things to try when you need a little help, a pause, or a fresh start.</p>
          <div className="tag-row">
            <span className="tag">📚 Studies</span>
            <span className="tag">🌙 Sleep</span>
            <span className="tag"> Home</span>
          </div>
        </div>
      </div>
    </section>
  );
}