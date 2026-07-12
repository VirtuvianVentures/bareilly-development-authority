import { pgTable, serial, text, numeric, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const maintenanceRates = pgTable("maintenance_rate_slabs", {
  id: serial("id").primaryKey(),
  propertyType: text("property_type").notNull(),
  isDeveloped: boolean("is_developed").notNull().default(false),
  description: text("description"),
  ratePerSqft: numeric("rate_per_sqft", { precision: 10, scale: 2 }),
  minimumCharge: numeric("minimum_charge", { precision: 12, scale: 2 }),
  effectiveFrom: date("effective_from"),
  effectiveTo: date("effective_to"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMaintenanceRateSchema = createInsertSchema(maintenanceRates).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMaintenanceRate = z.infer<typeof insertMaintenanceRateSchema>;
export type MaintenanceRate = typeof maintenanceRates.$inferSelect;
