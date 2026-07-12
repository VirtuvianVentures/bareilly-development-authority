import { useState, useEffect } from "react";
import { PayrollLayout } from "@/components/portal/PayrollLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Head { id: number; name: string; amount: string; is_active: boolean; }

export default function AllowanceMaster() {
  const [heads, setHeads] = useState<Head[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Head | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try { const r = await apiFetch("/allowance-heads"); setHeads(await r.json()); }
    catch { toast({ title: "Failed to load", variant: "destructive" }); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd  = () => { setEditItem(null); setName(""); setAmount(""); setShowForm(true); };
  const openEdit = (h: Head) => { setEditItem(h); setName(h.name); setAmount(String(h.amount)); setShowForm(true); };

  const save = async () => {
    if (!name.trim()) { toast({ title: "Head Name required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editItem) {
        await apiFetch(`/allowance-heads/${editItem.id}`, { method: "PUT", body: JSON.stringify({ name: name.trim(), amount: Number(amount) || 0, isActive: true }) });
        toast({ title: "Allowance head updated" });
      } else {
        await apiFetch("/allowance-heads", { method: "POST", body: JSON.stringify({ name: name.trim(), amount: Number(amount) || 0 }) });
        toast({ title: "Allowance head added" });
      }
      setShowForm(false); load();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const remove = async (h: Head) => {
    if (!confirm(`Delete "${h.name}"?`)) return;
    await apiFetch(`/allowance-heads/${h.id}`, { method: "DELETE" });
    toast({ title: "Deleted" }); load();
  };

  const total = heads.reduce((s, h) => s + Number(h.amount), 0);

  return (
    <PayrollLayout title="Allowance Master">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Allowance Heads</h2>
            <p className="text-sm text-gray-500">{heads.length} heads &nbsp;·&nbsp; Total: <span className="font-semibold text-green-700">₹{total.toLocaleString("en-IN")}</span></p>
          </div>
          <Button onClick={openAdd} className="bg-green-600 hover:bg-green-700 gap-2">
            <Plus className="h-4 w-4" /> Add Allowance Head
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a3a6e] text-white">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-14">S.No.</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Head Name</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase w-40">Default Amount (₹)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-28">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {heads.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-16 text-gray-400">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No allowance heads. Click <span className="text-green-600 font-semibold">Add Allowance Head</span> to start.</p>
                  </td></tr>
                ) : heads.map((h, i) => (
                  <tr key={h.id} className="hover:bg-green-50/30 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{h.name}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-green-700">₹{Number(h.amount).toLocaleString("en-IN")}</td>
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
                {heads.length > 0 && (
                  <tr className="bg-green-50 font-bold">
                    <td colSpan={2} className="px-4 py-3 text-right text-xs uppercase text-gray-600">Total</td>
                    <td className="px-4 py-3 text-right text-green-700">₹{total.toLocaleString("en-IN")}</td>
                    <td colSpan={2} />
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-green-700 rounded-t-xl">
              <h3 className="font-bold text-white">{editItem ? "Edit Allowance Head" : "Add Allowance Head"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-white hover:bg-white/20"><X className="h-4 w-4" /></Button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <Label className="text-xs font-semibold text-gray-600">Head Name <span className="text-red-500">*</span></Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. House Rent Allowance, TA, DA" className="mt-1" autoFocus onKeyDown={e => e.key === "Enter" && save()} />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-600">Default Amount (₹)</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="mt-1" onKeyDown={e => e.key === "Enter" && save()} />
                <p className="text-xs text-gray-400 mt-1">This amount will pre-fill in employee registration. Can be overridden per employee.</p>
              </div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-green-600 hover:bg-green-700 min-w-[120px]">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editItem ? "Save Changes" : "Add Head"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PayrollLayout>
  );
}
