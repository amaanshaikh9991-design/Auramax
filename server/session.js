import crypto from "node:crypto";
import prisma from "./db.js";

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// =========================
// CREATE SESSION
// =========================

export async function createSession(studentId) {
  const sessionId = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION
  );

  await prisma.session.create({
    data: {
      id: sessionId,
      studentId,
      expiresAt,
    },
  });

  return {
    sessionId,
    expiresAt,
  };
}

// =========================
// GET SESSION
// =========================

export async function getSession(sessionId) {
  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    return null;
  }

  // Session expired
  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({
      where: {
        id: sessionId,
      },
    });

    return null;
  }

  return session;
}

// =========================
// DELETE SESSION
// =========================

export async function deleteSession(sessionId) {
  if (!sessionId) {
    return;
  }

  await prisma.session.deleteMany({
    where: {
      id: sessionId,
    },
  });
}