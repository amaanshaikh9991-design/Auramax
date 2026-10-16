import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import API_BASE_URL from "../api";

import Button from "../components/Button";
import FactorCard from "../components/FactorCard";

const moods = [
  { value: "great", emoji: "😀", label: "Great", title: "Feeling good", message: "Looks like today has some good energy.", color: "yellow", accent: "#f2b84b" },
  { value: "good", emoji: "🙂", label: "Good", title: "Pretty good", message: "Nice. A good day is worth noticing.", color: "green", accent: "#75b88a" },
  { value: "okay", emoji: "😐", label: "Okay", title: "Somewhere in the middle", message: "Not every day needs to be amazing.", color: "blue", accent: "#8baed0" },
  { value: "low", emoji: "😕", label: "Low", title: "Having a slower day", message: "Thanks for being honest with yourself.", color: "peach", accent: "#e89a7c" },
  { value: "rough", emoji: "😞", label: "Rough", title: "It's been a lot", message: "You don't have to pretend everything is fine.", color: "purple", accent: "#a796c8" },
];

const factors = [
  { value: "studies", emoji: "📚", label: "Studies", description: "Classes, assignments or exams" },
  { value: "sleep", emoji: "", label: "Sleep", description: "Rest, routine or tiredness" },
  { value: "home", emoji: "🏠", label: "Home", description: "Missing home or family" },
  { value: "friends", emoji: "", label: "Friends", description: "People or relationships" },
  { value: "self", emoji: "🌱", label: "Just me", description: "How you've been feeling" },
  { value: "other", emoji: "✦", label: "Something else", description: "Anything not listed here" },
];

