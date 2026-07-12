import { pgTable, serial, text, numeric, boolean, timestamp, date, integer, pgEnum } from "drizzle-orm/pg-core";

export const chargeStatusEnum = pgEnum("charge_status", ["pending", "paid", "overdue", "waived"]);

export const maintenanceCharges = pgTable("maintenance_charges", {
  id: serial("id").primaryKey(),
  propertyNo: text("property_no").notNull(),
  ownerName: text("owner_name").notNull(),
  sector: text("sector"),
  plotNo: text("plot_no"),
  chargeYear: integer("charge_year").notNull(),
  chargeMonth: integer("charge_month"),
  chargeFromDate: date("charge_from_date"),
  chargeToDate: date("charge_to_date"),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  penaltyAmount: numeric("penalty_amount", { precision: 12, scale: 2 }).default("0"),
  dueDate: date("due_date"),
  paidDate: date("paid_date"),
  receiptNo: text("receipt_no"),
  paymentMode: text("payment_mode"),
  status: chargeStatusEnum("status").notNull().default("pending"),
  remarks: text("remarks"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
