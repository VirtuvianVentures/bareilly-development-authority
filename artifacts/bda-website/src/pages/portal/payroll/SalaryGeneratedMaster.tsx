import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, Trash2, RefreshCw, Search, AlertTriangle, HardDrive,
  CheckSquare, Square, XSquare, History, List, Clock, Eye, Printer,
} from "lucide-react";
import { SalarySlipModal } from "./SalarySlipModal";
import { printSalarySlip } from "./salarySlipPrint";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

interface Row {
  id:              number;
  emp_code:        string;
  emp_name:        string;
  e_name?:         string;
  e_code?:         string;
  emp_designation: string;
  department:      string;
  paybill_group:   string;
  month:           number;
  year:            number;
  basic_pay:       string;
  da:              string;
  gross_pay:       string;
  total_deductions:string;
  net_pay:         string;
  status:          string;
  created_at:      string;
  deleted_at?:     string;
}

const STATUS_COLOR: Record<string, string> = {
  draft:     "bg-yellow-100 text-yellow-700",
  generated: "bg-blue-100   text-blue-700",
  processed: "bg-green-100  text-green-700",
  approved:  "bg-emerald-100 text-emerald-700",
  deleted:   "bg-red-100    text-red-700",
};

function displayName(r: Row) { return r.e_name || r.emp_name || "—"; }
function displayCode(r: Row) { return r.e_code || r.emp_code || "—"; }
const INR = (v: any) => Number(v).toLocaleString("en-IN");
const fmtDate = (s?: string) => {
  if (!s) return "—";
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
    + " " + d.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
};

