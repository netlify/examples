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

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    console.error(e);
    return new Response("Invalid JSON payload", { status: 400 });
  }

  const { query, top_k = 5 } = body;
  if (typeof query !== "string") {
    return new Response("`query` must be a string", { status: 400 });
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
    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
