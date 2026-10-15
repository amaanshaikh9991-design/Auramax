function MoodCard({
  mood,
  emoji,
  label,
  date,
  note,
  compact = false,
}) {
  return (
    <article className={`ui-mood-card ${compact ? "compact" : ""}`}>
      <div className="ui-mood-card-main">
        <div className="ui-mood-card-emoji">
          {emoji || "🙂"}
        </div>

        <div className="ui-mood-card-content">
          {date && (
            <span className="ui-mood-card-date">
              {date}
            </span>
          )}

          <h3>{label || mood || "How you're feeling"}</h3>

          {note && (
            <p className="ui-mood-card-note">
              {note}
            </p>
          )}
        </div>
      </div>

      <span className="ui-mood-card-dot" aria-hidden="true" />
    </article>
  );
}

export default MoodCard;