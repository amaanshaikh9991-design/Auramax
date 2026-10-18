import { NavLink } from "react-router-dom";
import MotionLayer from "../components/MotionLayer";
import { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import { useTheme } from "../context/ThemeContext";

function AppLayout({ children }) {
 const { theme, toggle } = useTheme();
 const [student, setStudent] = useState(null);
 useEffect(() => {
  fetch(`${API_BASE_URL}/api/me`, { credentials: "include" })
    .then((response) => response.ok ? response.json() : null)
    .then((data) => data && setStudent(data.student))
    .catch(() => {});
 }, []);
 const navigation = [
  { label: "Home", icon: "⌂", path: "/app/home" },
  { label: "Check-in", icon: "☀", path: "/app/check-in" },
  { label: "Antarang AI", icon: "✦", path: "/app/chat" },
  { label: "Cognitive Test", icon: "🧠", path: "/app/cognitive-test" },
  { label: "My Journey", icon: "↗", path: "/app/journey" },
  { label: "Pattern Finder", icon: "🔍", path: "/app/patterns" },
  { label: "Explore", icon: "✦", path: "/app/explore" },
  { label: "Support", icon: "♡", path: "/app/support" },
];

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">A</div>

          <div>
            <div className="brand-name">Antarang</div>
            <div className="brand-tagline">
              a little space for you
            </div>
          </div>
        </div>

        <nav className="main-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {/* Mobile-only theme toggle — visible as bottom-nav tab */}
          <button
            className="nav-item nav-toggle-mobile"
            onClick={toggle}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="nav-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          {/* Mobile-only profile link — visible as bottom-nav tab */}
          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              `nav-item nav-profile-mobile ${isActive ? "active" : ""}`
            }
            title="Profile & settings"
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">

          <button
            className="theme-toggle"
            onClick={toggle}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            style={{ width: "100%", marginBottom: "6px", borderRadius: "14px" }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
            <span style={{ marginLeft: "8px", fontSize: "11px", fontWeight: 700, color: "var(--app-muted)" }}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </span>
          </button>

          <NavLink
            to="/app/profile"
            className="profile-mini"
          >
            {student?.profilePhoto ? <img className="profile-avatar profile-avatar-image" src={student.profilePhoto} alt="" /> : <div className="profile-avatar">{student?.name?.charAt(0).toUpperCase() || "A"}</div>}

            <div>
              <div className="profile-name">
                {student?.name || "My Space"}
              </div>

              <div className="profile-subtitle">
                Profile & settings
              </div>
            </div>

            <span className="profile-arrow">→</span>
          </NavLink>

        </div>

      </aside>

      <main className="app-content">

        <MotionLayer>
          {children}
        </MotionLayer>

      </main>

    </div>
  );
}

export default AppLayout;