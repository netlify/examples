import {
  integer,
  pgTable,
  text,
  timestamp,
  serial,
  primaryKey,
  foreignKey,
  index,
  customType,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define custom vector type
const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(1536)";
  },
});

export const embeddings = pgTable(
  "embeddings",
  {
    id: serial("id"),
    chunk_index: integer("chunk_index").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).default(
      sql`now()`
    ),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  })
);
