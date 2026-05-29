CREATE TABLE "hribil_data" (
	"id" serial PRIMARY KEY,
	"gift_idea" text DEFAULT '' NOT NULL,
	"important_date" text DEFAULT '' NOT NULL,
	"love_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nirdan_data" (
	"id" serial PRIMARY KEY,
	"gift_idea" text DEFAULT '' NOT NULL,
	"important_date" text DEFAULT '' NOT NULL,
	"love_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
