import { useState } from "react";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourtMasters, Court } from "./CourtMasterContext";

const emptyForm = (): Omit<Court, "id"> => ({
  nameEn: "", nameHi: "", courtTypeId: 0, abv: "", status: "active",
});

export default function CourtCourtMaster() {
  const { courts, setCourts, courtTypes } = useCourtMasters();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Court | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<number>(0);
  const { toast } = useToast();

  const activeTypes = courtTypes.filter(ct => ct.status === "active");

  const filtered = courts.filter(c => {
    const matchSearch =
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.nameHi.includes(search) ||
      c.abv.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 0 || c.courtTypeId === filterType;
    return matchSearch && matchType;
  });

  const getCourtType = (id: number) => courtTypes.find(ct => ct.id === id);

  const openAdd = () => { setEditItem(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (c: Court) => {
    setEditItem(c);
    setForm({ nameEn: c.nameEn, nameHi: c.nameHi, courtTypeId: c.courtTypeId, abv: c.abv, status: c.status });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.nameEn.trim() || !form.nameHi.trim()) {
      toast({ title: "Validation Error", description: "Court name in English and Hindi both are required.", variant: "destructive" });
      return;
    }
    if (!form.courtTypeId) {
      toast({ title: "Validation Error", description: "Please select a Court Type.", variant: "destructive" });
      return;
    }
    if (!form.abv.trim()) {
      toast({ title: "Validation Error", description: "ABV / Abbreviation is required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editItem) {
      setCourts(prev => prev.map(c => c.id === editItem.id ? { ...form, id: editItem.id } : c));
      toast({ title: "Court updated successfully." });
    } else {
      const newId = Math.max(0, ...courts.map(c => c.id)) + 1;
      setCourts(prev => [...prev, { ...form, id: newId }]);
      toast({ title: "Court added successfully." });
    }
    setSaving(false);
    setShowForm(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this court record?")) return;
    setCourts(prev => prev.filter(c => c.id !== id));
    toast({ title: "Court deleted." });
  };

  const f = (key: keyof typeof form, val: any) => setForm(p => ({ ...p, [key]: val }));

  return (
    <CourtLayout title="Court Master">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Court Master</h2>
              <p className="text-sm text-gray-500">Manage individual courts linked to their court types.</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">
                {courts.length} courts · {courtTypes.length} court types
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search courts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-44 text-sm"
            />
            <select
              value={filterType}
              onChange={e => setFilterType(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value={0}>All Court Types</option>
              {activeTypes.map(ct => (
                <option key={ct.id} value={ct.id}>{ct.nameEn}</option>
              ))}
            </select>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Court Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Court Name (English)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  <span lang="hi">न्यायालय नाम (हिंदी)</span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ABV / संक्षेप</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No courts found.</td>
                </tr>
              ) : filtered.map((c, i) => {
                const ct = getCourtType(c.courtTypeId);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      {ct ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">{ct.abv}</span>
                          <span className="text-xs text-gray-500">{ct.nameEn}</span>
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{c.nameEn}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium" lang="hi">{c.nameHi}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                        {c.abv}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(c)} title="Edit">
                          <Pencil className="h-3.5 w-3.5 text-blue-500" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(c.id)} title="Delete">
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400">
              Showing {filtered.length} of {courts.length} courts
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
                  <Scale className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">
                  {editItem ? `Edit — ${editItem.nameEn}` : "Add New Court"}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Court Type dropdown — relational */}
              <div>
                <Label className="text-xs font-semibold text-gray-600">
                  Court Type <span lang="hi" className="text-gray-400">(न्यायालय प्रकार)</span>
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <select
                  value={form.courtTypeId || ""}
                  onChange={e => f("courtTypeId", Number(e.target.value))}
                  className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="">— Select Court Type / न्यायालय प्रकार चुनें —</option>
                  {activeTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>
                      {ct.nameEn} ({ct.abv})
                    </option>
                  ))}
                </select>
                {form.courtTypeId > 0 && (() => {
                  const ct = getCourtType(form.courtTypeId);
                  return ct ? (
                    <p className="text-xs text-indigo-600 mt-1">
                      Selected: <span className="font-semibold">{ct.nameEn}</span>
                      <span className="ml-1" lang="hi">· {ct.nameHi}</span>
                      <span className="ml-1 font-mono bg-indigo-50 text-indigo-700 px-1 rounded">{ct.abv}</span>
                    </p>
                  ) : null;
                })()}
              </div>

              {/* Bilingual name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Court Name <span className="text-gray-400">(English)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. High Court (Lucknow)"
                    value={form.nameEn}
                    onChange={e => f("nameEn", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    <span lang="hi">न्यायालय नाम</span> <span className="text-gray-400">(Hindi)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="जैसे: उच्च न्यायालय (लखनऊ)"
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
                  ABV / Abbreviation <span className="text-gray-400">(संक्षेप)</span>
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <Input
                  className="mt-1 w-44"
                  placeholder="e.g. HCL"
                  maxLength={15}
                  value={form.abv}
                  onChange={e => f("abv", e.target.value.toUpperCase())}
                />
                <p className="text-xs text-gray-400 mt-1">Shown in tables, case forms and reports</p>
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
                {editItem ? "Save Changes" : "Add Court"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourtLayout>
  );
}
