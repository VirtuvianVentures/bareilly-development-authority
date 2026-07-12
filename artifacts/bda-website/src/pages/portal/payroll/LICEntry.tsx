import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee { id: number; emp_code: string; name: string; designation: string; department: string; }
interface LicEntry {
  id: number;
  employee_id: number;
  emp_code: string;
  emp_name: string;
  policy_no: string;
  premium_amount: string;
  entry_date: string;
  remarks: string;
}

export default function LICEntry() {
  const [entries, setEntries] = useState<LicEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<LicEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [empId, setEmpId] = useState("");
  const [policyNo, setPolicyNo] = useState("");
  const [amount, setAmount] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [eRes, lRes] = await Promise.all([
        apiFetch("/employees"),
        apiFetch("/lic-entries"),
      ]);
      setEmployees(await eRes.json());
      setEntries(await lRes.json());
    } catch {
      toast({ title: "Failed to load data", variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const today = () => new Date().toISOString().slice(0, 10);

  const openAdd = () => {
    setEditItem(null);
    setEmpId(""); setPolicyNo(""); setAmount(""); setEntryDate(today()); setRemarks("");
    setShowForm(true);
  };

  const openEdit = (e: LicEntry) => {
    setEditItem(e);
    setEmpId(String(e.employee_id));
    setPolicyNo(e.policy_no);
    setAmount(String(e.premium_amount));
    setEntryDate(e.entry_date ? e.entry_date.slice(0, 10) : today());
    setRemarks(e.remarks || "");
    setShowForm(true);
  };

  const save = async () => {
    if (!empId) { toast({ title: "Please select an employee", variant: "destructive" }); return; }
    if (!policyNo.trim()) { toast({ title: "Policy No. is required", variant: "destructive" }); return; }
    if (!amount || Number(amount) <= 0) { toast({ title: "Premium Amount is required", variant: "destructive" }); return; }

    const emp = employees.find(e => e.id === Number(empId));
    setSaving(true);
    try {
      if (editItem) {
        await apiFetch(`/lic-entries/${editItem.id}`, {
          method: "PUT",
          body: JSON.stringify({ policy_no: policyNo, premium_amount: Number(amount), entry_date: entryDate || null, remarks }),
        });
        toast({ title: "LIC Entry updated successfully" });
      } else {
        await apiFetch("/lic-entries", {
          method: "POST",
          body: JSON.stringify({
            employee_id: Number(empId),
            emp_code: emp?.emp_code || "",
            emp_name: emp?.name || "",
            policy_no: policyNo,
            premium_amount: Number(amount),
            entry_date: entryDate || null,
            remarks,
          }),
        });
        toast({ title: "LIC Entry saved successfully" });
      }
      setShowForm(false);
      load();
    } catch {
      toast({ title: "Error saving entry", variant: "destructive" });
    }
    setSaving(false);
  };

  const remove = async (e: LicEntry) => {
    if (!confirm(`Delete Policy No. ${e.policy_no} for "${e.emp_name}"?`)) return;
    await apiFetch(`/lic-entries/${e.id}`, { method: "DELETE" });
    toast({ title: "Entry deleted" });
    load();
  };

  const totalPremium = entries.reduce((s, e) => s + Number(e.premium_amount), 0);

  return (
    <PayrollLayout title="LIC Entry">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" /> LIC Entry
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter employee LIC Policy Number and Premium Amount
            </p>
          </div>
          <Button onClick={openAdd} className="bg-[#1a3a6e] hover:bg-[#2a4d8a] gap-2">
            <Plus className="h-4 w-4" /> New Entry
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {editItem ? "Edit LIC Entry" : "New LIC Entry"}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Row 1: Employee Name | Policy No | Amount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Employee Name : <span className="text-red-500">*</span>
                </Label>
                {editItem ? (
                  <Input value={editItem.emp_name} disabled className="bg-gray-50" />
                ) : (
                  <select
                    value={empId}
                    onChange={e => setEmpId(e.target.value)}
                    className="w-full border border-[#4d9de0] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="">--Select--</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.name} {e.emp_code ? `(${e.emp_code})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Policy No. : <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={policyNo}
                  onChange={e => setPolicyNo(e.target.value)}
                  placeholder="Policy number"
                  className="border-[#4d9de0] focus:ring-blue-400"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">
                  Amount : <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Premium amount"
                  min={0}
                  className="border-[#4d9de0] focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Row 2: Entry Date | Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Entry Date :</Label>
                <Input
                  type="date"
                  value={entryDate}
                  onChange={e => setEntryDate(e.target.value)}
                  className="border-[#4d9de0]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-1 block">Remarks :</Label>
                <Input
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Remarks (optional)"
                  className="border-[#4d9de0]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button onClick={save} disabled={saving} className="bg-[#1a3a6e] hover:bg-[#2a4d8a] gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editItem ? "Update" : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {/* Stats bar */}
          <div className="bg-[#1a3a6e] px-5 py-3 flex items-center justify-between">
            <span className="text-white text-sm font-medium">
              Total Entries: <strong>{entries.length}</strong>
            </span>
            <span className="text-white text-sm font-medium">
              Total Premium: <strong>₹{totalPremium.toLocaleString("en-IN")}</strong>
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No LIC entries found</p>
              <Button variant="outline" onClick={openAdd} className="mt-3 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add First Entry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Policy No.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Premium (₹)</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Entry Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remarks</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.map((e, idx) => (
                    <tr key={e.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{e.emp_name}</div>
                        {e.emp_code && <div className="text-xs text-gray-400">{e.emp_code}</div>}
                      </td>
                      <td className="px-4 py-3 font-mono text-blue-700">{e.policy_no}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {Number(e.premium_amount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {e.entry_date ? new Date(e.entry_date).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{e.remarks || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => openEdit(e)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Edit">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => remove(e)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PayrollLayout>
  );
}
