import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Groq from "groq-sdk";

import prisma from "./db.js";
import { hashPassword, verifyPassword } from "./auth.js";
import { createSession } from "./session.js";
import { requireAuth } from "./middleware.js";
import documentRoutes, { retrieveRelevantChunks } from "./documents.js";

dotenv.config();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow if it matches an explicitly listed origin
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any Vercel preview/production deployment of this project
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);
      // Block everything else
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());



app.use("/api/documents", documentRoutes);



const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


app.get("/", (req, res) => {
  res.json({
    message: "Antarang server is running",
  });
});



app.post("/auth/signup", async (req, res) => {
  try {
    const {
      name,
      institution,
      rollNumber,
      password,
    } = req.body;

    if (
      !name?.trim() ||
      !institution?.trim() ||
      !rollNumber?.trim() ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, school or college, roll number, and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters",
      });
    }

    const existingStudent =
      await prisma.student.findUnique({
        where: {
          name: name.trim(),
        },
      });

    if (existingStudent) {
      return res.status(409).json({
        message:
          "That name already has an Antarang account. Please use your full name or log in.",
      });
    }

    const passwordHash = await hashPassword(password);

    const student = await prisma.student.create({
      data: {
        name: name.trim(),
        institution: institution.trim(),
        rollNumber: rollNumber.trim(),
        passwordHash,
      },
    });

    res.status(201).json({
      message: "Signup successful",

      student: {
        id: student.id,
        name: student.name,
        institution: student.institution,
        rollNumber: student.rollNumber,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Signup failed",
    });
  }
});



app.post("/auth/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name?.trim() || !password) {
      return res.status(400).json({
        message: "Name and password are required",
      });
    }

    const student =
      await prisma.student.findUnique({
        where: {
          name: name.trim(),
        },
      });

    if (!student) {
      return res.status(401).json({
        message: "Invalid roll number or password",
      });
    }

    const validPassword = await verifyPassword(
      student.passwordHash,
      password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid roll number or password",
      });
    }

    const { sessionId, expiresAt } =
      await createSession(student.id);

    res.cookie("session", sessionId, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    res.json({
      message: "Login successful",

      student: {
        id: student.id,
        name: student.name,
        institution: student.institution,
        rollNumber: student.rollNumber,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
});



app.get(
  "/api/me",
  requireAuth,
  async (req, res) => {
    try {
      const student =
        await prisma.student.findUnique({
          where: {
            id: req.studentId,
          },

          select: {
            id: true,
            name: true,
            institution: true,
            rollNumber: true,
            profilePhoto: true,
            createdAt: true,
          },
        });

      if (!student) {
        return res.status(404).json({
          message: "Student profile not found",
        });
      }

      return res.json({
        student,
      });
    } catch (error) {
      console.error(
        "Profile load error:",
        error
      );

      return res.status(500).json({
        message: "Unable to load profile",
      });
    }
  }
);



app.patch(
  "/api/me",
  requireAuth,
  async (req, res) => {
    try {
      const {
        name,
        institution,
        profilePhoto,
      } = req.body || {};

      if (
        !name?.trim() ||
        !institution?.trim()
      ) {
        return res.status(400).json({
          message:
            "Name and school or college are required",
        });
      }

      if (
        profilePhoto &&
        (
          !profilePhoto.startsWith(
            "data:image/"
          ) ||
          profilePhoto.length > 450_000
        )
      ) {
        return res.status(400).json({
          message:
            "Please choose a compressed image smaller than 350 KB",
        });
      }

      const student =
        await prisma.student.update({
          where: {
            id: req.studentId,
          },

          data: {
            name: name.trim(),
            institution: institution.trim(),

            ...(profilePhoto !== undefined
              ? { profilePhoto }
              : {}),
          },

          select: {
            id: true,
            name: true,
            institution: true,
            rollNumber: true,
            profilePhoto: true,
            createdAt: true,
          },
        });

      return res.json({
        student,
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "That name is already in use",
        });
      }

      console.error(
        "Profile update error:",
        error
      );

      return res.status(500).json({
        message: "Unable to update profile",
      });
    }
  }
);

app.post("/api/check-ins", requireAuth, async (req, res) => {
  try {
    const { mood, factors = [], reflection = "" } = req.body || {};
    const validMoods = ["great", "good", "okay", "low", "rough"];
    if (!validMoods.includes(mood)) {
      return res.status(400).json({ message: "Please choose a valid mood." });
    }
    if (!Array.isArray(factors) || factors.some((factor) => typeof factor !== "string")) {
      return res.status(400).json({ message: "Check-in factors are invalid." });
    }
    if (typeof reflection !== "string" || reflection.length > 500) {
      return res.status(400).json({ message: "Reflection must be 500 characters or fewer." });
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        studentId: req.studentId,
        mood,
        factors,
        reflection: reflection.trim() || null,
      },
    });
    return res.status(201).json({ checkIn });
  } catch (error) {
    console.error("Check-in save error:", error);
    return res.status(500).json({ message: "Unable to save your check-in." });
  }
});

