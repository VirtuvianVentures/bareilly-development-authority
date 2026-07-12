import { pgTable, serial, text, numeric, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const maintenanceProperties = pgTable("maintenance_properties", {
  id: serial("id").primaryKey(),
  propertyCode: text("property_code").unique(),
  propertyNo: text("property_no").notNull().unique(),
  ownerName: text("owner_name").notNull(),
  fatherName: text("father_name"),
  ownerPhone: text("owner_phone"),
  ownerEmail: text("owner_email"),
  sector: text("sector"),
  layoutNo: text("layout_no"),
  colonyName: text("colony_name"),
  plotNo: text("plot_no"),
  flatNo: text("flat_no"),
  propertyType: text("property_type").notNull().default("residential"),
  category: text("category"),
  sectorBlock: text("sector_block"),
  area: numeric("area", { precision: 10, scale: 2 }),
  allotmentDate: date("allotment_date"),
  finalRegistryDate: date("final_registry_date"),
  address: text("address"),
  isPossession: boolean("is_possession").notNull().default(false),
  possessionDate: date("possession_date"),
  isDeveloped: boolean("is_developed").notNull().default(false),
  developedDate: date("developed_date"),
  isCancelled: boolean("is_cancelled").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMaintenancePropertySchema = createInsertSchema(maintenanceProperties).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMaintenanceProperty = z.infer<typeof insertMaintenancePropertySchema>;
export type MaintenanceProperty = typeof maintenanceProperties.$inferSelect;
