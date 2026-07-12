import { Router } from "express";
import { db, photosTable, insertPhotoSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/photos", async (req, res) => {
  const rows = await db
    .select()
    .from(photosTable)
    .orderBy(asc(photosTable.displayOrder), asc(photosTable.id));
  res.json(rows);
});

router.post("/photos", async (req, res) => {
  const parsed = insertPhotoSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(photosTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/photos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertPhotoSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(photosTable)
    .set(parsed.data)
    .where(eq(photosTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/photos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(photosTable).where(eq(photosTable.id, id));
  res.status(204).send();
});

export default router;
