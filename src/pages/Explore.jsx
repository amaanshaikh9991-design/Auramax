import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import { useTheme } from "../context/ThemeContext";

const CATEGORIES = [
  { id: "all", label: "All Situations", icon: "✦" },
  { id: "academics", label: "Classroom & Academics", icon: "📚" },
  { id: "social", label: "Friends & Boundaries", icon: "🤝" },
  { id: "teamwork", label: "Projects & Setbacks", icon: "💡" },
];

const SCENARIOS = [
  {
    id: "group-project",
    category: "teamwork",
    emoji: "🧑‍🤝‍🧑",
    title: "The Group Project",
    blurb: "A teammate isn't contributing and the deadline is close.",
    themeColor: {
      lightBg: "#FFF1EB",
      lightBorder: "#F3D2C4",
      lightAccent: "#D95D39",
      darkBg: "#261914",
      darkBorder: "#4A2F24",
      darkAccent: "#F28261",
    },
    other: "Jordan",
    setup:
      "Your group presentation is due in three days. Jordan hasn't finished their slides and hasn't replied in the group chat all week. The rest of the team is getting stressed and frustrated.",
    choices: [
      {
        id: "a",
        label: "Message Jordan privately and ask what's going on",
        badge: "Assertive & Kind",
        tone: "good",
        lines: [
          { who: "you", text: "Hey Jordan, I noticed the slides aren't done yet. Is everything okay? I'd really like to help if you're stuck." },
          { who: "them", text: "Honestly, I've been completely swamped with family stuff and didn't know where to start on the analysis." },
          { who: "you", text: "No worries at all, thanks for telling me. Want to take just the research summary section? I'll send you my notes to make it easy." },
          { who: "them", text: "That would be a lifesaver. I'll have that section finished by tomorrow evening, promise." },
        ],
        consequence:
          "Jordan feels respected rather than publicly attacked. By offering a concrete, bite-sized next step, you lowered their overwhelm. The team gets the slides and nobody leaves with hurt feelings.",
        reflect: "When was the last time someone checked in on your situation before assuming you were slacking?",
        tip: "Inquiry before confrontation. Ask first, then break the roadblock into one specific, low-friction task.",
        summaryOutcome: "Private empathy + smaller task leads to completed work and preserved friendship.",
      },
      {
        id: "b",
        label: "Call them out in the group chat",
        badge: "Confrontational",
        tone: "tough",
        lines: [
          { who: "you", text: "Some people clearly aren't pulling their weight. The deadline is in three days and it's not fair to the rest of us." },
          { who: "them", text: "Is that directed at me? You have no idea what I've been dealing with this week." },
          { who: "narr", text: "The group chat goes dead silent. Jordan stops opening messages and the tension lingers for the rest of the semester." },
        ],
        consequence:
          "Jordan feels humiliated in front of their peers and retreats into defensive silence. You still don't have the slides, and now the entire group dynamic is hostile.",
        reflect: "How would you react if a classmate called you out publicly while you were already struggling?",
        tip: "Public call-outs protect your ego in the moment, but rarely get the work done. A private direct chat keeps the focus on solving the problem, not defending pride.",
        summaryOutcome: "Public shame breeds defensiveness. The slides stay unfinished and relationships sour.",
      },
      {
        id: "c",
        label: "Silently do Jordan's part yourself late at night",
        badge: "Martyrdom / Avoidant",
        tone: "mixed",
        lines: [
          { who: "narr", text: "You stay awake until 2:30 a.m. frantically finishing Jordan's portion of the slide deck yourself." },
          { who: "you", text: "Hey team, don't worry about Jordan's part, I finished it last night." },
          { who: "them", text: "Oh wow, thanks so much! Really appreciate it!" },
          { who: "narr", text: "You feel exhausted during your 9 a.m. exam the next day, with a quiet bitterness building inside." },
        ],
        consequence:
          "The project gets handed in, but you paid for it with sleep, health, and hidden resentment. Jordan never learns what happened and will likely repeat the pattern next time.",
        reflect: "What would you want to change so you don't feel responsible for everyone else's workload?",
        tip: "Rescuing people silently might feel noble, but it sets you up for chronic burnout. Communicating early protects both you and the standard of the work.",
        summaryOutcome: "Deadline met at the cost of your health. Enables future slacking and builds resentment.",
      },
    ],
  },
  {
    id: "speak-up",
    category: "academics",
    emoji: "🙋",
    title: "Speaking Up in Class",
    blurb: "You're lost in lecture, but the entire hall is quiet.",
    themeColor: {
      lightBg: "#EDF3FF",
      lightBorder: "#C7D9FC",
      lightAccent: "#3A69D9",
      darkBg: "#141F33",
      darkBorder: "#24375A",
      darkAccent: "#6B94F7",
    },
    other: "Prof. Rao",
    setup:
      "Your professor is explaining a complex core derivation and you've completely lost the thread. The lecture hall is dead silent, and you're convinced you're the only person who doesn't understand.",
    choices: [
      {
        id: "a",
        label: "Raise your hand and ask for clarification",
        badge: "Courageous & Direct",
        tone: "good",
        lines: [
          { who: "you", text: "Excuse me, Professor Rao. Could you explain where that third term came from in step two? I got lost there." },
          { who: "them", text: "Ah, excellent question! That's actually where most people stumble. Let me re-frame it with a quick diagram." },
          { who: "narr", text: "Two classmates beside you quietly exhale in relief and whisper: \"Thank goodness you asked that.\"" },
        ],
        consequence:
          "You get the concept clarified immediately in under two minutes, saving you hours of late-night confusion. You also gave half the class permission to breathe.",
        reflect: "What is the worst realistic outcome of asking a question? Is looking confused for 10 seconds worth 3 hours of struggling later?",
        tip: "If you are confused, at least 30% of the room is too. Asking is an act of service to the whole class.",
        summaryOutcome: "Immediate clarity, saves hours of studying, and helps fellow classmates.",
      },
      {
        id: "b",
        label: "Stay quiet and promise yourself you'll Google it later",
        badge: "Avoidant",
        tone: "mixed",
        lines: [
          { who: "narr", text: "You nod your head politely and quickly copy down symbols you don't understand." },
          { who: "narr", text: "At 11 p.m., after watching four YouTube videos, the notations are different and you're even more stressed." },
          { who: "you", text: "I should have just asked at 10 a.m. when the professor was right in front of me." },
        ],
        consequence:
          "You avoid momentary social discomfort, but pay for it with two stressful evening hours of second-guessing and fragmented online explanations.",
        reflect: "Why does asking in the moment feel so much riskier than it actually is?",
        tip: "Independent research is a valuable skill, but don't let it become a shield to hide fear of speaking up.",
        summaryOutcome: "Short-term relief traded for long-term confusion and unnecessary late-night study hours.",
      },
      {
        id: "c",
        label: "Catch the professor for 60 seconds right after class",
        badge: "Low-Pressure Step",
        tone: "good",
        lines: [
          { who: "you", text: "Hi Professor Rao, do you have one quick minute? I didn't quite catch how step two connected to the theorem." },
          { who: "them", text: "Sure thing! Walk with me to my office. Look at this equation right here..." },
          { who: "you", text: "Oh! That makes so much sense now. Thank you for taking a second." },
        ],
        consequence:
          "You get personalized one-on-one attention without having to speak before an audience, and your professor now associates your face with curious engagement.",
        reflect: "What smaller step can you take when raising your hand in front of 80 people feels too daunting?",
        tip: "You don't have to leap from silence to public speaking. Post-lecture chats are the perfect stepping stone.",
        summaryOutcome: "Personalized explanation without an audience, plus builds rapport with faculty.",
      },
    ],
  },
  {
    id: "rejection",
    category: "teamwork",
    emoji: "💌",
    title: "Handling Rejection",
    blurb: "You didn't get picked for a campus role, and it stings.",
    themeColor: {
      lightBg: "#F4EEFC",
      lightBorder: "#DDD0F7",
      lightAccent: "#7A4FD9",
      darkBg: "#221833",
      darkBorder: "#402E5C",
      darkAccent: "#A682F7",
    },
    other: "Maya (Club President)",
    setup:
      "You applied for a competitive student coordinator role in a club you love. An email just landed in your inbox thanking you for applying, but saying they chose other candidates.",
    choices: [
      {
        id: "a",
        label: "Reply with genuine gratitude and ask for growth feedback",
        badge: "Growth Mindset",
        tone: "good",
        lines: [
          { who: "you", text: "Hi Maya, thank you for letting me know. I really respect the club's work. If you have five minutes, is there one area I could strengthen for next cycle?" },
          { who: "them", text: "Hi! We were so impressed by your interview. The only factor was that the other candidate had event logistics experience. We'd love you to co-lead our next open workshop!" },
        ],
        consequence:
          "While the rejection still stings, you demonstrated uncommon professionalism. You gained actionable insight and positioned yourself first in line for the next opening.",
        reflect: "Can you separate your value as a person from a single committee's hiring decision?",
        tip: "A graceful, feedback-seeking response turns a closed door into a warm professional connection.",
        summaryOutcome: "Leaves a stellar impression, yields actionable feedback, and opens future doors.",
      },
      {
        id: "b",
        label: "Spiral into self-doubt and withdraw from the community",
        badge: "Self-Critical Spiral",
        tone: "tough",
        lines: [
          { who: "narr", text: "You delete the email immediately and close your laptop." },
          { who: "you", text: "I knew I wasn't cut out for this. Everyone else is just naturally more capable than me." },
          { who: "narr", text: "You stop attending the weekly club meetups and mute the announcement channel." },
        ],
        consequence:
          "You turn a specific role decision into an indictment of your entire self-worth. By withdrawing, you cut yourself off from friendships and growth opportunities.",
        reflect: "Would you talk to a close friend with the harshness you just used on yourself?",
        tip: "Rejection is an event, not an identity. Notice when your brain tries to generalize one 'no' into 'never'.",
        summaryOutcome: "Amplifies loneliness and isolates you from communities you genuinely care about.",
      },
      {
        id: "c",
        label: "Vent to a supportive friend first, then reset",
        badge: "Emotionally Balanced",
        tone: "good",
        lines: [
          { who: "you", text: "Hey, I didn't get the coordinator spot. I put so much work into it, it really hurts." },
          { who: "them", text: "Ugh, that really sucks! I know how hard you prepped. Want to grab boba and complain for 20 minutes?" },
          { who: "you", text: "Yes please. After that I'll figure out what other clubs are recruiting." },
        ],
        consequence:
          "You allow yourself to feel the disappointment without turning it inward. Having safe social support helps your nervous system reset so you can plan forward.",
        reflect: "Who are the friends in your life who let you be honest when things don't go your way?",
        tip: "Feel first, strategize second. Denying your disappointment just makes it linger longer.",
        summaryOutcome: "Validates feelings safely, prevents bitter spirals, and clears mental space to bounce back.",
      },
    ],
  },
  {
    id: "peer-pressure",
    category: "social",
    emoji: "🎒",
    title: "Dealing with Peer Pressure",
    blurb: "Friends want you to skip, but you have an important quiz.",
    themeColor: {
      lightBg: "#EBF7F0",
      lightBorder: "#C5E8D4",
      lightAccent: "#248A5B",
      darkBg: "#13261C",
      darkBorder: "#224A35",
      darkAccent: "#59C992",
    },
    other: "Sam",
    setup:
      "Your close friends are skipping tomorrow's afternoon lab to hang out at a new café in the city. They're hyping it up in the group chat, but you have a graded quiz in that session and you need the marks.",
    choices: [
      {
        id: "a",
        label: "Give a calm, clear 'no' and propose an alternative meetup",
        badge: "Confident Boundary",
        tone: "good",
        lines: [
          { who: "them", text: "Come on! It's just one lab. The professor won't even notice. Don't be boring!" },
          { who: "you", text: "I'd love to hang out, but I really need the marks on this quiz tomorrow. You guys go ahead, and let's meet up for dinner right after lab around 5:30?" },
          { who: "them", text: "Ah fair enough, good luck on the quiz! Definitely down for dinner, text us when you're out." },
        ],
        consequence:
          "You protected your academic standing without being defensive or preachy. Real friends will respect a clear boundary, especially when paired with an alternative.",
        reflect: "What makes saying 'no' feel like such a threat to friendship in the moment?",
        tip: "A strong 'no' sounds like: Validate connection + state boundary + propose future plan. No long apologies required.",
        summaryOutcome: "Keeps your grades safe, earns peer respect, and maintains social connection.",
      },
      {
        id: "b",
        label: "Cave into the pressure and skip the lab",
        badge: "People-Pleasing",
        tone: "tough",
        lines: [
          { who: "you", text: "Okay, fine... I guess I'll come along." },
          { who: "narr", text: "At the café, you're constantly checking the time, unable to relax because the missed quiz is gnawing at your mind." },
          { who: "narr", text: "The next week, you see a zero on your lab portal and regret spending $20 on coffee while losing 5% of your grade." },
        ],
        consequence:
          "You avoided two seconds of social friction, but paid for it with academic penalty, acute anxiety throughout the hangout, and reduced self-trust.",
        reflect: "Did skipping actually bring you fun, or did guilt ruin the entire afternoon?",
        tip: "When you say yes to someone else at the expense of your own values, you end up resenting them later.",
        summaryOutcome: "Damages your GPA, creates chronic anxiety, and erodes your own self-respect.",
      },
      {
        id: "c",
        label: "Make up an elaborate excuse so you don't look uncool",
        badge: "Avoidant White-Lie",
        tone: "mixed",
        lines: [
          { who: "you", text: "I have a sudden doctor appointment across town, otherwise I'd 100% come!" },
          { who: "them", text: "Oh no! Hope everything's okay! We'll reschedule for next week." },
          { who: "narr", text: "You take the quiz, but spend the whole hour worrying a friend might see you on campus and catch you lying." },
        ],
        consequence:
          "You took your quiz, but invented a tangled story you now have to remember. You reinforce the belief that your real priorities aren't acceptable to your friends.",
        reflect: "Why do we feel our honest academic goals need an apology or an excuse?",
        tip: "You don't need a medical emergency to say no. Caring about your education is a completely valid reason on its own.",
        summaryOutcome: "Saves the quiz score, but creates unnecessary stress and habituates avoidance.",
      },
    ],
  },
  {
    id: "boundaries",
    category: "social",
    emoji: "🌙",
    title: "Setting Boundaries with Friends",
    blurb: "A close friend relies on you constantly, and you're burning out.",
    themeColor: {
      lightBg: "#FFF8E3",
      lightBorder: "#F2E0AD",
      lightAccent: "#B8860B",
      darkBg: "#292412",
      darkBorder: "#4A401E",
      darkAccent: "#E5BE53",
    },
    other: "Priya",
    setup:
      "Your friend Priya calls or texts you past midnight almost every day to vent about relationship drama. You love and care for her deeply, but you're in the middle of midterm week and running on fumes.",
    choices: [
      {
        id: "a",
        label: "Set a kind, compassionate limit with an honest daytime offer",
        badge: "Compassionate Boundary",
        tone: "good",
        lines: [
          { who: "them", text: "Hey, are you awake? Everything is going wrong again and I really need to talk." },
          { who: "you", text: "Priya, I care about you so much and want to be there for you. I'm completely running on empty tonight with exams. Can we grab lunch tomorrow at 1 p.m. so I can give you my full attention?" },
          { who: "them", text: "Oh gosh, I didn't realize how late it was! I'm so sorry. Yes, let's please do lunch tomorrow. Get some sleep!" },
        ],
        consequence:
          "Priya realizes you're human too, not a 24/7 hotline. You get crucial sleep, and your conversation tomorrow will be far more present and helpful.",
        reflect: "Have you ever kept helping someone until you secretly started disliking them?",
        tip: "A boundary is not a wall to push people out; it's a door that shows how you can love them sustainably.",
        summaryOutcome: "Preserves your energy, deepens mutual respect, and prevents friend burnout.",
      },
      {
        id: "b",
        label: "Stay on call until 2:30 a.m. despite feeling exhausted",
        badge: "Self-Sacrifice",
        tone: "tough",
        lines: [
          { who: "you", text: "Yeah, sure, I'm here. What happened?" },
          { who: "narr", text: "You listen with your eyes burning, barely absorbing words, nodding off on the other end of the line." },
          { who: "narr", text: "The next day in your exam, your brain feels foggy and you snap irritably at Priya in text later." },
        ],
        consequence:
          "You gave support from an empty cup. Over time, unstated sacrifices turn into passive-aggressive resentment that silently poisons friendships.",
        reflect: "Who are you trying to protect when you refuse to admit you're exhausted?",
        tip: "You cannot pour from an empty kettle. Taking care of yourself is prerequisite to taking care of anyone else.",
        summaryOutcome: "Brain fog, tanked exam, and simmering resentment toward your close friend.",
      },
      {
        id: "c",
        label: "Leave the message on read and avoid her for three days",
        badge: "Ghosting / Shutting Down",
        tone: "mixed",
        lines: [
          { who: "narr", text: "You see the notification, get an overwhelming pang of dread, and flip your phone face-down." },
          { who: "them", text: "Did I do something wrong? Are you mad at me? Did I hurt you?" },
          { who: "narr", text: "Now you have twice as much anxiety: the exhaustion, plus the guilt of ghosting someone in distress." },
        ],
        consequence:
          "Silence leaves the other person to write their own painful script. A 10-second polite boundary takes far less emotional energy than three days of avoidance.",
        reflect: "How does it feel when someone you care about goes cold without an explanation?",
        tip: "Clarity is kindness. Even a one-sentence text prevents a hundred spirals of confusion.",
        summaryOutcome: "Generates intense mutual anxiety and turns an easy boundary into dramatic friction.",
      },
    ],
  },
  {
    id: "ask-professor",
    category: "academics",
    emoji: "🧑‍🏫",
    title: "Asking a Professor for Help",
    blurb: "You're falling behind and don't know where to start.",
    themeColor: {
      lightBg: "#FDF0F4",
      lightBorder: "#F7CBD7",
      lightAccent: "#C23B6B",
      darkBg: "#2B1621",
      darkBorder: "#4F283C",
      darkAccent: "#EB6B9C",
    },
    other: "Prof. Alvarez",
    setup:
      "You failed your first homework assignment and don't understand the last two weeks of material. The midterm is in 10 days, and you're intimidated to reach out because you fear appearing foolish.",
    choices: [
      {
        id: "a",
        label: "Visit office hours with one concrete problem you tried",
        badge: "Proactive & Prepared",
        tone: "good",
        lines: [
          { who: "you", text: "Hi Prof. Alvarez, I struggled on homework one and want to get ahead before the midterm. I tried problem 3 here, but got stuck at this substitution. Could you help me see where my reasoning broke?" },
          { who: "them", text: "I really appreciate you coming in early! Let me look at your work... ah, look here, you had the right instinct, but missed this boundary condition. Let's solve one together." },
          { who: "them", text: "You're much closer than you thought. Come back on Thursday if you want me to look over your next attempt." },
        ],
        consequence:
          "Professors love when students show their attempt. You leave with tailored clarity, a study ally, and high confidence for the exam.",
        reflect: "What assumptions do you make about professors that stop you from using their office hours?",
        tip: "Bring your attempt, even if it's messy or incomplete. It gives the professor a roadmap of how you think.",
        summaryOutcome: "Turns intimidation into mentorship, clarifies key concepts, and boosts midterm score.",
      },
      {
        id: "b",
        label: "Wait and hope it magically clicks before exam day",
        badge: "Denial / Procrastination",
        tone: "tough",
        lines: [
          { who: "narr", text: "You tell yourself you just need a quiet weekend to reread the textbook from page one." },
          { who: "narr", text: "The weekend slips away. It's now 48 hours before the midterm and the anxiety is paralyzing." },
          { who: "you", text: "It's too late to ask now. They'll just wonder why I didn't come two weeks ago." },
        ],
        consequence:
          "Waiting multiplies your stress exponentially. What was a 15-minute fix in office hours turns into panic, cramming, and poor exam performance.",
        reflect: "What feeling are you avoiding when you tell yourself you'll 'fix it later'?",
        tip: "The best time to ask for help was two weeks ago. The second best time is right now.",
        summaryOutcome: "Small knowledge gaps snowball into unavoidable panic and exam disappointment.",
      },
      {
        id: "c",
        label: "Send a panicked late-night email: 'I don't get anything'",
        badge: "Overwhelmed Cry",
        tone: "mixed",
        lines: [
          { who: "you", text: "Dear Prof. Alvarez, I am completely lost in this course and don't understand any of the material. What should I do?" },
          { who: "them", text: "Hi. Because the syllabus is broad, I can't reteach the course via email. Please review chapters 3-4 and bring specific questions to my Tuesday office hours." },
        ],
        consequence:
          "Reaching out took courage, but broad cries of 'I understand nothing' give the instructor no place to start. A targeted question gets tenfold better support.",
        reflect: "If a friend told you 'everything is bad', how hard would it be to know how to help them?",
        tip: "Frame your ask with: 'I understand concept A, but I get confused when transitioning to B.' Specificity unlocks helpful answers.",
        summaryOutcome: "Courageous first step, but delays actual resolution until specific questions are framed.",
      },
    ],
  },
];