app.get("/api/check-ins", requireAuth, async (req, res) => {
  try {
    const checkIns = await prisma.checkIn.findMany({
      where: { studentId: req.studentId },
      orderBy: { createdAt: "desc" },
      select: { id: true, mood: true, factors: true, reflection: true, createdAt: true },
    });
    return res.json({ checkIns });
  } catch (error) {
    console.error("Check-in history error:", error);
    return res.status(500).json({ message: "Unable to load your check-in history." });
  }
});


app.post(
  "/api/chat",
  requireAuth,
  async (req, res) => {
    try {
      console.log(
        "Logged-in student:",
        req.studentId
      );

      const {
        message,
        sessionId,
      } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({
          message: "Message is required",
        });
      }

      let chatSession;

   

      if (sessionId) {
        chatSession =
          await prisma.chatSession.findFirst({
            where: {
              id: Number(sessionId),
              studentId: req.studentId,
            },
          });

        if (!chatSession) {
          return res.status(404).json({
            message:
              "Chat session not found",
          });
        }
      }

      // =========================
      // CREATE NEW CHAT SESSION
      // =========================

      if (!chatSession) {
        chatSession =
          await prisma.chatSession.create({
            data: {
              studentId: req.studentId,
              title: message
                .trim()
                .slice(0, 100),
            },
          });
      }



      await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          role: "user",
          content: message.trim(),
        },
      });

      const previousMessages =
        await prisma.chatMessage.findMany({
          where: {
            sessionId: chatSession.id,
          },

          orderBy: {
            createdAt: "asc",
          },
        });

      
      const latestAssessment =
        await prisma.cognitiveAssessment.findFirst({
          where: {
            studentId: req.studentId,
          },

          orderBy: {
            createdAt: "desc",
          },

          select: {
            score: true,
            correctCount: true,
            questionCount: true,
            grade: true,
            createdAt: true,
            responses: true,
            reasoningScore: true,
            workingMemoryScore: true,
            attentionScore: true,
            inhibitionScore: true,
            flexibilityScore: true,
          },
        });

      const assessmentContext =
        latestAssessment
          ? `
The student's latest cognitive assessment is available.
Class: ${latestAssessment.grade}; Overall score: ${latestAssessment.score}% (${latestAssessment.correctCount}/${latestAssessment.questionCount}).
Domain Breakdown:
- Reasoning / Pattern Detective: ${latestAssessment.reasoningScore ?? "N/A"}%
- Working Memory Mission: ${latestAssessment.workingMemoryScore ?? "N/A"}%
- Attention Hunter: ${latestAssessment.attentionScore ?? "N/A"}%
- Inhibitory Control (Stop-Go): ${latestAssessment.inhibitionScore ?? "N/A"}%
- Cognitive Flexibility (Rule Switch): ${latestAssessment.flexibilityScore ?? "N/A"}%

Use it only when relevant, be encouraging, and suggest practical ways to improve.
Do not diagnose or rank the student.
`
          : `
The student has not completed a cognitive assessment yet.
`;

      const recentCheckIns = await prisma.checkIn.findMany({
        where: { studentId: req.studentId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          mood: true,
          factors: true,
          reflection: true,
          createdAt: true,
        },
      });
      const checkInContext = recentCheckIns.length
        ? `
The student's recent private wellbeing check-ins are available:
${recentCheckIns
  .map((checkIn) => {
    const date = new Date(checkIn.createdAt).toLocaleDateString("en-US");
    const factors = Array.isArray(checkIn.factors)
      ? checkIn.factors.join(", ")
      : "";
    return `- ${date}: mood ${checkIn.mood}; factors: ${factors || "none"}; note: ${checkIn.reflection || "none"}`;
  })
  .join("\n")}

Use check-in information only when it helps answer the student's question. Be supportive and non-judgmental. Do not diagnose, make clinical claims, or expose private check-in details unnecessarily.
`
        : `
The student has not completed any wellbeing check-ins yet.
`;

     let documentContext = "";
     try {
       const relevantChunks = await retrieveRelevantChunks(
         req.studentId,
         message.trim()
       );
       if (relevantChunks.length) {
         documentContext = `
Relevant content from the student's uploaded PDFs:
${relevantChunks
 .map((chunk, index) => `[${index + 1}] ${chunk.filename}: ${chunk.content}`)
 .join("\n\n")}

Use this content to answer the student's question. If it does not contain the answer, say so instead of inventing details.
`;
       }
     } catch (error) {
       console.error("RAG retrieval error:", error);
       if (error instanceof Error && error.message.includes("Hugging Face")) {
         documentContext = "\nUploaded PDF memory is temporarily unavailable because the embedding service is not available.\n";
       }
     }

     

      const groqMessages = [
        {
          role: "system",

          content:
            `You are Antarang AI, a friendly and supportive student assistant. ` +
            `Keep your answers clear, helpful, and easy to understand.` +
            assessmentContext +
            checkInContext +
            documentContext,
        },

        ...previousMessages.map(
          (msg) => ({
            role:
              msg.role === "assistant"
                ? "assistant"
                : "user",

            content: msg.content,
          })
        ),
      ];


      const completion =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",

          messages: groqMessages,
        });

      const reply =
        completion.choices[0]
          ?.message?.content ||
        "Sorry, I couldn't generate a response.";

     

      await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          role: "assistant",
          content: reply,
        },
      });

   

      res.json({
        reply,
        sessionId: chatSession.id,
      });
    } catch (error) {
      console.error(
        "Chat error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to generate a response",
      });
    }
  }
);



