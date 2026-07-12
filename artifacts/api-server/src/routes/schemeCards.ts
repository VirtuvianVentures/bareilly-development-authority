import { Router } from "express";
import { db, schemeCardsTable, insertSchemeCardSchema } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";

const router = Router();

router.get("/scheme-cards", async (req, res) => {
  const rows = await db
    .select()
    .from(schemeCardsTable)
    .orderBy(asc(schemeCardsTable.displayOrder), desc(schemeCardsTable.createdAt));
  res.json(rows);
});

router.post("/scheme-cards", async (req, res) => {
  const parsed = insertSchemeCardSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(schemeCardsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/scheme-cards/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertSchemeCardSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(schemeCardsTable)
    .set(parsed.data)
    .where(eq(schemeCardsTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/scheme-cards/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(schemeCardsTable).where(eq(schemeCardsTable.id, id));
  res.status(204).send();
});

export default router;
