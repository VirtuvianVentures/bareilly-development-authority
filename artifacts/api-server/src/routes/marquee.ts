import { Router } from "express";
import { db, marqueeTable, insertMarqueeSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/marquee", async (req, res) => {
  const rows = await db
    .select()
    .from(marqueeTable)
    .where(eq(marqueeTable.isActive, true))
    .orderBy(asc(marqueeTable.displayOrder), asc(marqueeTable.id));
  res.json(rows);
});

router.get("/marquee/all", async (req, res) => {
  const rows = await db
    .select()
    .from(marqueeTable)
    .orderBy(asc(marqueeTable.displayOrder), asc(marqueeTable.id));
  res.json(rows);
});

router.post("/marquee", async (req, res) => {
  const parsed = insertMarqueeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(marqueeTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/marquee/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertMarqueeSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(marqueeTable)
    .set(parsed.data)
    .where(eq(marqueeTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/marquee/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(marqueeTable).where(eq(marqueeTable.id, id));
  res.status(204).send();
});

export default router;
