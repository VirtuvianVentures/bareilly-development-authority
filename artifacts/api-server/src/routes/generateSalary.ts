import { Router } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const pg = () => (db as any).$client;

/* ── Helper: fetch current DA% from da_master ── */
async function getCurrentDaRate(): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const r = await pg().query(
    `SELECT da_percent FROM da_master
     WHERE is_active = true
       AND (da_from IS NULL OR da_from <= $1)
       AND (da_upto IS NULL OR da_upto >= $1)
     ORDER BY id DESC LIMIT 1`,
    [today]
  );
  if (r.rows[0]) return Number(r.rows[0].da_percent) / 100;
  const r2 = await pg().query(
    `SELECT da_percent FROM da_master WHERE is_active=true ORDER BY id DESC LIMIT 1`
  );
  return r2.rows[0] ? Number(r2.rows[0].da_percent) / 100 : 0.55;
}

/* ── Helper: compute salary for one employee with days proration ──
   - Basic Pay and DA are prorated by worked_days / month_days
   - Allowances and Deductions come 100% from Master (not prorated)
*/
async function computeForEmp(
  e: { id: number; basic_pay: any; emp_code: string; name: string },
  daRate: number,
  workedDays: number,
  monthDays: number
) {
  const masterBasic = Number(e.basic_pay) || 0;
  const masterDa    = Math.round(masterBasic * daRate);

  /* Prorate only basic + DA */
  const payableBasic = Math.round(masterBasic * workedDays / monthDays);
  const payableDa    = Math.round(masterDa    * workedDays / monthDays);

  /* Fetch from Allowance Master + Deduction Master */
  const [eaRes, edRes] = await Promise.all([
    pg().query(
      `SELECT ea.amount, ah.name
       FROM employee_allowances ea
       JOIN allowance_heads ah ON ah.id = ea.allowance_head_id
       WHERE ea.employee_id=$1 AND ea.is_applicable=true ORDER BY ah.id`,
      [e.id]
    ),
    pg().query(
      `SELECT ed.amount, dh.name
       FROM employee_deductions ed
       JOIN deduction_heads dh ON dh.id = ed.deduction_head_id
       WHERE ed.employee_id=$1 AND ed.is_applicable=true ORDER BY dh.id`,
      [e.id]
    ),
  ]);

  const allowances: { name: string; amount: number }[] =
    eaRes.rows.map((r: any) => ({ name: r.name, amount: Number(r.amount) }));
  const deductions: { name: string; amount: number }[] =
    edRes.rows.map((r: any) => ({ name: r.name, amount: Number(r.amount) }));

  const totalAllowances = allowances.reduce((s, a) => s + a.amount, 0);
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const grossPay        = payableBasic + payableDa + totalAllowances;
  const netPay          = grossPay - totalDeductions;
  const empNps          = Math.round((payableBasic + payableDa) * 0.14);

  return { payableBasic, payableDa, totalAllowances, allowances, deductions, totalDeductions, grossPay, netPay, empNps };
}

