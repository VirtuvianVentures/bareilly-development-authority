import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const grievanceSections = pgTable("grievance_sections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const grievanceRoles = pgTable("grievance_roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const grievanceSubjects = pgTable("grievance_subjects", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  sectionId: integer("section_id"),
  roleId: integer("role_id"),
  officerName: text("officer_name"),
  officerMobile: text("officer_mobile"),
  officerEmail: text("officer_email"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
