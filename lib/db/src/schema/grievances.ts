import { pgTable, serial, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const grievanceStatusEnum = pgEnum("grievance_status", ["submitted", "acknowledged", "in_progress", "resolved", "closed", "rejected"]);
export const grievanceCategoryEnum = pgEnum("grievance_category", [
  "property", "maintenance", "allotment", "construction", "water_sewage",
  "road", "park", "corruption", "service_delay", "other"
]);

export const grievances = pgTable("grievances", {
  id: serial("id").primaryKey(),
  ticketNo: text("ticket_no").notNull().unique(),
  applicantName: text("applicant_name").notNull(),
  mobile: text("mobile").notNull(),
  email: text("email"),
  address: text("address"),
  category: grievanceCategoryEnum("category").notNull().default("other"),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  attachmentUrl: text("attachment_url"),
  status: grievanceStatusEnum("status").notNull().default("submitted"),
  assignedTo: text("assigned_to"),
  assignedDepartment: text("assigned_department"),
  resolution: text("resolution"),
  resolvedDate: text("resolved_date"),
  remarks: text("remarks"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