/* ── Helper: attach allowances/deductions to records (use JSONB snapshot when available) ── */
async function attachEmpHeads(records: any[]): Promise<any[]> {
  if (records.length === 0) return records;
  const empIds = records.map((r: any) => r.employee_id).filter(Boolean);
  if (empIds.length === 0) return records;

  /* Fetch live Master data as fallback when JSONB snapshot is empty */
  const [eaRes, edRes] = await Promise.all([
    pg().query(
      `SELECT ea.employee_id, ea.amount, ah.name
       FROM employee_allowances ea
       JOIN allowance_heads ah ON ah.id = ea.allowance_head_id
       WHERE ea.employee_id = ANY($1) AND ea.is_applicable=true
       ORDER BY ea.employee_id, ah.id`,
      [empIds]
    ),
    pg().query(
      `SELECT ed.employee_id, ed.amount, dh.name
       FROM employee_deductions ed
       JOIN deduction_heads dh ON dh.id = ed.deduction_head_id
       WHERE ed.employee_id = ANY($1) AND ed.is_applicable=true
       ORDER BY ed.employee_id, dh.id`,
      [empIds]
    ),
  ]);

  const allowMap: Record<number, { name: string; amount: number }[]> = {};
  const deductMap: Record<number, { name: string; amount: number }[]> = {};
  for (const a of eaRes.rows) {
    if (!allowMap[a.employee_id]) allowMap[a.employee_id] = [];
    allowMap[a.employee_id].push({ name: a.name, amount: Number(a.amount) });
  }
  for (const d of edRes.rows) {
    if (!deductMap[d.employee_id]) deductMap[d.employee_id] = [];
    deductMap[d.employee_id].push({ name: d.name, amount: Number(d.amount) });
  }

  return records.map((r: any) => {
    /* Prefer JSONB snapshot (historical accuracy); fall back to live Master */
    const snap = (arr: any) => Array.isArray(arr) && arr.length > 0;
    const allowances = snap(r.allowances_data) ? r.allowances_data : (allowMap[r.employee_id] || []);
    const deductions = snap(r.deductions_data) ? r.deductions_data : (deductMap[r.employee_id] || []);
    return { ...r, allowances, deductions };
  });
}

/* ══════════════════════════════════════════════════════════════
   GET /salary-sheets?month&year[&group][&dept][&type]
   ══════════════════════════════════════════════════════════════ */
router.get("/salary-sheets", requireAdmin, async (req, res) => {
  const month = Number(req.query.month);
  const year  = Number(req.query.year);
  const type  = (req.query.type  as string) || "";
  const dept  = (req.query.dept  as string) || "";
  const group = (req.query.group as string) || "";

  const SEL = `SELECT pr.*,
    e.name          AS e_name,
    e.emp_code      AS e_code,
    e.basic_pay     AS e_basic_pay,
    e.designation   AS emp_designation,
    e.employee_type, e.department, e.paybill_group`;

  let r;
  if (group) {
    r = await pg().query(
      `${SEL} FROM payroll_records pr
       JOIN employees e ON e.id = pr.employee_id
       WHERE pr.month=$1 AND pr.year=$2 AND LOWER(e.paybill_group)=LOWER($3)
         AND pr.is_active=true AND e.is_active=true
       ORDER BY e.emp_code`,
      [month, year, group]
    );
  } else if (dept && dept.toUpperCase() !== "ALL") {
    r = await pg().query(
      `${SEL} FROM payroll_records pr
       JOIN employees e ON e.id = pr.employee_id
       WHERE pr.month=$1 AND pr.year=$2 AND LOWER(e.department)=LOWER($3)
         AND pr.is_active=true AND e.is_active=true
       ORDER BY e.emp_code`,
      [month, year, dept]
    );
  } else if (dept.toUpperCase() === "ALL") {
    r = await pg().query(
      `${SEL} FROM payroll_records pr
       JOIN employees e ON e.id = pr.employee_id
       WHERE pr.month=$1 AND pr.year=$2
         AND pr.is_active=true AND e.is_active=true
       ORDER BY e.department, e.emp_code`,
      [month, year]
    );
  } else {
    r = await pg().query(
      `${SEL} FROM payroll_records pr
       JOIN employees e ON e.id = pr.employee_id
       WHERE pr.month=$1 AND pr.year=$2 AND e.employee_type=$3
         AND pr.is_active=true AND e.is_active=true
       ORDER BY e.emp_code`,
      [month, year, type || "officer"]
    );
  }
  res.json(await attachEmpHeads(r.rows));
});

/* ══════════════════════════════════════════════════════════════
   GET /salary-sheets/pending
   ══════════════════════════════════════════════════════════════ */
