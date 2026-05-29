import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const nirdanData = pgTable("nirdan_data", {
  id: serial().primaryKey(),
  giftIdea: text("gift_idea").notNull().default(""),
  importantDate: text("important_date").notNull().default(""),
  loveCount: integer("love_count").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hribilData = pgTable("hribil_data", {
  id: serial().primaryKey(),
  giftIdea: text("gift_idea").notNull().default(""),
  importantDate: text("important_date").notNull().default(""),
  loveCount: integer("love_count").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});
