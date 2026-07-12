import { useState, useEffect, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X, Loader2, MessageSquare, Clock, CheckCircle, AlertCircle,
  Eye, Download, Search, Filter, BarChart2, List, Bell, Printer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { printComplaint } from "@/lib/printComplaint";

interface Grievance {
  id: number; ticketNo: string; applicantName: string; mobile: string; email: string;
  category: string; subject: string; description: string; status: string;
  assignedTo: string; assignedDepartment: string; resolution: string;
  createdAt: string; updatedAt: string; remarks: string;
}

const STATUS_COLOR: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-700", acknowledged: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-orange-100 text-orange-700", resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600", rejected: "bg-red-100 text-red-700",
};
const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted", acknowledged: "Acknowledged", in_progress: "In Progress",
  resolved: "Resolved", closed: "Closed", rejected: "Rejected",
};
const CATEGORY_LABEL: Record<string, string> = {
  property: "Property", maintenance: "Maintenance", allotment: "Allotment",
  construction: "Construction", water_sewage: "Water/Sewage", road: "Road",
  park: "Park", corruption: "Corruption", service_delay: "Service Delay", other: "Other",
};
const DEADLINE_DAYS = 30;

function daysLeft(createdAt: string) {
  const created = new Date(createdAt);
  const deadline = new Date(created);
  deadline.setDate(deadline.getDate() + DEADLINE_DAYS);
  const diff = Math.ceil((deadline.getTime() - Date.now()) / 86400000);
  return diff;
}

