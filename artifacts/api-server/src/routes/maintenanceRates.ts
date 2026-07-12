import { Router } from "express";
import { db, maintenanceRates, insertMaintenanceRateSchema } from "@workspace/db";
import { eq, desc, and, ne } from "drizzle-orm";

const router = Router();

router.get("/maintenance/rates", async (_req, res) => {
  const rows = await db.select().from(maintenanceRates).orderBy(desc(maintenanceRates.createdAt));
  res.json(rows);
});

router.post("/maintenance/rates", async (req, res) => {
  const parsed = insertMaintenanceRateSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues }); return; }

  const { propertyType, isDeveloped, effectiveFrom } = parsed.data;

  if (effectiveFrom) {
    const existing = await db.select().from(maintenanceRates)
      .where(and(
        eq(maintenanceRates.propertyType, propertyType),
        eq(maintenanceRates.isDeveloped, isDeveloped ?? false)
      ));

    for (const slab of existing) {
      if (!slab.effectiveTo) {
        res.status(400).json({ error: `An open-ended slab for "${propertyType} / ${isDeveloped ? "Developed" : "Undeveloped"}" has no Effective To date. Please close it first before adding a new slab.` });
        return;
      }
      if (effectiveFrom <= slab.effectiveTo) {
        res.status(400).json({ error: `New slab Effective From (${effectiveFrom}) must be after the existing slab's Effective To (${slab.effectiveTo}).` });
        return;
      }
    }
  }

  const [row] = await db.insert(maintenanceRates).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/maintenance/rates/:id", async (req, res) => {
  const parsed = insertMaintenanceRateSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.issues }); return; }

  const { propertyType, isDeveloped, effectiveFrom, effectiveTo } = parsed.data;
  const id = Number(req.params.id);

  if (effectiveFrom && propertyType !== undefined) {
    const existing = await db.select().from(maintenanceRates)
      .where(and(
        eq(maintenanceRates.propertyType, propertyType),
        eq(maintenanceRates.isDeveloped, isDeveloped ?? false),
        ne(maintenanceRates.id, id)
      ));

    for (const slab of existing) {
      if (!slab.effectiveTo) {
        res.status(400).json({ error: `Another open-ended slab exists for "${propertyType} / ${isDeveloped ? "Developed" : "Undeveloped"}". Close it first.` });
        return;
      }
      if (effectiveFrom <= slab.effectiveTo) {
        res.status(400).json({ error: `Effective From (${effectiveFrom}) must be after existing slab's Effective To (${slab.effectiveTo}).` });
        return;
      }
    }
  }

  if (effectiveFrom && effectiveTo && effectiveTo <= effectiveFrom) {
    res.status(400).json({ error: "Effective To must be after Effective From." });
    return;
  }

  const [row] = await db.update(maintenanceRates)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(maintenanceRates.id, id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/maintenance/rates/:id", async (req, res) => {
  await db.delete(maintenanceRates).where(eq(maintenanceRates.id, Number(req.params.id)));
  res.status(204).send();
});

export default router;
