import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const topics = [
  {
    id: "studies",
    emoji: "📚",
    title: "Studies",
    text: "Make the workload feel a little lighter.",
    className: "explore-topic-studies",
  },
  {
    id: "sleep",
    emoji: "🌙",
    title: "Sleep",
    text: "Wind down, reset, and give your mind a break.",
    className: "explore-topic-sleep",
  },
  {
    id: "home",
    emoji: "🏠",
    title: "Home",
    text: "For days when you miss familiar people and places.",
    className: "explore-topic-home",
  },
  {
    id: "friends",
    emoji: "🫶",
    title: "Friends",
    text: "Connection, awkward moments, and finding your people.",
    className: "explore-topic-friends",
  },
  {
    id: "calm",
    emoji: "🌿",
    title: "Calm",
    text: "Simple things to slow your thoughts down.",
    className: "explore-topic-calm",
  },
];

const quickActivities = [
  {
    id: "breathe",
    emoji: "🌬️",
    title: "Take 5 breaths",
    text: "A tiny reset when everything feels a bit much.",
    time: "1 MIN",
    className: "quick-breathe",
    accent: "green",
    label: "BREATHE",
  },
  {
    id: "sound",
    emoji: "🎧",
    title: "Sound break",
    text: "Put on one song and do absolutely nothing else.",
    time: "3 MIN",
    className: "quick-sound",
    accent: "purple",
    label: "LISTEN",
  },
  {
    id: "write",
    emoji: "✍️",
    title: "Brain dump",
    text: "Write down whatever is taking up space in your head.",
    time: "2 MIN",
    className: "quick-write",
    accent: "peach",
    label: "WRITE",
  },
  {
    id: "outside",
    emoji: "🌱",
    title: "Step outside",
    text: "Look around. Notice five things you can see.",
    time: "5 MIN",
    className: "quick-outside",
    accent: "yellow",
    label: "NOTICE",
  },
];

