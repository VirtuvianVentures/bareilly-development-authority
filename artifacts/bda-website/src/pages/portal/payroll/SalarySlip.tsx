import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Eye, Printer, FileText, RefreshCw } from "lucide-react";
import { SalarySlipModal } from "./SalarySlipModal";
import { printSalarySlip } from "./salarySlipPrint";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const INR = (v: string | number | null | undefined) => {
  const n = Number(v ?? 0);
  if (n === 0) return "₹ 0.00";
  return "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
};

interface Row {
  id: number;
  employee_id: number;
  emp_code: string; emp_name: string;
  e_name?: string; e_code?: string;
  emp_designation: string; department: string;
  paybill_group: string;
  month: number; year: number;
  basic_pay: string; da: string; gross_pay: string;
  total_deductions: string; net_pay: string;
  status: string;
}

const STATUS_COLOR: Record<string, string> = {
  processed: "bg-blue-100 text-blue-700",
  paid:       "bg-green-100 text-green-700",
  draft:      "bg-gray-100 text-gray-600",
  revised:    "bg-amber-100 text-amber-700",
};

export default function SalarySlip() {
  const { toast } = useToast();
  const now = new Date();
  const [month, setMonth]     = useState(now.getMonth() + 1);
  const [year, setYear]       = useState(now.getFullYear());
  const [filterType, setFilterType] = useState<"dept" | "group">("group");
  const [filterVal, setFilterVal]   = useState("");
  const [groups, setGroups]   = useState<string[]>([]);
  const [depts, setDepts]     = useState<string[]>([]);
  const [rows, setRows]       = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewId, setViewId]   = useState<number | null>(null);
  const [printQueue, setPrintQueue] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([
      apiFetch("/payroll-masters/paybill-groups"),
      apiFetch("/payroll-masters/branches"),
    ]).then(([g, b]) => {
      setGroups(Array.isArray(g) ? g.map((x: any) => x.name || x) : []);
      setDepts(Array.isArray(b) ? b.map((x: any) => x.name || x) : []);
    }).catch(() => {});
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ month: String(month), year: String(year) });
      if (filterVal) {
        if (filterType === "group") params.set("group", filterVal);
        else params.set("dept", filterVal);
      }
      const data = await apiFetch(`/salary-sheets/all?${params}`).then(r => r.json());
      setRows(Array.isArray(data) ? data : []);
    } catch (e: any) {
      toast({ title: "Load Failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintSingle = async (id: number) => {
    try {
      setPrintQueue(q => [...q, id]);
      const rec = await apiFetch(`/salary-sheets/${id}`).then(r => r.json());
      printSalarySlip(rec);
    } catch (e: any) {
      toast({ title: "Print Failed", description: e.message, variant: "destructive" });
    } finally {
      setPrintQueue(q => q.filter(x => x !== id));
    }
  };

  const handlePrintAll = async () => {
    if (rows.length === 0) return;
    toast({ title: "Preparing All Slips…", description: `Loading ${rows.length} salary slips for printing.` });
    for (const r of rows) {
      try {
        const rec = await apiFetch(`/salary-sheets/${r.id}`).then(x => x.json());
        printSalarySlip(rec);
        await new Promise(res => setTimeout(res, 800));
      } catch { /* continue */ }
    }
  };

  const years = Array.from({ length: 8 }, (_, i) => now.getFullYear() - i);
  const options = filterType === "group" ? groups : depts;

  return (
    <PayrollLayout title="Salary Slip">
      <div className="flex flex-col h-full min-h-0 bg-gray-50">
        <div className="bg-white border-b px-5 py-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-[#1a4b8e]" />
            <h1 className="text-base font-bold text-gray-800">Salary Slip</h1>
          </div>
          <p className="text-xs text-gray-500">View and print individual employee salary slips.</p>
        </div>

        <div className="bg-white border-b px-5 py-3 flex-shrink-0">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Month</label>
              <select value={month} onChange={e => setMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Year</label>
              <select value={year} onChange={e => setYear(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Filter By</label>
              <select value={filterType} onChange={e => { setFilterType(e.target.value as "dept"|"group"); setFilterVal(""); }}
                className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="group">PayBill Group</option>
                <option value="dept">Department / Branch</option>
              </select>
            </div>
            {options.length > 0 && (
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                  {filterType === "group" ? "PayBill Group" : "Branch"}
                </label>
                <select value={filterVal} onChange={e => setFilterVal(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[160px]">
                  <option value="">— All —</option>
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            )}
            <Button size="sm" onClick={load} disabled={loading}
              className="bg-[#1a4b8e] hover:bg-[#153d72] text-white h-8 px-4 text-xs">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Search className="h-3.5 w-3.5 mr-1" />}
              Load Slips
            </Button>
            {rows.length > 0 && (
              <Button size="sm" variant="outline" onClick={handlePrintAll}
                className="h-8 px-3 text-xs border-blue-300 text-blue-700 hover:bg-blue-50">
                <Printer className="h-3.5 w-3.5 mr-1" /> Print All ({rows.length})
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {!loading && rows.length === 0 && (
            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">No salary records loaded</p>
              <p className="text-xs mt-1">Select month, year and filter, then click Load Slips.</p>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading…
            </div>
          )}
          {!loading && rows.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-500 font-medium">
                {rows.length} record{rows.length !== 1 ? "s" : ""} — {MONTHS[month-1]} {year}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#1a4b8e] text-white">
                      <th className="px-2 py-2 text-center w-8">#</th>
                      <th className="px-3 py-2 text-left min-w-[160px]">Employee</th>
                      <th className="px-3 py-2 text-left min-w-[120px]">Department</th>
                      <th className="px-3 py-2 text-left min-w-[100px]">PayBill Group</th>
                      <th className="px-3 py-2 text-right min-w-[90px]">Gross Pay</th>
                      <th className="px-3 py-2 text-right min-w-[90px]">Deductions</th>
                      <th className="px-3 py-2 text-right min-w-[90px] bg-blue-700">Net Pay</th>
                      <th className="px-3 py-2 text-center min-w-[70px]">Status</th>
                      <th className="px-3 py-2 text-center min-w-[120px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const name = r.e_name || r.emp_name || "—";
                      const code = r.e_code || r.emp_code || "—";
                      const printing = printQueue.includes(r.id);
                      return (
                        <tr key={r.id} className={`border-b border-gray-100 ${i%2===0?"bg-white":"bg-gray-50"} hover:bg-blue-50/30`}>
                          <td className="px-2 text-center text-gray-400">{i+1}</td>
                          <td className="px-3 py-2">
                            <div className="font-semibold text-gray-800 truncate max-w-[155px]" title={name}>{name}</div>
                            <div className="text-[10px] text-gray-400">{code} {r.emp_designation ? `· ${r.emp_designation}` : ""}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-700 truncate max-w-[120px]">{r.department || "—"}</td>
                          <td className="px-3 py-2 text-purple-600 text-[11px]">{r.paybill_group || "—"}</td>
                          <td className="px-3 py-2 text-right font-mono text-green-700">{INR(r.gross_pay)}</td>
                          <td className="px-3 py-2 text-right font-mono text-red-600">{INR(r.total_deductions)}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-blue-800 bg-blue-50">{INR(r.net_pay)}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLOR[r.status] || "bg-gray-100 text-gray-600"}`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => setViewId(r.id)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-[10px] font-medium"
                                title="View salary slip">
                                <Eye className="h-3 w-3" /> View
                              </button>
                              <button onClick={() => handlePrintSingle(r.id)} disabled={printing}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-[10px] font-medium disabled:opacity-60"
                                title="Print salary slip">
                                {printing
                                  ? <Loader2 className="h-3 w-3 animate-spin" />
                                  : <Printer className="h-3 w-3" />}
                                Print
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-800 text-white font-bold text-xs">
                      <td colSpan={4} className="px-3 py-2">{rows.length} employees</td>
                      <td className="px-3 py-2 text-right font-mono">{INR(rows.reduce((s,r)=>s+Number(r.gross_pay),0))}</td>
                      <td className="px-3 py-2 text-right font-mono">{INR(rows.reduce((s,r)=>s+Number(r.total_deductions),0))}</td>
                      <td className="px-3 py-2 text-right font-mono">{INR(rows.reduce((s,r)=>s+Number(r.net_pay),0))}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <SalarySlipModal recordId={viewId} onClose={() => setViewId(null)} />
    </PayrollLayout>
  );
}