const TONE_CONFIG = {
  good: {
    label: "Constructive Pathway",
    pill: "🌱 High Skill",
    lightBg: "rgba(86, 115, 99, 0.12)",
    lightBorder: "rgba(86, 115, 99, 0.35)",
    lightText: "#2d4b3b",
    darkBg: "rgba(111, 168, 126, 0.15)",
    darkBorder: "rgba(111, 168, 126, 0.4)",
    darkText: "#9fd3ae",
    icon: "🌱",
  },
  mixed: {
    label: "Mixed Consequences",
    pill: "🌤️ Mixed Outcome",
    lightBg: "rgba(230, 162, 60, 0.12)",
    lightBorder: "rgba(230, 162, 60, 0.35)",
    lightText: "#7b4f0b",
    darkBg: "rgba(247, 223, 160, 0.12)",
    darkBorder: "rgba(247, 223, 160, 0.35)",
    darkText: "#f0d38d",
    icon: "🌤️",
  },
  tough: {
    label: "Challenging Repercussion",
    pill: "🌧️ Risk of Burnout",
    lightBg: "rgba(224, 86, 74, 0.12)",
    lightBorder: "rgba(224, 86, 74, 0.35)",
    lightText: "#8a241b",
    darkBg: "rgba(255, 120, 107, 0.14)",
    darkBorder: "rgba(255, 120, 107, 0.4)",
    darkText: "#f89e95",
    icon: "🌧️",
  },
};

