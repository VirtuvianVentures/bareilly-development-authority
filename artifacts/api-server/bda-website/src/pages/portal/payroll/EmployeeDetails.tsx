import { useState, useEffect, useCallback, useRef } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Pencil, X, Loader2, Users,
  Camera, PenLine, TrendingUp, TrendingDown,
  Save,
} from "lucide-react";

/* ── Types ── */
interface Employee {
  id: number; empCode: string; name: string; fatherName: string | null;
  designation: string; department: string; category: string;
  maritalStatus: string | null; aadharCard: string | null;
  lastQualification: string | null; sex: string | null;
  dob: string | null; doa: string | null; joinDate: string | null;
  retirementDate: string | null; empGroup: string | null;
  paybillGroup: string | null; payLevel: string | null;
  contributionType: string | null; incrMonth: string | null;
  incrPercent: string | null; gisLicNo: string | null;
  phone: string | null; centralized: boolean; email: string | null;
  address: string | null; panNo: string | null; gpfNo: string | null;
  basicPay: string | null; grade: string | null;
  bankAccount: string | null; branchSolId: string | null;
  bankName: string | null; ifsc: string | null;
  pfAccount: string | null; cpfAccount: string | null;
  cboRegNo: string | null; pran: string | null;
  isNpsDeduction: boolean; photoUrl: string | null;
  signatureUrl: string | null;
  isSuspended: boolean; isRetired: boolean; isDisabled: boolean;
  isTransferred: boolean; isPensionable: boolean;
  employeeType: string; status: string; isActive: boolean;
  createdAt: string; updatedAt: string;
}

interface SalaryHead { id: number; name: string; amount: string; default_days?: string; }
interface HeadVal { amount: string; checked: boolean; }

const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const LEVELS      = Array.from({ length: 20 }, (_, i) => String(i + 1));


function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(file);
  });
}

const fmtDate = (d: string | null) => (d ? d.slice(0, 10) : "—");