function exportCSV(items: Grievance[]) {
  const headers = ["Ticket No", "Name", "Mobile", "Email", "Category", "Subject", "Status", "Assigned To", "Department", "Date", "Days Left", "Resolution"];
  const rows = items.map(g => [
    g.ticketNo, g.applicantName, g.mobile, g.email || "",
    CATEGORY_LABEL[g.category] || g.category, `"${g.subject}"`,
    STATUS_LABEL[g.status] || g.status, g.assignedTo || "", g.assignedDepartment || "",
    new Date(g.createdAt).toLocaleDateString("en-IN"),
    ["resolved", "closed", "rejected"].includes(g.status) ? "—" : String(daysLeft(g.createdAt)),
    `"${g.resolution || ""}"`,
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `grievances_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function GrievanceModule() {
  const [items, setItems] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Grievance | null>(null);
  const [updateForm, setUpdateForm] = useState({ status: "", assignedTo: "", assignedDepartment: "", resolution: "", remarks: "" });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "reports">("list");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try { const r = await apiFetch("/grievances"); setItems(await r.json()); }
    catch { toast({ title: "Failed to load grievances", variant: "destructive" }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter(i => ["submitted", "acknowledged", "in_progress"].includes(i.status)).length,
    resolved: items.filter(i => ["resolved", "closed"].includes(i.status)).length,
    today: items.filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length,
    overdue: items.filter(i => !["resolved", "closed", "rejected"].includes(i.status) && daysLeft(i.createdAt) < 0).length,
  }), [items]);

  const filtered = useMemo(() => items.filter(g => {
    const q = search.toLowerCase();
    const matchQ = !q || g.ticketNo.toLowerCase().includes(q) || g.applicantName.toLowerCase().includes(q) || g.mobile.includes(q) || g.subject.toLowerCase().includes(q);
    const matchS = !filterStatus || g.status === filterStatus;
    const matchC = !filterCategory || g.category === filterCategory;
    return matchQ && matchS && matchC;
  }), [items, search, filterStatus, filterCategory]);

  const openUpdate = (g: Grievance) => {
    setSelected(g);
    setUpdateForm({ status: g.status, assignedTo: g.assignedTo || "", assignedDepartment: g.assignedDepartment || "", resolution: g.resolution || "", remarks: g.remarks || "" });
  };

  const saveUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await apiFetch(`/grievances/${selected.id}`, { method: "PUT", body: JSON.stringify(updateForm) });
      toast({ title: `Grievance ${selected.ticketNo} updated` });
      setSelected(null); load();
    } catch { toast({ title: "Update failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  // Reports data
  const byStatus = useMemo(() => Object.entries(STATUS_LABEL).map(([k, label]) => ({ label, count: items.filter(i => i.status === k).length, key: k })).filter(x => x.count > 0), [items]);
  const byCategory = useMemo(() => Object.entries(CATEGORY_LABEL).map(([k, label]) => ({ label, count: items.filter(i => i.category === k).length })).filter(x => x.count > 0).sort((a, b) => b.count - a.count), [items]);
  const avgResolutionDays = useMemo(() => {
    const resolved = items.filter(i => ["resolved", "closed"].includes(i.status));
    if (!resolved.length) return 0;
    const total = resolved.reduce((s, g) => s + Math.abs(Math.ceil((new Date(g.updatedAt).getTime() - new Date(g.createdAt).getTime()) / 86400000)), 0);
    return Math.round(total / resolved.length);
  }, [items]);

  return (
    <PortalLayout title="Grievance Management System" moduleId="grievance">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Total", value: stats.total, icon: MessageSquare, color: "bg-pink-600" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "bg-yellow-500" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle, color: "bg-green-600" },
            { label: "Today", value: stats.today, icon: AlertCircle, color: "bg-blue-600" },
            { label: "Overdue", value: stats.overdue, icon: Bell, color: stats.overdue > 0 ? "bg-red-600" : "bg-gray-400" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`${s.color} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div><p className="text-xl font-bold text-gray-800">{s.value}</p><p className="text-xs text-gray-500">{s.label}</p></div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "list", label: "Grievance Register", icon: List },
            { key: "reports", label: "Reports & Statistics", icon: BarChart2 },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${activeTab === key ? "bg-[#1a3a6e] text-white border-[#1a3a6e]" : "bg-white text-gray-600 border-gray-300 hover:border-[#1a3a6e]"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* LIST TAB */}
        {activeTab === "list" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 py-3 border-b flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ticket, name, mobile, subject…" className="pl-8 h-8 text-sm" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-600 focus:outline-none">
                <option value="">All Status</option>
                {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-600 focus:outline-none">
                <option value="">All Categories</option>
                {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <Button size="sm" variant="outline" onClick={() => exportCSV(filtered)} className="h-8 gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
              {(search || filterStatus || filterCategory) && (
                <button onClick={() => { setSearch(""); setFilterStatus(""); setFilterCategory(""); }}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
              <span className="text-xs text-gray-400 ml-auto">{filtered.length} records</span>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{["Ticket No.", "Applicant", "Category", "Subject", "Date", "Deadline", "Assigned To", "Status", "Action"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length === 0 && (
                      <tr><td colSpan={9} className="text-center py-10 text-gray-400">No grievances found.</td></tr>
                    )}
                    {filtered.map(g => {
                      const dl = daysLeft(g.createdAt);
                      const isDone = ["resolved", "closed", "rejected"].includes(g.status);
                      const isOverdue = !isDone && dl < 0;
                      const isUrgent = !isDone && dl >= 0 && dl <= 5;
                      return (
                        <tr key={g.id} className={`hover:bg-gray-50 ${isOverdue ? "bg-red-50" : ""}`}>
                          <td className="px-4 py-2.5 font-mono text-xs font-bold text-pink-700">{g.ticketNo}</td>
                          <td className="px-4 py-2.5">
                            <div className="font-medium text-gray-800">{g.applicantName}</div>
                            <div className="text-xs text-gray-400">{g.mobile}</div>
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-600">{CATEGORY_LABEL[g.category] || g.category}</td>
                          <td className="px-4 py-2.5 max-w-[160px]"><div className="truncate text-gray-700">{g.subject}</div></td>
                          <td className="px-4 py-2.5 text-xs text-gray-500 whitespace-nowrap">{new Date(g.createdAt).toLocaleDateString("en-IN")}</td>
                          <td className="px-4 py-2.5 text-xs whitespace-nowrap">
                            {isDone ? (
                              <span className="text-gray-400">—</span>
                            ) : isOverdue ? (
                              <span className="text-red-600 font-bold">⚠ {Math.abs(dl)}d overdue</span>
                            ) : isUrgent ? (
                              <span className="text-orange-500 font-semibold">{dl}d left</span>
                            ) : (
                              <span className="text-gray-500">{dl}d left</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">{g.assignedTo || "—"}</td>
                          <td className="px-4 py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOR[g.status]}`}>
                              {STATUS_LABEL[g.status] || g.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => openUpdate(g)} className="h-7 w-7 p-0" title="View / Update">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => printComplaint(g)} className="h-7 w-7 p-0 text-orange-500 hover:text-orange-700 hover:bg-orange-50" title="Print Receipt">
                                <Printer className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && (
          <div className="space-y-5">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Received", value: items.length },
                { label: "Resolution Rate", value: items.length ? `${Math.round((stats.resolved / items.length) * 100)}%` : "0%" },
                { label: "Avg. Resolution Days", value: `${avgResolutionDays} days` },
                { label: "Currently Overdue", value: stats.overdue },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                  <p className="text-3xl font-bold text-[#1a3a6e]">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Status Breakdown */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-pink-600" /> Status Breakdown
                </h3>
                <div className="space-y-3">
                  {byStatus.map(s => (
                    <div key={s.key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{s.label}</span>
                        <span className="font-semibold text-gray-800">{s.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full transition-all" style={{ width: `${items.length ? (s.count / items.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                  {byStatus.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No data</p>}
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-blue-600" /> Category Breakdown
                </h3>
                <div className="space-y-3">
                  {byCategory.map(c => (
                    <div key={c.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{c.label}</span>
                        <span className="font-semibold text-gray-800">{c.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${items.length ? (c.count / items.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                  {byCategory.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No data</p>}
                </div>
              </div>
            </div>

            {/* Overdue list */}
            {stats.overdue > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                  <Bell className="h-4 w-4" /> Overdue Grievances ({stats.overdue})
                </h3>
                <div className="space-y-2">
                  {items.filter(i => !["resolved", "closed", "rejected"].includes(i.status) && daysLeft(i.createdAt) < 0).map(g => (
                    <div key={g.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-2.5 text-sm border border-red-100">
                      <span className="font-mono font-bold text-pink-700">{g.ticketNo}</span>
                      <span className="text-gray-700">{g.applicantName}</span>
                      <span className="text-xs text-gray-500">{CATEGORY_LABEL[g.category]}</span>
                      <span className="text-red-600 font-semibold text-xs">{Math.abs(daysLeft(g.createdAt))}d overdue</span>
                      <Button size="sm" variant="ghost" onClick={() => openUpdate(g)} className="h-6 px-2 text-xs">Update</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
              ℹ️ As per government norms, all grievances must be resolved within <strong>30 working days</strong> of submission.
              Overdue grievances are highlighted in red and require immediate attention.
            </div>
          </div>
        )}
      </div>

      {/* Update Dialog */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
              <h3 className="font-bold">Update — <span className="text-pink-600">{selected.ticketNo}</span></h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => printComplaint(selected)} className="h-8 gap-1.5 text-xs border-orange-300 text-orange-600 hover:bg-orange-50">
                  <Printer className="h-3.5 w-3.5" /> Print
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelected(null)}><X className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-b text-sm space-y-1">
              <p><span className="font-medium">Applicant:</span> {selected.applicantName} ({selected.mobile})</p>
              <p><span className="font-medium">Subject:</span> {selected.subject}</p>
              <p><span className="font-medium">Category:</span> {CATEGORY_LABEL[selected.category] || selected.category}</p>
              <p className="text-xs text-gray-500">{selected.description}</p>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <Label className="text-xs text-gray-600">Status</Label>
                <select value={updateForm.status} onChange={e => setUpdateForm(p => ({ ...p, status: e.target.value }))}
                  className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400">
                  {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              {[["Assigned To", "assignedTo"], ["Assigned Department", "assignedDepartment"]].map(([label, key]) => (
                <div key={key}>
                  <Label className="text-xs text-gray-600">{label}</Label>
                  <Input value={(updateForm as any)[key]} onChange={e => setUpdateForm(p => ({ ...p, [key]: e.target.value }))} className="mt-1" />
                </div>
              ))}
              <div>
                <Label className="text-xs text-gray-600">Resolution / Remarks</Label>
                <textarea value={updateForm.resolution} onChange={e => setUpdateForm(p => ({ ...p, resolution: e.target.value }))}
                  rows={3} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>
            </div>
            <div className="px-6 pb-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelected(null)}>Cancel</Button>
              <Button onClick={saveUpdate} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
                {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
