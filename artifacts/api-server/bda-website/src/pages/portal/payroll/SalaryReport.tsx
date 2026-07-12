import { useState, useEffect, useRef } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Download, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];
const n = (v: any) => Number(v) || 0;

interface Row {
  id: number; emp_code: string; emp_name: string; emp_designation: string;
  basic_pay: string; pratipurti_vetan: string; da: string;
  cca: string; special_pay: string; personal_pay: string; hra: string; dept_allowance: string;
  gross_pay: string;
  gpf: string; nps: string; gpf_advance_recovery: string; group_insurance: string;
  hba: string; income_tax: string; gvr: string; hrent: string; recovery_pay_slip: string;
  total_deductions: string; net_pay: string; employer_nps: string;
}

type EmpType = "officer" | "other";

function fmt(v: number) { return v.toLocaleString("en-IN"); }

export default function SalaryReport() {
  const now = new Date();
  const [month,   setMonth]   = useState(now.getMonth() + 1);
  const [year,    setYear]    = useState(now.getFullYear());
  const [empType, setEmpType] = useState<EmpType>("officer");
  const [rows,    setRows]    = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [daLabel, setDaLabel] = useState<string | null>(null);   /* null = loading */
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  /* Fetch current DA% from DA Master on mount */
  useEffect(() => {
    apiFetch("/da-master/current").then(r => r.json())
      .then(d => {
        const pct = Number(d?.da_percent);
        setDaLabel(pct > 0 ? String(pct) : "—");
      })
      .catch(() => setDaLabel("—"));
  }, []);

  const loadReport = async () => {
    if (!month || !year) return;
    setLoading(true);
    try {
      const r = await apiFetch(`/salary-sheets?month=${month}&year=${year}&type=${empType}`);
      const data: Row[] = await r.json();
      if (data.length === 0) toast({ title: "No salary records found for this period." });
      setRows(data);
    } catch {
      toast({ title: "Failed to load report", variant: "destructive" });
    }
    setLoading(false);
  };

  /* Totals */
  const T = rows.reduce((a, r) => ({
    basic:   a.basic   + n(r.basic_pay),
    prati:   a.prati   + n(r.pratipurti_vetan),
    total:   a.total   + n(r.basic_pay) + n(r.pratipurti_vetan),
    da:      a.da      + n(r.da),
    cca:     a.cca     + n(r.cca),
    sPay:    a.sPay    + n(r.special_pay),
    pPay:    a.pPay    + n(r.personal_pay),
    hra:     a.hra     + n(r.hra),
    dept:    a.dept    + n(r.dept_allowance),
    gross:   a.gross   + n(r.gross_pay),
    gpfNps:  a.gpfNps  + (n(r.gpf) > 0 ? n(r.gpf) : n(r.nps)),
    gpfAdv:  a.gpfAdv  + n(r.gpf_advance_recovery),
    gis:     a.gis     + n(r.group_insurance),
    hba:     a.hba     + n(r.hba),
    tax:     a.tax     + n(r.income_tax),
    gvr:     a.gvr     + n(r.gvr),
    hrent:   a.hrent   + n(r.hrent),
    recov:   a.recov   + n(r.recovery_pay_slip),
    totalDed:a.totalDed+ n(r.total_deductions),
    net:     a.net     + n(r.net_pay),
    empNps:  a.empNps  + n(r.employer_nps),
  }), {basic:0,prati:0,total:0,da:0,cca:0,sPay:0,pPay:0,hra:0,dept:0,gross:0,
       gpfNps:0,gpfAdv:0,gis:0,hba:0,tax:0,gvr:0,hrent:0,recov:0,totalDed:0,net:0,empNps:0});

  /* Print */
  const handlePrint = () => window.print();

  /* Export Excel — VSO format */
  const exportExcel = () => {
    const typeLabel = empType === "officer" ? "Officers" : "Employees";
    const monthLabel = MONTHS[month - 1];
    const aoa: any[][] = [
      ["BAREILLY DEVELOPMENT AUTHORITY, BAREILLY"],
      [`Detailed Pay Bill of ${typeLabel} Establishment for the month of ${monthLabel}, ${year}`],
      ["ADDITION TO PAY ON ACCOUNT OF", "", "", "", "", "", "", "", "", "", "",
       "DEDUCTIONS ON ACCOUNT OF"],
      [
        "Name of Officer / Employee", "Name of the Post",
        "Pay/Pay Band", "Pratipurti Vetan", "Total (3+4)",
        `D.A. ${daLabel ?? ""}%`, "C.C.A", "S. Pay", "P.Pay", "H.R.A.", "Dept. Al.",
        "Gross Total Pay (5 to 11)",
        "G.P.F./ N.P.S.", "Recovery of G.P.F. Advance", "Group Insurance",
        "HBA", "Income Tax", "GVR", "HRENT", "Recovery as per Pay Slip",
        "Total Deduction", "Net Amount", "Authority Contribution N.P.S."
      ],
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
      ...rows.map((r) => [
        r.emp_name, r.emp_designation,
        n(r.basic_pay), n(r.pratipurti_vetan),
        n(r.basic_pay) + n(r.pratipurti_vetan),
        n(r.da), n(r.cca), n(r.special_pay), n(r.personal_pay), n(r.hra), n(r.dept_allowance),
        n(r.gross_pay),
        n(r.gpf) > 0 ? n(r.gpf) : n(r.nps),
        n(r.gpf_advance_recovery), n(r.group_insurance), n(r.hba),
        n(r.income_tax), n(r.gvr), n(r.hrent), n(r.recovery_pay_slip),
        n(r.total_deductions), n(r.net_pay), n(r.employer_nps),
      ]),
      /* Totals */
      ["TOTAL", "",
        T.basic, T.prati, T.total, T.da, T.cca, T.sPay, T.pPay, T.hra, T.dept,
        T.gross, T.gpfNps, T.gpfAdv, T.gis, T.hba, T.tax, T.gvr, T.hrent, T.recov,
        T.totalDed, T.net, T.empNps],
      [],
      ["", "", "", "", "", "", "Pay Gross Salary", "", "", "", "=", T.gross],
      [],
      ["", "", "", "", "", 1, "Cheque / RTGS Amount", "", "", "", "=", T.net],
      ["", "", "", "", "", 2, "NPS (Authority Contribution)", "", "", "", "=", T.empNps],
      ["", "", "", "", "", 3, "GPF", "", "", "", "=", T.gpfNps],
      ["", "", "", "", "", 4, "GIS (Group Insurance)", "", "", "", "=", T.gis],
      ["", "", "", "", "", 5, "Income Tax", "", "", "", "=", T.tax],
      ["", "", "", "", "", 6, "House Rent (HRENT)", "", "", "", "=", T.hrent],
      ["", "", "", "", "", 7, "GVR", "", "", "", "=", T.gvr],
      ["", "", "", "", "", "", "", "", "", "Total", "", T.gross],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [
      {wch:32},{wch:14},{wch:12},{wch:14},{wch:12},{wch:10},
      {wch:8},{wch:8},{wch:8},{wch:8},{wch:8},
      {wch:14},{wch:14},{wch:20},{wch:14},{wch:8},
      {wch:12},{wch:8},{wch:8},{wch:18},{wch:14},{wch:14},{wch:20},
    ];
    XLSX.utils.book_append_sheet(wb, ws, `${typeLabel} ${monthLabel} ${year}`);
    XLSX.writeFile(wb, `BDA_Salary_${typeLabel}_${monthLabel}_${year}.xlsx`);
  };

  const colHeaders = [
    "Name of Officer / Employee", "Name of the Post",
    "Pay / Pay Band\n(3)", "Pratipurti Vetan\n(4)", "Total (3+4)\n(5)",
    `D.A. ${daLabel ?? ""}%\n(6)`, "C.C.A\n(7)", "S. Pay\n(8)", "P.Pay\n(9)",
    "H.R.A.\n(10)", "Dept. Al.\n(11)", "Gross Total\n(5 to 11)\n(12)",
    "G.P.F. / N.P.S.\n(13)", "GPF Adv. Recovery\n(14)", "Group Ins.\n(15)",
    "HBA\n(16)", "Income Tax\n(17)", "GVR\n(18)", "HRENT\n(19)",
    "Recovery Pay Slip\n(20)", "Total Deduction\n(21)", "Net Amount\n(22)",
    "Authority NPS\n(23)"
  ];

  return (
    <PayrollLayout title="Salary Report">
      <div className="max-w-full">

        {/* ── Controls ── */}
        <div className="flex flex-wrap items-end gap-3 mb-5 print:hidden">
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium">Month</label>
            <select value={month} onChange={e => setMonth(Number(e.target.value))}
              className="text-sm font-semibold border-none outline-none bg-transparent cursor-pointer">
              {MONTHS.map((m, i) => <option key={m} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
            <label className="text-xs text-gray-500 font-medium">Year</label>
            <select value={year} onChange={e => setYear(Number(e.target.value))}
              className="text-sm font-semibold border-none outline-none bg-transparent cursor-pointer">
              {Array.from({length:8},(_,i) => now.getFullYear()-3+i).map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {(["officer","other"] as EmpType[]).map(t => (
              <button key={t} onClick={() => setEmpType(t)}
                className={`px-4 py-2.5 text-xs font-semibold transition-colors
                  ${empType===t ? "bg-[#1a3a6e] text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                {t === "officer" ? "Officers" : "Employees"}
              </button>
            ))}
          </div>

          <Button onClick={loadReport} disabled={loading} className="bg-[#1a3a6e] hover:bg-[#2a4d8a] gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
            Show Report
          </Button>

          {rows.length > 0 && (
            <>
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" /> Print / PDF
              </Button>
              <Button variant="outline" onClick={exportExcel}
                className="gap-2 border-green-600 text-green-700 hover:bg-green-50">
                <Download className="h-4 w-4" /> Export Excel
              </Button>
            </>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FileSpreadsheet className="h-12 w-12 mb-3 opacity-20" />
            <p className="text-base font-semibold">Select month, year and type, then click Show Report</p>
            <p className="text-sm mt-1 text-gray-400">Salary data must be generated first from Generate Salary page</p>
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div ref={printRef}>
            {/* ── Print / Report Header ── */}
            <div className="text-center mb-3 print:mb-2">
              <div className="font-bold text-base text-gray-900 uppercase tracking-wide">
                BAREILLY DEVELOPMENT AUTHORITY, BAREILLY
              </div>
              <div className="text-sm font-semibold text-gray-700 mt-0.5">
                Detailed Pay Bill of {empType === "officer" ? "Officers" : "Employees"} Establishment
                &nbsp;for the month of&nbsp;
                <span className="text-blue-700">{MONTHS[month-1]}, {year}</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                D.A. Rate:&nbsp;
                {daLabel === null
                  ? <span className="text-blue-400 animate-pulse">loading…</span>
                  : <span className="font-semibold text-blue-700">{daLabel}%</span>
                }
                &nbsp;(DA Master) &nbsp;|&nbsp; Total Employees: {rows.length}
              </div>
            </div>

            {/* ── Main Table ── */}
            <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
              <table className="text-[11px] border-collapse w-full min-w-[2200px]">
                {/* Section Headers */}
                <thead>
                  <tr>
                    <th colSpan={2} className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-center text-xs font-semibold text-gray-700" />
                    <th colSpan={10} className="border border-gray-300 bg-green-800 text-white px-2 py-1.5 text-center text-xs font-bold tracking-wide">
                      ADDITION TO PAY — EARNINGS
                    </th>
                    <th colSpan={9} className="border border-gray-300 bg-red-800 text-white px-2 py-1.5 text-center text-xs font-bold tracking-wide">
                      DEDUCTIONS ON ACCOUNT OF
                    </th>
                    <th colSpan={2} className="border border-gray-300 bg-blue-800 text-white px-2 py-1.5 text-center text-xs font-bold tracking-wide" />
                  </tr>
                  {/* Column Names */}
                  <tr className="bg-[#1a3a6e] text-white">
                    {colHeaders.map((h, i) => (
                      <th key={i}
                        className={`border border-[#2a4d8a] px-2 py-2 text-center whitespace-pre-line text-[10px] font-semibold leading-tight
                          ${i < 2 ? "min-w-[160px]" : "min-w-[80px]"}
                          ${i === 11 ? "bg-green-700" : ""}
                          ${i === 20 ? "bg-red-700" : ""}
                          ${i === 21 ? "bg-blue-700" : ""}
                          ${i === 22 ? "bg-purple-800" : ""}
                        `}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r, idx) => {
                    const totalBasic = n(r.basic_pay) + n(r.pratipurti_vetan);
                    const gpfNps = n(r.gpf) > 0 ? n(r.gpf) : n(r.nps);
                    const cells = [
                      r.emp_name, r.emp_designation,
                      n(r.basic_pay), n(r.pratipurti_vetan), totalBasic,
                      n(r.da), n(r.cca), n(r.special_pay), n(r.personal_pay),
                      n(r.hra), n(r.dept_allowance), n(r.gross_pay),
                      gpfNps, n(r.gpf_advance_recovery), n(r.group_insurance),
                      n(r.hba), n(r.income_tax), n(r.gvr), n(r.hrent),
                      n(r.recovery_pay_slip), n(r.total_deductions), n(r.net_pay), n(r.employer_nps),
                    ];
                    return (
                      <tr key={r.id}
                        className={`${idx%2===0?"bg-white":"bg-gray-50"} hover:bg-blue-50/30 transition-colors`}>
                        {cells.map((c, ci) => (
                          <td key={ci}
                            className={`border border-gray-200 px-2 py-1.5
                              ${ci < 2 ? "text-left font-medium text-gray-800" : "text-right font-mono text-gray-700"}
                              ${ci === 4 || ci === 5 ? "bg-green-50 text-green-800 font-semibold" : ""}
                              ${ci === 11 ? "bg-green-100 text-green-900 font-bold" : ""}
                              ${ci === 20 ? "bg-red-100 text-red-800 font-bold" : ""}
                              ${ci === 21 ? "bg-blue-100 text-blue-900 font-bold text-sm" : ""}
                              ${ci === 22 ? "bg-purple-50 text-purple-800" : ""}
                            `}>
                            {ci < 2
                              ? (ci === 0
                                  ? <div><div className="font-semibold">{c}</div><div className="text-[9px] text-gray-400">{r.emp_code}</div></div>
                                  : c)
                              : (typeof c === "number" && c > 0 ? fmt(c) : (c === 0 ? "—" : c))
                            }
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>

                {/* Totals footer */}
                <tfoot>
                  <tr className="bg-[#1a3a6e] text-white font-bold text-[11px]">
                    <td className="border border-[#2a4d8a] px-2 py-2 text-left" colSpan={2}>
                      TOTAL ({rows.length} employees)
                    </td>
                    {[T.basic, T.prati, T.total, T.da, T.cca, T.sPay, T.pPay, T.hra, T.dept,
                      T.gross, T.gpfNps, T.gpfAdv, T.gis, T.hba, T.tax, T.gvr, T.hrent, T.recov,
                      T.totalDed, T.net, T.empNps].map((v, i) => (
                      <td key={i}
                        className={`border border-[#2a4d8a] px-2 py-2 text-right font-mono
                          ${i === 9  ? "bg-green-700" : ""}
                          ${i === 18 ? "bg-red-700" : ""}
                          ${i === 19 ? "bg-blue-700" : ""}
                          ${i === 20 ? "bg-purple-800" : ""}
                        `}>
                        {fmt(v)}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* ── Summary Box (Excel rows 15-24 style) ── */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5 print:grid-cols-2 print:mt-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 print:shadow-none print:border-gray-400">
                <div className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-3 border-b pb-2">
                  Pay Disbursement Summary
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 mb-2">
                  <span className="text-sm font-semibold text-gray-700">Pay Gross Salary</span>
                  <span className="font-bold text-gray-900 font-mono">₹{fmt(T.gross)}</span>
                </div>
                {[
                  ["1.", "Cheque / RTGS Amount",          T.net],
                  ["2.", "NPS (Authority Contribution)",  T.empNps],
                  ["3.", "GPF",                           T.gpfNps],
                  ["4.", "GIS (Group Insurance)",         T.gis],
                  ["5.", "Income Tax",                    T.tax],
                  ["6.", "House Rent (HRENT)",            T.hrent],
                  ["7.", "GVR",                           T.gvr],
                ].map(([num, label, val]) => (
                  <div key={String(label)} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-gray-500 font-mono text-xs w-5">{num}</span>
                    <span className="text-gray-700 flex-1 ml-2">{label}</span>
                    <span className="font-semibold font-mono text-blue-700">₹{fmt(Number(val))}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-gray-300 mt-2">
                  <span className="font-bold text-gray-800 text-sm">Total</span>
                  <span className="font-bold font-mono text-gray-900">₹{fmt(T.gross)}</span>
                </div>
              </div>

              <div className="bg-[#1a3a6e] text-white rounded-lg p-5 print:shadow-none">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-3 border-b border-blue-500 pb-2">
                  Sheet Summary
                </div>
                <div className="text-2xl font-bold">{MONTHS[month-1]} {year}</div>
                <div className="text-sm text-blue-200 mt-1">
                  {empType === "officer" ? "Officers" : "Employees"} — {rows.length} records
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["Gross Pay",      fmt(T.gross),    "green"],
                    ["Total Deduction",fmt(T.totalDed), "red"],
                    ["Net Pay",        fmt(T.net),      "blue"],
                    ["Employer NPS",   fmt(T.empNps),   "purple"],
                  ].map(([label, val, color]) => (
                    <div key={label} className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-[10px] text-blue-200 uppercase">{label}</div>
                      <div className="font-bold text-white text-sm font-mono mt-1">₹{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          [data-payroll-layout-main], [data-payroll-layout-main] * { visibility: visible; }
          .print\\:hidden { display: none !important; }
          table { font-size: 9px !important; }
          thead th { background-color: #1a3a6e !important; color: white !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </PayrollLayout>
  );
}
