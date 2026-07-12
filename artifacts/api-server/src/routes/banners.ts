import { Router } from "express";
import { db, bannersTable, insertBannerSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/banners", async (req, res) => {
  const rows = await db
    .select()
    .from(bannersTable)
    .orderBy(asc(bannersTable.displayOrder), asc(bannersTable.id));
  res.json(rows);
});

router.post("/banners", async (req, res) => {
  const parsed = insertBannerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db.insert(bannersTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/banners/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = insertBannerSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }
  const [row] = await db
    .update(bannersTable)
    .set(parsed.data)
    .where(eq(bannersTable.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/banners/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(bannersTable).where(eq(bannersTable.id, id));
  res.status(204).send();
});

export default router;
