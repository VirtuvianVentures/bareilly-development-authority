import { Router } from "express";
import { db } from "@workspace/db";
import { courtCases } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/court-cases", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(courtCases).where(eq(courtCases.isActive, true)).orderBy(desc(courtCases.createdAt));
  res.json(rows);
});

router.post("/court-cases", requireAdmin, async (req, res) => {
  const [created] = await db.insert(courtCases).values(req.body).returning();
  res.status(201).json(created);
});

router.put("/court-cases/:id", requireAdmin, async (req, res) => {
  const [updated] = await db.update(courtCases).set({ ...req.body, updatedAt: new Date() }).where(eq(courtCases.id, Number(req.params.id))).returning();
  res.json(updated);
});

router.delete("/court-cases/:id", requireAdmin, async (req, res) => {
  await db.update(courtCases).set({ isActive: false, updatedAt: new Date() }).where(eq(courtCases.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
