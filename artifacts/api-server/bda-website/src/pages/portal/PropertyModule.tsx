import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X, Loader2, Building2, Home, Layers, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property { id: number; propertyNo: string; applicantName: string; fatherName: string; phone: string; scheme: string; sector: string; plotNo: string; area: string; areaUnit: string; type: string; status: string; allotmentDate: string; totalCost: string; remarks: string; }

const STATUS_COLOR: Record<string, string> = {
  available: "bg-green-100 text-green-700",
  allotted: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  transferred: "bg-yellow-100 text-yellow-700",
  disputed: "bg-orange-100 text-orange-700",
};

const emptyForm = { propertyNo: "", applicantName: "", fatherName: "", phone: "", email: "", scheme: "", sector: "", plotNo: "", area: "", areaUnit: "sqmt", type: "residential", status: "available", allotmentDate: "", totalCost: "", address: "", remarks: "" };

export default function PropertyModule() {
  const [props, setProps] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => { setLoading(true); const r = await apiFetch("/properties"); setProps(await r.json()); setLoading(false); };
  useEffect(() => { load(); }, []);

  const stats = {
    total: props.length,
    allotted: props.filter(p => p.status === "allotted").length,
    available: props.filter(p => p.status === "available").length,
    disputed: props.filter(p => p.status === "disputed").length,
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editItem) { await apiFetch(`/properties/${editItem.id}`, { method: "PUT", body: JSON.stringify(form) }); }
      else { await apiFetch("/properties", { method: "POST", body: JSON.stringify(form) }); }
      toast({ title: editItem ? "Property updated" : "Property added" });
      setShowForm(false); load();
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this property record?")) return;
    await apiFetch(`/properties/${id}`, { method: "DELETE" }); load();
  };

  return (
    <PortalLayout title="Property Management System" moduleId="property">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Properties", value: stats.total, icon: Layers, color: "bg-emerald-600" },
            { label: "Allotted", value: stats.allotted, icon: Building2, color: "bg-blue-600" },
            { label: "Available", value: stats.available, icon: Home, color: "bg-green-500" },
            { label: "Disputed", value: stats.disputed, icon: AlertCircle, color: "bg-red-500" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`${s.color} w-11 h-11 rounded-lg flex items-center justify-center shrink-0`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h3 className="font-bold text-gray-800">Property Register</h3>
            <Button onClick={() => { setEditItem(null); setForm(emptyForm); setShowForm(true); }} className="bg-emerald-600 hover:bg-emerald-700 gap-2 text-sm">
              <Plus className="h-4 w-4" /> Add Property
            </Button>
          </div>
          {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{["Property No.", "Applicant", "Scheme/Sector", "Type", "Area", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {props.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400">No properties yet. Add the first one.</td></tr>}
                  {props.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-800">{p.propertyNo}</td>
                      <td className="px-4 py-2.5"><div className="font-medium text-gray-700">{p.applicantName}</div><div className="text-xs text-gray-400">{p.phone}</div></td>
                      <td className="px-4 py-2.5 text-gray-500 text-xs">{p.scheme} {p.sector ? `/ ${p.sector}` : ""}</td>
                      <td className="px-4 py-2.5 capitalize text-gray-600">{p.type}</td>
                      <td className="px-4 py-2.5 text-gray-600">{p.area} {p.areaUnit}</td>
                      <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[p.status] || "bg-gray-100"}`}>{p.status}</span></td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => { setEditItem(p); setForm(p as any); setShowForm(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => del(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold">{editItem ? "Edit Property" : "Add Property"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-4">
              {[
                { label: "Property No.", key: "propertyNo" }, { label: "Applicant Name", key: "applicantName" },
                { label: "Father's Name", key: "fatherName" }, { label: "Phone", key: "phone" },
                { label: "Email", key: "email" }, { label: "Scheme", key: "scheme" },
                { label: "Sector", key: "sector" }, { label: "Plot No.", key: "plotNo" },
                { label: "Area", key: "area" }, { label: "Area Unit", key: "areaUnit" },
                { label: "Total Cost (₹)", key: "totalCost" }, { label: "Allotment Date", key: "allotmentDate", type: "date" },
              ].map(f => (
                <div key={f.key}>
                  <Label className="text-xs text-gray-600">{f.label}</Label>
                  <Input type={f.type || "text"} value={(form as any)[f.key] || ""} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="mt-1" />
                </div>
              ))}
              {[
                { label: "Type", key: "type", options: ["residential", "commercial", "industrial", "plot"] },
                { label: "Status", key: "status", options: ["available", "allotted", "cancelled", "transferred", "disputed"] },
              ].map(f => (
                <div key={f.key}>
                  <Label className="text-xs text-gray-600">{f.label}</Label>
                  <select value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                    {f.options.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="col-span-2">
                <Label className="text-xs text-gray-600">Address</Label>
                <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-gray-600">Remarks</Label>
                <Input value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editItem ? "Save" : "Add Property"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
