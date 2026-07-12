import { useState, useCallback, useEffect, useMemo } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download, RefreshCw, Save, Loader2, ChevronDown, ChevronUp, Calculator, Users, CheckSquare, Square, XSquare } from "lucide-react";
import * as XLSX from "xlsx";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const INR = (v: number) => Math.round(v).toLocaleString("en-IN");

function isOfficerGroup(g: string) { return /officer/i.test(g); }
function getEmpType(g: string): "officer"|"other" { return isOfficerGroup(g) ? "officer" : "other"; }

/* ── allowance / deduction entry from Master ── */
interface HeadEntry { name: string; amount: number; }

/* ── salary row (all hardcoded fields removed) ── */
interface SalaryRow {
  id:              number;
  employee_id:     number;
  emp_code:        string;
  emp_name:        string;
  emp_designation: string;
  e_basic_pay:     number;   /* master basic pay (for re-calc) */
  worked_days:     number;
  month_days:      number;
  /* computed / stored */
  basic_pay:       number;   /* prorated basic  = master × (worked/month) */
  da:              number;   /* prorated DA     = master_da × (worked/month) */
  total_allowances:number;
  gross_pay:       number;
  total_deductions:number;
  net_pay:         number;
  employer_nps:    number;
  status:          string;
  allowances:      HeadEntry[];
  deductions:      HeadEntry[];
}

/* ── recalculate prorated basic+DA from master basic, days, daRate ── */
function recalcRow(r: SalaryRow, daRate: number): SalaryRow {
  const masterBasic  = r.e_basic_pay || 0;
  const masterDa     = Math.round(masterBasic * daRate);
  const workedDays   = r.worked_days  || r.month_days;
  const monthDays    = r.month_days   || 30;
  const payableBasic = Math.round(masterBasic * workedDays / monthDays);
  const payableDa    = Math.round(masterDa    * workedDays / monthDays);
  const totalAllow   = (r.allowances || []).reduce((s, a) => s + Number(a.amount), 0);
  const totalDed     = (r.deductions || []).reduce((s, d) => s + Number(d.amount), 0);
  const gross        = payableBasic + payableDa + totalAllow;
  return {
    ...r,
    basic_pay:        payableBasic,
    da:               payableDa,
    total_allowances: totalAllow,
    gross_pay:        gross,
    total_deductions: totalDed,
    net_pay:          gross - totalDed,
    employer_nps:     Math.round((payableBasic + payableDa) * 0.14),
  };
}

/* ── Pending employee ── */
interface PendingEmp {
  id: number; emp_code: string; name: string;
  designation: string; basic_pay: string;
  department: string; paybill_group: string;
}

