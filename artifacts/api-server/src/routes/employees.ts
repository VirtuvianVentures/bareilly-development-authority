import { Router } from "express";
import { db } from "@workspace/db";
import { employees } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

/* Strip fields that must not be written by clients */
function sanitize(body: Record<string, any>) {
  const { id, createdAt, updatedAt, ...rest } = body;

  /* Convert empty strings to null for nullable columns */
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (v === "" || v === "undefined") {
      out[k] = null;
    } else if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
      /* date-only strings (YYYY-MM-DD) — keep as string; Drizzle `date` columns accept strings */
      out[k] = v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

router.get("/employees", requireAdmin, async (_req, res) => {
  const rows = await db
    .select()
    .from(employees)
    .where(eq(employees.isActive, true))
    .orderBy(desc(employees.createdAt));
  res.json(rows);
});

router.post("/employees", requireAdmin, async (req, res) => {
  const data = sanitize(req.body);
  const [created] = await db.insert(employees).values(data as any).returning();
  res.status(201).json(created);
});

router.put("/employees/:id", requireAdmin, async (req, res) => {
  const data = sanitize(req.body);
  const [updated] = await db
    .update(employees)
    .set({ ...data, updatedAt: new Date() } as any)
    .where(eq(employees.id, Number(req.params.id)))
    .returning();
  res.json(updated);
});

router.delete("/employees/:id", requireAdmin, async (req, res) => {
  await db
    .update(employees)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(employees.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