app.get(
  "/api/chat/sessions",
  requireAuth,
  async (req, res) => {
    try {
      const chatSessions =
        await prisma.chatSession.findMany({
          where: {
            studentId: req.studentId,
          },

          orderBy: {
            updatedAt: "desc",
          },

          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        });

      res.json({
        sessions: chatSessions,
      });
    } catch (error) {
      console.error(
        "Chat sessions error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load chat sessions",
      });
    }
  }
);



app.get(
  "/api/chat/:sessionId",
  requireAuth,
  async (req, res) => {
    try {
      const sessionId =
        Number(req.params.sessionId);

      if (!sessionId) {
        return res.status(400).json({
          message:
            "Invalid chat session",
        });
      }

      const chatSession =
        await prisma.chatSession.findFirst({
          where: {
            id: sessionId,
            studentId: req.studentId,
          },
        });

      if (!chatSession) {
        return res.status(404).json({
          message:
            "Chat session not found",
        });
      }

      const messages =
        await prisma.chatMessage.findMany({
          where: {
            sessionId:
              chatSession.id,
          },

          orderBy: {
            createdAt: "asc",
          },
        });

      res.json({
        sessionId: chatSession.id,

        messages: messages.map(
          (message) => ({
            role: message.role,
            content: message.content,
          })
        ),
      });
    } catch (error) {
      console.error(
        "Chat history error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load chat history",
      });
    }
  }
);


