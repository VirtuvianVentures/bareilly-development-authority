import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const whatsNewTable = pgTable("whats_new", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertWhatsNewSchema = createInsertSchema(whatsNewTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWhatsNew = z.infer<typeof insertWhatsNewSchema>;
export type WhatsNew = typeof whatsNewTable.$inferSelect;
