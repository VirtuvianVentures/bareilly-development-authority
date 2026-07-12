import { useState, useEffect, useRef, useCallback } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, X, Loader2, Users2, UserCheck, IndianRupee, FileBarChart, Search, Camera, PenLine, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ── Types ── */
interface Employee {
  id: number; empCode: string; name: string; fatherName: string;
  designation: string; department: string; category: string;
  employeeType: string; basicPay: string; grade: string; status: string;
  maritalStatus: string; aadharCard: string; lastQualification: string;
  sex: string; dob: string; doa: string; joinDate: string; retirementDate: string;
  empGroup: string; paybillGroup: string;
  payLevel: string; contributionType: string; incrMonth: string; incrPercent: string;
  gisLicNo: string; phone: string; centralized: boolean;
  email: string; address: string; panNo: string; gpfNo: string;
  bankAccount: string; branchSolId: string; bankName: string; ifsc: string;
  pfAccount: string; cpfAccount: string; cboRegNo: string; pran: string;
  isNpsDeduction: boolean;
  photoUrl: string; signatureUrl: string;
  isSuspended: boolean; isRetired: boolean; isDisabled: boolean;
  isTransferred: boolean; isPensionable: boolean;
}

interface Payroll { id: number; empCode: string; empName: string; month: number; year: number; grossPay: string; totalDeductions: string; netPay: string; status: string; }
interface ReportRow { id: number; empCode: string; empName: string; designation: string; department: string; basicPay: string; da: string; hra: string; ta: string; otherAllowances: string; grossPay: string; gpf: string; nps: string; incomeTax: string; otherDeductions: string; totalDeductions: string; netPay: string; status: string; }

/* ── Constants ── */
const MONTHS_LONG = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const LEVELS = Array.from({ length: 20 }, (_, i) => String(i + 1));

const emptyEmp: Record<string, any> = {
  empCode: "", name: "", fatherName: "", designation: "", department: "",
  category: "regular", employeeType: "other",
  maritalStatus: "Unmarried", aadharCard: "", lastQualification: "",
  sex: "M", dob: "", doa: "", joinDate: "", retirementDate: "",
  empGroup: "", paybillGroup: "",
  payLevel: "", contributionType: "GPF", incrMonth: "", incrPercent: "",
  gisLicNo: "", phone: "", centralized: false,
  email: "", address: "", panNo: "", gpfNo: "", basicPay: "", grade: "",
  bankAccount: "", branchSolId: "", bankName: "", ifsc: "",
  pfAccount: "", cpfAccount: "", cboRegNo: "", pran: "",
  isNpsDeduction: false,
  photoUrl: "", signatureUrl: "",
  isSuspended: false, isRetired: false, isDisabled: false,
  isTransferred: false, isPensionable: false,
  status: "active",
};


/* ── Helpers ── */
const fmtDate = (d: string) => d ? d.split("T")[0] : "—";
const bool2txt = (v: any) => (v === true || v === "true") ? "Yes" : "No";

