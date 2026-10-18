import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import gsap from "gsap";
import API_BASE_URL from "../api";

import Button from "../components/Button";
import FactorCard from "../components/FactorCard";

/* ═══════════════════════════════════════════════════════════
   CALMING AUDIO ENGINE — Web Audio API & Speech Synthesis
   Pure synthetic sound generation: zero network latency or 404s
   ═══════════════════════════════════════════════════════════ */
class CalmingAudio {
  constructor() {
    this.ctx = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientGain = null;
    this.ambientPlaying = false;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Resonant Tibetan singing bowl chime with gentle harmonic decay
  playBowl(pitch = "mid") {
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // 432 Hz natural calm tuning, 216 Hz deep grounding, 528 Hz clear transformation
      const baseFreq = pitch === "deep" ? 216 : pitch === "high" ? 528 : 432;
      const harmonics = [1, 2.76, 5.4];
      const vols = [0.22, 0.09, 0.03];

      harmonics.forEach((h, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(baseFreq * h, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vols[i], now + 0.035);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (i === 0 ? 3.4 : 1.9));

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 3.5);
      });
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  // Soothing 174 Hz Solfeggio low-frequency meditation drone
  setAmbient(enable) {
    try {
      this.ensureContext();
      if (!this.ctx) return false;
      const now = this.ctx.currentTime;

      if (!enable && this.ambientGain) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.9);
        setTimeout(() => {
          if (this.ambientOsc1) { try { this.ambientOsc1.stop(); } catch {} this.ambientOsc1 = null; }
          if (this.ambientOsc2) { try { this.ambientOsc2.stop(); } catch {} this.ambientOsc2 = null; }
        }, 1000);
        this.ambientPlaying = false;
        return false;
      }

      if (enable) {
        if (this.ambientOsc1) { try { this.ambientOsc1.stop(); } catch {} }
        if (this.ambientOsc2) { try { this.ambientOsc2.stop(); } catch {} }

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(174, now); // Solfeggio 174 Hz
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(261.63, now); // Warm C4 fifth harmonic

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(320, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 2.0); // Soft, non-intrusive

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);

        this.ambientOsc1 = osc1;
        this.ambientOsc2 = osc2;
        this.ambientGain = gain;
        this.ambientPlaying = true;
        return true;
      }
    } catch (e) {
      console.warn("Ambient drone error:", e);
      return false;
    }
  }

  stopAll() {
    this.setAmbient(false);
  }
}

const calmingAudio = new CalmingAudio();

function speakVoiceCue(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82; // Gentle, unhurried pace
    utterance.pitch = 0.96; // Warm, soothing tone
    utterance.volume = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const calm = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google") ||
          v.name.includes("Karen"))
    );
    if (calm) utterance.voice = calm;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis error:", e);
  }
}

/* ═══════════════════════════════════════════════════════════
   EXERCISE LIBRARY — WHO stress-management aligned
   ═══════════════════════════════════════════════════════════ */
const exercises = [
  {
    id: "box-breathing",
    type: "grounding",
    tag: "BREATHE",
    title: "Box Breathing",
    subtitle: "4 · 4 · 4 · 4",
    description: "A simple breathing pattern used by athletes and first responders to calm the nervous system quickly.",
    emoji: "🌬️",
    duration: "2 min",
    moods: ["rough", "low", "okay"],
    color: "#8baed0",
    steps: [
      { cue: "Breathe IN", duration: 4, instruction: "Slowly fill your lungs for 4 counts." },
      { cue: "HOLD", duration: 4, instruction: "Hold gently — no tension." },
      { cue: "Breathe OUT", duration: 4, instruction: "Exhale slowly and completely." },
      { cue: "HOLD", duration: 4, instruction: "Rest here before the next breath." },
    ],
    rounds: 4,
    research: "Slow-paced breathing activates the parasympathetic nervous system (WHO, 2020).",
  },
  {
    id: "name-the-thought",
    type: "cognitive",
    tag: "UNHOOK",
    title: "Name the Thought",
    subtitle: "Defusion exercise",
    description: "Putting a label on a difficult thought creates distance from it, so it has less power over you.",
    emoji: "🔖",
    duration: "3 min",
    moods: ["rough", "low", "okay"],
    color: "#a796c8",
    prompts: [
      "What thought keeps coming back right now?",
      "Is this a fact, a worry, or an old story?",
      "If a close friend had this thought, what would you tell them?",
      "Can you notice the thought without believing it completely?",
    ],
    examples: ["Catastrophizing", "Exam worry", "Imposter syndrome", "What-if spiral", "Self-criticism"],
    research: "Cognitive defusion separates the self from thoughts (ACT therapy, Hayes et al.).",
  },
  {
    id: "five-senses",
    type: "grounding",
    tag: "GROUND",
    title: "5-4-3-2-1 Senses",
    subtitle: "Sensory grounding",
    description: "Anchor yourself in the present moment by noticing what's around you right now.",
    emoji: "🌿",
    duration: "2 min",
    moods: ["rough", "low", "okay", "great", "good"],
    color: "#75b88a",
    senses: [
      { count: 5, sense: "see", emoji: "👀", instruction: "Name 5 things you can see right now.", chips: ["Desk lamp", "Window light", "A pen", "Notebook cover", "My own hands"] },
      { count: 4, sense: "touch", emoji: "✋", instruction: "Notice 4 textures you can feel.", chips: ["Cool table surface", "Fabric of shirt", "Smooth keycaps", "Chair cushion"] },
      { count: 3, sense: "hear", emoji: "👂", instruction: "Identify 3 sounds around you.", chips: ["Hum of a fan", "Distant footsteps", "My breath"] },
      { count: 2, sense: "smell", emoji: "👃", instruction: "Find 2 scents — even faint ones.", chips: ["Warm tea/coffee", "Fresh room air", "Clean paper"] },
      { count: 1, sense: "taste", emoji: "👅", instruction: "Notice 1 thing you can taste.", chips: ["Sip of water", "Mint/tea", "Neutral clean mouth"] },
    ],
    research: "Grounding techniques redirect attention from distress to the present environment (SAMHSA, 2014).",
  },
  {
    id: "self-compassion",
    type: "compassion",
    tag: "BE KIND",
    title: "Self-Compassion Pause",
    subtitle: "3-step pause",
    description: "When things feel hard, turning kindness toward yourself — the way you would for a friend — can ease the load.",
    emoji: "🫶",
    duration: "3 min",
    moods: ["rough", "low"],
    color: "#e89a7c",
    prompts: [
      "This is a moment of real difficulty. What you're feeling is valid.",
      "Struggling is part of being human — you're not alone in this.",
      "What would you say to a friend going through exactly this?",
      "Place a hand on your chest and offer yourself one kind sentence.",
    ],
    research: "Self-compassion reduces rumination and increases emotional resilience (Neff, 2011).",
  },
  {
    id: "values-action",
    type: "values",
    tag: "ACT",
    title: "One Small Action",
    subtitle: "Values-aligned step",
    description: "Choose one tiny thing — something that aligns with what actually matters to you — and commit to doing it today.",
    emoji: "🌱",
    duration: "3 min",
    moods: ["low", "okay", "good", "great"],
    color: "#73ae82",
    prompts: [
      "Name one thing that genuinely matters to you right now.",
      "What's one tiny step toward it — small enough to actually do today?",
      "What might get in the way? Can you prepare for that?",
      "Commit: say it out loud or write it down.",
    ],
    valuesList: ["Learning 📚", "Kindness 🫶", "Health & Rest 🌱", "Connection 🫂", "Creativity 🎨", "Courage 🦁"],
    actionExamples: ["Send 1 quick message", "Drink 1 glass of water", "Read 2 pages", "Step outside for 2 mins"],
    research: "Values-based committed action increases psychological flexibility (Hayes, ACT).",
  },
  {
    id: "making-room",
    type: "acceptance",
    tag: "MAKE ROOM",
    title: "Making Room",
    subtitle: "Somatic sensation release",
    description: "Notice where tension is held in your body, breathe into it, and allow it to be there without fighting it.",
    emoji: "🌊",
    duration: "2 min",
    moods: ["rough", "low", "okay"],
    color: "#6fa89c",
    prompts: [
      "Scan your body right now. Where do you feel the tension most (shoulders, chest, jaw, stomach)?",
      "Imagine gently breathing into and around that physical spot — not to push it away, but to give it space.",
      "Can you allow this physical sensation to simply exist for just 30 seconds, like clouds in the sky?",
      "Gently drop your shoulders, unclench your jaw, and let your hands rest open.",
    ],
    bodyChips: ["Jaw & Face", "Neck & Shoulders", "Chest / Heart", "Stomach", "Hands & Arms"],
    research: "Somatic acceptance reduces secondary emotional distress caused by resisting unpleasant sensations (WHO, 2020).",
  },
  {
    id: "gratitude-noticing",
    type: "positive",
    tag: "NOTICE",
    title: "Three Good Things",
    subtitle: "Gratitude practice",
    description: "Briefly noticing small positives trains the brain to spot them more easily over time.",
    emoji: "✨",
    duration: "2 min",
    moods: ["okay", "good", "great"],
    color: "#f2b84b",
    prompts: [
      "Name one small thing that went okay today — even tiny counts.",
      "Was there a moment, however brief, that felt good or neutral?",
      "Think of one person or thing you're quietly glad exists.",
      "Write or think of all three — let them land for a moment.",
    ],
    research: "Gratitude practices increase positive affect and life satisfaction (Emmons & McCullough, 2003).",
  },
];

