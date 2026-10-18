import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";

/* ── helpers ──────────────────────────────────────────────── */
const moodScore = { great: 5, good: 4, okay: 3, low: 2, rough: 1 };
const moodLabel = { great: "Great", good: "Good", okay: "Okay", low: "Low", rough: "Rough" };
const moodEmoji = { great: "😄", good: "🙂", okay: "😐", low: "😕", rough: "😞" };
const factorMeta = {
  studies: ["📚", "Studies"],
  sleep:   ["🌙", "Sleep"],
  friends: ["🫶", "Friends"],
  home:    ["🏠", "Home"],
  self:    ["🌱", "Just me"],
  other:   ["✦", "Something else"],
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function average(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

/* ── SVG line chart ────────────────────────────────────────── */
function MoodLineChart({ points }) {
  const svgRef = useRef(null);
  const W = 560, H = 160, PAD = 20;

  if (!points.length) return null;

  const xs = points.map((_, i) => PAD + (i / Math.max(points.length - 1, 1)) * (W - PAD * 2));
  const ys = points.map((p) => H - PAD - ((p.score - 1) / 4) * (H - PAD * 2));

  // smooth bezier
  const d = xs.map((x, i) => {
    if (i === 0) return `M ${x} ${ys[i]}`;
    const cpx = (xs[i - 1] + x) / 2;
    return `C ${cpx} ${ys[i - 1]}, ${cpx} ${ys[i]}, ${x} ${ys[i]}`;
  }).join(" ");

  // fill area
  const fillD = `${d} L ${xs[xs.length - 1]} ${H - PAD} L ${xs[0]} ${H - PAD} Z`;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="pf-svg-chart"
      aria-label="Mood trend line chart"
    >
      {/* y-axis labels */}
      {["Great", "Good", "Okay", "Low"].map((label, i) => (
        <text
          key={label}
          x={PAD - 4}
          y={PAD + (i / 3) * (H - PAD * 2) + 4}
          className="pf-svg-label"
          textAnchor="end"
          fontSize="9"
        >
          {label}
        </text>
      ))}

      {/* horizontal grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={PAD}
          x2={W - PAD}
          y1={PAD + (i / 3) * (H - PAD * 2)}
          y2={PAD + (i / 3) * (H - PAD * 2)}
          className="pf-svg-grid"
        />
      ))}

      {/* fill */}
      <path d={fillD} className="pf-svg-fill" />

      {/* line */}
      <path d={d} className="pf-svg-line" fill="none" />

      {/* dots */}
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r={4} className="pf-svg-dot" />
          <text
            x={x}
            y={H - 4}
            textAnchor="middle"
            fontSize="8"
            className="pf-svg-label"
          >
            {points[i].day}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── mini bar (factor freq) ────────────────────────────────── */
function FactorBar({ label, emoji, count, max }) {
  const pct = max ? Math.round((count / max) * 100) : 0;
  return (
    <div className="pf-factor-row">
      <span className="pf-factor-emoji">{emoji}</span>
      <span className="pf-factor-name">{label}</span>
      <div className="pf-factor-track">
        <div className="pf-factor-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="pf-factor-count">{count}×</span>
    </div>
  );
}

/* ── pattern observation card ─────────────────────────────── */
function PatternCard({ icon, title, body, tone }) {
  return (
    <div className={`pf-obs-card pf-obs-${tone}`}>
      <span className="pf-obs-icon">{icon}</span>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </div>
  );
}

/* ── word cloud (reflection keyword freq) ─────────────────── */
const STOP = new Set([
  "i","a","an","the","and","or","but","to","in","on","of","for",
  "it","is","was","are","be","been","have","had","do","did","at",
  "my","me","so","if","as","by","this","that","with","not","just",
  "felt","feel","feeling","today","day","really","very","little",
  "bit","things","something","also","still","lot","much","even",
  "got","get","time","been","then","when","more","some","all",
  "its","was","they","them","their","too","can","cant","dont",
  "about","would","could","should","like","up","out","no","yes",
]);

function extractKeywords(checkIns) {
  const freq = {};
  checkIns.forEach((item) => {
    if (!item.reflection) return;
    item.reflection
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w))
      .forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
  });
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 22);
}

/* ================================================================
   PAGE COMPONENT
   ================================================================ */
