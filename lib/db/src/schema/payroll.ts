import { pgTable, serial, text, numeric, boolean, timestamp, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const payrollStatusEnum = pgEnum("payroll_status", ["draft", "processed", "paid", "revised"]);

export const payrollRecords = pgTable("payroll_records", {
  id:               serial("id").primaryKey(),
  employeeId:       integer("employee_id").notNull(),
  empCode:          text("emp_code").notNull(),
  empName:          text("emp_name").notNull(),
  month:            integer("month").notNull(),
  year:             integer("year").notNull(),

  /* ── Earnings — prorated by worked_days / month_days ── */
  basicPay:         numeric("basic_pay",        { precision: 12, scale: 2 }).default("0"),
  da:               numeric("da",               { precision: 12, scale: 2 }).default("0"),
  workedDays:       integer("worked_days"),
  monthDays:        integer("month_days").default(30),
  totalAllowances:  numeric("total_allowances", { precision: 12, scale: 2 }).default("0"),
  grossPay:         numeric("gross_pay",        { precision: 12, scale: 2 }).default("0"),

  /* ── Deductions ── */
  totalDeductions:  numeric("total_deductions", { precision: 12, scale: 2 }).default("0"),
  netPay:           numeric("net_pay",          { precision: 12, scale: 2 }).default("0"),

  /* ── JSONB snapshots (from Master at generation time) ── */
  allowancesData:   jsonb("allowances_data").$type<{ name: string; amount: number }[]>(),
  deductionsData:   jsonb("deductions_data").$type<{ name: string; amount: number }[]>(),

  /* ── Authority contribution ── */
  employerNps:      numeric("employer_nps",     { precision: 12, scale: 2 }).default("0"),

  status:           payrollStatusEnum("status").notNull().default("draft"),
  paidDate:         text("paid_date"),
  remarks:          text("remarks"),
  isActive:         boolean("is_active").notNull().default(true),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
  updatedAt:        timestamp("updated_at").notNull().defaultNow(),
});

/* ── Simple payroll master tables (migrated from localStorage) ── */
export const payrollPaybillGroups = pgTable("payroll_paybill_groups", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  status:    text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const payrollHouseTypes = pgTable("payroll_house_types", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  status:    text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const payrollBranches = pgTable("payroll_branches", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  status:    text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const payrollGroups = pgTable("payroll_groups", {
  id:        serial("id").primaryKey(),
  name:      text("name").notNull(),
  status:    text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
