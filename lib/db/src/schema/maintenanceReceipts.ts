import { pgTable, serial, text, numeric, timestamp, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const maintenanceReceipts = pgTable("maintenance_receipts", {
  id: serial("id").primaryKey(),
  chargeId: integer("charge_id").notNull(),
  receiptNo: text("receipt_no").notNull(),
  paidAmount: numeric("paid_amount", { precision: 12, scale: 2 }).notNull(),
  paidDate: date("paid_date").notNull(),
  paymentMode: text("payment_mode").notNull(),
  transactionRef: text("transaction_ref"),
  collectedBy: text("collected_by"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMaintenanceReceiptSchema = createInsertSchema(maintenanceReceipts).omit({ id: true, createdAt: true });
export type InsertMaintenanceReceipt = z.infer<typeof insertMaintenanceReceiptSchema>;
export type MaintenanceReceipt = typeof maintenanceReceipts.$inferSelect;