router.get("/salary-sheets/pending", requireAdmin, async (req, res) => {
  const month = Number(req.query.month);
  const year  = Number(req.query.year);
  const type  = (req.query.type  as string) || "";
  const group = (req.query.group as string) || "";
  const dept  = (req.query.dept  as string) || "";

  const NOT_EXISTS = `AND NOT EXISTS (
    SELECT 1 FROM payroll_records pr
    WHERE pr.employee_id=e.id AND pr.month=$2 AND pr.year=$3 AND pr.is_active=true
  )`;

  let empQuery: string;
  let empParams: any[];

  if (group) {
    empQuery = `
      SELECT e.id, e.emp_code, e.name, e.designation, e.basic_pay, e.department, e.paybill_group
      FROM employees e
      WHERE e.is_active=true AND LOWER(e.paybill_group)=LOWER($1)
        ${NOT_EXISTS}
      ORDER BY e.emp_code`;
    empParams = [group, month, year];
  } else if (dept && dept.toUpperCase() !== "ALL") {
    empQuery = `
      SELECT e.id, e.emp_code, e.name, e.designation, e.basic_pay, e.department, e.paybill_group
      FROM employees e
      WHERE e.is_active=true AND LOWER(e.department)=LOWER($1)
        ${NOT_EXISTS}
      ORDER BY e.emp_code`;
    empParams = [dept, month, year];
  } else if (dept.toUpperCase() === "ALL") {
    empQuery = `
      SELECT e.id, e.emp_code, e.name, e.designation, e.basic_pay, e.department, e.paybill_group
      FROM employees e
      WHERE e.is_active=true
        ${NOT_EXISTS}
      ORDER BY e.department, e.emp_code`;
    empParams = ["ALL", month, year];
  } else {
    empQuery = `
      SELECT e.id, e.emp_code, e.name, e.designation, e.basic_pay, e.department, e.paybill_group
      FROM employees e
      WHERE e.is_active=true AND e.employee_type=$1
        ${NOT_EXISTS}
      ORDER BY e.emp_code`;
    empParams = [type || "officer", month, year];
  }

  const r = await pg().query(empQuery, empParams);
  res.json(r.rows);
});

/* ══════════════════════════════════════════════════════════════
   POST /salary-sheets/generate
   Body: { month, year, type?, group?, dept?, employeeIds?, employeeDays?, monthDays? }
   employeeDays: { [empId]: workedDays }
   ══════════════════════════════════════════════════════════════ */
