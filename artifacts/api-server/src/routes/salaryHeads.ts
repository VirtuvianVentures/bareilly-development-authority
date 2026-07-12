import { Router } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const pg = () => (db as any).$client;

/* ════════ ALLOWANCE HEADS ════════ */
router.get("/allowance-heads", requireAdmin, async (_req, res) => {
  const r = await pg().query("SELECT * FROM allowance_heads WHERE is_active=true ORDER BY id");
  res.json(r.rows);
});
router.post("/allowance-heads", requireAdmin, async (req, res) => {
  const { name, amount } = req.body;
  const r = await pg().query("INSERT INTO allowance_heads (name,amount) VALUES ($1,$2) RETURNING *", [name, Number(amount) || 0]);
  res.status(201).json(r.rows[0]);
});
router.put("/allowance-heads/:id", requireAdmin, async (req, res) => {
  const { name, amount, isActive } = req.body;
  const r = await pg().query("UPDATE allowance_heads SET name=$1, amount=$2, is_active=$3 WHERE id=$4 RETURNING *", [name, Number(amount) || 0, isActive !== false, Number(req.params.id)]);
  res.json(r.rows[0]);
});
router.delete("/allowance-heads/:id", requireAdmin, async (req, res) => {
  await pg().query("UPDATE allowance_heads SET is_active=false WHERE id=$1", [Number(req.params.id)]);
  res.json({ ok: true });
});

/* ════════ DEDUCTION HEADS ════════ */
router.get("/deduction-heads", requireAdmin, async (_req, res) => {
  const r = await pg().query("SELECT * FROM deduction_heads WHERE is_active=true ORDER BY id");
  res.json(r.rows);
});
router.post("/deduction-heads", requireAdmin, async (req, res) => {
  const { name, amount } = req.body;
  const r = await pg().query("INSERT INTO deduction_heads (name,amount) VALUES ($1,$2) RETURNING *", [name, Number(amount) || 0]);
  res.status(201).json(r.rows[0]);
});
router.put("/deduction-heads/:id", requireAdmin, async (req, res) => {
  const { name, amount, isActive } = req.body;
  const r = await pg().query("UPDATE deduction_heads SET name=$1, amount=$2, is_active=$3 WHERE id=$4 RETURNING *", [name, Number(amount) || 0, isActive !== false, Number(req.params.id)]);
  res.json(r.rows[0]);
});
router.delete("/deduction-heads/:id", requireAdmin, async (req, res) => {
  await pg().query("UPDATE deduction_heads SET is_active=false WHERE id=$1", [Number(req.params.id)]);
  res.json({ ok: true });
});

/* ════════ LEAVE HEADS ════════ */
router.get("/leave-heads", requireAdmin, async (_req, res) => {
  const r = await pg().query("SELECT * FROM leave_heads WHERE is_active=true ORDER BY id");
  res.json(r.rows);
});
router.post("/leave-heads", requireAdmin, async (req, res) => {
  const { name, defaultDays } = req.body;
  const r = await pg().query("INSERT INTO leave_heads (name,default_days) VALUES ($1,$2) RETURNING *", [name, Number(defaultDays) || 0]);
  res.status(201).json(r.rows[0]);
});
router.put("/leave-heads/:id", requireAdmin, async (req, res) => {
  const { name, defaultDays, isActive } = req.body;
  const r = await pg().query("UPDATE leave_heads SET name=$1, default_days=$2, is_active=$3 WHERE id=$4 RETURNING *", [name, Number(defaultDays) || 0, isActive !== false, Number(req.params.id)]);
  res.json(r.rows[0]);
});
router.delete("/leave-heads/:id", requireAdmin, async (req, res) => {
  await pg().query("UPDATE leave_heads SET is_active=false WHERE id=$1", [Number(req.params.id)]);
  res.json({ ok: true });
});

/* ════════ EMPLOYEE ALLOWANCES — bulk upsert with is_applicable ════════ */
router.get("/employees/:empId/allowances", requireAdmin, async (req, res) => {
  const r = await pg().query(
    `SELECT ea.*, ah.name, ah.amount as default_amount
     FROM employee_allowances ea
     JOIN allowance_heads ah ON ah.id = ea.allowance_head_id
     WHERE ea.employee_id=$1`,
    [Number(req.params.empId)]
  );
  res.json(r.rows);
});
router.put("/employees/:empId/allowances", requireAdmin, async (req, res) => {
  const empId = Number(req.params.empId);
  const entries: { allowanceHeadId: number; amount: number; isApplicable: boolean }[] = req.body;
  for (const e of entries) {
    await pg().query(
      `INSERT INTO employee_allowances (employee_id, allowance_head_id, amount, is_applicable)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (employee_id, allowance_head_id) DO UPDATE SET amount=EXCLUDED.amount, is_applicable=EXCLUDED.is_applicable`,
      [empId, Number(e.allowanceHeadId), Number(e.amount) || 0, e.isApplicable !== false]
    );
  }
  res.json({ ok: true, saved: entries.length });
});

