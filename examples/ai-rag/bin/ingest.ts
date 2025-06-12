#!/usr/bin/env tsx

import { readdir, readFile } from "fs/promises";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import { OpenAI } from "openai";
import { embeddings } from "../db/schema"; // adjust path to your schema

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DATABASE_URL = process.env.NETLIFY_DATABASE_URL;

if (!OPENAI_KEY) {
  console.error("Missing OPENAI_API_KEY in environment");
  process.exit(1);
}
if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment");
  process.exit(1);
}

// Initialize Neon client and Drizzle ORM
const neonSql = neon(DATABASE_URL);
const db = drizzle(neonSql);

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_KEY });

/**
 * Recursively walk a directory, yielding every Markdown file path.
 */
async function* walk(dir: string): AsyncGenerator<string> {
  for (const dirent of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* walk(full);
    } else if (dirent.isFile() && full.endsWith(".md")) {
      yield full;
    }
  }
}

async function main() {
  const targetDir = process.argv[2] || "./data";

  for await (const filePath of walk(targetDir)) {
    const relPath = path.relative(targetDir, filePath);
    const content = await readFile(filePath, "utf8");

    // Throttle to avoid hitting rate limits
    await new Promise((r) => setTimeout(r, 200));

    // Generate embedding for the entire file
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: content,
    });
    const vector = response.data[0].embedding;
    const vecString = `[${vector.join(",")}]`;

    // Insert into Neon DB via Drizzle
    const [inserted] = await db
      .insert(embeddings)
      .values({
        chunk_index: 0,
        content,
        embedding: sql`${vecString}::vector`,
      })
      .returning({ id: embeddings.id });

    console.log(`Inserted ${relPath} with ID ${inserted.id}`);
  }

  console.log("All embeddings saved to the database.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
