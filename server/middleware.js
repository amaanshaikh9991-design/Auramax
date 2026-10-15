import { getSession } from "./session.js";

export async function requireAuth(req, res, next) {
  try {
    const sessionId = req.cookies.session;

    const session = await getSession(sessionId);

    if (!session) {
      return res.status(401).json({
        message: "Please log in again.",
      });
    }

    // This is the trusted student ID from the database
    req.studentId = session.studentId;
    req.sessionId = session.id;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(500).json({
      message: "Authentication failed",
    });
  }
}