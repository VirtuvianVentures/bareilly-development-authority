import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bannersTable = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleHindi: text("title_hindi"),
  subtitle: text("subtitle"),
  description: text("description"),
  imageUrl: text("image_url"),
  bgGradient: text("bg_gradient").notNull().default("from-slate-900 to-teal-800"),
  linkUrl: text("link_url"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBannerSchema = createInsertSchema(bannersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof bannersTable.$inferSelect;
