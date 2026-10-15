import { createEmbedding } from "./embedding.js";

const text = "A stack is a linear data structure.";

try {
  const embedding = await createEmbedding(text);

  console.log("Embedding created successfully!");
  console.log("Type:", typeof embedding);
  console.log("Length:", embedding.length);
  console.log("First 5 values:", embedding.slice(0, 5));
} catch (error) {
  console.error("Embedding test failed:", error.message);
  process.exitCode = 1;
}