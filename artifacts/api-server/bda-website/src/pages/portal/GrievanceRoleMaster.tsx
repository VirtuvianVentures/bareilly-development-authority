import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, X, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Role { id: number; name: string; isActive: boolean; createdAt: string; }

export default function GrievanceRoleMaster() {
  const [items, setItems] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try { const r = await apiFetch("/grievance-masters/roles"); setItems(await r.json()); }
    catch { toast({ title: "Failed to load", variant: "destructive" }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setName(""); setShowForm(true); };
  const openEdit = (r: Role) => { setEditing(r); setName(r.name); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setName(""); };

  const save = async () => {
    if (!name.trim()) { toast({ title: "Role name required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editing) {
        await apiFetch(`/grievance-masters/roles/${editing.id}`, { method: "PUT", body: JSON.stringify({ name }) });
        toast({ title: "Role updated" });
      } else {
        await apiFetch("/grievance-masters/roles", { method: "POST", body: JSON.stringify({ name }) });
        toast({ title: "Role added" });
      }
      closeForm(); load();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const del = async (id: number, name: string) => {
    if (!confirm(`Delete role "${name}"?`)) return;
    await apiFetch(`/grievance-masters/roles/${id}`, { method: "DELETE" });
    toast({ title: "Role deleted" }); load();
  };

  const toggle = async (r: Role) => {
    await apiFetch(`/grievance-masters/roles/${r.id}`, { method: "PUT", body: JSON.stringify({ isActive: !r.isActive }) });
    load();
  };

  return (
    <PortalLayout title="Role Master — Grievance" moduleId="grievance-admin">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-pink-600" />
            <h2 className="text-lg font-bold text-gray-800">Role Master</h2>
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{items.length} roles</span>
          </div>
          <Button onClick={openAdd} className="bg-pink-600 hover:bg-pink-700 gap-1.5">
            <Plus className="h-4 w-4" /> Add Role
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["#", "Role Name", "Status", "Added On", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">No roles yet. Click "Add Role" to start.</td></tr>
                )}
                {items.map((r, i) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggle(r)}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(r)} className="h-7 w-7 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => del(r.id, r.name)} className="h-7 w-7 p-0 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold">{editing ? "Edit Role" : "Add Role"}</h3>
              <Button variant="ghost" size="sm" onClick={closeForm}><X className="h-4 w-4" /></Button>
            </div>
            <div className="px-6 py-5">
              <Label className="text-xs text-gray-600">Role Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" placeholder="e.g. Junior Engineer, Executive Officer" autoFocus
                onKeyDown={e => e.key === "Enter" && save()} />
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3">
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
