import { Router } from "express";
import { db, newsTable, insertNewsSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/news", async (req, res) => {
  const rows = await db
    .select()
    .from(newsTable)
    .orderBy(asc(newsTable.displayOrder), asc(newsTable.id));
  res.json(rows);
});

router.post("/news", async (req, res) => {
  const parsed = insertNewsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(newsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/news/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertNewsSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(newsTable)
    .set(parsed.data)
    .where(eq(newsTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/news/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(newsTable).where(eq(newsTable.id, id));
  res.status(204).send();
});

export default router;
