import { Router } from "express";
import { db } from "@workspace/db";
import { payrollRecords, employees } from "@workspace/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/payroll", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(payrollRecords).where(eq(payrollRecords.isActive, true)).orderBy(desc(payrollRecords.createdAt));
  res.json(rows);
});

// Salary report: /payroll/report?month=7&year=2026&type=officer|other
router.get("/payroll/report", requireAdmin, async (req, res) => {
  const month = Number(req.query.month);
  const year  = Number(req.query.year);
  const type  = req.query.type as string; // "officer" | "other"

  if (!month || !year || !type) {
    return res.status(400).json({ error: "month, year, type required" });
  }

  // Join payroll_records with employees to filter by employeeType
  const rows = await db
    .select({
      id:               payrollRecords.id,
      empCode:          payrollRecords.empCode,
      empName:          payrollRecords.empName,
      month:            payrollRecords.month,
      year:             payrollRecords.year,
      basicPay:         payrollRecords.basicPay,
      da:               payrollRecords.da,
      hra:              payrollRecords.hra,
      ta:               payrollRecords.ta,
      otherAllowances:  payrollRecords.otherAllowances,
      grossPay:         payrollRecords.grossPay,
      gpf:              payrollRecords.gpf,
      nps:              payrollRecords.nps,
      incomeTax:        payrollRecords.incomeTax,
      otherDeductions:  payrollRecords.otherDeductions,
      totalDeductions:  payrollRecords.totalDeductions,
      netPay:           payrollRecords.netPay,
      status:           payrollRecords.status,
      designation:      employees.designation,
      department:       employees.department,
      employeeType:     employees.employeeType,
    })
    .from(payrollRecords)
    .innerJoin(employees, eq(payrollRecords.employeeId, employees.id))
    .where(
      and(
        eq(payrollRecords.month, month),
        eq(payrollRecords.year, year),
        eq(payrollRecords.isActive, true),
        eq(employees.employeeType, type as "officer" | "other"),
        eq(employees.isActive, true),
      )
    )
    .orderBy(employees.empCode);

  res.json(rows);
});

router.post("/payroll", requireAdmin, async (req, res) => {
  const [created] = await db.insert(payrollRecords).values(req.body).returning();
  res.status(201).json(created);
});

router.put("/payroll/:id", requireAdmin, async (req, res) => {
  const [updated] = await db.update(payrollRecords).set({ ...req.body, updatedAt: new Date() }).where(eq(payrollRecords.id, Number(req.params.id))).returning();
  res.json(updated);
});

router.delete("/payroll/:id", requireAdmin, async (req, res) => {
  await db.update(payrollRecords).set({ isActive: false, updatedAt: new Date() }).where(eq(payrollRecords.id, Number(req.params.id)));
  res.json({ ok: true });
});

export default router;
