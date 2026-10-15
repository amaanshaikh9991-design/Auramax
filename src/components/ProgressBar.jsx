export default function ProgressBar({ current, total }) {
  const pct = (current / total) * 100;
  return (
    <div className="progress-wrap">
      <div className="progress">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-text">{current} / {total}</span>
    </div>
  );
}