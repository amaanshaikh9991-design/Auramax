# Antarang (Auramax) 🧠🌱

> **A thoughtful, gamified student mental wellness, cognitive assessment, and emotional self-reflection platform.**  
> *"A little space to check in with yourself."*

---

## 📖 About the Project

**Antarang** (developed under the Auramax project) is a full-stack digital mental health and cognitive assessment platform engineered specifically for students. Navigating academic pressure, emotional shifts, and cognitive development can be overwhelming. Antarang provides students with a safe, private, and interactive environment to track emotional well-being, measure and strengthen cognitive abilities, practice guided mindfulness, and interact with an AI-powered conversational support companion.

The platform combines evidence-based psychological tools, gamified cognitive testing, and Retrieval-Augmented Generation (RAG) AI to deliver personalized, contextual guidance.

---

## ✨ Key Features & Modules

### 1. 🧘 Mindful Daily Check-In
- **Multi-Step Self-Reflection**: An interactive, 4-step check-in flow allowing students to record daily moods, specify contextual drivers (academics, sleep, social, health), and write private reflection notes.
- **Visual Progress & Mood History**: Animated mood orbs and trend tracking to help students recognize emotional patterns over time.

### 2. 🧩 Gamified Cognitive Assessment
- **5 Core Cognitive Domains**:
  - 🔍 **Pattern Detective**: Tests inductive reasoning and visual pattern recognition.
  - 🧩 **Memory Mission**: Evaluates visual and working memory retention.
  - 🎯 **Attention Hunter**: Measures selective attention and perceptual processing speed.
  - 🚦 **Stop-Go Challenge**: Gauges inhibitory control and response suppression.
  - 🔄 **Rule Switch**: Challenges cognitive flexibility and task switching under dynamic rules.
- **Analytics & Report Generation**: Automatically computes domain scores, accuracy percentages, and response latency. Generates exportable, professional **PDF assessment reports** for students, counselors, or guardians using jsPDF.

### 3. 💬 AI Companion & Conversational Support (RAG-Enabled)
- **Empathetic AI Chat**: Powered by Groq's low-latency LLM inference, offering active listening, empathetic reflection, and de-escalation strategies.
- **Document RAG (Retrieval-Augmented Generation)**: Students can upload counseling materials or self-help documents (PDFs). Documents are processed, chunked, embedded via Hugging Face Inference API, and stored in PostgreSQL with `pgvector` for semantic document-grounded answers.

### 4. 🌿 Explore & Wellness Zone
- **Guided Breathing Exercises**: Visual, interactive breathing orb with pacing animations (box breathing / 4-7-8 breathing).
- **Curated Coping Guides**: Topics covering exam stress, burnout, time management, sleep hygiene, peer relationships, and mindfulness.

### 5. 🆘 Emergency SOS & Support
- **Immediate Crisis Helplines**: Instant one-tap access to national and institutional mental health helplines (Tele-MANAS, KIRAN, Vandrevala Foundation, Childline 1098).
- **Grounding Protocols**: Immediate calming techniques (5-4-3-2-1 sensory grounding) accessible in one click.

### 6. 📱 Fully Responsive Cross-Device Experience
- Optimized across **all screen sizes**:
  - **Mobile Phones (320px – 480px)**: Touch-scrollable bottom navigation bar, safe-area-inset padding, adaptive input controls, and zero horizontal overflow.
  - **Tablets (481px – 1024px)**: Adaptive grid reflow, flexible cards, and balanced column spacing.
  - **Laptops & Large Desktops (1025px – 1920px+)**: Fluid layouts, responsive cards, and constrained viewports for wide monitors.
