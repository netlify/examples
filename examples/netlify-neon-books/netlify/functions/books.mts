import { neon } from "@netlify/neon";
import type { Context, Config } from "@netlify/functions";

const sql = neon();

// Ensure table exists
async function ensureTable() {
  await sql(`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      cover_url TEXT NOT NULL
    )
  `);
}

export default async (req: Request, context: Context) => {
  await ensureTable();

  if (req.method === "GET") {
    // Fetch all books
    const rows = await sql("SELECT * FROM books ORDER BY id DESC");
    return new Response(JSON.stringify(rows), {
      headers: { "Content-Type": "application/json" },
    });
  } else if (req.method === "POST") {
    // Add a new book
    const { title, author, cover_url } = await req.json();
    if (!title || !author || !cover_url) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await sql(
      "INSERT INTO books (title, author, cover_url) VALUES ($1, $2, $3)",
      [title, author, cover_url]
    );
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response("Method Not Allowed", { status: 405 });
  }
};

export const config: Config = {
  path: "/api/books",
};