router.post("/salary-sheets/generate", requireAdmin, async (req, res) => {
  const {
    month, year,
    type  = "officer",
    dept  = "",
    group = "",
    employeeIds,
    employeeDays = {} as Record<string, number>,
    monthDays: reqMonthDays,
  } = req.body as {
    month: number; year: number;
    type?: string; dept?: string; group?: string;
    employeeIds?: number[];
    employeeDays?: Record<string, number>;
    monthDays?: number;
  };

  /* Calendar days of the target month (e.g. July = 31) */
  const monthDays = reqMonthDays ?? new Date(year, month, 0).getDate();
  const daRate    = await getCurrentDaRate();

  /* Load employees */
  let empRes;
  if (group) {
    empRes = await pg().query(
      `SELECT * FROM employees WHERE is_active=true AND LOWER(paybill_group)=LOWER($1) ORDER BY emp_code`,
      [group]
    );
  } else if (dept && dept.toUpperCase() !== "ALL") {
    empRes = await pg().query(
      `SELECT * FROM employees WHERE is_active=true AND LOWER(department)=LOWER($1) ORDER BY emp_code`,
      [dept]
    );
  } else if (dept.toUpperCase() === "ALL") {
    empRes = await pg().query(`SELECT * FROM employees WHERE is_active=true ORDER BY department, emp_code`);
  } else {
    empRes = await pg().query(
      `SELECT * FROM employees WHERE is_active=true AND employee_type=$1 ORDER BY emp_code`,
      [type]
    );
  }

  const emps = employeeIds?.length
    ? empRes.rows.filter((e: any) => employeeIds.includes(e.id))
    : empRes.rows;

  const FRESH_SEL = `SELECT pr.*,
    emp.name       AS e_name,
    emp.emp_code   AS e_code,
    emp.basic_pay  AS e_basic_pay,
    emp.designation AS emp_designation,
    emp.department, emp.paybill_group`;

  const created: any[] = [];

  for (const e of emps) {
    const workedDays = Number(employeeDays[String(e.id)] ?? employeeDays[e.id] ?? monthDays);

    /* Check if record already exists */
    const ex = await pg().query(
      `${FRESH_SEL} FROM payroll_records pr
       JOIN employees emp ON emp.id = pr.employee_id
       WHERE pr.employee_id=$1 AND pr.month=$2 AND pr.year=$3 AND pr.is_active=true`,
      [e.id, month, year]
    );

    /* Processed records are locked */
    if (ex.rows.length > 0 && ex.rows[0].status === "processed") {
      created.push(ex.rows[0]);
      continue;
    }

    const v = await computeForEmp(e, daRate, workedDays, monthDays);

    if (ex.rows.length > 0) {
      /* UPDATE existing draft */
      const upd = await pg().query(
        `UPDATE payroll_records SET
           emp_name=$1, basic_pay=$2, da=$3, worked_days=$4, month_days=$5,
           total_allowances=$6, allowances_data=$7, deductions_data=$8,
           gross_pay=$9, total_deductions=$10, net_pay=$11, employer_nps=$12,
           updated_at=NOW()
         WHERE id=$13 RETURNING *`,
        [
          e.name, v.payableBasic, v.payableDa, workedDays, monthDays,
          v.totalAllowances, JSON.stringify(v.allowances), JSON.stringify(v.deductions),
          v.grossPay, v.totalDeductions, v.netPay, v.empNps,
          ex.rows[0].id,
        ]
      );
      const rec = upd.rows[0];
      rec.e_name          = e.name;
      rec.e_code          = e.emp_code;
      rec.e_basic_pay     = e.basic_pay;
      rec.emp_designation = e.designation;
      rec.department      = e.department;
      rec.paybill_group   = e.paybill_group;
      created.push(rec);
    } else {
      /* INSERT new record */
      const ins = await pg().query(
        `INSERT INTO payroll_records
           (employee_id, emp_code, emp_name, month, year,
            basic_pay, da, worked_days, month_days,
            total_allowances, allowances_data, deductions_data,
            gross_pay, total_deductions, net_pay, employer_nps, status)
         VALUES ($1,$2,$3,$4,$5, $6,$7,$8,$9, $10,$11,$12, $13,$14,$15,$16,$17)
         RETURNING *`,
        [
          e.id, e.emp_code, e.name, month, year,
          v.payableBasic, v.payableDa, workedDays, monthDays,
          v.totalAllowances, JSON.stringify(v.allowances), JSON.stringify(v.deductions),
          v.grossPay, v.totalDeductions, v.netPay, v.empNps, "draft",
        ]
      );
      const rec = ins.rows[0];
      rec.e_name          = e.name;
      rec.e_code          = e.emp_code;
      rec.e_basic_pay     = e.basic_pay;
      rec.emp_designation = e.designation;
      rec.department      = e.department;
      rec.paybill_group   = e.paybill_group;
      created.push(rec);
    }
  }

  const withHeads = await attachEmpHeads(created);
  res.status(201).json({ generated: withHeads.length, records: withHeads, da_percent: Math.round(daRate * 100) });
});

/* ══════════════════════════════════════════════════════════════
   GET /salary-sheets/all — for Salary Generated Master
   ══════════════════════════════════════════════════════════════ */