function getExercisesForMood(mood) {
  const matched = exercises.filter((ex) => ex.moods.includes(mood));
  // Return matched first, or all if none matched
  return matched.length >= 3 ? matched.slice(0, 3) : exercises.slice(0, 3);
}

const moods = [
  { value: "great", emoji: "😀", label: "Great", title: "Feeling good", message: "Looks like today has some good energy.", color: "yellow", accent: "#f2b84b" },
  { value: "good", emoji: "🙂", label: "Good", title: "Pretty good", message: "Nice. A good day is worth noticing.", color: "green", accent: "#75b88a" },
  { value: "okay", emoji: "😐", label: "Okay", title: "Somewhere in the middle", message: "Not every day needs to be amazing.", color: "blue", accent: "#8baed0" },
  { value: "low", emoji: "😕", label: "Low", title: "Having a slower day", message: "Thanks for being honest with yourself.", color: "peach", accent: "#e89a7c" },
  { value: "rough", emoji: "😞", label: "Rough", title: "It's been a lot", message: "You don't have to pretend everything is fine.", color: "purple", accent: "#a796c8" },
];

const factors = [
  { value: "studies", emoji: "📚", label: "Studies", description: "Classes, assignments or exams" },
  { value: "sleep", emoji: "🥱", label: "Sleep", description: "Rest, routine or tiredness" },
  { value: "home", emoji: "🏠", label: "Home", description: "Missing home or family" },
  { value: "friends", emoji: "🫂", label: "Friends", description: "People or relationships" },
  { value: "self", emoji: "🌱", label: "Just me", description: "How you've been feeling" },
  { value: "other", emoji: "✦", label: "Something else", description: "Anything not listed here" },
];

function CheckIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Allow entering directly to Practice via ?step=5 or ?step=practice or route state
  const queryStep = searchParams.get("step");
  const initialStep =
    queryStep === "practice" || queryStep === "5"
      ? 5
      : location.state?.step || 1;

  const [step, setStep] = useState(initialStep);
  const [mood, setMood] = useState("");
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [reflection, setReflection] = useState("");
  const [showMoodHint, setShowMoodHint] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Step 5: Micro-Intervention / Practice state ──
  const [selectedExercise, setSelectedExercise] = useState(() => {
    const exId = searchParams.get("exercise");
    return exId ? exercises.find((e) => e.id === exId) || null : null;
  });
  const [exerciseActive, setExerciseActive] = useState(false);
  const [exerciseStep, setExerciseStep] = useState(0);   // which prompt/step inside the exercise
  const [exerciseDone, setExerciseDone] = useState(false);
  const [beforeRating, setBeforeRating] = useState(null);
  const [afterRating, setAfterRating] = useState(null);
  const [breathPhase, setBreathPhase] = useState(0);     // for box-breathing animation
  const [breathCount, setBreathCount] = useState(0);     // seconds ticking
  const [breathRound, setBreathRound] = useState(0);
  const [isBreathPaused, setIsBreathPaused] = useState(false);
  const [userNote, setUserNote] = useState("");           // per-prompt notes
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState("");

  // ── Optional Audio & Experience state ──
  const [soundEnabled, setSoundEnabled] = useState(false);   // Singing bowl chime at phase/step transitions
  const [voiceEnabled, setVoiceEnabled] = useState(false);   // Spoken guidance cues
  const [ambientEnabled, setAmbientEnabled] = useState(false); // Soothing 174 Hz Solfeggio drone
  const [activeCategory, setActiveCategory] = useState("recommended");
  const [practiceSaved, setPracticeSaved] = useState(false);

  const pageRef = useRef(null);
  const sceneRef = useRef(null);
  const glowRef = useRef(null);
  const emojiRef = useRef(null);
  const breathTimerRef = useRef(null);

  const selectedMood = moods.find((item) => item.value === mood) || moods[1];
  const moodExercises = getExercisesForMood(mood || "okay");

  // Filtered exercises for curated library
  const displayedExercises =
    activeCategory === "recommended"
      ? getExercisesForMood(mood || "okay")
      : activeCategory === "all"
      ? exercises
      : exercises.filter((ex) => ex.type === activeCategory);

  // Stop all audio on unmount
  useEffect(() => {
    return () => {
      calmingAudio.stopAll();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
    if (step < 5) setStep((current) => current + 1);
  }

  function previousStep() {
    setShowMoodHint(false);
    if (step > 1) setStep((current) => current - 1);
  }

  function restart() {
    calmingAudio.stopAll();
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setStep(1);
    setMood(""); setSelectedFactors([]); setReflection(""); setShowMoodHint(false);
    setSelectedExercise(null); setExerciseActive(false); setExerciseStep(0);
    setExerciseDone(false); setBeforeRating(null); setAfterRating(null);
    setBreathPhase(0); setBreathCount(0); setBreathRound(0); setIsBreathPaused(false);
    setUserNote(""); setAiLoading(false); setAiReply(""); setPracticeSaved(false);
    if (breathTimerRef.current) clearInterval(breathTimerRef.current);
  }

  // ── Exercise helpers ──────────────────────────────────────
  function startExercise(ex) {
    setSelectedExercise(ex);
    setExerciseStep(0);
    setExerciseDone(false);
    setUserNote("");
    setAiReply("");
    setBreathPhase(0);
    setBreathCount(ex.steps?.[0]?.duration ?? 4);
    setBreathRound(0);
    setIsBreathPaused(false);
    setExerciseActive(true);
    setPracticeSaved(false);

    if (soundEnabled) calmingAudio.playBowl("high");
    if (voiceEnabled) speakVoiceCue(`Starting ${ex.title}. ${ex.subtitle}`);
  }

  function nextExerciseStep() {
    const ex = selectedExercise;
    if (!ex) return;
    const total = ex.prompts?.length || ex.senses?.length || (ex.steps?.length * ex.rounds) || 1;
    if (exerciseStep + 1 >= total) {
      setExerciseDone(true);
      if (soundEnabled) calmingAudio.playBowl("high");
      if (voiceEnabled) speakVoiceCue("Exercise complete. Notice how you feel.");
    } else {
      setExerciseStep((s) => s + 1);
      setUserNote("");
      if (soundEnabled) calmingAudio.playBowl("mid");
      if (voiceEnabled) {
        const nextPrompt = ex.prompts ? ex.prompts[exerciseStep + 1] : ex.senses ? `${ex.senses[exerciseStep + 1].count} things you can ${ex.senses[exerciseStep + 1].sense}` : "";
        if (nextPrompt) speakVoiceCue(nextPrompt);
      }
    }
  }

  function resetBreathing() {
    setBreathPhase(0);
    setBreathCount(selectedExercise?.steps?.[0]?.duration ?? 4);
    setBreathRound(0);
    setIsBreathPaused(false);
    if (soundEnabled) calmingAudio.playBowl("mid");
  }

  // Box-breathing tick
  useEffect(() => {
    if (!exerciseActive || !selectedExercise?.steps) return;
    if (exerciseDone) { clearInterval(breathTimerRef.current); return; }
    if (isBreathPaused) {
      clearInterval(breathTimerRef.current);
      return;
    }

    const steps = selectedExercise.steps;
    const rounds = selectedExercise.rounds;
    breathTimerRef.current = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          // move to next phase
          setBreathPhase((ph) => {
            const nextPh = (ph + 1) % steps.length;
            if (nextPh === 0) {
              setBreathRound((r) => {
                const nextR = r + 1;
                if (nextR >= rounds) {
                  setExerciseDone(true);
                  if (soundEnabled) calmingAudio.playBowl("high");
                  if (voiceEnabled) speakVoiceCue("Exercise complete. Notice how your body feels.");
                  clearInterval(breathTimerRef.current);
                }
                return nextR;
              });
            }
            setBreathCount(steps[nextPh].duration);

            if (soundEnabled) {
              calmingAudio.playBowl(nextPh === 0 ? "high" : nextPh === 2 ? "deep" : "mid");
            }
            if (voiceEnabled) {
              speakVoiceCue(steps[nextPh].cue);
            }
            return nextPh;
          });
          return steps[0].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(breathTimerRef.current);
  }, [exerciseActive, selectedExercise, exerciseDone, isBreathPaused, soundEnabled, voiceEnabled]);

  function handleRecordAfterRating(ratingNum) {
    setAfterRating(ratingNum);
    setPracticeSaved(true);
    try {
      const stored = JSON.parse(localStorage.getItem("antarang_practice_log") || "[]");
      const record = {
        id: Date.now(),
        exerciseId: selectedExercise?.id,
        exerciseTitle: selectedExercise?.title,
        exerciseEmoji: selectedExercise?.emoji,
        beforeRating,
        afterRating: ratingNum,
        mood: mood || "not specified",
        timestamp: new Date().toISOString(),
        dateStr: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      };
      localStorage.setItem("antarang_practice_log", JSON.stringify([record, ...stored.slice(0, 19)]));
    } catch (e) {
      console.warn("Storage error:", e);
    }
  }

  async function askAI() {
    if (aiLoading) return;
    setAiLoading(true);
    setAiReply("");
    const ex = selectedExercise;
    const ratingLine = afterRating != null
      ? `After the exercise their mood rating went from ${beforeRating ?? "?"}/5 to ${afterRating}/5.`
      : `Before the exercise their mood rating was ${beforeRating ?? "?"}/5.`;
    const prompt = `A student just completed a check-in and reported feeling ${mood}${selectedFactors.length ? ` with ${selectedFactors.join(", ")} on their mind` : ""}. They then tried the "${ex?.title}" exercise (${ex?.type}). ${ratingLine}${userNote ? ` Their note: "${userNote}".` : ""} Give them 2–3 warm, practical sentences: acknowledge how they feel, name one thing that might help today, and end with a gentle encouragement. Keep it brief and human.`;
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: prompt }),
      });
      const data = await response.json();
      setAiReply(data.reply || data.message || "I'm here with you.");
    } catch {
      setAiReply("Couldn't reach Antarang AI right now — but you did something good for yourself today.");
    } finally {
      setAiLoading(false);
    }
  }

  // 5 steps total (Mood, Context, Reflect, Done, Practice)
  const totalSteps = 5;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

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
            <div><strong>0{step}</strong><span>/ 05</span></div>
          </div>
          <small>{step === 5 ? "PRACTICE" : step === 4 ? "COMPLETE" : "YOUR MOMENT"}</small>
        </div>
      </header>

      <div className="checkin-step-strip">
        {[["01", "Mood"], ["02", "Context"], ["03", "Reflect"], ["04", "Done"], ["05", "Practice"]].map(([number, label], index) => {
          const stepNum = index + 1;
          const active = step === stepNum;
          const passed = step > stepNum;
          return (
            <button
              key={number}
              type="button"
              className={`checkin-step-item ${active ? "active" : ""} ${passed ? "passed" : ""}`}
              onClick={() => {
                if (!mood && stepNum > 1 && stepNum < 5) {
                  setShowMoodHint(true);
                  return;
                }
                setStep(stepNum);
              }}
              title={`Go to step ${number}: ${label}`}
            >
              <span>{passed ? "✓" : number}</span>
              <label>{label}</label>
            </button>
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
                <Button onClick={() => setStep(5)}>Try a short exercise <span>→</span></Button>
                <Link to="/app/journey"><Button variant="secondary">See My Journey</Button></Link>
              </div>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="intervention-rock">

            {/* ── LEFT: exercise picker or active exercise ── */}
            <div className="intervention-left">

              {!exerciseActive ? (
                /* PICKER & CURATED LIBRARY */
                <>
                  <div className="intervention-head-row">
                    <div>
                      <span className="section-kicker">05 · PRACTICE & MICRO-INTERVENTIONS</span>
                      <h2>A short exercise<br /><em>for right now.</em></h2>
                    </div>
                  </div>

                  <p className="intervention-intro">
                    Rather than generic advice, try a structured 2–3 minute exercise based on the
                    World Health Organization (WHO) stress-management guide and ACT therapy.
                  </p>

                  {/* ── Audio Controls Bar ── */}
                  <div className="practice-audio-bar">
                    <span className="audio-bar-title">🎧 Optional Audio Guide</span>
                    <div className="audio-bar-toggles">
                      <button
                        type="button"
                        className={`audio-toggle-pill ${soundEnabled ? "active" : ""}`}
                        onClick={() => {
                          const next = !soundEnabled;
                          setSoundEnabled(next);
                          if (next) calmingAudio.playBowl("high");
                        }}
                        title="Plays gentle singing bowl chimes at transitions"
                      >
                        <span>{soundEnabled ? "🔔" : "🔕"}</span> Chimes {soundEnabled ? "ON" : "OFF"}
                      </button>
                      <button
                        type="button"
                        className={`audio-toggle-pill ${voiceEnabled ? "active" : ""}`}
                        onClick={() => {
                          const next = !voiceEnabled;
                          setVoiceEnabled(next);
                          if (next) speakVoiceCue("Voice guidance ready.");
                        }}
                        title="Gentle spoken narration of breathing cues and prompts"
                      >
                        <span>{voiceEnabled ? "🗣️" : "💬"}</span> Voice {voiceEnabled ? "ON" : "OFF"}
                      </button>
                      <button
                        type="button"
                        className={`audio-toggle-pill ${ambientEnabled ? "active" : ""}`}
                        onClick={() => {
                          const next = !ambientEnabled;
                          setAmbientEnabled(next);
                          calmingAudio.setAmbient(next);
                        }}
                        title="Plays a soft 174Hz calm drone in the background"
                      >
                        <span>{ambientEnabled ? "🌿" : "🌱"}</span> Ambient Hum {ambientEnabled ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>

                  {/* ── Before rating ── */}
                  <div className="rating-block">
                    <p className="rating-label">
                      How are you feeling right now?{" "}
                      <small>
                        {beforeRating
                          ? `(Recorded: ${beforeRating}/5 · ${beforeRating === 1 ? "Overwhelmed" : beforeRating === 2 ? "Heavy" : beforeRating === 3 ? "Steady" : beforeRating === 4 ? "Calmer" : "Grounded"})`
                          : "(1 = very low / overwhelmed · 5 = grounded / good)"}
                      </small>
                    </p>
                    <div className="rating-pips">
                      {[
                        { val: 1, label: "Overwhelmed" },
                        { val: 2, label: "Heavy" },
                        { val: 3, label: "Steady" },
                        { val: 4, label: "Calmer" },
                        { val: 5, label: "Grounded" },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`rating-pip ${beforeRating === item.val ? "active" : ""}`}
                          onClick={() => setBeforeRating(item.val)}
                          title={`${item.val} - ${item.label}`}
                        >
                          <span>{item.val}</span>
                          <span className="rating-pip-text">{item.label}</span>
                        </button>
                      ))}
                    </div>
                    {beforeRating !== null && (
                      <p className="rating-set">
                        ✓ Noted: <strong>{beforeRating}/5</strong> before starting. We'll check in afterward to notice any shift.
                      </p>
                    )}
                  </div>

                  {/* ── Library Category Filter Tabs ── */}
                  <div className="ex-filter-bar">
                    <button
                      type="button"
                      className={`ex-filter-btn ${activeCategory === "recommended" ? "active" : ""}`}
                      onClick={() => setActiveCategory("recommended")}
                    >
                      ✦ Recommended for You
                    </button>
                    <button
                      type="button"
                      className={`ex-filter-btn ${activeCategory === "all" ? "active" : ""}`}
                      onClick={() => setActiveCategory("all")}
                    >
                      All Exercises ({exercises.length})
                    </button>
                    <button
                      type="button"
                      className={`ex-filter-btn ${activeCategory === "grounding" ? "active" : ""}`}
                      onClick={() => setActiveCategory("grounding")}
                    >
                      🌬️ Grounding
                    </button>
                    <button
                      type="button"
                      className={`ex-filter-btn ${activeCategory === "cognitive" ? "active" : ""}`}
                      onClick={() => setActiveCategory("cognitive")}
                    >
                      🔖 Unhooking
                    </button>
                    <button
                      type="button"
                      className={`ex-filter-btn ${activeCategory === "compassion" ? "active" : ""}`}
                      onClick={() => setActiveCategory("compassion")}
                    >
                      🫶 Self-Compassion
                    </button>
                    <button
                      type="button"
                      className={`ex-filter-btn ${activeCategory === "values" ? "active" : ""}`}
                      onClick={() => setActiveCategory("values")}
                    >
                      🌱 Values Action
                    </button>
                    <button
                      type="button"
                      className={`ex-filter-btn ${activeCategory === "acceptance" ? "active" : ""}`}
                      onClick={() => setActiveCategory("acceptance")}
                    >
                      🌊 Making Room
                    </button>
                  </div>

                  {/* ── Exercise Cards Grid ── */}
                  <div className="exercise-cards">
                    {displayedExercises.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        className="exercise-card"
                        style={{ "--card-color": ex.color }}
                        onClick={() => startExercise(ex)}
                      >
                        <div className="ex-card-top">
                          <span className="ex-card-emoji">{ex.emoji}</span>
                          <span className="ex-card-tag">{ex.tag}</span>
                          <span className="ex-card-duration">⏱ {ex.duration}</span>
                        </div>
                        <strong className="ex-card-title">{ex.title}</strong>
                        <small className="ex-card-sub">{ex.subtitle}</small>
                        <p className="ex-card-desc">{ex.description}</p>
                        <div className="ex-card-research">{ex.research}</div>
                        <span className="ex-card-start">Start exercise →</span>
                      </button>
                    ))}
                  </div>

                  <div className="intervention-actions">
                    <Button variant="secondary" onClick={() => setStep(4)}>← Back to Check-in</Button>
                    <Link to="/app/journey"><Button>Finish & See My Journey</Button></Link>
                  </div>
                </>
              ) : (
                /* ACTIVE EXERCISE VIEW */
                <>
                  <div className="active-ex-header">
                    <div>
                      <span className="section-kicker">05 · {selectedExercise.tag}</span>
                      <h2>{selectedExercise.title}<br /><em>{selectedExercise.subtitle}</em></h2>
                    </div>

                    {/* Quick in-exercise audio toggles */}
                    <div className="active-audio-controls">
                      <button
                        type="button"
                        className={`audio-mini-btn ${soundEnabled ? "active" : ""}`}
                        onClick={() => {
                          const next = !soundEnabled;
                          setSoundEnabled(next);
                          if (next) calmingAudio.playBowl("high");
                        }}
                        title="Toggle singing bowl chimes"
                      >
                        {soundEnabled ? "🔔 Chimes" : "🔕 Chimes"}
                      </button>
                      <button
                        type="button"
                        className={`audio-mini-btn ${voiceEnabled ? "active" : ""}`}
                        onClick={() => {
                          const next = !voiceEnabled;
                          setVoiceEnabled(next);
                          if (next) speakVoiceCue("Voice active.");
                        }}
                        title="Toggle spoken cues"
                      >
                        {voiceEnabled ? "🗣️ Voice" : "💬 Voice"}
                      </button>
                    </div>
                  </div>

                  {!exerciseDone ? (
                    <>
                      {/* Box Breathing */}
                      {selectedExercise.id === "box-breathing" && (
                        <div className="breath-zone">
                          <div
                            className="breath-ring"
                            style={{
                              "--bscale": breathPhase === 0 ? 1.32 : breathPhase === 2 ? 0.82 : 1.05,
                              "--bcolor": selectedExercise.color,
                            }}
                          >
                            <div className="breath-inner">
                              <strong className="breath-cue">{selectedExercise.steps[breathPhase].cue}</strong>
                              <span className="breath-count">{breathCount}</span>
                            </div>
                          </div>
                          <p className="breath-instruction">{selectedExercise.steps[breathPhase].instruction}</p>

                          <div className="breath-controls">
                            <button
                              type="button"
                              className="breath-ctrl-btn"
                              onClick={() => setIsBreathPaused((p) => !p)}
                            >
                              {isBreathPaused ? "▶ Resume" : "⏸ Pause"}
                            </button>
                            <button
                              type="button"
                              className="breath-ctrl-btn"
                              onClick={resetBreathing}
                            >
                              ↺ Reset
                            </button>
                          </div>

                          <div className="breath-progress">
                            {Array.from({ length: selectedExercise.rounds }).map((_, i) => (
                              <span
                                key={i}
                                className={`breath-round-dot ${
                                  i < breathRound ? "done" : i === breathRound ? "active" : ""
                                }`}
                              />
                            ))}
                          </div>
                          <small className="breath-round-label">
                            Round {breathRound + 1} of {selectedExercise.rounds}
                          </small>
                        </div>
                      )}

                      {/* Prompt-based exercises (Name the thought, Self-compassion, Values, Making Room, Gratitude) */}
                      {selectedExercise.prompts && (
                        <div className="prompt-zone">
                          <div className="prompt-number">
                            STEP {String(exerciseStep + 1).padStart(2, "0")} / {String(selectedExercise.prompts.length).padStart(2, "0")}
                          </div>
                          <p className="prompt-text">{selectedExercise.prompts[exerciseStep]}</p>

                          {/* Exercise-specific helpers & suggestions */}
                          {selectedExercise.id === "name-the-thought" && exerciseStep === 0 && selectedExercise.examples && (
                            <div className="prompt-chips-wrap">
                              <span className="prompt-chip-hint">Common loops:</span>
                              {selectedExercise.examples.map((exmp) => (
                                <button
                                  key={exmp}
                                  type="button"
                                  className="prompt-suggestion-chip"
                                  onClick={() => setUserNote((prev) => (prev ? `${prev}, ${exmp}` : exmp))}
                                >
                                  +{exmp}
                                </button>
                              ))}
                            </div>
                          )}

                          {selectedExercise.id === "name-the-thought" && userNote.trim().length > 3 && (
                            <div className="defusion-mirror">
                              <span className="mirror-tag">✦ UNHOOKING DEFUSION</span>
                              <p>
                                Reframe: <em>"I notice I am having the thought that {userNote.trim().replace(/^i am /i, "").replace(/^i feel like /i, "")}."</em>
                              </p>
                              <small>Notice the thought is just mental words — not an objective fact.</small>
                            </div>
                          )}

                          {selectedExercise.id === "values-action" && exerciseStep === 0 && selectedExercise.valuesList && (
                            <div className="prompt-chips-wrap">
                              <span className="prompt-chip-hint">Pick what matters:</span>
                              {selectedExercise.valuesList.map((val) => (
                                <button
                                  key={val}
                                  type="button"
                                  className="prompt-suggestion-chip"
                                  onClick={() => setUserNote(val)}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          )}

                          {selectedExercise.id === "values-action" && exerciseStep === 1 && selectedExercise.actionExamples && (
                            <div className="prompt-chips-wrap">
                              <span className="prompt-chip-hint">Tiny step ideas:</span>
                              {selectedExercise.actionExamples.map((act) => (
                                <button
                                  key={act}
                                  type="button"
                                  className="prompt-suggestion-chip"
                                  onClick={() => setUserNote(act)}
                                >
                                  +{act}
                                </button>
                              ))}
                            </div>
                          )}

                          {selectedExercise.id === "making-room" && exerciseStep === 0 && selectedExercise.bodyChips && (
                            <div className="prompt-chips-wrap">
                              <span className="prompt-chip-hint">Check-in points:</span>
                              {selectedExercise.bodyChips.map((chip) => (
                                <button
                                  key={chip}
                                  type="button"
                                  className="prompt-suggestion-chip"
                                  onClick={() => setUserNote((prev) => (prev ? `${prev}, ${chip}` : chip))}
                                >
                                  +{chip}
                                </button>
                              ))}
                            </div>
                          )}

                          <textarea
                            className="prompt-note"
                            placeholder="Type your reflection here — or simply sit with it quietly."
                            value={userNote}
                            onChange={(e) => setUserNote(e.target.value)}
                            rows={3}
                          />

                          <div className="prompt-actions-row">
                            <Button onClick={nextExerciseStep}>
                              {exerciseStep + 1 < selectedExercise.prompts.length ? "Next prompt →" : "Finish exercise →"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* 5-senses exercise */}
                      {selectedExercise.senses && (
                        <div className="prompt-zone">
                          <div className="sense-header">
                            <div className="sense-emoji">{selectedExercise.senses[exerciseStep].emoji}</div>
                            <div className="prompt-number">
                              SENSE {exerciseStep + 1} / {selectedExercise.senses.length}
                            </div>
                          </div>
                          <p className="prompt-text">
                            <strong>
                              {selectedExercise.senses[exerciseStep].count} things you can {selectedExercise.senses[exerciseStep].sense}
                            </strong>
                          </p>
                          <p className="prompt-sub">{selectedExercise.senses[exerciseStep].instruction}</p>

                          {selectedExercise.senses[exerciseStep].chips && (
                            <div className="prompt-chips-wrap">
                              <span className="prompt-chip-hint">Quick tap ideas:</span>
                              {selectedExercise.senses[exerciseStep].chips.map((chip) => (
                                <button
                                  key={chip}
                                  type="button"
                                  className="prompt-suggestion-chip"
                                  onClick={() => setUserNote((prev) => (prev ? `${prev}, ${chip}` : chip))}
                                >
                                  +{chip}
                                </button>
                              ))}
                            </div>
                          )}

                          <textarea
                            className="prompt-note"
                            placeholder="Name them here..."
                            value={userNote}
                            onChange={(e) => setUserNote(e.target.value)}
                            rows={3}
                          />

                          <div className="prompt-actions-row">
                            <Button onClick={nextExerciseStep}>
                              {exerciseStep + 1 < selectedExercise.senses.length ? "Next sense →" : "Done →"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* DONE — After-rating & AI Reflection */
                    <div className="exercise-done">
                      <div className="done-check">✓</div>
                      <p className="done-message">You finished <strong>{selectedExercise.title}</strong>.</p>
                      <small className="done-research">{selectedExercise.research}</small>

                      {/* After rating */}
                      <div className="rating-block">
                        <p className="rating-label">
                          How do you feel <em>now</em>?{" "}
                          <small>
                            {afterRating
                              ? `(Recorded: ${afterRating}/5 · ${afterRating === 1 ? "Overwhelmed" : afterRating === 2 ? "Heavy" : afterRating === 3 ? "Steady" : afterRating === 4 ? "Calmer" : "Grounded"})`
                              : "(1 = very low / overwhelmed · 5 = grounded / good)"}
                          </small>
                        </p>
                        <div className="rating-pips">
                          {[
                            { val: 1, label: "Overwhelmed" },
                            { val: 2, label: "Heavy" },
                            { val: 3, label: "Steady" },
                            { val: 4, label: "Calmer" },
                            { val: 5, label: "Grounded" },
                          ].map((item) => (
                            <button
                              key={item.val}
                              type="button"
                              className={`rating-pip ${afterRating === item.val ? "active" : ""}`}
                              onClick={() => handleRecordAfterRating(item.val)}
                              title={`${item.val} - ${item.label}`}
                            >
                              <span>{item.val}</span>
                              <span className="rating-pip-text">{item.label}</span>
                            </button>
                          ))}
                        </div>

                        {beforeRating && afterRating && (
                          <div className="rating-delta-card">
                            <p className="rating-delta">
                              {afterRating > beforeRating
                                ? `↑ Up ${afterRating - beforeRating} point${afterRating - beforeRating > 1 ? "s" : ""} (${beforeRating}/5 → ${afterRating}/5) — Intentional pausing shifted your nervous system.`
                                : afterRating < beforeRating
                                ? `That felt harder (${beforeRating}/5 → ${afterRating}/5). In mindfulness, suppressed feelings sometimes rise first before they settle. That is okay too.`
                                : `Steady at ${afterRating}/5 — Consistency builds psychological flexibility. Showing up for yourself is the real practice.`}
                            </p>
                          </div>
                        )}

                        {practiceSaved && (
                          <div className="practice-saved-badge">
                            ✓ Saved to your personal practice log
                          </div>
                        )}
                      </div>

                      {/* AI insight button */}
                      <button
                        type="button"
                        className="ai-insight-btn"
                        onClick={askAI}
                        disabled={aiLoading}
                      >
                        {aiLoading ? (
                          <><span className="ai-spin" /> Thinking with Antarang AI...</>
                        ) : (
                          <>✦ Get a supportive thought from Antarang AI</>
                        )}
                      </button>

                      {aiReply && (
                        <div className="ai-reply-card">
                          <span className="ai-reply-tag">✦ Antarang AI Reflection</span>
                          <p>{aiReply}</p>
                          <Link
                            to="/app/chat"
                            state={{
                              initialMessage: `I just completed the "${selectedExercise.title}" exercise (${selectedExercise.type}) after feeling ${mood}. ${aiReply} Can we explore this further?`,
                            }}
                            className="ai-reply-link"
                          >
                            Continue in Antarang AI →
                          </Link>
                        </div>
                      )}

                      <div className="intervention-actions" style={{ marginTop: "24px" }}>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setExerciseActive(false);
                            setExerciseDone(false);
                            setAfterRating(null);
                          }}
                        >
                          Try another exercise
                        </Button>
                        <Button onClick={restart}>Finish & Start fresh</Button>
                        <Link to="/app/journey">
                          <Button variant="secondary">View My Journey →</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── RIGHT: ambient art & science panel ── */}
            <div className="intervention-art">
              <div className="int-art-ring ring-a" />
              <div className="int-art-ring ring-b" />
              <div className="int-art-center">
                <span className="int-art-emoji">
                  {selectedExercise ? selectedExercise.emoji : "🌿"}
                </span>
              </div>
              <div className="int-art-label">
                <small>A MOMENT FOR YOURSELF</small>
                <p>Skill practice, not performance.</p>
              </div>

              {selectedExercise && (
                <div className="int-art-infocard">
                  <strong>{selectedExercise.title}</strong>
                  <p>{selectedExercise.research}</p>
                </div>
              )}

              <div className="int-research-strip">
                <span>WHO 2020 · ACT · Mindfulness-Based CBT</span>
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
          min-height: 100vh;
          margin: 0;
          box-sizing: border-box;
          overflow-x: hidden;
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
        .checkin-step-strip { flex: 0 0 auto; width: 100%; margin: 0 0 8px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .checkin-step-item { display: flex; align-items: center; gap: 9px; color: #a2a69f; font-size: 11px; font-weight: 700; transition: color 0.35s ease, transform 0.35s ease; border: none; background: transparent; cursor: pointer; padding: 0; font-family: inherit; text-align: left; }
        .checkin-step-item span { display: grid; place-items: center; width: 27px; height: 27px; border: 1px solid #dddcd3; border-radius: 50%; background: rgba(255,255,255,0.55); font-size: 9px; transition: all 0.35s ease; flex-shrink: 0; }
        .checkin-step-item.active { color: #344138; transform: translateY(-1px); }
        .checkin-step-item.active span { border-color: var(--mood-accent); background: var(--mood-accent); color: white; box-shadow: 0 7px 20px color-mix(in srgb, var(--mood-accent) 30%, transparent); }
        .checkin-step-item.passed { color: #728578; }
        .checkin-step-item.passed span { border-color: #a8c0ac; color: #66816c; background: #edf5ee; }

        .checkin-progress-line { flex: 0 0 auto; width: 100%; height: 2px; margin: 0 0 16px; overflow: hidden; background: #e7e4db; }
        .checkin-progress-line span { display: block; height: 100%; background: linear-gradient(90deg, #83a98a, var(--mood-accent)); transition: width 0.65s cubic-bezier(.22,1,.36,1); }

        /* ===== MAIN STAGE (FLEX GROW) ===== */
        .checkin-stage { flex: 1 1 auto; width: 100%; min-height: 0; overflow: hidden; position: relative; }

        .mood-rock, .context-rock, .reflection-rock, .complete-rock, .intervention-rock {
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

        /* ===== STEP 5: PRACTICE & MICRO-INTERVENTIONS ===== */
        .intervention-rock {
          grid-template-columns: 1.25fr 0.75fr;
          gap: 32px;
          height: 100%;
          min-height: 0;
          align-items: stretch;
        }

        .intervention-left {
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding-right: 14px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5cb transparent;
        }
        .intervention-left::-webkit-scrollbar { width: 6px; }
        .intervention-left::-webkit-scrollbar-thumb { background: #cbd5cb; border-radius: 99px; }

        .intervention-head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 6px; flex: 0 0 auto; }
        .intervention-head-row h2 { margin: 6px 0 0; color: #29372e; font-size: clamp(26px, 2.6vw, 38px); line-height: 1; letter-spacing: -0.05em; }
        .intervention-head-row h2 em { color: #71987a; font-family: Georgia, serif; font-weight: 400; }
        .intervention-intro { margin: 6px 0 16px; color: #718078; font-size: 13px; line-height: 1.55; max-width: 580px; flex: 0 0 auto; }

        /* Audio toolbar */
        .practice-audio-bar {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
          padding: 10px 14px; border-radius: 16px; border: 1px solid #e1ded4; background: rgba(255,255,255,0.65);
          backdrop-filter: blur(8px); margin-bottom: 14px; flex: 0 0 auto;
        }
        .audio-bar-title { font-size: 10px; font-weight: 800; letter-spacing: 0.12em; color: #5a6b5e; text-transform: uppercase; }
        .audio-bar-toggles { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .audio-toggle-pill {
          display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 99px;
          border: 1px solid #d5d8cf; background: white; color: #546356; font-size: 11px; font-weight: 700;
          cursor: pointer; transition: all 0.22s ease; font-family: inherit;
        }
        .audio-toggle-pill:hover { border-color: #8fa894; background: #fafaf8; }
        .audio-toggle-pill.active {
          background: #edf5ee; border-color: #73ae82; color: #2e5338; box-shadow: 0 2px 10px rgba(115, 174, 130, 0.2);
        }

        /* Ratings */
        .rating-block {
          padding: 14px 16px; border-radius: 20px; border: 1px solid #e2e1d7; background: rgba(255,255,255,0.65);
          backdrop-filter: blur(8px); margin-bottom: 16px; flex: 0 0 auto;
        }
        .rating-label { font-size: 12px; font-weight: 750; color: #2e3b32; margin: 0 0 10px; }
        .rating-label small { font-weight: 500; color: #7f897f; font-size: 10px; margin-left: 4px; }
        .rating-pips { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .rating-pip {
          min-width: 0; height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center;
          border-radius: 14px; border: 1px solid #dcdad0; background: white; color: #38463c; cursor: pointer;
          transition: all 0.25s cubic-bezier(.22,1,.36,1); font-family: inherit;
        }
        .rating-pip span:first-child { font-size: 15px; font-weight: 800; line-height: 1; }
        .rating-pip-text { font-size: 8px; font-weight: 700; color: #8e968d; margin-top: 3px; letter-spacing: 0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
        .rating-pip:hover { transform: translateY(-2px); border-color: #8fa894; box-shadow: 0 6px 16px rgba(50, 65, 52, 0.08); }
        .rating-pip.active {
          background: var(--mood-accent, #73ae82); border-color: var(--mood-accent, #73ae82); color: white;
          transform: translateY(-2px); box-shadow: 0 8px 20px color-mix(in srgb, var(--mood-accent, #73ae82) 35%, transparent);
        }
        .rating-pip.active .rating-pip-text { color: rgba(255, 255, 255, 0.95); }
        .rating-set { margin: 10px 0 0; font-size: 11px; color: #58665a; }
        .rating-delta-card { margin-top: 12px; }
        .rating-delta {
          display: inline-block; padding: 8px 14px; border-radius: 12px; font-size: 11px; font-weight: 700;
          line-height: 1.45; background: #edf5ee; color: #32583c; border: 1px solid #cde1d0;
        }
        .practice-saved-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 750; color: #436e4d; background: rgba(115,174,130,0.12); padding: 4px 10px; border-radius: 99px; margin-top: 8px; }

        /* Filter bar */
        .ex-filter-bar { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; flex: 0 0 auto; }
        .ex-filter-btn {
          padding: 6px 12px; border-radius: 99px; border: 1px solid #dedcd3; background: rgba(255,255,255,0.6);
          color: #616e63; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; font-family: inherit;
        }
        .ex-filter-btn:hover { background: white; border-color: #8fa894; color: #2d3b31; }
        .ex-filter-btn.active {
          background: #394d3f; border-color: #394d3f; color: white; box-shadow: 0 4px 14px rgba(57, 77, 63, 0.22);
        }

        /* Exercise cards grid */
        .exercise-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 12px; margin-bottom: 18px; }
        .exercise-card {
          display: flex; flex-direction: column; text-align: left; padding: 15px; border-radius: 20px;
          border: 1px solid #e1ded4; background: rgba(255,255,255,0.65); backdrop-filter: blur(8px);
          cursor: pointer; transition: all 0.3s cubic-bezier(.22,1,.36,1); position: relative; font-family: inherit;
        }
        .exercise-card:hover {
          transform: translateY(-3px); border-color: var(--card-color, #73ae82); background: white;
          box-shadow: 0 16px 36px rgba(55, 67, 57, 0.09);
        }
        .ex-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .ex-card-emoji { font-size: 22px; width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; background: rgba(255, 255, 255, 0.9); box-shadow: 0 4px 10px rgba(0,0,0,0.04); }
        .ex-card-tag { font-size: 8px; font-weight: 800; letter-spacing: 0.12em; color: #58695b; padding: 3px 7px; border-radius: 6px; background: #edf4ec; }
        .ex-card-duration { font-size: 10px; font-weight: 750; color: #8e968d; }
        .ex-card-title { color: #26332b; font-size: 14px; font-weight: 750; margin-top: 3px; }
        .ex-card-sub { color: #798279; font-size: 11px; margin-bottom: 6px; }
        .ex-card-desc { color: #626e63; font-size: 11px; line-height: 1.5; margin: 0 0 10px; flex: 1; }
        .ex-card-research { font-size: 9px; color: #7f897f; background: rgba(0,0,0,0.03); padding: 5px 8px; border-radius: 8px; margin-bottom: 10px; line-height: 1.35; font-style: italic; }
        .ex-card-start { font-size: 11px; font-weight: 800; color: #35573d; display: inline-flex; align-items: center; gap: 4px; transition: transform 0.2s ease; }
        .exercise-card:hover .ex-card-start { transform: translateX(3px); }

        /* Active exercise view */
        .active-ex-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 8px; flex: 0 0 auto; }
        .active-ex-header h2 { margin: 6px 0 0; color: #29372e; font-size: clamp(24px, 2.5vw, 36px); line-height: 1.05; letter-spacing: -0.05em; }
        .active-ex-header h2 em { color: #71987a; font-family: Georgia, serif; font-weight: 400; font-size: 0.85em; }
        .active-audio-controls { display: flex; align-items: center; gap: 6px; padding-top: 4px; }
        .audio-mini-btn {
          padding: 5px 9px; border-radius: 99px; border: 1px solid #dcd9cf; background: white;
          color: #556357; font-size: 10px; font-weight: 750; cursor: pointer; transition: all 0.2s ease; font-family: inherit;
        }
        .audio-mini-btn.active { background: #edf5ee; border-color: #73ae82; color: #2e5338; }

        /* Breathing zone */
        .breath-zone {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 26px 20px; border-radius: 26px; border: 1px solid #e1ded4; background: rgba(255,255,255,0.6);
          margin-top: 8px; position: relative;
        }
        .breath-ring {
          width: 180px; height: 180px; border-radius: 50%; display: grid; place-items: center;
          border: 3px solid var(--bcolor, #8baed0);
          background: radial-gradient(circle, color-mix(in srgb, var(--bcolor, #8baed0) 24%, white), transparent 70%);
          transform: scale(var(--bscale, 1)); transition: transform 3.9s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 16px 45px color-mix(in srgb, var(--bcolor, #8baed0) 22%, transparent);
        }
        .breath-inner { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .breath-cue { font-size: 14px; font-weight: 800; letter-spacing: 0.12em; color: #26332b; text-transform: uppercase; }
        .breath-count { font-size: 40px; font-weight: 800; color: #26332b; line-height: 1; margin-top: 3px; }
        .breath-instruction { margin: 18px 0 12px; font-size: 13px; font-weight: 600; color: #435147; text-align: center; max-width: 360px; line-height: 1.45; }
        .breath-controls { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
        .breath-ctrl-btn {
          padding: 5px 13px; border-radius: 99px; border: 1px solid #d4d7cf; background: white;
          color: #445348; font-size: 11px; font-weight: 750; cursor: pointer; transition: all 0.2s ease; font-family: inherit;
        }
        .breath-ctrl-btn:hover { border-color: #8fa894; background: #fafaf8; }
        .breath-progress { display: flex; gap: 8px; margin-bottom: 5px; }
        .breath-round-dot { width: 9px; height: 9px; border-radius: 50%; background: #dfe2db; transition: all 0.3s ease; }
        .breath-round-dot.done { background: #73ae82; }
        .breath-round-dot.active { background: var(--bcolor, #8baed0); transform: scale(1.3); box-shadow: 0 0 8px color-mix(in srgb, var(--bcolor, #8baed0) 60%, transparent); }
        .breath-round-label { font-size: 10px; font-weight: 800; color: #879187; letter-spacing: 0.1em; text-transform: uppercase; }

        /* Prompt zone */
        .prompt-zone {
          display: flex; flex-direction: column; padding: 22px; border-radius: 24px;
          border: 1px solid #e1ded4; background: rgba(255,255,255,0.65); backdrop-filter: blur(8px); margin-top: 8px;
        }
        .prompt-number { font-size: 10px; font-weight: 800; letter-spacing: 0.18em; color: #879187; margin-bottom: 8px; }
        .prompt-text { font-size: 17px; font-weight: 700; color: #28362d; line-height: 1.4; margin: 0 0 8px; }
        .prompt-sub { font-size: 12px; color: #6e7970; margin: 0 0 12px; line-height: 1.5; }
        .sense-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .sense-emoji { font-size: 26px; }

        .prompt-chips-wrap { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 12px; }
        .prompt-chip-hint { font-size: 10px; font-weight: 750; color: #7f897f; margin-right: 2px; }
        .prompt-suggestion-chip {
          padding: 4px 9px; border-radius: 99px; border: 1px solid #dedcd3; background: white;
          font-size: 11px; font-weight: 600; color: #49574d; cursor: pointer; transition: all 0.2s ease; font-family: inherit;
        }
        .prompt-suggestion-chip:hover { border-color: #73ae82; background: #edf5ee; color: #2b4933; }

        .defusion-mirror {
          padding: 11px 14px; border-radius: 14px; background: #f4f0f8; border-left: 3px solid #a796c8; margin-bottom: 12px;
        }
        .mirror-tag { font-size: 9px; font-weight: 800; letter-spacing: 0.14em; color: #77629b; display: block; margin-bottom: 3px; }
        .defusion-mirror p { margin: 0 0 4px; font-size: 12px; color: #3c324e; font-weight: 600; }
        .defusion-mirror em { color: #583c84; font-style: normal; text-decoration: underline; }
        .defusion-mirror small { color: #7f7492; font-size: 10px; }

        .prompt-note {
          width: 100%; border-radius: 16px; border: 1px solid #d5dad0; background: white;
          padding: 12px 14px; font-family: inherit; font-size: 13px; color: #28372d; resize: vertical;
          margin-bottom: 14px; outline: none; transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .prompt-note:focus { border-color: #73ae82; box-shadow: 0 0 0 3px rgba(115, 174, 130, 0.15); }
        .prompt-actions-row { display: flex; justify-content: flex-end; }

        /* Completion view */
        .exercise-done {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          padding: 28px 20px; border-radius: 26px; border: 1px solid #e1ded4; background: rgba(255,255,255,0.7);
          margin-top: 8px;
        }
        .done-check {
          width: 52px; height: 52px; border-radius: 50%; background: #edf5ee; color: #437750;
          font-size: 24px; font-weight: 800; display: grid; place-items: center; margin-bottom: 12px;
          box-shadow: 0 8px 22px rgba(115, 174, 130, 0.2); animation: completionPop 0.6s cubic-bezier(.22,1,.36,1);
        }
        .done-message { font-size: 17px; color: #25332a; margin: 0 0 4px; font-weight: 600; }
        .done-message strong { color: #1e3325; font-weight: 750; }
        .done-research { font-size: 11px; color: #7b867c; max-width: 440px; margin-bottom: 18px; line-height: 1.5; font-style: italic; }

        .ai-insight-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; max-width: 380px;
          padding: 12px 20px; border-radius: 16px; border: 1px solid #d4cbde; background: linear-gradient(135deg, #f7f3fb, #f0ebf8);
          color: #5d4682; font-family: inherit; font-size: 12px; font-weight: 750; cursor: pointer; transition: all 0.25s ease;
          margin-top: 14px;
        }
        .ai-insight-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(167, 150, 200, 0.25); border-color: #a796c8; }
        .ai-spin { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(93, 70, 130, 0.25); border-top-color: #5d4682; border-radius: 50%; animation: completionSpin 0.7s linear infinite; }
        .ai-reply-card {
          width: 100%; max-width: 480px; text-align: left; padding: 15px 18px; border-radius: 18px;
          border: 1px solid #ddd6e8; background: #faf8fd; margin-top: 14px; animation: checkinStageIn 0.4s ease;
        }
        .ai-reply-tag { font-size: 9px; font-weight: 800; letter-spacing: 0.14em; color: #7a60a4; display: block; margin-bottom: 5px; }
        .ai-reply-card p { margin: 0; font-size: 12px; color: #3b2d52; line-height: 1.6; }
        .ai-reply-link { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 750; color: #674792; text-decoration: none; margin-top: 10px; }
        .ai-reply-link:hover { text-decoration: underline; }

        /* Right panel — art & science */
        .intervention-art {
          position: relative; width: 100%; height: 100%; min-height: 0; display: flex; flex-direction: column;
          justify-content: center; align-items: center; text-align: center; padding: 32px 24px; border-radius: 34px;
          background: radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--mood-accent, #73ae82) 20%, white), transparent 35%),
                      linear-gradient(145deg, #eaf2e8, #f4eee7 65%, #eae7f3);
          box-shadow: inset 0 1px rgba(255,255,255,.75), 0 24px 70px rgba(54, 67, 55, 0.08); overflow: hidden;
        }
        .int-art-ring { position: absolute; border: 1px solid rgba(75, 94, 78, 0.12); border-radius: 50%; pointer-events: none; }
        .int-art-ring.ring-a { width: 250px; height: 250px; animation: orbitRotate 18s linear infinite; }
        .int-art-ring.ring-b { width: 330px; height: 190px; transform: rotate(35deg); animation: orbitRotateReverse 22s linear infinite; }
        .int-art-center {
          position: relative; z-index: 2; width: 110px; height: 110px; border-radius: 50%;
          background: rgba(255, 255, 255, 0.55); border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 20px 50px rgba(55, 67, 57, 0.12); display: grid; place-items: center; font-size: 52px;
          margin-bottom: 18px; backdrop-filter: blur(8px); animation: emojiBreathe 4s ease-in-out infinite;
        }
        .int-art-label { position: relative; z-index: 2; margin-bottom: 14px; }
        .int-art-label small { font-size: 9px; font-weight: 800; letter-spacing: 0.18em; color: #6f7a70; }
        .int-art-label p { margin: 6px 0 0; font-size: 14px; font-weight: 600; color: #28372d; font-family: Georgia, serif; font-style: italic; }
        .int-art-infocard {
          position: relative; z-index: 2; max-width: 290px; padding: 12px 14px; border-radius: 16px;
          background: rgba(255, 255, 255, 0.55); border: 1px solid rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(8px); font-size: 11px; color: #4b584d; line-height: 1.5; margin-bottom: 16px; text-align: center;
        }
        .int-art-infocard strong { display: block; font-size: 12px; color: #28362d; margin-bottom: 4px; }
        .int-art-infocard p { margin: 0; }
        .int-research-strip {
          position: relative; z-index: 2; padding: 6px 14px; border-radius: 99px; background: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.85); font-size: 9px; font-weight: 800; letter-spacing: 0.1em;
          color: #58685b; text-transform: uppercase;
        }
        .intervention-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 16px; flex: 0 0 auto; }

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
          .checkin-rock-page { height: auto; min-height: 100vh; overflow-x: hidden; overflow-y: auto; padding: 28px 24px 25px; }
          .mood-rock, .context-rock, .reflection-rock, .complete-rock { grid-template-columns: 1fr; gap: 28px; height: auto; min-height: auto; }
          .mood-rock-scene { min-height: 360px; }
          .context-intro { min-height: auto; padding: 20px 0 0; }
          .context-orbit-art { display: none; }
          .reflection-visual, .complete-visual-rock { min-height: 280px; }
        }
        @media (max-width: 700px) {
          .checkin-rock-page { padding: 20px 14px 24px; }
          .checkin-rock-header { gap: 14px; margin-bottom: 12px; }
          .checkin-title-block h1 { font-size: clamp(24px, 6.5vw, 32px); margin: 6px 0; }
          .checkin-title-block p { font-size: 12px; }
          .checkin-orb-ring { width: 68px; height: 68px; }
          .checkin-orb-ring strong { font-size: 16px; }
          .checkin-orb-ring > div { padding-top: 24px; }
          .mood-rock-grid, .factor-rock-grid { grid-template-columns: 1fr; }
          .mood-rock-scene { min-height: 260px; padding: 24px 16px; }
          .reflection-visual, .complete-visual-rock { min-height: 220px; }
          .checkin-action-row, .reflection-rock-actions, .complete-rock-actions { flex-direction: column; align-items: stretch; gap: 10px; }
          .private-note { order: 2; text-align: center; }
        }
        @media (max-width: 480px) {
          .checkin-ambient { display: none; }
          .checkin-cursor-glow { display: none; }
          .checkin-step-strip { gap: 4px; }
          .checkin-step-item { gap: 4px; font-size: 9.5px; }
          .checkin-step-item span { width: 22px; height: 22px; font-size: 9px; }
          .complete-summary { grid-template-columns: 1fr; gap: 8px; }
          .completion-emoji { width: 100px; height: 100px; font-size: 52px; }
          .mood-hero-emoji { width: 70px; height: 70px; font-size: 36px; }
        }
        @media (max-width: 360px) {
          .checkin-step-item label { font-size: 8.5px; }
          .mood-option-copy strong { font-size: 12.5px; }
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

        /* step 5 — practice & micro-interventions */
        [data-theme="dark"] .intervention-rock { color: #e4ede5; }
        [data-theme="dark"] .intervention-left { scrollbar-color: #2a3d2e transparent; }
        [data-theme="dark"] .intervention-left::-webkit-scrollbar-thumb { background: #2a3d2e; }
        [data-theme="dark"] .intervention-head-row h2 { color: #e4ede5; }
        [data-theme="dark"] .intervention-head-row h2 em { color: #6fa87e; }
        [data-theme="dark"] .intervention-intro { color: #8ba693; }

        [data-theme="dark"] .practice-audio-bar { background: rgba(255,255,255,0.04); border-color: #2a3d2e; }
        [data-theme="dark"] .audio-bar-title { color: #8ba693; }
        [data-theme="dark"] .audio-toggle-pill { background: rgba(255,255,255,0.05); border-color: #2a3d2e; color: #c4d4c8; }
        [data-theme="dark"] .audio-toggle-pill:hover { background: rgba(255,255,255,0.08); border-color: #3d5945; }
        [data-theme="dark"] .audio-toggle-pill.active { background: #1e3327; border-color: #4a7a58; color: #6fa87e; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }

        [data-theme="dark"] .rating-block { background: rgba(255,255,255,0.04); border-color: #2a3d2e; }
        [data-theme="dark"] .rating-label { color: #e4ede5; }
        [data-theme="dark"] .rating-label small { color: #5e7866; }
        [data-theme="dark"] .rating-pip { background: rgba(255,255,255,0.06); border-color: #2a3d2e; color: #c4d4c8; }
        [data-theme="dark"] .rating-pip:hover { background: rgba(255,255,255,0.1); border-color: #4a7a58; }
        [data-theme="dark"] .rating-pip.active { background: #234830; border-color: #6fa87e; color: white; box-shadow: 0 6px 18px rgba(111,168,126,0.25); }
        [data-theme="dark"] .rating-pip-text { color: #5e7866; }
        [data-theme="dark"] .rating-pip.active .rating-pip-text { color: #c4d4c8; }
        [data-theme="dark"] .rating-set { color: #8ba693; }
        [data-theme="dark"] .rating-delta { background: #1a2f22; border-color: #2e4d37; color: #73b885; }
        [data-theme="dark"] .practice-saved-badge { background: rgba(111,168,126,0.15); color: #73b885; }

        [data-theme="dark"] .ex-filter-btn { background: rgba(255,255,255,0.05); border-color: #2a3d2e; color: #8ba693; }
        [data-theme="dark"] .ex-filter-btn:hover { background: rgba(255,255,255,0.08); border-color: #3d5945; color: #e4ede5; }
        [data-theme="dark"] .ex-filter-btn.active { background: #2e4735; border-color: #6fa87e; color: #e4ede5; }

        [data-theme="dark"] .exercise-card { background: rgba(255,255,255,0.04); border-color: #2a3d2e; color: #e4ede5; }
        [data-theme="dark"] .exercise-card:hover { background: rgba(255,255,255,0.08); border-color: var(--card-color, #4a7a58); box-shadow: 0 16px 36px rgba(0,0,0,0.4); }
        [data-theme="dark"] .ex-card-emoji { background: rgba(255,255,255,0.08); }
        [data-theme="dark"] .ex-card-tag { background: #1e3327; color: #6fa87e; }
        [data-theme="dark"] .ex-card-duration { color: #5e7866; }
        [data-theme="dark"] .ex-card-title { color: #e4ede5; }
        [data-theme="dark"] .ex-card-sub { color: #8ba693; }
        [data-theme="dark"] .ex-card-desc { color: #8ba693; }
        [data-theme="dark"] .ex-card-research { background: rgba(255,255,255,0.04); color: #7f9986; }
        [data-theme="dark"] .ex-card-start { color: #6fa87e; }

        [data-theme="dark"] .active-ex-header h2 { color: #e4ede5; }
        [data-theme="dark"] .active-ex-header h2 em { color: #6fa87e; }
        [data-theme="dark"] .audio-mini-btn { background: rgba(255,255,255,0.06); border-color: #2a3d2e; color: #c4d4c8; }
        [data-theme="dark"] .audio-mini-btn.active { background: #1e3327; border-color: #4a7a58; color: #6fa87e; }

        [data-theme="dark"] .breath-zone { background: rgba(255,255,255,0.04); border-color: #2a3d2e; }
        [data-theme="dark"] .breath-ring { background: radial-gradient(circle, color-mix(in srgb, var(--bcolor, #8baed0) 16%, #182118), transparent 70%); border-color: var(--bcolor, #8baed0); box-shadow: 0 16px 45px rgba(0,0,0,0.45); }
        [data-theme="dark"] .breath-cue { color: #e4ede5; }
        [data-theme="dark"] .breath-count { color: #e4ede5; }
        [data-theme="dark"] .breath-instruction { color: #c4d4c8; }
        [data-theme="dark"] .breath-ctrl-btn { background: rgba(255,255,255,0.06); border-color: #2a3d2e; color: #c4d4c8; }
        [data-theme="dark"] .breath-ctrl-btn:hover { background: rgba(255,255,255,0.1); border-color: #4a7a58; }
        [data-theme="dark"] .breath-round-dot { background: #2a3d2e; }
        [data-theme="dark"] .breath-round-label { color: #5e7866; }

        [data-theme="dark"] .prompt-zone { background: rgba(255,255,255,0.04); border-color: #2a3d2e; }
        [data-theme="dark"] .prompt-number { color: #5e7866; }
        [data-theme="dark"] .prompt-text { color: #e4ede5; }
        [data-theme="dark"] .prompt-sub { color: #8ba693; }
        [data-theme="dark"] .prompt-chip-hint { color: #5e7866; }
        [data-theme="dark"] .prompt-suggestion-chip { background: rgba(255,255,255,0.06); border-color: #2a3d2e; color: #c4d4c8; }
        [data-theme="dark"] .prompt-suggestion-chip:hover { background: #1e3327; border-color: #4a7a58; color: #6fa87e; }

        [data-theme="dark"] .defusion-mirror { background: #1d1828; border-left-color: #8c73b8; }
        [data-theme="dark"] .defusion-mirror p { color: #d8cce8; }
        [data-theme="dark"] .defusion-mirror em { color: #c6aee6; }
        [data-theme="dark"] .defusion-mirror small { color: #887a9e; }

        [data-theme="dark"] .prompt-note { background: rgba(255,255,255,0.05); border-color: #2a3d2e; color: #e4ede5; }
        [data-theme="dark"] .prompt-note:focus { border-color: #4a7a58; box-shadow: 0 0 0 3px rgba(111,168,126,0.15); }
        [data-theme="dark"] .prompt-note::placeholder { color: #3d5548; }

        [data-theme="dark"] .exercise-done { background: rgba(255,255,255,0.04); border-color: #2a3d2e; }
        [data-theme="dark"] .done-check { background: #1e3327; color: #6fa87e; box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        [data-theme="dark"] .done-message { color: #e4ede5; }
        [data-theme="dark"] .done-message strong { color: #73b885; }
        [data-theme="dark"] .done-research { color: #8ba693; }

        [data-theme="dark"] .ai-insight-btn { background: linear-gradient(135deg, #221a30, #2a203d); border-color: #3c2f55; color: #cbb4eb; }
        [data-theme="dark"] .ai-insight-btn:hover { border-color: #a796c8; box-shadow: 0 8px 22px rgba(0,0,0,0.4); }
        [data-theme="dark"] .ai-spin { border-color: rgba(203,180,235,0.25); border-top-color: #cbb4eb; }
        [data-theme="dark"] .ai-reply-card { background: #1b1626; border-color: #34284d; color: #d7cde5; }
        [data-theme="dark"] .ai-reply-card p { color: #d7cde5; }
        [data-theme="dark"] .ai-reply-tag { color: #b39cd8; }
        [data-theme="dark"] .ai-reply-link { color: #cbb4eb; }

        [data-theme="dark"] .intervention-art {
          background: radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--mood-accent, #6fa87e) 15%, #182118), transparent 35%),
                      linear-gradient(145deg, #18241b, #1d2520 65%, #221d2a);
          box-shadow: inset 0 1px rgba(255,255,255,.05), 0 24px 70px rgba(0, 0, 0, 0.35);
        }
        [data-theme="dark"] .int-art-ring { border-color: rgba(255, 255, 255, 0.08); }
        [data-theme="dark"] .int-art-center { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.16); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3); }
        [data-theme="dark"] .int-art-label small { color: #5e7866; }
        [data-theme="dark"] .int-art-label p { color: #6fa87e; }
        [data-theme="dark"] .int-art-infocard { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: #8ba693; }
        [data-theme="dark"] .int-art-infocard strong { color: #e4ede5; }
        [data-theme="dark"] .int-research-strip { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.12); color: #6fa87e; }

        /* footer */
        [data-theme="dark"] .checkin-rock-footer { color: #3d5548; }
        [data-theme="dark"] .checkin-rock-footer span { color: #8a7040; }
      `}</style>
    </div>
  );
}

export default CheckIn;