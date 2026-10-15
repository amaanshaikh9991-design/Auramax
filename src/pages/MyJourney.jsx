import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../api";

const moodMeta = {
  great: { emoji: "😄", tone: "great", value: 88 },
  good: { emoji: "🙂", tone: "good", value: 68 },
  okay: { emoji: "😐", tone: "okay", value: 50 },
  low: { emoji: "😕", tone: "low", value: 32 },
  rough: { emoji: "😞", tone: "low", value: 20 },
};

const factorMeta = {
  studies: ["📚", "Studies"],
  sleep: ["🌙", "Sleep"],
  friends: ["🫶", "Friends"],
  home: ["🏠", "Home"],
  self: ["🌱", "Just me"],
  other: ["✦", "Something else"],
};

function dateKey(value) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function MyJourney() {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const today = new Date();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/check-ins`, { credentials: "include" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load your journey.");
        setCheckIns(data.checkIns || []);
      })
      .catch((requestError) => {
        console.error("Journey load error:", requestError);
        setError(requestError.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const monthName = today.toLocaleString("en-US", { month: "long" });
  const monthCheckIns = checkIns.filter((item) => {
    const date = new Date(item.createdAt);
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  });
  const checkInsByDate = new Map(checkIns.map((item) => [dateKey(item.createdAt), item]));
  const recent = [...checkIns].reverse().slice(-5);
  const factorCounts = {};
  monthCheckIns.forEach((item) => (item.factors || []).forEach((factor) => {
    factorCounts[factor] = (factorCounts[factor] || 0) + 1;
  }));
  const factors = Object.entries(factorCounts)
    .sort(([, left], [, right]) => right - left)
    .map(([name, count]) => ({
      name,
      count,
      emoji: factorMeta[name]?.[0] || "✦",
      label: factorMeta[name]?.[1] || name,
    }));
  const maxFactorCount = Math.max(...factors.map((factor) => factor.count), 1);
  const calendarDays = Array.from({ length: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() }, (_, index) => index + 1);
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;

  const week = useMemo(() => recent.map((item) => {
    const date = new Date(item.createdAt);
    const meta = moodMeta[item.mood] || moodMeta.okay;
    return { ...meta, day: date.toLocaleDateString("en-US", { weekday: "short" }), date: date.getDate(), id: item.id };
  }), [recent]);

  return (
    <div className="mj-page">
      <header className="mj-header">
        <div>
          <p className="mj-eyebrow">MY JOURNEY · {monthName.toUpperCase()}</p>
          <h1>Your little<br /><span>mood map.</span></h1>
          <p className="mj-intro">Look back at your check-ins and notice what your days have been like. This is about your patterns, not a score.</p>
        </div>
        <Link to="/app/check-in" className="mj-checkin"><span>+</span> Check in today</Link>
      </header>

      {loading && <p className="mj-card-copy">Loading your check-ins...</p>}
      {error && <p className="mj-card-copy">{error}</p>}
      {!loading && !error && checkIns.length === 0 && (
        <section className="mj-reflection">
          <div><p className="mj-kicker">YOUR JOURNEY STARTS HERE</p><h2>No check-ins yet.</h2><p>Add your first check-in and your real patterns will appear here.</p></div>
          <Link to="/app/check-in" className="mj-outline">Add your first check-in →</Link>
        </section>
      )}

      {!loading && !error && checkIns.length > 0 && <>
        <section className="mj-overview">
          <div className="mj-overview-main">
            <div className="mj-section-head"><div><p className="mj-kicker">RECENT CHECK-INS</p><h2>{recent.length ? "Your latest moments" : "Your moments"}</h2></div><span className="mj-range">{monthName}</span></div>
            <div className="mj-chart">
              <div className="mj-y-axis"><span>Great</span><span>Good</span><span>Okay</span><span>Low</span></div>
              <div className="mj-chart-area"><div className="mj-grid-lines"><i /><i /><i /><i /></div><div className="mj-bars">
                {week.map((item) => <div className="mj-bar-column" key={item.id}><div className="mj-bar-value">{item.emoji}</div><div className={`mj-bar mj-${item.tone}`} style={{ height: `${item.value}%` }} /><strong>{item.day}</strong><small>{item.date}</small></div>)}
              </div></div>
            </div>
          </div>
          <aside className="mj-stat-card"><div className="mj-stat-orb">🌱</div><p className="mj-kicker">YOUR CHECK-INS</p><strong>{monthCheckIns.length}</strong><span>this month</span><div className="mj-stat-line"><i style={{ width: `${Math.min(monthCheckIns.length * 10, 100)}%` }} /></div><p className="mj-stat-note">Your check-ins will build this picture over time.</p></aside>
        </section>

        <section className="mj-grid">
          <article className="mj-card mj-calendar-card">
            <div className="mj-section-head"><div><p className="mj-kicker">YOUR MONTH</p><h2>{monthName}</h2></div><span className="mj-month-dot">●</span></div>
            <div className="mj-weekdays">{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <span key={`${day}-${i}`}>{day}</span>)}</div>
            <div className="mj-calendar">
              {Array.from({ length: mondayOffset }, (_, index) => <div className="mj-date mj-date-empty" key={`empty-${index}`} />)}
              {calendarDays.map((day) => {
                const item = checkInsByDate.get(`${today.getFullYear()}-${today.getMonth()}-${day}`);
                const tone = item ? (moodMeta[item.mood]?.tone || "okay") : "empty";
                return <div className={`mj-date ${item ? `mj-date-${tone}` : "mj-date-empty"} ${day === today.getDate() ? "mj-date-today" : ""}`} key={day}>{day}</div>;
              })}
            </div>
            <div className="mj-legend"><span><i className="mj-legend-great" /> Good day</span><span><i className="mj-legend-okay" /> Okay day</span><span><i className="mj-legend-low" /> Low day</span></div>
          </article>
          <article className="mj-card mj-factors-card">
            <div className="mj-section-head"><div><p className="mj-kicker">WHAT SHOWED UP</p><h2>Things around you</h2></div></div>
            <p className="mj-card-copy">{factors.length ? "These are the factors you mentioned in this month's check-ins." : "Your selected factors will appear here."}</p>
            <div className="mj-factor-list">{factors.map((factor) => <div className="mj-factor" key={factor.name}><span className="mj-factor-icon">{factor.emoji}</span><div className="mj-factor-body"><div><strong>{factor.label}</strong><small>{factor.count} check-ins</small></div><div className="mj-factor-track"><i style={{ width: `${(factor.count / maxFactorCount) * 100}%` }} /></div></div></div>)}</div>
          </article>
        </section>
      </>}
    </div>
  );
}

export default MyJourney;
