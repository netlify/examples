import { Handler } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { OpenAI } from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const DATABASE_URL = process.env.NETLIFY_DATABASE_URL;

if (!OPENAI_KEY || !DATABASE_URL) {
  throw new Error("Missing OPENAI_API_KEY or DATABASE_URL in environment");
}

// Initialize Neon client
const sql = neon(DATABASE_URL);

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: OPENAI_KEY });

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON payload" };
  }

  const { query, top_k = 5 } = body;
  if (typeof query !== "string") {
    return { statusCode: 400, body: "`query` must be a string" };
  }

  try {
    // Generate embedding for the user query
    const embedRes = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });
    const vector = embedRes.data[0].embedding;
    const vecString = `[${vector.join(",")}]`;

    // Query the embeddings table for nearest neighbors
    // Using the ivfflat index with L2 distance operator `<=>`
    const rows = await sql`
      SELECT id, content,
             embedding <=> ${vecString}::vector AS distance
      FROM embeddings
      ORDER BY distance
      LIMIT ${top_k}
    `;

    // Return response
    return {
      statusCode: 200,
      body: JSON.stringify({ results: rows }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};

export { handler };
