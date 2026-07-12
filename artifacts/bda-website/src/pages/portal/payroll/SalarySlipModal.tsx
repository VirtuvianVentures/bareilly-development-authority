import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/adminApi";
import { Loader2, Printer, X } from "lucide-react";
import { MONTHS, SlipRecord, printSalarySlip } from "./salarySlipPrint";

const INR = (v: string | number | null | undefined) => {
  const n = Number(v ?? 0);
  return n === 0 ? "—" : "₹ " + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
};

const AMT = (v: string | number | null | undefined) => {
  const n = Number(v ?? 0);
  return n === 0 ? "—" : n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
};

interface Props {
  recordId: number | null;
  onClose: () => void;
}

export function SalarySlipModal({ recordId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [rec, setRec] = useState<SlipRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!recordId) return;
    setLoading(true); setError(""); setRec(null);
    apiFetch(`/salary-sheets/${recordId}`)
      .then(r => r.json())
      .then(d => setRec(d))
      .catch(e => setError(e.message || "Failed to load record"))
      .finally(() => setLoading(false));
  }, [recordId]);

  if (!recordId) return null;

  const empName = rec ? (rec.e_name || rec.emp_name || "—") : "—";
  const monthStr = rec ? MONTHS[(rec.month ?? 1) - 1] : "";

  // Basic Pay + DA (auto) + ONLY Allowance Master entries
  const earningsRows = rec ? [
    { label: "Basic Pay",               value: rec.basic_pay },
    { label: "Dearness Allowance (DA)", value: rec.da },
    ...(rec.allowances ?? []).map(a => ({ label: a.name, value: a.amount })),
  ].filter(x => Number(x.value ?? 0) !== 0) : [];

  // Only show deductions from Deduction Master (dynamic array)
  const deductionRows = (rec?.deductions ?? [])
    .filter(d => Number(d.amount ?? 0) !== 0)
    .map(d => ({ label: d.name, value: d.amount }));

  const maxRows = Math.max(earningsRows.length, deductionRows.length, 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b bg-[#1a4b8e] rounded-t-xl">
          <div className="text-white">
            <div className="font-bold text-base">Pay Slip</div>
            {rec && <div className="text-xs text-blue-200">{empName} — {monthStr} {rec.year}</div>}
          </div>
          <div className="flex items-center gap-2">
            {rec && (
              <button onClick={() => printSalarySlip(rec)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#1a4b8e] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
            )}
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:bg-white/20 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5">
          {loading && (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />Loading salary slip…
            </div>
          )}
          {error && (
            <div className="text-center py-10 text-red-500">{error}</div>
          )}
          {rec && !loading && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 border-b pb-3">
                <img src="/bda-logo.png" alt="BDA Logo" className="w-14 h-14 object-contain flex-shrink-0" />
                <div className="flex-1 text-center">
                  <div className="font-bold text-lg text-[#1a4b8e] uppercase tracking-wide">Bareilly Development Authority</div>
                  <div className="text-xs text-gray-500">Sector 2, Ramganga Nagar Awasiya Yojna, Bareilly - 243006</div>
                  <div className="mt-2 inline-block bg-[#1a4b8e] text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Pay Slip — {monthStr} {rec.year}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Employee Name</span><span>: {rec.e_name || rec.emp_name || "—"}</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Employee Code</span><span>: {rec.e_code || rec.emp_code || "—"}</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Designation</span><span>: {rec.emp_designation || "—"}</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Department</span><span>: {rec.department || "—"}</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">PayBill Group</span><span>: {rec.paybill_group || "—"}</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Group</span><span>: {rec.emp_group || "—"}</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Pay Level</span><span>: {rec.pay_level || "—"}</span></div>
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Contribution</span><span>: {rec.contribution_type || "—"}</span></div>
                {rec.gpf_no && <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">GPF No.</span><span>: {rec.gpf_no}</span></div>}
                {rec.pran   && <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">PRAN</span><span>: {rec.pran}</span></div>}
                {rec.pan_no && <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">PAN</span><span>: {rec.pan_no}</span></div>}
                <div className="flex gap-2"><span className="font-semibold text-gray-600 w-28">Status</span><span>: <span className="capitalize font-medium text-blue-700">{rec.status}</span></span></div>
              </div>

              {/* ── Summary strip ── */}
              {(() => {
                // Allowances = only Allowance Master entries (exclude Basic Pay and DA)
                const totalAllowances = earningsRows
                  .filter(e => e.label !== "Basic Pay" && e.label !== "Dearness Allowance (DA)")
                  .reduce((s, e) => s + Number(e.value ?? 0), 0);
                const totalDeductions = deductionRows.reduce((s, d) => s + Number(d.value ?? 0), 0);
                return (
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-green-50 border border-green-200 p-2">
                      <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wide">Basic + DA</div>
                      <div className="font-bold text-green-800 text-sm mt-0.5">
                        ₹ {(Number(rec.basic_pay) + Number(rec.da ?? 0)).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2">
                      <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wide">Allowances</div>
                      <div className="font-bold text-emerald-700 text-sm mt-0.5">
                        ₹ {totalAllowances.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="rounded-lg bg-green-100 border border-green-300 p-2">
                      <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wide">Gross Pay</div>
                      <div className="font-bold text-green-900 text-sm mt-0.5">₹ {AMT(rec.gross_pay)}</div>
                    </div>
                    <div className="rounded-lg bg-red-50 border border-red-200 p-2">
                      <div className="text-gray-500 text-[10px] font-semibold uppercase tracking-wide">Deductions</div>
                      <div className="font-bold text-red-700 text-sm mt-0.5">
                        ₹ {totalDeductions.toLocaleString("en-IN")}
                      </div>
                    </div>
                    <div className="rounded-lg bg-blue-700 border border-blue-800 p-2">
                      <div className="text-blue-200 text-[10px] font-semibold uppercase tracking-wide">Net Pay</div>
                      <div className="font-bold text-white text-sm mt-0.5">₹ {AMT(rec.net_pay)}</div>
                    </div>
                  </div>
                );
              })()}

              {/* ── Earnings table ── */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-green-700 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
                  Earnings / Salary Components
                </div>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-green-50 text-gray-700 border-b border-gray-200">
                      <th className="px-3 py-2 text-left font-semibold">#</th>
                      <th className="px-3 py-2 text-left font-semibold">Head</th>
                      <th className="px-3 py-2 text-right font-semibold w-32">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningsRows.map((e, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-3 py-1.5 border-b border-gray-100 text-gray-400 w-8">{i + 1}</td>
                        <td className="px-3 py-1.5 border-b border-gray-100 text-gray-800">{e.label}</td>
                        <td className="px-3 py-1.5 border-b border-gray-100 text-right font-mono text-green-800 font-semibold">{AMT(e.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-green-800 text-white font-bold">
                      <td colSpan={2} className="px-3 py-2">GROSS PAY</td>
                      <td className="px-3 py-2 text-right font-mono">{AMT(rec.gross_pay)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* ── Deductions table ── */}
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-red-700 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide">
                  Deductions
                </div>
                {deductionRows.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-xs">No deductions applied</div>
                ) : (
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-red-50 text-gray-700 border-b border-gray-200">
                        <th className="px-3 py-2 text-left font-semibold">#</th>
                        <th className="px-3 py-2 text-left font-semibold">Head</th>
                        <th className="px-3 py-2 text-right font-semibold w-32">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deductionRows.map((d, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-3 py-1.5 border-b border-gray-100 text-gray-400 w-8">{i + 1}</td>
                          <td className="px-3 py-1.5 border-b border-gray-100 text-gray-800">{d.label}</td>
                          <td className="px-3 py-1.5 border-b border-gray-100 text-right font-mono text-red-700 font-semibold">{AMT(d.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-red-800 text-white font-bold">
                        <td colSpan={2} className="px-3 py-2">TOTAL DEDUCTIONS</td>
                        <td className="px-3 py-2 text-right font-mono">{AMT(rec.total_deductions)}</td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>

              <div className="bg-[#1a4b8e] text-white text-center rounded-lg py-3 font-bold text-base tracking-wide">
                NET PAY: {INR(rec.net_pay)}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 text-xs text-center text-gray-500">
                <div className="border-t border-gray-400 pt-2">Prepared By</div>
                <div className="border-t border-gray-400 pt-2">Checked By</div>
                <div className="border-t border-gray-400 pt-2">Drawing &amp; Disbursing Officer (D.D.O.)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
