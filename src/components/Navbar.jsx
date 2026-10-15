import { NavLink, Link } from "react-router-dom";

const items = [
  { label: "Home", path: "/app/home", icon: "⌂" },
  { label: "Check-in", path: "/app/check-in", icon: "◌" },
  { label: "Antarang AI", path: "/app/chat", icon: "✦" },
  { label: "My Journey", path: "/app/journey", icon: "↗" },
  { label: "Explore", path: "/app/explore", icon: "✦" },
  { label: "Support", path: "/app/support", icon: "♡" },
];

function Navbar() {
  return (
    <header className="new-navbar">
      <Link to="/app/home" className="new-brand">
        <span className="new-brand-mark">A</span>

        <span className="new-brand-copy">
          <strong>Antarang</strong>
          <small>a little space for you</small>
        </span>
      </Link>

      <nav className="new-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `new-nav-link ${isActive ? "active" : ""}`
            }
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link to="/app/profile" className="new-profile">
        <span>👤</span>
      </Link>
    </header>
  );
}

export default Navbar;