import { Router } from "express";
import { db } from "@workspace/db";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const pg = () => (db as any).$client;

const ALLOWED: Record<string, string> = {
  "paybill-groups":  "payroll_paybill_groups",
  "house-types":     "payroll_house_types",
  "branches":        "payroll_branches",
  "groups":          "payroll_groups",
  "designations":    "payroll_designations",
  "qualifications":  "payroll_qualifications",
  "banks":           "payroll_banks",
};

const SEEDS: Record<string, string[]> = {
  "payroll_branches": [
    "Account", "Administration", "Building Control", "Computer Section",
    "Engineering", "Establishment", "Horticulture", "Land Acquistion",
    "Legal", "Map Section", "Nazarat", "Officers IAS/PCS",
    "Planning", "Property", "Public Relation",
  ],
  "payroll_groups": ["A", "A+", "B", "C", "D", "DW - B", "DW - C", "DW - D", "E", "F"],
  "payroll_designations": [
    "Account Clerk", "Accountant", "Asst. Accountant", "Asst. Programmer",
    "Asst. Account Officer", "C.E.", "C.T.P.", "Chowkidar", "Clerk",
    "Con. Operator", "Draftman", "Driver", "Electrician", "Ex. Engg.",
    "FC", "Gen. Operator", "Head Clerk", "H.I.", "J.E.", "Lekhpal",
    "Mali", "OSD", "Peon", "Plumber", "R.I.", "Secretary", "Servey Admin",
    "Steno", "Surveyor", "Sweeper", "Tehsildar", "TubeWell Oper.", "Typist",
    "VC", "A.E.", "Mate", "Beldar", "Carpainter", "Helper", "Store Keeper",
    "Store Clerk", "Tractor Driver", "Tractor Helper", "Telephone Operator",
    "H.S.", "GANGMAN", "MATE / TUBE WELL OPR", "Store Munshi", "S.D.M",
    "F.A.O", "Joint Secretary", "Office Superintendent", "A.A.O", "S.E.",
    "T.P", "A.T.P", "A.O.", "AHO", "Addl Secretary", "P.A.",
    "Deputy Collector", "W/MAN", "BLUE PRI", "JR CLERK", "C.F.A.O.",
    "SUPERVISOR", "C.PROGRAMMER", "D/MAN", "K.BUNKAR", "FERO BOY",
    "DAFTARI", "U.S",
  ],
  "payroll_qualifications": [
    "5th", "8th", "Matric Pass", "B.A.", "B.Arch", "B.E. (CIVIL)", "B.ED.",
    "B.Sc Planning", "B.SC.", "B.SC. Ag.", "B.SC. Engg Civil",
    "B.TECH. IN CIVIL", "B.TECH. IN ELECTRICAL", "B.TECH. IN MACHNICAL",
    "DIPLOMA", "DIPLOMA IN CIVIL", "DIPLOMA IN ELECTRICAL", "DIPLOMA IN MACHENICAL",
    "GRADUATION", "HIGH SCHOOL", "IIT", "INTERMEDIATE", "JUNIOR HIGH SCHOOL",
    "LLB", "LLM", "M.A.", "M.Arch", "M.Sc Planing", "M.SC.", "MATRICULATION",
    "MBA", "NA", "POST GRADUATE DIPLOMA IN COMPUTER", "POST GRADUATION",
    "PRIMARY EDUCATION", "SAKSHAR",
  ],
  "payroll_banks": [
    "Allahbad Bank", "Axis Bank", "Bank of Baroda", "CANARA BANK",
    "HDFC Bank", "ICICI Bank", "INDIAN BANK", "Punjab National Bank",
    "State Bank of India", "Syndicate Bank", "UCO Bank", "Vijaya Bank",
  ],
};

function tbl(type: string) { return ALLOWED[type] ?? null; }

/* ─── GET /payroll-masters/:type ─── */
router.get("/payroll-masters/:type", requireAdmin, async (req, res) => {
  const table = tbl(req.params.type);
  if (!table) return res.status(404).json({ error: "Unknown master type" });

  let rows = (await pg().query(`SELECT * FROM ${table} ORDER BY id`)).rows;

  /* Seed default data the first time the table is empty */
  if (rows.length === 0 && SEEDS[table]) {
    const names = SEEDS[table];
    await pg().query(
      `INSERT INTO ${table} (name, status) VALUES ${names.map((_: string, i: number) => `($${i * 2 + 1},$${i * 2 + 2})`).join(",")}`,
      names.flatMap((n: string) => [n, "active"])
    );
    rows = (await pg().query(`SELECT * FROM ${table} ORDER BY id`)).rows;
  }

  res.json(rows);
});

/* ─── POST /payroll-masters/:type ─── */
router.post("/payroll-masters/:type", requireAdmin, async (req, res) => {
  const table = tbl(req.params.type);
  if (!table) return res.status(404).json({ error: "Unknown master type" });
  const { name, status = "active" } = req.body as { name: string; status?: string };
  if (!name?.trim()) return res.status(400).json({ error: "Name is required" });
  const r = await pg().query(
    `INSERT INTO ${table} (name, status) VALUES ($1, $2) RETURNING *`,
    [name.trim(), status]
  );
  res.status(201).json(r.rows[0]);
});

/* ─── PUT /payroll-masters/:type/:id ─── */
router.put("/payroll-masters/:type/:id", requireAdmin, async (req, res) => {
  const table = tbl(req.params.type);
  if (!table) return res.status(404).json({ error: "Unknown master type" });
  const { name, status } = req.body as { name?: string; status?: string };
  const sets: string[] = [];
  const vals: any[] = [];
  if (name !== undefined) { vals.push(name.trim()); sets.push(`name=$${vals.length}`); }
  if (status !== undefined) { vals.push(status); sets.push(`status=$${vals.length}`); }
  sets.push(`updated_at=NOW()`);
  vals.push(Number(req.params.id));
  const r = await pg().query(
    `UPDATE ${table} SET ${sets.join(",")} WHERE id=$${vals.length} RETURNING *`,
    vals
  );
  if (!r.rows[0]) return res.status(404).json({ error: "Not found" });
  res.json(r.rows[0]);
});

/* ─── DELETE /payroll-masters/:type/:id ─── */
router.delete("/payroll-masters/:type/:id", requireAdmin, async (req, res) => {
  const table = tbl(req.params.type);
  if (!table) return res.status(404).json({ error: "Unknown master type" });
  await pg().query(`DELETE FROM ${table} WHERE id=$1`, [Number(req.params.id)]);
  res.json({ ok: true });
});

export default router;