/* ==========================================================
   MAIN COMPONENT
   ========================================================== */

function Explore() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Scenario states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [scenarioId, setScenarioId] = useState(null);
  const [choiceId, setChoiceId] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [reflection, setReflection] = useState("");
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Explored paths stored in localStorage
  const [exploredPaths, setExploredPaths] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("antarang_sim_explored") || "{}");
    } catch {
      return {};
    }
  });

  // Antarang AI interactive state
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReply, setAiReply] = useState(null);
  const [aiSessionId, setAiSessionId] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Voice narration setup
  const [voiceOn, setVoiceOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);
  const speakToken = useRef(0);
  const topRef = useRef(null);

  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const currentScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) || null,
    [scenarioId]
  );

  const currentChoice = useMemo(
    () => currentScenario?.choices.find((c) => c.id === choiceId) || null,
    [currentScenario, choiceId]
  );

  // Track progress
  useEffect(() => {
    try {
      localStorage.setItem("antarang_sim_explored", JSON.stringify(exploredPaths));
    } catch {}
  }, [exploredPaths]);

  // Voice engine initialization
  useEffect(() => {
    if (!speechSupported) return;

    function populateVoices() {
      const list = window.speechSynthesis.getVoices();
      const english = list.filter((v) => /^en/i.test(v.lang));
      const preferred =
        english.find((v) =>
          /(samantha|zira|aria|jenny|natural|google uk english female|female)/i.test(v.name)
        ) ||
        english[0] ||
        null;
      setVoice(preferred);
    }

    populateVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", populateVoices);

    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", populateVoices);
      window.speechSynthesis.cancel();
    };
  }, [speechSupported]);

  function stopVoice() {
    if (!speechSupported) return;
    speakToken.current += 1;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function speakLines(lines) {
    if (!speechSupported) return;
    const list = (Array.isArray(lines) ? lines : [lines]).filter(Boolean);
    if (!list.length) return;

    window.speechSynthesis.cancel();
    const token = ++speakToken.current;
    setSpeaking(true);

    list.forEach((text, index) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.02;
      if (voice) utterance.voice = voice;

      if (index === list.length - 1) {
        const handleEnd = () => {
          if (token === speakToken.current) setSpeaking(false);
        };
        utterance.onend = handleEnd;
        utterance.onerror = handleEnd;
      }

      window.speechSynthesis.speak(utterance);
    });
  }

  function toggleVoice() {
    if (voiceOn) {
      setVoiceOn(false);
      stopVoice();
      return;
    }
    setVoiceOn(true);
    speakCurrentView();
  }

  function getScenarioScript(sc, ch) {
    if (sc && ch) {
      const dialogue = ch.lines.map((l) => {
        if (l.who === "you") return `You say: ${l.text}`;
        if (l.who === "them") return `${sc.other} says: ${l.text}`;
        return l.text;
      });
      return [
        `Here is how that choice unfolds.`,
        ...dialogue,
        `What happens next. ${ch.consequence}`,
        `Something to consider. ${ch.reflect}`,
        `A skill tip. ${ch.tip}`,
      ];
    }
    if (sc) {
      return [
        `${sc.title}.`,
        sc.setup,
        `What would you do? Pick one of the three options on your screen.`,
      ];
    }
    return [
      "Welcome to Interactive Life Simulations.",
      "Step into real-life student moments, make a decision, and see how the situation might unfold without any pressure.",
    ];
  }

  function speakCurrentView() {
    speakLines(getScenarioScript(currentScenario, currentChoice));
  }

  function scrollToTop() {
    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  /* ---------- Navigation Handlers ---------- */

  function handleSelectScenario(sc) {
    setScenarioId(sc.id);
    setChoiceId(null);
    setShowComparison(false);
    setReflection("");
    setSavedFeedback(false);
    setAiReply(null);
    setAiError(null);
    scrollToTop();
    if (voiceOn) speakLines(getScenarioScript(sc, null));
  }

  function handleSelectChoice(ch) {
    setChoiceId(ch.id);
    setShowComparison(false);
    setReflection("");
    setSavedFeedback(false);
    setAiReply(null);
    setAiError(null);

    // Save explored path
    setExploredPaths((prev) => {
      const currentList = prev[currentScenario.id] || [];
      if (currentList.includes(ch.id)) return prev;
      return { ...prev, [currentScenario.id]: [...currentList, ch.id] };
    });

    scrollToTop();
    if (voiceOn) speakLines(getScenarioScript(currentScenario, ch));
  }

  function handleBackToChoices() {
    setChoiceId(null);
    setShowComparison(false);
    setReflection("");
    setSavedFeedback(false);
    setAiReply(null);
    setAiError(null);
    scrollToTop();
    if (voiceOn && currentScenario) speakLines(getScenarioScript(currentScenario, null));
  }

  function handleBackToMenu() {
    setScenarioId(null);
    setChoiceId(null);
    setShowComparison(false);
    setReflection("");
    setSavedFeedback(false);
    setAiReply(null);
    setAiError(null);
    stopVoice();
    scrollToTop();
  }

  /* ---------- Save to My Journey ---------- */

  function handleSaveToJourney() {
    if (!currentScenario || !currentChoice) return;

    try {
      const stored = JSON.parse(localStorage.getItem("antarang_practice_log") || "[]");
      const entry = {
        id: `sim-${Date.now()}`,
        scenarioId: currentScenario.id,
        title: `${currentScenario.title} — ${currentChoice.badge}`,
        emoji: currentScenario.emoji,
        dateStr: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        beforeRating: currentChoice.tone === "tough" ? 2 : currentChoice.tone === "mixed" ? 3 : 4,
        afterRating: 5,
        note: reflection.trim() || currentChoice.consequence,
        category: "Life Simulation",
      };

      const updated = [entry, ...stored.filter((i) => i.title !== entry.title)];
      localStorage.setItem("antarang_practice_log", JSON.stringify(updated));
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 4000);
    } catch (e) {
      console.error("Could not save to practice log:", e);
    }
  }

  /* ---------- Antarang AI Integration ---------- */

  async function handleAskAI(customPrompt = null) {
    const question = (customPrompt || aiMessage).trim();
    if (!question || aiLoading) return;

    setAiLoading(true);
    setAiError(null);

    const simulationContext = `I am practicing a student life situation in Antarang Life Simulations.
Situation: "${currentScenario.title}" (${currentScenario.setup})
My Choice: "${currentChoice.label}" (${currentChoice.badge})
Consequence in simulation: "${currentChoice.consequence}"
My question/thought: "${question}"

Please provide a warm, empathetic, and actionable response for a student. Keep it encouraging, practical, and grounded in student mental wellbeing.`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: simulationContext,
          sessionId: aiSessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to consult Antarang AI.");
      }

      if (data.sessionId) {
        setAiSessionId(data.sessionId);
      }
      setAiReply(data.reply);
      setAiMessage("");
    } catch (err) {
      console.warn("AI consultation fallback:", err);
      // Graceful local fallback if offline or unauthenticated
      setAiReply(
        `Here is a reflection from Antarang: When you chose to "${currentChoice.label}", you were navigating a very real student friction. Remember that communicating assertively is a muscle that takes practice. Don't be afraid to take a breath, set one small boundary, and be compassionate with yourself.`
      );
    } finally {
      setAiLoading(false);
    }
  }

  // Filtered scenarios
  const filteredScenarios = useMemo(() => {
    if (selectedCategory === "all") return SCENARIOS;
    return SCENARIOS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Overall path metrics
  const totalExplored = Object.values(exploredPaths).reduce(
    (acc, arr) => acc + arr.length,
    0
  );
  const totalAvailablePaths = SCENARIOS.length * 3;
  const progressPercent = Math.round((totalExplored / totalAvailablePaths) * 100);

  /* ==========================================================
     SUB-COMPONENTS & VIEWS
     ========================================================== */

  // Voice guide top ribbon
  const VoiceGuideRibbon = (
    <div className="sim-voice-bar">
      <div className="sim-voice-visual" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`sim-voice-bar-line ${speaking ? "is-speaking" : ""}`}
            style={{ animationDelay: `${i * 0.14}s` }}
          />
        ))}
      </div>

      <div className="sim-voice-info">
        <strong>
          {speechSupported
            ? voiceOn
              ? speaking
                ? "Antarang Voice Guide is reading aloud..."
                : "Voice Guide is ready and listening"
              : "Listen to the simulation aloud?"
            : "Voice guide is unsupported in this browser"}
        </strong>
        <p>
          {speechSupported
            ? "Narrates situations and dialogue so you can listen and absorb naturally."
            : "You can read through all scenarios below. Modern Chrome, Edge, or Safari support voice."}
        </p>
      </div>

      {speechSupported && (
        <div className="sim-voice-actions">
          {voiceOn && (
            <button
              type="button"
              className="sim-btn sim-btn-ghost"
              onClick={() => (speaking ? stopVoice() : speakCurrentView())}
            >
              {speaking ? "⏹ Stop audio" : "🔁 Replay"}
            </button>
          )}
          <button
            type="button"
            className={`sim-btn ${voiceOn ? "sim-btn-active-voice" : "sim-btn-primary"}`}
            onClick={toggleVoice}
          >
            {voiceOn ? "🔇 Turn voice off" : "🔊 Enable voice"}
          </button>
        </div>
      )}
    </div>
  );

  /* ----------------------------------------------------------
     1. MENU VIEW: Scenario selection & catalog
     ---------------------------------------------------------- */
  function renderMenu() {
    return (
      <div className="sim-menu-view">
        <header className="sim-header">
          <div className="sim-eyebrow">
            <span>✦</span> INTERACTIVE LIFE SKILLS LAB
          </div>
          <h1 className="sim-title">
            What would you <span>do?</span>
          </h1>
          <p className="sim-intro">
            Step into authentic student situations, decide how you'd respond, and see how
            conversations unfold in real time. It's a low-pressure sandbox: nothing is graded,
            and you can experiment safely with different life skills.
          </p>
        </header>

        {VoiceGuideRibbon}

        {/* Progress & Stats Bar */}
        <div className="sim-progress-card">
          <div className="sim-progress-header">
            <div>
              <span className="sim-progress-kicker">YOUR EXPLORATION PROGRESS</span>
              <strong className="sim-progress-title">
                {totalExplored === 0
                  ? "Pick your first simulation below"
                  : `${totalExplored} of ${totalAvailablePaths} paths discovered (${progressPercent}%)`}
              </strong>
            </div>
            <div className="sim-progress-badge">
              {totalExplored >= totalAvailablePaths
                ? "🏆 All Pathways Mastered!"
                : `${totalExplored} paths tried`}
            </div>
          </div>
          <div className="sim-progress-track">
            <div
              className="sim-progress-fill"
              style={{ width: `${Math.max(6, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="sim-category-nav">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`sim-cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scenarios Grid */}
        <div className="sim-grid">
          {filteredScenarios.map((sc) => {
            const completedPaths = (exploredPaths[sc.id] || []).length;
            const isFullyMastered = completedPaths === sc.choices.length;
            const themeBg = isDark ? sc.themeColor.darkBg : sc.themeColor.lightBg;
            const themeBorder = isDark ? sc.themeColor.darkBorder : sc.themeColor.lightBorder;
            const themeAccent = isDark ? sc.themeColor.darkAccent : sc.themeColor.lightAccent;

            return (
              <div
                key={sc.id}
                className="sim-card"
                style={{
                  "--sim-card-bg": themeBg,
                  "--sim-card-border": themeBorder,
                  "--sim-card-accent": themeAccent,
                }}
                onClick={() => handleSelectScenario(sc)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectScenario(sc);
                  }
                }}
              >
                <div className="sim-card-top">
                  <div className="sim-card-icon-wrap">{sc.emoji}</div>
                  {isFullyMastered && (
                    <span className="sim-badge-mastered">✓ Mastered</span>
                  )}
                </div>

                <div className="sim-card-body">
                  <h3 className="sim-card-title">{sc.title}</h3>
                  <p className="sim-card-blurb">{sc.blurb}</p>
                </div>

                <div className="sim-card-footer">
                  <span className="sim-card-count">
                    {completedPaths === 0
                      ? "Start this simulation →"
                      : isFullyMastered
                      ? "All 3 paths explored ✓"
                      : `${completedPaths} of ${sc.choices.length} paths tried`}
                  </span>
                  <span className="sim-card-arrow">→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Strip */}
        <div className="sim-support-strip">
          <div className="sim-support-icon">🫶</div>
          <div className="sim-support-content">
            <h4>Navigating a tough situation in real life?</h4>
            <p>
              Simulations help you practice, but having a human listening ear helps even more.
              Check out our confidential support and campus resources.
            </p>
          </div>
          <Link to="/app/support" className="sim-btn sim-btn-outline">
            See Support Options →
          </Link>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
     2. SETUP VIEW: Scenario context & choices
     ---------------------------------------------------------- */
  function renderSetup() {
    const sc = currentScenario;
    const completedList = exploredPaths[sc.id] || [];
    const themeBg = isDark ? sc.themeColor.darkBg : sc.themeColor.lightBg;
    const themeBorder = isDark ? sc.themeColor.darkBorder : sc.themeColor.lightBorder;
    const themeAccent = isDark ? sc.themeColor.darkAccent : sc.themeColor.lightAccent;

    return (
      <div className="sim-setup-view">
        <button type="button" className="sim-back-btn" onClick={handleBackToMenu}>
          ← Back to all situations
        </button>

        {VoiceGuideRibbon}

        {/* Scenario Hero Box */}
        <section
          className="sim-scenario-hero"
          style={{
            "--sim-hero-bg": themeBg,
            "--sim-hero-border": themeBorder,
            "--sim-hero-accent": themeAccent,
          }}
        >
          <div className="sim-scenario-hero-header">
            <span className="sim-scenario-hero-icon">{sc.emoji}</span>
            <div>
              <span className="sim-scenario-kicker">SIMULATION SCENARIO</span>
              <h2 className="sim-scenario-title">{sc.title}</h2>
            </div>
          </div>
          <p className="sim-scenario-setup-text">{sc.setup}</p>
        </section>

        {/* Decision Section */}
        <div className="sim-decision-header">
          <div>
            <h3 className="sim-decision-title">What would you do next?</h3>
            <p className="sim-decision-subtitle">
              Choose an approach to see how the conversation might unfold and what ripple effects it creates.
            </p>
          </div>
        </div>

        <div className="sim-choices-list">
          {sc.choices.map((ch, idx) => {
            const hasSeen = completedList.includes(ch.id);
            const letter = String.fromCharCode(65 + idx);

            return (
              <button
                key={ch.id}
                type="button"
                className={`sim-choice-btn ${hasSeen ? "is-seen" : ""}`}
                onClick={() => handleSelectChoice(ch)}
              >
                <span className="sim-choice-letter">
                  {hasSeen ? "✓" : letter}
                </span>
                <div className="sim-choice-content">
                  <div className="sim-choice-label">{ch.label}</div>
                  <span className="sim-choice-badge-tag">{ch.badge}</span>
                </div>
                <span className="sim-choice-arrow">→</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------
     3. OUTCOME VIEW: Dialogue, consequences, AI & comparison
     ---------------------------------------------------------- */
  function renderOutcome() {
    const sc = currentScenario;
    const ch = currentChoice;
    const tone = TONE_CONFIG[ch.tone] || TONE_CONFIG.good;
    const doneList = exploredPaths[sc.id] || [];
    const otherChoices = sc.choices.filter((c) => c.id !== ch.id);
    const nextScenario =
      SCENARIOS[(SCENARIOS.findIndex((s) => s.id === sc.id) + 1) % SCENARIOS.length];

    const themeBg = isDark ? sc.themeColor.darkBg : sc.themeColor.lightBg;
    const themeBorder = isDark ? sc.themeColor.darkBorder : sc.themeColor.lightBorder;
    const themeAccent = isDark ? sc.themeColor.darkAccent : sc.themeColor.lightAccent;

    return (
      <div className="sim-outcome-view">
        <div className="sim-outcome-nav-strip">
          <button type="button" className="sim-back-btn" onClick={handleBackToChoices}>
            ← Try a different choice
          </button>
          <button
            type="button"
            className="sim-btn sim-btn-ghost sim-compare-toggle"
            onClick={() => setShowComparison(!showComparison)}
          >
            {showComparison ? "👁️ Hide Side-by-Side Comparison" : "⚖️ Compare All 3 Pathways"}
          </button>
        </div>

        {VoiceGuideRibbon}

        {/* Selected Choice Pill */}
        <div
          className="sim-selected-pill"
          style={{
            "--sim-pill-bg": themeBg,
            "--sim-pill-border": themeBorder,
          }}
        >
          <div className="sim-selected-meta">
            <span>IN {sc.title.toUpperCase()}</span>
            <strong>YOU CHOSE:</strong>
          </div>
          <div className="sim-selected-text">"{ch.label}"</div>
        </div>

        {/* Side-by-side Decision Comparison Matrix (Toggleable) */}
        {showComparison && (
          <div className="sim-comparison-drawer">
            <div className="sim-comparison-header">
              <h3>Decision Matrix: How each choice plays out</h3>
              <p>Compare the psychological dynamics and relationship consequences at a glance.</p>
            </div>
            <div className="sim-comparison-grid">
              {sc.choices.map((item) => {
                const isSelected = item.id === ch.id;
                const itemTone = TONE_CONFIG[item.tone];
                return (
                  <div
                    key={item.id}
                    className={`sim-comp-card ${isSelected ? "is-selected-card" : ""}`}
                  >
                    <div className="sim-comp-top">
                      <span className="sim-comp-badge">{item.badge}</span>
                      <span className="sim-comp-pill">{itemTone.pill}</span>
                    </div>
                    <h4 className="sim-comp-title">"{item.label}"</h4>
                    <p className="sim-comp-outcome">{item.summaryOutcome}</p>
                    <div className="sim-comp-tip">
                      <strong>Takeaway:</strong> {item.tip}
                    </div>
                    {!isSelected && (
                      <button
                        type="button"
                        className="sim-comp-switch-btn"
                        onClick={() => handleSelectChoice(item)}
                      >
                        Play this path →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dialogue Stream Section */}
        <section className="sim-dialogue-card">
          <div className="sim-dialogue-header">
            <span className="sim-dialogue-kicker">SCENARIO UNFOLDS</span>
            <h3 className="sim-dialogue-title">Here's how the conversation might go</h3>
          </div>

          <div className="sim-dialogue-stream">
            {ch.lines.map((line, idx) => {
              if (line.who === "narr") {
                return (
                  <div key={idx} className="sim-bubble-narrator">
                    <p>{line.text}</p>
                  </div>
                );
              }

              const isMe = line.who === "you";
              return (
                <div
                  key={idx}
                  className={`sim-bubble-row ${isMe ? "is-user" : "is-other"}`}
                >
                  <span className="sim-bubble-speaker">
                    {isMe ? "You" : sc.other}
                  </span>
                  <div className="sim-bubble-bubble">
                    <p>{line.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Consequence Analysis */}
        <section
          className="sim-consequence-card"
          style={{
            "--tone-bg": isDark ? tone.darkBg : tone.lightBg,
            "--tone-border": isDark ? tone.darkBorder : tone.lightBorder,
            "--tone-text": isDark ? tone.darkText : tone.lightText,
          }}
        >
          <div className="sim-consequence-badge">
            <span>{tone.icon}</span> {tone.label}
          </div>
          <h4 className="sim-consequence-heading">What could happen next</h4>
          <p className="sim-consequence-body">{ch.consequence}</p>
        </section>

        {/* Student Skill Tip */}
        <section className="sim-tip-card">
          <span className="sim-tip-icon">💡</span>
          <div className="sim-tip-content">
            <strong>Skill Tip for Real Life:</strong>
            <p>{ch.tip}</p>
          </div>
        </section>

        {/* Reflection & Journey Save */}
        <section className="sim-reflection-card">
          <div className="sim-reflection-header">
            <span className="sim-reflection-kicker">PAUSE & NOTICE</span>
            <h4 className="sim-reflection-title">Something to think about</h4>
          </div>
          <p className="sim-reflection-prompt">{ch.reflect}</p>

          <textarea
            className="sim-reflection-input"
            rows={3}
            maxLength={400}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write a private note on what you noticed or how this connects to your life..."
          />
          <div className="sim-reflection-meta">
            <span>{reflection.length}/400 characters</span>
            <button
              type="button"
              className="sim-btn sim-btn-outline"
              onClick={handleSaveToJourney}
            >
              {savedFeedback ? "✓ Saved to My Journey!" : "✦ Save insight to My Journey"}
            </button>
          </div>
        </section>

        {/* Antarang AI Coach Section */}
        <section className="sim-ai-card">
          <div className="sim-ai-header">
            <div className="sim-ai-badge">✦ ANTARANG AI COACH</div>
            <h4 className="sim-ai-title">Want personalized advice on this moment?</h4>
            <p className="sim-ai-subtitle">
              Ask Antarang AI how to phrase your boundary, handle the anxiety, or adapt this to your own life.
            </p>
          </div>

          {/* Quick Prompt Pills */}
          <div className="sim-ai-quick-prompts">
            {[
              "Give me an exact polite script to say in this situation",
              "How do I overcome the anxiety or guilt of speaking up?",
              "What should I do if the other person gets defensive or angry?",
              "How can I prepare so I don't freeze next time?",
            ].map((promptText, pIdx) => (
              <button
                key={pIdx}
                type="button"
                className="sim-ai-prompt-pill"
                onClick={() => handleAskAI(promptText)}
                disabled={aiLoading}
              >
                ✦ {promptText}
              </button>
            ))}
          </div>

          {/* Custom Prompt Input */}
          <div className="sim-ai-input-wrap">
            <input
              type="text"
              className="sim-ai-input"
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAskAI();
                }
              }}
              placeholder="Or ask your own question about this scenario..."
              disabled={aiLoading}
            />
            <button
              type="button"
              className="sim-btn sim-btn-primary sim-ai-submit"
              onClick={() => handleAskAI()}
              disabled={aiLoading || !aiMessage.trim()}
            >
              {aiLoading ? "Consulting..." : "Ask AI ✦"}
            </button>
          </div>

          {/* AI Response Display */}
          {aiLoading && (
            <div className="sim-ai-thinking">
              <span className="sim-ai-pulse" />
              <span>Antarang AI is thinking through your scenario...</span>
            </div>
          )}

          {aiReply && !aiLoading && (
            <div className="sim-ai-reply-box">
              <div className="sim-ai-reply-header">
                <span className="sim-ai-reply-avatar">✦</span>
                <strong>Antarang AI Perspective</strong>
              </div>
              <p className="sim-ai-reply-text">{aiReply}</p>
              <div className="sim-ai-reply-footer">
                <button
                  type="button"
                  className="sim-btn sim-btn-ghost sim-ai-continue-btn"
                  onClick={() =>
                    navigate(aiSessionId ? `/app/chat/${aiSessionId}` : "/app/chat")
                  }
                >
                  Continue this chat in Antarang AI →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Alternative Paths in this scenario */}
        {otherChoices.length > 0 && (
          <div className="sim-other-choices-wrap">
            <h4 className="sim-other-title">Curious how other responses play out?</h4>
            <div className="sim-other-grid">
              {otherChoices.map((other) => {
                const isSeen = doneList.includes(other.id);
                return (
                  <button
                    key={other.id}
                    type="button"
                    className="sim-other-card"
                    onClick={() => handleSelectChoice(other)}
                  >
                    <span className="sim-other-tag">
                      {isSeen ? "✓ Already tested" : "Try this next"}
                    </span>
                    <strong className="sim-other-label">{other.label}</strong>
                    <span className="sim-other-badge">{other.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="sim-bottom-actions">
          <button
            type="button"
            className="sim-btn sim-btn-primary"
            onClick={() => handleSelectScenario(nextScenario)}
          >
            Next Simulation: {nextScenario.title} →
          </button>
          <button
            type="button"
            className="sim-btn sim-btn-outline"
            onClick={handleBackToMenu}
          >
            All Situations
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================================
     MAIN RENDER
     ========================================================== */
  return (
    <div className="sim-page">
      <div className="sim-container" ref={topRef}>
        {!currentScenario && renderMenu()}
        {currentScenario && !currentChoice && renderSetup()}
        {currentScenario && currentChoice && renderOutcome()}
      </div>

      {/* Embedded Component CSS matching Antarang Light & Dark Design */}
      <style>{`
        /* =====================================================
           ANTARANG LIFE SIMULATIONS — STYLES
           ===================================================== */
        
        .sim-page {
          width: 100%;
          min-height: 100vh;
          background: var(--app-bg, #f8f7f2);
          color: var(--app-text, #243238);
          padding: 32px 20px 80px;
          box-sizing: border-box;
          transition: background-color 0.25s ease, color 0.25s ease;
        }

        .sim-container {
          max-width: 960px;
          margin: 0 auto;
        }

        /* ── Header ────────────────────────────────────────── */
        .sim-header {
          margin-bottom: 24px;
        }

        .sim-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--app-green-dark, #3f5b4d);
          margin-bottom: 8px;
        }

        .sim-title {
          font-size: clamp(34px, 5.5vw, 52px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--app-text, #243238);
          margin: 0 0 14px;
        }

        .sim-title span {
          color: var(--app-green, #567363);
        }

        [data-theme="dark"] .sim-title span {
          color: var(--app-green-dark, #8ec09b);
        }

        .sim-intro {
          font-size: 16.5px;
          line-height: 1.6;
          color: var(--app-muted, #71807a);
          max-width: 660px;
          margin: 0;
        }

        /* ── Voice Guide Ribbon ────────────────────────────── */
        .sim-voice-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: var(--app-radius, 22px);
          padding: 14px 18px;
          margin-bottom: 24px;
          box-shadow: var(--app-shadow-small, 0 8px 24px rgba(45, 58, 51, 0.05));
        }

        .sim-voice-visual {
          display: flex;
          align-items: center;
          gap: 3.5px;
          height: 28px;
          width: 32px;
          flex-shrink: 0;
        }

        .sim-voice-bar-line {
          display: block;
          width: 4px;
          height: 24px;
          border-radius: 4px;
          background: var(--app-green, #567363);
          transform: scaleY(0.35);
          transform-origin: center;
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .sim-voice-bar-line.is-speaking {
          animation: simWave 0.9s ease-in-out infinite alternate;
        }

        @keyframes simWave {
          0% { transform: scaleY(0.25); }
          100% { transform: scaleY(1); }
        }

        .sim-voice-info {
          flex: 1 1 240px;
          min-width: 0;
        }

        .sim-voice-info strong {
          display: block;
          font-size: 14.5px;
          font-weight: 700;
          color: var(--app-text, #243238);
          margin-bottom: 2px;
        }

        .sim-voice-info p {
          font-size: 12.5px;
          color: var(--app-muted, #71807a);
          margin: 0;
          line-height: 1.45;
        }

        .sim-voice-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* ── Progress Card ─────────────────────────────────── */
        .sim-progress-card {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: var(--app-radius, 22px);
          padding: 16px 20px;
          margin-bottom: 22px;
        }

        .sim-progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .sim-progress-kicker {
          display: block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--app-muted, #71807a);
          margin-bottom: 2px;
        }

        .sim-progress-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--app-text, #243238);
        }

        .sim-progress-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--app-green-soft, #e8f1e9);
          color: var(--app-green-dark, #3f5b4d);
        }

        .sim-progress-track {
          width: 100%;
          height: 8px;
          background: var(--app-surface-soft, #f4f1e9);
          border-radius: 999px;
          overflow: hidden;
        }

        .sim-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--app-green, #567363), var(--app-green-dark, #3f5b4d));
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        /* ── Category Filter Pills ─────────────────────────── */
        .sim-category-nav {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 22px;
        }

        .sim-cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          border: 1px solid var(--app-border, #e7e4dc);
          background: var(--app-surface, #ffffff);
          color: var(--app-muted, #71807a);
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .sim-cat-pill:hover {
          border-color: var(--app-green, #567363);
          color: var(--app-text, #243238);
        }

        .sim-cat-pill.active {
          background: var(--app-green, #567363);
          border-color: var(--app-green, #567363);
          color: #ffffff;
        }

        [data-theme="dark"] .sim-cat-pill.active {
          background: var(--app-green-soft, #1e3327);
          border-color: var(--app-green-dark, #8ec09b);
          color: var(--app-green-dark, #8ec09b);
        }

        /* ── Scenario Cards Grid ───────────────────────────── */
        .sim-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
          margin-bottom: 32px;
        }

        .sim-card {
          background: var(--sim-card-bg);
          border: 1px solid var(--sim-card-border);
          border-radius: 24px;
          padding: 22px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 14px;
          min-height: 220px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
          outline: none;
        }

        .sim-card:hover, .sim-card:focus-visible {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
          border-color: var(--sim-card-accent);
        }

        .sim-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sim-card-icon-wrap {
          font-size: 32px;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--sim-card-border);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--app-shadow-small);
        }

        .sim-badge-mastered {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--app-green-soft, #e8f1e9);
          color: var(--app-green-dark, #3f5b4d);
          border: 1px solid var(--app-green, #567363);
        }

        .sim-card-body {
          flex: 1;
        }

        .sim-card-title {
          font-size: 20px;
          font-weight: 800;
          color: var(--app-text, #243238);
          margin: 0 0 6px;
          line-height: 1.25;
        }

        .sim-card-blurb {
          font-size: 14.5px;
          line-height: 1.5;
          color: var(--app-text, #243238);
          opacity: 0.85;
          margin: 0;
        }

        .sim-card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--sim-card-border);
          padding-top: 12px;
        }

        .sim-card-count {
          font-size: 13px;
          font-weight: 700;
          color: var(--sim-card-accent);
        }

        .sim-card-arrow {
          font-size: 16px;
          color: var(--sim-card-accent);
          transition: transform 0.2s ease;
        }

        .sim-card:hover .sim-card-arrow {
          transform: translateX(3px);
        }

        /* ── Support Strip ─────────────────────────────────── */
        .sim-support-strip {
          background: var(--app-surface, #ffffff);
          border: 1px dashed var(--app-border, #e7e4dc);
          border-radius: var(--app-radius, 22px);
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .sim-support-icon {
          font-size: 32px;
        }

        .sim-support-content {
          flex: 1 1 260px;
        }

        .sim-support-content h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 4px;
          color: var(--app-text, #243238);
        }

        .sim-support-content p {
          font-size: 13.5px;
          color: var(--app-muted, #71807a);
          margin: 0;
          line-height: 1.5;
        }

        /* ── Buttons ───────────────────────────────────────── */
        .sim-btn {
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 18px;
          border-radius: 14px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.18s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
        }

        .sim-btn-primary {
          background: var(--app-green, #567363);
          color: #ffffff;
        }

        .sim-btn-primary:hover:not(:disabled) {
          background: var(--app-green-dark, #3f5b4d);
          transform: translateY(-1px);
        }

        .sim-btn-outline {
          background: var(--app-surface, #ffffff);
          border-color: var(--app-border, #e7e4dc);
          color: var(--app-text, #243238);
        }

        .sim-btn-outline:hover:not(:disabled) {
          border-color: var(--app-green, #567363);
          color: var(--app-green-dark, #3f5b4d);
        }

        .sim-btn-ghost {
          background: transparent;
          color: var(--app-muted, #71807a);
          border-color: transparent;
        }

        .sim-btn-ghost:hover:not(:disabled) {
          color: var(--app-text, #243238);
          background: var(--app-surface-soft, #f4f1e9);
        }

        .sim-btn-active-voice {
          background: var(--app-green-soft, #e8f1e9);
          color: var(--app-green-dark, #3f5b4d);
          border-color: var(--app-green, #567363);
        }

        .sim-back-btn {
          background: transparent;
          border: none;
          color: var(--app-muted, #71807a);
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 6px 0;
          margin-bottom: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .sim-back-btn:hover {
          color: var(--app-text, #243238);
        }

        /* ── Scenario Hero ─────────────────────────────────── */
        .sim-scenario-hero {
          background: var(--sim-hero-bg);
          border: 1px solid var(--sim-hero-border);
          border-radius: 28px;
          padding: 28px;
          margin-bottom: 26px;
        }

        .sim-scenario-hero-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .sim-scenario-hero-icon {
          font-size: 38px;
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--sim-hero-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sim-scenario-kicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--sim-hero-accent);
          display: block;
          margin-bottom: 4px;
        }

        .sim-scenario-title {
          font-size: clamp(24px, 4vw, 34px);
          font-weight: 800;
          color: var(--app-text, #243238);
          margin: 0;
          line-height: 1.2;
        }

        .sim-scenario-setup-text {
          font-size: 18px;
          line-height: 1.6;
          color: var(--app-text, #243238);
          margin: 0;
          max-width: 740px;
        }

        /* ── Choices List ──────────────────────────────────── */
        .sim-decision-header {
          margin-bottom: 14px;
        }

        .sim-decision-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--app-text, #243238);
          margin: 0 0 4px;
        }

        .sim-decision-subtitle {
          font-size: 14.5px;
          color: var(--app-muted, #71807a);
          margin: 0;
        }

        .sim-choices-list {
          display: grid;
          gap: 12px;
          margin-bottom: 32px;
        }

        .sim-choice-btn {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 20px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
          outline: none;
        }

        .sim-choice-btn:hover, .sim-choice-btn:focus-visible {
          border-color: var(--app-green, #567363);
          transform: translateX(4px);
          box-shadow: var(--app-shadow-small);
        }

        .sim-choice-letter {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--app-surface-soft, #f4f1e9);
          border: 1px solid var(--app-border, #e7e4dc);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 800;
          color: var(--app-text, #243238);
          flex-shrink: 0;
        }

        .sim-choice-btn.is-seen .sim-choice-letter {
          background: var(--app-green-soft, #e8f1e9);
          color: var(--app-green-dark, #3f5b4d);
          border-color: var(--app-green, #567363);
        }

        .sim-choice-content {
          flex: 1;
        }

        .sim-choice-label {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.45;
          color: var(--app-text, #243238);
          margin-bottom: 4px;
        }

        .sim-choice-badge-tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 6px;
          background: var(--app-surface-soft, #f4f1e9);
          color: var(--app-muted, #71807a);
        }

        .sim-choice-arrow {
          font-size: 18px;
          color: var(--app-muted, #71807a);
          transition: transform 0.18s ease;
        }

        .sim-choice-btn:hover .sim-choice-arrow {
          transform: translateX(3px);
          color: var(--app-green, #567363);
        }

        /* ── Outcome View ──────────────────────────────────── */
        .sim-outcome-nav-strip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 12px;
        }

        .sim-selected-pill {
          background: var(--sim-pill-bg);
          border: 1px solid var(--sim-pill-border);
          border-radius: 20px;
          padding: 16px 20px;
          margin-bottom: 22px;
        }

        .sim-selected-meta {
          display: flex;
          gap: 8px;
          align-items: center;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--app-muted, #71807a);
          margin-bottom: 4px;
        }

        .sim-selected-text {
          font-size: 19px;
          font-weight: 700;
          color: var(--app-text, #243238);
          line-height: 1.35;
        }

        /* ── Comparison Drawer ─────────────────────────────── */
        .sim-comparison-drawer {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--app-shadow-small);
        }

        .sim-comparison-header h3 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 4px;
          color: var(--app-text, #243238);
        }

        .sim-comparison-header p {
          font-size: 13.5px;
          color: var(--app-muted, #71807a);
          margin: 0 0 16px;
        }

        .sim-comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 14px;
        }

        .sim-comp-card {
          background: var(--app-surface-soft, #f4f1e9);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 18px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sim-comp-card.is-selected-card {
          border-color: var(--app-green, #567363);
          box-shadow: 0 0 0 2px var(--app-green-soft, #e8f1e9);
        }

        .sim-comp-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
        }

        .sim-comp-badge {
          color: var(--app-green-dark, #3f5b4d);
        }

        .sim-comp-pill {
          color: var(--app-muted, #71807a);
        }

        .sim-comp-title {
          font-size: 14.5px;
          font-weight: 700;
          margin: 0;
          color: var(--app-text, #243238);
        }

        .sim-comp-outcome {
          font-size: 13px;
          line-height: 1.45;
          color: var(--app-muted, #71807a);
          margin: 0;
          flex: 1;
        }

        .sim-comp-tip {
          font-size: 12px;
          color: var(--app-text, #243238);
          border-top: 1px solid var(--app-border, #e7e4dc);
          padding-top: 8px;
        }

        .sim-comp-switch-btn {
          margin-top: 4px;
          padding: 6px 10px;
          border-radius: 10px;
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          font-size: 12px;
          font-weight: 700;
          color: var(--app-green-dark, #3f5b4d);
          cursor: pointer;
        }

        /* ── Dialogue Card ─────────────────────────────────── */
        .sim-dialogue-card {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 26px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: var(--app-shadow-small);
        }

        .sim-dialogue-kicker {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--app-green-dark, #3f5b4d);
          display: block;
          margin-bottom: 4px;
        }

        .sim-dialogue-title {
          font-size: 21px;
          font-weight: 800;
          color: var(--app-text, #243238);
          margin: 0 0 16px;
        }

        .sim-dialogue-stream {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sim-bubble-narrator {
          text-align: center;
          margin: 6px auto;
          max-width: 540px;
        }

        .sim-bubble-narrator p {
          margin: 0;
          font-style: italic;
          font-size: 14.5px;
          color: var(--app-muted, #71807a);
          line-height: 1.5;
        }

        .sim-bubble-row {
          display: flex;
          flex-direction: column;
          max-width: min(520px, 86%);
          animation: simPop 0.35s ease both;
        }

        .sim-bubble-row.is-user {
          align-self: flex-end;
          align-items: flex-end;
        }

        .sim-bubble-row.is-other {
          align-self: flex-start;
          align-items: flex-start;
        }

        .sim-bubble-speaker {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--app-muted, #71807a);
          margin-bottom: 4px;
          padding: 0 4px;
        }

        .sim-bubble-bubble {
          padding: 13px 18px;
          border-radius: 20px;
          font-size: 16px;
          line-height: 1.5;
        }

        .sim-bubble-row.is-user .sim-bubble-bubble {
          background: var(--app-green, #567363);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        [data-theme="dark"] .sim-bubble-row.is-user .sim-bubble-bubble {
          background: var(--app-green-soft, #1e3327);
          color: #e4ede5;
          border: 1px solid var(--app-green-dark, #8ec09b);
        }

        .sim-bubble-row.is-other .sim-bubble-bubble {
          background: var(--app-surface-soft, #f4f1e9);
          color: var(--app-text, #243238);
          border: 1px solid var(--app-border, #e7e4dc);
          border-bottom-left-radius: 4px;
        }

        @keyframes simPop {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: none; }
        }

        /* ── Consequence Card ──────────────────────────────── */
        .sim-consequence-card {
          background: var(--tone-bg);
          border: 1px solid var(--tone-border);
          border-radius: 22px;
          padding: 20px 22px;
          margin-bottom: 16px;
        }

        .sim-consequence-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 800;
          color: var(--tone-text);
          margin-bottom: 6px;
        }

        .sim-consequence-heading {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 6px;
          color: var(--app-text, #243238);
        }

        .sim-consequence-body {
          font-size: 16px;
          line-height: 1.6;
          color: var(--app-text, #243238);
          margin: 0;
        }

        /* ── Tip Card ──────────────────────────────────────── */
        .sim-tip-card {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 20px;
          padding: 16px 20px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .sim-tip-icon {
          font-size: 24px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .sim-tip-content strong {
          display: block;
          font-size: 14.5px;
          color: var(--app-green-dark, #3f5b4d);
          margin-bottom: 2px;
        }

        .sim-tip-content p {
          font-size: 15.5px;
          line-height: 1.5;
          color: var(--app-text, #243238);
          margin: 0;
        }

        /* ── Reflection Card ───────────────────────────────── */
        .sim-reflection-card {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 22px;
          padding: 22px;
          margin-bottom: 22px;
        }

        .sim-reflection-kicker {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--app-muted, #71807a);
          display: block;
          margin-bottom: 2px;
        }

        .sim-reflection-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--app-text, #243238);
          margin: 0 0 6px;
        }

        .sim-reflection-prompt {
          font-size: 16px;
          line-height: 1.55;
          color: var(--app-text, #243238);
          margin: 0 0 14px;
        }

        .sim-reflection-input {
          width: 100%;
          box-sizing: border-box;
          font-family: inherit;
          font-size: 15px;
          line-height: 1.5;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid var(--app-border, #e7e4dc);
          background: var(--app-surface-soft, #f4f1e9);
          color: var(--app-text, #243238);
          resize: vertical;
          outline: none;
        }

        .sim-reflection-input:focus {
          border-color: var(--app-green, #567363);
          background: var(--app-surface, #ffffff);
        }

        .sim-reflection-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 10px;
          font-size: 12px;
          color: var(--app-muted, #71807a);
        }

        /* ── Antarang AI Coach Card ────────────────────────── */
        .sim-ai-card {
          background: linear-gradient(135deg, var(--app-surface, #ffffff), var(--app-surface-soft, #f4f1e9));
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--app-shadow-small);
        }

        .sim-ai-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--app-green-dark, #3f5b4d);
          margin-bottom: 4px;
        }

        .sim-ai-title {
          font-size: 19px;
          font-weight: 800;
          color: var(--app-text, #243238);
          margin: 0 0 4px;
        }

        .sim-ai-subtitle {
          font-size: 14px;
          color: var(--app-muted, #71807a);
          margin: 0 0 16px;
        }

        .sim-ai-quick-prompts {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .sim-ai-prompt-pill {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 999px;
          padding: 6px 12px;
          font-size: 12.5px;
          font-weight: 600;
          color: var(--app-text, #243238);
          cursor: pointer;
          transition: all 0.16s ease;
        }

        .sim-ai-prompt-pill:hover:not(:disabled) {
          border-color: var(--app-green, #567363);
          background: var(--app-green-soft, #e8f1e9);
          color: var(--app-green-dark, #3f5b4d);
        }

        .sim-ai-input-wrap {
          display: flex;
          gap: 10px;
        }

        .sim-ai-input {
          flex: 1;
          font-family: inherit;
          font-size: 14.5px;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid var(--app-border, #e7e4dc);
          background: var(--app-surface, #ffffff);
          color: var(--app-text, #243238);
          outline: none;
        }

        .sim-ai-input:focus {
          border-color: var(--app-green, #567363);
        }

        .sim-ai-thinking {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          font-size: 13.5px;
          color: var(--app-green-dark, #3f5b4d);
          font-weight: 600;
        }

        .sim-ai-pulse {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--app-green, #567363);
          animation: simPulse 1.2s infinite ease-in-out;
        }

        @keyframes simPulse {
          0% { transform: scale(0.7); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.7); opacity: 0.4; }
        }

        .sim-ai-reply-box {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 18px;
          padding: 18px;
          margin-top: 16px;
        }

        .sim-ai-reply-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--app-green-dark, #3f5b4d);
          margin-bottom: 8px;
        }

        .sim-ai-reply-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--app-green, #567363);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        .sim-ai-reply-text {
          font-size: 15px;
          line-height: 1.6;
          color: var(--app-text, #243238);
          margin: 0 0 12px;
          white-space: pre-wrap;
        }

        .sim-ai-reply-footer {
          border-top: 1px solid var(--app-border, #e7e4dc);
          padding-top: 10px;
          text-align: right;
        }

        .sim-ai-continue-btn {
          font-size: 13px;
          color: var(--app-green-dark, #3f5b4d);
        }

        /* ── Other Choices Strip ───────────────────────────── */
        .sim-other-choices-wrap {
          margin-bottom: 26px;
        }

        .sim-other-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--app-text, #243238);
          margin: 0 0 12px;
        }

        .sim-other-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }

        .sim-other-card {
          background: var(--app-surface, #ffffff);
          border: 1px solid var(--app-border, #e7e4dc);
          border-radius: 18px;
          padding: 14px 16px;
          text-align: left;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.16s ease;
        }

        .sim-other-card:hover {
          border-color: var(--app-green, #567363);
          transform: translateY(-2px);
          box-shadow: var(--app-shadow-small);
        }

        .sim-other-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--app-muted, #71807a);
        }

        .sim-other-label {
          font-size: 15px;
          font-weight: 700;
          color: var(--app-text, #243238);
          line-height: 1.35;
        }

        .sim-other-badge {
          font-size: 11px;
          color: var(--app-green-dark, #3f5b4d);
          margin-top: 4px;
        }

        /* ── Bottom Actions ────────────────────────────────── */
        .sim-bottom-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          padding-top: 8px;
        }

        /* ── Responsive Rules ──────────────────────────────── */
        @media (max-width: 640px) {
          .sim-page {
            padding: 20px 14px 60px;
          }
          .sim-voice-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .sim-voice-actions {
            width: 100%;
          }
          .sim-ai-input-wrap {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default Explore;