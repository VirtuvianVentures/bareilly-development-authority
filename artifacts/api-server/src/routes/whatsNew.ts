import { Router } from "express";
import { db, whatsNewTable, insertWhatsNewSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/whats-new", async (req, res) => {
  const rows = await db
    .select()
    .from(whatsNewTable)
    .orderBy(asc(whatsNewTable.displayOrder), asc(whatsNewTable.id));
  res.json(rows);
});

router.post("/whats-new", async (req, res) => {
  const parsed = insertWhatsNewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(whatsNewTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/whats-new/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertWhatsNewSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(whatsNewTable)
    .set(parsed.data)
    .where(eq(whatsNewTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/whats-new/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(whatsNewTable).where(eq(whatsNewTable.id, id));
  res.status(204).send();
});

export default router;
