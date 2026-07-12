import { Router } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const pg = () => (db as any).$client;

/* ── GET all LIC entries ── */
router.get("/lic-entries", requireAdmin, async (_req, res) => {
  const r = await pg().query(`
    SELECT l.*, e.emp_code, e.name AS emp_name
    FROM lic_entries l
    LEFT JOIN employees e ON e.id = l.employee_id
    WHERE l.is_active = true
    ORDER BY l.id DESC
  `);
  res.json(r.rows);
});

/* ── GET single ── */
router.get("/lic-entries/:id", requireAdmin, async (req, res) => {
  const r = await pg().query("SELECT * FROM lic_entries WHERE id=$1", [Number(req.params.id)]);
  if (!r.rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(r.rows[0]);
});

/* ── POST create ── */
router.post("/lic-entries", requireAdmin, async (req, res) => {
  const { employee_id, emp_code, emp_name, policy_no, premium_amount, entry_date, remarks } = req.body;
  if (!employee_id || !policy_no || !emp_name) {
    return res.status(400).json({ error: "employee_id, emp_name, policy_no required" });
  }
  const r = await pg().query(
    `INSERT INTO lic_entries (employee_id, emp_code, emp_name, policy_no, premium_amount, entry_date, remarks)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [Number(employee_id), emp_code || null, emp_name, policy_no.trim(), Number(premium_amount) || 0,
     entry_date || null, remarks || null]
  );
  res.status(201).json(r.rows[0]);
});

/* ── PUT update ── */
router.put("/lic-entries/:id", requireAdmin, async (req, res) => {
  const { policy_no, premium_amount, entry_date, remarks } = req.body;
  const r = await pg().query(
    `UPDATE lic_entries
     SET policy_no=$1, premium_amount=$2, entry_date=$3, remarks=$4, updated_at=NOW()
     WHERE id=$5 RETURNING *`,
    [policy_no.trim(), Number(premium_amount) || 0, entry_date || null, remarks || null, Number(req.params.id)]
  );
  res.json(r.rows[0]);
});

/* ── DELETE (soft) ── */
router.delete("/lic-entries/:id", requireAdmin, async (req, res) => {
  await pg().query("UPDATE lic_entries SET is_active=false, updated_at=NOW() WHERE id=$1", [Number(req.params.id)]);
  res.json({ ok: true });
});

/* ── Report: employee-wise summary ── */
router.get("/lic-report", requireAdmin, async (_req, res) => {
  const r = await pg().query(`
    SELECT
      l.employee_id,
      l.emp_code,
      l.emp_name,
      COUNT(*) AS policy_count,
      SUM(l.premium_amount) AS total_premium,
      json_agg(json_build_object(
        'id', l.id,
        'policy_no', l.policy_no,
        'premium_amount', l.premium_amount,
        'entry_date', l.entry_date,
        'remarks', l.remarks
      ) ORDER BY l.id) AS policies
    FROM lic_entries l
    INNER JOIN employees e ON e.id = l.employee_id
    WHERE l.is_active = true
      AND (e.is_retired   IS NULL OR e.is_retired   = false)
      AND (e.is_disabled  IS NULL OR e.is_disabled  = false)
      AND (e.is_transferred IS NULL OR e.is_transferred = false)
    GROUP BY l.employee_id, l.emp_code, l.emp_name
    ORDER BY l.emp_name
  `);
  res.json(r.rows);
});

export default router;
