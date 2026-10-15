import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";

const resources = {
  studies: {
    eyebrow: "STUDIES",
    title: "Make studying feel a little lighter.",
    description:
      "You don't have to fix your whole study routine today. Start with one small thing.",
    emoji: "📚",
    color: "purple",
    accent: "🧠",
    activities: [
      {
        title: "The 5-minute start",
        text: "Open the thing you've been avoiding and work on it for just five minutes.",
        tag: "START SMALL",
      },
      {
        title: "Shrink the task",
        text: "Instead of 'finish everything', choose one tiny action you can complete now.",
        tag: "MAKE IT EASIER",
      },
      {
        title: "Take a real break",
        text: "Step away for a few minutes instead of trying to push through when your brain is tired.",
        tag: "RESET",
      },
    ],
  },

  sleep: {
    eyebrow: "SLEEP",
    title: "Give your brain permission to slow down.",
    description:
      "Rest isn't wasted time. Sometimes your brain simply needs a quieter ending to the day.",
    emoji: "🌙",
    color: "blue",
    accent: "✨",
    activities: [
      {
        title: "Dim the day",
        text: "Lower the lights and move away from your screen for a little while before sleeping.",
        tag: "WIND DOWN",
      },
      {
        title: "Park your thoughts",
        text: "Write down anything you're worrying about so you don't have to keep carrying it in your head.",
        tag: "CLEAR YOUR MIND",
      },
      {
        title: "Keep it simple",
        text: "A familiar bedtime routine can help your brain recognise that it's time to slow down.",
        tag: "ROUTINE",
      },
    ],
  },

  home: {
    eyebrow: "HOME",
    title: "Missing home is allowed.",
    description:
      "Being away from familiar people and places can feel strange. You don't have to pretend it doesn't.",
    emoji: "🏠",
    color: "peach",
    accent: "💛",
    activities: [
      {
        title: "Send one message",
        text: "You don't need a big conversation. Send someone at home a simple 'thinking of you'.",
        tag: "CONNECT",
      },
      {
        title: "Bring something familiar",
        text: "A photo, song, snack or small object can make your space feel a little more like yours.",
        tag: "FAMILIAR",
      },
      {
        title: "Let yourself miss them",
        text: "Missing home doesn't mean you're failing to adjust. It means something matters to you.",
        tag: "BE KIND TO YOURSELF",
      },
    ],
  },

  friends: {
    eyebrow: "FRIENDS",
    title: "You don't have to figure people out alone.",
    description:
      "Friendships can be exciting, confusing, awkward and comforting — sometimes all in the same week.",
    emoji: "🫶",
    color: "green",
    accent: "💬",
    activities: [
      {
        title: "Start somewhere easy",
        text: "Sit with someone, ask about their day or send a simple message. Small connections count.",
        tag: "CONNECT",
      },
      {
        title: "Give yourself space",
        text: "You don't have to be available all the time. Healthy friendships leave room for breathing.",
        tag: "BOUNDARIES",
      },
      {
        title: "Find your people",
        text: "Try an activity, club or shared interest where meeting people feels more natural.",
        tag: "FIND YOUR SPACE",
      },
    ],
  },

  calm: {
    eyebrow: "CALM",
    title: "Take a tiny reset.",
    description:
      "You don't need a whole hour to pause. Even a couple of minutes can create some breathing room.",
    emoji: "🌿",
    color: "yellow",
    accent: "✦",
    activities: [
      {
        title: "Take five slow breaths",
        text: "Breathe in slowly, breathe out slowly, and let your shoulders drop a little.",
        tag: "BREATHE",
      },
      {
        title: "Look around",
        text: "Notice five things you can see. Let your attention move away from whatever is racing through your head.",
        tag: "GROUND YOURSELF",
      },
      {
        title: "Change your surroundings",
        text: "Stand up, step outside or move somewhere quieter for a few minutes.",
        tag: "MOVE",
      },
    ],
  },
};

