import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schemeCardsTable = pgTable("scheme_display_cards", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(), // "ongoing" | "schemes"
  title: text("title").notNull(),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSchemeCardSchema = createInsertSchema(schemeCardsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSchemeCard = z.infer<typeof insertSchemeCardSchema>;
export type SchemeCard = typeof schemeCardsTable.$inferSelect;
