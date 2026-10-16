import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import { useTheme } from "../context/ThemeContext";

const weekMood = [
  {
    day: "M",
    mood: "🙂",
    level: "good",
    height: "62%",
  },
  {
    day: "T",
    mood: "😄",
    level: "great",
    height: "82%",
  },
  {
    day: "W",
    mood: "😐",
    level: "mid",
    height: "48%",
  },
  {
    day: "T",
    mood: "🙂",
    level: "good",
    height: "68%",
  },
  {
    day: "F",
    mood: "😌",
    level: "great",
    height: "76%",
  },
  {
    day: "S",
    mood: "😄",
    level: "great",
    height: "88%",
  },
  {
    day: "S",
    mood: "🙂",
    level: "good",
    height: "70%",
  },
];

const topics = [
  {
    id: "studies",
    icon: "📚",
    label: "Studies",
    color: "lavender",
  },
  {
    id: "sleep",
    icon: "🌙",
    label: "Sleep",
    color: "blue",
  },
  {
    id: "home",
    icon: "🏠",
    label: "Home",
    color: "peach",
  },
  {
    id: "friends",
    icon: "🫶",
    label: "Friends",
    color: "green",
  },
  {
    id: "calm",
    icon: "🌿",
    label: "Calm",
    color: "yellow",
  },
];

function Home() {
  const { theme, toggle } = useTheme();
  const [studentName, setStudentName] = useState("");
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/me`, { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => data?.student?.name && setStudentName(data.student.name))
      .catch(() => {});
  }, []);
  return (
    <div className="home-page">

      {/* =========================================
          HEADER
          ========================================= */}

      <header className="home-header">

        <div className="home-header-copy">

          <p className="page-eyebrow">
            Your little space 🌱
          </p>

          <h1>
            Hey {studentName || "there"},
            <br />
            how are you feeling today?
          </h1>

          <p className="home-intro">
            Take a moment for yourself. There are no
            right or wrong answers.
          </p>

        </div>

        <div className="home-header-actions">
          <button
            className="theme-toggle"
            onClick={toggle}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <div
            className="home-greeting-mark"
            aria-hidden="true"
          >
            ☀️
          </div>
        </div>

      </header>

      {/* =========================================
          CHECK-IN HERO
          ========================================= */}

      <section
        className="home-checkin motion-hover"
      >

        <div className="home-checkin-copy">

          <p className="card-kicker">
            30 second check-in
          </p>

          <h2>
            Check in with yourself.
          </h2>

          <p>
            Tell Antarang how you&apos;re doing today
            and keep a little record of your journey.
            It only takes a few seconds.
          </p>

          <Link
            to="/app/check-in"
            className="app-primary anim-button-energy"
          >
            Start check-in
            <span aria-hidden="true">
              →
            </span>
          </Link>

        </div>

        {/* FLOATING MOOD CLOUD */}

        <div
          className="home-mood-preview"
          aria-hidden="true"
        >
          <span className="home-mood-emoji">
            😄
          </span>

          <span className="home-mood-emoji">
            🙂
          </span>

          <span className="home-mood-emoji">
            😌
          </span>

          <span className="home-mood-emoji">
            😐
          </span>

          <span className="home-mood-emoji">
            😕
          </span>

          <span className="home-mood-emoji">
            😞
          </span>
        </div>

        <div
          className="home-checkin-shape"
          aria-hidden="true"
        />

      </section>

      {/* =========================================
          LOWER CONTENT
          ========================================= */}

      <section className="home-lower">

        {/* JOURNEY */}

        <article
          className="home-panel mood-panel motion-hover"
        >

          <div className="home-panel-header">

            <div>

              <p className="home-section-kicker">
                Your journey
              </p>

              <h2>
                A little look at your week
              </h2>

              <p>
                Your check-ins stay about your own
                experience. Notice patterns without
                judging them.
              </p>

            </div>

            <Link
              to="/app/journey"
              className="app-secondary anim-shine"
            >
              View journey →
            </Link>

          </div>

          <div
            className="home-week"
            aria-label="Mood check-ins across the week"
          >

            {weekMood.map((item, index) => (

              <div
                className="home-week-day"
                key={`${item.day}-${index}`}
              >

                <div
                  className={`home-week-bar ${item.level}`}
                  style={{
                    height: item.height,
                  }}
                  title={`${item.day}: ${item.mood}`}
                >

                  <span>
                    {item.mood}
                  </span>

                </div>

                <small>
                  {item.day}
                </small>

              </div>

            ))}

          </div>

        </article>

        {/* EXPLORE */}

        <article
          className="home-panel explore-panel motion-hover"
        >

          <div className="home-panel-header">

            <div>

              <p className="home-section-kicker">
                Explore
              </p>

              <h2>
                Something useful for today
              </h2>

              <p>
                Small things to try when you need
                a little help, a pause, or a fresh start.
              </p>

            </div>

          </div>

          <div className="topic-pills">

            {topics.map((topic) => (

              <Link
                key={topic.id}
                to={`/app/explore/${topic.id}`}
                className={`topic-pill topic-${topic.color}`}
              >

                <span aria-hidden="true">
                  {topic.icon}
                </span>

                {topic.label}

                <span
                  className="topic-pill-spark"
                  aria-hidden="true"
                >
                  ✦
                </span>

              </Link>

            ))}

          </div>

          <Link
            to="/app/explore"
            className="app-secondary anim-shine"
          >
            Browse all topics →
          </Link>

        </article>

      </section>

    </div>
  );
}

export default Home;