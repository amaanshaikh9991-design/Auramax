import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));

// Load server/.env when this module is run from the project root, while
// retaining support for a root .env used by the rest of the application.
dotenv.config({ path: path.join(serverDirectory, ".env") });
dotenv.config();

const hf = new InferenceClient(process.env.HF_TOKEN);

const EMBEDDING_MODEL =
  "sentence-transformers/all-MiniLM-L6-v2";

export async function createEmbedding(text) {
  if (!process.env.HF_TOKEN?.trim()) {
    throw new Error(
      "Hugging Face authentication is not configured. Add HF_TOKEN=hf_... to the project root .env file."
    );
  }

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Embedding text must be a non-empty string.");
  }

  try {
    return await hf.featureExtraction({
      model: EMBEDDING_MODEL,
      inputs: text,
    });
  } catch (error) {
    const status = error?.httpResponse?.status;
    if (status === 401) {
      throw new Error(
        "Hugging Face rejected HF_TOKEN (401 Unauthorized). Create or replace a Hugging Face token with Inference permissions, then restart the server."
      );
    }
    if (status === 403) {
      throw new Error(
        "Hugging Face denied access to the inference provider (403 Forbidden). Check the token permissions and provider access."
      );
    }
    throw new Error(
      `Hugging Face embedding failed${status ? ` (HTTP ${status})` : ""}: ${error.message}`
    );
  }
}