import { Handler } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { OpenAI } from "openai";

const DATABASE_URL = process.env.NETLIFY_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Missing OPENAI_API_KEY or DATABASE_URL in environment");
}

// Initialize Neon client
const sql = neon(DATABASE_URL);

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

  const { apiKey, query, top_k = 5 } = body;
  if (typeof query !== "string") {
    return { statusCode: 400, body: "`query` must be a string" };
  }

  // require a user‐supplied API key
  if (typeof apiKey !== "string" || !apiKey.trim()) {
    return {
      statusCode: 400,
      body: "`apiKey` is required and must be a non-empty string",
    };
  }

  // use only the supplied key
  const openai = new OpenAI({ apiKey: apiKey.trim() });

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

    // Build a ChatGPT prompt with the matched content as context
    const contextText = rows
      .map((row, i) => `Context ${i + 1}:\n${row.content}`)
      .join("\n\n");

    const chatRes = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: [
            "You are a helpful assistant. Use the following context snippets + to answer the user's question.",
            "If the answer cannot be found in the context, respond with “I'm + not sure.”",
            "Please refrain from asking follow up questions and just answer the query to the best of your ability based on the provided context.",
            "",
            contextText,
          ].join("\n"),
        },
        { role: "user", content: query },
      ],
    });

    const answer = chatRes.choices?.[0]?.message?.content ?? "";

    // Return response
    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};

export { handler };
