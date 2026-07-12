import { Router } from "express";
import { db, maintenanceReceipts, insertMaintenanceReceiptSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/maintenance/receipts", async (_req, res) => {
  const rows = await db.select().from(maintenanceReceipts).orderBy(desc(maintenanceReceipts.createdAt));
  res.json(rows);
});

router.get("/maintenance/receipts/:chargeId", async (req, res) => {
  const rows = await db.select().from(maintenanceReceipts)
    .where(eq(maintenanceReceipts.chargeId, Number(req.params.chargeId)));
  res.json(rows);
});

router.post("/maintenance/receipts", async (req, res) => {
  const parsed = insertMaintenanceReceiptSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues }); return; }
  const [row] = await db.insert(maintenanceReceipts).values(parsed.data).returning();
  res.status(201).json(row);
});

export default router;
