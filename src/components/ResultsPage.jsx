import React from 'react';
import MetricCard from '../components/MetricCard';

const GROUPS = {
  reasoning: 'Reasoning',
  memory: 'Working Memory',
  attention: 'Attention',
  inhibition: 'Inhibitory Control',
  flexibility: 'Cognitive Flexibility'
};

export default function ResultsPage({ student, responses, totalTime, onRestart, onDownload }) {
  const metrics = Object.entries(GROUPS).map(([key, label]) => {
    const r = responses.filter((x) => x.module === key);
    const score = r.length
      ? Math.round((r.reduce((a, b) => a + b.correct, 0) / r.length) * 100)
      : 0;
    const avgRT = r.length
      ? Math.round(r.reduce((a, b) => a + b.response_time_ms, 0) / r.length)
      : 0;
    return { key, label, score, avgRT };
  });

  const totalSeconds = Math.floor(totalTime / 1000);
  const timeStr = `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;

  return (
    <section className="page active">
      <div className="page-header">
        <span className="eyebrow">YOUR JOURNEY </span>
        <h1>Assessment Completed</h1>
        <p className="subtitle">
          Student <b>{student.id}</b> (Age {student.age}, Grade {student.grade}) completed{' '}
          {responses.length} tasks in {timeStr}.
        </p>
      </div>

      <div className="metrics-grid">
        {metrics.map((m) => (
          <MetricCard key={m.key} label={m.label} score={m.score} avgRT={m.avgRT} />
        ))}
      </div>

      <div className="card profile-card">
        <h3>Cognitive Performance Profile</h3>
        <div className="instructions">
          <b>Research interpretation:</b> These scores reflect task performance in a controlled
          setting. For scientific validation, compare with established standardized assessments
          and analyze reliability, validity, and age/grade effects. Higher accuracy with faster
          response times generally indicates stronger performance in that cognitive domain.
        </div>
      </div>

      <div className="action-row">
        <button className="btn-primary" onClick={onDownload}>
           Download Data (CSV)
        </button>
        <button className="btn-secondary" onClick={onRestart}>
          🔄 New Assessment
        </button>
      </div>
    </section>
  );
}