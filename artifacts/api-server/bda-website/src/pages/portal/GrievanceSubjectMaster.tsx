import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, X, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Section { id: number; name: string; isActive: boolean; }
interface Role { id: number; name: string; isActive: boolean; }
interface Subject { id: number; subject: string; sectionId: number | null; roleId: number | null; officerName: string | null; officerMobile: string | null; officerEmail: string | null; isActive: boolean; createdAt: string; }

const emptyForm = { subject: "", sectionId: "", roleId: "", officerName: "", officerMobile: "", officerEmail: "" };

export default function GrievanceSubjectMaster() {
  const [items, setItems] = useState<Subject[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [subj, sec, rol] = await Promise.all([
        apiFetch("/grievance-masters/subjects").then(r => r.json()),
        apiFetch("/grievance-masters/sections").then(r => r.json()),
        apiFetch("/grievance-masters/roles").then(r => r.json()),
      ]);
      setItems(subj); setSections(sec); setRoles(rol);
    } catch { toast({ title: "Failed to load", variant: "destructive" }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (s: Subject) => {
    setEditing(s);
    setForm({ subject: s.subject, sectionId: s.sectionId ? String(s.sectionId) : "", roleId: s.roleId ? String(s.roleId) : "", officerName: s.officerName || "", officerMobile: s.officerMobile || "", officerEmail: s.officerEmail || "" });
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyForm); };

  const save = async () => {
    if (!form.subject.trim()) { toast({ title: "Subject is required", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { ...form, sectionId: form.sectionId ? Number(form.sectionId) : null, roleId: form.roleId ? Number(form.roleId) : null };
    try {
      if (editing) {
        await apiFetch(`/grievance-masters/subjects/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
        toast({ title: "Subject updated" });
      } else {
        await apiFetch("/grievance-masters/subjects", { method: "POST", body: JSON.stringify(payload) });
        toast({ title: "Subject added" });
      }
      closeForm(); load();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const del = async (id: number, subject: string) => {
    if (!confirm(`Delete subject "${subject}"?`)) return;
    await apiFetch(`/grievance-masters/subjects/${id}`, { method: "DELETE" });
    toast({ title: "Subject deleted" }); load();
  };

  const toggle = async (s: Subject) => {
    await apiFetch(`/grievance-masters/subjects/${s.id}`, { method: "PUT", body: JSON.stringify({ isActive: !s.isActive }) });
    load();
  };

  const sectionName = (id: number | null) => sections.find(s => s.id === id)?.name || "—";
  const roleName = (id: number | null) => roles.find(r => r.id === id)?.name || "—";

  return (
    <PortalLayout title="Subject Master — Grievance" moduleId="grievance-admin">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-pink-600" />
            <h2 className="text-lg font-bold text-gray-800">Subject Master</h2>
            <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">{items.length} subjects</span>
          </div>
          <Button onClick={openAdd} className="bg-pink-600 hover:bg-pink-700 gap-1.5">
            <Plus className="h-4 w-4" /> Add Subject
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{["#", "Subject", "Section", "Role", "Officer Name", "Mobile", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-10 text-gray-400">No subjects yet. Click "Add Subject" to start.</td></tr>
                  )}
                  {items.map((s, i) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px]"><div className="truncate">{s.subject}</div></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{sectionName(s.sectionId)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{roleName(s.roleId)}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">{s.officerName || "—"}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{s.officerMobile || "—"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggle(s)}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {s.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(s)} className="h-7 w-7 p-0 text-blue-500"><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => del(s.id, s.subject)} className="h-7 w-7 p-0 text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h3 className="font-bold">{editing ? "Edit Subject" : "Add Subject"}</h3>
              <Button variant="ghost" size="sm" onClick={closeForm}><X className="h-4 w-4" /></Button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <Label className="text-xs text-gray-600">Subject <span className="text-red-500">*</span></Label>
                <Input value={form.subject} onChange={e => set("subject", e.target.value)} className="mt-1" placeholder="e.g. Road repair complaint" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Section</Label>
                  <select value={form.sectionId} onChange={e => set("sectionId", e.target.value)}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="">-- Select Section --</option>
                    {sections.filter(s => s.isActive).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Role</Label>
                  <select value={form.roleId} onChange={e => set("roleId", e.target.value)}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                    <option value="">-- Select Role --</option>
                    {roles.filter(r => r.isActive).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Officer Name</Label>
                <Input value={form.officerName} onChange={e => set("officerName", e.target.value)} className="mt-1" placeholder="Responsible officer's full name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-600">Mobile No.</Label>
                  <Input value={form.officerMobile} onChange={e => set("officerMobile", e.target.value)} className="mt-1" placeholder="10-digit mobile" maxLength={10} />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Email</Label>
                  <Input type="email" value={form.officerEmail} onChange={e => set("officerEmail", e.target.value)} className="mt-1" placeholder="officer@bda.gov.in" />
                </div>
              </div>
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