app.patch(
  "/api/chat/:sessionId",
  requireAuth,
  async (req, res) => {
    const title =
      typeof req.body?.title === "string"
        ? req.body.title.trim()
        : "";

    if (!title || title.length > 100) {
      return res.status(400).json({
        message:
          "Chat title must be 1–100 characters",
      });
    }

    const chat =
      await prisma.chatSession.updateMany({
        where: {
          id: Number(
            req.params.sessionId
          ),
          studentId: req.studentId,
        },

        data: {
          title,
        },
      });

    if (!chat.count) {
      return res.status(404).json({
        message:
          "Chat session not found",
      });
    }

    return res.json({
      title,
    });
  }
);

// =========================
// DELETE CHAT
// =========================

app.delete(
  "/api/chat/:sessionId",
  requireAuth,
  async (req, res) => {
    const chat =
      await prisma.chatSession.deleteMany({
        where: {
          id: Number(
            req.params.sessionId
          ),
          studentId: req.studentId,
        },
      });

    if (!chat.count) {
      return res.status(404).json({
        message:
          "Chat session not found",
      });
    }

    return res.json({
      message: "Chat deleted",
    });
  }
);


function calculateDomainMetrics(items, keys) {
  const matching = items.filter((x) => {
    const m = String(x.module || x.domain || x.module_name || "").toLowerCase();
    return keys.some((k) => m.includes(k.toLowerCase()));
  });

  const qCount = matching.length;
  const cCount = matching.reduce((sum, x) => sum + (x.correct ? 1 : 0), 0);
  const domainScore = qCount > 0 ? Math.round((cCount / qCount) * 100) : 0;
  const avgRt = qCount > 0
    ? Math.round(matching.reduce((sum, x) => sum + (Number(x.response_time_ms) || 0), 0) / qCount)
    : 0;

  return {
    score: domainScore,
    correctCount: cCount,
    questionCount: qCount,
    avgResponseMs: avgRt,
  };
}

app.post(
  "/api/assessments",
  requireAuth,
  async (req, res) => {
    try {
      const {
        rollNumber,
        age,
        grade,
        board,
        score,
        correctCount,
        questionCount,
        totalTimeMs,
        responses,
      } = req.body;

      if (!Array.isArray(responses) || responses.length !== 30) {
        return res.status(400).json({
          message: `A complete 30-question assessment is required. Received ${Array.isArray(responses) ? responses.length : 0} responses.`,
        });
      }

      const student =
        await prisma.student.findUnique({
          where: {
            id: req.studentId,
          },
          select: {
            rollNumber: true,
          },
        });

      if (!student) {
        return res.status(404).json({
          message: "Student profile not found",
        });
      }

      // Safe normalization of demographics
      const parsedAge = parseInt(age, 10);
      const finalAge = !isNaN(parsedAge) && parsedAge >= 4 && parsedAge <= 120 ? parsedAge : 15;

      const parsedGrade = parseInt(grade, 10);
      const finalGrade = !isNaN(parsedGrade) && parsedGrade >= 1 && parsedGrade <= 16 ? parsedGrade : 10;

      const sanitizedBoard =
        typeof board === "string" && board.trim() ? board.trim().slice(0, 20) : "Other";

      const cleanTotalTimeMs = Math.max(0, Math.round(Number(totalTimeMs) || 0));

      const cleanResponses = responses.map((r, i) => {
        const isCorrect = (r.correct === 1 || r.correct === true || r.correct === "1" || r.isCorrect === true) ? 1 : 0;
        const rt = Math.max(0, Math.round(Number(r.response_time_ms) || 0));
        const studyMs = Math.max(0, Math.round(Number(r.study_time_ms) || 0));
        return {
          ...r,
          item: r.item ?? i + 1,
          correct: isCorrect,
          error: isCorrect ? 0 : 1,
          response_time_ms: rt,
          study_time_ms: studyMs,
        };
      });

      const actualCorrectCount = cleanResponses.reduce(
        (total, response) => total + response.correct,
        0
      );

      const actualScore = cleanResponses.length > 0
        ? Math.round((actualCorrectCount / cleanResponses.length) * 100)
        : 0;

      // Calculate the five category metrics for Prisma CognitiveAssessment
      const reasoning = calculateDomainMetrics(cleanResponses, ["reasoning", "pattern"]);
      const workingMemory = calculateDomainMetrics(cleanResponses, ["memory"]);
      const attention = calculateDomainMetrics(cleanResponses, ["attention"]);
      const inhibition = calculateDomainMetrics(cleanResponses, ["inhibition", "stop"]);
      const flexibility = calculateDomainMetrics(cleanResponses, ["flexibility", "rule"]);

      const assessment =
        await prisma.cognitiveAssessment.create({
          data: {
            studentId: req.studentId,
            rollNumber: student.rollNumber || (rollNumber ? String(rollNumber).trim() : "Student"),
            age: finalAge,
            grade: finalGrade,
            board: sanitizedBoard,
            score: actualScore,
            correctCount: actualCorrectCount,
            questionCount: cleanResponses.length,
            totalTimeMs: cleanTotalTimeMs,
            responses: cleanResponses,

            reasoningScore: reasoning.score,
            reasoningCorrectCount: reasoning.correctCount,
            reasoningQuestionCount: reasoning.questionCount,
            reasoningAvgResponseMs: reasoning.avgResponseMs,

            workingMemoryScore: workingMemory.score,
            workingMemoryCorrectCount: workingMemory.correctCount,
            workingMemoryQuestionCount: workingMemory.questionCount,
            workingMemoryAvgResponseMs: workingMemory.avgResponseMs,

            attentionScore: attention.score,
            attentionCorrectCount: attention.correctCount,
            attentionQuestionCount: attention.questionCount,
            attentionAvgResponseMs: attention.avgResponseMs,

            inhibitionScore: inhibition.score,
            inhibitionCorrectCount: inhibition.correctCount,
            inhibitionQuestionCount: inhibition.questionCount,
            inhibitionAvgResponseMs: inhibition.avgResponseMs,

            flexibilityScore: flexibility.score,
            flexibilityCorrectCount: flexibility.correctCount,
            flexibilityQuestionCount: flexibility.questionCount,
            flexibilityAvgResponseMs: flexibility.avgResponseMs,
          },
        });

      res.status(201).json({
        message: "Assessment saved",
        assessment,
      });
    } catch (error) {
      console.error("Assessment error:", error);
      res.status(500).json({
        message: "Failed to save assessment",
      });
    }
  }
);