router.get("/salary-sheets/all", requireAdmin, async (req, res) => {
  const month = req.query.month ? Number(req.query.month) : null;
  const year  = req.query.year  ? Number(req.query.year)  : null;
  const dept  = (req.query.dept  as string) || "";
  const group = (req.query.group as string) || "";

  let where = `pr.is_active=true`;
  const params: any[] = [];
  let idx = 1;

  if (month) { where += ` AND pr.month=$${idx++}`; params.push(month); }
  if (year)  { where += ` AND pr.year=$${idx++}`;  params.push(year);  }
  if (group) { where += ` AND LOWER(e.paybill_group)=LOWER($${idx++})`; params.push(group); }
  else if (dept && dept.toUpperCase() !== "ALL") {
    where += ` AND LOWER(e.department)=LOWER($${idx++})`; params.push(dept);
  }

  const r = await pg().query(
    `SELECT pr.id, pr.employee_id, pr.emp_code, pr.emp_name,
            pr.month, pr.year, pr.basic_pay, pr.da, pr.worked_days, pr.month_days,
            pr.total_allowances, pr.gross_pay,
            pr.total_deductions, pr.net_pay, pr.status, pr.created_at,
            pr.allowances_data, pr.deductions_data,
            e.name AS e_name, e.emp_code AS e_code,
            e.designation AS emp_designation, e.department, e.paybill_group
     FROM payroll_records pr
     JOIN employees e ON e.id = pr.employee_id
     WHERE ${where}
     ORDER BY pr.year DESC, pr.month DESC, e.department, e.emp_code`,
    params
  );
  res.json(await attachEmpHeads(r.rows));
});

/* ══════════════════════════════════════════════════════════════
   PUT /salary-sheets/bulk — mark processed, recalc with stored days
   Body: [{ id, workedDays? }]
   ══════════════════════════════════════════════════════════════ */
