import { useState } from "react";
import { CourtLayout } from "@/components/court/CourtLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, UserSquare2, Search, Phone, Mail, BadgeCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCourtMasters } from "./CourtMasterContext";

import type { Advocate } from "./CourtMasterContext";

const emptyForm = (): Omit<Advocate, "id"> => ({
  nameEn: "", nameHi: "", barCouncilNo: "", enrollmentDate: "",
  mobile: "", email: "", courtId: 0, address: "", status: "active",
});

export default function CourtAdvocateMaster() {
  const { courts, advocates, setAdvocates } = useCourtMasters();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Advocate | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCourt, setFilterCourt] = useState<number>(0);
  const { toast } = useToast();

  const activeCourts = courts.filter(c => c.status === "active");

  const filtered = advocates.filter(a => {
    const q = search.toLowerCase();
    const matchSearch =
      a.nameEn.toLowerCase().includes(q) ||
      a.nameHi.includes(search) ||
      a.barCouncilNo.toLowerCase().includes(q) ||
      a.mobile.includes(search) ||
      a.email.toLowerCase().includes(q);
    const matchCourt = filterCourt === 0 || a.courtId === filterCourt;
    return matchSearch && matchCourt;
  });

  const getCourtName = (id: number) => courts.find(c => c.id === id)?.nameEn ?? "—";

  const openAdd = () => { setEditItem(null); setForm(emptyForm()); setShowForm(true); };
  const openEdit = (a: Advocate) => {
    setEditItem(a);
    setForm({ nameEn: a.nameEn, nameHi: a.nameHi, barCouncilNo: a.barCouncilNo,
      enrollmentDate: a.enrollmentDate, mobile: a.mobile, email: a.email,
      courtId: a.courtId, address: a.address, status: a.status });
    setShowForm(true);
  };

  const validate = () => {
    if (!form.nameEn.trim()) return "Advocate name in English is required.";
    if (!form.nameHi.trim()) return "Advocate name in Hindi is required.";
    if (!form.barCouncilNo.trim()) return "Bar Council Registration No. is required.";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.trim())) return "Valid 10-digit mobile number is required.";
    if (!form.courtId) return "Please select a Court.";
    return null;
  };

  const save = async () => {
    const err = validate();
    if (err) { toast({ title: "Validation Error", description: err, variant: "destructive" }); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    if (editItem) {
      setAdvocates(prev => prev.map(a => a.id === editItem.id ? { ...form, id: editItem.id } : a));
      toast({ title: "Advocate updated successfully." });
    } else {
      const newId = Math.max(0, ...advocates.map(a => a.id)) + 1;
      setAdvocates(prev => [...prev, { ...form, id: newId }]);
      toast({ title: "Advocate added successfully." });
    }
    setSaving(false);
    setShowForm(false);
  };

  const remove = (id: number) => {
    if (!confirm("Delete this advocate?")) return;
    setAdvocates(prev => prev.filter(a => a.id !== id));
    toast({ title: "Advocate deleted." });
  };

  const f = (key: keyof typeof form, val: any) => setForm(p => ({ ...p, [key]: val }));

  return (
    <CourtLayout title="Advocate Master">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <UserSquare2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Advocate Master</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                <span lang="hi">अधिवक्ता मास्टर</span> — {advocates.length} registered advocate{advocates.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search by name, bar no., mobile…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 w-52 text-sm"
              />
            </div>
            <select
              value={filterCourt}
              onChange={e => setFilterCourt(Number(e.target.value))}
              className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value={0}>All Courts ({advocates.length})</option>
              {activeCourts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nameEn} ({advocates.filter(a => a.courtId === c.id).length})
                </option>
              ))}
            </select>
            <Button onClick={openAdd} className="bg-[#1a3a6e] hover:bg-[#15306b] text-white font-semibold gap-2 text-sm shrink-0 shadow-md border-2 border-[#1a3a6e]">
              <Plus className="h-4 w-4" /> Add Advocate
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-10">S.No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Advocate Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bar Council No.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Enrollment Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Court</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-14 text-gray-400 text-sm">
                    <UserSquare2 className="h-8 w-8 mx-auto mb-2 text-gray-200" />
                    No advocates found.
                  </td>
                </tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">{a.nameEn}</div>
                    <div className="text-xs text-gray-500 mt-0.5" lang="hi">{a.nameHi}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-semibold">
                      <BadgeCheck className="h-3 w-3" />{a.barCouncilNo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {a.enrollmentDate
                      ? new Date(a.enrollmentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <Phone className="h-3 w-3 text-gray-400 shrink-0" />{a.mobile || "—"}
                    </div>
                    {a.email && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Mail className="h-3 w-3 shrink-0" />{a.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700 font-medium">{getCourtName(a.courtId)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      a.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(a)} title="Edit">
                        <Pencil className="h-3.5 w-3.5 text-blue-500" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(a.id)} title="Delete">
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-400 flex items-center justify-between">
            <span>Showing {filtered.length} of {advocates.length} advocates</span>
            {filterCourt > 0 && (
              <button onClick={() => setFilterCourt(0)} className="text-amber-600 font-medium hover:underline">
                Clear court filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="bg-amber-600 w-7 h-7 rounded flex items-center justify-center">
                  <UserSquare2 className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-800">
                  {editItem ? `Edit — ${editItem.nameEn}` : "Register New Advocate"}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="px-6 py-5 space-y-5">

              {/* Bilingual Name */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Advocate Name / अधिवक्ता का नाम</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">
                      Full Name (English) <span className="text-red-500">*</span>
                    </Label>
                    <Input className="mt-1" placeholder="e.g. Rajesh Kumar Sharma"
                      value={form.nameEn} onChange={e => f("nameEn", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">
                      <span lang="hi">पूरा नाम (हिंदी)</span> <span className="text-red-500">*</span>
                    </Label>
                    <Input className="mt-1" placeholder="जैसे: राजेश कुमार शर्मा"
                      lang="hi" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                      value={form.nameHi} onChange={e => f("nameHi", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Bar Council + Enrollment */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Registration Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">
                      Bar Council Reg. No. <span className="text-red-500">*</span>
                    </Label>
                    <Input className="mt-1 font-mono" placeholder="e.g. UP/1234/2015"
                      value={form.barCouncilNo} onChange={e => f("barCouncilNo", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Enrollment Date</Label>
                    <Input className="mt-1" type="date"
                      value={form.enrollmentDate} onChange={e => f("enrollmentDate", e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Contact Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">
                      Mobile No. <span className="text-red-500">*</span>
                    </Label>
                    <Input className="mt-1" placeholder="10-digit mobile number" maxLength={10}
                      value={form.mobile} onChange={e => f("mobile", e.target.value.replace(/\D/g, ""))} />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">Email Address</Label>
                    <Input className="mt-1" type="email" placeholder="advocate@example.com"
                      value={form.email} onChange={e => f("email", e.target.value)} />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-xs font-semibold text-gray-600">Address</Label>
                  <Input className="mt-1" placeholder="Full address with city, PIN code"
                    value={form.address} onChange={e => f("address", e.target.value)} />
                </div>
              </div>

              {/* Court + Status */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Court Assignment & Status</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-600">
                      Primary Court <span className="text-red-500">*</span>
                    </Label>
                    <select
                      value={form.courtId || ""}
                      onChange={e => f("courtId", Number(e.target.value))}
                      className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="">— Select Court —</option>
                      {activeCourts.map(c => (
                        <option key={c.id} value={c.id}>{c.nameEn} ({c.abv})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-600 block mb-2">Status</Label>
                    <div className="flex gap-5 mt-3">
                      {(["active", "inactive"] as const).map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="status" value={s} checked={form.status === s}
                            onChange={() => f("status", s)} className="accent-amber-600" />
                          <span className={`text-sm font-medium capitalize ${s === "active" ? "text-green-700" : "text-gray-500"}`}>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 pb-5 flex justify-end gap-3 border-t pt-4 sticky bottom-0 bg-white rounded-b-xl">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-amber-600 hover:bg-amber-700 min-w-[140px]">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editItem ? "Save Changes" : "Register Advocate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </CourtLayout>
  );
}
