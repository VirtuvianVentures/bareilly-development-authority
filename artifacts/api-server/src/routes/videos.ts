import { Router } from "express";
import { db, videosTable, insertVideoSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/videos", async (req, res) => {
  const rows = await db
    .select()
    .from(videosTable)
    .orderBy(asc(videosTable.displayOrder), asc(videosTable.id));
  res.json(rows);
});

router.post("/videos", async (req, res) => {
  const parsed = insertVideoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(videosTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/videos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertVideoSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(videosTable)
    .set(parsed.data)
    .where(eq(videosTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/videos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(videosTable).where(eq(videosTable.id, id));
  res.status(204).send();
});

export default router;
