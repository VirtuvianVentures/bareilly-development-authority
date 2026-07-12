import { Router } from "express";
import { db } from "@workspace/db";
import { maintenanceCharges } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/maintenance", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(maintenanceCharges).where(eq(maintenanceCharges.isActive, true)).orderBy(desc(maintenanceCharges.createdAt));
  res.json(rows);
});

router.post("/maintenance", requireAdmin, async (req, res) => {
  const [created] = await db.insert(maintenanceCharges).values(req.body).returning();
  res.status(201).json(created);
});

router.put("/maintenance/:id", requireAdmin, async (req, res) => {
  const { id, createdAt, updatedAt, ...rest } = req.body;
  const [updated] = await db.update(maintenanceCharges).set({ ...rest, updatedAt: new Date() }).where(eq(maintenanceCharges.id, Number(req.params.id))).returning();
  res.json(updated);
});

router.delete("/maintenance/:id", requireAdmin, async (req, res) => {
  await db.update(maintenanceCharges).set({ isActive: false, updatedAt: new Date() }).where(eq(maintenanceCharges.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
