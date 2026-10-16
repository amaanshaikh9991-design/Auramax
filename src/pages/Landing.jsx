import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <main className="landing-page">
      <div className="landing-blob blob-purple"></div>
      <div className="landing-blob blob-green"></div>
      <div className="landing-blob blob-peach"></div>

      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>Antarang</strong>
            <span>a little space for you</span>
          </div>
        </Link>

        <div className="landing-nav-actions">
          <button
            className="theme-toggle"
            onClick={toggle}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <Link to="/login" className="login-link">
            Log in
          </Link>

          <Link to="/signup" className="join-button">
            Join Antarang
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <div className="landing-tag">
            🌱 &nbsp; A little space to check in with yourself
          </div>

          <h1>
            Your feelings
            <br />
            <span>matter.</span>
          </h1>

          <p>
            Antarang is a simple, private space where you can pause,
            check in, understand how you've been feeling, and discover
            things that might help.
          </p>

          <div className="landing-buttons">
            <Link to="/signup" className="primary-button">
              Get started <span>→</span>
            </Link>

            <Link to="/login" className="secondary-button">
              I already have an account
            </Link>
          </div>
        </div>

        <div className="landing-visual">
          <div className="sun-decoration">
            <div className="sun-core">☀️</div>
          </div>

          <div className="feeling-card">
            <span className="card-label">TODAY</span>

            <h2>How are you feeling?</h2>

            <div className="landing-moods">
              <span>😄</span>
              <span>🙂</span>
              <span>😐</span>
              <span>😕</span>
              <span>😞</span>
            </div>
          </div>

          <div className="journey-floating">
            🌱 &nbsp; My Journey
          </div>

          <div className="feeling-floating">
            ✨ &nbsp; You're doing okay.
          </div>
        </div>
      </section>
    </main>
  );
}

export default Landing;