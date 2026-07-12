import { useState } from "react";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, LayoutList } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourtMasters, CourtType } from "./CourtMasterContext";

const emptyForm = (): Omit<CourtType, "id"> => ({
  nameEn: "", nameHi: "", abv: "", status: "active",
});

export default function CourtTypeMaster() {
  const { courtTypes, setCourtTypes } = useCourtMasters();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<CourtType | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = courtTypes.filter(ct =>
    ct.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    ct.nameHi.includes(search) ||
    ct.abv.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditItem(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (ct: CourtType) => {
    setEditItem(ct);
    setForm({ nameEn: ct.nameEn, nameHi: ct.nameHi, abv: ct.abv, status: ct.status });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.nameEn.trim() || !form.nameHi.trim()) {
      toast({ title: "Validation Error", description: "Name in English and Hindi both are required.", variant: "destructive" });
      return;
    }
    if (!form.abv.trim()) {
      toast({ title: "Validation Error", description: "Abbreviation (ABV) is required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editItem) {
      setCourtTypes(prev => prev.map(ct => ct.id === editItem.id ? { ...form, id: editItem.id } : ct));
      toast({ title: "Court Type updated successfully." });
    } else {
      const newId = Math.max(0, ...courtTypes.map(ct => ct.id)) + 1;
      setCourtTypes(prev => [...prev, { ...form, id: newId }]);
      toast({ title: "Court Type added successfully." });
    }
    setSaving(false);
    setShowForm(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this court type? Courts linked to it may be affected.")) return;
    setCourtTypes(prev => prev.filter(ct => ct.id !== id));
    toast({ title: "Court Type deleted." });
  };

  const f = (key: keyof typeof form, val: string) => setForm(p => ({ ...p, [key]: val }));

  return (
    <CourtLayout title="Court & Type Master">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <LayoutList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Court &amp; Type Master</h2>
              <p className="text-sm text-gray-500">Define court types used across all case registrations.</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">
                {courtTypes.length} court types · HC · LC · DC · SC · CF · NGT · LARA · BDA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search court types…"
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Court Type (English)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  <span lang="hi">न्यायालय प्रकार (हिंदी)</span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ABV / संक्षेप</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No court types found.</td>
                </tr>
              ) : filtered.map((ct, i) => (
                <tr key={ct.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{ct.nameEn}</td>
                  <td className="px-4 py-3 text-gray-700 font-medium" lang="hi">{ct.nameHi}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                      {ct.abv}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      ct.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>{ct.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(ct)} title="Edit">
                        <Pencil className="h-3.5 w-3.5 text-blue-500" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(ct.id)} title="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400">
              Showing {filtered.length} of {courtTypes.length} court types
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 w-7 h-7 rounded flex items-center justify-center">
                  <LayoutList className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">
                  {editItem ? `Edit — ${editItem.nameEn}` : "Add New Court Type"}
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
                    Court Type <span className="text-gray-400">(English)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. High Court"
                    value={form.nameEn}
                    onChange={e => f("nameEn", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    <span lang="hi">न्यायालय प्रकार</span> <span className="text-gray-400">(Hindi)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="जैसे: उच्च न्यायालय"
                    lang="hi"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                    value={form.nameHi}
                    onChange={e => f("nameHi", e.target.value)}
                  />
                </div>
              </div>

              {/* ABV */}
              <div>
                <Label className="text-xs font-semibold text-gray-600">
                  Abbreviation / ABV <span className="text-gray-400">(संक्षेप)</span>
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Input
                  className="mt-1 w-40 uppercase"
                  placeholder="e.g. HC"
                  maxLength={12}
                  value={form.abv}
                  onChange={e => f("abv", e.target.value.toUpperCase())}
                />
                <p className="text-xs text-gray-400 mt-1">Short code shown in tables and dropdowns</p>
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
              <Button onClick={save} disabled={saving} className="bg-red-600 hover:bg-red-700 min-w-[120px]">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editItem ? "Save Changes" : "Add Court Type"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourtLayout>
  );
}
