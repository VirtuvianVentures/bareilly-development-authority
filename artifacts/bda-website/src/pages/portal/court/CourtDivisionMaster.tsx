import { useState } from "react";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourtMasters, Division } from "./CourtMasterContext";

const emptyForm = (): Omit<Division, "id"> => ({
  nameEn: "", nameHi: "", hq: "", code: "", status: "active",
});

export default function CourtDivisionMaster() {
  const { divisions, setDivisions } = useCourtMasters();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Division | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = divisions.filter(d =>
    d.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    d.nameHi.includes(search) ||
    d.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditItem(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (d: Division) => { setEditItem(d); setForm({ nameEn: d.nameEn, nameHi: d.nameHi, hq: d.hq, code: d.code, status: d.status }); setShowForm(true); };

  const save = async () => {
    if (!form.nameEn.trim() || !form.nameHi.trim()) {
      toast({ title: "Validation Error", description: "Name in English and Hindi both are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editItem) {
      setDivisions(prev => prev.map(d => d.id === editItem.id ? { ...form, id: editItem.id } : d));
      toast({ title: "Division updated successfully." });
    } else {
      const newId = Math.max(0, ...divisions.map(d => d.id)) + 1;
      setDivisions(prev => [...prev, { ...form, id: newId }]);
      toast({ title: "Division added successfully." });
    }
    setSaving(false);
    setShowForm(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this division? Districts linked to it may be affected.")) return;
    setDivisions(prev => prev.filter(d => d.id !== id));
    toast({ title: "Division deleted." });
  };

  const f = (key: keyof typeof form, val: string) => setForm(p => ({ ...p, [key]: val }));

  return (
    <CourtLayout title="Division Master">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Division Master</h2>
              <p className="text-sm text-gray-500">Manage administrative divisions of Uttar Pradesh.</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">{divisions.length} divisions loaded · UP State</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search divisions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-52 text-sm"
            />
            <Button onClick={openAdd} className="bg-red-600 hover:bg-red-700 gap-2 text-sm shrink-0">
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-10">S.No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Division Name (English)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  <span lang="hi">मंडल का नाम (हिंदी)</span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">HQ / मुख्यालय</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No divisions found.</td>
                </tr>
              ) : filtered.map((d, i) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{d.nameEn}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium" lang="hi">{d.nameHi}</td>
                  <td className="px-4 py-3 text-gray-600">{d.hq || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{d.code || "—"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      d.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(d)} title="Edit">
                        <Pencil className="h-3.5 w-3.5 text-blue-500" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(d.id)} title="Delete">
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 w-7 h-7 rounded flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">
                  {editItem ? `Edit — ${editItem.nameEn}` : "Add New Division"}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Bilingual name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Division Name <span className="text-gray-400">(English)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. Bareilly"
                    value={form.nameEn}
                    onChange={e => f("nameEn", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    <span lang="hi">मंडल नाम</span> <span className="text-gray-400">(Hindi)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="जैसे: बरेली"
                    lang="hi"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                    value={form.nameHi}
                    onChange={e => f("nameHi", e.target.value)}
                  />
                </div>
              </div>

              {/* HQ + Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Headquarters <span className="text-gray-400">(मुख्यालय)</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. Bareilly"
                    value={form.hq}
                    onChange={e => f("hq", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Division Code <span className="text-gray-400">(कोड)</span>
                  </Label>
                  <Input
                    className="mt-1 uppercase"
                    placeholder="e.g. BRL"
                    maxLength={5}
                    value={form.code}
                    onChange={e => f("code", e.target.value.toUpperCase())}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <Label className="text-xs font-semibold text-gray-600 block mb-2">Status</Label>
                <div className="flex gap-4">
                  {(["active", "inactive"] as const).map(s => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" value={s} checked={form.status === s}
                        onChange={() => f("status", s)} className="accent-red-600" />
                      <span className={`text-sm font-medium capitalize ${s === "active" ? "text-green-700" : "text-gray-500"}`}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-red-600 hover:bg-red-700 min-w-[110px]">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editItem ? "Save Changes" : "Add Division"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourtLayout>
  );
}
