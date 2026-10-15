function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  children,
  className = "",
}) {
  return (
    <header className={`ui-page-header ${className}`}>
      <div className="ui-page-header-copy">
        {eyebrow && <span className="ui-page-eyebrow">{eyebrow}</span>}

        <h1>
          {title}
          {highlight && (
            <>
              <br />
              <span>{highlight}</span>
            </>
          )}
        </h1>

        {description && <p>{description}</p>}
      </div>

      {children && (
        <div className="ui-page-header-extra">
          {children}
        </div>
      )}
    </header>
  );
}

export default PageHeader;