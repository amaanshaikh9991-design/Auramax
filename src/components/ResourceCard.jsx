function ResourceCard({
  emoji = "✦",
  topic,
  title,
  description,
  action = "Explore",
  onClick,
  href,
  featured = false,
}) {
  const content = (
    <>
      <div className="ui-resource-top">
        <div className="ui-resource-icon">{emoji}</div>

        {topic && (
          <span className="ui-resource-topic">
            {topic}
          </span>
        )}
      </div>

      <div className="ui-resource-content">
        <h3>{title}</h3>

        {description && (
          <p>{description}</p>
        )}
      </div>

      <div className="ui-resource-action">
        <span>{action}</span>
        <span aria-hidden="true">→</span>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`ui-resource-card ${
          featured ? "featured" : ""
        }`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`ui-resource-card ${
        featured ? "featured" : ""
      }`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default ResourceCard;