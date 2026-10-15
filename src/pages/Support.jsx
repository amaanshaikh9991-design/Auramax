import { Link } from "react-router-dom";

const supportOptions = [
  {
    icon: "💬",
    title: "Counselling",
    text: "Find out how to connect with the college counselling / welfare support available to students.",
    tag: "TALK TO SOMEONE",
    tone: "lavender",
  },
  {
    icon: "🏡",
    title: "Hostel support",
    text: "For hostel-related concerns, you can reach out through the existing hostel support structure.",
    tag: "HOSTEL",
    tone: "green",
  },
  {
    icon: "☎️",
    title: "Helplines",
    text: "Keep important support numbers in one easy-to-find place when you need them.",
    tag: "PHONE SUPPORT",
    tone: "peach",
  },
];

function Support() {
  return (
    <div className="sp-page">
      <header className="sp-header">
        <div>
          <p className="sp-eyebrow">SUPPORT · YOU DON'T HAVE TO FIGURE IT OUT ALONE</p>
          <h1>There&apos;s always<br /><span>somewhere to turn.</span></h1>
          <p className="sp-intro">
            Antarang can help you notice what you need. When you want more
            support, these are the people and places you can reach out to.
          </p>
        </div>

        <div className="sp-header-art" aria-hidden="true">
          <div>♡</div>
          <span>✦</span>
        </div>
      </header>

      <section className="sp-help-now">
        <div className="sp-help-icon">♡</div>
        <div>
          <p className="sp-kicker">HELP NOW</p>
          <h2>Need help right now?</h2>
          <p>
            If you feel unsafe, are in immediate danger, or think you might
            hurt yourself or someone else, contact a trusted adult or local
            emergency service immediately rather than waiting for an app
            response.
          </p>
        </div>
        <a className="sp-help-button" href="tel:112">
          Emergency help <span>→</span>
        </a>
      </section>

      <div className="sp-section-head">
        <div>
          <p className="sp-kicker">YOUR SUPPORT OPTIONS</p>
          <h2>Choose what feels right.</h2>
        </div>
        <span>Private · no judgement</span>
      </div>

      <section className="sp-options">
        {supportOptions.map((item) => (
          <article className={`sp-option sp-${item.tone}`} key={item.title}>
            <div className="sp-option-icon">{item.icon}</div>
            <p className="sp-option-tag">{item.tag}</p>
            <h3>{item.title}</h3>
            <p className="sp-option-text">{item.text}</p>
            <button type="button" className="sp-option-link">
              Learn more <span>→</span>
            </button>
          </article>
        ))}
      </section>

      <section className="sp-trusted">
        <div className="sp-trusted-mark">🌱</div>
        <div>
          <p className="sp-kicker">A SMALL REMINDER</p>
          <h2>Asking for help is still taking care of yourself.</h2>
          <p>
            You don't need to wait until something feels huge before speaking
            to someone you trust.
          </p>
        </div>
        <Link to="/app/check-in" className="sp-checkin-link">
          Check in with yourself →
        </Link>
      </section>
    </div>
  );
}

export default Support;