app.get(
  "/api/assessments",
  requireAuth,
  async (req, res) => {
    try {
      const assessments =
        await prisma.cognitiveAssessment.findMany({
          where: {
            studentId: req.studentId,
          },
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            rollNumber: true,
            age: true,
            grade: true,
            board: true,
            score: true,
            correctCount: true,
            questionCount: true,
            totalTimeMs: true,
            responses: true,
            createdAt: true,

            reasoningScore: true,
            reasoningCorrectCount: true,
            reasoningQuestionCount: true,
            reasoningAvgResponseMs: true,

            workingMemoryScore: true,
            workingMemoryCorrectCount: true,
            workingMemoryQuestionCount: true,
            workingMemoryAvgResponseMs: true,

            attentionScore: true,
            attentionCorrectCount: true,
            attentionQuestionCount: true,
            attentionAvgResponseMs: true,

            inhibitionScore: true,
            inhibitionCorrectCount: true,
            inhibitionQuestionCount: true,
            inhibitionAvgResponseMs: true,

            flexibilityScore: true,
            flexibilityCorrectCount: true,
            flexibilityQuestionCount: true,
            flexibilityAvgResponseMs: true,
          },
        });

      return res.json({
        assessments,
      });
    } catch (error) {
      console.error("Assessment history error:", error);
      return res.status(500).json({
        message: "Unable to load assessment history",
      });
    }
  }
);



app.use(
  (error, req, res, next) => {
    if (
      error?.type ===
      "entity.too.large"
    ) {
      return res.status(413).json({
        message:
          "The request is too large. Please upload a smaller profile photo.",
      });
    }

    if (
      error instanceof SyntaxError &&
      error.status === 400 &&
      error.body
    ) {
      return res.status(400).json({
        message:
          "The request body is not valid JSON.",
      });
    }

    console.error("Unhandled server error:", error);
    return res.status(500).json({
      message: "A server error occurred. Please try again.",
    });
  }
);


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Antarang server running on http://localhost:${PORT}`);
  });
}

export default app;