import express from "express";
import multer from "multer";
import prisma from "./db.js";
import { createEmbedding } from "./embedding.js";
import { requireAuth } from "./middleware.js";

const router = express.Router();
const MAX_DOCUMENT_CHARS = 1_000_000;
const MAX_CHUNKS = 250;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    callback(null, file.mimetype === "application/pdf");
  },
});

export function splitIntoChunks(text, chunkSize = 1200, overlap = 180) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const chunks = [];
  for (let start = 0; start < normalized.length; start += chunkSize - overlap) {
    const content = normalized.slice(start, start + chunkSize).trim();
    if (content) chunks.push(content);
    if (chunks.length >= MAX_CHUNKS) break;
  }
  return chunks;
}

export async function retrieveRelevantChunks(studentId, query, limit = 6) {
  const queryEmbedding = await createEmbedding(query);
  const vector = `[${queryEmbedding.join(",")}]`;
  return prisma.$queryRaw`
    SELECT
      chunks.id,
      chunks.content,
      chunks."page_number" AS "pageNumber",
      documents.filename,
      1 - (chunks.embedding <=> ${vector}::vector) AS similarity
    FROM "document_chunks" chunks
    INNER JOIN "documents" documents
      ON documents.id = chunks."document_id"
    WHERE chunks."student_id" = ${studentId}
      AND 1 - (chunks.embedding <=> ${vector}::vector) > 0.2
    ORDER BY chunks.embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;
}

router.post("/upload", requireAuth, upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file." });
    }

    // Lazy import of v1 internal — avoids test-file check and DOMMatrix crash
    const { default: pdfParse } = await import("pdf-parse/lib/pdf-parse.js");
    const result = await pdfParse(req.file.buffer, { version: "v2.0.550" });
    const text = result.text?.trim() || "";

    if (!text) {
      return res.status(400).json({ message: "No readable text was found in this PDF." });
    }
    if (text.length > MAX_DOCUMENT_CHARS) {
      return res.status(413).json({ message: "This PDF contains too much text. Please upload a shorter document." });
    }

    const chunks = splitIntoChunks(text);
    const document = await prisma.document.create({
      data: {
        studentId: req.studentId,
        filename: req.file.originalname.slice(0, 255),
      },
    });

    try {
      for (const [chunkIndex, content] of chunks.entries()) {
        const embedding = await createEmbedding(content);
        const vector = `[${embedding.join(",")}]`;
        await prisma.$executeRaw`
          INSERT INTO "document_chunks"
            ("document_id", "student_id", "chunk_index", "content", "embedding")
          VALUES
            (${document.id}, ${req.studentId}, ${chunkIndex}, ${content}, ${vector}::vector)
        `;
      }
    } catch (error) {
      await prisma.document.delete({ where: { id: document.id } });
      throw error;
    }

    return res.status(201).json({
      message: "PDF saved and added to Antarang AI memory.",
      document: {
        id: document.id,
        filename: document.filename,
        chunks: chunks.length,
        textLength: text.length,
      },
    });
  } catch (error) {
    console.error("PDF ingestion error:", error);
    return res.status(500).json({
      message: error instanceof Error && error.message.includes("Hugging Face")
        ? error.message
        : "Failed to read and save this PDF.",
    });
  }
});

router.get("/", requireAuth, async (req, res) => {
  const documents = await prisma.document.findMany({
    where: { studentId: req.studentId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      createdAt: true,
      _count: { select: { chunks: true } },
    },
  });
  return res.json({ documents });
});

export default router;
