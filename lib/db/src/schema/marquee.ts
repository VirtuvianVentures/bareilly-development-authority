import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const marqueeTable = pgTable("marquee_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertMarqueeSchema = createInsertSchema(marqueeTable).omit({ id: true, createdAt: true, updatedAt: true });
