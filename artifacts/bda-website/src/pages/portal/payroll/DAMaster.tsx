import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/adminApi";

interface DARecord {
  id: number;
  paybill_group: string;
  da_from: string | null;
  da_upto: string | null;
  da_percent: string;
  is_active: boolean;
}

interface FormState {
  paybillGroup: string;
  daFrom: string;
  daUpto: string;
  daPercent: string;
}


const emptyForm = (): FormState => ({ paybillGroup: "", daFrom: "", daUpto: "", daPercent: "" });

/* Determine active status from date range (client-side display only) */
function isCurrentlyActive(r: DARecord): boolean {
  if (!r.is_active) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (r.da_upto) {
    const upto = new Date(r.da_upto);
    upto.setHours(0, 0, 0, 0);
    if (upto < today) return false;
  }
  if (r.da_from) {
    const from = new Date(r.da_from);
    from.setHours(0, 0, 0, 0);
    if (from > today) return false;
  }
  return true;
}

export default function DAMaster() {
  const [records,       setRecords]       = useState<DARecord[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [showForm,      setShowForm]      = useState(false);
  const [editItem,      setEditItem]      = useState<DARecord | null>(null);
  const [form,          setForm]          = useState<FormState>(emptyForm());
  const [saving,        setSaving]        = useState(false);
  const [paybillGroups, setPaybillGroups] = useState<string[]>([]);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const r = await apiFetch("/da-master");
      const data = await r.json();
      setRecords(data);
    } catch {
      toast({ title: "Failed to load DA records", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    apiFetch("/payroll-masters/paybill-groups")
      .then(r => r.json())
      .then((data: any[]) => setPaybillGroups(data.filter(i => i.status === "active").map(i => i.name)))
      .catch(() => {});
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm());
    setShowForm(true);
  };
  const openEdit = (r: DARecord) => {
    setEditItem(r);
    setForm({
      paybillGroup: r.paybill_group,
      daFrom: r.da_from ?? "",
      daUpto: r.da_upto ?? "",
      daPercent: r.da_percent,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.paybillGroup || !form.daPercent) {
      toast({ title: "PayBill Group and DA Percent are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await apiFetch(`/da-master/${editItem.id}`, { method: "PUT", body: JSON.stringify(form) });
        toast({ title: "DA record updated successfully." });
      } else {
        await apiFetch("/da-master", { method: "POST", body: JSON.stringify(form) });
        toast({ title: "DA record added successfully." });
      }
      setShowForm(false);
      await load();
    } catch {
      toast({ title: "Save failed. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Are you sure you want to delete this DA record?")) return;
    try {
      await apiFetch(`/da-master/${id}`, { method: "DELETE" });
      toast({ title: "Record deleted." });
      await load();
    } catch {
      toast({ title: "Delete failed.", variant: "destructive" });
    }
  };

  const fmtDate = (d: string | null) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return d; }
  };

  return (
    <PayrollLayout title="DA Master">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">DA Master</h2>
            <p className="text-sm text-gray-500">
              Dearness Allowance rates — used automatically in Generate Salary
            </p>
          </div>
          <Button onClick={openAdd} className="bg-violet-600 hover:bg-violet-700 gap-2">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5 text-sm text-blue-800">
          <strong>Note:</strong> In Generate Salary, the DA rate is automatically picked from the record
          whose date range matches today's date. If no date-matched record is found, the latest active
          record is used as a fallback.
          &nbsp;Status is computed automatically — <strong>Active</strong> if today falls within DA From–Upto,
          <strong> Inactive</strong> after the end date passes.
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a6e] text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-14">S.No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">PayBill Group</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">DA From</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">DA Upto</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">DA %</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400">
                      <p className="text-sm">No records found. Click <span className="text-violet-600 font-semibold">Add New</span> to create one.</p>
                    </td>
                  </tr>
                ) : records.map((r, i) => {
                  const active = isCurrentlyActive(r);
                  return (
                    <tr key={r.id} className="hover:bg-violet-50/30 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{r.paybill_group || "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{fmtDate(r.da_from)}</td>
                      <td className="px-4 py-3 text-gray-600">{fmtDate(r.da_upto)}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-700 font-bold px-3 py-0.5 rounded-full text-xs">
                          {r.da_percent}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {active ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <XCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(r)} title="Edit">
                            <Pencil className="h-3.5 w-3.5 text-blue-500" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => remove(r.id)} title="Delete">
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">{editItem ? "Edit DA Record" : "Add DA Record"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* PayBill Group — Dropdown from PayBill Group Master */}
              <div>
                <Label className="text-xs font-semibold text-gray-600">
                  PayBill Group <span className="text-red-500">*</span>
                </Label>
                <select
                  value={form.paybillGroup}
                  onChange={e => setForm(p => ({ ...p, paybillGroup: e.target.value }))}
                  className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 py-2
                    text-sm ring-offset-background focus:outline-none focus:ring-2
                    focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">— Select PayBill Group —</option>
                  {paybillGroups.length === 0
                    ? <option disabled value="">No groups found — add from PayBill Group Master</option>
                    : paybillGroups.map(g => <option key={g} value={g}>{g}</option>)
                  }
                </select>
                {paybillGroups.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No active PayBill Groups found. Please add groups in{" "}
                    <a href="/portal/payroll/masters/paybill-group" className="underline font-semibold">
                      PayBill Group Master
                    </a>{" "}first.
                  </p>
                )}
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">DA From</Label>
                  <Input
                    type="date"
                    value={form.daFrom}
                    onChange={e => setForm(p => ({ ...p, daFrom: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">DA Upto</Label>
                  <Input
                    type="date"
                    value={form.daUpto}
                    onChange={e => setForm(p => ({ ...p, daUpto: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 -mt-2">
                Status is automatically set to <strong>Active</strong> while today is within the date range,
                and <strong>Inactive</strong> after the end date.
              </p>

              {/* DA Percent */}
              <div>
                <Label className="text-xs font-semibold text-gray-600">
                  DA Percent (%) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="200"
                  step="0.01"
                  value={form.daPercent}
                  onChange={e => setForm(p => ({ ...p, daPercent: e.target.value }))}
                  placeholder="e.g. 53"
                  className="mt-1"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This rate will be applied to Total Basic Pay in salary generation.
                </p>
              </div>
            </div>

            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                onClick={save}
                disabled={saving}
                className="bg-violet-600 hover:bg-violet-700 min-w-[110px]"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editItem ? "Save Changes" : "Add Record"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PayrollLayout>
  );
}
