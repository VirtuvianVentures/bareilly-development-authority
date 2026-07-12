import { pgTable, serial, text, numeric, boolean, timestamp, date, pgEnum } from "drizzle-orm/pg-core";

export const propertyTypeEnum = pgEnum("property_type", ["residential", "commercial", "industrial", "plot"]);
export const propertyStatusEnum = pgEnum("property_status", ["available", "allotted", "cancelled", "transferred", "disputed"]);

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  propertyNo: text("property_no").notNull().unique(),
  applicantName: text("applicant_name").notNull(),
  fatherName: text("father_name"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  scheme: text("scheme"),
  sector: text("sector"),
  plotNo: text("plot_no"),
  area: numeric("area", { precision: 10, scale: 2 }),
  areaUnit: text("area_unit").default("sqmt"),
  type: propertyTypeEnum("type").notNull().default("residential"),
  status: propertyStatusEnum("status").notNull().default("available"),
  allotmentDate: date("allotment_date"),
  registryDate: date("registry_date"),
  totalCost: numeric("total_cost", { precision: 15, scale: 2 }),
  remarks: text("remarks"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
