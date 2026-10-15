function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled = false,
  className = "",
  fullWidth = false,
}) {
  const classes = [
    "ui-button",
    `ui-button-${variant}`,
    fullWidth ? "ui-button-full" : "",
    disabled ? "ui-button-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;