import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Head { id: number; name: string; default_days: string; is_active: boolean; }

export default function LeaveMaster() {
  const [heads, setHeads] = useState<Head[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Head | null>(null);
  const [name, setName] = useState("");
  const [days, setDays] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try { const r = await apiFetch("/leave-heads"); setHeads(await r.json()); }
    catch { toast({ title: "Failed to load", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditItem(null); setName(""); setDays(""); setShowForm(true); };
  const openEdit = (h: Head) => { setEditItem(h); setName(h.name); setDays(String(h.default_days)); setShowForm(true); };

  const save = async () => {
    if (!name.trim()) { toast({ title: "Leave Type Name required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editItem) {
        await apiFetch(`/leave-heads/${editItem.id}`, { method: "PUT", body: JSON.stringify({ name: name.trim(), defaultDays: Number(days) || 0, isActive: true }) });
        toast({ title: "Leave head updated" });
      } else {
        await apiFetch("/leave-heads", { method: "POST", body: JSON.stringify({ name: name.trim(), defaultDays: Number(days) || 0 }) });
        toast({ title: "Leave head added" });
      }
      setShowForm(false); load();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const remove = async (h: Head) => {
    if (!confirm(`Delete "${h.name}"?`)) return;
    await apiFetch(`/leave-heads/${h.id}`, { method: "DELETE" });
    toast({ title: "Deleted" }); load();
  };

  return (
    <PayrollLayout title="Leave Master">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Leave Types</h2>
            <p className="text-sm text-gray-500">{heads.length} leave types defined</p>
          </div>
          <Button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" /> Add Leave Type
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a6e] text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-14">S.No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Leave Type</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase w-40">Default Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {heads.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                    <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No leave types. Click <span className="text-blue-600 font-semibold">Add Leave Type</span> to start.</p>
                    <p className="text-xs mt-1 text-gray-400">Examples: CL (Casual Leave), EL (Earned Leave), ML (Medical Leave)</p>
                  </td></tr>
                ) : heads.map((h, i) => (
                  <tr key={h.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{h.name}</td>
                    <td className="px-4 py-3 text-center font-mono font-semibold text-blue-700">{Number(h.default_days)}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(h)}><Pencil className="h-3.5 w-3.5 text-blue-500" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(h)}><Trash2 className="h-3.5 w-3.5 text-red-500" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-700 rounded-t-xl">
              <h3 className="font-bold text-white">{editItem ? "Edit Leave Type" : "Add Leave Type"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-600">Leave Type Name <span className="text-red-500">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. CL, EL, ML, HPL" className="mt-1" autoFocus onKeyDown={e => e.key === "Enter" && save()} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Default Days</Label>
                <Input type="number" value={days} onChange={e => setDays(e.target.value)} placeholder="0" className="mt-1" onKeyDown={e => e.key === "Enter" && save()} />
                <p className="text-xs text-gray-400 mt-1">Default days per year. Can be overridden per employee.</p>
              </div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editItem ? "Save Changes" : "Add Leave Type"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PayrollLayout>
  );
}
