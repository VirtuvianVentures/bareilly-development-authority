import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, FileText, Search, Printer, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PolicyRow {
  id: number;
  policy_no: string;
  premium_amount: string;
  entry_date: string;
  remarks: string;
}
interface EmpReport {
  employee_id: number;
  emp_code: string;
  emp_name: string;
  policy_count: string;
  total_premium: string;
  policies: PolicyRow[];
}

export default function LICReport() {
  const [data, setData] = useState<EmpReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/lic-report");
      setData(await r.json());
    } catch {
      toast({ title: "Failed to load report", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = (id: number) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const filtered = data.filter(d =>
    d.emp_name.toLowerCase().includes(search.toLowerCase()) ||
    (d.emp_code || "").toLowerCase().includes(search.toLowerCase())
  );

  const grandTotal = filtered.reduce((s, d) => s + Number(d.total_premium), 0);
  const totalPolicies = filtered.reduce((s, d) => s + Number(d.policy_count), 0);

  const handlePrint = () => window.print();

  return (
    <PayrollLayout title="LIC Report">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" /> LIC Report
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Employee-wise LIC policy and premium summary
            </p>
          </div>
          <Button variant="outline" onClick={handlePrint} className="gap-2 print:hidden">
            <Printer className="h-4 w-4" /> Print / PDF
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4 print:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by employee name or code..."
            className="pl-9 border-gray-300"
          />
        </div>

        {/* Summary Cards */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-600 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{filtered.length}</div>
              <div className="text-xs text-blue-100 mt-1">Employees</div>
            </div>
            <div className="bg-[#1a3a6e] text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{totalPolicies}</div>
              <div className="text-xs text-blue-100 mt-1">Total Policies</div>
            </div>
            <div className="bg-green-700 text-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">₹{grandTotal.toLocaleString("en-IN")}</div>
              <div className="text-xs text-green-100 mt-1">Total Premium</div>
            </div>
          </div>
        )}

        {/* Report Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Print Header */}
          <div className="hidden print:block text-center py-4 border-b">
            <div className="text-lg font-bold">BAREILLY DEVELOPMENT AUTHORITY</div>
            <div className="text-base font-semibold mt-1">Employee-wise LIC Report</div>
            <div className="text-sm text-gray-500 mt-1">
              Total Employees: {filtered.length} | Total Policies: {totalPolicies} | Total Premium: ₹{grandTotal.toLocaleString("en-IN")}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {search ? "No employee found" : "No LIC entries found"}
              </p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-[#1a3a6e] grid grid-cols-12 px-4 py-3 text-white text-xs font-semibold uppercase tracking-wide">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Employee</div>
                <div className="col-span-2 text-center">Policies</div>
                <div className="col-span-3 text-right">Total Premium (₹)</div>
                <div className="col-span-2 text-center">Details</div>
              </div>

              {filtered.map((emp, idx) => (
                <div key={emp.employee_id} className="border-b border-gray-100 last:border-0">
                  {/* Employee Row */}
                  <div
                    className={`grid grid-cols-12 px-4 py-3 items-center cursor-pointer transition-colors
                      ${expanded[emp.employee_id] ? "bg-blue-50" : "hover:bg-gray-50"}`}
                    onClick={() => toggle(emp.employee_id)}
                  >
                    <div className="col-span-1 text-gray-500 text-sm">{idx + 1}</div>
                    <div className="col-span-4">
                      <div className="font-semibold text-gray-800 text-sm">{emp.emp_name}</div>
                      {emp.emp_code && <div className="text-xs text-gray-400">{emp.emp_code}</div>}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {emp.policy_count}
                      </span>
                    </div>
                    <div className="col-span-3 text-right font-semibold text-gray-800 text-sm">
                      {Number(emp.total_premium).toLocaleString("en-IN")}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`text-xs px-2 py-1 rounded font-medium transition-colors
                        ${expanded[emp.employee_id]
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"}`}>
                        {expanded[emp.employee_id] ? "▲ Close" : "▼ View"}
                      </span>
                    </div>
                  </div>

                  {/* Policies Detail */}
                  {expanded[emp.employee_id] && (
                    <div className="bg-blue-50/70 px-6 pb-3 pt-1">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="text-gray-600 font-semibold border-b border-blue-200">
                            <th className="pb-2 pt-1 text-left pl-2">#</th>
                            <th className="pb-2 pt-1 text-left">Policy No.</th>
                            <th className="pb-2 pt-1 text-right">Premium (₹)</th>
                            <th className="pb-2 pt-1 text-center">Entry Date</th>
                            <th className="pb-2 pt-1 text-left">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emp.policies.map((p, i) => (
                            <tr key={p.id} className={i % 2 === 0 ? "bg-white/60" : ""}>
                              <td className="py-1.5 pl-2 text-gray-400">{i + 1}</td>
                              <td className="py-1.5 font-mono text-blue-700 font-semibold">{p.policy_no}</td>
                              <td className="py-1.5 text-right font-semibold text-gray-800">
                                {Number(p.premium_amount).toLocaleString("en-IN")}
                              </td>
                              <td className="py-1.5 text-center text-gray-500">
                                {p.entry_date ? new Date(p.entry_date).toLocaleDateString("en-IN") : "—"}
                              </td>
                              <td className="py-1.5 text-gray-500">{p.remarks || "—"}</td>
                            </tr>
                          ))}
                          <tr className="border-t border-blue-200 font-semibold bg-blue-100/60">
                            <td colSpan={2} className="py-1.5 pl-2 text-blue-800">Total</td>
                            <td className="py-1.5 text-right text-blue-800">
                              {Number(emp.total_premium).toLocaleString("en-IN")}
                            </td>
                            <td colSpan={2} />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

              {/* Grand Total */}
              <div className="bg-[#1a3a6e] grid grid-cols-12 px-4 py-3 text-white text-sm font-bold">
                <div className="col-span-1" />
                <div className="col-span-4">GRAND TOTAL</div>
                <div className="col-span-2 text-center">{totalPolicies}</div>
                <div className="col-span-3 text-right">₹{grandTotal.toLocaleString("en-IN")}</div>
                <div className="col-span-2" />
              </div>
            </>
          )}
        </div>
      </div>
    </PayrollLayout>
  );
}