router.put("/salary-sheets/bulk", requireAdmin, async (req, res) => {
  const rows: { id: number; workedDays?: number }[] = req.body;
  const daRate = await getCurrentDaRate();
  const updated: any[] = [];

  for (const b of rows) {
    /* Fetch existing record + employee master basic */
    const recRes = await pg().query(
      `SELECT pr.*, e.basic_pay AS master_basic_pay, e.id AS emp_id, e.emp_code AS e_emp_code, e.name AS e_emp_name
       FROM payroll_records pr
       JOIN employees e ON e.id = pr.employee_id
       WHERE pr.id=$1 AND pr.is_active=true`,
      [b.id]
    );
    if (!recRes.rows[0]) continue;
    const rec        = recRes.rows[0];
    const workedDays = b.workedDays ?? Number(rec.worked_days) ?? Number(rec.month_days) ?? 30;
    const monthDays  = Number(rec.month_days) || 30;

    const v = await computeForEmp(
      { id: rec.emp_id, basic_pay: rec.master_basic_pay, emp_code: rec.e_emp_code, name: rec.e_emp_name },
      daRate, workedDays, monthDays
    );

    const r = await pg().query(
      `UPDATE payroll_records SET
         basic_pay=$1, da=$2, worked_days=$3,
         total_allowances=$4, allowances_data=$5, deductions_data=$6,
         gross_pay=$7, total_deductions=$8, net_pay=$9,
         employer_nps=$10, status='processed', updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [
        v.payableBasic, v.payableDa, workedDays,
        v.totalAllowances, JSON.stringify(v.allowances), JSON.stringify(v.deductions),
        v.grossPay, v.totalDeductions, v.netPay, v.empNps, b.id,
      ]
    );
    if (r.rows[0]) updated.push(r.rows[0]);
  }

  res.json({ saved: updated.length, records: updated, da_percent: Math.round(daRate * 100) });
});

/* ══════════════════════════════════════════════════════════════
   GET /salary-sheets/deleted
   ══════════════════════════════════════════════════════════════ */
router.get("/salary-sheets/deleted", requireAdmin, async (req, res) => {
  const month = req.query.month ? Number(req.query.month) : null;
  const year  = req.query.year  ? Number(req.query.year)  : null;
  const dept  = (req.query.dept  as string) || "";
  const group = (req.query.group as string) || "";

  let where = `pr.is_active=false`;
  const params: any[] = [];
  let idx = 1;

  if (month) { where += ` AND pr.month=$${idx++}`; params.push(month); }
  if (year)  { where += ` AND pr.year=$${idx++}`;  params.push(year);  }
  if (group) { where += ` AND LOWER(e.paybill_group)=LOWER($${idx++})`; params.push(group); }
  else if (dept && dept.toUpperCase() !== "ALL") {
    where += ` AND LOWER(e.department)=LOWER($${idx++})`; params.push(dept);
  }

  const r = await pg().query(
    `SELECT pr.id, pr.employee_id, pr.emp_code, pr.emp_name,
            pr.month, pr.year, pr.basic_pay, pr.da, pr.gross_pay,
            pr.total_deductions, pr.net_pay, pr.status, pr.created_at,
            pr.updated_at AS deleted_at,
            e.name AS e_name, e.emp_code AS e_code,
            e.designation AS emp_designation, e.department, e.paybill_group
     FROM payroll_records pr
     JOIN employees e ON e.id = pr.employee_id
     WHERE ${where}
     ORDER BY pr.updated_at DESC, pr.year DESC, pr.month DESC, e.emp_code`,
    params
  );
  res.json(r.rows);
});

/* ══════════════════════════════════════════════════════════════
   GET /salary-sheets/:id — full record for salary slip
   ══════════════════════════════════════════════════════════════ */
router.get("/salary-sheets/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const r = await pg().query(
    `SELECT pr.*,
            e.name AS e_name, e.emp_code AS e_code,
            e.designation AS emp_designation, e.department,
            e.paybill_group, e.emp_group, e.pay_level, e.grade,
            e.contribution_type, e.gpf_no, e.pan_no, e.pran,
            e.dob, e.bank_name, e.bank_account, e.ifsc,
            e.is_pensionable, e.is_nps_deduction, e.father_name
     FROM payroll_records pr
     JOIN employees e ON e.id = pr.employee_id
     WHERE pr.id = $1 AND pr.is_active = true`,
    [id]
  );
  if (!r.rows[0]) { res.status(404).json({ error: "Record not found" }); return; }
  const [rec] = await attachEmpHeads([r.rows[0]]);
  res.json(rec);
});

/* ══════════════════════════════════════════════════════════════
   PUT /salary-sheets/:id — update single record
   ══════════════════════════════════════════════════════════════ */
router.put("/salary-sheets/:id", requireAdmin, async (req, res) => {
  const id     = Number(req.params.id);
  const b      = req.body;
  const daRate = await getCurrentDaRate();

  const recRes = await pg().query(
    `SELECT pr.*, e.basic_pay AS master_basic_pay, e.id AS emp_id, e.emp_code AS e_emp_code, e.name AS e_emp_name
     FROM payroll_records pr
     JOIN employees e ON e.id = pr.employee_id
     WHERE pr.id=$1 AND pr.is_active=true`,
    [id]
  );
  if (!recRes.rows[0]) { res.status(404).json({ error: "Not found" }); return; }

  const rec        = recRes.rows[0];
  const workedDays = b.workedDays ?? Number(rec.worked_days) ?? Number(rec.month_days) ?? 30;
  const monthDays  = Number(rec.month_days) || 30;

  const v = await computeForEmp(
    { id: rec.emp_id, basic_pay: rec.master_basic_pay, emp_code: rec.e_emp_code, name: rec.e_emp_name },
    daRate, workedDays, monthDays
  );

  const r = await pg().query(
    `UPDATE payroll_records SET
       basic_pay=$1, da=$2, worked_days=$3,
       total_allowances=$4, allowances_data=$5, deductions_data=$6,
       gross_pay=$7, total_deductions=$8, net_pay=$9,
       employer_nps=$10, status=$11, updated_at=NOW()
     WHERE id=$12 RETURNING *`,
    [
      v.payableBasic, v.payableDa, workedDays,
      v.totalAllowances, JSON.stringify(v.allowances), JSON.stringify(v.deductions),
      v.grossPay, v.totalDeductions, v.netPay, v.empNps,
      b.status || rec.status || "draft", id,
    ]
  );
  res.json(r.rows[0]);
});

/* ══════════════════════════════════════════════════════════════
   DELETE /salary-sheets/:id — soft delete
   ══════════════════════════════════════════════════════════════ */
router.delete("/salary-sheets/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await pg().query(
    `UPDATE payroll_records SET is_active=false, updated_at=NOW() WHERE id=$1`,
    [id]
  );
  res.json({ success: true, id });
});

export default router;
