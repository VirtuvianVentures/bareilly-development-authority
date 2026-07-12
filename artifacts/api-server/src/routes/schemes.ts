import { Router } from "express";
import { db, schemesTable, insertSchemeSchema } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";

const router = Router();

router.get("/schemes", async (req, res) => {
  const rows = await db
    .select()
    .from(schemesTable)
    .orderBy(asc(schemesTable.displayOrder), desc(schemesTable.createdAt));
  res.json(rows);
});

router.get("/schemes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [row] = await db.select().from(schemesTable).where(eq(schemesTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.post("/schemes", async (req, res) => {
  const parsed = insertSchemeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(schemesTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/schemes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertSchemeSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(schemesTable)
    .set(parsed.data)
    .where(eq(schemesTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/schemes/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(schemesTable).where(eq(schemesTable.id, id));
  res.status(204).send();
});

export default router;