type ExpandSection = "allowances" | "deductions";
interface ExpandKey { id: number; section: ExpandSection; }

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */
export default function GenerateSalary() {
  const now = new Date();
  const [month,         setMonth]         = useState(now.getMonth() + 1);
  const [year,          setYear]          = useState(now.getFullYear());
  const [paybillGroups, setPaybillGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [rows,          setRows]          = useState<SalaryRow[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [daRate,        setDaRate]        = useState(0);
  const [daLabel,       setDaLabel]       = useState<string | null>(null);
  const [expanded,      setExpanded]      = useState<ExpandKey | null>(null);
  const [pendingEmps,   setPendingEmps]   = useState<PendingEmp[]>([]);
  const [pendingSelected, setPendingSelected] = useState<Set<number>>(new Set());
  const [pendingDays,   setPendingDays]   = useState<Record<number, number>>({});
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingLoaded,  setPendingLoaded]  = useState(false);
  const { toast } = useToast();

  /* Calendar days in the selected month */
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);

  /* Load PayBill groups */
  useEffect(() => {
    apiFetch("/payroll-masters/paybill-groups")
      .then(r => r.json())
      .then((data: { name: string; status: string }[]) => {
        const groups = data.filter(g => g.status === "active").map(g => g.name);
        setPaybillGroups(groups);
        setSelectedGroup(groups[0] ?? "Officers");
      })
      .catch(() => {});
  }, []);

  /* Fetch DA rate */
  useEffect(() => {
    apiFetch("/da-master/current")
      .then(r => r.json())
      .then(data => {
        const pct = Number(data?.da_percent);
        if (pct > 0) { setDaRate(pct / 100); setDaLabel(String(pct)); }
        else { setDaLabel("—"); }
      })
      .catch(() => setDaLabel("—"));
  }, []);

  /* Convert API record → SalaryRow */
  const fromApi = useCallback((r: any): SalaryRow => {
    const masterBasic  = Number(r.e_basic_pay ?? r.basic_pay) || 0;
    const workedDays   = Number(r.worked_days  ?? daysInMonth);
    const monthDays    = Number(r.month_days   ?? daysInMonth);
    const allowances: HeadEntry[] = r.allowances ?? r.allowances_data ?? [];
    const deductions: HeadEntry[] = r.deductions ?? r.deductions_data ?? [];
    const totalAllow   = allowances.reduce((s, a) => s + Number(a.amount), 0);
    const totalDed     = deductions.reduce((s, d) => s + Number(d.amount), 0);
    const payableBasic = Number(r.basic_pay) || Math.round(masterBasic * workedDays / monthDays);
    const payableDa    = Number(r.da)        || Math.round(Math.round(masterBasic * daRate) * workedDays / monthDays);
    const gross        = payableBasic + payableDa + totalAllow;
    return {
      id:              r.id,
      employee_id:     r.employee_id,
      emp_code:        r.emp_code || r.e_code || "",
      emp_name:        r.emp_name || "",
      emp_designation: r.emp_designation || r.designation || "",
      e_basic_pay:     masterBasic,
      worked_days:     workedDays,
      month_days:      monthDays,
      basic_pay:       payableBasic,
      da:              payableDa,
      total_allowances:totalAllow,
      gross_pay:       gross,
      total_deductions:totalDed,
      net_pay:         gross - totalDed,
      employer_nps:    Math.round((payableBasic + payableDa) * 0.14),
      status:          r.status ?? "draft",
      allowances,
      deductions,
    };
  }, [daRate, daysInMonth]);

  /* Load pending employees */
  const loadPending = async () => {
    setPendingLoading(true);
    setPendingLoaded(false);
    setPendingEmps([]);
    setPendingSelected(new Set());
    try {
      const params = new URLSearchParams({
        month: String(month), year: String(year),
        group: selectedGroup, type: getEmpType(selectedGroup),
      });
      const r = await apiFetch(`/salary-sheets/pending?${params}`);
      const data: PendingEmp[] = await r.json();
      setPendingEmps(data);
      /* Default days = full month for all pending employees */
      const defaultDays: Record<number, number> = {};
      data.forEach(e => { defaultDays[e.id] = daysInMonth; });
      setPendingDays(defaultDays);
      setPendingLoaded(true);
      if (data.length === 0)
        toast({ title: `${MONTHS[month-1]} ${year} — All employees' salary has already been generated.` });
    } catch (e: any) {
      toast({ title: "Error: " + e.message, variant: "destructive" });
    } finally { setPendingLoading(false); }
  };

  const togglePending = (id: number) => {
    setPendingSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const selectAllPending = () => setPendingSelected(new Set(pendingEmps.map(e => e.id)));
  const deselectAll      = () => setPendingSelected(new Set());

  /* Generate salary for selected pending employees */
  const generate = async () => {
    const selectedIds = [...pendingSelected];
    if (selectedIds.length === 0) {
      toast({ title: "No employee selected. Please check at least one employee.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setExpanded(null);
    try {
      /* Build per-employee days map */
      const employeeDays: Record<string, number> = {};
      selectedIds.forEach(id => { employeeDays[id] = pendingDays[id] ?? daysInMonth; });

      const r = await apiFetch("/salary-sheets/generate", {
        method: "POST",
        body: JSON.stringify({
          month, year,
          type:        getEmpType(selectedGroup),
          group:       selectedGroup,
          employeeIds: selectedIds,
          employeeDays,
          monthDays:   daysInMonth,
        }),
      });
      const data = await r.json();
      const newRows = (data.records as any[]).map(fromApi);
      setRows(prev => {
        const existingIds = new Set(prev.map(r => r.id));
        return [...prev, ...newRows.filter(r => !existingIds.has(r.id))];
      });
      setPendingEmps(prev => prev.filter(e => !pendingSelected.has(e.id)));
      setPendingSelected(new Set());
      toast({ title: `Salary generated for ${data.generated} employee(s).` });
    } catch (e: any) {
      toast({ title: "Error: " + e.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  /* Reload generated */
  const reload = async () => {
    setLoading(true);
    setExpanded(null);
    try {
      const r = await apiFetch(`/salary-sheets?month=${month}&year=${year}&group=${encodeURIComponent(selectedGroup)}&type=${getEmpType(selectedGroup)}`);
      const data: any[] = await r.json();
      if (data.length === 0) toast({ title: "No records found. Click Load Employees to generate." });
      setRows(data.map(fromApi));
    } catch { toast({ title: "Error loading", variant: "destructive" }); }
    finally { setLoading(false); }
  };

  /* Update worked_days for a generated row and recalculate */
  const updateDays = useCallback((id: number, days: number) => {
    setRows(prev => prev.map(r =>
      r.id === id ? recalcRow({ ...r, worked_days: Math.max(1, Math.min(days, r.month_days)) }, daRate) : r
    ));
  }, [daRate]);

  /* Toggle expand */
  const toggleExpand = (id: number, section: ExpandSection) => {
    setExpanded(prev => prev?.id === id && prev?.section === section ? null : { id, section });
  };

  /* Save all — recalculate via API with current worked_days */
  const saveAll = async () => {
    setSaving(true);
    try {
      const payload = rows.map(r => ({ id: r.id, workedDays: r.worked_days }));
      await apiFetch("/salary-sheets/bulk", { method: "PUT", body: JSON.stringify(payload) });
      toast({ title: "Salary sheet saved successfully" });
      reload();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  /* Export Excel */
  const exportExcel = () => {
    const wb   = XLSX.utils.book_new();
    const aoa: any[][] = [
      ["BAREILLY DEVELOPMENT AUTHORITY, BAREILLY"],
      [`PAYROLL FOR THE MONTH - ${MONTHS[month-1]}/${year} — ${selectedGroup}`],
      [],
      ["Name","Desig.","Master Basic","Days","Basic (Prorated)","DA","Allowances","Gross","Deductions","Net Pay","Auth. NPS"],
    ];
    rows.forEach(r => {
      aoa.push([
        r.emp_name, r.emp_designation,
        r.e_basic_pay, `${r.worked_days}/${r.month_days}`,
        r.basic_pay, r.da,
        r.total_allowances, r.gross_pay, r.total_deductions, r.net_pay, r.employer_nps,
      ]);
    });
    const gross = rows.reduce((s, r) => s + r.gross_pay, 0);
    const net   = rows.reduce((s, r) => s + r.net_pay, 0);
    const ded   = rows.reduce((s, r) => s + r.total_deductions, 0);
    const nps   = rows.reduce((s, r) => s + r.employer_nps, 0);
    aoa.push([], ["","","","Gross Total","=",gross], ["","","","Net Payable","=",net],
      ["","","","Total Deductions","=",ded], ["","","","Authority NPS","=",nps]);
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{wch:30},{wch:14},{wch:12},{wch:10},{wch:14},{wch:10},{wch:12},{wch:12},{wch:12},{wch:12},{wch:12}];
    XLSX.utils.book_append_sheet(wb, ws, selectedGroup.slice(0, 31));
    XLSX.writeFile(wb, `BDA_Payroll_${selectedGroup.replace(/\s+/g,"_")}_${MONTHS[month-1]}_${year}.xlsx`);
  };

  const totals = rows.reduce(
    (acc, r) => ({ gross: acc.gross + r.gross_pay, ded: acc.ded + r.total_deductions, net: acc.net + r.net_pay, nps: acc.nps + r.employer_nps }),
    { gross: 0, ded: 0, net: 0, nps: 0 }
  );

  /* ══════════════════════════════════════════════════════════════
     Render
     ══════════════════════════════════════════════════════════════ */
  return (
    <PayrollLayout title="Generate Salary">

      {/* ── Controls bar ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
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

        {/* PayBill Group tabs */}
        <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {(paybillGroups.length === 0 ? ["Officers","Employees"] : paybillGroups).map(g => (
            <button key={g}
              onClick={() => { setSelectedGroup(g); setPendingEmps([]); setPendingLoaded(false); setRows([]); setExpanded(null); }}
              className={`px-4 py-2 text-xs font-semibold transition-colors border-r last:border-r-0 border-gray-100
                ${selectedGroup === g ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              {g}
            </button>
          ))}
        </div>

        <Button onClick={loadPending} disabled={pendingLoading || loading}
          className="bg-blue-700 hover:bg-blue-800 gap-2 text-sm">
          {pendingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
          Load Employees
        </Button>
        <Button onClick={reload} variant="outline" disabled={loading} className="gap-2 text-sm">
          <RefreshCw className="h-3.5 w-3.5" /> Reload Generated
        </Button>
        {rows.length > 0 && (
          <>
            <Button onClick={saveAll} disabled={saving} className="bg-green-600 hover:bg-green-700 gap-2 text-sm">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save All
            </Button>
            <Button onClick={exportExcel} variant="outline"
              className="gap-2 text-sm border-green-600 text-green-700 hover:bg-green-50">
              <Download className="h-4 w-4" /> Export Excel
            </Button>
          </>
        )}
      </div>

      {/* ── DA badge ── */}
      {selectedGroup && (
        <div className="mb-3 flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
            ${isOfficerGroup(selectedGroup) ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"}`}>
            {isOfficerGroup(selectedGroup) ? "Officer Format" : "Employee Format"}
          </span>
          <span className="text-xs text-gray-400">
            DA {daLabel === null ? <span className="animate-pulse">…</span> : <strong>{daLabel}%</strong>} of Basic Pay
          </span>
          <span className="text-xs text-gray-400">
            · {MONTHS[month-1]} {year} has <strong>{daysInMonth} days</strong>
          </span>
        </div>
      )}

      {/* ── Pending loading spinner ── */}
      {pendingLoading && (
        <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PENDING EMPLOYEES TABLE — with Days input
          ══════════════════════════════════════════════════════════ */}
      {pendingLoaded && pendingEmps.length > 0 && !pendingLoading && (
        <div className="mb-6 rounded-xl border border-blue-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-blue-700 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-sm">
                Pending Employees — {MONTHS[month-1]} {year}
              </span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{pendingEmps.length} employees</span>
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
              <Button onClick={generate} disabled={pendingSelected.size === 0 || loading}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-1.5 h-auto gap-1.5">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Calculator className="h-3.5 w-3.5" />}
                Generate Selected ({pendingSelected.size})
              </Button>
            </div>
          </div>

          {/* Table */}
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
                  <th className="px-3 py-2 text-center font-semibold bg-amber-50 text-amber-800">
                    Days Worked<br />
                    <span className="text-[10px] font-normal opacity-70">out of {daysInMonth}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingEmps.map((emp, i) => {
                  const checked = pendingSelected.has(emp.id);
                  return (
                    <tr key={emp.id}
                      onClick={() => togglePending(emp.id)}
                      className={`border-b border-gray-100 cursor-pointer transition-colors
                        ${checked ? "bg-blue-50 hover:bg-blue-100" : i%2===0 ? "bg-white hover:bg-gray-50" : "bg-gray-50/60 hover:bg-gray-100"}`}>
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
                      <td className="px-3 py-2 text-gray-500">{emp.department || "—"}</td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-green-700">
                        {Number(emp.basic_pay).toLocaleString("en-IN")}
                      </td>
                      {/* Days input — stop click from toggling row */}
                      <td className="px-3 py-2 bg-amber-50" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={daysInMonth}
                            value={pendingDays[emp.id] ?? daysInMonth}
                            onChange={e => setPendingDays(prev => ({
                              ...prev, [emp.id]: Math.max(1, Math.min(Number(e.target.value), daysInMonth))
                            }))}
                            className="w-14 text-center border border-amber-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none focus:border-amber-500"
                          />
                          <span className="text-[10px] text-gray-400">/ {daysInMonth}</span>
                        </div>
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
              <Button onClick={generate} disabled={loading}
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
          <p className="text-xs mt-1 text-gray-400">{MONTHS[month-1]} {year} — {selectedGroup}</p>
          <Button onClick={reload} variant="outline" className="mt-4 gap-2 text-sm">
            <RefreshCw className="h-3.5 w-3.5" /> View Generated Records
          </Button>
        </div>
      )}

      {/* ── Empty state ── */}
      {rows.length === 0 && !loading && !pendingLoaded && !pendingLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Users className="h-12 w-12 mb-3 opacity-20" />
          <p className="text-base font-semibold">Select Month / Year / Group and click <span className="text-blue-600">Load Employees</span></p>
          <p className="text-xs mt-1 text-gray-400">
            DA = {daLabel === null ? "loading…" : `${daLabel}%`} of Basic Pay
          </p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
      )}

      {/* ══════════════════════════════════════════════════════════
          GENERATED SALARY TABLE
          ══════════════════════════════════════════════════════════ */}
      {rows.length > 0 && !loading && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="text-xs border-collapse w-full">
              <thead>
                <tr className="bg-[#1a3a6e] text-white">
                  <th className="sticky left-0 z-10 bg-[#1a3a6e] px-3 py-2.5 text-left min-w-[180px]">Name</th>
                  <th className="px-2 py-2.5 text-left min-w-[90px]">Desig.</th>
                  <th className="px-2 py-2.5 text-right bg-green-800 min-w-[85px]">Master Basic</th>
                  <th className="px-2 py-2.5 text-center bg-amber-700 min-w-[90px]">
                    Days<br /><span className="text-[10px] font-normal opacity-80">Worked / Month</span>
                  </th>
                  <th className="px-2 py-2.5 text-right bg-green-700 min-w-[85px]">
                    Basic (Prorated)
                  </th>
                  <th className="px-2 py-2.5 text-right bg-green-700 min-w-[72px]">
                    DA {daLabel === null ? <span className="opacity-60 text-[10px]">…</span> : <>{daLabel}%</>}
                  </th>
                  <th className="px-2 py-2.5 text-right bg-teal-700 min-w-[100px]">
                    Allowances <span className="text-[10px] opacity-70">▼</span>
                  </th>
                  <th className="px-2 py-2.5 text-right bg-green-600 min-w-[85px]">Gross</th>
                  <th className="px-2 py-2.5 text-right bg-red-700 min-w-[100px]">
                    Deductions <span className="text-[10px] opacity-70">▼</span>
                  </th>
                  <th className="px-2 py-2.5 text-right bg-blue-700 min-w-[85px]">Net Pay</th>
                  <th className="px-2 py-2.5 text-right bg-purple-800 min-w-[80px]">Auth. NPS</th>
                </tr>
                <tr className="bg-gray-100 text-gray-500 text-[10px]">
                  <td className="sticky left-0 z-10 bg-gray-100 px-2 py-1 text-center" colSpan={2}>Employee</td>
                  <td className="px-2 py-1 text-center text-green-700">Master</td>
                  <td className="px-2 py-1 text-center text-amber-700 font-semibold">editable ✏</td>
                  <td className="px-2 py-1 text-center text-green-600">auto ↑</td>
                  <td className="px-2 py-1 text-center text-green-600">auto</td>
                  <td className="px-2 py-1 text-center text-teal-600">click ▼ to view</td>
                  <td className="px-2 py-1 text-center text-green-600">auto</td>
                  <td className="px-2 py-1 text-center text-red-600">click ▼ to view</td>
                  <td className="px-2 py-1 text-center text-blue-600">auto</td>
                  <td className="px-2 py-1 text-center text-purple-600">auto</td>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const isExpAll = expanded?.id === r.id && expanded?.section === "allowances";
                  const isExpDed = expanded?.id === r.id && expanded?.section === "deductions";
                  const rowBg    = i % 2 === 0 ? "bg-white" : "bg-gray-50";
                  return (
                    <>
                      {/* ── Main row ── */}
                      <tr key={`row-${r.id}`} className={`border-b border-gray-100 ${rowBg} hover:bg-blue-50/30`}>
                        <td className={`sticky left-0 z-10 px-3 py-1.5 font-semibold text-gray-800 ${rowBg}`}>
                          <div className="truncate max-w-[170px]" title={r.emp_name}>{r.emp_name}</div>
                          <div className="text-[10px] text-gray-400">{r.emp_code}</div>
                        </td>
                        <td className="px-2 py-1.5 text-gray-600 truncate max-w-[85px]" title={r.emp_designation}>{r.emp_designation}</td>

                        {/* Master Basic Pay — read only */}
                        <td className="px-2 text-right font-mono text-green-800 bg-green-50">
                          {INR(r.e_basic_pay)}
                        </td>

                        {/* Days — editable */}
                        <td className="px-2 bg-amber-50/60">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={1}
                              max={r.month_days}
                              value={r.worked_days}
                              onChange={e => updateDays(r.id, Number(e.target.value))}
                              className="w-12 text-center border border-amber-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-300"
                            />
                            <span className="text-[10px] text-gray-400">/ {r.month_days}</span>
                          </div>
                        </td>

                        {/* Prorated Basic */}
                        <td className="px-2 text-right font-mono text-green-700 bg-green-50">
                          {INR(r.basic_pay)}
                        </td>
                        {/* DA */}
                        <td className="px-2 text-right font-mono text-green-700 bg-green-50">
                          {INR(r.da)}
                        </td>

                        {/* Allowances — expandable */}
                        <td className="px-1.5 bg-teal-50/50">
                          <button
                            onClick={() => toggleExpand(r.id, "allowances")}
                            className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs font-mono font-semibold
                              transition-colors cursor-pointer
                              ${isExpAll ? "bg-teal-100 text-teal-800" : "text-teal-700 hover:bg-teal-100"}`}>
                            <span>{INR(r.total_allowances)}</span>
                            {isExpAll ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                          </button>
                        </td>

                        {/* Gross */}
                        <td className="px-2 text-right font-mono font-bold text-green-800 bg-green-100">
                          {INR(r.gross_pay)}
                        </td>

                        {/* Deductions — expandable */}
                        <td className="px-1.5 bg-red-50/50">
                          <button
                            onClick={() => toggleExpand(r.id, "deductions")}
                            className={`w-full flex items-center justify-between px-2 py-1 rounded text-xs font-mono font-semibold
                              transition-colors cursor-pointer
                              ${isExpDed ? "bg-red-100 text-red-800" : "text-red-700 hover:bg-red-100"}`}>
                            <span>{INR(r.total_deductions)}</span>
                            {isExpDed ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                          </button>
                        </td>

                        {/* Net Pay */}
                        <td className="px-2 text-right font-mono font-bold text-blue-800 bg-blue-100">
                          {INR(r.net_pay)}
                        </td>
                        {/* Auth NPS */}
                        <td className="px-2 text-right font-mono text-purple-700 bg-purple-50">
                          {INR(r.employer_nps)}
                        </td>
                      </tr>

                      {/* ── Allowances detail (Master entries, read-only) ── */}
                      {isExpAll && (
                        <tr key={`allow-${r.id}`} className="bg-teal-50 border-b border-teal-200">
                          <td colSpan={11} className="px-4 py-3">
                            <div className="flex flex-wrap gap-4 items-start">
                              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide pt-1">Allowances (Master):</span>
                              {r.allowances.length === 0 ? (
                                <span className="text-xs text-gray-400 italic">No allowances assigned in Allowance Master</span>
                              ) : (
                                r.allowances.map((a, idx) => (
                                  <div key={idx} className="flex flex-col items-center gap-0.5">
                                    <span className="text-[10px] text-teal-600 font-medium">{a.name}</span>
                                    <span className="text-xs font-mono font-bold text-teal-800 bg-white border border-teal-200 rounded px-2 py-0.5">
                                      ₹{INR(a.amount)}
                                    </span>
                                  </div>
                                ))
                              )}
                              <div className="ml-auto flex items-center gap-1 pt-1">
                                <span className="text-[10px] text-teal-600">Total =</span>
                                <span className="text-sm font-bold text-teal-800">₹{INR(r.total_allowances)}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {/* ── Deductions detail (Master entries, read-only) ── */}
                      {isExpDed && (
                        <tr key={`ded-${r.id}`} className="bg-red-50 border-b border-red-200">
                          <td colSpan={11} className="px-4 py-3">
                            <div className="flex flex-wrap gap-4 items-start">
                              <span className="text-[10px] font-bold text-red-700 uppercase tracking-wide pt-1">Deductions (Master):</span>
                              {r.deductions.length === 0 ? (
                                <span className="text-xs text-gray-400 italic">No deductions assigned in Deduction Master</span>
                              ) : (
                                r.deductions.map((d, idx) => (
                                  <div key={idx} className="flex flex-col items-center gap-0.5">
                                    <span className="text-[10px] text-red-600 font-medium">{d.name}</span>
                                    <span className="text-xs font-mono font-bold text-red-800 bg-white border border-red-200 rounded px-2 py-0.5">
                                      ₹{INR(d.amount)}
                                    </span>
                                  </div>
                                ))
                              )}
                              <div className="ml-auto flex items-center gap-1 pt-1">
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

              {/* ── Totals footer ── */}
              <tfoot>
                <tr className="bg-gray-800 text-white font-bold text-xs">
                  <td className="sticky left-0 z-10 bg-gray-800 px-3 py-2.5 text-left">TOTAL ({rows.length})</td>
                  <td></td>
                  <td className="px-2 text-right">{INR(rows.reduce((s,r)=>s+r.e_basic_pay,0))}</td>
                  <td></td>
                  <td className="px-2 text-right">{INR(rows.reduce((s,r)=>s+r.basic_pay,0))}</td>
                  <td className="px-2 text-right">{INR(rows.reduce((s,r)=>s+r.da,0))}</td>
                  <td className="px-2 text-right">{INR(rows.reduce((s,r)=>s+r.total_allowances,0))}</td>
                  <td className="px-2 text-right">{INR(totals.gross)}</td>
                  <td className="px-2 text-right">{INR(totals.ded)}</td>
                  <td className="px-2 text-right">{INR(totals.net)}</td>
                  <td className="px-2 text-right">{INR(totals.nps)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ── Summary bar ── */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Gross Total",       val: totals.gross, color: "text-green-700  bg-green-50  border-green-200" },
              { label: "Total Deductions",  val: totals.ded,   color: "text-red-700    bg-red-50    border-red-200"   },
              { label: "Net Payable",       val: totals.net,   color: "text-blue-700   bg-blue-50   border-blue-200"  },
              { label: "Auth. NPS",         val: totals.nps,   color: "text-purple-700 bg-purple-50 border-purple-200"},
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
