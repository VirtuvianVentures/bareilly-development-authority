import { useState, useCallback, useEffect, useRef } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Download, RefreshCw, Save, Loader2, ChevronDown,
  ChevronUp, Calculator, Printer, Building2, Layers, Users, CheckSquare, Square, XSquare,
} from "lucide-react";
import * as XLSX from "xlsx";

/* ── constants ── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const ALL_DEPT_VAL  = "ALL";
const n = (v: any) => Number(v) || 0;

/* ── SalaryRow ── */
interface EmpHead { name: string; amount: number; }

interface SalaryRow {
  id: number;
  emp_code:             string;
  emp_name:             string;
  emp_designation:      string;
  emp_department:       string;
  basic_pay:            string;
  /* stored column totals (used for save/bulk) */
  cca:                  string;
  special_pay:          string;
  personal_pay:         string;
  hra:                  string;
  dept_allowance:       string;
  gpf:                  string;
  nps:                  string;
  gpf_advance_recovery: string;
  group_insurance:      string;
  hba:                  string;
  income_tax:           string;
  gvr:                  string;
  hrent:                string;
  recovery_pay_slip:    string;
  other_deductions:     string;
  /* Employee Master dynamic heads for display */
  emp_allowances: EmpHead[];
  emp_deductions: EmpHead[];
  /* computed */
  da:               number;
  total_allowances: number;
  gross_pay:        number;
  total_deductions: number;
  net_pay:          number;
  employer_nps:     number;
  status:           string;
}

/* DA on basic_pay only */
function calc(r: SalaryRow, daRate = 0): SalaryRow {
  const basic      = n(r.basic_pay);
  const da         = Math.round(basic * daRate);
  const empAllows  = r.emp_allowances ?? [];
  const empDeds    = r.emp_deductions  ?? [];

  /* Use emp_allowances from Employee Master if available, else fall back to stored columns */
  const totalAllowances = empAllows.length > 0
    ? empAllows.reduce((s, a) => s + n(a.amount), 0)
    : n(r.cca) + n(r.special_pay) + n(r.personal_pay) + n(r.hra) + n(r.dept_allowance);

  /* Use emp_deductions from Employee Master if available, else fall back to stored columns */
  const totalDed = empDeds.length > 0
    ? empDeds.reduce((s, d) => s + n(d.amount), 0)
    : (n(r.gpf) > 0 ? n(r.gpf) : n(r.nps))
      + n(r.gpf_advance_recovery) + n(r.group_insurance) + n(r.hba)
      + n(r.income_tax) + n(r.gvr) + n(r.hrent) + n(r.recovery_pay_slip) + n(r.other_deductions);

  const grossPay = basic + da + totalAllowances;
  return {
    ...r,
    emp_allowances:  empAllows,
    emp_deductions:  empDeds,
    da,
    total_allowances: totalAllowances,
    gross_pay:        grossPay,
    total_deductions: totalDed,
    net_pay:          grossPay - totalDed,
    employer_nps:     Math.round((basic + da) * 0.14),
  };
}

function EC({ val, onChange, cls = "" }: { val: string; onChange: (v: string) => void; cls?: string }) {
  return (
    <input
      type="number"
      value={val}
      onChange={e => onChange(e.target.value)}
      className={`w-24 h-7 text-xs text-right px-1 rounded border border-transparent
        focus:border-blue-400 focus:outline-none focus:bg-white bg-transparent
        hover:bg-white hover:border-gray-300 transition-colors ${cls}`}
    />
  );
}

interface PendingEmp {
  id: number;
  emp_code: string;
  name: string;
  designation: string;
  basic_pay: string;
  department: string;
  paybill_group: string;
}

type ExpandKey = { id: number; section: "allowances" | "deductions" };
type FilterMode = "dept" | "group";