/* ── Sub-components (identical to PayrollModule style) ── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold text-[#1a3a6e] uppercase tracking-wider pb-1.5 border-b border-[#1a3a6e]/20">{children}</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">{children}</div>
    </div>
  );
}

function F({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-full" : ""}>
      <Label className="text-xs text-gray-600 font-medium">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function Sel({ value, onChange, children }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode }) {
  return (
    <select value={value} onChange={onChange} className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white">
      {children}
    </select>
  );
}

/* ════ MAIN ════ */
export default function EmployeeDetails() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [editing, setEditing]     = useState<Employee | null>(null);
  const [empForm, setEmpForm]     = useState<any>({});
  const [saving, setSaving]       = useState(false);
  const { toast } = useToast();

  /* Masters from localStorage */
  const [designations,   setDesignations]   = useState<string[]>([]);
  const [branches,       setBranches]       = useState<string[]>([]);
  const [banks,          setBanks]          = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [groups,         setGroups]         = useState<string[]>([]);
  const [paybillGroups,  setPaybillGroups]  = useState<string[]>([]);

  /* Salary heads from API */
  const [allowanceHeads, setAllowanceHeads] = useState<SalaryHead[]>([]);
  const [deductionHeads, setDeductionHeads] = useState<SalaryHead[]>([]);
  const [leaveHeads,     setLeaveHeads]     = useState<SalaryHead[]>([]);
  const [empAllowances,  setEmpAllowances]  = useState<Record<number, HeadVal>>({});
  const [empDeductions,  setEmpDeductions]  = useState<Record<number, HeadVal>>({});
  const [empLeaves,      setEmpLeaves]      = useState<Record<number, HeadVal>>({});
  const [headsLoading,   setHeadsLoading]   = useState(false);

  const photoRef = useRef<HTMLInputElement>(null);
  const sigRef   = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await apiFetch("/employees"); setEmployees(await r.json()); }
    catch { toast({ title: "Error loading employees", variant: "destructive" }); }
    finally { setLoading(false); }
  }, []);

  const loadHeads = async () => {
    try {
      const [ar, dr, lr] = await Promise.all([apiFetch("/allowance-heads"), apiFetch("/deduction-heads"), apiFetch("/leave-heads")]);
      const ah: SalaryHead[] = await ar.json();
      const dh: SalaryHead[] = await dr.json();
      const lh: SalaryHead[] = await lr.json();
      setAllowanceHeads(ah); setDeductionHeads(dh); setLeaveHeads(lh);
      return { ah, dh, lh };
    } catch { return { ah: allowanceHeads, dh: deductionHeads, lh: leaveHeads }; }
  };

  useEffect(() => {
    Promise.all([
      apiFetch("/payroll-masters/designations").then(r => r.json()),
      apiFetch("/payroll-masters/branches").then(r => r.json()),
      apiFetch("/payroll-masters/banks").then(r => r.json()),
      apiFetch("/payroll-masters/qualifications").then(r => r.json()),
      apiFetch("/payroll-masters/groups").then(r => r.json()),
      apiFetch("/payroll-masters/paybill-groups").then(r => r.json()),
    ]).then(([d, b, bk, q, g, pg]: any[][]) => {
      const names = (arr: any[]) => arr.filter(i => i.status === "active").map(i => i.name);
      setDesignations(names(d));
      setBranches(names(b));
      setBanks(names(bk));
      setQualifications(names(q));
      setGroups(names(g));
      setPaybillGroups(names(pg));
    }).catch(() => {});
    load();
    loadHeads();
  }, [load]);

  /* Filters */
  const depts    = Array.from(new Set(employees.map(e => e.department).filter(Boolean))).sort();
  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.empCode.toLowerCase().includes(q)
      || (e.designation || "").toLowerCase().includes(q) || (e.phone || "").includes(q);
    return matchSearch && (!deptFilter || e.department === deptFilter) && (!typeFilter || e.employeeType === typeFilter);
  });

  /* Open edit */
  const openEdit = async (e: Employee) => {
    setEditing(e);
    setEmpForm({ ...e });
    setHeadsLoading(true);
    const { ah, dh, lh } = await loadHeads();
    const defA: Record<number, HeadVal> = {};
    const defD: Record<number, HeadVal> = {};
    const defL: Record<number, HeadVal> = {};
    ah.forEach(h => (defA[h.id] = { amount: String(h.amount), checked: false }));
    dh.forEach(h => (defD[h.id] = { amount: String(h.amount), checked: false }));
    lh.forEach(h => (defL[h.id]  = { amount: String(h.default_days ?? "0"), checked: false }));
    try {
      const [ar, dr, lr] = await Promise.all([
        apiFetch(`/employees/${e.id}/allowances`),
        apiFetch(`/employees/${e.id}/deductions`),
        apiFetch(`/employees/${e.id}/leaves`),
      ]);
      const aVals = await ar.json(); const dVals = await dr.json(); const lVals = await lr.json();
      aVals.forEach((v: any) => { defA[v.allowance_head_id] = { amount: String(v.amount), checked: v.is_applicable !== false }; });
      dVals.forEach((v: any) => { defD[v.deduction_head_id] = { amount: String(v.amount), checked: v.is_applicable !== false }; });
      lVals.forEach((v: any) => { defL[v.leave_head_id]     = { amount: String(v.days),   checked: v.is_applicable !== false }; });
    } catch {}
    setEmpAllowances(defA); setEmpDeductions(defD); setEmpLeaves(defL);
    setHeadsLoading(false);
  };

  const set  = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEmpForm((p: any) => ({ ...p, [key]: e.target.value }));
  const setV = (key: string, val: any) => setEmpForm((p: any) => ({ ...p, [key]: val }));

  const handleFile = async (key: "photoUrl" | "signatureUrl", file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "File too large (max 2MB)", variant: "destructive" }); return; }
    const b64 = await fileToBase64(file); setV(key, b64);
  };

  const saveEdit = async () => {
    if (!empForm.empCode?.trim() || !empForm.name?.trim()) {
      toast({ title: "Emp Code & Name required", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      const empId = editing!.id;
      await apiFetch(`/employees/${empId}`, { method: "PUT", body: JSON.stringify(empForm) });
      const aEntries = allowanceHeads.map(h => ({ allowanceHeadId: h.id, amount: Number(empAllowances[h.id]?.amount ?? h.amount) || 0, isApplicable: empAllowances[h.id]?.checked ?? false }));
      const dEntries = deductionHeads.map(h => ({ deductionHeadId: h.id, amount: Number(empDeductions[h.id]?.amount ?? h.amount) || 0, isApplicable: empDeductions[h.id]?.checked ?? false }));
      const lEntries = leaveHeads.map(h => ({ leaveHeadId: h.id, days: Number(empLeaves[h.id]?.amount ?? h.default_days ?? 0) || 0, isApplicable: empLeaves[h.id]?.checked ?? false }));
      await Promise.all([
        aEntries.length ? apiFetch(`/employees/${empId}/allowances`, { method: "PUT", body: JSON.stringify(aEntries) }) : Promise.resolve(),
        dEntries.length ? apiFetch(`/employees/${empId}/deductions`, { method: "PUT", body: JSON.stringify(dEntries) }) : Promise.resolve(),
        lEntries.length ? apiFetch(`/employees/${empId}/leaves`,     { method: "PUT", body: JSON.stringify(lEntries) }) : Promise.resolve(),
      ]);
      toast({ title: "Employee updated successfully" });
      setEditing(null); load();
    } catch (err: any) { toast({ title: "Error: " + (err?.message || ""), variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const badge = (v: string) => {
    const map: Record<string, string> = { active: "bg-green-100 text-green-700", retired: "bg-gray-100 text-gray-600", officer: "bg-blue-100 text-blue-700", other: "bg-orange-100 text-orange-700" };
    return map[v] || "bg-gray-100 text-gray-600";
  };

  return (
    <PayrollLayout title="Employee Details">

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, code, phone…"
            className="text-sm border-none outline-none bg-transparent flex-1" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
          <option value="">All Departments</option>
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
          <option value="">All Types</option>
          <option value="officer">Officer</option>
          <option value="other">Other Staff</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} of {employees.length} employees</span>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Users className="h-12 w-12 mb-3 opacity-20" />
          <p className="text-base font-semibold">No employees found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="text-xs border-collapse w-full min-w-[1400px]">
            <thead>
              <tr className="bg-[#1a3a6e] text-white">
                {["#","Emp Code","Name","Father Name","Designation","Department","Emp Type","Category","Sex","DOB","DOA","Join Date","Retirement","PayBill Group","Emp Group","Pay Level","Basic Pay","Grade","Contrib.","Phone","Email","PAN","GPF No.","PRAN","Bank Acct","Bank Name","IFSC","PF Acct","CPF Acct","Status","NPS","Suspended","Retired","Disabled","Transferred","Pensionable","Action"].map(h => (
                  <th key={h} className="px-2.5 py-2.5 text-left font-semibold text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className={`border-b border-gray-100 hover:bg-blue-50/30 ${i%2===0?"bg-white":"bg-gray-50/60"}`}>
                  <td className="px-2.5 py-2 text-center text-gray-400">{i + 1}</td>
                  <td className="px-2.5 py-2 font-mono font-semibold text-blue-700 whitespace-nowrap">{e.empCode}</td>
                  <td className="px-2.5 py-2 font-semibold text-gray-800 whitespace-nowrap min-w-[140px]">{e.name}</td>
                  <td className="px-2.5 py-2 text-gray-600 whitespace-nowrap">{e.fatherName || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.designation}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.department}</td>
                  <td className="px-2.5 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${badge(e.employeeType)}`}>{e.employeeType}</span>
                  </td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.category || "—"}</td>
                  <td className="px-2.5 py-2 text-center">{e.sex || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{fmtDate(e.dob)}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{fmtDate(e.doa)}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{fmtDate(e.joinDate)}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{fmtDate(e.retirementDate)}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.paybillGroup || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.empGroup || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.payLevel || "—"}</td>
                  <td className="px-2.5 py-2 text-right font-mono font-semibold text-green-700 whitespace-nowrap">
                    {e.basicPay ? `₹${Number(e.basicPay).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.grade || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.contributionType || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.phone || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.email || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.panNo || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.gpfNo || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.pran || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.bankAccount || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.bankName || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.ifsc || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.pfAccount || "—"}</td>
                  <td className="px-2.5 py-2 whitespace-nowrap">{e.cpfAccount || "—"}</td>
                  <td className="px-2.5 py-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${badge(e.status)}`}>{e.status}</span>
                  </td>
                  {[e.isNpsDeduction, e.isSuspended, e.isRetired, e.isDisabled, e.isTransferred, e.isPensionable].map((v, idx) => (
                    <td key={idx} className="px-2.5 py-2 text-center">
                      <span className={`text-[10px] font-semibold ${v ? "text-green-600" : "text-gray-300"}`}>{v ? "Yes" : "No"}</span>
                    </td>
                  ))}
                  <td className="px-2.5 py-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(e)}
                      className="h-7 px-2.5 text-[11px] gap-1 border-blue-300 text-blue-700 hover:bg-blue-50">
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ════ EDIT MODAL (PayrollModule style) ════ */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl my-4">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#1a3a6e] rounded-t-xl sticky top-0 z-10">
              <div>
                <h3 className="font-bold text-white text-lg">Edit Employee</h3>
                <p className="text-xs text-blue-200">{editing.name} — {editing.empCode}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditing(null)} className="text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-7">

              {/* Employee Type toggle */}
              <div>
                <SectionTitle>Employee Type</SectionTitle>
                <div className="flex gap-3 mt-2">
                  {[{ value: "officer", label: "Officer" }, { value: "other", label: "Staff" }].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setV("employeeType", opt.value)}
                      className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-semibold transition-colors
                        ${empForm.employeeType === opt.value
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Basic Information ── */}
              <Section title="Basic Information">
                <F label="Emp Code *"><Input value={empForm.empCode || ""} onChange={set("empCode")} placeholder="e.g. 1284555" /></F>
                <F label="Full Name *"><Input value={empForm.name || ""} onChange={set("name")} placeholder="Full name" /></F>
                <F label="Father's Name"><Input value={empForm.fatherName || ""} onChange={set("fatherName")} /></F>
                <F label="Sex">
                  <Sel value={empForm.sex || "M"} onChange={set("sex")}>
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                    <option value="T">Transgender (T)</option>
                  </Sel>
                </F>
                <F label="Category">
                  <Sel value={empForm.category || "regular"} onChange={set("category")}>
                    <option value="regular">Regular</option>
                    <option value="contract">Contract</option>
                    <option value="daily_wage">Daily Wage</option>
                    <option value="deputation">Deputation</option>
                  </Sel>
                </F>
                <F label="Marital Status">
                  <Sel value={empForm.maritalStatus || "Unmarried"} onChange={set("maritalStatus")}>
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </Sel>
                </F>
                <F label="Aadhar Card No.">
                  <Input value={empForm.aadharCard || ""} onChange={set("aadharCard")} placeholder="12-digit Aadhar" maxLength={12} />
                </F>
                <F label="Last Qualification">
                  {qualifications.length > 0 ? (
                    <Sel value={empForm.lastQualification || ""} onChange={set("lastQualification")}>
                      <option value="">-- Select --</option>
                      {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                    </Sel>
                  ) : <Input value={empForm.lastQualification || ""} onChange={set("lastQualification")} placeholder="e.g. B.Tech, M.A." />}
                </F>
                <F label="Mobile"><Input value={empForm.phone || ""} onChange={set("phone")} placeholder="10-digit mobile" /></F>
                <F label="Email"><Input type="email" value={empForm.email || ""} onChange={set("email")} /></F>
                <F label="PAN No."><Input value={empForm.panNo || ""} onChange={set("panNo")} placeholder="e.g. ABCDE1234F" className="uppercase" /></F>
                <F label="Address" wide><Input value={empForm.address || ""} onChange={set("address")} /></F>
              </Section>

              {/* ── Service Details ── */}
              <Section title="Service Details">
                <F label="Designation *">
                  {designations.length > 0 ? (
                    <Sel value={empForm.designation || ""} onChange={set("designation")}>
                      <option value="">-- Select --</option>
                      {designations.map(d => <option key={d} value={d}>{d}</option>)}
                    </Sel>
                  ) : <Input value={empForm.designation || ""} onChange={set("designation")} />}
                </F>
                <F label="Branch / Department">
                  {branches.length > 0 ? (
                    <Sel value={empForm.department || ""} onChange={set("department")}>
                      <option value="">-- Select --</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </Sel>
                  ) : <Input value={empForm.department || ""} onChange={set("department")} />}
                </F>
                <F label="Group">
                  {groups.length > 0 ? (
                    <Sel value={empForm.empGroup || ""} onChange={set("empGroup")}>
                      <option value="">-- Select Group --</option>
                      {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </Sel>
                  ) : <Input value={empForm.empGroup || ""} onChange={set("empGroup")} placeholder="e.g. Group A" />}
                </F>
                <F label="Paybill Group">
                  {paybillGroups.length > 0 ? (
                    <Sel value={empForm.paybillGroup || ""} onChange={set("paybillGroup")}>
                      <option value="">-- Select Paybill Group --</option>
                      {paybillGroups.map(g => <option key={g} value={g}>{g}</option>)}
                    </Sel>
                  ) : <Input value={empForm.paybillGroup || ""} onChange={set("paybillGroup")} />}
                </F>
                <F label="Level (Pay Level)">
                  <Sel value={empForm.payLevel || ""} onChange={set("payLevel")}>
                    <option value="">-- Select Level --</option>
                    {LEVELS.map(l => <option key={l} value={l}>Level {l}</option>)}
                  </Sel>
                </F>
                <F label="Contribution Type">
                  <Sel value={empForm.contributionType || "GPF"} onChange={set("contributionType")}>
                    <option value="GPF">GPF</option>
                    <option value="Pension">Pension</option>
                    <option value="NPS">NPS</option>
                    <option value="NA">NA</option>
                  </Sel>
                </F>
                <F label="Increment Month">
                  <Sel value={empForm.incrMonth || ""} onChange={set("incrMonth")}>
                    <option value="">-- Select Month --</option>
                    {MONTHS_LONG.map(m => <option key={m} value={m}>{m}</option>)}
                  </Sel>
                </F>
                <F label="Increment %">
                  <Input type="number" value={empForm.incrPercent || ""} onChange={set("incrPercent")} placeholder="e.g. 3" />
                </F>
                <F label="DOB (Date of Birth)"><Input type="date" value={(empForm.dob || "").slice(0, 10)} onChange={set("dob")} /></F>
                <F label="DOA (Date of Appointment)"><Input type="date" value={(empForm.doa || "").slice(0, 10)} onChange={set("doa")} /></F>
                <F label="DOJ (Date of Joining)"><Input type="date" value={(empForm.joinDate || "").slice(0, 10)} onChange={set("joinDate")} /></F>
                <F label="DOR (Date of Retirement)"><Input type="date" value={(empForm.retirementDate || "").slice(0, 10)} onChange={set("retirementDate")} /></F>
                <F label="GIS LIC No"><Input value={empForm.gisLicNo || ""} onChange={set("gisLicNo")} /></F>
                <F label="Basic Pay (₹)"><Input type="number" value={empForm.basicPay || ""} onChange={set("basicPay")} /></F>
                <F label="Grade"><Input value={empForm.grade || ""} onChange={set("grade")} /></F>
                <F label="GPF No."><Input value={empForm.gpfNo || ""} onChange={set("gpfNo")} /></F>
                <F label="Centralized">
                  <Sel value={empForm.centralized === true || empForm.centralized === "true" ? "true" : "false"}
                    onChange={e => setV("centralized", e.target.value === "true")}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Sel>
                </F>
                <F label="Status">
                  <Sel value={empForm.status || "active"} onChange={set("status")}>
                    <option value="active">Active</option>
                    <option value="retired">Retired</option>
                    <option value="resigned">Resigned</option>
                    <option value="terminated">Terminated</option>
                    <option value="on_leave">On Leave</option>
                  </Sel>
                </F>
              </Section>

              {/* ── Account & Financial ── */}
              <Section title="Account & Financial Details">
                <F label="Salary A/C (Bank Account)"><Input value={empForm.bankAccount || ""} onChange={set("bankAccount")} placeholder="Account number" /></F>
                <F label="Branch Sol ID"><Input value={empForm.branchSolId || ""} onChange={set("branchSolId")} placeholder="e.g. 187000" /></F>
                <F label="Bank Name">
                  {banks.length > 0 ? (
                    <Sel value={empForm.bankName || ""} onChange={set("bankName")}>
                      <option value="">-- Select Bank --</option>
                      {banks.map(b => <option key={b} value={b}>{b}</option>)}
                    </Sel>
                  ) : <Input value={empForm.bankName || ""} onChange={set("bankName")} />}
                </F>
                <F label="IFSC Code"><Input value={empForm.ifsc || ""} onChange={set("ifsc")} className="uppercase" /></F>
                <F label="P.F. A/C Number"><Input value={empForm.pfAccount || ""} onChange={set("pfAccount")} /></F>
                <F label="C.P.F. A/C Number"><Input value={empForm.cpfAccount || ""} onChange={set("cpfAccount")} /></F>
                <F label="CBO Regno"><Input value={empForm.cboRegNo || ""} onChange={set("cboRegNo")} /></F>
                <F label="PRAN"><Input value={empForm.pran || ""} onChange={set("pran")} /></F>
                <F label="Is NPS Deduction?">
                  <Sel value={empForm.isNpsDeduction === true || empForm.isNpsDeduction === "true" ? "true" : "false"}
                    onChange={e => setV("isNpsDeduction", e.target.value === "true")}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Sel>
                </F>
              </Section>

              {/* ── Photo & Signature ── */}
              <Section title="Photo & Signature Upload">
                <F label="Employee Photo">
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-colors relative overflow-hidden">
                      {empForm.photoUrl ? (
                        <>
                          <img src={empForm.photoUrl} alt="Photo" className="absolute inset-0 w-full h-full object-contain p-1" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">Change Photo</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <Camera className="h-7 w-7" />
                          <span className="text-xs">Upload Photo</span>
                          <span className="text-[10px]">JPG / PNG (max 2MB)</span>
                        </div>
                      )}
                      <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
                        onChange={e => handleFile("photoUrl", e.target.files?.[0] ?? null)} />
                    </label>
                    {empForm.photoUrl && (
                      <button type="button" onClick={() => setV("photoUrl", "")} className="text-[10px] text-red-500 hover:text-red-700 underline">Remove photo</button>
                    )}
                  </div>
                </F>
                <F label="Employee Signature">
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-colors relative overflow-hidden">
                      {empForm.signatureUrl ? (
                        <>
                          <img src={empForm.signatureUrl} alt="Signature" className="absolute inset-0 w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-medium">Change Signature</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400">
                          <PenLine className="h-7 w-7" />
                          <span className="text-xs">Upload Signature</span>
                          <span className="text-[10px]">JPG / PNG (max 2MB)</span>
                        </div>
                      )}
                      <input ref={sigRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
                        onChange={e => handleFile("signatureUrl", e.target.files?.[0] ?? null)} />
                    </label>
                    {empForm.signatureUrl && (
                      <button type="button" onClick={() => setV("signatureUrl", "")} className="text-[10px] text-red-500 hover:text-red-700 underline">Remove signature</button>
                    )}
                  </div>
                </F>
              </Section>

              {/* ── Status Flags ── */}
              <div>
                <SectionTitle>Status Flags</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                  {([
                    { key: "isSuspended",   label: "Suspended",   color: "red" },
                    { key: "isRetired",     label: "Retired",     color: "orange" },
                    { key: "isDisabled",    label: "Disable A/C", color: "gray" },
                    { key: "isTransferred", label: "Transferred", color: "yellow" },
                    { key: "isPensionable", label: "Pensionable", color: "teal" },
                  ] as const).map(({ key, label, color }) => {
                    const active = empForm[key] === true || empForm[key] === "true";
                    const colorMap: Record<string, string> = {
                      red:    "border-red-400 bg-red-50 text-red-700",
                      orange: "border-orange-400 bg-orange-50 text-orange-700",
                      gray:   "border-gray-400 bg-gray-100 text-gray-700",
                      yellow: "border-yellow-400 bg-yellow-50 text-yellow-700",
                      teal:   "border-teal-400 bg-teal-50 text-teal-700",
                    };
                    return (
                      <button key={key} type="button" onClick={() => setV(key, !active)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all font-medium text-sm
                          ${active ? colorMap[color] : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                          ${active ? "border-current bg-current" : "border-gray-300"}`}>
                          {active && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Allowances, Deductions & Leaves ── */}
              {headsLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
              ) : (allowanceHeads.length > 0 || deductionHeads.length > 0 || leaveHeads.length > 0) && (
                <div>
                  <SectionTitle>Allowances, Deductions &amp; Leaves</SectionTitle>
                  <p className="text-[11px] text-gray-400 mt-1 mb-3">Check the box to enable a head for this employee. Uncheck to exclude from salary calculation.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Allowances */}
                    {allowanceHeads.length > 0 && (
                      <div className="bg-green-50/60 rounded-xl border border-green-200 overflow-hidden">
                        <div className="bg-green-600 px-4 py-2.5 flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 text-white" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Allowances</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {allowanceHeads.map(h => {
                            const val = empAllowances[h.id] ?? { amount: String(h.amount), checked: false };
                            return (
                              <div key={h.id}>
                                <label className="flex items-center gap-2 cursor-pointer mb-1">
                                  <input type="checkbox" checked={val.checked}
                                    onChange={e => setEmpAllowances(p => ({ ...p, [h.id]: { ...val, checked: e.target.checked } }))}
                                    className="h-3.5 w-3.5 rounded border-gray-400 accent-green-600" />
                                  <span className="text-xs font-medium text-gray-700">{h.name}</span>
                                </label>
                                <Input type="number" value={val.amount}
                                  onChange={e => setEmpAllowances(p => ({ ...p, [h.id]: { ...val, amount: e.target.value } }))}
                                  disabled={!val.checked}
                                  className={`h-8 text-sm ${!val.checked ? "bg-gray-100 text-gray-400" : "bg-white"}`}
                                  placeholder="0" />
                              </div>
                            );
                          })}
                          <div className="pt-2 border-t border-green-200 flex justify-between text-xs font-bold text-green-700 mt-1">
                            <span>Total</span>
                            <span>₹{allowanceHeads.filter(h => empAllowances[h.id]?.checked).reduce((s, h) => s + (Number(empAllowances[h.id]?.amount) || 0), 0).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Deductions */}
                    {deductionHeads.length > 0 && (
                      <div className="bg-red-50/60 rounded-xl border border-red-200 overflow-hidden">
                        <div className="bg-red-600 px-4 py-2.5 flex items-center gap-2">
                          <TrendingDown className="h-3.5 w-3.5 text-white" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Deductions</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {deductionHeads.map(h => {
                            const val = empDeductions[h.id] ?? { amount: String(h.amount), checked: false };
                            return (
                              <div key={h.id}>
                                <label className="flex items-center gap-2 cursor-pointer mb-1">
                                  <input type="checkbox" checked={val.checked}
                                    onChange={e => setEmpDeductions(p => ({ ...p, [h.id]: { ...val, checked: e.target.checked } }))}
                                    className="h-3.5 w-3.5 rounded border-gray-400 accent-red-600" />
                                  <span className="text-xs font-medium text-gray-700">{h.name}</span>
                                </label>
                                <Input type="number" value={val.amount}
                                  onChange={e => setEmpDeductions(p => ({ ...p, [h.id]: { ...val, amount: e.target.value } }))}
                                  disabled={!val.checked}
                                  className={`h-8 text-sm ${!val.checked ? "bg-gray-100 text-gray-400" : "bg-white"}`}
                                  placeholder="0" />
                              </div>
                            );
                          })}
                          <div className="pt-2 border-t border-red-200 flex justify-between text-xs font-bold text-red-600 mt-1">
                            <span>Total</span>
                            <span>₹{deductionHeads.filter(h => empDeductions[h.id]?.checked).reduce((s, h) => s + (Number(empDeductions[h.id]?.amount) || 0), 0).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Leaves */}
                    {leaveHeads.length > 0 && (
                      <div className="bg-blue-50/60 rounded-xl border border-blue-200 overflow-hidden">
                        <div className="bg-blue-600 px-4 py-2.5 flex items-center gap-2">
                          <TrendingDown className="h-3.5 w-3.5 text-white" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Leaves</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {leaveHeads.map(h => {
                            const val = empLeaves[h.id] ?? { amount: String(h.default_days ?? "0"), checked: false };
                            return (
                              <div key={h.id}>
                                <label className="flex items-center gap-2 cursor-pointer mb-1">
                                  <input type="checkbox" checked={val.checked}
                                    onChange={e => setEmpLeaves(p => ({ ...p, [h.id]: { ...val, checked: e.target.checked } }))}
                                    className="h-3.5 w-3.5 rounded border-gray-400 accent-blue-600" />
                                  <span className="text-xs font-medium text-gray-700">{h.name}</span>
                                </label>
                                <Input type="number" value={val.amount}
                                  onChange={e => setEmpLeaves(p => ({ ...p, [h.id]: { ...val, amount: e.target.value } }))}
                                  disabled={!val.checked}
                                  className={`h-8 text-sm ${!val.checked ? "bg-gray-100 text-gray-400" : "bg-white"}`}
                                  placeholder="0" />
                              </div>
                            );
                          })}
                          <div className="pt-2 border-t border-blue-200 flex justify-between text-xs font-bold text-blue-700 mt-1">
                            <span>Total Days</span>
                            <span>{leaveHeads.filter(h => empLeaves[h.id]?.checked).reduce((s, h) => s + (Number(empLeaves[h.id]?.amount) || 0), 0)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>{/* /form content */}

            {/* Footer */}
            <div className="px-6 pb-6 flex justify-end gap-3 border-t pt-4 sticky bottom-0 bg-white rounded-b-xl">
              <Button variant="outline" onClick={() => setEditing(null)}>
                <X className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
              <Button onClick={saveEdit} disabled={saving} className="bg-violet-600 hover:bg-violet-700 min-w-[140px] gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </PayrollLayout>
  );
}
