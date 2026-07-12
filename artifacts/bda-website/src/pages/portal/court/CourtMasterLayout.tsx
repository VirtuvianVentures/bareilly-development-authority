import { useState } from "react";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ExtraField {
  label: string;
  labelHi?: string;
  key: string;
  type?: "text" | "select";
  options?: string[];
  span?: boolean;
}

interface CourtMasterLayoutProps {
  title: string;
  moduleId: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
  extraFields?: ExtraField[];
}

type Record = { id: number; nameEn: string; nameHi: string; status: "active" | "inactive"; [key: string]: any };

const emptyForm = (extra: ExtraField[]) => {
  const base: any = { nameEn: "", nameHi: "", status: "active" };
  extra.forEach(f => { base[f.key] = ""; });
  return base;
};

export function CourtMasterLayout({
  title, moduleId: _moduleId, icon: Icon, description, badge, extraFields = [],
}: CourtMasterLayoutProps) {
  const [records, setRecords] = useState<Record[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Record | null>(null);
  const [form, setForm] = useState<any>(emptyForm(extraFields));
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const openAdd = () => { setEditItem(null); setForm(emptyForm(extraFields)); setShowForm(true); };
  const openEdit = (r: Record) => { setEditItem(r); setForm({ ...r }); setShowForm(true); };

  const save = async () => {
    if (!form.nameEn.trim() || !form.nameHi.trim()) {
      toast({ title: "Validation Error", description: "Name in English and Hindi both required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editItem) {
      setRecords(prev => prev.map(r => r.id === editItem.id ? { ...form, id: editItem.id } : r));
      toast({ title: "Record updated successfully." });
    } else {
      const newId = Date.now();
      setRecords(prev => [...prev, { ...form, id: newId }]);
      toast({ title: "Record added successfully." });
    }
    setSaving(false);
    setShowForm(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this record?")) return;
    setRecords(prev => prev.filter(r => r.id !== id));
    toast({ title: "Record deleted." });
  };

  return (
    <CourtLayout title={title}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
              {badge && <p className="text-xs text-red-600 font-medium mt-0.5">{badge}</p>}
            </div>
          </div>
          <Button onClick={openAdd} className="bg-red-600 hover:bg-red-700 gap-2 text-sm shrink-0">
            <Plus className="h-4 w-4" /> Add New
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-12">S.No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name (English)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  <span lang="hi">नाम (हिंदी)</span>
                </th>
                {extraFields.map(f => (
                  <th key={f.key} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
                    {f.label}
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={5 + extraFields.length} className="text-center py-16 text-gray-400">
                    <Icon className="h-10 w-10 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm font-medium">No records found</p>
                    <p className="text-xs mt-1">Click <span className="font-semibold text-red-600">Add New</span> to create the first entry.</p>
                  </td>
                </tr>
              ) : records.map((r, i) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.nameEn}</td>
                  <td className="px-4 py-3 text-gray-700" lang="hi">{r.nameHi}</td>
                  {extraFields.map(f => (
                    <td key={f.key} className="px-4 py-3 text-gray-600">{r[f.key] || "—"}</td>
                  ))}
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>{r.status}</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 w-7 h-7 rounded flex items-center justify-center">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">{editItem ? `Edit — ${editItem.nameEn}` : `Add New — ${title}`}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Bilingual name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600 mb-1 block">
                    Name <span className="text-gray-400">(English)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="Enter name in English"
                    value={form.nameEn}
                    onChange={e => setForm((p: any) => ({ ...p, nameEn: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600 mb-1 block">
                    <span lang="hi">नाम</span> <span className="text-gray-400">(Hindi)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    placeholder="हिंदी में नाम दर्ज करें"
                    lang="hi"
                    value={form.nameHi}
                    onChange={e => setForm((p: any) => ({ ...p, nameHi: e.target.value }))}
                    className="mt-1"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  />
                </div>
              </div>

              {/* Extra fields */}
              {extraFields.map(f => (
                <div key={f.key} className={f.span ? "col-span-2" : ""}>
                  <Label className="text-xs font-semibold text-gray-600 block mb-1">
                    {f.label}
                    {f.labelHi && <span className="text-gray-400 ml-1" lang="hi">({f.labelHi})</span>}
                  </Label>
                  {f.type === "select" ? (
                    <select
                      value={form[f.key]}
                      onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                      className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">— Select —</option>
                      {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <Input
                      placeholder={`Enter ${f.label}`}
                      value={form[f.key] || ""}
                      onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}

              {/* Status */}
              <div>
                <Label className="text-xs font-semibold text-gray-600 block mb-1">Status</Label>
                <div className="flex gap-4 mt-2">
                  {(["active", "inactive"] as const).map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
                        onChange={() => setForm((p: any) => ({ ...p, status: s }))}
                        className="accent-red-600"
                      />
                      <span className={`text-sm font-medium capitalize ${s === "active" ? "text-green-700" : "text-gray-500"}`}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-red-600 hover:bg-red-700 min-w-[110px]">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editItem ? "Save Changes" : "Add Record"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourtLayout>
  );
}
