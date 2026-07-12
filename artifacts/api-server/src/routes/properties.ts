import { Router } from "express";
import { db } from "@workspace/db";
import { properties } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/properties", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(properties).where(eq(properties.isActive, true)).orderBy(desc(properties.createdAt));
  res.json(rows);
});

router.post("/properties", requireAdmin, async (req, res) => {
  const body = req.body;
  const [created] = await db.insert(properties).values(body).returning();
  res.status(201).json(created);
});

router.put("/properties/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const [updated] = await db.update(properties).set({ ...req.body, updatedAt: new Date() }).where(eq(properties.id, id)).returning();
  res.json(updated);
});

router.delete("/properties/:id", requireAdmin, async (req, res) => {
  await db.update(properties).set({ isActive: false, updatedAt: new Date() }).where(eq(properties.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
