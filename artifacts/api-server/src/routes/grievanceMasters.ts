import { Router } from "express";
import { db } from "@workspace/db";
import { grievanceSections, grievanceRoles, grievanceSubjects } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ── SECTIONS ──────────────────────────────────────────────
router.get("/grievance-masters/sections", async (_req, res) => {
  const rows = await db.select().from(grievanceSections).orderBy(desc(grievanceSections.createdAt));
  res.json(rows);
});
router.post("/grievance-masters/sections", requireAuth, async (req, res) => {
  const [row] = await db.insert(grievanceSections).values(req.body).returning();
  res.status(201).json(row);
});
router.put("/grievance-masters/sections/:id", requireAuth, async (req, res) => {
  const [row] = await db.update(grievanceSections).set(req.body).where(eq(grievanceSections.id, Number(req.params.id))).returning();
  res.json(row);
});
router.delete("/grievance-masters/sections/:id", requireAuth, async (req, res) => {
  await db.delete(grievanceSections).where(eq(grievanceSections.id, Number(req.params.id)));
  res.status(204).end();
});

// ── ROLES ──────────────────────────────────────────────────
router.get("/grievance-masters/roles", async (_req, res) => {
  const rows = await db.select().from(grievanceRoles).orderBy(desc(grievanceRoles.createdAt));
  res.json(rows);
});
router.post("/grievance-masters/roles", requireAuth, async (req, res) => {
  const [row] = await db.insert(grievanceRoles).values(req.body).returning();
  res.status(201).json(row);
});
router.put("/grievance-masters/roles/:id", requireAuth, async (req, res) => {
  const [row] = await db.update(grievanceRoles).set(req.body).where(eq(grievanceRoles.id, Number(req.params.id))).returning();
  res.json(row);
});
router.delete("/grievance-masters/roles/:id", requireAuth, async (req, res) => {
  await db.delete(grievanceRoles).where(eq(grievanceRoles.id, Number(req.params.id)));
  res.status(204).end();
});

// ── SUBJECTS ───────────────────────────────────────────────
router.get("/grievance-masters/subjects", async (_req, res) => {
  const rows = await db.select().from(grievanceSubjects).orderBy(desc(grievanceSubjects.createdAt));
  res.json(rows);
});
router.post("/grievance-masters/subjects", requireAuth, async (req, res) => {
  const [row] = await db.insert(grievanceSubjects).values(req.body).returning();
  res.status(201).json(row);
});
router.put("/grievance-masters/subjects/:id", requireAuth, async (req, res) => {
  const [row] = await db.update(grievanceSubjects).set(req.body).where(eq(grievanceSubjects.id, Number(req.params.id))).returning();
  res.json(row);
});
router.delete("/grievance-masters/subjects/:id", requireAuth, async (req, res) => {
  await db.delete(grievanceSubjects).where(eq(grievanceSubjects.id, Number(req.params.id)));
  res.status(204).end();
});

export default router;
