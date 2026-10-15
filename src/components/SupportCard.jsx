function SupportCard({
  emoji = "♡",
  title,
  description,
  action = "Learn more",
  onClick,
  href,
  urgent = false,
}) {
  const content = (
    <>
      <div className="ui-support-card-icon">
        {emoji}
      </div>

      <div className="ui-support-card-content">
        <h3>{title}</h3>

        {description && (
          <p>{description}</p>
        )}
      </div>

      <div className="ui-support-card-action">
        <span>{action}</span>
        <span aria-hidden="true">→</span>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`ui-support-card ${
          urgent ? "urgent" : ""
        }`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`ui-support-card ${
        urgent ? "urgent" : ""
      }`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default SupportCard;