/* ─────────────────────────────────────────────────────── */
/*  Shared filter bar                                      */
/* ─────────────────────────────────────────────────────── */
function FilterBar({
  filterBy, setFilterBy, dept, setDept, grp, setGrp,
  month, setMonth, year, setYear, depts, groups,
  loading, onLoad, search, setSearch,
}: any) {
  const now = new Date();
  const years = Array.from({length:5},(_,i)=>now.getFullYear()-1+i);
  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Filter by</label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
          {(["dept","group"] as const).map(f => (
            <button key={f} onClick={() => setFilterBy(f)}
              className={`px-3 py-1.5 transition-colors ${filterBy===f
                ? "bg-blue-700 text-white font-semibold"
                : "bg-white text-gray-600 hover:bg-gray-50"}`}>
              {f === "dept" ? "Department" : "PayBill Group"}
            </button>
          ))}
        </div>
      </div>

      {filterBy === "dept" && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Department</label>
          <select value={dept} onChange={e => setDept(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white font-semibold focus:outline-none focus:border-blue-400 min-w-[160px]">
            <option value="ALL">— All Departments —</option>
            {depts.map((d: string) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {filterBy === "group" && (
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">PayBill Group</label>
          <select value={grp} onChange={e => setGrp(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white font-semibold focus:outline-none focus:border-blue-400 min-w-[160px]">
            {groups.length === 0
              ? <option value="">— No groups —</option>
              : groups.map((g: string) => <option key={g} value={g}>{g}</option>)
            }
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Month</label>
        <select value={month} onChange={e => setMonth(Number(e.target.value))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white font-semibold focus:outline-none focus:border-blue-400">
          <option value={0}>— All Months —</option>
          {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Year</label>
        <select value={year} onChange={e => setYear(Number(e.target.value))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white font-semibold focus:outline-none focus:border-blue-400">
          {years.map(y=><option key={y}>{y}</option>)}
        </select>
      </div>

      <Button onClick={onLoad} disabled={loading} className="bg-blue-700 hover:bg-blue-800 gap-2 self-end">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Load
      </Button>

      <div className="relative self-end ml-auto">
        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search name, code, dept…"
          className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 w-52 bg-white" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Main component                                         */
/* ─────────────────────────────────────────────────────── */
export default function SalaryGeneratedMaster() {
  const now = new Date();
  const [tab,       setTab]       = useState<"active"|"deleted">("active");

  /* shared filter state */
  const [depts,     setDepts]     = useState<string[]>([]);
  const [groups,    setGroups]    = useState<string[]>([]);
  const [month,     setMonth]     = useState(0);
  const [year,      setYear]      = useState(now.getFullYear());
  const [dept,      setDept]      = useState("ALL");
  const [grp,       setGrp]       = useState("");
  const [filterBy,  setFilterBy]  = useState<"dept"|"group">("dept");
  const [search,    setSearch]    = useState("");

  /* active tab state */
  const [rows,       setRows]       = useState<Row[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [hasLoaded,  setHasLoaded]  = useState(false);
  const [selected,   setSelected]   = useState<Set<number>>(new Set());
  const [deleting,   setDeleting]   = useState(false);

  /* deleted tab state */
  const [delRows,    setDelRows]    = useState<Row[]>([]);
  const [delLoading, setDelLoading] = useState(false);
  const [delLoaded,  setDelLoaded]  = useState(false);

  /* salary slip modal + print */
  const [viewId,      setViewId]      = useState<number | null>(null);
  const [printQueue,  setPrintQueue]  = useState<Set<number>>(new Set());

  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      apiFetch("/payroll-masters/branches").then(r => r.json()),
      apiFetch("/payroll-masters/paybill-groups").then(r => r.json()),
    ]).then(([b, g]: [any[], any[]]) => {
      setDepts(b.filter(i => i.status === "active").map(i => i.name));
      setGroups(g.filter(i => i.status === "active").map(i => i.name));
    }).catch(() => {});
  }, []);

  /* ── build query params ── */
  const buildParams = () => {
    const p = new URLSearchParams({ year: String(year) });
    if (month > 0) p.set("month", String(month));
    if (filterBy === "group" && grp) p.set("group", grp);
    else if (dept !== "ALL") p.set("dept", dept);
    return p;
  };

  /* ── load active records ── */
  const load = async () => {
    setLoading(true); setSelected(new Set()); setHasLoaded(false);
    try {
      const r = await apiFetch(`/salary-sheets/all?${buildParams()}`);
      const data: Row[] = await r.json();
      setRows(data);
      setHasLoaded(true);
    } catch (e: any) { toast({ title: "Error: " + e.message, variant: "destructive" }); }
    finally { setLoading(false); }
  };

  /* ── load deleted records ── */
  const loadDeleted = async () => {
    setDelLoading(true); setDelLoaded(false);
    try {
      const r = await apiFetch(`/salary-sheets/deleted?${buildParams()}`);
      const data: Row[] = await r.json();
      setDelRows(data);
      setDelLoaded(true);
    } catch (e: any) { toast({ title: "Error: " + e.message, variant: "destructive" }); }
    finally { setDelLoading(false); }
  };

  const handleLoad = () => {
    if (tab === "active") load();
    else loadDeleted();
  };

  /* ── selection helpers ── */
  const allIds  = rows.map(r => r.id);
  const allSel  = allIds.length > 0 && allIds.every(id => selected.has(id));
  const someSel = selected.size > 0 && !allSel;

  const toggleAll = () => setSelected(allSel ? new Set() : new Set(allIds));
  const toggleRow = (id: number) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  /* ── delete ── */
  const deleteSelected = async () => {
    if (!selected.size) return;
    if (!window.confirm(`Are you sure you want to delete ${selected.size} salary record(s)?\nThey will appear in Deleted History and can be regenerated.`)) return;
    setDeleting(true);
    try {
      await apiFetch("/salary-sheets/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ ids: [...selected] }),
      });
      toast({ title: `${selected.size} record(s) moved to Deleted History.` });
      setSelected(new Set());
      load();
    } catch { toast({ title: "Error deleting records", variant: "destructive" }); }
    finally { setDeleting(false); }
  };

  const deleteSingle = async (id: number, name: string) => {
    if (!window.confirm(`Delete salary record for ${name}?\nIt will appear in Deleted History and can be regenerated.`)) return;
    try {
      await apiFetch(`/salary-sheets/${id}`, { method: "DELETE" });
      toast({ title: `Record moved to Deleted History.` });
      load();
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  /* ── search filter ── */
  const filterSearch = (list: Row[]) => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(r =>
      displayName(r).toLowerCase().includes(q) ||
      displayCode(r).toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q) ||
      r.paybill_group?.toLowerCase().includes(q)
    );
  };

  const visible    = filterSearch(rows);
  const visibleDel = filterSearch(delRows);

  /* ── common table header ── */
  const TH = ({ children, className="" }: { children?: React.ReactNode; className?: string }) => (
    <th className={`px-2 py-2.5 ${className}`}>{children}</th>
  );

  return (
    <PayrollLayout title="Salary Generated Master">

      {/* ── Tab switcher ── */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        <button
          onClick={() => setTab("active")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            tab === "active"
              ? "border-blue-700 text-blue-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
          <List className="h-4 w-4" />
          Active Records
          {rows.length > 0 && (
            <span className="ml-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {rows.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("deleted")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
            tab === "deleted"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
          <History className="h-4 w-4" />
          Deleted History
          {delRows.length > 0 && (
            <span className="ml-1 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {delRows.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Shared filter bar ── */}
      <FilterBar
        filterBy={filterBy} setFilterBy={setFilterBy}
        dept={dept} setDept={setDept}
        grp={grp} setGrp={setGrp}
        month={month} setMonth={setMonth}
        year={year} setYear={setYear}
        depts={depts} groups={groups}
        loading={tab === "active" ? loading : delLoading}
        onLoad={handleLoad}
        search={search} setSearch={setSearch}
      />

      {/* ══════════════════════════════════════════════════ */}
      {/* ACTIVE RECORDS TAB                                */}
      {/* ══════════════════════════════════════════════════ */}
      {tab === "active" && (
        <>
          {/* ── Bulk actions bar ── */}
          {visible.length > 0 && (
            <div className="flex items-center gap-4 mb-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
              <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900">
                {allSel ? <CheckSquare className="h-4 w-4 text-blue-600" />
                  : someSel ? <XSquare className="h-4 w-4 text-blue-400" />
                  : <Square className="h-4 w-4" />}
                {allSel ? "Deselect All" : "Select All"}
              </button>
              <span className="text-xs text-gray-500">{selected.size} selected</span>
              {selected.size > 0 && (
                <Button onClick={deleteSelected} disabled={deleting}
                  variant="destructive" className="h-7 text-xs gap-1.5">
                  {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete Selected ({selected.size})
                </Button>
              )}
              <div className="ml-auto flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                <AlertTriangle className="h-3.5 w-3.5" />
                Deleted records will appear in Deleted History
              </div>
            </div>
          )}

          {/* ── Empty / Not-found states ── */}
          {!loading && !hasLoaded && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <HardDrive className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-base font-semibold">Select filters and click <span className="text-blue-600">Load</span></p>
              <p className="text-xs mt-1">Shows all generated salary records</p>
            </div>
          )}

          {!loading && hasLoaded && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/40">
              <AlertTriangle className="h-10 w-10 mb-3 text-orange-400" />
              <p className="text-base font-semibold text-orange-700">Salary Not Generated</p>
              <p className="text-sm mt-1 text-orange-600">
                No salary records found for the selected {month > 0 ? `month/year` : `year`} and filter.
              </p>
              <p className="text-xs mt-2 text-gray-500">
                Use <span className="font-semibold text-blue-600">Generate Salary</span> to generate salary for this period.
              </p>
            </div>
          )}

          {!loading && hasLoaded && rows.length > 0 && visible.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-gray-50">
              <Search className="h-9 w-9 mb-3 text-gray-300" />
              <p className="text-base font-semibold text-gray-600">No matching records</p>
              <p className="text-sm mt-1 text-gray-400">No employee found for "<span className="font-medium">{search}</span>"</p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          )}

          {/* ── Active table ── */}
          {!loading && visible.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="text-xs border-collapse w-full">
                <thead>
                  <tr className="bg-[#1a3a6e] text-white">
                    <TH className="w-8">
                      <button onClick={toggleAll}>
                        {allSel
                          ? <CheckSquare className="h-3.5 w-3.5 text-white" />
                          : <Square className="h-3.5 w-3.5 text-white/60" />}
                      </button>
                    </TH>
                    <TH className="text-center w-10">#</TH>
                    <TH className="sticky left-0 z-10 bg-[#1a3a6e] text-left min-w-[170px]">Name / Code</TH>
                    <TH className="text-left min-w-[120px]">Department</TH>
                    <TH className="text-center">Month</TH>
                    <TH className="text-center">Year</TH>
                    <TH className="text-right bg-green-800 min-w-[85px]">Basic Pay</TH>
                    <TH className="text-right bg-green-700 min-w-[72px]">DA</TH>
                    <TH className="text-right bg-emerald-600 min-w-[85px]">Allowances</TH>
                    <TH className="text-right bg-green-600 min-w-[80px]">Gross</TH>
                    <TH className="text-right bg-red-700 min-w-[80px]">Deductions</TH>
                    <TH className="text-right bg-blue-700 min-w-[80px]">Net Pay</TH>
                    <TH className="text-center min-w-[90px]">Status</TH>
                    <TH className="text-center min-w-[110px]">Actions</TH>
                    <TH className="text-center w-14">Delete</TH>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r, i) => {
                    const isSel = selected.has(r.id);
                    const rowBg = isSel ? "bg-blue-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50";
                    const name  = displayName(r);
                    const code  = displayCode(r);
                    return (
                      <tr key={r.id} className={`border-b border-gray-100 ${rowBg} hover:bg-blue-50/30`}>
                        <td className="px-2 text-center">
                          <button onClick={() => toggleRow(r.id)}>
                            {isSel
                              ? <CheckSquare className="h-3.5 w-3.5 text-blue-600" />
                              : <Square className="h-3.5 w-3.5 text-gray-300" />}
                          </button>
                        </td>
                        <td className="px-2 text-center text-gray-400">{i+1}</td>
                        <td className={`sticky left-0 z-10 px-3 py-1.5 ${rowBg}`}>
                          <div className="font-semibold text-gray-800 truncate max-w-[165px]" title={name}>{name}</div>
                          <div className="text-[10px] text-gray-400">{code}</div>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="text-gray-700 truncate max-w-[115px]" title={r.department}>{r.department || "—"}</div>
                          {r.paybill_group && <div className="text-[10px] text-purple-500">{r.paybill_group}</div>}
                        </td>
                        <td className="px-2 text-center font-medium">{MONTHS[r.month-1]}</td>
                        <td className="px-2 text-center font-medium">{r.year}</td>
                        <td className="px-2 text-right font-mono bg-green-50">{INR(r.basic_pay)}</td>
                        <td className="px-2 text-right font-mono text-green-700">{INR(r.da)}</td>
                        <td className="px-2 text-right font-mono text-emerald-700 bg-emerald-50">{INR(Number(r.gross_pay) - Number(r.basic_pay) - Number(r.da))}</td>
                        <td className="px-2 text-right font-mono font-semibold text-green-800 bg-green-50">{INR(r.gross_pay)}</td>
                        <td className="px-2 text-right font-mono text-red-700">{INR(r.total_deductions)}</td>
                        <td className="px-2 text-right font-mono font-bold text-blue-800 bg-blue-50">{INR(r.net_pay)}</td>
                        <td className="px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize
                            ${STATUS_COLOR[r.status] || "bg-gray-100 text-gray-600"}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setViewId(r.id)}
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-[10px] font-medium"
                              title="View salary slip">
                              <Eye className="h-3 w-3" /> View
                            </button>
                            <button onClick={async () => {
                              setPrintQueue(q => new Set(q).add(r.id));
                              try {
                                const rec = await apiFetch(`/salary-sheets/${r.id}`).then(x => x.json());
                                printSalarySlip(rec);
                              } catch { /* ignore */ }
                              finally { setPrintQueue(q => { const s = new Set(q); s.delete(r.id); return s; }); }
                            }}
                              disabled={printQueue.has(r.id)}
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-[10px] font-medium disabled:opacity-60"
                              title="Print salary slip">
                              {printQueue.has(r.id) ? <Loader2 className="h-3 w-3 animate-spin" /> : <Printer className="h-3 w-3" />}
                              Print
                            </button>
                          </div>
                        </td>
                        <td className="px-2 text-center">
                          <button onClick={() => deleteSingle(r.id, name)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title={`Delete record for ${name}`}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-800 text-white font-bold text-xs">
                    <td colSpan={2}></td>
                    <td className="sticky left-0 z-10 bg-gray-800 px-3 py-2.5">{visible.length} records</td>
                    <td></td><td></td><td></td>
                    <td className="px-2 text-right">{INR(visible.reduce((s,r)=>s+Number(r.basic_pay),0))}</td>
                    <td className="px-2 text-right">{INR(visible.reduce((s,r)=>s+Number(r.da),0))}</td>
                    <td className="px-2 text-right">{INR(visible.reduce((s,r)=>s+Number(r.gross_pay)-Number(r.basic_pay)-Number(r.da),0))}</td>
                    <td className="px-2 text-right">{INR(visible.reduce((s,r)=>s+Number(r.gross_pay),0))}</td>
                    <td className="px-2 text-right">{INR(visible.reduce((s,r)=>s+Number(r.total_deductions),0))}</td>
                    <td className="px-2 text-right">{INR(visible.reduce((s,r)=>s+Number(r.net_pay),0))}</td>
                    <td></td><td></td><td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════ */}
      {/* DELETED HISTORY TAB                               */}
      {/* ══════════════════════════════════════════════════ */}
      {tab === "deleted" && (
        <>
          {/* info banner */}
          <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-red-50 rounded-lg border border-red-200 text-xs text-red-700">
            <History className="h-4 w-4 shrink-0" />
            <span>
              These records were deleted from Active Records. They are <strong>not included</strong> in salary
              reports. Deleted records can be regenerated by using the Generate Salary option.
            </span>
          </div>

          {/* ── Empty / not-found states ── */}
          {!delLoading && !delLoaded && delRows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <History className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-base font-semibold">Select filters and click <span className="text-blue-600">Load</span></p>
              <p className="text-xs mt-1">View deletion history for selected period</p>
            </div>
          )}

          {!delLoading && delLoaded && delRows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60">
              <History className="h-10 w-10 mb-3 text-gray-300" />
              <p className="text-base font-semibold text-gray-600">No Deleted Records</p>
              <p className="text-sm mt-1 text-gray-400">No records were deleted for the selected period and filter.</p>
            </div>
          )}

          {!delLoading && delLoaded && delRows.length > 0 && visibleDel.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-gray-200 bg-gray-50">
              <Search className="h-9 w-9 mb-3 text-gray-300" />
              <p className="text-base font-semibold text-gray-600">No matching records</p>
              <p className="text-sm mt-1 text-gray-400">No employee found for "<span className="font-medium">{search}</span>"</p>
            </div>
          )}

          {delLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-red-400" />
            </div>
          )}

          {/* ── Deleted history table ── */}
          {!delLoading && visibleDel.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-red-200 shadow-sm">
              <table className="text-xs border-collapse w-full">
                <thead>
                  <tr className="bg-red-800 text-white">
                    <TH className="text-center w-10">#</TH>
                    <TH className="sticky left-0 z-10 bg-red-800 text-left min-w-[170px]">Name / Code</TH>
                    <TH className="text-left min-w-[120px]">Department</TH>
                    <TH className="text-center">Month</TH>
                    <TH className="text-center">Year</TH>
                    <TH className="text-right bg-green-800 min-w-[85px]">Basic Pay</TH>
                    <TH className="text-right bg-green-700 min-w-[72px]">DA</TH>
                    <TH className="text-right bg-emerald-600 min-w-[85px]">Allowances</TH>
                    <TH className="text-right bg-green-600 min-w-[80px]">Gross</TH>
                    <TH className="text-right bg-red-700 min-w-[80px]">Deductions</TH>
                    <TH className="text-right bg-blue-700 min-w-[80px]">Net Pay</TH>
                    <TH className="text-center min-w-[90px]">Prev Status</TH>
                    <TH className="text-left min-w-[150px]">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Deleted On</span>
                    </TH>
                  </tr>
                </thead>
                <tbody>
                  {visibleDel.map((r, i) => {
                    const rowBg = i % 2 === 0 ? "bg-white" : "bg-red-50/40";
                    const name  = displayName(r);
                    const code  = displayCode(r);
                    return (
                      <tr key={r.id} className={`border-b border-red-100 ${rowBg} hover:bg-red-50/60`}>
                        <td className="px-2 text-center text-gray-400">{i+1}</td>
                        <td className={`sticky left-0 z-10 px-3 py-1.5 ${rowBg}`}>
                          <div className="font-semibold text-gray-700 truncate max-w-[165px]" title={name}>{name}</div>
                          <div className="text-[10px] text-gray-400">{code}</div>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="text-gray-600 truncate max-w-[115px]" title={r.department}>{r.department || "—"}</div>
                          {r.paybill_group && <div className="text-[10px] text-purple-500">{r.paybill_group}</div>}
                        </td>
                        <td className="px-2 text-center font-medium text-gray-600">{MONTHS[r.month-1]}</td>
                        <td className="px-2 text-center font-medium text-gray-600">{r.year}</td>
                        <td className="px-2 text-right font-mono text-gray-500 bg-green-50/60">{INR(r.basic_pay)}</td>
                        <td className="px-2 text-right font-mono text-gray-500">{INR(r.da)}</td>
                        <td className="px-2 text-right font-mono text-emerald-600 bg-emerald-50/60">{INR(Number(r.gross_pay) - Number(r.basic_pay) - Number(r.da))}</td>
                        <td className="px-2 text-right font-mono text-gray-600 bg-green-50/60">{INR(r.gross_pay)}</td>
                        <td className="px-2 text-right font-mono text-red-500">{INR(r.total_deductions)}</td>
                        <td className="px-2 text-right font-mono font-semibold text-blue-700 bg-blue-50/60">{INR(r.net_pay)}</td>
                        <td className="px-2 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">
                            deleted
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-gray-500 whitespace-nowrap">
                          {fmtDate(r.deleted_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-700 text-white font-bold text-xs">
                    <td></td>
                    <td className="sticky left-0 z-10 bg-gray-700 px-3 py-2.5">{visibleDel.length} deleted records</td>
                    <td></td><td></td><td></td>
                    <td className="px-2 text-right">{INR(visibleDel.reduce((s,r)=>s+Number(r.basic_pay),0))}</td>
                    <td className="px-2 text-right">{INR(visibleDel.reduce((s,r)=>s+Number(r.da),0))}</td>
                    <td className="px-2 text-right">{INR(visibleDel.reduce((s,r)=>s+Number(r.gross_pay)-Number(r.basic_pay)-Number(r.da),0))}</td>
                    <td className="px-2 text-right">{INR(visibleDel.reduce((s,r)=>s+Number(r.gross_pay),0))}</td>
                    <td className="px-2 text-right">{INR(visibleDel.reduce((s,r)=>s+Number(r.total_deductions),0))}</td>
                    <td className="px-2 text-right">{INR(visibleDel.reduce((s,r)=>s+Number(r.net_pay),0))}</td>
                    <td></td><td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </>
      )}
      <SalarySlipModal recordId={viewId} onClose={() => setViewId(null)} />
    </PayrollLayout>
  );
}
