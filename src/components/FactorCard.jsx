function FactorCard({
  emoji,
  label,
  description,
  selected = false,
  onClick,
}) {
  const isInteractive = typeof onClick === "function";

  return (
    <article
      className={`ui-factor-card ${selected ? "selected" : ""} ${
        isInteractive ? "interactive" : ""
      }`}
      onClick={isInteractive ? onClick : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={(event) => {
        if (
          isInteractive &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isInteractive ? selected : undefined}
    >
      <div className="ui-factor-icon">
        {emoji || "✦"}
      </div>

      <div className="ui-factor-content">
        <h3>{label}</h3>

        {description && (
          <p>{description}</p>
        )}
      </div>

      {isInteractive && (
        <span
          className="ui-factor-check"
          aria-hidden="true"
        >
          {selected ? "✓" : "+"}
        </span>
      )}
    </article>
  );
}

export default FactorCard;