function ResourceDetails() {
  const { topic } = useParams();
  const resource = resources[topic] || resources.calm;

  const [completed, setCompleted] = useState([]);
  const [activeActivity, setActiveActivity] = useState(null);

  function toggleComplete(index) {
    setCompleted((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  }

  function chooseActivity(index) {
    setActiveActivity(index);
  }

  const allDone = completed.length === resource.activities.length;

  return (
    <div className={`resource-page resource-page-${resource.color}`}>
      <div className="resource-page-orbit resource-page-orbit-one" />
      <div className="resource-page-orbit resource-page-orbit-two" />

      <header className="resource-hero">
        <Link to="/app/explore" className="resource-back">
          <span>←</span>
          Back to Explore
        </Link>

        <div className="resource-hero-grid">
          <div className="resource-hero-copy">
            <div className="resource-eyebrow-row">
              <span className="resource-eyebrow">
                {resource.eyebrow}
              </span>

              <span className="resource-time-pill">
                ✦ 2–5 min ideas
              </span>
            </div>

            <h1>
              {resource.title}
            </h1>

            <p>{resource.description}</p>

            <div className="resource-hero-actions">
              <button
                type="button"
                className="resource-start-button"
                onClick={() => chooseActivity(0)}
              >
                Try something now
                <span>↓</span>
              </button>

              <span className="resource-no-pressure">
                No perfect answers here.
              </span>
            </div>
          </div>

          <div className="resource-hero-art">
            <div className="resource-art-circle">
              <span className="resource-art-main">
                {resource.emoji}
              </span>

              <span className="resource-art-float resource-art-float-one">
                {resource.accent}
              </span>

              <span className="resource-art-float resource-art-float-two">
                ✦
              </span>
            </div>

            <div className="resource-art-note">
              <span>little reminder</span>
              <strong>You can take this one step at a time.</strong>
            </div>
          </div>
        </div>
      </header>

      <main className="resource-content">
        <div className="resource-section-heading">
          <div>
            <span className="resource-section-label">
              PICK ONE
            </span>

            <h2>
              What feels doable
              <span> right now?</span>
            </h2>
          </div>

          <p>
            You don't have to try everything.
            One small thing is enough.
          </p>
        </div>

        <section className="resource-activity-grid">
          {resource.activities.map((activity, index) => {
            const isComplete = completed.includes(index);
            const isActive = activeActivity === index;

            return (
              <article
                key={activity.title}
                className={`resource-activity ${
                  isActive ? "is-active" : ""
                } ${isComplete ? "is-complete" : ""}`}
              >
                <div className="resource-activity-top">
                  <span className="resource-activity-number">
                    0{index + 1}
                  </span>

                  <span className="resource-activity-tag">
                    {activity.tag}
                  </span>
                </div>

                <div className="resource-activity-icon">
                  {index === 0 && "✦"}
                  {index === 1 && "↗"}
                  {index === 2 && "☀"}
                </div>

                <h3>{activity.title}</h3>

                <p>{activity.text}</p>

                <div className="resource-activity-bottom">
                  <button
                    type="button"
                    className="resource-try-button"
                    onClick={() => chooseActivity(index)}
                  >
                    {isActive ? "You're here" : "Try this"}
                    <span>→</span>
                  </button>

                  <button
                    type="button"
                    className={`resource-done-button ${
                      isComplete ? "done" : ""
                    }`}
                    onClick={() => toggleComplete(index)}
                  >
                    {isComplete ? "✓ Done" : "Mark done"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="resource-focus">
          <div className="resource-focus-decoration">
            <span>{resource.emoji}</span>
          </div>

          <div className="resource-focus-copy">
            <span className="resource-section-label">
              YOUR LITTLE MOMENT
            </span>

            <h2>
              {activeActivity !== null
                ? resource.activities[activeActivity].title
                : "Choose one tiny thing."}
            </h2>

            <p>
              {activeActivity !== null
                ? resource.activities[activeActivity].text
                : "Pick an idea above and give it a few minutes. You can stop whenever you want."}
            </p>
          </div>

          <div className="resource-focus-side">
            <div className="resource-focus-bubble">
              <span>
                {allDone ? "✨" : "🌱"}
              </span>

              <strong>
                {allDone
                  ? "You gave yourself some space."
                  : "Small counts."}
              </strong>
            </div>

            {activeActivity !== null && (
              <button
                type="button"
                className="resource-focus-complete"
                onClick={() => toggleComplete(activeActivity)}
              >
                {completed.includes(activeActivity)
                  ? "Completed ✓"
                  : "I did this"}
              </button>
            )}
          </div>
        </section>

        <footer className="resource-footer">
          <div>
            <span className="resource-footer-mark">A</span>

            <div>
              <strong>That's enough for now.</strong>
              <span>You can always come back to this later.</span>
            </div>
          </div>

          <Link to="/app/explore">
            <Button variant="secondary">
              Explore something else
              <span>→</span>
            </Button>
          </Link>
        </footer>
      </main>
    </div>
  );
}

export default ResourceDetails;