import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const interpretations = pgTable("interpretations", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  confidence: integer("confidence").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: integer("user_id").references(() => users.id),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertInterpretationSchema = createInsertSchema(interpretations).pick({
  text: true,
  confidence: true,
  userId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertInterpretation = z.infer<typeof insertInterpretationSchema>;
export type Interpretation = typeof interpretations.$inferSelect;

// API Types
export const geminiRequestSchema = z.object({
  imageData: z.string().min(1),
});

export const geminiResponseSchema = z.object({
  text: z.string(),
  confidence: z.number(),
});

export type GeminiRequest = z.infer<typeof geminiRequestSchema>;
export type GeminiResponse = z.infer<typeof geminiResponseSchema>;
