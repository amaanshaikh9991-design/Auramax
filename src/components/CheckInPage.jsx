import React, { useState } from 'react';
import { ModuleConfig } from '../data/questions';

export default function CheckInPage({ onStart }) {
  const [form, setForm] = useState({ id: '', age: '', grade: '' });

  const handleSubmit = () => {
    if (!form.age || !form.grade) {
      alert('Please enter both age and grade.');
      return;
    }
    onStart({
      id: form.id.trim() || 'anonymous',
      age: parseInt(form.age),
      grade: parseInt(form.grade)
    });
  };

  return (
    <section className="page active">
      <div className="page-header">
        <span className="eyebrow">COGNITIVE ASSESSMENT </span>
        <h1>Let's begin your journey</h1>
        <p className="subtitle">
          A gamified assessment of reasoning, memory, attention, inhibition, and flexibility.
        </p>
      </div>

      <div className="card form-card">
        <div className="disclaimer">
          <b>Research prototype:</b> This educational assessment measures task performance.
          It is not an IQ or clinical diagnostic test.
        </div>

        <div className="form-group">
          <label>Student ID / Code</label>
          <input
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="e.g., S001"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              min="5"
              max="15"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="8–11"
            />
          </div>
          <div className="form-group">
            <label>Grade</label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              placeholder="3–5"
            />
          </div>
        </div>

        <div className="module-preview">
          <h4>What you'll explore:</h4>
          <div className="module-chips">
            {ModuleConfig.map((m) => (
              <span key={m.key} className="chip">
                {m.icon} {m.name.replace(/^[A-Z] — /, '')}
              </span>
            ))}
          </div>
        </div>

        <button className="btn-primary btn-large" onClick={handleSubmit}>
          Start Assessment →
        </button>
      </div>
    </section>
  );
}
