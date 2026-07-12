import { pgTable, serial, text, numeric, boolean, timestamp, date, integer, pgEnum } from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", ["receipt", "payment"]);
export const financeStatusEnum = pgEnum("finance_status", ["pending", "approved", "rejected"]);

export const budgetHeads = pgTable("budget_heads", {
  id: serial("id").primaryKey(),
  headCode: text("head_code").notNull().unique(),
  headName: text("head_name").notNull(),
  majorHead: text("major_head"),
  minorHead: text("minor_head"),
  fyYear: text("fy_year").notNull(),
  allocatedAmount: numeric("allocated_amount", { precision: 15, scale: 2 }).default("0"),
  revisedAmount: numeric("revised_amount", { precision: 15, scale: 2 }).default("0"),
  spentAmount: numeric("spent_amount", { precision: 15, scale: 2 }).default("0"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const financeTransactions = pgTable("finance_transactions", {
  id: serial("id").primaryKey(),
  voucherNo: text("voucher_no").notNull(),
  transactionDate: date("transaction_date").notNull(),
  type: transactionTypeEnum("type").notNull(),
  budgetHeadId: integer("budget_head_id"),
  headCode: text("head_code"),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description").notNull(),
  partyName: text("party_name"),
  chequeNo: text("cheque_no"),
  bankName: text("bank_name"),
  status: financeStatusEnum("status").notNull().default("pending"),
  approvedBy: text("approved_by"),
  remarks: text("remarks"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
