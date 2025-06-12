CREATE TABLE "embeddings" (
	"id" serial NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "embeddings_id_pk" PRIMARY KEY("id")
);