function CheckIn() {
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [reflection, setReflection] = useState("");
  const [showMoodHint, setShowMoodHint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const pageRef = useRef(null);
  const sceneRef = useRef(null);
  const glowRef = useRef(null);
  const emojiRef = useRef(null);

  const selectedMood = moods.find((item) => item.value === mood) || moods[1];

  useEffect(() => {
    const page = pageRef.current;
    const scene = sceneRef.current;
    const glow = glowRef.current;
    if (!page || !scene || !glow) return;

    const sceneX = gsap.quickTo(scene, "x", { duration: 0.65, ease: "power3.out" });
    const sceneY = gsap.quickTo(scene, "y", { duration: 0.65, ease: "power3.out" });
    const glowX = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3.out" });
    const glowY = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3.out" });

    function handlePointerMove(event) {
      const rect = page.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      sceneX(x * 18); sceneY(y * 12); glowX(x * -35); glowY(y * -24);
    }
    function resetPointer() { sceneX(0); sceneY(0); glowX(0); glowY(0); }

    page.addEventListener("pointermove", handlePointerMove);
    page.addEventListener("pointerleave", resetPointer);
    return () => {
      page.removeEventListener("pointermove", handlePointerMove);
      page.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  useEffect(() => {
    if (!emojiRef.current) return;
    gsap.fromTo(emojiRef.current, { scale: 0.72, rotate: -8, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.65, ease: "back.out(1.7)" });
  }, [mood, step]);

  function toggleFactor(value) {
    setSelectedFactors((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  async function nextStep() {
    if (step === 1 && !mood) { setShowMoodHint(true); return; }
    setShowMoodHint(false);
    if (step === 3) {
      setSaving(true);
      setSaveError("");
      try {
        const response = await fetch(`${API_BASE_URL}/api/check-ins`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ mood, factors: selectedFactors, reflection }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to save check-in.");
        setStep(4);
      } catch (error) {
        console.error("Check-in save error:", error);
        setSaveError(error.message);
      } finally {
        setSaving(false);
      }
      return;
    }
    if (step < 4) setStep((current) => current + 1);
  }

  function previousStep() {
    setShowMoodHint(false);
    if (step > 1) setStep((current) => current - 1);
  }

  function restart() {
    setStep(1); setMood(""); setSelectedFactors([]); setReflection(""); setShowMoodHint(false);
  }

  const progress = ((step - 1) / 3) * 100;

  return (
    <div ref={pageRef} className={`checkin-page checkin-rock-page checkin-step-${step}`} style={{ "--mood-accent": selectedMood.accent }}>
      <div className="checkin-ambient ambient-one" />
      <div className="checkin-ambient ambient-two" />
      <div ref={glowRef} className="checkin-cursor-glow" />

      <header className="checkin-rock-header">
        <div className="checkin-title-block">
          <div className="checkin-eyebrow">
            <span className="checkin-live-dot" />
            DAILY CHECK-IN
            <span className="checkin-eyebrow-line" />
            <span>2 min</span>
          </div>
          <h1>A little pause<br /><span>for how you feel.</span></h1>
          <p>No right answer. No score. Just a small moment to notice where you are.</p>
        </div>
        <div className="checkin-progress-orb">
          <div className="checkin-orb-ring">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle className="orb-track" cx="50" cy="50" r="43" />
              <circle className="orb-progress" cx="50" cy="50" r="43" style={{ strokeDashoffset: 270 - (270 * progress) / 100 }} />
            </svg>
            <div><strong>0{step}</strong><span>/ 04</span></div>
          </div>
          <small>{step === 4 ? "COMPLETE" : "YOUR MOMENT"}</small>
        </div>
      </header>

      <div className="checkin-step-strip">
        {[["01", "Mood"], ["02", "Context"], ["03", "Reflect"], ["04", "Done"]].map(([number, label], index) => {
          const active = step === index + 1;
          const passed = step > index + 1;
          return (
            <div key={number} className={`checkin-step-item ${active ? "active" : ""} ${passed ? "passed" : ""}`}>
              <span>{passed ? "✓" : number}</span>
              <label>{label}</label>
            </div>
          );
        })}
      </div>

      <div className="checkin-progress-line">
        <span style={{ width: `${Math.max(progress, 4)}%` }} />
      </div>

      <main className="checkin-stage">
        {step === 1 && (
          <section className={`mood-rock mood-${selectedMood.color}`}>
            <div ref={sceneRef} className="mood-rock-scene">
              <div className="scene-glow" />
              <div className="scene-grid" />
              <div className="scene-orbit orbit-a" />
              <div className="scene-orbit orbit-b" />
              <div className="scene-orbit orbit-c" />
              <div className="floating-symbol symbol-a"></div>
              <div className="floating-symbol symbol-b">•</div>
              <div className="floating-symbol symbol-c">✧</div>
              <div className="floating-symbol symbol-d">+</div>
              <div ref={emojiRef} className="mood-hero-emoji">{mood ? selectedMood.emoji : "🙂"}</div>
              <div className="mood-scene-copy">
                <span>{mood ? "RIGHT NOW" : "TAKE A MOMENT"}</span>
                <h2>{mood ? selectedMood.title : "How are you doing?"}</h2>
                <p>{mood ? selectedMood.message : "You don't need to figure everything out. Just check in with yourself."}</p>
              </div>
              <div className="mood-scene-note">
                <span>🌱</span>
                <div><strong>This moment can change.</strong><small>It doesn't define your whole day.</small></div>
              </div>
            </div>

            <div className="mood-rock-choices">
              <div className="choice-heading-rock">
                <div>
                  <span>01 · YOUR MOOD</span>
                  <h2>Pick what feels<br /><em>closest.</em></h2>
                </div>
                <div className="first-instinct">
                  <span>✦</span>
                  <small>Trust your<br />first instinct</small>
                </div>
              </div>
              <div className="mood-rock-grid">
                {moods.map((item, index) => {
                  const selected = mood === item.value;
                  return (
                    <button key={item.value} type="button" className={`mood-rock-option ${selected ? "selected" : ""}`} style={{ "--item-accent": item.accent }} onClick={() => { setMood(item.value); setShowMoodHint(false); }}>
                      <span className="mood-option-number">0{index + 1}</span>
                      <span className="mood-option-emoji">{item.emoji}</span>
                      <span className="mood-option-copy"><strong>{item.label}</strong><small>{item.title}</small></span>
                      <span className="mood-option-arrow">{selected ? "✓" : ""}</span>
                    </button>
                  );
                })}
              </div>
              {showMoodHint && <div className="checkin-hint"><span>☀</span> Pick one that feels closest — there is no wrong choice.</div>}
              <div className="checkin-action-row">
                <span className="private-note">🔒 <span>Personal space · not a test</span></span>
                <Button onClick={nextStep} disabled={!mood}>Continue <span>→</span></Button>
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="context-rock">
            <div className="context-intro">
              <div className="context-number">02</div>
              <span>WHAT SHAPED IT?</span>
              <h2>Give your mood<br />a little <em>context.</em></h2>
              <p>Maybe something happened. Maybe nothing did. Choose anything that feels connected — or skip it completely.</p>
              <div className="context-orbit-art">
                <div className="context-sun">✦</div>
                <div className="context-ring ring-1" />
                <div className="context-ring ring-2" />
                <span>you</span>
              </div>
              <small>{selectedFactors.length ? `${selectedFactors.length} ${selectedFactors.length === 1 ? "thing" : "things"} selected` : "You can choose more than one"}</small>
            </div>
            <div className="context-choice">
              <div className="context-choice-top">
                <div><span>WHAT'S TAKING UP SPACE?</span><h3>Tap anything that feels familiar.</h3></div>
                <div className="selection-count">{String(selectedFactors.length).padStart(2, "0")}</div>
              </div>
              <div className="factor-rock-grid">
                {factors.map((factor, index) => {
                  const selected = selectedFactors.includes(factor.value);
                  return (
                    <div key={factor.value} className={`factor-rock-wrap ${selected ? "is-selected" : ""}`}>
                      <span className="factor-index">0{index + 1}</span>
                      <FactorCard emoji={factor.emoji} label={factor.label} description={factor.description} selected={selected} onClick={() => toggleFactor(factor.value)} />
                    </div>
                  );
                })}
              </div>
              <div className="checkin-action-row">
                <Button variant="secondary" onClick={previousStep}>← Back</Button>
                <Button onClick={nextStep}>{selectedFactors.length ? "That's it" : "Skip this step"}<span>→</span></Button>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="reflection-rock">
            <div className="reflection-visual">
              <div className="reflection-paper">
                <div className="paper-tape" />
                <div className="paper-label">A THOUGHT</div>
                <div className="paper-lines"><span /><span /><span /><span /></div>
                <div className="paper-doodle doodle-one">✦</div>
                <div className="paper-doodle doodle-two">〰</div>
                <div className="paper-doodle doodle-three">· ·</div>
              </div>
              <div className="reflection-floating-card">
                <span>03</span><strong>OPTIONAL</strong><small>Nothing to get right.</small>
              </div>
            </div>
            <div className="reflection-rock-content">
              <span className="section-kicker">03 · YOUR SPACE</span>
              <h2>Give the<br />thought <em>a place.</em></h2>
              <p>A few words can help you notice what is going on. Write whatever comes naturally — or leave it blank.</p>
              <div className="reflection-input-shell">
                <div className="input-top-line"><span>PRIVATE NOTE</span><span>{reflection.length}/500</span></div>
                <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="What's on your mind?" maxLength={500} autoFocus />
                <div className="input-bottom-line"><span>✎ No perfect answer needed.</span><span>⌘</span></div>
              </div>
              <div className="reflection-rock-actions">
                <Button variant="secondary" onClick={previousStep}>← Back</Button>
                <Button onClick={nextStep} disabled={saving}>
                  {saving ? "Saving..." : "Finish check-in"} <span>→</span>
                </Button>
                {saveError && <p className="checkin-save-error">{saveError}</p>}
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="complete-rock">
            <div className="complete-visual-rock">
              <div className="completion-halo halo-one" />
              <div className="completion-halo halo-two" />
              <div className="completion-halo halo-three" />
              <div className="completion-emoji">{selectedMood.emoji}</div>
              <span className="completion-spark spark-1">✦</span>
              <span className="completion-spark spark-2">✧</span>
              <span className="completion-spark spark-3">·</span>
            </div>
            <div className="complete-rock-content">
              <span className="section-kicker">04 · CHECK-IN COMPLETE</span>
              <h2>You made a little<br /><em>space for yourself.</em></h2>
              <p>You marked today as <strong>{selectedMood.label.toLowerCase()}</strong>. Taking a moment to notice how you feel already counts.</p>
              <div className="complete-summary">
                <div className="summary-main"><small>YOUR MOOD</small><strong>{selectedMood.emoji} {selectedMood.label}</strong></div>
                {selectedFactors.length > 0 && (
                  <div className="summary-block">
                    <small>WHAT SHAPED IT</small>
                    <div className="summary-tags">{selectedFactors.map((value) => { const factor = factors.find((item) => item.value === value); return <span key={value}>{factor?.emoji} {factor?.label}</span>; })}</div>
                  </div>
                )}
                {reflection.trim() && <div className="summary-block"><small>YOUR NOTE</small><p>“{reflection}”</p></div>}
              </div>
              <div className="complete-rock-actions">
                <Button variant="secondary" onClick={restart}>Check in again</Button>
                <Link
                  to="/app/chat"
                  state={{
                    initialMessage: `I just checked in as ${selectedMood.label.toLowerCase()}${selectedFactors.length ? `, with ${selectedFactors.join(", ")} on my mind` : ""}. ${
                      reflection.trim()
                        ? `My private note was: "${reflection.trim()}". `
                        : ""
                    }Please help me reflect on this check-in and suggest one gentle, practical next step.`,
                  }}
                >
                  <Button variant="secondary">Talk about this with AI</Button>
                </Link>
                <Link to="/app/journey"><Button>See My Journey <span>→</span></Button></Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="checkin-rock-footer">
        <span>✦</span> This isn't a test. It's just a moment for you. <span>✦</span>
      </footer>

      <style>{`
        /* ===== CORE RESET & VIEWPORT LOCK ===== */
        .checkin-rock-page {
          position: relative;
          width: 100%;
          height: 100vh;
          margin: 0;
          box-sizing: border-box;
          overflow: hidden; /* NO SCROLLING */
          padding: 24px 48px 20px;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          background: #f8f5ee;
        }

        .checkin-rock-page::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -4;
          background: radial-gradient(circle at 88% 8%, rgba(177, 209, 180, 0.25), transparent 25%),
                      radial-gradient(circle at 8% 86%, rgba(196, 183, 220, 0.18), transparent 27%);
        }

        .checkin-ambient { position: absolute; z-index: -3; width: 260px; height: 260px; border-radius: 50%; filter: blur(3px); pointer-events: none; animation: checkinAmbient 9s ease-in-out infinite alternate; }
        .ambient-one { top: 17%; right: -130px; background: rgba(117, 184, 138, 0.14); }
        .ambient-two { bottom: -150px; left: 18%; background: rgba(167, 150, 200, 0.14); animation-delay: -4s; }
        .checkin-cursor-glow { position: absolute; z-index: -2; width: 300px; height: 300px; top: 28%; left: 38%; border-radius: 50%; background: radial-gradient(circle, rgba(255, 255, 255, 0.42), transparent 68%); pointer-events: none; filter: blur(8px); }

        /* ===== FLEX HEADER & FOOTER ===== */
        .checkin-rock-header { flex: 0 0 auto; display: flex; align-items: flex-start; justify-content: space-between; gap: 30px; width: 100%; margin: 0 0 16px; }
        .checkin-title-block { max-width: 760px; }
        .checkin-eyebrow, .section-kicker { display: flex; align-items: center; gap: 9px; font-size: 10px; font-weight: 800; letter-spacing: 0.18em; color: #647064; }
        .checkin-eyebrow-line { width: 32px; height: 1px; background: #bdc4b9; }
        .checkin-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #73ae82; box-shadow: 0 0 0 5px rgba(115, 174, 130, 0.11); animation: checkinPulse 2s infinite; }
        .checkin-title-block h1 { margin: 10px 0 8px; font-size: clamp(32px, 3.2vw, 52px); line-height: 0.96; letter-spacing: -0.055em; color: #243029; font-weight: 700; }
        .checkin-title-block h1 span { color: #73987b; font-style: italic; font-weight: 500; }
        .checkin-title-block p { max-width: 570px; margin: 0; color: #778078; font-size: 13px; line-height: 1.5; }

        .checkin-progress-orb { display: flex; flex-direction: column; align-items: center; gap: 7px; min-width: 108px; padding-top: 4px; }
        .checkin-orb-ring { position: relative; width: 84px; height: 84px; }
        .checkin-orb-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .orb-track, .orb-progress { fill: none; stroke-width: 3; }
        .orb-track { stroke: #e4e2d9; }
        .orb-progress { stroke: var(--mood-accent); stroke-linecap: round; stroke-dasharray: 270; transition: stroke-dashoffset 0.6s cubic-bezier(.22,1,.36,1), stroke 0.4s ease; }
        .checkin-orb-ring > div { position: absolute; inset: 0; display: flex; align-items: baseline; justify-content: center; align-self: center; padding-top: 31px; }
        .checkin-orb-ring strong { font-size: 20px; color: #26332b; }
        .checkin-orb-ring span { margin-left: 2px; font-size: 9px; color: #91978f; }
        .checkin-progress-orb small { font-size: 8px; font-weight: 800; letter-spacing: 0.16em; color: #8b9189; }

        /* ===== STEPS & PROGRESS ===== */
        .checkin-step-strip { flex: 0 0 auto; width: 100%; margin: 0 0 8px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .checkin-step-item { display: flex; align-items: center; gap: 9px; color: #a2a69f; font-size: 11px; font-weight: 700; transition: color 0.35s ease, transform 0.35s ease; }
        .checkin-step-item span { display: grid; place-items: center; width: 27px; height: 27px; border: 1px solid #dddcd3; border-radius: 50%; background: rgba(255,255,255,0.55); font-size: 9px; transition: all 0.35s ease; }
        .checkin-step-item.active { color: #344138; transform: translateY(-1px); }
        .checkin-step-item.active span { border-color: var(--mood-accent); background: var(--mood-accent); color: white; box-shadow: 0 7px 20px color-mix(in srgb, var(--mood-accent) 30%, transparent); }
        .checkin-step-item.passed { color: #728578; }
        .checkin-step-item.passed span { border-color: #a8c0ac; color: #66816c; background: #edf5ee; }

        .checkin-progress-line { flex: 0 0 auto; width: 100%; height: 2px; margin: 0 0 16px; overflow: hidden; background: #e7e4db; }
        .checkin-progress-line span { display: block; height: 100%; background: linear-gradient(90deg, #83a98a, var(--mood-accent)); transition: width 0.65s cubic-bezier(.22,1,.36,1); }

        /* ===== MAIN STAGE (FLEX GROW) ===== */
        .checkin-stage { flex: 1 1 auto; width: 100%; min-height: 0; overflow: hidden; position: relative; }

        .mood-rock, .context-rock, .reflection-rock, .complete-rock {
          width: 100%; height: 100%; min-height: 0;
          display: grid; align-items: center;
          animation: checkinStageIn 0.65s cubic-bezier(.22,1,.36,1);
        }

        /* Step 1: Mood */
        .mood-rock { grid-template-columns: 1fr 1.2fr; gap: 32px; }
        .mood-rock-scene {
          width: 100%; height: 100%; min-height: 0;
          position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: center;
          padding: 32px; border-radius: 34px;
          background: radial-gradient(circle at 50% 44%, color-mix(in srgb, var(--mood-accent) 27%, white), transparent 27%), linear-gradient(145deg, #e9f1e7, #f3eee4 68%, #ece7f2);
          box-shadow: inset 0 1px rgba(255,255,255,.75), 0 24px 70px rgba(54, 67, 55, 0.08);
          transition: background 0.55s ease; will-change: transform;
        }
        .scene-glow { position: absolute; width: 310px; height: 310px; top: 22%; left: 50%; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(circle, color-mix(in srgb, var(--mood-accent) 38%, transparent), transparent 68%); filter: blur(2px); opacity: 0.9; animation: sceneGlow 5s ease-in-out infinite; }
        .scene-grid { position: absolute; inset: 0; opacity: 0.25; background-image: linear-gradient(rgba(68,83,70,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(68,83,70,.06) 1px, transparent 1px); background-size: 38px 38px; mask-image: radial-gradient(circle at center, black, transparent 72%); }
        .scene-orbit { position: absolute; left: 50%; top: 43%; border: 1px solid rgba(75, 94, 78, 0.12); border-radius: 50%; transform: translate(-50%, -50%); }
        .orbit-a { width: 250px; height: 250px; animation: orbitRotate 16s linear infinite; }
        .orbit-b { width: 360px; height: 190px; transform: translate(-50%, -50%) rotate(26deg); animation: orbitRotateReverse 19s linear infinite; }
        .orbit-c { width: 420px; height: 420px; opacity: 0.55; animation: orbitRotate 27s linear infinite; }
        .floating-symbol { position: absolute; color: color-mix(in srgb, var(--mood-accent) 70%, #536456); font-weight: 800; opacity: 0.72; animation: symbolFloat 4s ease-in-out infinite; }
        .symbol-a { top: 19%; right: 19%; font-size: 20px; } .symbol-b { top: 33%; left: 15%; font-size: 22px; animation-delay: -1s; }
        .symbol-c { bottom: 29%; right: 17%; font-size: 17px; animation-delay: -2.2s; } .symbol-d { bottom: 19%; left: 23%; font-size: 13px; animation-delay: -3s; }
        .mood-hero-emoji { position: relative; z-index: 2; width: 120px; height: 120px; display: grid; place-items: center; align-self: center; margin-bottom: 24px; border-radius: 48% 52% 45% 55%; background: rgba(255,255,255,.45); border: 1px solid rgba(255,255,255,.7); box-shadow: 0 25px 60px rgba(59, 75, 62, .12); font-size: 64px; backdrop-filter: blur(7px); animation: emojiBreathe 4s ease-in-out infinite; }
        .mood-scene-copy { position: relative; z-index: 2; text-align: center; }
        .mood-scene-copy > span { font-size: 9px; font-weight: 800; letter-spacing: 0.2em; color: #7b867d; }
        .mood-scene-copy h2 { margin: 9px 0 8px; color: #2c3a30; font-size: clamp(24px, 2.5vw, 36px); line-height: 1; letter-spacing: -0.04em; }
        .mood-scene-copy p { max-width: 360px; margin: 0 auto; color: #718078; font-size: 12px; line-height: 1.5; }
        .mood-scene-note { position: absolute; z-index: 2; left: 28px; right: 28px; bottom: 25px; display: flex; align-items: center; gap: 11px; padding: 12px 15px; border: 1px solid rgba(255,255,255,.7); border-radius: 16px; background: rgba(255,255,255,.4); backdrop-filter: blur(10px); }
        .mood-scene-note > span { font-size: 20px; } .mood-scene-note strong, .mood-scene-note small { display: block; }
        .mood-scene-note strong { color: #4c5c50; font-size: 11px; } .mood-scene-note small { margin-top: 2px; color: #879087; font-size: 9px; }

        .mood-rock-choices { width: 100%; height: 100%; min-height: 0; display: flex; flex-direction: column; justify-content: center; padding: 20px 4px 20px 0; overflow: hidden; }
        .choice-heading-rock { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
        .choice-heading-rock > div:first-child > span { font-size: 9px; font-weight: 800; letter-spacing: 0.17em; color: #7f897f; }
        .choice-heading-rock h2 { margin: 9px 0 0; color: #29372e; font-size: clamp(28px, 2.8vw, 40px); line-height: .98; letter-spacing: -0.05em; }
        .choice-heading-rock h2 em, .context-intro h2 em, .reflection-rock-content h2 em, .complete-rock-content h2 em { color: #71987a; font-family: Georgia, serif; font-weight: 400; }
        .first-instinct { display: flex; align-items: center; gap: 8px; padding-bottom: 4px; }
        .first-instinct span { font-size: 22px; color: #d7a84c; } .first-instinct small { color: #929991; font-size: 9px; line-height: 1.35; }
        
        .mood-rock-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; flex: 1; min-height: 0; }
        .mood-rock-option { position: relative; min-height: 0; height: 100%; display: grid; grid-template-columns: 24px 48px 1fr 22px; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid #e1e0d8; border-radius: 18px; background: rgba(255,255,255,.56); color: inherit; text-align: left; cursor: pointer; overflow: hidden; transition: transform .3s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .3s ease, background .3s ease; }
        .mood-rock-option::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--item-accent); transform: scaleY(0); transform-origin: center; transition: transform .3s ease; }
        .mood-rock-option:hover { transform: translateY(-4px) rotate(-.35deg); border-color: color-mix(in srgb, var(--item-accent) 48%, #ddd); background: white; box-shadow: 0 18px 38px rgba(55, 67, 57, .09); }
        .mood-rock-option.selected { transform: translateY(-2px); border-color: var(--item-accent); background: color-mix(in srgb, var(--item-accent) 10%, white); box-shadow: 0 18px 40px color-mix(in srgb, var(--item-accent) 18%, transparent); }
        .mood-rock-option.selected::before { transform: scaleY(1); }
        .mood-option-number { align-self: start; padding-top: 3px; color: #b0b4ad; font-size: 8px; font-weight: 800; }
        .mood-option-emoji { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: rgba(255,255,255,.7); font-size: 28px; transition: transform .3s ease; }
        .mood-rock-option:hover .mood-option-emoji { transform: rotate(-6deg) scale(1.08); }
        .mood-option-copy strong, .mood-option-copy small { display: block; }
        .mood-option-copy strong { color: #344138; font-size: 12px; } .mood-option-copy small { margin-top: 4px; color: #929992; font-size: 9px; }
        .mood-option-arrow { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; color: #9ba29a; font-size: 11px; transition: all .3s ease; }
        .mood-rock-option.selected .mood-option-arrow { color: white; background: var(--item-accent); }

        .checkin-hint { display: flex; align-items: center; gap: 8px; margin-top: 12px; color: #8b7357; font-size: 11px; animation: checkinHint .3s ease; }
        .checkin-action-row { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 16px; flex: 0 0 auto; }
        .private-note { color: #909890; font-size: 10px; }

        /* Step 2: Context */
        .context-rock { grid-template-columns: 0.75fr 1.25fr; gap: 40px; }
        .context-intro { position: relative; width: 100%; height: 100%; min-height: 0; display: flex; flex-direction: column; justify-content: center; padding: 40px 20px 40px 0; }
        .context-number { position: absolute; top: 4px; right: 18px; color: #d8d7ce; font-size: 105px; font-weight: 800; letter-spacing: -0.1em; line-height: .8; user-select: none; }
        .context-intro > span { font-size: 9px; font-weight: 800; letter-spacing: .18em; color: #7e887f; }
        .context-intro h2 { position: relative; margin: 12px 0 15px; color: #29372e; font-size: clamp(32px, 3.5vw, 50px); line-height: .93; letter-spacing: -.06em; }
        .context-intro p { max-width: 390px; color: #778179; font-size: 13px; line-height: 1.6; }
        .context-orbit-art { position: relative; width: 160px; height: 160px; margin: 24px 0 18px 20px; display: grid; place-items: center; border-radius: 50%; background: radial-gradient(circle, rgba(117,184,138,.2), transparent 62%); }
        .context-orbit-art span { position: relative; z-index: 2; display: grid; place-items: center; width: 43px; height: 43px; border-radius: 50%; background: #799c80; color: white; font-size: 9px; font-weight: 800; box-shadow: 0 12px 30px rgba(92, 130, 99, .22); }
        .context-sun { position: absolute; z-index: 3; top: 9px; right: 16px; color: #d6a745; animation: symbolFloat 3s ease-in-out infinite; }
        .context-ring { position: absolute; border: 1px dashed #bac7b9; border-radius: 50%; }
        .ring-1 { width: 120px; height: 120px; animation: orbitRotate 9s linear infinite; } .ring-2 { width: 160px; height: 88px; transform: rotate(35deg); animation: orbitRotateReverse 12s linear infinite; }
        .context-intro > small { color: #8e978f; font-size: 10px; }
        .context-choice { width: 100%; height: 100%; min-height: 0; display: flex; flex-direction: column; padding: 24px; border: 1px solid #e4e1d8; border-radius: 28px; background: rgba(255,255,255,.55); box-shadow: 0 22px 65px rgba(58, 68, 58, .07); overflow: hidden; }
        .context-choice-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex: 0 0 auto; }
        .context-choice-top h3 { margin: 8px 0 0; color: #354139; font-size: 16px; font-weight: 600; }
        .selection-count { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; background: #edf4ec; color: #66816c; font-size: 13px; font-weight: 800; }
        .factor-rock-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; flex: 1; min-height: 0; overflow-y: auto; }
        .factor-rock-wrap { position: relative; transition: transform .3s ease; }
        .factor-rock-wrap:hover { transform: translateY(-4px); } .factor-rock-wrap.is-selected { transform: translateY(-3px); }
        .factor-index { position: absolute; z-index: 3; top: 9px; right: 12px; color: #b0b6ae; font-size: 8px; font-weight: 800; pointer-events: none; }
        .factor-rock-wrap.is-selected .factor-index { color: #709279; }

        /* Step 3: Reflection */
        .reflection-rock { grid-template-columns: .85fr 1.15fr; gap: 50px; }
        .reflection-visual { width: 100%; height: 100%; min-height: 0; position: relative; display: grid; place-items: center; background: radial-gradient(circle at center, rgba(182, 199, 180, .27), transparent 58%), linear-gradient(145deg, rgba(232,239,229,.7), rgba(239,231,239,.5)); border-radius: 36px; overflow: hidden; }
        .reflection-visual::after { content: "WRITE · NOTICE · RELEASE"; position: absolute; bottom: 25px; left: 30px; color: #9ba49c; font-size: 8px; letter-spacing: .2em; }
        .reflection-paper { position: relative; width: 260px; min-height: 300px; padding: 50px 28px 28px; transform: rotate(-4deg); border-radius: 4px 4px 10px 5px; background: #fffdf7; box-shadow: 22px 28px 45px rgba(65, 71, 62, .16); animation: paperFloat 5s ease-in-out infinite; }
        .paper-tape { position: absolute; top: -13px; left: 80px; width: 100px; height: 30px; transform: rotate(3deg); background: rgba(226, 205, 155, .5); }
        .paper-label { color: #a0a69f; font-size: 8px; font-weight: 800; letter-spacing: .2em; }
        .paper-lines { margin-top: 40px; } .paper-lines span { display: block; height: 1px; margin: 28px 0; background: #dfe2da; }
        .paper-doodle { position: absolute; color: #82a487; } .doodle-one { top: 80px; right: 35px; } .doodle-two { bottom: 73px; left: 35px; font-size: 24px; transform: rotate(-10deg); } .doodle-three { bottom: 35px; right: 30px; font-size: 13px; }
        .reflection-floating-card { position: absolute; right: 10%; bottom: 16%; display: grid; gap: 2px; min-width: 130px; padding: 12px; border: 1px solid rgba(255,255,255,.75); border-radius: 16px; background: rgba(255,255,255,.7); box-shadow: 0 14px 35px rgba(72, 78, 70, .08); backdrop-filter: blur(10px); animation: floatSmall 4s ease-in-out infinite; }
        .reflection-floating-card span { color: #a0a79f; font-size: 8px; font-weight: 800; } .reflection-floating-card strong { color: #607665; font-size: 10px; letter-spacing: .08em; } .reflection-floating-card small { color: #9ca29d; font-size: 8px; }
        .reflection-rock-content { width: 100%; height: 100%; min-height: 0; display: flex; flex-direction: column; justify-content: center; max-width: 600px; }
        .reflection-rock-content h2 { margin: 13px 0 14px; color: #29372e; font-size: clamp(36px, 3.8vw, 56px); line-height: .9; letter-spacing: -.065em; }
        .reflection-rock-content > p { max-width: 540px; color: #778179; font-size: 13px; line-height: 1.6; }
        .reflection-input-shell { margin-top: 20px; padding: 16px 18px 12px; border: 1px solid #dcded6; border-radius: 23px; background: rgba(255,255,255,.75); box-shadow: 0 18px 45px rgba(60, 70, 62, .07); transition: border-color .3s ease, box-shadow .3s ease, transform .3s ease; flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .reflection-input-shell:focus-within { border-color: #9bb39d; box-shadow: 0 20px 50px rgba(84, 111, 89, .11); transform: translateY(-2px); }
        .input-top-line, .input-bottom-line { display: flex; align-items: center; justify-content: space-between; color: #9ca39c; font-size: 8px; font-weight: 800; letter-spacing: .14em; flex: 0 0 auto; }
        .reflection-input-shell textarea { width: 100%; flex: 1; min-height: 0; margin: 14px 0 10px; padding: 0; resize: none; border: 0; outline: 0; background: transparent; color: #3d4b42; font: inherit; font-size: 14px; line-height: 1.6; }
        .reflection-input-shell textarea::placeholder { color: #b5bbb4; }
        .input-bottom-line { font-size: 8px; letter-spacing: normal; font-weight: 500; }
        .reflection-rock-actions, .complete-rock-actions { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 20px; flex: 0 0 auto; }

        /* Step 4: Complete */
        .complete-rock { grid-template-columns: .9fr 1.1fr; gap: 50px; }
        .complete-visual-rock { width: 100%; height: 100%; min-height: 0; position: relative; display: grid; place-items: center; overflow: hidden; border-radius: 38px; background: radial-gradient(circle, color-mix(in srgb, var(--mood-accent) 28%, white), transparent 56%), linear-gradient(145deg, #edf3ea, #f1eaf1); }
        .completion-halo { position: absolute; border: 1px solid color-mix(in srgb, var(--mood-accent) 30%, transparent); border-radius: 50%; animation: completionSpin 14s linear infinite; }
        .halo-one { width: 220px; height: 220px; } .halo-two { width: 330px; height: 190px; transform: rotate(30deg); animation-duration: 18s; animation-direction: reverse; } .halo-three { width: 410px; height: 410px; animation-duration: 24s; opacity: .55; }
        .completion-emoji { position: relative; z-index: 2; display: grid; place-items: center; width: 140px; height: 140px; border-radius: 50%; background: rgba(255,255,255,.62); border: 1px solid rgba(255,255,255,.85); box-shadow: 0 30px 70px rgba(65, 76, 65, .13); font-size: 72px; animation: completionPop .8s cubic-bezier(.22,1,.36,1), emojiBreathe 4s 1s ease-in-out infinite; }
        .completion-spark { position: absolute; color: color-mix(in srgb, var(--mood-accent) 75%, #526454); animation: sparkFloat 3.5s ease-in-out infinite; }
        .spark-1 { top: 28%; left: 28%; font-size: 20px; } .spark-2 { top: 35%; right: 25%; animation-delay: -1.2s; } .spark-3 { bottom: 28%; left: 35%; animation-delay: -2.2s; }
        .complete-rock-content { width: 100%; height: 100%; min-height: 0; display: flex; flex-direction: column; justify-content: center; max-width: 600px; }
        .complete-rock-content h2 { margin: 14px 0; color: #29372e; font-size: clamp(34px, 3.5vw, 52px); line-height: .93; letter-spacing: -.06em; }
        .complete-rock-content > p { max-width: 560px; color: #778179; font-size: 13px; line-height: 1.6; }
        .complete-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
        .summary-main, .summary-block { min-height: 70px; padding: 14px; border: 1px solid #e0e1da; border-radius: 17px; background: rgba(255,255,255,.56); }
        .summary-main small, .summary-block small { display: block; color: #9ca39c; font-size: 8px; font-weight: 800; letter-spacing: .15em; }
        .summary-main strong { display: block; margin-top: 9px; color: #415047; font-size: 13px; }
        .summary-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
        .summary-tags span { padding: 6px 8px; border-radius: 99px; background: #edf3eb; color: #657768; font-size: 9px; }
        .summary-block:last-child { grid-column: 1 / -1; }
        .summary-block p { margin: 8px 0 0; color: #667169; font-size: 11px; line-height: 1.55; }

        /* Footer */
        .checkin-rock-footer { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; gap: 9px; margin: 16px auto 0; color: #a0a69f; font-size: 9px; letter-spacing: .04em; }
        .checkin-rock-footer span { color: #c8a34e; font-size: 10px; }

        /* ===== ANIMATIONS ===== */
        @keyframes checkinStageIn { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes checkinAmbient { from { transform: translate3d(-12px, 8px, 0) scale(.95); } to { transform: translate3d(12px, -12px, 0) scale(1.08); } }
        @keyframes checkinPulse { 0%, 100% { box-shadow: 0 0 0 4px rgba(115,174,130,.08); } 50% { box-shadow: 0 0 0 8px rgba(115,174,130,.02); } }
        @keyframes sceneGlow { 0%, 100% { transform: translateX(-50%) scale(.94); opacity: .65; } 50% { transform: translateX(-50%) scale(1.07); opacity: 1; } }
        @keyframes orbitRotate { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes orbitRotateReverse { to { transform: translate(-50%, -50%) rotate(-360deg); } }
        @keyframes symbolFloat { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-10px) rotate(8deg); } }
        @keyframes emojiBreathe { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-7px) rotate(2deg); } }
        @keyframes checkinHint { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes paperFloat { 0%, 100% { transform: rotate(-4deg) translateY(0); } 50% { transform: rotate(-2deg) translateY(-8px); } }
        @keyframes floatSmall { 0%, 100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-7px) rotate(-1deg); } }
        @keyframes completionSpin { to { transform: rotate(360deg); } }
        @keyframes completionPop { from { transform: scale(.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes sparkFloat { 0%, 100% { transform: translateY(0) scale(1); opacity: .55; } 50% { transform: translateY(-11px) scale(1.15); opacity: 1; } }

        /* ===== RESPONSIVE (Mobile/Tablet allow scroll if needed) ===== */
        @media (max-width: 1050px) {
          .checkin-rock-page { height: auto; min-height: 100vh; overflow-y: auto; padding: 28px 26px 25px; }
          .mood-rock, .context-rock, .reflection-rock, .complete-rock { grid-template-columns: 1fr; gap: 28px; height: auto; min-height: auto; }
          .mood-rock-scene { min-height: 400px; }
          .context-intro { min-height: auto; padding: 25px 0 0; }
          .context-orbit-art { display: none; }
          .reflection-visual, .complete-visual-rock { min-height: 320px; }
        }
        @media (max-width: 700px) {
          .checkin-rock-page { padding: 22px 15px 22px; }
          .checkin-title-block h1 { font-size: 32px; }
          .mood-rock-grid, .factor-rock-grid { grid-template-columns: 1fr; }
          .checkin-action-row, .reflection-rock-actions, .complete-rock-actions { flex-direction: column; align-items: stretch; }
          .private-note { order: 2; }
        }

        /* ===== DARK MODE ===== */
        [data-theme="dark"] .checkin-rock-page {
          background: #0f1812;
          color: #e4ede5;
        }
        [data-theme="dark"] .checkin-rock-page::before {
          background: radial-gradient(circle at 88% 8%, rgba(80,140,95,0.18), transparent 25%),
                      radial-gradient(circle at 8% 86%, rgba(80,65,110,0.15), transparent 27%);
        }

        /* ambient blobs */
        [data-theme="dark"] .ambient-one { background: rgba(80,140,95,0.12); }
        [data-theme="dark"] .ambient-two { background: rgba(100,80,140,0.10); }
        [data-theme="dark"] .checkin-cursor-glow { background: radial-gradient(circle, rgba(255,255,255,0.07), transparent 68%); }

        /* header text */
        [data-theme="dark"] .checkin-eyebrow { color: #7fa890; }
        [data-theme="dark"] .checkin-eyebrow-line { background: #2e4235; }
        [data-theme="dark"] .checkin-live-dot { background: #6fa87e; box-shadow: 0 0 0 5px rgba(111,168,126,0.15); }
        [data-theme="dark"] .checkin-title-block h1 { color: #e4ede5; }
        [data-theme="dark"] .checkin-title-block h1 span { color: #6fa87e; }
        [data-theme="dark"] .checkin-title-block p { color: #8ba693; }
        [data-theme="dark"] .orb-track { stroke: #2a3d2e; }
        [data-theme="dark"] .checkin-orb-ring strong { color: #e4ede5; }
        [data-theme="dark"] .checkin-orb-ring span { color: #5e7866; }
        [data-theme="dark"] .checkin-progress-orb small { color: #5e7866; }

        /* step strip */
        [data-theme="dark"] .checkin-step-item { color: #4a6054; }
        [data-theme="dark"] .checkin-step-item span { border-color: #2e4235; background: rgba(255,255,255,0.05); color: #5e7866; }
        [data-theme="dark"] .checkin-step-item.active { color: #e4ede5; }
        [data-theme="dark"] .checkin-step-item.passed { color: #6fa87e; }
        [data-theme="dark"] .checkin-step-item.passed span { border-color: #3d6048; color: #6fa87e; background: #1e3327; }
        [data-theme="dark"] .checkin-progress-line { background: #1e2c22; }

        /* mood scene (left panel) */
        [data-theme="dark"] .mood-rock-scene {
          background: radial-gradient(circle at 50% 44%, color-mix(in srgb, var(--mood-accent) 18%, #182118), transparent 27%),
                      linear-gradient(145deg, #1a2c1e, #1e2a24 68%, #1e1e2a);
          box-shadow: inset 0 1px rgba(255,255,255,.05), 0 24px 70px rgba(0,0,0,0.35);
        }
        [data-theme="dark"] .scene-grid { opacity: 0.15; background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px); }
        [data-theme="dark"] .scene-orbit { border-color: rgba(255,255,255,0.07); }
        [data-theme="dark"] .mood-hero-emoji { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.18); }
        [data-theme="dark"] .mood-scene-copy > span { color: #5e7866; }
        [data-theme="dark"] .mood-scene-copy h2 { color: #e4ede5; }
        [data-theme="dark"] .mood-scene-copy p { color: #8ba693; }
        [data-theme="dark"] .mood-scene-note { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.12); }
        [data-theme="dark"] .mood-scene-note strong { color: #c4d4c8; }
        [data-theme="dark"] .mood-scene-note small { color: #5e7866; }

        /* mood choices (right panel) */
        [data-theme="dark"] .choice-heading-rock > div:first-child > span { color: #5e7866; }
        [data-theme="dark"] .choice-heading-rock h2 { color: #e4ede5; }
        [data-theme="dark"] .choice-heading-rock h2 em { color: #6fa87e; }
        [data-theme="dark"] .first-instinct small { color: #5e7866; }

        [data-theme="dark"] .mood-rock-option {
          background: rgba(255,255,255,.05);
          border-color: #2a3d2e;
          color: #e4ede5;
        }
        [data-theme="dark"] .mood-rock-option:hover {
          background: rgba(255,255,255,.10);
          border-color: color-mix(in srgb, var(--item-accent) 55%, #2a3d2e);
          box-shadow: 0 18px 38px rgba(0,0,0,0.3);
        }
        [data-theme="dark"] .mood-rock-option.selected {
          background: color-mix(in srgb, var(--item-accent) 12%, #182118);
          border-color: var(--item-accent);
          box-shadow: 0 18px 40px color-mix(in srgb, var(--item-accent) 14%, transparent);
        }
        [data-theme="dark"] .mood-option-number { color: #4a6054; }
        [data-theme="dark"] .mood-option-emoji { background: rgba(255,255,255,.10); }
        [data-theme="dark"] .mood-option-copy strong { color: #e4ede5; }
        [data-theme="dark"] .mood-option-copy small  { color: #5e7866; }
        [data-theme="dark"] .mood-option-arrow { color: #3d5548; }
        [data-theme="dark"] .checkin-hint { color: #c4a875; }
        [data-theme="dark"] .private-note { color: #4a6054; }

        /* step 2 — context */
        [data-theme="dark"] .context-number { color: #1e2c22; }
        [data-theme="dark"] .context-intro > span { color: #5e7866; }
        [data-theme="dark"] .context-intro h2 { color: #e4ede5; }
        [data-theme="dark"] .context-intro h2 em { color: #6fa87e; }
        [data-theme="dark"] .context-intro p { color: #8ba693; }
        [data-theme="dark"] .context-orbit-art span { background: #4a7a58; }
        [data-theme="dark"] .context-ring { border-color: #2e4235; }
        [data-theme="dark"] .context-intro > small { color: #5e7866; }

        [data-theme="dark"] .context-choice {
          background: rgba(255,255,255,.04);
          border-color: #2a3d2e;
          box-shadow: 0 22px 65px rgba(0,0,0,0.3);
        }
        [data-theme="dark"] .context-choice-top > div > span { color: #5e7866; }
        [data-theme="dark"] .context-choice-top h3 { color: #e4ede5; }
        [data-theme="dark"] .selection-count { background: #1e3327; color: #6fa87e; }
        [data-theme="dark"] .factor-index { color: #3d5548; }
        [data-theme="dark"] .factor-rock-wrap.is-selected .factor-index { color: #6fa87e; }

        /* step 3 — reflection */
        [data-theme="dark"] .reflection-visual {
          background: radial-gradient(circle at center, rgba(80,140,95,.18), transparent 58%),
                      linear-gradient(145deg, rgba(26,40,30,.8), rgba(30,24,40,.6));
        }
        [data-theme="dark"] .reflection-visual::after { color: #3d5548; }
        [data-theme="dark"] .reflection-paper { background: #1c2820; box-shadow: 22px 28px 45px rgba(0,0,0,0.4); }
        [data-theme="dark"] .paper-label { color: #4a6054; }
        [data-theme="dark"] .paper-lines span { background: #2a3d2e; }
        [data-theme="dark"] .reflection-floating-card { background: rgba(24,33,24,.8); border-color: rgba(255,255,255,.10); }
        [data-theme="dark"] .reflection-floating-card span { color: #4a6054; }
        [data-theme="dark"] .reflection-floating-card strong { color: #6fa87e; }
        [data-theme="dark"] .reflection-floating-card small { color: #4a6054; }
        [data-theme="dark"] .reflection-rock-content h2 { color: #e4ede5; }
        [data-theme="dark"] .reflection-rock-content h2 em { color: #6fa87e; }
        [data-theme="dark"] .reflection-rock-content > p { color: #8ba693; }
        [data-theme="dark"] .reflection-input-shell {
          background: rgba(255,255,255,.04);
          border-color: #2a3d2e;
          box-shadow: 0 18px 45px rgba(0,0,0,0.25);
        }
        [data-theme="dark"] .reflection-input-shell:focus-within { border-color: #4a7a58; }
        [data-theme="dark"] .input-top-line,
        [data-theme="dark"] .input-bottom-line { color: #4a6054; }
        [data-theme="dark"] .reflection-input-shell textarea { color: #c4d4c8; }
        [data-theme="dark"] .reflection-input-shell textarea::placeholder { color: #3d5548; }

        /* step 4 — complete */
        [data-theme="dark"] .complete-visual-rock {
          background: radial-gradient(circle, color-mix(in srgb, var(--mood-accent) 18%, #182118), transparent 56%),
                      linear-gradient(145deg, #1a2c1e, #1e1e2a);
        }
        [data-theme="dark"] .completion-emoji { background: rgba(255,255,255,.12); border-color: rgba(255,255,255,.18); }
        [data-theme="dark"] .complete-rock-content h2 { color: #e4ede5; }
        [data-theme="dark"] .complete-rock-content h2 em { color: #6fa87e; }
        [data-theme="dark"] .complete-rock-content > p { color: #8ba693; }
        [data-theme="dark"] .summary-main,
        [data-theme="dark"] .summary-block {
          background: rgba(255,255,255,.05);
          border-color: #2a3d2e;
        }
        [data-theme="dark"] .summary-main small,
        [data-theme="dark"] .summary-block small { color: #4a6054; }
        [data-theme="dark"] .summary-main strong { color: #c4d4c8; }
        [data-theme="dark"] .summary-tags span { background: #1e3327; color: #6fa87e; }
        [data-theme="dark"] .summary-block p { color: #8ba693; }
        [data-theme="dark"] .section-kicker { color: #5e7866; }
        [data-theme="dark"] .complete-rock-content h2 em { color: #6fa87e; }

        /* footer */
        [data-theme="dark"] .checkin-rock-footer { color: #3d5548; }
        [data-theme="dark"] .checkin-rock-footer span { color: #8a7040; }
      `}</style>
    </div>
  );
}

export default CheckIn;