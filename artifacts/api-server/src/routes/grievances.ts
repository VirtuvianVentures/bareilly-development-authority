import { Router } from "express";
import { db } from "@workspace/db";
import { grievances } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Public: submit grievance
router.post("/grievances", async (req, res) => {
  const ticketNo = `BDA-${Date.now().toString(36).toUpperCase()}`;
  const [created] = await db.insert(grievances).values({ ...req.body, ticketNo }).returning();
  res.status(201).json(created);
});

// Public: track by ticket no
router.get("/grievances/track/:ticketNo", async (req, res) => {
  const [row] = await db.select().from(grievances).where(eq(grievances.ticketNo, req.params.ticketNo)).limit(1);
  if (!row) { res.status(404).json({ error: "Ticket not found" }); return; }
  res.json(row);
});

// Protected: admin views all
router.get("/grievances", requireAuth, async (_req, res) => {
  const rows = await db.select().from(grievances).where(eq(grievances.isActive, true)).orderBy(desc(grievances.createdAt));
  res.json(rows);
});

router.put("/grievances/:id", requireAuth, async (req, res) => {
  const [updated] = await db.update(grievances).set({ ...req.body, updatedAt: new Date() }).where(eq(grievances.id, Number(req.params.id))).returning();
  res.json(updated);
});

export default router;
