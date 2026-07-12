import { useState } from "react";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, Map } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourtMasters, District } from "./CourtMasterContext";

const emptyForm = (): Omit<District, "id"> => ({
  nameEn: "", nameHi: "", divisionId: 0, code: "", status: "active",
});

export default function CourtDistrictMaster() {
  const { divisions, districts, setDistricts } = useCourtMasters();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<District | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDiv, setFilterDiv] = useState<number>(0);
  const { toast } = useToast();

  const activeDivisions = divisions.filter(d => d.status === "active");

  const filtered = districts.filter(d => {
    const matchSearch =
      d.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      d.nameHi.includes(search) ||
      d.code.toLowerCase().includes(search.toLowerCase());
    const matchDiv = filterDiv === 0 || d.divisionId === filterDiv;
    return matchSearch && matchDiv;
  });

  const getDivision = (id: number) => divisions.find(d => d.id === id);

  const openAdd = () => { setEditItem(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (d: District) => {
    setEditItem(d);
    setForm({ nameEn: d.nameEn, nameHi: d.nameHi, divisionId: d.divisionId, code: d.code, status: d.status });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.nameEn.trim() || !form.nameHi.trim()) {
      toast({ title: "Validation Error", description: "Name in English and Hindi both are required.", variant: "destructive" });
      return;
    }
    if (!form.divisionId) {
      toast({ title: "Validation Error", description: "Please select a Division.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editItem) {
      setDistricts(prev => prev.map(d => d.id === editItem.id ? { ...form, id: editItem.id } : d));
      toast({ title: "District updated successfully." });
    } else {
      const newId = Math.max(0, ...districts.map(d => d.id)) + 1;
      setDistricts(prev => [...prev, { ...form, id: newId }]);
      toast({ title: "District added successfully." });
    }
    setSaving(false);
    setShowForm(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this district?")) return;
    setDistricts(prev => prev.filter(d => d.id !== id));
    toast({ title: "District deleted." });
  };

  const f = (key: keyof typeof form, val: any) => setForm(p => ({ ...p, [key]: val }));

  return (
    <CourtLayout title="District Master">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <Map className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">District Master</h2>
              <p className="text-sm text-gray-500">Manage districts linked to divisions of Uttar Pradesh.</p>
              <p className="text-xs text-red-600 font-medium mt-0.5">{districts.length} districts · {divisions.length} divisions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search districts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-44 text-sm"
            />
            <select
              value={filterDiv}
              onChange={e => setFilterDiv(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              <option value={0}>All Divisions</option>
              {activeDivisions.map(d => (
                <option key={d.id} value={d.id}>{d.nameEn}</option>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">District (English)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  <span lang="hi">जिला (हिंदी)</span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Division</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                  <span lang="hi">मंडल</span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No districts found.</td>
                </tr>
              ) : filtered.map((d, i) => {
                const div = getDivision(d.divisionId);
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{d.nameEn}</td>
                    <td className="px-4 py-3 text-gray-700" lang="hi">{d.nameHi}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{div?.nameEn ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs" lang="hi">{div?.nameHi ?? "—"}</td>
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
                );
              })}
            </tbody>
          </table>
          {filtered.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400">
              Showing {filtered.length} of {districts.length} districts
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
                  <Map className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">
                  {editItem ? `Edit — ${editItem.nameEn}` : "Add New District"}
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
                    District Name <span className="text-gray-400">(English)</span>
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
                    <span lang="hi">जिला नाम</span> <span className="text-gray-400">(Hindi)</span>
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

              {/* Division dropdown — relational */}
              <div>
                <Label className="text-xs font-semibold text-gray-600">
                  Division <span lang="hi" className="text-gray-400">(मंडल)</span>
                  <span className="text-red-500 ml-0.5">*</span>
                </Label>
                <select
                  value={form.divisionId || ""}
                  onChange={e => f("divisionId", Number(e.target.value))}
                  className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                >
                  <option value="">— Select Division / मंडल चुनें —</option>
                  {activeDivisions.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.nameEn} ({d.nameHi})
                    </option>
                  ))}
                </select>
                {form.divisionId > 0 && (() => {
                  const div = getDivision(form.divisionId);
                  return div ? (
                    <p className="text-xs text-blue-600 mt-1">
                      Selected: <span className="font-semibold">{div.nameEn}</span>
                      {div.hq && <> · HQ: {div.hq}</>}
                      {div.code && <> · Code: {div.code}</>}
                    </p>
                  ) : null;
                })()}
              </div>

              {/* District Code */}
              <div>
                <Label className="text-xs font-semibold text-gray-600">
                  District Code <span className="text-gray-400">(जिला कोड)</span>
                </Label>
                <Input
                  className="mt-1 uppercase w-40"
                  placeholder="e.g. BRL"
                  maxLength={5}
                  value={form.code}
                  onChange={e => f("code", e.target.value.toUpperCase())}
                />
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
                {editItem ? "Save Changes" : "Add District"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourtLayout>
  );
}