/* ════════════════════════════ MAIN COMPONENT ════════════════════════════ */
export default function DepartmentalPayBill() {
  const now = new Date();
  const [month,        setMonth]        = useState(now.getMonth() + 1);
  const [year,         setYear]         = useState(now.getFullYear());
  const [departments,  setDepartments]  = useState<string[]>([]);
  const [paybillGroups,setPaybillGroups]= useState<string[]>([]);
  const [filterMode,   setFilterMode]   = useState<FilterMode>("dept");
  const [dept,         setDept]         = useState(ALL_DEPT_VAL);
  const [group,        setGroup]        = useState("");
  const [rows,            setRows]            = useState<SalaryRow[]>([]);
  const [loading,         setLoading]         = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [daRate,          setDaRate]          = useState(0);
  const [daLabel,         setDaLabel]         = useState<string | null>(null);
  const [expanded,        setExpanded]        = useState<ExpandKey | null>(null);
  /* ── Pending employee selection ── */
  const [pendingEmps,     setPendingEmps]     = useState<PendingEmp[]>([]);
  const [pendingSelected, setPendingSelected] = useState<Set<number>>(new Set());
  const [pendingLoading,  setPendingLoading]  = useState(false);
  const [pendingLoaded,   setPendingLoaded]   = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  /* Load departments, groups & DA rate on mount from API */
  useEffect(() => {
    Promise.all([
      apiFetch("/payroll-masters/branches").then(r => r.json()),
      apiFetch("/payroll-masters/paybill-groups").then(r => r.json()),
    ]).then(([branches, groups]: [{ name: string; status: string }[], { name: string; status: string }[]]) => {
      const depts      = branches.filter(b => b.status === "active").map(b => b.name);
      const groupNames = groups.filter(g => g.status === "active").map(g => g.name);
      setDepartments(depts);
      setPaybillGroups(groupNames);
      if (groupNames.length > 0) setGroup(groupNames[0]);
    }).catch(() => {});

    apiFetch("/da-master/current")
      .then(r => r.json())
      .then(data => {
        const pct = Number(data?.da_percent);
        if (pct > 0) { setDaRate(pct / 100); setDaLabel(String(pct)); }
        else setDaLabel("—");
      })
      .catch(() => setDaLabel("—"));
  }, []);

  /* Build filter label for UI */
  const filterLabel = filterMode === "group"
    ? (group || "—")
    : (dept === ALL_DEPT_VAL ? "All Departments" : dept);

  const fromApi = useCallback((r: any): SalaryRow => calc({
    id:               r.id,
    /* Use fresh employee table values as authoritative; fall back to pr columns */
    emp_code:         r.e_code          || r.emp_code        || "",
    emp_name:         r.e_name          || r.emp_name        || "",
    emp_designation:  r.emp_designation || r.designation     || "",
    emp_department:   r.department      || "",
    basic_pay:        String(
                        Number(r.basic_pay) > 0
                          ? r.basic_pay
                          : (r.e_basic_pay ?? "0")
                      ),
    cca:              String(r.cca                  ?? "0"),
    special_pay:      String(r.special_pay          ?? "0"),
    personal_pay:     String(r.personal_pay         ?? "0"),
    hra:              String(r.hra                  ?? "0"),
    dept_allowance:   String(r.dept_allowance       ?? "0"),
    gpf:              String(r.gpf                  ?? "0"),
    nps:              String(r.nps                  ?? "0"),
    gpf_advance_recovery: String(r.gpf_advance_recovery ?? "0"),
    group_insurance:  String(r.group_insurance      ?? "0"),
    hba:              String(r.hba                  ?? "0"),
    income_tax:       String(r.income_tax           ?? "0"),
    gvr:              String(r.gvr                  ?? "0"),
    hrent:            String(r.hrent                ?? "0"),
    recovery_pay_slip: String(r.recovery_pay_slip   ?? "0"),
    other_deductions: String(r.other_deductions     ?? "0"),
    /* Employee Master dynamic heads for display */
    emp_allowances: Array.isArray(r.emp_allowances) ? r.emp_allowances : [],
    emp_deductions: Array.isArray(r.emp_deductions) ? r.emp_deductions : [],
    da: 0, total_allowances: 0,
    gross_pay: 0, total_deductions: 0, net_pay: 0, employer_nps: 0,
    status: r.status ?? "draft",
  }, daRate), [daRate]);

  /* Build query params */
  const buildParams = () => {
    const p = new URLSearchParams({ month: String(month), year: String(year) });
    if (filterMode === "group" && group) p.set("group", group);
    else p.set("dept", dept);
    return p.toString();
  };

  /* Helper: reset pending state */
  const resetPending = () => {
    setPendingEmps([]); setPendingSelected(new Set()); setPendingLoaded(false);
  };

  /* Build pending query params */
  const buildPendingParams = () => {
    const p = new URLSearchParams({ month: String(month), year: String(year) });
    if (filterMode === "group" && group) p.set("group", group);
    else p.set("dept", dept);
    return p.toString();
  };

  /* Load pending employees (not yet generated for selected period) */
  const loadPending = async () => {
    if (filterMode === "group" && !group) {
      toast({ title: "Please select a PayBill Group", variant: "destructive" }); return;
    }
    setPendingLoading(true); setPendingLoaded(false);
    setPendingEmps([]); setPendingSelected(new Set());
    try {
      const r = await apiFetch(`/salary-sheets/pending?${buildPendingParams()}`);
      const data: PendingEmp[] = await r.json();
      setPendingEmps(data);
      setPendingLoaded(true);
      if (data.length === 0)
        toast({ title: `${MONTHS[month-1]} ${year} — ${filterLabel}: All employees' salary has already been generated.` });
    } catch (e: any) {
      toast({ title: "Error: " + e.message, variant: "destructive" });
    } finally { setPendingLoading(false); }
  };

  /* Toggle single checkbox */
  const togglePending = (id: number) => {
    setPendingSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllPending = () => setPendingSelected(new Set(pendingEmps.map(e => e.id)));
  const deselectAll      = () => setPendingSelected(new Set());

  /* Generate salary only for selected employees */
  const generate = async () => {
    const selectedIds = [...pendingSelected];
    if (selectedIds.length === 0) {
      toast({ title: "No employee selected. Please check at least one employee.", variant: "destructive" }); return;
    }
    setLoading(true); setExpanded(null);
    try {
      const body: any = { month, year, employeeIds: selectedIds };
      if (filterMode === "group" && group) body.group = group;
      else body.dept = dept;

      const r = await apiFetch("/salary-sheets/generate", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await r.json();
      const newRows = (data.records as any[]).map(fromApi);
      setRows(prev => {
        const existingIds = new Set(prev.map(r => r.id));
        return [...prev, ...newRows.filter(r => !existingIds.has(r.id))];
      });
      /* Remove generated employees from pending list */
      setPendingEmps(prev => prev.filter(e => !pendingSelected.has(e.id)));
      setPendingSelected(new Set());
      toast({ title: `Salary generated successfully for ${data.generated} employee(s).` });
    } catch (e: any) {
      toast({ title: "Error: " + e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const reload = async () => {
    setLoading(true); setExpanded(null);
    try {
      const r = await apiFetch(`/salary-sheets?${buildParams()}`);
      const data: any[] = await r.json();
      if (data.length === 0) toast({ title: "No records found. Click Generate / Load." });
      setRows(data.map(fromApi));
    } catch { toast({ title: "Error loading", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  const update = useCallback((id: number, key: keyof SalaryRow, val: string) => {
    setRows(prev => prev.map(r => r.id === id ? calc({ ...r, [key]: val }, daRate) : r));
  }, [daRate]);

  const toggleExpand = (id: number, section: "allowances" | "deductions") => {
    setExpanded(prev => prev?.id === id && prev?.section === section ? null : { id, section });
  };

  /* Save All */
  const saveAll = async () => {
    setSaving(true);
    try {
      const payload = rows.map(r => ({
        id: r.id,
        basicPay: r.basic_pay, pratipurtiVetan: "0",
        cca: r.cca, specialPay: r.special_pay, personalPay: r.personal_pay,
        hra: r.hra, deptAllowance: r.dept_allowance,
        gpf: r.gpf, nps: r.nps, gpfAdvanceRecovery: r.gpf_advance_recovery,
        groupInsurance: r.group_insurance, hba: r.hba, incomeTax: r.income_tax,
        gvr: r.gvr, hrent: r.hrent, recoveryPaySlip: r.recovery_pay_slip,
      }));
      await apiFetch("/salary-sheets/bulk", { method: "PUT", body: JSON.stringify(payload) });
      toast({ title: "Pay bill saved successfully" });
      reload();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  /* Print */
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Departmental Pay Bill — ${filterLabel} — ${MONTHS[month-1]} ${year}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 10px; margin: 10mm; }
        h2, h3, p { margin: 2px 0; text-align: center; }
        table { border-collapse: collapse; width: 100%; margin-top: 8px; font-size: 9px; }
        th, td { border: 1px solid #333; padding: 3px 5px; }
        th { background: #1a3a6e; color: white; font-size: 8px; text-transform: uppercase; }
        .right { text-align: right; }
        .total-row { font-weight: bold; background: #f0f0f0; }
        .sign-row { margin-top: 30mm; display: flex; justify-content: space-between; font-size: 10px; }
      </style>
    </head><body>
      <h2>BAREILLY DEVELOPMENT AUTHORITY, BAREILLY</h2>
      <h3>DEPARTMENTAL PAY BILL</h3>
      <p><strong>${filterMode === "group" ? "PayBill Group" : "Department"}:</strong> ${filterLabel}
         &nbsp;&nbsp; <strong>Month:</strong> ${MONTHS[month-1]} ${year}
         &nbsp;&nbsp; <strong>DA:</strong> ${daLabel ?? "—"}% of Basic Pay</p>
      ${content.innerHTML}
      <div class="sign-row">
        <div>Drawing & Disbursing Officer<br/>____________________________</div>
        <div>Accounts Officer<br/>____________________________</div>
        <div>Head of Department<br/>____________________________</div>
      </div>
    </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  /* Export Excel */
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const labelType = filterMode === "group" ? "Group" : "Department";
    const aoa: any[][] = [
      ["BAREILLY DEVELOPMENT AUTHORITY, BAREILLY"],
      [`DEPARTMENTAL PAY BILL — ${filterLabel} — ${MONTHS[month-1]} ${year}`],
      [`DA: ${daLabel ?? "—"}% of Basic Pay`],
      [],
      ["S.No.","Emp Code","Name","Designation","Dept/Group","Basic Pay",`DA ${daLabel??''}%`,"Allowances","Gross","Deductions","Net Pay","Auth.NPS"],
      ...rows.map((r, i) => [
        i+1, r.emp_code, r.emp_name, r.emp_designation, r.emp_department,
        n(r.basic_pay), r.da, r.total_allowances, r.gross_pay,
        r.total_deductions, r.net_pay, r.employer_nps,
      ]),
      [],
      ["","","","","TOTAL",
        rows.reduce((s,r)=>s+n(r.basic_pay),0),
        rows.reduce((s,r)=>s+r.da,0),
        rows.reduce((s,r)=>s+r.total_allowances,0),
        rows.reduce((s,r)=>s+r.gross_pay,0),
        rows.reduce((s,r)=>s+r.total_deductions,0),
        rows.reduce((s,r)=>s+r.net_pay,0),
        rows.reduce((s,r)=>s+r.employer_nps,0),
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{wch:5},{wch:12},{wch:26},{wch:16},{wch:16},{wch:11},{wch:9},{wch:11},{wch:11},{wch:11},{wch:11},{wch:11}];
    XLSX.utils.book_append_sheet(wb, ws, filterLabel.slice(0,31));
    XLSX.writeFile(wb, `BDA_PayBill_${filterLabel.replace(/\s+/g,"_")}_${MONTHS[month-1]}_${year}.xlsx`);
    void labelType;
  };

  /* Totals */
  const totals = rows.reduce((acc, r) => ({
    basic: acc.basic + n(r.basic_pay),
    da:    acc.da    + r.da,
    allow: acc.allow + r.total_allowances,
    gross: acc.gross + r.gross_pay,
    ded:   acc.ded   + r.total_deductions,
    net:   acc.net   + r.net_pay,
    nps:   acc.nps   + r.employer_nps,
  }), { basic:0, da:0, allow:0, gross:0, ded:0, net:0, nps:0 });

  const INR = (v: number) => v.toLocaleString("en-IN");

  /* ── render ── */
  return (
    <PayrollLayout title="Departmental Pay Bill">

      {/* ── Filter Mode Toggle ── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-gray-500">Filter by:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          <button
            onClick={() => { setFilterMode("dept"); setRows([]); resetPending(); }}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors
              ${filterMode === "dept"
                ? "bg-blue-700 text-white font-semibold"
                : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            <Building2 className="h-3.5 w-3.5" /> Department
          </button>
          <button
            onClick={() => { setFilterMode("group"); setRows([]); resetPending(); }}
            className={`px-3 py-1.5 flex items-center gap-1.5 border-l border-gray-200 transition-colors
              ${filterMode === "group"
                ? "bg-blue-700 text-white font-semibold"
                : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            <Layers className="h-3.5 w-3.5" /> PayBill Group
          </button>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">

        {/* Department DDL (with All option) */}
        {filterMode === "dept" && (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[210px]">
            <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
            <select value={dept} onChange={e => { setDept(e.target.value); setRows([]); resetPending(); }}
              className="text-sm font-semibold border-none outline-none bg-transparent cursor-pointer flex-1">
              <option value={ALL_DEPT_VAL}>— All Departments —</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
              {departments.length === 0 && <option disabled>No departments in Branch Master</option>}
            </select>
          </div>
        )}

        {/* PayBill Group DDL */}
        {filterMode === "group" && (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm min-w-[210px]">
            <Layers className="h-4 w-4 text-gray-400 shrink-0" />
            <select value={group} onChange={e => { setGroup(e.target.value); setRows([]); resetPending(); }}
              className="text-sm font-semibold border-none outline-none bg-transparent cursor-pointer flex-1">
              {paybillGroups.length === 0
                ? <option value="">— No PayBill Groups found —</option>
                : paybillGroups.map(g => <option key={g} value={g}>{g}</option>)
              }
            </select>
          </div>
        )}

        {/* Month */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <label className="text-xs text-gray-500 font-medium">Month</label>
          <select value={month} onChange={e => setMonth(Number(e.target.value))}
            className="text-sm font-semibold border-none outline-none bg-transparent cursor-pointer">
            {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
          </select>
        </div>

        {/* Year */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <label className="text-xs text-gray-500 font-medium">Year</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))}
            className="text-sm font-semibold border-none outline-none bg-transparent cursor-pointer">
            {Array.from({length:6},(_,i)=>now.getFullYear()-2+i).map(y => <option key={y}>{y}</option>)}
          </select>
        </div>

        {/* Load Employees button — step 1 */}
        <Button onClick={loadPending} disabled={pendingLoading || loading || (filterMode === "group" && !group)}
          className="bg-blue-700 hover:bg-blue-800 gap-2 text-sm">
          {pendingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
          Load Employees
        </Button>
        <Button onClick={reload} variant="outline" disabled={loading} className="gap-2 text-sm">
          <RefreshCw className="h-3.5 w-3.5" /> Reload Generated
        </Button>

        {rows.length > 0 && (
          <>
            <Button onClick={saveAll} disabled={saving}
              className="bg-green-600 hover:bg-green-700 gap-2 text-sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save All
            </Button>
            <Button onClick={handlePrint} variant="outline" className="gap-2 text-sm border-gray-400 hover:bg-gray-50">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button onClick={exportExcel} variant="outline"
              className="gap-2 text-sm border-green-600 text-green-700 hover:bg-green-50">
              <Download className="h-4 w-4" /> Export Excel
            </Button>
          </>
        )}
      </div>

      {/* Info badge */}
      <div className="mb-3 flex items-center gap-3 flex-wrap">
        {rows.length > 0 && (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
            ${filterMode === "group" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
            {filterLabel}
          </span>
        )}
        <span className="text-xs text-gray-400">
          DA = {daLabel === null ? <span className="animate-pulse">…</span> : <strong>{daLabel}%</strong>} of Basic Pay
        </span>
        {filterMode === "group" && paybillGroups.length === 0 && (
          <span className="text-xs text-amber-600">
            No PayBill Groups found — add via{" "}
            <a href="/portal/payroll/masters/paybill-groups" className="underline font-semibold">PayBill Group Master</a>.
          </span>
        )}
        {filterMode === "dept" && departments.length === 0 && (
          <span className="text-xs text-amber-600">
            No departments found — add via{" "}
            <a href="/portal/payroll/masters/branches" className="underline font-semibold">Branch Master</a>.
          </span>
        )}
      </div>

      {/* ── Pending employees loading spinner ── */}
      {pendingLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      )}

      {/* ── Pending employees selection table ── */}
      {pendingLoaded && pendingEmps.length > 0 && !pendingLoading && (
        <div className="mb-6 rounded-xl border border-blue-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-sm">
                Pending Employees — {filterLabel} — {MONTHS[month-1]} {year}
              </span>
              <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingEmps.length} employees
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={selectAllPending}
                className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors">
                <CheckSquare className="h-3.5 w-3.5" /> Select All
              </button>
              <button onClick={deselectAll}
                className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-medium transition-colors">
                <XSquare className="h-3.5 w-3.5" /> Deselect All
              </button>
              <Button
                onClick={generate}
                disabled={pendingSelected.size === 0 || loading}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-1.5 h-auto gap-1.5">
                {loading
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Calculator className="h-3.5 w-3.5" />}
                Generate Selected ({pendingSelected.size})
              </Button>
            </div>
          </div>

          {/* Employee selection table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-50 border-b border-blue-100 text-blue-800">
                  <th className="px-3 py-2 w-10 text-center">
                    <button onClick={pendingSelected.size === pendingEmps.length ? deselectAll : selectAllPending}
                      className="text-blue-600 hover:text-blue-800">
                      {pendingSelected.size === pendingEmps.length
                        ? <CheckSquare className="h-4 w-4" />
                        : <Square className="h-4 w-4" />}
                    </button>
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">#</th>
                  <th className="px-3 py-2 text-left font-semibold">Employee Name / Code</th>
                  <th className="px-3 py-2 text-left font-semibold">Designation</th>
                  <th className="px-3 py-2 text-left font-semibold">Department</th>
                  <th className="px-3 py-2 text-right font-semibold">Basic Pay</th>
                </tr>
              </thead>
              <tbody>
                {pendingEmps.map((emp, i) => {
                  const checked = pendingSelected.has(emp.id);
                  return (
                    <tr key={emp.id}
                      onClick={() => togglePending(emp.id)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors
                        ${checked ? "bg-blue-50 hover:bg-blue-100" : i % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50/60 hover:bg-gray-100"}`}>
                      <td className="px-3 py-2 text-center">
                        <span className={checked ? "text-blue-600" : "text-gray-300"}>
                          {checked ? <CheckSquare className="h-4 w-4 inline" /> : <Square className="h-4 w-4 inline" />}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                      <td className="px-3 py-2">
                        <div className={`font-semibold ${checked ? "text-blue-800" : "text-gray-800"}`}>{emp.name}</div>
                        <div className="text-[10px] text-gray-400">{emp.emp_code}</div>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{emp.designation || "—"}</td>
                      <td className="px-3 py-2 text-gray-500">{emp.department || emp.paybill_group || "—"}</td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-green-700">
                        {Number(emp.basic_pay).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom action bar */}
          {pendingSelected.size > 0 && (
            <div className="bg-green-50 border-t border-green-200 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-green-800 font-medium">
                {pendingSelected.size} employee{pendingSelected.size > 1 ? "s" : ""} selected
              </span>
              <Button
                onClick={generate}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white gap-2 text-sm">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
                Generate Salary for {pendingSelected.size} Employee{pendingSelected.size > 1 ? "s" : ""}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── All done message ── */}
      {pendingLoaded && pendingEmps.length === 0 && !pendingLoading && rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <CheckSquare className="h-12 w-12 mb-3 text-green-400 opacity-60" />
          <p className="text-base font-semibold text-green-700">All employees' salary has been generated for this period.</p>
          <p className="text-xs mt-1 text-gray-400">{MONTHS[month-1]} {year} — {filterLabel}</p>
          <Button onClick={reload} variant="outline" className="mt-4 gap-2 text-sm">
            <RefreshCw className="h-3.5 w-3.5" /> View Generated Records
          </Button>
        </div>
      )}

      {/* Empty state — nothing loaded yet */}
      {rows.length === 0 && !loading && !pendingLoaded && !pendingLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Building2 className="h-12 w-12 mb-3 opacity-20" />
          <p className="text-base font-semibold">
            Select Filter, Month & Year → then click <span className="text-blue-600">Load Employees</span>
          </p>
          <p className="text-xs mt-1">Filter by Department or PayBill Group — DA on Basic Pay only</p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && !loading && (
        <>
          <div ref={printRef}>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="text-xs border-collapse w-full">
                <thead>
                  <tr className="bg-[#1a3a6e] text-white">
                    <th className="px-2 py-2.5 text-center w-10">#</th>
                    <th className="sticky left-0 z-10 bg-[#1a3a6e] px-3 py-2.5 text-left min-w-[175px]">Name / Code</th>
                    <th className="px-2 py-2.5 text-left min-w-[90px]">Designation</th>
                    {dept === ALL_DEPT_VAL && filterMode === "dept" && (
                      <th className="px-2 py-2.5 text-left min-w-[100px]">Department</th>
                    )}
                    <th className="px-2 py-2.5 text-right bg-green-800 min-w-[90px]">Basic Pay</th>
                    <th className="px-2 py-2.5 text-right bg-green-700 min-w-[72px]">
                      DA {daLabel === null ? <span className="opacity-60 text-[10px]">…</span> : <>{daLabel}%</>}
                    </th>
                    <th className="px-2 py-2.5 text-right bg-teal-700 min-w-[105px]">
                      Allowances <span className="text-[10px] opacity-70">▼</span>
                    </th>
                    <th className="px-2 py-2.5 text-right bg-green-600 min-w-[85px]">Gross</th>
                    <th className="px-2 py-2.5 text-right bg-red-700 min-w-[105px]">
                      Deductions <span className="text-[10px] opacity-70">▼</span>
                    </th>
                    <th className="px-2 py-2.5 text-right bg-blue-700 min-w-[85px]">Net Pay</th>
                    <th className="px-2 py-2.5 text-right bg-purple-800 min-w-[80px]">Auth. NPS</th>
                  </tr>
                  <tr className="bg-gray-100 text-gray-500 text-[10px]">
                    <td></td>
                    <td className="sticky left-0 z-10 bg-gray-100 px-2 py-1"></td>
                    <td></td>
                    {dept === ALL_DEPT_VAL && filterMode === "dept" && <td></td>}
                    <td className="px-2 py-1 text-center text-green-700 font-semibold">editable ✏</td>
                    <td className="px-2 py-1 text-center text-green-600">auto ↑</td>
                    <td className="px-2 py-1 text-center text-teal-600">from Emp. Master</td>
                    <td className="px-2 py-1 text-center text-green-600">auto</td>
                    <td className="px-2 py-1 text-center text-red-600">from Emp. Master</td>
                    <td className="px-2 py-1 text-center text-blue-600">auto</td>
                    <td className="px-2 py-1 text-center text-purple-600">auto</td>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const isExpAll = expanded?.id === r.id && expanded?.section === "allowances";
                    const isExpDed = expanded?.id === r.id && expanded?.section === "deductions";
                    const rowBg = i % 2 === 0 ? "bg-white" : "bg-gray-50";
                    const showDeptCol = dept === ALL_DEPT_VAL && filterMode === "dept";
                    const colSpanFull = showDeptCol ? 11 : 10;
                    return (
                      <>
                        <tr key={`row-${r.id}`} className={`border-b border-gray-100 ${rowBg} hover:bg-blue-50/30`}>
                          <td className="px-2 text-center text-gray-400">{i+1}</td>
                          <td className={`sticky left-0 z-10 px-3 py-1.5 ${rowBg}`}>
                            <div className="font-semibold text-gray-800 truncate max-w-[170px]" title={r.emp_name}>
                              {r.emp_name || <span className="text-gray-300 italic">—</span>}
                            </div>
                            <div className="text-[10px] text-gray-400">{r.emp_code}</div>
                          </td>
                          <td className="px-2 py-1.5 text-gray-600 truncate max-w-[85px]" title={r.emp_designation}>
                            {r.emp_designation || "—"}
                          </td>
                          {showDeptCol && (
                            <td className="px-2 py-1.5 text-gray-500 text-[10px] truncate max-w-[95px]">
                              {r.emp_department || "—"}
                            </td>
                          )}

                          {/* Basic Pay editable */}
                          <td className="px-1 bg-green-50/40">
                            <EC val={r.basic_pay} onChange={v => update(r.id, "basic_pay", v)} />
                          </td>
                          {/* DA auto */}
                          <td className="px-2 text-right font-mono text-green-700 bg-green-50">{INR(r.da)}</td>

                          {/* Allowances — collapsible */}
                          <td className="px-1.5 bg-teal-50/50">
                            <button
                              onClick={() => toggleExpand(r.id, "allowances")}
                              className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs font-mono font-semibold
                                transition-colors ${isExpAll ? "bg-teal-100 text-teal-800" : "text-teal-700 hover:bg-teal-100"}`}>
                              <span>{INR(r.total_allowances)}</span>
                              {isExpAll ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                            </button>
                          </td>

                          {/* Gross auto */}
                          <td className="px-2 text-right font-mono font-bold text-green-800 bg-green-100">{INR(r.gross_pay)}</td>

                          {/* Deductions — collapsible */}
                          <td className="px-1.5 bg-red-50/50">
                            <button
                              onClick={() => toggleExpand(r.id, "deductions")}
                              className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs font-mono font-semibold
                                transition-colors ${isExpDed ? "bg-red-100 text-red-800" : "text-red-700 hover:bg-red-100"}`}>
                              <span>{INR(r.total_deductions)}</span>
                              {isExpDed ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                            </button>
                          </td>

                          {/* Net Pay auto */}
                          <td className="px-2 text-right font-mono font-bold text-blue-800 bg-blue-100">{INR(r.net_pay)}</td>
                          {/* Auth NPS auto */}
                          <td className="px-2 text-right font-mono text-purple-700 bg-purple-50">{INR(r.employer_nps)}</td>
                        </tr>

                        {/* Allowances detail — from Employee Master */}
                        {isExpAll && (
                          <tr key={`allow-${r.id}`} className="bg-teal-50 border-b border-teal-200">
                            <td colSpan={colSpanFull} className="px-4 py-2.5">
                              <div className="flex flex-wrap gap-4 items-center">
                                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide shrink-0">
                                  ALLOWANCES:
                                </span>
                                {r.emp_allowances.length === 0 ? (
                                  <span className="text-xs text-teal-500 italic">
                                    No allowances assigned in Employee Master
                                  </span>
                                ) : (
                                  r.emp_allowances.map(a => (
                                    <div key={a.name} className="flex flex-col items-center gap-0.5 bg-white border border-teal-200 rounded px-3 py-1 shadow-sm">
                                      <span className="text-[10px] text-teal-600 font-medium whitespace-nowrap">{a.name}</span>
                                      <span className="text-xs font-bold text-teal-800 font-mono">{INR(n(a.amount))}</span>
                                    </div>
                                  ))
                                )}
                                <div className="ml-auto flex items-center gap-1 shrink-0">
                                  <span className="text-[10px] text-teal-600">Total =</span>
                                  <span className="text-sm font-bold text-teal-800">₹{INR(r.total_allowances)}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Deductions detail — from Employee Master */}
                        {isExpDed && (
                          <tr key={`ded-${r.id}`} className="bg-red-50 border-b border-red-200">
                            <td colSpan={colSpanFull} className="px-4 py-2.5">
                              <div className="flex flex-wrap gap-4 items-center">
                                <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide shrink-0">
                                  DEDUCTIONS:
                                </span>
                                {r.emp_deductions.length === 0 ? (
                                  <span className="text-xs text-red-500 italic">
                                    No deductions assigned in Employee Master
                                  </span>
                                ) : (
                                  r.emp_deductions.map(d => (
                                    <div key={d.name} className="flex flex-col items-center gap-0.5 bg-white border border-red-200 rounded px-3 py-1 shadow-sm">
                                      <span className="text-[10px] text-red-600 font-medium whitespace-nowrap">{d.name}</span>
                                      <span className="text-xs font-bold text-red-800 font-mono">{INR(n(d.amount))}</span>
                                    </div>
                                  ))
                                )}
                                <div className="ml-auto flex items-center gap-1 shrink-0">
                                  <span className="text-[10px] text-red-600">Total =</span>
                                  <span className="text-sm font-bold text-red-800">₹{INR(r.total_deductions)}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>

                {/* Totals footer */}
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold text-xs">
                    <td className="px-2 py-2.5 text-center">{rows.length}</td>
                    <td className="sticky left-0 z-10 bg-gray-800 px-3 py-2.5 text-left">TOTAL</td>
                    <td></td>
                    {dept === ALL_DEPT_VAL && filterMode === "dept" && <td></td>}
                    <td className="px-2 text-right">{INR(totals.basic)}</td>
                    <td className="px-2 text-right">{INR(totals.da)}</td>
                    <td className="px-2 text-right">{INR(totals.allow)}</td>
                    <td className="px-2 text-right">{INR(totals.gross)}</td>
                    <td className="px-2 text-right">{INR(totals.ded)}</td>
                    <td className="px-2 text-right">{INR(totals.net)}</td>
                    <td className="px-2 text-right">{INR(totals.nps)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Summary cards */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Gross Total",      val: totals.gross, color: "text-green-700  bg-green-50  border-green-200" },
              { label: "Total Deductions", val: totals.ded,   color: "text-red-700    bg-red-50    border-red-200"   },
              { label: "Net Payable",      val: totals.net,   color: "text-blue-700   bg-blue-50   border-blue-200"  },
              { label: "Auth. NPS",        val: totals.nps,   color: "text-purple-700 bg-purple-50 border-purple-200"},
            ].map(s => (
              <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.color}`}>
                <div className="text-xs font-medium opacity-70">{s.label}</div>
                <div className="text-lg font-bold mt-0.5">₹{INR(s.val)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </PayrollLayout>
  );
}
