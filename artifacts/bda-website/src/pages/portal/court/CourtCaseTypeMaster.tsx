import { useState } from "react";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourtMasters, CaseType } from "./CourtMasterContext";

const emptyForm = (): Omit<CaseType, "id"> => ({
  nameEn: "", nameHi: "", courtTypeId: 0, status: "active",
});

export default function CourtCaseTypeMaster() {
  const { caseTypes, setCaseTypes, courtTypes } = useCourtMasters();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<CaseType | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<number>(0);
  const { toast } = useToast();

  const activeTypes = courtTypes.filter(ct => ct.status === "active");

  const filtered = caseTypes.filter(c => {
    const matchSearch =
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.nameHi.includes(search);
    const matchType = filterType === 0 || c.courtTypeId === filterType;
    return matchSearch && matchType;
  });

  const getCourtType = (id: number) => courtTypes.find(ct => ct.id === id);

  const openAdd = () => { setEditItem(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (c: CaseType) => {
    setEditItem(c);
    setForm({ nameEn: c.nameEn, nameHi: c.nameHi, courtTypeId: c.courtTypeId, status: c.status });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.nameEn.trim() || !form.nameHi.trim()) {
      toast({ title: "Validation Error", description: "Case type name in English and Hindi both are required.", variant: "destructive" });
      return;
    }
    if (!form.courtTypeId) {
      toast({ title: "Validation Error", description: "Please select a Court Type.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editItem) {
      setCaseTypes(prev => prev.map(c => c.id === editItem.id ? { ...form, id: editItem.id } : c));
      toast({ title: "Case Type updated successfully." });
    } else {
      const newId = Math.max(0, ...caseTypes.map(c => c.id)) + 1;
      setCaseTypes(prev => [...prev, { ...form, id: newId }]);
      toast({ title: "Case Type added successfully." });
    }
    setSaving(false);
    setShowForm(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this case type?")) return;
    setCaseTypes(prev => prev.filter(c => c.id !== id));
    toast({ title: "Case Type deleted." });
  };

  const f = (key: keyof typeof form, val: any) => setForm(p => ({ ...p, [key]: val }));

  const countByType = (id: number) => caseTypes.filter(c => c.courtTypeId === id).length;

  return (
    <CourtLayout title="Case Type Master">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <Tag className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Case Type Master</h2>
              <p className="text-sm text-gray-500">18 case types × 9 court types = {caseTypes.length} total entries</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search case types…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-44 text-sm"
            />
            <select
              value={filterType}
              onChange={e => setFilterType(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value={0}>All Court Types ({caseTypes.length})</option>
              {activeTypes.map(ct => (
                <option key={ct.id} value={ct.id}>{ct.nameEn} ({countByType(ct.id)})</option>
              ))}
            </select>
            <Button onClick={openAdd} className="bg-red-600 hover:bg-red-700 gap-2 text-sm shrink-0">
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </div>
        </div>

        {/* Court type chips summary */}
        <div className="flex flex-wrap gap-2 mb-4">
          {activeTypes.map(ct => (
            <button
              key={ct.id}
              onClick={() => setFilterType(filterType === ct.id ? 0 : ct.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                filterType === ct.id
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-red-400"
              }`}
            >
              <span className={`font-mono ${filterType === ct.id ? "text-white" : "text-indigo-600"}`}>{ct.abv}</span>
              {ct.nameEn}
              <span className={`${filterType === ct.id ? "text-red-200" : "text-gray-400"}`}>
                {countByType(ct.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-10">S.No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Court Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Case Type (English)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  <span lang="hi">मामले का प्रकार (हिंदी)</span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No case types found.</td>
                </tr>
              ) : filtered.map((c, i) => {
                const ct = getCourtType(c.courtTypeId);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      {ct ? (
                        <span className="inline-flex items-center gap-1">
                          <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">{ct.abv}</span>
                          <span className="text-xs text-gray-500 hidden xl:inline">{ct.nameEn}</span>
                        </span>
                      ) : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-gray-800">{c.nameEn}</td>
                    <td className="px-4 py-2.5 text-gray-700" lang="hi">{c.nameHi}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        c.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-2.5">
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
          <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400">
            Showing {filtered.length} of {caseTypes.length} entries
            {filterType > 0 && (
              <button onClick={() => setFilterType(0)} className="ml-2 text-red-600 font-medium hover:underline">
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 w-7 h-7 rounded flex items-center justify-center">
                  <Tag className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">
                  {editItem ? `Edit — ${editItem.nameEn}` : "Add New Case Type"}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Court Type dropdown */}
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
                  <option value="">— Select Court Type —</option>
                  {activeTypes.map(ct => (
                    <option key={ct.id} value={ct.id}>{ct.nameEn} ({ct.abv})</option>
                  ))}
                </select>
              </div>

              {/* Bilingual name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    Case Type <span className="text-gray-400">(English)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="e.g. Land Acquisition Cases"
                    value={form.nameEn}
                    onChange={e => f("nameEn", e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-gray-600">
                    <span lang="hi">मामले का प्रकार</span> <span className="text-gray-400">(Hindi)</span>
                    <span className="text-red-500 ml-0.5">*</span>
                  </Label>
                  <Input
                    className="mt-1"
                    placeholder="जैसे: भूमि अधिग्रहण मामले"
                    lang="hi"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                    value={form.nameHi}
                    onChange={e => f("nameHi", e.target.value)}
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
              <Button onClick={save} disabled={saving} className="bg-red-600 hover:bg-red-700 min-w-[120px]">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editItem ? "Save Changes" : "Add Case Type"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourtLayout>
  );
}
