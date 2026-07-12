import { Router } from "express";
import { db, maintenanceProperties, insertMaintenancePropertySchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/maintenance/properties", async (_req, res) => {
  const rows = await db.select().from(maintenanceProperties)
    .where(eq(maintenanceProperties.isActive, true))
    .orderBy(desc(maintenanceProperties.createdAt));
  res.json(rows);
});

router.post("/maintenance/properties", async (req, res) => {
  const parsed = insertMaintenancePropertySchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues }); return; }
  const [row] = await db.insert(maintenanceProperties).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/maintenance/properties/:id", async (req, res) => {
  const parsed = insertMaintenancePropertySchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues }); return; }
  const [row] = await db.update(maintenanceProperties)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(maintenanceProperties.id, Number(req.params.id)))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/maintenance/properties/:id", async (req, res) => {
  await db.update(maintenanceProperties)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(maintenanceProperties.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
