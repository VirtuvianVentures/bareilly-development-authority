import { Router } from "express";
import { db } from "@workspace/db";
import { budgetHeads, financeTransactions } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Budget Heads
router.get("/finance/budget", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(budgetHeads).where(eq(budgetHeads.isActive, true)).orderBy(desc(budgetHeads.createdAt));
  res.json(rows);
});
router.post("/finance/budget", requireAdmin, async (req, res) => {
  const [created] = await db.insert(budgetHeads).values(req.body).returning();
  res.status(201).json(created);
});
router.put("/finance/budget/:id", requireAdmin, async (req, res) => {
  const [updated] = await db.update(budgetHeads).set({ ...req.body, updatedAt: new Date() }).where(eq(budgetHeads.id, Number(req.params.id))).returning();
  res.json(updated);
});

// Transactions
router.get("/finance/transactions", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(financeTransactions).where(eq(financeTransactions.isActive, true)).orderBy(desc(financeTransactions.createdAt));
  res.json(rows);
});
router.post("/finance/transactions", requireAdmin, async (req, res) => {
  const [created] = await db.insert(financeTransactions).values(req.body).returning();
  res.status(201).json(created);
});
router.put("/finance/transactions/:id", requireAdmin, async (req, res) => {
  const [updated] = await db.update(financeTransactions).set({ ...req.body, updatedAt: new Date() }).where(eq(financeTransactions.id, Number(req.params.id))).returning();
  res.json(updated);
});

export default router;
