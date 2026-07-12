import { pgTable, serial, text, boolean, timestamp, date, pgEnum } from "drizzle-orm/pg-core";

export const caseStatusEnum = pgEnum("case_status", ["pending", "hearing", "decided", "appealed", "closed", "stayed"]);
export const caseTypeEnum = pgEnum("case_type", ["civil", "criminal", "writ", "arbitration", "consumer", "revenue", "other"]);

export const courtCases = pgTable("court_cases", {
  id: serial("id").primaryKey(),
  caseNo: text("case_no").notNull(),
  caseTitle: text("case_title").notNull(),
  court: text("court").notNull(),
  caseType: caseTypeEnum("case_type").notNull().default("civil"),
  petitioner: text("petitioner"),
  respondent: text("respondent"),
  filingDate: date("filing_date"),
  advocate: text("advocate"),
  advocatePhone: text("advocate_phone"),
  nextHearing: date("next_hearing"),
  status: caseStatusEnum("status").notNull().default("pending"),
  subject: text("subject"),
  lastOrderDate: date("last_order_date"),
  lastOrderSummary: text("last_order_summary"),
  remarks: text("remarks"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