export default function PatternFinder() {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/check-ins`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setCheckIns(data.checkIns || []))
      .catch(() => setError("Could not load your check-ins."))
      .finally(() => setLoading(false));
  }, []);

  /* ── derived data ─────────────────────────────────────────── */
  const sorted = useMemo(
    () => [...checkIns].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [checkIns]
  );

  const chartPoints = useMemo(
    () =>
      sorted.slice(-14).map((item) => ({
        score: moodScore[item.mood] ?? 3,
        mood:  item.mood,
        day:   new Date(item.createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
        emoji: moodEmoji[item.mood] || "😐",
      })),
    [sorted]
  );

  const factorFreq = useMemo(() => {
    const counts = {};
    sorted.forEach((item) =>
      (item.factors || []).forEach((f) => { counts[f] = (counts[f] || 0) + 1; })
    );
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([k, v]) => ({ key: k, count: v, emoji: factorMeta[k]?.[0] || "✦", label: factorMeta[k]?.[1] || k }));
  }, [sorted]);

  const maxFactor = factorFreq[0]?.count || 1;

  const keywords = useMemo(() => extractKeywords(sorted), [sorted]);
  const maxKw = keywords[0]?.[1] || 1;

  /* ── observations (pattern logic) ───────────────────────────── */
  const observations = useMemo(() => {
    const obs = [];
    if (sorted.length < 3) return obs;

    const scores = sorted.map((item) => moodScore[item.mood] ?? 3);
    const avg = average(scores);

    // Trend: last 5 vs first 5
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.ceil(scores.length / 2));
    const trend = average(secondHalf) - average(firstHalf);
    if (trend > 0.6)
      obs.push({ icon: "📈", title: "Your mood has been lifting", body: "Over your recent check-ins your overall mood has been trending upward. Something seems to be going better for you.", tone: "green" });
    else if (trend < -0.6)
      obs.push({ icon: "📉", title: "Your mood has dipped recently", body: "Your more recent check-ins show a lower average than your earlier ones. That's worth noticing, not judging.", tone: "peach" });

    // Consistency
    if (sorted.length >= 7)
      obs.push({ icon: "🗓️", title: `${sorted.length} check-ins so far`, body: "You've been showing up for yourself consistently. Patterns become clearer the more you check in.", tone: "blue" });

    // Dominant factor
    if (factorFreq.length > 0) {
      const top = factorFreq[0];
      obs.push({ icon: top.emoji, title: `"${top.label}" comes up most`, body: `You've mentioned ${top.label.toLowerCase()} in ${top.count} check-in${top.count > 1 ? "s" : ""}. It seems to be something that occupies your mind.`, tone: "lavender" });
    }

    // Factor & mood correlation
    if (factorFreq.length > 0) {
      const topFactor = factorFreq[0].key;
      const withFactor    = sorted.filter((i) => (i.factors || []).includes(topFactor));
      const withoutFactor = sorted.filter((i) => !(i.factors || []).includes(topFactor));
      if (withFactor.length >= 2 && withoutFactor.length >= 2) {
        const avgWith    = average(withFactor.map((i) => moodScore[i.mood] ?? 3));
        const avgWithout = average(withoutFactor.map((i) => moodScore[i.mood] ?? 3));
        const diff = avgWithout - avgWith;
        if (diff > 0.7)
          obs.push({ icon: "🔍", title: `You tend to feel lower on ${factorMeta[topFactor]?.[1] || topFactor} days`, body: `On days where you mention ${(factorMeta[topFactor]?.[1] || topFactor).toLowerCase()}, your average mood is a bit lower than on other days. This is an observation, not a diagnosis.`, tone: "yellow" });
        else if (diff < -0.5)
          obs.push({ icon: "✨", title: `${factorMeta[topFactor]?.[1] || topFactor} days tend to feel better`, body: `Interestingly, days where you mention ${(factorMeta[topFactor]?.[1] || topFactor).toLowerCase()} are associated with slightly higher moods for you.`, tone: "green" });
      }
    }

    // Average mood summary
    if (avg >= 4.2)
      obs.push({ icon: "☀️", title: "Your overall mood is strong", body: `Your average mood across all check-ins sits around "${moodLabel[Object.keys(moodScore).find((k) => moodScore[k] === Math.round(avg)) || "good"]}". You seem to be doing well on the whole.`, tone: "green" });
    else if (avg <= 2.5)
      obs.push({ icon: "🌧️", title: "Things have been harder lately", body: "Your overall check-in average suggests it's been a difficult stretch. That's real, and it matters.", tone: "peach" });

    return obs;
  }, [sorted, factorFreq]);

  /* ── ask Antarang AI ─────────────────────────────────────── */
  async function askAI() {
    if (aiLoading || sorted.length < 2) return;
    setAiLoading(true);
    setAiInsight("");

    const summary = sorted.slice(-10).map((item) => {
      const d = formatDate(item.createdAt);
      const parts = [`${d}: mood=${item.mood}`];
      if (item.factors?.length) parts.push(`factors=[${item.factors.join(", ")}]`);
      if (item.reflection) parts.push(`note="${item.reflection.slice(0, 120)}"`);
      return parts.join(", ");
    }).join("\n");

    const prompt = `Here are my recent check-ins:\n\n${summary}\n\nBased on these patterns, give me 3–4 brief, warm observations about what you notice. Frame them as possibilities, not facts. Use plain language. Don't diagnose or prescribe. End with one small, gentle suggestion for this week.`;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();
      setAiInsight(data.reply || data.message || "No insight returned.");
    } catch {
      setAiInsight("Could not reach Antarang AI right now. Try again in a moment.");
    } finally {
      setAiLoading(false);
    }
  }

  /* ── render ───────────────────────────────────────────────── */
  const hasData = !loading && !error && sorted.length >= 2;
  const tooFew  = !loading && !error && sorted.length < 2;

  return (
    <div className="pf-page">

      {/* ── header ───────────────────────────────────────────── */}
      <header className="pf-header">
        <div className="pf-header-copy">
          <p className="pf-eyebrow">PERSONAL PATTERN FINDER</p>
          <h1>What your<br /><span>check-ins say.</span></h1>
          <p className="pf-intro">
            This page looks across all your check-ins and surfaces patterns —
            things like which factors come up most, how your mood shifts over time,
            and what your reflections tend to focus on. These are observations, not diagnoses.
          </p>
        </div>
        <div className="pf-header-art" aria-hidden="true">
          <div className="pf-art-ring" />
          <div className="pf-art-ring pf-art-ring-sm" />
          <span className="pf-art-emoji">🔍</span>
        </div>
      </header>

      {loading && <p className="pf-state">Loading your patterns...</p>}
      {error   && <p className="pf-state pf-state-error">{error}</p>}

      {tooFew && (
        <div className="pf-empty">
          <span className="pf-empty-emoji">📭</span>
          <h2>Not enough check-ins yet</h2>
          <p>Add at least 2 check-ins and your personal patterns will start to appear here.</p>
          <button className="pf-cta" onClick={() => navigate("/app/check-in")}>
            Add a check-in →
          </button>
        </div>
      )}

      {hasData && <>

        {/* ── mood trend chart ─────────────────────────────── */}
        <section className="pf-section">
          <div className="pf-section-head">
            <div>
              <p className="pf-kicker">MOOD OVER TIME</p>
              <h2>How you've been feeling</h2>
            </div>
            <span className="pf-badge">{sorted.length} check-ins</span>
          </div>
          <div className="pf-chart-card">
            <MoodLineChart points={chartPoints} />
            <div className="pf-chart-legend">
              {["great","good","okay","low","rough"].map((m) => (
                <span key={m} className="pf-legend-item">
                  <i className={`pf-legend-dot pf-dot-${m}`} />
                  {moodEmoji[m]} {moodLabel[m]}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── two-col: factors + reflection words ─────────── */}
        <div className="pf-two-col">

          {/* factors */}
          <section className="pf-card">
            <p className="pf-kicker">WHAT SHOWED UP</p>
            <h2>Factors you mentioned</h2>
            <p className="pf-card-copy">Based on all your check-ins combined.</p>
            <div className="pf-factor-list">
              {factorFreq.length === 0
                ? <p className="pf-empty-small">No factors recorded yet.</p>
                : factorFreq.map((f) => (
                    <FactorBar key={f.key} label={f.label} emoji={f.emoji} count={f.count} max={maxFactor} />
                  ))
              }
            </div>
          </section>

          {/* reflection word cloud */}
          <section className="pf-card">
            <p className="pf-kicker">YOUR WORDS</p>
            <h2>What you write about</h2>
            <p className="pf-card-copy">Words that appear most in your reflections.</p>
            {keywords.length === 0
              ? <p className="pf-empty-small">Add reflections to your check-ins and they'll appear here.</p>
              : (
                <div className="pf-word-cloud">
                  {keywords.map(([word, count]) => {
                    const size = 11 + Math.round((count / maxKw) * 14);
                    const opacity = 0.45 + (count / maxKw) * 0.55;
                    return (
                      <span
                        key={word}
                        className="pf-word"
                        style={{ fontSize: `${size}px`, opacity }}
                        title={`${count} time${count > 1 ? "s" : ""}`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              )
            }
          </section>

        </div>

        {/* ── pattern observations ─────────────────────────── */}
        {observations.length > 0 && (
          <section className="pf-section">
            <div className="pf-section-head">
              <div>
                <p className="pf-kicker">WHAT WE NOTICE</p>
                <h2>Your patterns</h2>
              </div>
            </div>
            <div className="pf-obs-grid">
              {observations.map((obs, i) => (
                <PatternCard key={i} {...obs} />
              ))}
            </div>
          </section>
        )}

        {/* ── Antarang AI insight ───────────────────────────── */}
        <section className="pf-ai-section">
          <div className="pf-ai-header">
            <div>
              <p className="pf-kicker">ANTARANG AI</p>
              <h2>Ask for a deeper read</h2>
              <p className="pf-card-copy">
                Antarang AI will look at your last 10 check-ins and share what it notices —
                framed as possibilities, not facts.
              </p>
            </div>
            <button
              className="pf-ai-button"
              onClick={askAI}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <><span className="pf-spinner" />Thinking...</>
              ) : (
                <>✦ Get AI insight</>
              )}
            </button>
          </div>

          {aiInsight && (
            <div className="pf-ai-response">
              <div className="pf-ai-tag">✦ Antarang AI</div>
              <div className="pf-ai-body">
                {aiInsight.split("\n").filter(Boolean).map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <button
                className="pf-ai-chat-link"
                onClick={() =>
                  navigate("/app/chat", {
                    state: {
                      initialMessage:
                        "Based on my recent check-ins, can you help me explore these patterns further and suggest some practical next steps?",
                    },
                  })
                }
              >
                Continue this in Antarang AI →
              </button>
            </div>
          )}
        </section>

      </>}

    </div>
  );
}
