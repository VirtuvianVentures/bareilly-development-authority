import { Router } from "express";
import { db, officialsTable, insertOfficialSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/officials", async (req, res) => {
  const rows = await db
    .select()
    .from(officialsTable)
    .orderBy(asc(officialsTable.displayOrder), asc(officialsTable.id));
  res.json(rows);
});

router.post("/officials", async (req, res) => {
  const parsed = insertOfficialSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(officialsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/officials/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertOfficialSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(officialsTable)
    .set(parsed.data)
    .where(eq(officialsTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/officials/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(officialsTable).where(eq(officialsTable.id, id));
  res.status(204).send();
});

export default router;
