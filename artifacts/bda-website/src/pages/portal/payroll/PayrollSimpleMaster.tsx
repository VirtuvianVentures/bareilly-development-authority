import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MasterRecord { id: number; name: string; status: "active" | "inactive"; }

interface Props {
  apiEndpoint: string;
  title: string;
  columnLabel: string;
  placeholder?: string;
}

export function PayrollSimpleMaster({ apiEndpoint, title, columnLabel, placeholder }: Props) {
  const [records,  setRecords]  = useState<MasterRecord[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MasterRecord | null>(null);
  const [name,     setName]     = useState("");
  const [status,   setStatus]   = useState<"active" | "inactive">("active");
  const [saving,   setSaving]   = useState(false);
  const { toast } = useToast();

  const loadRecords = () => {
    setLoading(true);
    apiFetch(`/payroll-masters/${apiEndpoint}`)
      .then(r => r.json())
      .then((data: unknown) => setRecords(Array.isArray(data) ? data as MasterRecord[] : []))
      .catch(() => toast({ title: "Failed to load records", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRecords(); }, [apiEndpoint]);

  const openAdd  = () => { setEditItem(null); setName(""); setStatus("active"); setShowForm(true); };
  const openEdit = (r: MasterRecord) => { setEditItem(r); setName(r.name); setStatus(r.status); setShowForm(true); };

  const save = async () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editItem) {
        await apiFetch(`/payroll-masters/${apiEndpoint}/${editItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), status }),
        });
        toast({ title: "Record updated" });
      } else {
        await apiFetch(`/payroll-masters/${apiEndpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), status }),
        });
        toast({ title: "Record added" });
      }
      setShowForm(false);
      loadRecords();
    } catch {
      toast({ title: "Failed to save record", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this record?")) return;
    try {
      await apiFetch(`/payroll-masters/${apiEndpoint}/${id}`, { method: "DELETE" });
      toast({ title: "Record deleted" });
      loadRecords();
    } catch {
      toast({ title: "Failed to delete record", variant: "destructive" });
    }
  };

  return (
    <PayrollLayout title={title}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{loading ? "Loading…" : `${records.length} record(s)`}</p>
          </div>
          <Button onClick={openAdd} className="bg-violet-600 hover:bg-violet-700 gap-2">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a3a6e] text-white">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-16">S.No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase">{columnLabel}</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-28">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-16 text-gray-400">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-violet-400" />
                  <p className="text-sm">Loading records…</p>
                </td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-16 text-gray-400">
                  <p className="text-sm">No records found. Click <span className="text-violet-600 font-semibold">Add New</span> to start.</p>
                </td></tr>
              ) : records.map((r, i) => (
                <tr key={r.id} className="hover:bg-violet-50/30 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5 text-blue-500" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">{editItem ? `Edit — ${editItem.name}` : `Add — ${title}`}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-600">{columnLabel} <span className="text-red-500">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder={placeholder || `Enter ${columnLabel}`} className="mt-1" onKeyDown={e => e.key === "Enter" && save()} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Status</Label>
                <div className="flex gap-5 mt-2">
                  {(["active", "inactive"] as const).map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" value={s} checked={status === s} onChange={() => setStatus(s)} className="accent-violet-600" />
                      <span className={`text-sm font-medium capitalize ${s === "active" ? "text-green-700" : "text-gray-500"}`}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-violet-600 hover:bg-violet-700 min-w-[110px]">
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