/* ── File → base64 ── */
function fileToBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export default function PayrollModule() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls]   = useState<Payroll[]>([]);
  const [loadingEmp, setLoadingEmp] = useState(true);
  const [loadingPay, setLoadingPay] = useState(true);
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [empForm, setEmpForm] = useState<any>({ ...emptyEmp });
  const [payForm, setPayForm] = useState<any>({ employeeId: 0, empCode: "", empName: "", month: new Date().getMonth() + 1, year: new Date().getFullYear(), basicPay: "0", da: "0", hra: "0", ta: "0", otherAllowances: "0", gpf: "0", nps: "0", incomeTax: "0", otherDeductions: "0", grossPay: "0", totalDeductions: "0", netPay: "0", status: "draft" });
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState("");
  const { toast } = useToast();

  /* Masters */
  const [designations,    setDesignations]    = useState<string[]>([]);
  const [branches,        setBranches]        = useState<string[]>([]);
  const [banks,           setBanks]           = useState<string[]>([]);
  const [qualifications,  setQualifications]  = useState<string[]>([]);
  const [groups,          setGroups]          = useState<string[]>([]);
  const [paybillGroups,   setPaybillGroups]   = useState<string[]>([]);

  /* Salary heads (from DB) */
  interface SalaryHead { id: number; name: string; amount: string; default_days?: string; }
  const [allowanceHeads, setAllowanceHeads] = useState<SalaryHead[]>([]);
  const [deductionHeads, setDeductionHeads] = useState<SalaryHead[]>([]);
  const [leaveHeads,     setLeaveHeads]     = useState<SalaryHead[]>([]);
  /* Per-employee values while form is open — key = head id */
  /* { amount/days: string, checked: boolean } */
  interface HeadVal { amount: string; checked: boolean; }
  const [empAllowances, setEmpAllowances] = useState<Record<number, HeadVal>>({});
  const [empDeductions, setEmpDeductions] = useState<Record<number, HeadVal>>({});
  const [empLeaves,     setEmpLeaves]     = useState<Record<number, HeadVal>>({});

  const loadHeads = async () => {
    try {
      const [ar, dr, lr] = await Promise.all([
        apiFetch("/allowance-heads"),
        apiFetch("/deduction-heads"),
        apiFetch("/leave-heads"),
      ]);
      const ah: SalaryHead[] = await ar.json();
      const dh: SalaryHead[] = await dr.json();
      const lh: SalaryHead[] = await lr.json();
      setAllowanceHeads(ah); setDeductionHeads(dh); setLeaveHeads(lh);
    } catch {}
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
    loadEmp(); loadPay(); loadHeads();
  }, []);

  const loadEmp = async () => { setLoadingEmp(true); try { const r = await apiFetch("/employees"); setEmployees(await r.json()); } catch {} setLoadingEmp(false); };
  const loadPay = async () => { setLoadingPay(true); try { const r = await apiFetch("/payroll"); setPayrolls(await r.json()); } catch {} setLoadingPay(false); };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEmpForm((p: any) => ({ ...p, [key]: e.target.value }));
  const setVal = (key: string, val: any) => setEmpForm((p: any) => ({ ...p, [key]: val }));

  /* File upload handler */
  const handleFile = useCallback(async (key: "photoUrl" | "signatureUrl", file: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast({ title: "File too large (max 2MB)", variant: "destructive" }); return; }
    const b64 = await fileToBase64(file);
    setVal(key, b64);
  }, []);

  /* Build default HeadVal maps from master lists */
  const buildDefaults = () => {
    const defA: Record<number, HeadVal> = {};
    const defD: Record<number, HeadVal> = {};
    const defL: Record<number, HeadVal> = {};
    allowanceHeads.forEach(h => (defA[h.id] = { amount: String(h.amount), checked: false }));
    deductionHeads.forEach(h => (defD[h.id] = { amount: String(h.amount), checked: false }));
    leaveHeads.forEach(h  => (defL[h.id]  = { amount: String(h.default_days ?? "0"), checked: false }));
    return { defA, defD, defL };
  };

  /* Open Add form — initialise with master defaults, all unchecked */
  const openAddEmp = () => {
    setEditEmp(null);
    setEmpForm({ ...emptyEmp });
    const { defA, defD, defL } = buildDefaults();
    setEmpAllowances(defA); setEmpDeductions(defD); setEmpLeaves(defL);
    setShowEmpForm(true);
  };

  /* Open Edit form — load employee-specific amounts + is_applicable */
  const openEditEmp = async (e: Employee) => {
    setEditEmp(e);
    setEmpForm({ ...e });
    const { defA, defD, defL } = buildDefaults();
    try {
      const [ar, dr, lr] = await Promise.all([
        apiFetch(`/employees/${e.id}/allowances`),
        apiFetch(`/employees/${e.id}/deductions`),
        apiFetch(`/employees/${e.id}/leaves`),
      ]);
      const aVals = await ar.json();
      const dVals = await dr.json();
      const lVals = await lr.json();
      aVals.forEach((v: any) => { defA[v.allowance_head_id] = { amount: String(v.amount), checked: v.is_applicable !== false }; });
      dVals.forEach((v: any) => { defD[v.deduction_head_id] = { amount: String(v.amount), checked: v.is_applicable !== false }; });
      lVals.forEach((v: any) => { defL[v.leave_head_id]     = { amount: String(v.days),   checked: v.is_applicable !== false }; });
    } catch {}
    setEmpAllowances(defA); setEmpDeductions(defD); setEmpLeaves(defL);
    setShowEmpForm(true);
  };

  const saveEmp = async () => {
    if (!empForm.empCode?.trim() || !empForm.name?.trim()) { toast({ title: "Emp Code & Name required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      let empId = editEmp?.id;
      if (editEmp) {
        await apiFetch(`/employees/${editEmp.id}`, { method: "PUT", body: JSON.stringify(empForm) });
      } else {
        const r = await apiFetch("/employees", { method: "POST", body: JSON.stringify(empForm) });
        const data = await r.json();
        empId = data.id;
      }
      if (empId) {
        const aEntries = allowanceHeads.map(h => ({
          allowanceHeadId: h.id,
          amount: Number(empAllowances[h.id]?.amount ?? h.amount) || 0,
          isApplicable: empAllowances[h.id]?.checked ?? false,
        }));
        const dEntries = deductionHeads.map(h => ({
          deductionHeadId: h.id,
          amount: Number(empDeductions[h.id]?.amount ?? h.amount) || 0,
          isApplicable: empDeductions[h.id]?.checked ?? false,
        }));
        const lEntries = leaveHeads.map(h => ({
          leaveHeadId: h.id,
          days: Number(empLeaves[h.id]?.amount ?? h.default_days ?? 0) || 0,
          isApplicable: empLeaves[h.id]?.checked ?? false,
        }));
        await Promise.all([
          aEntries.length ? apiFetch(`/employees/${empId}/allowances`, { method: "PUT", body: JSON.stringify(aEntries) }) : Promise.resolve(),
          dEntries.length ? apiFetch(`/employees/${empId}/deductions`, { method: "PUT", body: JSON.stringify(dEntries) }) : Promise.resolve(),
          lEntries.length ? apiFetch(`/employees/${empId}/leaves`,     { method: "PUT", body: JSON.stringify(lEntries) }) : Promise.resolve(),
        ]);
      }
      toast({ title: editEmp ? "Employee updated" : "Employee added" });
      setShowEmpForm(false); loadEmp();
    } catch (err: any) { toast({ title: "Error: " + (err?.message || ""), variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const savePay = async () => {
    const gross = Number(payForm.basicPay)+Number(payForm.da)+Number(payForm.hra)+Number(payForm.ta)+Number(payForm.otherAllowances);
    const ded   = Number(payForm.gpf)+Number(payForm.nps)+Number(payForm.incomeTax)+Number(payForm.otherDeductions);
    setSaving(true);
    try {
      await apiFetch("/payroll", { method: "POST", body: JSON.stringify({ ...payForm, grossPay: String(gross), totalDeductions: String(ded), netPay: String(gross - ded) }) });
      toast({ title: "Payroll record created" }); setShowPayForm(false); loadPay();
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const fmt = (v: string | number) => `₹${Number(v).toLocaleString("en-IN")}`;
  const filtered = employees.filter(e => !search || e.empCode?.toLowerCase().includes(search.toLowerCase()) || e.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <PayrollLayout title="Payroll Management System">
      <div className="max-w-full mx-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Employees", value: employees.length, icon: Users2, color: "bg-violet-600" },
            { label: "Officers", value: employees.filter(e => e.employeeType === "officer").length, icon: UserCheck, color: "bg-blue-600" },
            { label: "Other Staff", value: employees.filter(e => e.employeeType === "other").length, icon: Users2, color: "bg-teal-600" },
            { label: "Payroll Records", value: payrolls.length, icon: IndianRupee, color: "bg-green-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${s.color} w-11 h-11 rounded-lg flex items-center justify-center shrink-0`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div><p className="text-2xl font-bold text-gray-800">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="employees">
          <TabsList>
            <TabsTrigger value="employees">Employee Register</TabsTrigger>
            <TabsTrigger value="payroll">Salary Records</TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1.5">
              <FileBarChart className="h-3.5 w-3.5" /> Reports
            </TabsTrigger>
          </TabsList>

          {/* ══ EMPLOYEES TAB ══ */}
          <TabsContent value="employees">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-3">
              <div className="flex items-center justify-between px-5 py-4 border-b gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Search className="h-4 w-4 text-gray-400 shrink-0" />
                  <Input placeholder="Search by code or name…" value={search} onChange={e => setSearch(e.target.value)} className="h-8 text-sm" />
                </div>
                <Button onClick={openAddEmp} className="bg-violet-600 hover:bg-violet-700 gap-2 text-sm shrink-0">
                  <Plus className="h-4 w-4" /> Add Employee
                </Button>
              </div>
              {loadingEmp ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs whitespace-nowrap">
                    <thead>
                      <tr className="bg-[#1a3a6e] text-white">
                        {["Sr","Photo","Emp Code","Emp Name","Designation","Sex","DOB","DOJ","DOR","Level","Salary A/C","Branch Sol ID","PF A/C","PAN","Mobile","Type","Status","Flags","Action"].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.length === 0 && <tr><td colSpan={19} className="text-center py-10 text-gray-400">No employees found.</td></tr>}
                      {filtered.map((e, i) => (
                        <tr key={e.id} className="hover:bg-violet-50/30 transition-colors">
                          <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                          <td className="px-2 py-1">
                            {e.photoUrl
                              ? <img src={e.photoUrl} alt="" className="w-8 h-9 object-cover rounded border border-gray-200" />
                              : <div className="w-8 h-9 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"><Camera className="h-3 w-3 text-gray-300" /></div>
                            }
                          </td>
                          <td className="px-3 py-1.5 font-mono text-gray-700 font-medium">{e.empCode}</td>
                          <td className="px-3 py-1.5 font-medium text-gray-800 max-w-[160px] truncate">{e.name}</td>
                          <td className="px-3 py-1.5 text-gray-600">{e.designation || "—"}</td>
                          <td className="px-3 py-1.5 text-gray-600">{e.sex || "—"}</td>
                          <td className="px-3 py-1.5 text-gray-500">{fmtDate(e.dob)}</td>
                          <td className="px-3 py-1.5 text-gray-500">{fmtDate(e.joinDate)}</td>
                          <td className="px-3 py-1.5 text-gray-500">{fmtDate(e.retirementDate)}</td>
                          <td className="px-3 py-1.5 text-center font-medium text-gray-600">{e.payLevel || "—"}</td>
                          <td className="px-3 py-1.5 font-mono text-gray-600">{e.bankAccount || "—"}</td>
                          <td className="px-3 py-1.5 font-mono text-gray-600">{e.branchSolId || "—"}</td>
                          <td className="px-3 py-1.5 font-mono text-gray-600">{e.pfAccount || "—"}</td>
                          <td className="px-3 py-1.5 text-gray-600">{e.panNo || "—"}</td>
                          <td className="px-3 py-1.5 text-gray-600">{e.phone || "—"}</td>
                          <td className="px-3 py-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${e.employeeType === "officer" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                              {e.employeeType === "officer" ? "Officer" : "Staff"}
                            </span>
                          </td>
                          <td className="px-3 py-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${e.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{e.status}</span>
                          </td>
                          <td className="px-3 py-1.5">
                            <div className="flex gap-1 flex-wrap">
                              {e.isSuspended  && <span className="px-1 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-semibold">SUS</span>}
                              {e.isRetired    && <span className="px-1 py-0.5 bg-orange-100 text-orange-600 rounded text-[10px] font-semibold">RET</span>}
                              {e.isDisabled   && <span className="px-1 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-semibold">DIS</span>}
                              {e.isTransferred && <span className="px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded text-[10px] font-semibold">TRF</span>}
                              {e.isPensionable && <span className="px-1 py-0.5 bg-teal-100 text-teal-700 rounded text-[10px] font-semibold">PEN</span>}
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <Button size="sm" variant="ghost" onClick={() => openEditEmp(e)}>
                              <Pencil className="h-3.5 w-3.5 text-blue-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ══ SALARY RECORDS TAB ══ */}
          <TabsContent value="payroll">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-3">
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h3 className="font-bold text-gray-800">Salary Records</h3>
                <Button onClick={() => setShowPayForm(true)} className="bg-violet-600 hover:bg-violet-700 gap-2 text-sm">
                  <Plus className="h-4 w-4" /> Process Salary
                </Button>
              </div>
              {loadingPay ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-[#1a3a6e] text-white">{["Emp Code","Name","Month/Year","Gross Pay","Deductions","Net Pay","Status"].map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {payrolls.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No payroll records yet.</td></tr>}
                      {payrolls.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-mono text-xs">{p.empCode}</td>
                          <td className="px-4 py-2.5 font-medium">{p.empName}</td>
                          <td className="px-4 py-2.5">{MONTHS_SHORT[p.month - 1]} {p.year}</td>
                          <td className="px-4 py-2.5">{fmt(p.grossPay)}</td>
                          <td className="px-4 py-2.5 text-red-600">{fmt(p.totalDeductions)}</td>
                          <td className="px-4 py-2.5 font-bold text-green-700">{fmt(p.netPay)}</td>
                          <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${p.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reports"><SalaryReportTab employees={employees} /></TabsContent>
        </Tabs>
      </div>

      {/* ══════════════════════════════════════════════
          EMPLOYEE FORM MODAL
      ══════════════════════════════════════════════ */}
      {showEmpForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-2 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl my-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#1a3a6e] rounded-t-xl sticky top-0 z-10">
              <h3 className="font-bold text-white text-lg">{editEmp ? "Edit Employee" : "Add New Employee"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEmpForm(false)} className="text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
            </div>

            <div className="px-6 py-5 space-y-7">

              {/* Employee Type */}
              <div>
                <SectionTitle>Employee Type</SectionTitle>
                <div className="flex gap-3 mt-2">
                  {[{ value: "officer", label: "Officer" }, { value: "other", label: "Staff" }].map(opt => (
                    <button key={opt.value} type="button" onClick={() => setVal("employeeType", opt.value)}
                      className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-semibold transition-colors ${empForm.employeeType === opt.value ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Section: Basic Information ── */}
              <Section title="Basic Information">
                <F label="Emp Code *"><Input value={empForm.empCode || ""} onChange={set("empCode")} placeholder="e.g. 1284555" /></F>
                <F label="Full Name *"><Input value={empForm.name || ""} onChange={set("name")} placeholder="Full name" /></F>
                <F label="Father's Name"><Input value={empForm.fatherName || ""} onChange={set("fatherName")} /></F>
                <F label="Sex">
                  <Sel value={empForm.sex || "M"} onChange={set("sex")}>
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
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
                <F label="Aadhar Card No."><Input value={empForm.aadharCard || ""} onChange={set("aadharCard")} placeholder="12-digit Aadhar number" maxLength={12} /></F>
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

              {/* ── Section: Service Details ── */}
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
                  ) : <Input value={empForm.paybillGroup || ""} onChange={set("paybillGroup")} placeholder="e.g. BDA-001" />}
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
                <F label="Increment %"><Input type="number" value={empForm.incrPercent || ""} onChange={set("incrPercent")} placeholder="e.g. 3" /></F>
                <F label="DOB (Date of Birth)"><Input type="date" value={empForm.dob || ""} onChange={set("dob")} /></F>
                <F label="DOA (Date of Appointment)"><Input type="date" value={empForm.doa || ""} onChange={set("doa")} /></F>
                <F label="DOJ (Date of Joining)"><Input type="date" value={empForm.joinDate || ""} onChange={set("joinDate")} /></F>
                <F label="DOR (Date of Retirement)"><Input type="date" value={empForm.retirementDate || ""} onChange={set("retirementDate")} /></F>
                <F label="GIS LIC No"><Input value={empForm.gisLicNo || ""} onChange={set("gisLicNo")} /></F>
                <F label="Basic Pay (₹)"><Input type="number" value={empForm.basicPay || ""} onChange={set("basicPay")} /></F>
                <F label="Grade"><Input value={empForm.grade || ""} onChange={set("grade")} /></F>
                <F label="GPF No."><Input value={empForm.gpfNo || ""} onChange={set("gpfNo")} /></F>
                <F label="Centralized">
                  <Sel value={empForm.centralized === true || empForm.centralized === "true" ? "true" : "false"} onChange={e => setVal("centralized", e.target.value === "true")}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Sel>
                </F>
                <F label="Status">
                  <Sel value={empForm.status || "active"} onChange={set("status")}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Sel>
                </F>
              </Section>

              {/* ── Section: Account & Financial Details ── */}
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
                  <Sel value={empForm.isNpsDeduction === true || empForm.isNpsDeduction === "true" ? "true" : "false"} onChange={e => setVal("isNpsDeduction", e.target.value === "true")}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Sel>
                </F>
              </Section>

              {/* ── Section: Upload Photo & Signature ── */}
              <Section title="Photo & Signature Upload">
                {/* Photo */}
                <F label="Employee Photo" wide={false}>
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
                      <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
                        onChange={e => handleFile("photoUrl", e.target.files?.[0] ?? null)} />
                    </label>
                    {empForm.photoUrl && (
                      <button type="button" onClick={() => setVal("photoUrl", "")} className="text-[10px] text-red-500 hover:text-red-700 underline">Remove photo</button>
                    )}
                  </div>
                </F>

                {/* Signature */}
                <F label="Employee Signature" wide={false}>
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
                      <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
                        onChange={e => handleFile("signatureUrl", e.target.files?.[0] ?? null)} />
                    </label>
                    {empForm.signatureUrl && (
                      <button type="button" onClick={() => setVal("signatureUrl", "")} className="text-[10px] text-red-500 hover:text-red-700 underline">Remove signature</button>
                    )}
                  </div>
                </F>
              </Section>

              {/* ── Section: Status Flags ── */}
              <div>
                <SectionTitle>Status Flags</SectionTitle>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                  {([
                    { key: "isSuspended",  label: "Suspended",   color: "red" },
                    { key: "isRetired",    label: "Retired",     color: "orange" },
                    { key: "isDisabled",   label: "Disable A/C", color: "gray" },
                    { key: "isTransferred",label: "Transferred", color: "yellow" },
                    { key: "isPensionable",label: "Pensionable", color: "teal" },
                  ] as const).map(({ key, label, color }) => {
                    const active = empForm[key] === true || empForm[key] === "true";
                    const colorMap: Record<string, string> = {
                      red: "border-red-400 bg-red-50 text-red-700",
                      orange: "border-orange-400 bg-orange-50 text-orange-700",
                      gray: "border-gray-400 bg-gray-100 text-gray-700",
                      yellow: "border-yellow-400 bg-yellow-50 text-yellow-700",
                      teal: "border-teal-400 bg-teal-50 text-teal-700",
                    };
                    return (
                      <button key={key} type="button" onClick={() => setVal(key, !active)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all font-medium text-sm ${active ? colorMap[color] : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${active ? "border-current bg-current" : "border-gray-300"}`}>
                          {active && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Section: Allowances, Deductions & Leaves ── */}
              {(allowanceHeads.length > 0 || deductionHeads.length > 0 || leaveHeads.length > 0) && (
                <div>
                  <SectionTitle>Allowances, Deductions &amp; Leaves</SectionTitle>
                  <p className="text-[11px] text-gray-400 mt-1 mb-3">Check the box to enable a head for this employee. Uncheck to exclude from salary calculation.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* ── Allowances column ── */}
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
                                  <input
                                    type="checkbox"
                                    checked={val.checked}
                                    onChange={e => setEmpAllowances(p => ({ ...p, [h.id]: { ...val, checked: e.target.checked } }))}
                                    className="h-3.5 w-3.5 rounded border-gray-400 accent-green-600"
                                  />
                                  <span className="text-xs font-medium text-gray-700">{h.name}</span>
                                </label>
                                <Input
                                  type="number"
                                  value={val.amount}
                                  onChange={e => setEmpAllowances(p => ({ ...p, [h.id]: { ...val, amount: e.target.value } }))}
                                  disabled={!val.checked}
                                  className={`h-8 text-sm ${!val.checked ? "bg-gray-100 text-gray-400" : "bg-white"}`}
                                  placeholder="0"
                                />
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

                    {/* ── Deductions column ── */}
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
                                  <input
                                    type="checkbox"
                                    checked={val.checked}
                                    onChange={e => setEmpDeductions(p => ({ ...p, [h.id]: { ...val, checked: e.target.checked } }))}
                                    className="h-3.5 w-3.5 rounded border-gray-400 accent-red-600"
                                  />
                                  <span className="text-xs font-medium text-gray-700">{h.name}</span>
                                </label>
                                <Input
                                  type="number"
                                  value={val.amount}
                                  onChange={e => setEmpDeductions(p => ({ ...p, [h.id]: { ...val, amount: e.target.value } }))}
                                  disabled={!val.checked}
                                  className={`h-8 text-sm ${!val.checked ? "bg-gray-100 text-gray-400" : "bg-white"}`}
                                  placeholder="0"
                                />
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

                    {/* ── Leaves column ── */}
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
                                  <input
                                    type="checkbox"
                                    checked={val.checked}
                                    onChange={e => setEmpLeaves(p => ({ ...p, [h.id]: { ...val, checked: e.target.checked } }))}
                                    className="h-3.5 w-3.5 rounded border-gray-400 accent-blue-600"
                                  />
                                  <span className="text-xs font-medium text-gray-700">{h.name}</span>
                                </label>
                                <Input
                                  type="number"
                                  value={val.amount}
                                  onChange={e => setEmpLeaves(p => ({ ...p, [h.id]: { ...val, amount: e.target.value } }))}
                                  disabled={!val.checked}
                                  className={`h-8 text-sm ${!val.checked ? "bg-gray-100 text-gray-400" : "bg-white"}`}
                                  placeholder="0"
                                />
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
              <Button variant="outline" onClick={() => setShowEmpForm(false)}>Cancel</Button>
              <Button onClick={saveEmp} disabled={saving} className="bg-violet-600 hover:bg-violet-700 min-w-[140px]">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editEmp ? "Save Changes" : "Add Employee"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ PAYROLL FORM MODAL ══ */}
      {showPayForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-[#1a3a6e] rounded-t-xl">
              <h3 className="font-bold text-white">Process Salary</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPayForm(false)} className="text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <Label className="text-xs text-gray-600">Select Employee</Label>
                <select value={payForm.empCode} onChange={e => { const emp = employees.find(x => x.empCode === e.target.value); setPayForm((p: any) => ({ ...p, empCode: e.target.value, empName: emp?.name || "", employeeId: emp?.id || 0, basicPay: emp?.basicPay || "0" })); }} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                  <option value="">-- Select Employee --</option>
                  {employees.map(e => <option key={e.empCode} value={e.empCode}>{e.empCode} — {e.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-gray-600">Month</Label>
                  <select value={payForm.month} onChange={e => setPayForm((p: any) => ({ ...p, month: Number(e.target.value) }))} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                    {MONTHS_SHORT.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div><Label className="text-xs text-gray-600">Year</Label><Input type="number" value={payForm.year} onChange={e => setPayForm((p: any) => ({ ...p, year: Number(e.target.value) }))} className="mt-1" /></div>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-1">Earnings</p>
              <div className="grid grid-cols-2 gap-3">
                {[["Basic Pay","basicPay"],["DA","da"],["HRA","hra"],["TA","ta"],["Other Allowances","otherAllowances"]].map(([l, k]) => (
                  <div key={k}><Label className="text-xs text-gray-600">{l} (₹)</Label><Input type="number" value={payForm[k]} onChange={e => setPayForm((p: any) => ({ ...p, [k]: e.target.value }))} className="mt-1" /></div>
                ))}
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider pt-1">Deductions</p>
              <div className="grid grid-cols-2 gap-3">
                {[["GPF","gpf"],["NPS","nps"],["Income Tax","incomeTax"],["Other Deductions","otherDeductions"]].map(([l, k]) => (
                  <div key={k}><Label className="text-xs text-gray-600">{l} (₹)</Label><Input type="number" value={payForm[k]} onChange={e => setPayForm((p: any) => ({ ...p, [k]: e.target.value }))} className="mt-1" /></div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between"><span className="text-gray-500">Gross Pay</span><span className="font-semibold">₹{(Number(payForm.basicPay)+Number(payForm.da)+Number(payForm.hra)+Number(payForm.ta)+Number(payForm.otherAllowances)).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Deductions</span><span className="font-semibold text-red-600">₹{(Number(payForm.gpf)+Number(payForm.nps)+Number(payForm.incomeTax)+Number(payForm.otherDeductions)).toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between pt-1 border-t font-bold"><span>Net Pay</span><span className="text-green-700">₹{(Number(payForm.basicPay)+Number(payForm.da)+Number(payForm.hra)+Number(payForm.ta)+Number(payForm.otherAllowances)-Number(payForm.gpf)-Number(payForm.nps)-Number(payForm.incomeTax)-Number(payForm.otherDeductions)).toLocaleString("en-IN")}</span></div>
              </div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowPayForm(false)}>Cancel</Button>
              <Button onClick={savePay} disabled={saving} className="bg-violet-600 hover:bg-violet-700">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Process Salary
              </Button>
            </div>
          </div>
        </div>
      )}
    </PayrollLayout>
  );
}

/* ═══════════════════════════════════
   Helper UI Components
═══════════════════════════════════ */
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

/* ════════════════════════════════════════════
   SALARY REPORT TAB
═══════════════════════════════════════════ */
function SalaryReportTab({ employees }: { employees: Employee[] }) {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear  = new Date().getFullYear();
  const [reportType, setReportType] = useState<"officer" | "other">("officer");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear]   = useState(currentYear);
  const [rows, setRows]   = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchReport = async () => {
    setLoading(true); setFetched(false);
    try { const r = await apiFetch(`/payroll/report?month=${month}&year=${year}&type=${reportType}`); setRows(await r.json()); setFetched(true); }
    catch { setRows([]); setFetched(true); }
    finally { setLoading(false); }
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><head><title>Salary Report</title><style>body{font-family:Arial,sans-serif;font-size:11px;margin:20px}h2{text-align:center;font-size:14px}h3{text-align:center;font-size:12px;font-weight:normal}table{width:100%;border-collapse:collapse}th,td{border:1px solid #999;padding:4px 6px;text-align:right}th{background:#e8e8e8;font-size:10px;text-align:center}td:first-child,td:nth-child(2),td:nth-child(3){text-align:left}.total-row td{font-weight:bold;background:#f5f5f5}@media print{body{margin:10mm}}</style></head><body>${content}</body></html>`);
    win.document.close(); win.print();
  };

  const fmt = (v: string | number) => Number(v).toLocaleString("en-IN");
  const totals = rows.reduce((acc, r) => ({
    basicPay: acc.basicPay+Number(r.basicPay), da: acc.da+Number(r.da), hra: acc.hra+Number(r.hra), ta: acc.ta+Number(r.ta),
    otherAllowances: acc.otherAllowances+Number(r.otherAllowances), grossPay: acc.grossPay+Number(r.grossPay),
    gpf: acc.gpf+Number(r.gpf), nps: acc.nps+Number(r.nps), incomeTax: acc.incomeTax+Number(r.incomeTax),
    otherDeductions: acc.otherDeductions+Number(r.otherDeductions), totalDeductions: acc.totalDeductions+Number(r.totalDeductions), netPay: acc.netPay+Number(r.netPay),
  }), { basicPay:0,da:0,hra:0,ta:0,otherAllowances:0,grossPay:0,gpf:0,nps:0,incomeTax:0,otherDeductions:0,totalDeductions:0,netPay:0 });

  return (
    <div className="mt-3 space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4">Generate Salary Report</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div><Label className="text-xs text-gray-600">Report Type</Label>
            <select value={reportType} onChange={e => setReportType(e.target.value as "officer" | "other")} className="mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm">
              <option value="officer">Officer Salary Statement</option>
              <option value="other">Staff Salary Statement</option>
            </select>
          </div>
          <div><Label className="text-xs text-gray-600">Month</Label>
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="mt-1 border border-gray-200 rounded-md px-3 py-2 text-sm">
              {MONTHS_LONG.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div><Label className="text-xs text-gray-600">Year</Label><Input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="w-28" /></div>
          <Button onClick={fetchReport} disabled={loading} className="bg-[#1a3a6e] hover:bg-[#0d2447]">
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Generate
          </Button>
          {fetched && rows.length > 0 && <Button onClick={handlePrint} variant="outline">Print / Export</Button>}
        </div>
      </div>
      {fetched && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto" ref={printRef}>
          <h2 className="text-center text-base font-bold pt-5 px-5">Bareilly Development Authority</h2>
          <h3 className="text-center text-sm text-gray-600 pb-4 px-5">
            {reportType === "officer" ? "Officer Salary Statement" : "Staff Salary Statement"} — {MONTHS_LONG[month-1]} {year}
          </h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1a3a6e] text-white">
                {["Sr","Emp Code","Name","Designation","Basic","DA","HRA","TA","Other","Gross","GPF","NPS","Tax","Other Ded.","Total Ded.","Net Pay"].map(h => (
                  <th key={h} className="px-3 py-2.5 text-right first:text-left whitespace-nowrap text-xs font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rows.length === 0
                ? <tr><td colSpan={16} className="text-center py-10 text-gray-400">No records found for this period.</td></tr>
                : rows.map((r, i) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-400">{i+1}</td>
                      <td className="px-3 py-2 font-mono">{r.empCode}</td>
                      <td className="px-3 py-2 font-medium max-w-[140px] truncate">{r.empName}</td>
                      <td className="px-3 py-2 text-gray-600">{r.designation}</td>
                      {[r.basicPay,r.da,r.hra,r.ta,r.otherAllowances,r.grossPay,r.gpf,r.nps,r.incomeTax,r.otherDeductions,r.totalDeductions,r.netPay].map((v, vi) => (
                        <td key={vi} className="px-3 py-2 text-right">{fmt(v)}</td>
                      ))}
                    </tr>
                  ))
              }
              {rows.length > 0 && (
                <tr className="bg-gray-100 font-bold">
                  <td colSpan={4} className="px-3 py-2.5 text-right text-xs uppercase">TOTAL</td>
                  {[totals.basicPay,totals.da,totals.hra,totals.ta,totals.otherAllowances,totals.grossPay,totals.gpf,totals.nps,totals.incomeTax,totals.otherDeductions,totals.totalDeductions,totals.netPay].map((v, vi) => (
                    <td key={vi} className="px-3 py-2.5 text-right">{fmt(v)}</td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