function Explore() {
  const [activeActivity, setActiveActivity] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [breathPhase, setBreathPhase] = useState("Ready?");
  const [breathCount, setBreathCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [note, setNote] = useState("");
  const [outsideChecks, setOutsideChecks] = useState([]);

  const selectedActivity = quickActivities.find(
    (activity) => activity.id === activeActivity
  );

  function openActivity(id) {
    setActiveActivity(id);
    setCompleted(false);
    setStarted(false);
    setNote("");
    setOutsideChecks([]);
    setBreathCount(0);
    setBreathPhase("Ready?");
    setSecondsLeft(id === "sound" ? 180 : id === "outside" ? 300 : 60);

    setTimeout(() => {
      document
        .getElementById("activity-zone")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 80);
  }

  function closeActivity() {
    setActiveActivity(null);
    setCompleted(false);
    setStarted(false);
    setNote("");
    setOutsideChecks([]);
  }

  function randomActivity() {
    const randomIndex = Math.floor(
      Math.random() * quickActivities.length
    );

    openActivity(quickActivities[randomIndex].id);
  }

  function markComplete() {
    setCompleted(true);
    setStarted(false);
  }

  function toggleOutsideCheck(index) {
    setOutsideChecks((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  }

  useEffect(() => {
    if (!started || !activeActivity || secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          setStarted(false);
          setCompleted(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, activeActivity, secondsLeft]);

  useEffect(() => {
    if (
      activeActivity !== "breathe" ||
      !started ||
      completed
    ) {
      return;
    }

    const phases = [
      "Breathe in",
      "Hold",
      "Breathe out",
      "Rest",
    ];

    let phaseIndex = 0;

    setBreathPhase(phases[phaseIndex]);

    const phaseTimer = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;

      setBreathPhase(phases[phaseIndex]);

      if (phaseIndex === 2) {
        setBreathCount((current) => {
          const next = current + 1;

          if (next >= 5) {
            setCompleted(true);
            setStarted(false);
          }

          return next;
        });
      }
    }, 4000);

    return () => clearInterval(phaseTimer);
  }, [activeActivity, started, completed]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const remaining = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remaining}`;
  }

  return (
    <div className="explore-v2-page">

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="explore-v2-hero">

        <div className="explore-v2-hero-copy">

          <div className="explore-v2-eyebrow">
            <span>✦</span>
            EXPLORE YOUR SPACE
          </div>

          <h1>
            Find something
            <br />
            <span>that fits today.</span>
          </h1>

          <p>
            You don't need to know exactly what you need.
            Pick a mood, follow a tiny idea, or simply
            wander around.
          </p>

          <div className="explore-v2-word-cloud">
            <span>rest</span>
            <span>focus</span>
            <span>laugh</span>
            <span>breathe</span>
            <span>reset</span>
          </div>

        </div>

        <div className="explore-v2-hero-art">

          <div className="explore-v2-sun">
            ☀️
          </div>

          <div className="explore-v2-plant">
            🌱
          </div>

          <div className="explore-v2-orbit orbit-one"></div>
          <div className="explore-v2-orbit orbit-two"></div>

          <div className="explore-v2-floating-card card-one">
            <span>🌙</span>
            <strong>slow down</strong>
          </div>

          <div className="explore-v2-floating-card card-two">
            <span>✨</span>
            <strong>try something</strong>
          </div>

          <div className="explore-v2-main-orb">
            <span>🌼</span>

            <small>TODAY</small>

            <strong>
              Whatever
              <br />
              feels right.
            </strong>
          </div>

          <div className="explore-v2-star star-one">✦</div>
          <div className="explore-v2-star star-two">✦</div>
          <div className="explore-v2-star star-three">✦</div>

        </div>

      </section>

      {/* =====================================================
          FEATURED ACTIVITY
          ===================================================== */}

      <section className="explore-v2-feature">

        <div className="explore-v2-feature-copy">

          <div className="explore-v2-feature-label">
            <span>✦</span>
            TRY THIS NOW
          </div>

          <h2>
            A tiny
            <br />
            <em>reset.</em>
          </h2>

          <p>
            Put everything else down for a moment.
            Take a few slow breaths and give your brain
            some breathing room.
          </p>

          <button
            type="button"
            className="explore-v2-main-button"
            onClick={() => openActivity("breathe")}
          >
            Try a calm activity
            <span>→</span>
          </button>

        </div>

        <div className="explore-v2-feature-art">

          <div className="feature-v2-ring ring-one"></div>
          <div className="feature-v2-ring ring-two"></div>
          <div className="feature-v2-ring ring-three"></div>

          <div className="feature-v2-person">
            🧘
          </div>

          <div className="feature-v2-time">
            <strong>02</strong>
            <small>MIN</small>
          </div>

          <div className="feature-v2-spark spark-one">✦</div>
          <div className="feature-v2-spark spark-two">✦</div>

        </div>

      </section>

      {/* =====================================================
          TOPICS
          ===================================================== */}

      <section className="explore-v2-topics">

        <div className="explore-v2-section-heading">

          <div>
            <span>WHAT FEELS RELEVANT?</span>

            <h2>
              Pick a little
              <br />
              <em>corner.</em>
            </h2>
          </div>

          <p>
            You don't have to explore everything.
            <br />
            Start wherever feels right.
          </p>

        </div>

        <div className="explore-v2-topic-grid">

          {topics.map((topic, index) => (
            <Link
              key={topic.id}
              to={`/app/explore/${topic.id}`}
              className={`explore-v2-topic ${topic.className}`}
            >

              <div className="explore-v2-topic-top">

                <div className="explore-v2-topic-icon">
                  {topic.emoji}
                </div>

                <span>0{index + 1}</span>

              </div>

              <div className="explore-v2-topic-content">

                <h3>{topic.title}</h3>

                <p>{topic.text}</p>

              </div>

              <div className="explore-v2-topic-arrow">
                ↗
              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* =====================================================
          QUICK ACTIVITIES
          ===================================================== */}

      <section className="explore-v2-quick">

        <div className="explore-v2-quick-heading">

          <div>

            <span>NO BIG DECISIONS</span>

            <h2>
              Just pick
              <br />
              <em>one tiny thing.</em>
            </h2>

          </div>

          <button
            type="button"
            className="explore-v2-random"
            onClick={randomActivity}
          >
            <span>↻</span>
            RANDOM PICK
          </button>

        </div>

        <div className="explore-v2-activity-grid">

          {quickActivities.map((activity) => {

            const isActive =
              activeActivity === activity.id;

            return (
              <button
                key={activity.id}
                type="button"
                className={`explore-v2-activity ${activity.className} ${
                  isActive ? "is-selected" : ""
                }`}
                onClick={() => openActivity(activity.id)}
              >

                <div className="explore-v2-activity-top">

                  <div className="explore-v2-activity-icon">
                    {activity.emoji}
                  </div>

                  <span className="explore-v2-time">
                    {activity.time}
                  </span>

                </div>

                <div className="explore-v2-activity-body">

                  <span className="explore-v2-activity-label">
                    {activity.label}
                  </span>

                  <h3>{activity.title}</h3>

                  <p>{activity.text}</p>

                  <span className="explore-v2-try">
                    {isActive
                      ? "Nice choice ✓"
                      : "Try it →"}
                  </span>

                </div>

              </button>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          ACTIVE ACTIVITY EXPERIENCE
          ===================================================== */}

      {selectedActivity && (
        <section
          id="activity-zone"
          className={`explore-v2-activity-zone activity-${selectedActivity.id}`}
        >

          <div className="activity-zone-glow glow-one"></div>
          <div className="activity-zone-glow glow-two"></div>

          <button
            type="button"
            className="activity-close"
            onClick={closeActivity}
            aria-label="Close activity"
          >
            ×
          </button>

          <div className="activity-zone-left">

            <div className="activity-zone-eyebrow">
              <span>✦</span>
              {selectedActivity.label}
            </div>

            <div className="activity-zone-icon">
              {selectedActivity.emoji}
            </div>

            <h2>
              {completed
                ? "That was enough."
                : selectedActivity.title}
            </h2>

            <p>
              {completed
                ? "Nice work. You gave yourself a little space."
                : selectedActivity.text}
            </p>

            {completed && (
              <div className="activity-complete-message">
                <span>✓</span>
                <div>
                  <strong>Nice choice.</strong>
                  <small>
                    You can stay here or explore something else.
                  </small>
                </div>
              </div>
            )}

          </div>

          <div className="activity-zone-action">

            {/* BREATHING */}
            {selectedActivity.id === "breathe" && (
              <>
                {!completed && (
                  <>
                    <div
                      className={`breathing-orb ${
                        started ? "breathing-active" : ""
                      }`}
                    >
                      <div className="breathing-orb-inner">
                        <span>{breathPhase}</span>
                        <small>
                          {breathCount}/5 breaths
                        </small>
                      </div>
                    </div>

                    <div className="activity-zone-controls">

                      {!started ? (
                        <button
                          type="button"
                          onClick={() => setStarted(true)}
                          className="activity-primary-button"
                        >
                          Start breathing
                          <span>→</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setStarted(false)}
                          className="activity-secondary-button"
                        >
                          Pause
                        </button>
                      )}

                    </div>
                  </>
                )}

                {completed && (
                  <div className="completed-big">
                    <div>🌿</div>
                    <strong>5 breaths done.</strong>
                    <span>Take your time before moving on.</span>
                  </div>
                )}
              </>
            )}

            {/* SOUND */}
            {selectedActivity.id === "sound" && (
              <>
                <div className="sound-visual">

                  <div className="sound-circle">
                    <span>🎧</span>
                  </div>

                  <div className="sound-bars">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>

                  <strong>
                    {completed
                      ? "Nice and quiet."
                      : formatTime(secondsLeft)}
                  </strong>

                </div>

                {!completed && (
                  <button
                    type="button"
                    className="activity-primary-button"
                    onClick={() =>
                      started
                        ? setStarted(false)
                        : setStarted(true)
                    }
                  >
                    {started
                      ? "Pause the break"
                      : "Start the break"}
                    <span>→</span>
                  </button>
                )}

                {completed && (
                  <button
                    type="button"
                    className="activity-primary-button"
                    onClick={markComplete}
                  >
                    Nice choice ✓
                  </button>
                )}
              </>
            )}

            {/* BRAIN DUMP */}
            {selectedActivity.id === "write" && (
              <>
                <div className="brain-dump-box">

                  <div className="brain-dump-top">
                    <span>NO PERFECT WORDS NEEDED</span>
                    <span>{note.length}/500</span>
                  </div>

                  <textarea
                    value={note}
                    onChange={(event) =>
                      setNote(event.target.value)
                    }
                    placeholder="What's taking up space in your head?"
                    maxLength={500}
                  />

                </div>

                {!completed ? (
                  <button
                    type="button"
                    className="activity-primary-button"
                    onClick={markComplete}
                  >
                    I'm done for now
                    <span>✓</span>
                  </button>
                ) : (
                  <div className="activity-saved">
                    <span>✓</span>
                    You made some room.
                  </div>
                )}
              </>
            )}

            {/* OUTSIDE */}
            {selectedActivity.id === "outside" && (
              <>
                <div className="outside-challenge">

                  <span>LOOK AROUND</span>

                  <h3>
                    Find five things
                    <br />
                    you can notice.
                  </h3>

                  {[
                    "Something green",
                    "Something moving",
                    "Something you can hear",
                    "Something interesting",
                    "Something that makes you smile",
                  ].map((item, index) => (
                    <button
                      type="button"
                      key={item}
                      className={
                        outsideChecks.includes(index)
                          ? "checked"
                          : ""
                      }
                      onClick={() =>
                        toggleOutsideCheck(index)
                      }
                    >
                      <span>
                        {outsideChecks.includes(index)
                          ? "✓"
                          : index + 1}
                      </span>

                      {item}
                    </button>
                  ))}

                </div>

                {outsideChecks.length === 5 ? (
                  <button
                    type="button"
                    className="activity-primary-button"
                    onClick={markComplete}
                  >
                    Nice choice
                    <span>✓</span>
                  </button>
                ) : (
                  <div className="outside-progress">
                    {outsideChecks.length}/5 noticed
                  </div>
                )}
              </>
            )}

          </div>

        </section>
      )}

      {/* =====================================================
          RANDOM DISCOVERY
          ===================================================== */}

      <section className="explore-v2-random-section">

        <div className="random-v2-copy">

          <div className="random-v2-label">
            <span>✦</span>
            SOMETHING RANDOM
          </div>

          <h2>
            You weren't
            <br />
            looking for this.
          </h2>

          <p>
            And that's kind of the point.
            Sometimes the thing you need isn't
            the thing you were searching for.
          </p>

          <button
            type="button"
            className="random-v2-button"
            onClick={randomActivity}
          >
            Show me something
            <span>↗</span>
          </button>

        </div>

        <div className="random-v2-art">

          <div className="random-v2-ring ring-a"></div>
          <div className="random-v2-ring ring-b"></div>

          <div className="random-v2-object object-a">
            🎨
          </div>

          <div className="random-v2-object object-b">
            🎵
          </div>

          <div className="random-v2-object object-c">
            🌿
          </div>

          <div className="random-v2-center">
            ?
          </div>

          <div className="random-v2-star">
            ✦
          </div>

        </div>

      </section>

      {/* =====================================================
          SUPPORT
          ===================================================== */}

      <section className="explore-v2-support">

        <div className="explore-v2-support-icon">
          🫶
        </div>

        <div>

          <span>NEED SOMETHING MORE?</span>

          <h2>
            You don't have to
            <br />
            figure everything out alone.
          </h2>

          <p>
            If you want to talk to someone or need more support,
            there are people and places you can reach out to.
          </p>

        </div>

        <Link
          to="/app/support"
          className="explore-v2-support-button"
        >
          See support options
          <span>→</span>
        </Link>

      </section>

      <div className="explore-v2-footer">
        <span>✦</span>
        Explore at your own pace.
      </div>

    </div>
  );
}

export default Explore;