- **Theme Support**: Seamless Dark Mode and Light Mode switching with system preference detection.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: Custom CSS Architecture, CSS Grid, Flexbox, Fluid Typography (`clamp()`), and Media Queries
- **Animations**: [GSAP (GreenSock)](https://greensock.com/gsap/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Playfair Display*)

### Backend
- **Runtime & Server**: [Node.js](https://nodejs.org/) & [Express 5](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [`pgvector`](https://github.com/pgvector/pgvector) extension
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Authentication**: Custom session-based authentication with HTTP-only secure cookies and `bcryptjs` password hashing
- **AI / LLM Inference**: [Groq SDK](https://groq.com/)
- **Embeddings & Vector Search**: [Hugging Face Inference API](https://huggingface.co/inference-api) (`BAAI/bge-small-en-v1.5`)
- **Document Processing**: [Multer](https://github.com/expressjs/multer) & [pdf-parse](https://www.npmjs.com/package/pdf-parse)

---

## 📂 Project Architecture

```
Auramax/
├── public/                 # Static assets, icons, and logos
├── server/                 # Express backend and database layer
│   ├── prisma/             # Prisma schema and migrations
│   │   └── schema.prisma   # PostgreSQL schema (Students, Sessions, Assessments, Documents, Vector Chunks)
│   ├── assessment.js       # Assessment verification and scoring endpoints
│   ├── auth.js             # Password hashing and authentication utilities
│   ├── db.js               # Prisma client database instance
│   ├── documents.js        # PDF upload, chunking, and semantic vector retrieval
│   ├── embedding.js        # Hugging Face embedding pipeline
│   ├── middleware.js       # Authentication and session verification middleware
│   ├── server.js           # Express API server entry point and chat routes
│   └── session.js          # Session token generator and cookie management
├── src/                    # Frontend React source code
│   ├── components/         # Reusable UI components and modal dialogs
│   ├── layouts/            # Layout wrappers (AppLayout with responsive navigation)
│   ├── pages/              # Application views and pages
│   │   ├── Landing.jsx     # Public landing page
│   │   ├── Login.jsx       # Animated cartoon login view
│   │   ├── Signup.jsx      # Student registration
│   │   ├── Home.jsx        # Personalized student dashboard
│   │   ├── CheckIn.jsx     # Daily mood and reflection flow
│   │   ├── CognitiveTest.jsx # 5-skill gamified cognitive assessment
│   │   ├── Chat.jsx        # AI companion chat interface
│   │   ├── Explore.jsx     # Wellness library and interactive breathing zone
│   │   ├── MyJourney.jsx   # Mood trend analysis and assessment history
│   │   ├── Support.jsx     # Emergency SOS helplines and crisis guidance
│   │   └── Profile.jsx     # Student profile settings and theme preferences
│   ├── styles/             # Modular CSS stylesheets
│   │   ├── global.css      # Core variables, responsive navigation, and page layouts
│   │   ├── Chat.css        # Chat layout and message bubble styling
│   │   └── assessment.css  # Cognitive test grid styling and media queries
│   ├── App.jsx             # Route definitions and application shell
│   └── main.jsx            # Application mount point
├── package.json            # Scripts and project dependencies
├── vite.config.js          # Vite build configuration
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14+ with `pgvector` extension enabled
- **API Keys**:
  - [Groq API Key](https://console.groq.com/) (for chat completions)
  - [Hugging Face API Token](https://huggingface.co/settings/tokens) (for semantic vector embeddings)

---

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/averic7pinto-cmd/Antarang.git
   cd Antarang
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or inside `server/` as appropriate):
   ```env
   # Server Configuration
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=your_super_secret_session_key

   # Database (PostgreSQL with pgvector)
   DATABASE_URL="postgresql://username:password@localhost:5432/antarang?schema=public"

   # AI & Embeddings
   GROQ_API_KEY=your_groq_api_key_here
   HUGGINGFACE_API_KEY=your_huggingface_api_token_here
   ```

4. **Initialize Database Schema**:
   Run Prisma migrations to create all required tables and indexes:
   ```bash
   npx prisma db push --schema=server/prisma/schema.prisma
   npx prisma generate --schema=server/prisma/schema.prisma
   ```

---

### Running the Application

You can run the frontend and backend services concurrently in separate terminal windows:

#### 1. Start the Backend API Server:
```bash
npm run server
```
*The server will run at `http://localhost:5000`.*

#### 2. Start the Frontend Development Server:
```bash
npm run dev
```
*The client will start at `http://localhost:5173` (or the port specified by Vite).*

#### 3. Build for Production:
```bash
npm run build
npm run preview
```

---

## 🔒 Security & Privacy

- **Data Privacy**: Student check-ins and reflection notes are stored privately and linked strictly to student session IDs.
- **Authentication**: Passwords are encrypted using salted `bcryptjs` hashing. Sessions are maintained via secure, `httpOnly`, `SameSite` cookies to protect against XSS and CSRF attacks.
- **Educational Disclaimer**: Antarang is designed as a wellness self-reflection and cognitive training prototype. It is not a clinical diagnostic tool or a substitute for professional mental healthcare.

---

## 📄 License

This project is licensed under the ISC License.