/* ════════ EMPLOYEE DEDUCTIONS — bulk upsert with is_applicable ════════ */
router.get("/employees/:empId/deductions", requireAdmin, async (req, res) => {
  const r = await pg().query(
    `SELECT ed.*, dh.name, dh.amount as default_amount
     FROM employee_deductions ed
     JOIN deduction_heads dh ON dh.id = ed.deduction_head_id
     WHERE ed.employee_id=$1`,
    [Number(req.params.empId)]
  );
  res.json(r.rows);
});
router.put("/employees/:empId/deductions", requireAdmin, async (req, res) => {
  const empId = Number(req.params.empId);
  const entries: { deductionHeadId: number; amount: number; isApplicable: boolean }[] = req.body;
  for (const e of entries) {
    await pg().query(
      `INSERT INTO employee_deductions (employee_id, deduction_head_id, amount, is_applicable)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (employee_id, deduction_head_id) DO UPDATE SET amount=EXCLUDED.amount, is_applicable=EXCLUDED.is_applicable`,
      [empId, Number(e.deductionHeadId), Number(e.amount) || 0, e.isApplicable !== false]
    );
  }
  res.json({ ok: true, saved: entries.length });
});

/* ════════ EMPLOYEE LEAVES — bulk upsert ════════ */
router.get("/employees/:empId/leaves", requireAdmin, async (req, res) => {
  const r = await pg().query(
    `SELECT el.*, lh.name, lh.default_days
     FROM employee_leaves el
     JOIN leave_heads lh ON lh.id = el.leave_head_id
     WHERE el.employee_id=$1`,
    [Number(req.params.empId)]
  );
  res.json(r.rows);
});
router.put("/employees/:empId/leaves", requireAdmin, async (req, res) => {
  const empId = Number(req.params.empId);
  const entries: { leaveHeadId: number; days: number; isApplicable: boolean }[] = req.body;
  for (const e of entries) {
    await pg().query(
      `INSERT INTO employee_leaves (employee_id, leave_head_id, days, is_applicable)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (employee_id, leave_head_id) DO UPDATE SET days=EXCLUDED.days, is_applicable=EXCLUDED.is_applicable`,
      [empId, Number(e.leaveHeadId), Number(e.days) || 0, e.isApplicable !== false]
    );
  }
  res.json({ ok: true, saved: entries.length });
});

/* ════════ DA MASTER ════════ */
router.get("/da-master", requireAdmin, async (_req, res) => {
  const r = await pg().query("SELECT * FROM da_master WHERE is_active=true ORDER BY id");
  res.json(r.rows);
});
router.post("/da-master", requireAdmin, async (req, res) => {
  const { paybillGroup, daFrom, daUpto, daPercent } = req.body;
  const r = await pg().query(
    "INSERT INTO da_master (paybill_group, da_from, da_upto, da_percent) VALUES ($1,$2,$3,$4) RETURNING *",
    [paybillGroup || "", daFrom || null, daUpto || null, Number(daPercent) || 0]
  );
  res.status(201).json(r.rows[0]);
});
router.put("/da-master/:id", requireAdmin, async (req, res) => {
  const { paybillGroup, daFrom, daUpto, daPercent, isActive } = req.body;
  const r = await pg().query(
    "UPDATE da_master SET paybill_group=$1, da_from=$2, da_upto=$3, da_percent=$4, is_active=$5, updated_at=now() WHERE id=$6 RETURNING *",
    [paybillGroup || "", daFrom || null, daUpto || null, Number(daPercent) || 0, isActive !== false, Number(req.params.id)]
  );
  res.json(r.rows[0]);
});
router.delete("/da-master/:id", requireAdmin, async (req, res) => {
  await pg().query("UPDATE da_master SET is_active=false WHERE id=$1", [Number(req.params.id)]);
  res.json({ ok: true });
});

/* ── Current DA rate (latest active record) ── */
router.get("/da-master/current", requireAdmin, async (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const r = await pg().query(
    `SELECT * FROM da_master WHERE is_active=true
       AND (da_from IS NULL OR da_from <= $1)
       AND (da_upto IS NULL OR da_upto >= $1)
     ORDER BY id DESC LIMIT 1`,
    [today]
  );
  if (r.rows.length === 0) {
    /* fallback: latest active record regardless of date */
    const fallback = await pg().query(
      "SELECT * FROM da_master WHERE is_active=true ORDER BY id DESC LIMIT 1"
    );
    return res.json(fallback.rows[0] ?? { da_percent: 55 });
  }
  res.json(r.rows[0]);
});

export default router;
