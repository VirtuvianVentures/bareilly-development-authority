import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const officialsTable = pgTable("officials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  department: text("department").notNull().default(""),
  photoUrl: text("photo_url"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOfficialSchema = createInsertSchema(officialsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOfficial = z.infer<typeof insertOfficialSchema>;
export type Official = typeof officialsTable.$inferSelect;
