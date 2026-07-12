import { pgTable, text, serial, timestamp, boolean, integer, numeric, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const schemeTypeEnum = pgEnum("scheme_type", ["scheme", "survey"]);

export const schemesTable = pgTable("schemes", {
  id: serial("id").primaryKey(),
  type: schemeTypeEnum("type").notNull().default("scheme"),
  title: text("title").notNull(),
  titleHindi: text("title_hindi"),
  description: text("description"),
  descriptionHindi: text("description_hindi"),
  imageUrl: text("image_url"),
  bookletUrl: text("booklet_url"),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  fees: numeric("fees", { precision: 12, scale: 2 }),
  feesLabel: text("fees_label"),
  isActive: boolean("is_active").notNull().default(true),
  isOpenForRegistration: boolean("is_open_for_registration").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSchemeSchema = createInsertSchema(schemesTable, {
  startDate: z.coerce.date().nullable().optional(),
  endDate: z.coerce.date().nullable().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemesTable.$inferSelect;
