import { useState, useEffect, useCallback } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Wrench, CheckCircle, Clock, AlertCircle, Home, TrendingUp,
  Plus, Pencil, Trash2, Loader2, X, Receipt, Users,
  BarChart3, Settings, FileWarning, IndianRupee, Phone, Building2,
  CalendarDays, Search, BadgePercent, ChevronRight
} from "lucide-react";

/* ─── Types ────────────────────────────────────────────── */
interface Charge { id: number; propertyNo: string; ownerName: string; sector: string; plotNo: string; chargeYear: number; chargeMonth: number; chargeFromDate: string | null; chargeToDate: string | null; amount: string; penaltyAmount: string; dueDate: string; paidDate: string; receiptNo: string; paymentMode: string; status: string; remarks: string; createdAt: string; }
interface Property { id: number; propertyCode: string | null; propertyNo: string; ownerName: string; fatherName: string | null; ownerPhone: string; ownerEmail: string; sector: string; layoutNo: string | null; colonyName: string; plotNo: string; flatNo: string; propertyType: string; category: string | null; sectorBlock: string | null; area: string; allotmentDate: string; finalRegistryDate: string | null; address: string; isPossession: boolean; possessionDate: string; isDeveloped: boolean; developedDate: string; isCancelled: boolean; isActive: boolean; }
interface Rate { id: number; propertyType: string; isDeveloped: boolean; description: string; ratePerSqft: string; minimumCharge: string; effectiveFrom: string; effectiveTo: string | null; isActive: boolean; }
interface MReceipt { id: number; chargeId: number; receiptNo: string; paidAmount: string; paidDate: string; paymentMode: string; transactionRef: string; collectedBy: string; remarks: string; }

type Tab = "dashboard" | "properties" | "rates" | "demands" | "payments" | "defaulters";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  paid: "bg-green-100 text-green-700 border border-green-200",
  overdue: "bg-red-100 text-red-700 border border-red-200",
  waived: "bg-gray-100 text-gray-600 border border-gray-200",
};
const TYPE_COLOR: Record<string, string> = {
  residential: "bg-blue-100 text-blue-700",
  commercial: "bg-orange-100 text-orange-700",
  industrial: "bg-purple-100 text-purple-700",
};
const fmt = (n: string | number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().slice(0, 10);
const genReceipt = () => `MC-${Date.now().toString(36).toUpperCase()}`;

/* ─── Stat Card ────────────────────────────────────────── */
function StatCard({ label, value, sub, icon: Icon, color, onClick }: { label: string; value: string; sub?: string; icon: any; color: string; onClick?: () => void }) {
  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-all ${onClick ? "cursor-pointer hover:shadow-md hover:border-gray-300 active:scale-[0.98]" : ""}`}
      onClick={onClick}
    >
      <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center shrink-0`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {onClick && <ChevronRight className="h-4 w-4 text-gray-300 shrink-0" />}
    </div>
  );
}

/* ─── Section Header ───────────────────────────────────── */
function SectionHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-gray-800 text-base">{title}</h3>
      {action}
    </div>
  );
}

/* ─── TABLE wrapper ────────────────────────────────────── */
function DataTable({ heads, children, empty }: { heads: string[]; children: React.ReactNode; empty: boolean }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{heads.map(h => <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {empty
              ? <tr><td colSpan={heads.length} className="text-center py-10 text-gray-400">No records found.</td></tr>
              : children
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TAB 1 — DASHBOARD
══════════════════════════════════════════════════════ */
type TilePopup = "properties" | "all-demands" | "collected" | "pending" | "overdue" | "receipts" | null;

function DashboardTab({ charges, properties, receipts }: { charges: Charge[]; properties: Property[]; receipts: MReceipt[] }) {
  const [popup, setPopup] = useState<TilePopup>(null);
  const [popupSearch, setPopupSearch] = useState("");

  const totalDemand = charges.reduce((s, c) => s + Number(c.amount) + Number(c.penaltyAmount || 0), 0);
  const collected = charges.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount) + Number(c.penaltyAmount || 0), 0);
  const pending = charges.filter(c => c.status === "pending");
  const overdue = charges.filter(c => c.status === "overdue");
  const paid = charges.filter(c => c.status === "paid");
  const recovery = totalDemand > 0 ? ((collected / totalDemand) * 100).toFixed(1) : "0";

  const recent = [...charges].sort((a, b) => b.id - a.id).slice(0, 5);
  const topDefaulters = overdue.slice(0, 5);

  const openPopup = (key: TilePopup) => { setPopup(key); setPopupSearch(""); };

  /* ── Popup content resolver ── */
  const popupConfig: Record<NonNullable<TilePopup>, { title: string; color: string }> = {
    properties:    { title: `All Properties (${properties.length})`,    color: "text-blue-700"   },
    "all-demands": { title: `All Demands (${charges.length})`,           color: "text-orange-700" },
    collected:     { title: `Collected Payments (${paid.length})`,       color: "text-green-700"  },
    pending:       { title: `Pending Demands (${pending.length})`,       color: "text-yellow-700" },
    overdue:       { title: `Overdue / Notices (${overdue.length})`,     color: "text-red-700"    },
    receipts:      { title: `Receipts Issued (${receipts.length})`,      color: "text-purple-700" },
  };

  const sq = popupSearch.toLowerCase();

  const PopupBody = () => {
    if (!popup) return null;

    if (popup === "properties") {
      const rows = properties.filter(p =>
        !sq || (p.propertyCode || "").toLowerCase().includes(sq) ||
        p.propertyNo.toLowerCase().includes(sq) ||
        p.ownerName.toLowerCase().includes(sq) ||
        (p.sector || "").toLowerCase().includes(sq)
      );
      return (
        <div className="divide-y divide-gray-100 max-h-[55vh] overflow-y-auto">
          {rows.length === 0 ? <p className="text-center py-8 text-gray-400">No records found.</p> : rows.map(p => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div>
                <p className="font-mono font-semibold text-orange-700 text-sm">{p.propertyCode || p.propertyNo}</p>
                <p className="text-xs text-gray-500">{p.ownerName} {p.fatherName ? `· ${p.fatherName}` : ""}</p>
                <p className="text-[10px] text-gray-400">Sector {p.sector || "—"} · {p.category || p.propertyType}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${TYPE_COLOR[p.propertyType] || "bg-gray-100 text-gray-600"}`}>{p.propertyType}</span>
                {p.area && <p className="text-[10px] text-gray-400 mt-0.5">{p.area} sqft</p>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (popup === "receipts") {
      const rows = receipts.filter(r =>
        !sq || r.receiptNo.toLowerCase().includes(sq) ||
        (r.transactionRef || "").toLowerCase().includes(sq)
      );
      return (
        <div className="divide-y divide-gray-100 max-h-[55vh] overflow-y-auto">
          {rows.length === 0 ? <p className="text-center py-8 text-gray-400">No receipts found.</p> : rows.map(r => (
            <div key={r.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div>
                <p className="font-mono font-semibold text-purple-700 text-sm">{r.receiptNo}</p>
                <p className="text-xs text-gray-500">{r.paidDate} · {r.paymentMode?.toUpperCase()}</p>
                {r.transactionRef && <p className="text-[10px] text-gray-400">Ref: {r.transactionRef}</p>}
              </div>
              <p className="font-bold text-green-700 text-sm">{fmt(r.paidAmount)}</p>
            </div>
          ))}
        </div>
      );
    }

    // Demand-based popups
    const demandMap: Record<string, Charge[]> = {
      "all-demands": charges,
      collected: paid,
      pending,
      overdue,
    };
    const list = demandMap[popup] || [];
    const rows = list.filter(c =>
      !sq || c.propertyNo.toLowerCase().includes(sq) ||
      c.ownerName.toLowerCase().includes(sq) ||
      (c.sector || "").toLowerCase().includes(sq)
    );
    const total = rows.reduce((s, c) => s + Number(c.amount) + Number(c.penaltyAmount || 0), 0);

    return (
      <>
        {total > 0 && (
          <div className="px-5 py-2 bg-gray-50 border-b text-xs text-gray-500 flex justify-between">
            <span>{rows.length} records</span>
            <span className="font-semibold text-gray-700">Total: {fmt(total)}</span>
          </div>
        )}
        <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto">
          {rows.length === 0 ? <p className="text-center py-8 text-gray-400">No records found.</p> : rows.map(c => (
            <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
              <div>
                <p className="font-mono font-semibold text-orange-700 text-sm">{c.propertyNo}</p>
                <p className="text-xs text-gray-500">{c.ownerName} · {c.sector || "—"}</p>
                {c.chargeFromDate && <p className="text-[10px] text-gray-400">{c.chargeFromDate} → {c.chargeToDate}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">{fmt(Number(c.amount) + Number(c.penaltyAmount || 0))}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_COLOR[c.status]}`}>{c.status}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Properties"  value={String(properties.length)} icon={Home}         color="bg-blue-600"   onClick={() => openPopup("properties")}    />
        <StatCard label="Total Demand"      value={fmt(totalDemand)}          icon={IndianRupee}  color="bg-orange-600" onClick={() => openPopup("all-demands")}   />
        <StatCard label="Collected"         value={fmt(collected)}            sub={`${recovery}% recovery`} icon={CheckCircle} color="bg-green-600" onClick={() => openPopup("collected")} />
        <StatCard label="Pending Demands"   value={String(pending.length)}    icon={Clock}        color="bg-yellow-500" onClick={() => openPopup("pending")}       />
        <StatCard label="Overdue"           value={String(overdue.length)}    icon={AlertCircle}  color="bg-red-500"    onClick={() => openPopup("overdue")}       />
        <StatCard label="Receipts Issued"   value={String(receipts.length)}   icon={Receipt}      color="bg-purple-600" onClick={() => openPopup("receipts")}      />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Demands */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b bg-gray-50">
            <h4 className="font-semibold text-gray-700 text-sm">Recent Demands</h4>
          </div>
          {recent.length === 0
            ? <p className="text-center py-6 text-gray-400 text-sm">No demands yet.</p>
            : recent.map(c => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 border-b last:border-0 hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{c.propertyNo}</p>
                  <p className="text-xs text-gray-500">{c.ownerName} · {c.sector || "—"}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 text-sm">{fmt(c.amount)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${STATUS_COLOR[c.status]}`}>{c.status}</span>
                </div>
              </div>
            ))
          }
        </div>

        {/* Top Defaulters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b bg-red-50">
            <h4 className="font-semibold text-red-700 text-sm flex items-center gap-2"><FileWarning className="h-4 w-4" /> Top Defaulters</h4>
          </div>
          {topDefaulters.length === 0
            ? <p className="text-center py-6 text-gray-400 text-sm">No overdue demands.</p>
            : topDefaulters.map(c => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{c.propertyNo}</p>
                  <p className="text-xs text-gray-500">{c.ownerName}</p>
                </div>
                <p className="font-bold text-red-600 text-sm">{fmt(Number(c.amount) + Number(c.penaltyAmount || 0))}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* ── Tile Detail Popup ── */}
      <Dialog open={!!popup} onOpenChange={open => { if (!open) setPopup(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-5 pt-5 pb-3 border-b shrink-0">
            <DialogTitle className={`text-base font-bold ${popup ? popupConfig[popup].color : ""}`}>
              {popup ? popupConfig[popup].title : ""}
            </DialogTitle>
          </DialogHeader>
          {/* Search */}
          <div className="px-5 py-3 border-b shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={popupSearch}
                onChange={e => setPopupSearch(e.target.value)}
                className="pl-9 text-sm"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            <PopupBody />
          </div>
          <div className="px-5 py-3 border-t bg-gray-50 shrink-0 flex justify-end">
            <Button variant="outline" onClick={() => setPopup(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TAB 2 — PROPERTIES
══════════════════════════════════════════════════════ */
const emptyProp = { propertyCode: "", propertyNo: "", ownerName: "", fatherName: "", ownerPhone: "", ownerEmail: "", sector: "", layoutNo: "", colonyName: "", plotNo: "", flatNo: "", propertyType: "residential", category: "", sectorBlock: "", area: "", allotmentDate: "", finalRegistryDate: "", address: "", isPossession: false, possessionDate: "", isDeveloped: false, developedDate: "", isCancelled: false };

function PropertiesTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(emptyProp);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => { setLoading(true); const r = await apiFetch("/maintenance/properties"); setItems(await r.json()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  const sf = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.propertyNo || !form.ownerName) { toast({ title: "Property No. and Owner Name required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editId) await apiFetch(`/maintenance/properties/${editId}`, { method: "PUT", body: JSON.stringify(form) });
      else await apiFetch("/maintenance/properties", { method: "POST", body: JSON.stringify(form) });
      toast({ title: editId ? "Property updated" : "Property added" });
      setDialog(false); load();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this property?")) return;
    await apiFetch(`/maintenance/properties/${id}`, { method: "DELETE" });
    toast({ title: "Deleted" }); load();
  };

  const filtered = items.filter(p =>
    !search ||
    (p.propertyCode || "").toLowerCase().includes(search.toLowerCase()) ||
    p.propertyNo.toLowerCase().includes(search.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    (p.fatherName || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.sector || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.sectorBlock || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SectionHead title={`Properties Register (${items.length})`} action={
        <Button onClick={() => { setEditId(null); setForm(emptyProp); setDialog(true); }} className="bg-orange-600 hover:bg-orange-700 gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Property
        </Button>
      } />
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input placeholder="Search by property code, owner, father name, sector, category..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
        <DataTable heads={["Property Code", "Owner", "Contact", "Sector / Category", "Type", "Area (Sq. Feet)", "Registry Date", "Status", "Actions"]} empty={filtered.length === 0}>
          {filtered.map(p => (
            <tr key={p.id} className={`hover:bg-gray-50 ${p.isCancelled ? "opacity-50" : ""}`}>
              <td className="px-4 py-2.5">
                <p className="font-mono font-semibold text-orange-700 text-sm">{p.propertyCode || p.propertyNo}</p>
                <p className="text-[10px] text-gray-400">Plot: {p.plotNo || "—"} {p.layoutNo ? `· Layout: ${p.layoutNo}` : ""}</p>
              </td>
              <td className="px-4 py-2.5">
                <p className="font-medium text-gray-800 text-sm">{p.ownerName}</p>
                {p.fatherName && <p className="text-[10px] text-gray-400">S/o D/o W/o: {p.fatherName}</p>}
              </td>
              <td className="px-4 py-2.5 text-gray-600 text-xs">
                <p>{p.ownerPhone || "—"}</p>
                {p.ownerEmail && <p className="text-[10px] text-gray-400">{p.ownerEmail}</p>}
              </td>
              <td className="px-4 py-2.5 text-gray-600 text-xs">
                <p>Sector: {p.sector || "—"} {p.sectorBlock ? `(${p.sectorBlock})` : ""}</p>
                {p.category && <p className="text-[10px] text-gray-400">Category: {p.category}</p>}
                {p.colonyName && <p className="text-[10px] text-gray-400">{p.colonyName}</p>}
              </td>
              <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${TYPE_COLOR[p.propertyType] || "bg-gray-100 text-gray-600"}`}>{p.propertyType}</span></td>
              <td className="px-4 py-2.5 text-gray-600 text-sm">{p.area || "—"}</td>
              <td className="px-4 py-2.5 text-xs">
                {p.finalRegistryDate
                  ? <div><span className="text-gray-700 font-medium">{p.finalRegistryDate}</span></div>
                  : <span className="text-gray-400">—</span>}
                {p.possessionDate && p.possessionDate !== p.finalRegistryDate && <p className="text-[10px] text-gray-400">Possession: {p.possessionDate}</p>}
              </td>
              <td className="px-4 py-2.5 space-y-1">
                {p.isCancelled && <span className="block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Cancelled</span>}
                {p.isDeveloped && <span className="block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">Developed</span>}
                {p.isPossession && !p.isCancelled && !p.isDeveloped && <span className="block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Possession</span>}
                {!p.isCancelled && !p.isDeveloped && !p.isPossession && <span className="text-xs text-gray-400">Pending</span>}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => { setEditId(p.id); setForm({ ...p, propertyCode: p.propertyCode || "", fatherName: p.fatherName || "", layoutNo: p.layoutNo || "", category: p.category || "", sectorBlock: p.sectorBlock || "", area: p.area || "", allotmentDate: p.allotmentDate || "", finalRegistryDate: p.finalRegistryDate || "", possessionDate: p.possessionDate || "", developedDate: p.developedDate || "" }); setDialog(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => del(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Property</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {/* ── Basic identifiers ── */}
            {[
              { label: "Property Code", key: "propertyCode" }, { label: "Property No. *", key: "propertyNo" },
              { label: "Owner Name *", key: "ownerName" }, { label: "Father / Husband Name", key: "fatherName" },
              { label: "Owner Phone", key: "ownerPhone" }, { label: "Owner Email", key: "ownerEmail" },
            ].map(f => (
              <div key={f.key}><Label className="text-xs text-gray-600">{f.label}</Label><Input type="text" value={form[f.key] || ""} onChange={e => sf(f.key, e.target.value)} className="mt-1" /></div>
            ))}
            {/* ── Location ── */}
            {[
              { label: "Sector", key: "sector" }, { label: "Sector / Block", key: "sectorBlock" },
              { label: "Layout No.", key: "layoutNo" }, { label: "Plot No.", key: "plotNo" },
              { label: "Flat No.", key: "flatNo" }, { label: "Colony Name", key: "colonyName" },
            ].map(f => (
              <div key={f.key}><Label className="text-xs text-gray-600">{f.label}</Label><Input type="text" value={form[f.key] || ""} onChange={e => sf(f.key, e.target.value)} className="mt-1" /></div>
            ))}
            {/* ── Property details ── */}
            <div>
              <Label className="text-xs text-gray-600">Property Type</Label>
              <select value={form.propertyType} onChange={e => sf("propertyType", e.target.value)} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                <option value="plot">Plot</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div><Label className="text-xs text-gray-600">Category (e.g. A-1, B, B-1)</Label><Input value={form.category || ""} onChange={e => sf("category", e.target.value)} className="mt-1" /></div>
            {[
              { label: "Area (Sq. Feet)", key: "area" },
              { label: "Allotment Date", key: "allotmentDate", type: "date" },
              { label: "Final Registry Date", key: "finalRegistryDate", type: "date" },
            ].map(f => (
              <div key={f.key}><Label className="text-xs text-gray-600">{f.label}</Label><Input type={f.type || "text"} value={form[f.key] || ""} onChange={e => sf(f.key, e.target.value)} className="mt-1" /></div>
            ))}
            <div className="col-span-2"><Label className="text-xs text-gray-600">Address</Label><Input value={form.address || ""} onChange={e => sf("address", e.target.value)} className="mt-1" /></div>
            {/* ── Cancelled flag ── */}
            <div className="col-span-2 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <input type="checkbox" id="isCancelled" checked={!!form.isCancelled} onChange={e => sf("isCancelled", e.target.checked)} className="mt-0.5 accent-red-600 w-4 h-4 cursor-pointer" />
              <div><label htmlFor="isCancelled" className="text-sm font-semibold text-red-800 cursor-pointer">Allotment Cancelled</label><p className="text-xs text-red-600">Mark if this allotment has been cancelled</p></div>
            </div>

            {/* ── Possession ── */}
            <div className="col-span-2 border-t pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Possession & Development Status</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <input
                    type="checkbox" id="isPossession"
                    checked={!!form.isPossession}
                    onChange={e => sf("isPossession", e.target.checked)}
                    className="mt-0.5 accent-blue-600 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="isPossession" className="text-sm font-semibold text-blue-800 cursor-pointer">Is Possession</label>
                    <p className="text-xs text-blue-600">Property ka possession diya ja chuka hai</p>
                    {form.isPossession && (
                      <div className="mt-2">
                        <Label className="text-xs text-gray-600">Possession Date</Label>
                        <Input type="date" value={form.possessionDate || ""} onChange={e => sf("possessionDate", e.target.value)} className="mt-1 max-w-[200px]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <input
                    type="checkbox" id="isDeveloped"
                    checked={!!form.isDeveloped}
                    onChange={e => sf("isDeveloped", e.target.checked)}
                    className="mt-0.5 accent-green-600 w-4 h-4 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="isDeveloped" className="text-sm font-semibold text-green-800 cursor-pointer">Is Developed</label>
                    <p className="text-xs text-green-600">Area is developed — a separate maintenance charge rate will be applicable</p>
                    {form.isDeveloped && (
                      <div className="mt-2">
                        <Label className="text-xs text-gray-600">Development Date</Label>
                        <Input type="date" value={form.developedDate || ""} onChange={e => sf("developedDate", e.target.value)} className="mt-1 max-w-[200px]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editId ? "Update" : "Add Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TAB 3 — RATE SLABS
══════════════════════════════════════════════════════ */
const emptyRate = { propertyType: "residential", isDeveloped: false, description: "", ratePerSqft: "", minimumCharge: "", effectiveFrom: today(), effectiveTo: "", isActive: true };

function RatesTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<any>(emptyRate);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => { setLoading(true); const r = await apiFetch("/maintenance/rates"); setItems(await r.json()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);
  const sf = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, effectiveTo: form.effectiveTo || null };
      const res = editId
        ? await apiFetch(`/maintenance/rates/${editId}`, { method: "PUT", body: JSON.stringify(payload) })
        : await apiFetch("/maintenance/rates", { method: "POST", body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: err.error || "Error saving rate slab", variant: "destructive" });
        return;
      }
      toast({ title: "Rate slab saved" }); setDialog(false); load();
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this rate slab?")) return;
    await apiFetch(`/maintenance/rates/${id}`, { method: "DELETE" });
    toast({ title: "Deleted" }); load();
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">How Rate Slabs Work</p>
        <p>Set rate per sqft for each property type. When generating demands, charges are calculated as: <strong>Area × Rate/sqft</strong> (minimum charge applies). Mark old slabs inactive when revising rates.</p>
      </div>
      <SectionHead title="Rate Slabs" action={
        <Button onClick={() => { setEditId(null); setForm(emptyRate); setDialog(true); }} className="bg-orange-600 hover:bg-orange-700 gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Rate Slab
        </Button>
      } />
      {loading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
        <DataTable heads={["Property Type", "Area Type", "Rate/Sqft (₹)", "Minimum Charge", "Effective From", "Effective To", "Description", "Status", "Actions"]} empty={items.length === 0}>
          {items.map(r => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${TYPE_COLOR[r.propertyType] || "bg-gray-100 text-gray-700"}`}>{r.propertyType}</span></td>
              <td className="px-4 py-2.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.isDeveloped ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {r.isDeveloped ? "Developed" : "Undeveloped"}
                </span>
              </td>
              <td className="px-4 py-2.5 font-semibold text-gray-800">{r.ratePerSqft ? `₹${r.ratePerSqft}` : "—"}</td>
              <td className="px-4 py-2.5 text-gray-700">{r.minimumCharge ? fmt(r.minimumCharge) : "—"}</td>
              <td className="px-4 py-2.5 text-gray-600 text-xs">{r.effectiveFrom || "—"}</td>
              <td className="px-4 py-2.5 text-xs">
                {r.effectiveTo
                  ? <span className="text-gray-600">{r.effectiveTo}</span>
                  : <span className="text-green-600 font-semibold">Open</span>
                }
              </td>
              <td className="px-4 py-2.5 text-gray-500 text-xs max-w-[180px] truncate">{r.description || "—"}</td>
              <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{r.isActive ? "Active" : "Inactive"}</span></td>
              <td className="px-4 py-2.5">
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => { setEditId(r.id); setForm({ ...r, ratePerSqft: r.ratePerSqft || "", minimumCharge: r.minimumCharge || "", effectiveTo: r.effectiveTo || "" }); setDialog(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => del(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Edit" : "Add"} Rate Slab</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <Label className="text-xs text-gray-600">Property Type</Label>
              <select value={form.propertyType} onChange={e => sf("propertyType", e.target.value)} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <div><Label className="text-xs text-gray-600">Rate Per Sqft (₹)</Label><Input type="number" value={form.ratePerSqft} onChange={e => sf("ratePerSqft", e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs text-gray-600">Minimum Charge (₹)</Label><Input type="number" value={form.minimumCharge} onChange={e => sf("minimumCharge", e.target.value)} className="mt-1" /></div>
            <div>
              <Label className="text-xs text-gray-600">Effective From *</Label>
              <Input type="date" value={form.effectiveFrom} onChange={e => sf("effectiveFrom", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Effective To <span className="text-gray-400">(leave blank = open)</span></Label>
              <Input type="date" value={form.effectiveTo || ""} onChange={e => sf("effectiveTo", e.target.value)} className="mt-1" min={form.effectiveFrom || undefined} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs text-gray-600">Description</Label>
              <textarea
                value={form.description || ""}
                onChange={e => sf("description", e.target.value)}
                placeholder="e.g. FY 2025-26 revised rate — as per BDA notification dated..."
                rows={3}
                className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Developed area toggle */}
            <div className="col-span-2 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <input
                type="checkbox" id="rateDeveloped"
                checked={!!form.isDeveloped}
                onChange={e => sf("isDeveloped", e.target.checked)}
                className="mt-0.5 accent-green-600 w-4 h-4 cursor-pointer"
              />
              <div>
                <label htmlFor="rateDeveloped" className="text-sm font-semibold text-green-800 cursor-pointer">Developed Area Rate</label>
                <p className="text-xs text-green-600 mt-0.5">Enable this to apply the rate slab only to developed properties. Uncheck for undeveloped area rate.</p>
              </div>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="rateActive" checked={form.isActive} onChange={e => sf("isActive", e.target.checked)} className="accent-orange-600" />
              <label htmlFor="rateActive" className="text-sm text-gray-700">Active</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}Save Slab
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TAB 4 — DEMAND REGISTER
══════════════════════════════════════════════════════ */
const emptyDemand = { propertyNo: "", ownerName: "", sector: "", plotNo: "", chargeYear: new Date().getFullYear(), chargeMonth: "", amount: "", penaltyAmount: "0", dueDate: "", paidDate: "", receiptNo: "", paymentMode: "", status: "pending", remarks: "" };

function DemandsTab({ onPaymentAdded, properties, rates }: { onPaymentAdded: () => void; properties: Property[]; rates: Rate[] }) {
  const { toast } = useToast();
  const [items, setItems] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [payDialog, setPayDialog] = useState(false);
  const [genDialog, setGenDialog] = useState(false);
  const [propSearch, setPropSearch] = useState("");
  const [receiptDialog, setReceiptDialog] = useState(false);
  const [receiptItem, setReceiptItem] = useState<Charge | null>(null);
  const [editItem, setEditItem] = useState<Charge | null>(null);
  const [payItem, setPayItem] = useState<Charge | null>(null);
  const [form, setForm] = useState<any>(emptyDemand);
  const [payForm, setPayForm] = useState({ paidDate: today(), paymentMode: "cash", transactionRef: "", collectedBy: "", remarks: "" });
  const [genForm, setGenForm] = useState({ propertyId: "", year: new Date().getFullYear(), period: "annual", dueDate: "", penaltyAmount: "0", remarks: "" });
  const [manualAmount, setManualAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [search, setSearch] = useState("");

  /* ── Helper fns (inside component to use genForm) ── */
  const parseD = (s: string | null | undefined): Date | null => s ? new Date(s) : null;
  const fmtD   = (d: Date) => d.toISOString().slice(0, 10);
  const daysBetween = (a: Date, b: Date) => Math.max(0, Math.floor((b.getTime() - a.getTime()) / 86400000) + 1);
  const getPeriodDates = (yr: number, period: string): [Date, Date] => {
    switch (period) {
      case "q1": return [new Date(yr, 3, 1),  new Date(yr, 5, 30)];
      case "q2": return [new Date(yr, 6, 1),  new Date(yr, 8, 30)];
      case "q3": return [new Date(yr, 9, 1),  new Date(yr, 11, 31)];
      case "q4": return [new Date(yr, 0, 1),  new Date(yr, 2, 31)];
      default:   return [new Date(yr, 0, 1),  new Date(yr, 11, 31)];
    }
  };

  /* ── Generate Demand: live calculation ── */
  const selProp = properties.find(p => String(p.id) === genForm.propertyId) || null;

  // Helper: find rate active on a given date string (YYYY-MM-DD)
  const rateOnDate = (isDev: boolean, onDate: string | null): Rate | null => {
    if (!selProp || !onDate) return null;
    const candidates = rates.filter(r =>
      r.propertyType === selProp.propertyType &&
      !!r.isDeveloped === isDev &&
      r.isActive &&
      (!r.effectiveFrom || r.effectiveFrom <= onDate) &&
      (!r.effectiveTo   || r.effectiveTo   >= onDate)
    );
    // pick the one with the latest effectiveFrom (most recent applicable slab)
    return candidates.sort((a, b) => (b.effectiveFrom || "").localeCompare(a.effectiveFrom || ""))[0] || null;
  };

  const [periodStart, periodEnd] = getPeriodDates(genForm.year, genForm.period);

  // Effective start: possession date, then pushed forward by last demand's chargeToDate
  const possDate = parseD(selProp?.possessionDate);
  const propDemands = selProp
    ? items
        .filter(i => i.propertyNo === selProp.propertyNo && i.chargeToDate)
        .sort((a, b) => new Date(b.chargeToDate!).getTime() - new Date(a.chargeToDate!).getTime())
    : [];
  const lastCoveredDate = propDemands.length > 0 ? parseD(propDemands[0].chargeToDate) : null;

  let effectiveStart: Date = possDate || periodStart;
  if (lastCoveredDate) {
    const nextDay = new Date(lastCoveredDate.getTime() + 86400000);
    if (nextDay > effectiveStart) effectiveStart = nextDay;
  }
  if (effectiveStart < periodStart) effectiveStart = new Date(periodStart);
  const hasChargeDays = effectiveStart <= periodEnd;

  // Split at developedDate
  const devDate = selProp?.isDeveloped && selProp.developedDate ? parseD(selProp.developedDate) : null;
  let undevelopedDays = 0, developedDays = 0;
  let undevelopedFrom: Date | null = null, undevelopedTo: Date | null = null;
  let developedFrom: Date | null = null, developedTo: Date | null = null;

  if (hasChargeDays) {
    if (devDate && devDate <= periodEnd) {
      if (devDate > effectiveStart) {
        // Undeveloped: effectiveStart → devDate-1; Developed: devDate → periodEnd
        const undTo = new Date(devDate.getTime() - 86400000);
        undevelopedDays = daysBetween(effectiveStart, undTo);
        developedDays   = daysBetween(devDate, periodEnd);
        undevelopedFrom = effectiveStart; undevelopedTo = undTo;
        developedFrom   = devDate;        developedTo   = periodEnd;
      } else {
        // devDate ≤ effectiveStart → all developed
        developedDays = daysBetween(effectiveStart, periodEnd);
        developedFrom = effectiveStart; developedTo = periodEnd;
      }
    } else if (selProp?.isDeveloped) {
      // isDeveloped but devDate after period (or null) → all developed
      developedDays = daysBetween(effectiveStart, periodEnd);
      developedFrom = effectiveStart; developedTo = periodEnd;
    } else {
      // Not developed → all undeveloped
      undevelopedDays = daysBetween(effectiveStart, periodEnd);
      undevelopedFrom = effectiveStart; undevelopedTo = periodEnd;
    }
  }

  // Pick the rate active on the start of each sub-period (date-based)
  const undevelopedRate = rateOnDate(false, undevelopedFrom ? fmtD(undevelopedFrom) : null);
  const developedRate   = rateOnDate(true,  developedFrom   ? fmtD(developedFrom)   : null);

  const area = Number(selProp?.area || 0);
  const undAmt = undevelopedDays > 0 && undevelopedRate
    ? (area * Number(undevelopedRate.ratePerSqft) / 365) * undevelopedDays : 0;
  const devAmt = developedDays > 0 && developedRate
    ? (area * Number(developedRate.ratePerSqft) / 365) * developedDays : 0;
  const calcAmount = Math.round((undAmt + devAmt) * 100) / 100;
  const noRateSlab = selProp && !undevelopedRate && !developedRate;
  const effectiveAmount = calcAmount > 0 ? calcAmount : Number(manualAmount || 0);
  const calcTotal  = effectiveAmount + Number(genForm.penaltyAmount || 0);
  const chargeFromDate = hasChargeDays ? fmtD(effectiveStart) : null;
  const chargeToDate   = hasChargeDays ? fmtD(periodEnd)      : null;

  const gf = (k: string, v: any) => setGenForm(f => ({ ...f, [k]: v }));

  const load = useCallback(async () => { setLoading(true); const r = await apiFetch("/maintenance"); setItems(await r.json()); setLoading(false); }, []);
  useEffect(() => { load(); }, [load]);

  const sf = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.propertyNo || !form.ownerName || !form.amount) { toast({ title: "Required fields missing", variant: "destructive" }); return; }
    setSaving(true);
    try {
      if (editItem) await apiFetch(`/maintenance/${editItem.id}`, { method: "PUT", body: JSON.stringify(form) });
      else await apiFetch("/maintenance", { method: "POST", body: JSON.stringify(form) });
      toast({ title: editItem ? "Demand updated" : "Demand added" }); setDialog(false); load();
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const markPaid = async () => {
    if (!payItem) return;
    setSaving(true);
    try {
      const rno = genReceipt();
      const updatedItem: Charge = { ...payItem, status: "paid", paidDate: payForm.paidDate, receiptNo: rno, paymentMode: payForm.paymentMode };
      await apiFetch(`/maintenance/${payItem.id}`, { method: "PUT", body: JSON.stringify(updatedItem) });
      await apiFetch("/maintenance/receipts", { method: "POST", body: JSON.stringify({ chargeId: payItem.id, receiptNo: rno, paidAmount: String(Number(payItem.amount) + Number(payItem.penaltyAmount || 0)), paidDate: payForm.paidDate, paymentMode: payForm.paymentMode, transactionRef: payForm.transactionRef, collectedBy: payForm.collectedBy, remarks: payForm.remarks }) });
      setPayDialog(false);
      setReceiptItem(updatedItem);
      setReceiptDialog(true);
      load(); onPaymentAdded();
    } catch { toast({ title: "Error recording payment", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const printReceipt = (item: Charge) => {
    const total = Number(item.amount) + Number(item.penaltyAmount || 0);
    const modeLabel = (item.paymentMode || "cash").toUpperCase();
    const w = window.open("", "_blank", "width=800,height=600");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Maintenance Receipt — ${item.receiptNo}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Arial', sans-serif; color: #1a1a1a; background: #fff; padding: 32px; }
      .header { text-align: center; border-bottom: 3px double #b45309; padding-bottom: 16px; margin-bottom: 20px; }
      .logo-line { font-size: 22px; font-weight: 800; color: #b45309; letter-spacing: 1px; }
      .sub-line { font-size: 13px; color: #555; margin-top: 4px; }
      .receipt-title { font-size: 16px; font-weight: 700; margin-top: 10px; background: #fef3c7; padding: 6px 20px; display: inline-block; border-radius: 4px; color: #92400e; letter-spacing: 2px; }
      .receipt-no { text-align: right; font-size: 12px; color: #666; margin-bottom: 16px; }
      .receipt-no strong { font-size: 14px; color: #b45309; }
      .section { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
      .section h3 { font-size: 11px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
      .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .field label { font-size: 10px; color: #888; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
      .field span { font-size: 13px; font-weight: 600; color: #1a1a1a; }
      .amount-box { background: #b45309; color: white; border-radius: 8px; padding: 16px 24px; text-align: center; margin-bottom: 16px; }
      .amount-box .label { font-size: 11px; opacity: 0.85; text-transform: uppercase; letter-spacing: 1px; }
      .amount-box .value { font-size: 28px; font-weight: 800; margin-top: 4px; }
      .breakdown { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; border-bottom: 1px dashed #e5e7eb; }
      .breakdown:last-child { border: none; }
      .footer { text-align: center; font-size: 11px; color: #888; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 14px; }
      .paid-stamp { position: absolute; top: 120px; right: 60px; transform: rotate(-15deg); border: 4px solid #16a34a; color: #16a34a; padding: 8px 18px; font-size: 24px; font-weight: 900; border-radius: 6px; opacity: 0.6; letter-spacing: 4px; }
      @media print { body { padding: 16px; } .no-print { display: none; } }
    </style></head><body>
    <div style="position:relative;">
      <div class="header">
        <div class="logo-line">BAREILLY DEVELOPMENT AUTHORITY</div>
        <div class="sub-line">Government of Uttar Pradesh · Enterprise Resource Planning (ERP)</div>
        <div style="margin-top:8px;"><span class="receipt-title">MAINTENANCE CHARGE RECEIPT</span></div>
      </div>
      <div class="paid-stamp">PAID</div>
      <div class="receipt-no">
        Receipt No: <strong>${item.receiptNo || "—"}</strong> &nbsp;|&nbsp;
        Date: <strong>${item.paidDate || new Date().toISOString().slice(0, 10)}</strong>
      </div>
      <div class="section">
        <h3>Property Details</h3>
        <div class="grid2">
          <div class="field"><label>Property No.</label><span>${item.propertyNo}</span></div>
          <div class="field"><label>Owner Name</label><span>${item.ownerName}</span></div>
          <div class="field"><label>Sector</label><span>${item.sector || "—"}</span></div>
          <div class="field"><label>Plot No.</label><span>${item.plotNo || "—"}</span></div>
        </div>
      </div>
      <div class="section">
        <h3>Charge Details</h3>
        <div class="grid2">
          <div class="field"><label>Charge Year</label><span>${item.chargeYear}</span></div>
          <div class="field"><label>Payment Mode</label><span>${modeLabel}</span></div>
          ${item.chargeFromDate ? `<div class="field"><label>Period From</label><span>${item.chargeFromDate}</span></div>` : ""}
          ${item.chargeToDate ? `<div class="field"><label>Period To</label><span>${item.chargeToDate}</span></div>` : ""}
        </div>
        <div style="margin-top:12px;">
          <div class="breakdown"><span>Maintenance Charge</span><span>₹${Number(item.amount).toLocaleString("en-IN")}</span></div>
          ${Number(item.penaltyAmount || 0) > 0 ? `<div class="breakdown"><span>Penalty</span><span>₹${Number(item.penaltyAmount).toLocaleString("en-IN")}</span></div>` : ""}
        </div>
      </div>
      <div class="amount-box">
        <div class="label">Amount Paid</div>
        <div class="value">₹${total.toLocaleString("en-IN")}</div>
      </div>
      <div class="footer">
        This is a computer-generated receipt and does not require a physical signature.<br/>
        Bareilly Development Authority · Bareilly, Uttar Pradesh
      </div>
      <div class="no-print" style="text-align:center;margin-top:20px;">
        <button onclick="window.print()" style="background:#b45309;color:white;border:none;padding:10px 30px;border-radius:6px;font-size:14px;cursor:pointer;font-weight:600;">🖨️ Print</button>
        <button onclick="window.close()" style="background:#e5e7eb;color:#374151;border:none;padding:10px 20px;border-radius:6px;font-size:14px;cursor:pointer;font-weight:600;margin-left:8px;">Close</button>
      </div>
    </div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 500);
  };

  const generateDemand = async () => {
    if (!selProp) { toast({ title: "Please select a property first", variant: "destructive" }); return; }
    if (!hasChargeDays) { toast({ title: "No chargeable days in this period — either already charged or period not yet started", variant: "destructive" }); return; }
    if (effectiveAmount <= 0) { toast({ title: "Please enter the demand amount", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const periodLabel = genForm.period === "annual" ? "Annual" : genForm.period.toUpperCase();
      const breakdownNote = calcAmount > 0 ? [
        undevelopedDays > 0 && undevelopedRate ? `Undeveloped: ${undevelopedDays} days × ₹${undevelopedRate.ratePerSqft}/sqft/yr = ${fmt(undAmt)}` : "",
        developedDays > 0 && developedRate     ? `Developed: ${developedDays} days × ₹${developedRate.ratePerSqft}/sqft/yr = ${fmt(devAmt)}` : "",
      ].filter(Boolean).join(" | ") : `Manual amount: ${fmt(effectiveAmount)}`;
      await apiFetch("/maintenance", {
        method: "POST",
        body: JSON.stringify({
          propertyNo:    selProp.propertyNo,
          ownerName:     selProp.ownerName,
          sector:        selProp.sector  || "",
          plotNo:        selProp.plotNo  || "",
          chargeYear:    genForm.year,
          chargeFromDate,
          chargeToDate,
          amount:        String(effectiveAmount),
          penaltyAmount: genForm.penaltyAmount || "0",
          dueDate:       genForm.dueDate || null,
          status:        "pending",
          remarks:       `Auto-generated [${periodLabel}] ${chargeFromDate} to ${chargeToDate} | Area: ${selProp.area} sqft | ${breakdownNote}${genForm.remarks ? " | " + genForm.remarks : ""}`.trim(),
        }),
      });
      toast({ title: `Demand generated — ${selProp.propertyNo} — ${fmt(effectiveAmount)}` });
      setGenDialog(false);
      setGenForm({ propertyId: "", year: new Date().getFullYear(), period: "annual", dueDate: "", penaltyAmount: "0", remarks: "" });
      setManualAmount("");
      load();
    } catch { toast({ title: "Error generating demand", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const years = [...new Set(items.map(i => String(i.chargeYear)))].sort().reverse();
  const filtered = items.filter(i =>
    (filterStatus === "all" || i.status === filterStatus) &&
    (filterYear === "all" || String(i.chargeYear) === filterYear) &&
    (!search || i.propertyNo.toLowerCase().includes(search.toLowerCase()) || i.ownerName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <SectionHead title={`Demand Register (${filtered.length})`} action={
        <div className="flex gap-2">
          <Button onClick={() => { setGenForm({ propertyId: "", year: new Date().getFullYear(), period: "annual", dueDate: "", penaltyAmount: "0", remarks: "" }); setGenDialog(true); }} variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 gap-2 text-sm">
            <TrendingUp className="h-4 w-4" /> Generate Demand
          </Button>
          <Button onClick={() => { setEditItem(null); setForm(emptyDemand); setDialog(true); }} className="bg-orange-600 hover:bg-orange-700 gap-2 text-sm">
            <Plus className="h-4 w-4" /> Add Manually
          </Button>
        </div>
      } />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input placeholder="Search property / owner..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-md px-3 py-2 text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
          <option value="waived">Waived</option>
        </select>
        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="border border-gray-200 rounded-md px-3 py-2 text-sm">
          <option value="all">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div> : (
        <DataTable heads={["Property No.", "Owner", "Year", "Amount", "Penalty", "Total", "Due Date", "Status", "Receipt", "Actions"]} empty={filtered.length === 0}>
          {filtered.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2.5 font-mono font-semibold text-orange-700">{item.propertyNo}</td>
              <td className="px-4 py-2.5"><p className="font-medium text-gray-800">{item.ownerName}</p><p className="text-xs text-gray-400">{item.sector}</p></td>
              <td className="px-4 py-2.5 text-gray-600">{item.chargeYear}</td>
              <td className="px-4 py-2.5 text-gray-700 font-medium">{fmt(item.amount)}</td>
              <td className="px-4 py-2.5 text-red-600 text-xs">{item.penaltyAmount && Number(item.penaltyAmount) > 0 ? fmt(item.penaltyAmount) : "—"}</td>
              <td className="px-4 py-2.5 font-semibold text-gray-800">{fmt(Number(item.amount) + Number(item.penaltyAmount || 0))}</td>
              <td className="px-4 py-2.5 text-gray-500 text-xs">{item.dueDate || "—"}</td>
              <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[item.status]}`}>{item.status}</span></td>
              <td className="px-4 py-2.5 text-xs text-gray-500 font-mono">{item.receiptNo || "—"}</td>
              <td className="px-4 py-2.5">
                <div className="flex gap-1 items-center">
                  {item.status !== "paid" && (
                    <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50 text-xs px-2" onClick={() => { setPayItem(item); setPayForm({ paidDate: today(), paymentMode: "cash", transactionRef: "", collectedBy: "", remarks: "" }); setPayDialog(true); }}>
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Pay
                    </Button>
                  )}
                  {item.status === "paid" && item.receiptNo && (
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50 text-xs px-2" onClick={() => printReceipt(item)}>
                      <Receipt className="h-3.5 w-3.5 mr-1" /> Print
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => { setEditItem(item); setForm({ ...item }); setDialog(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {/* Add/Edit Demand Dialog */}
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? "Edit" : "Add"} Demand</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              { label: "Property No. *", key: "propertyNo" }, { label: "Owner Name *", key: "ownerName" },
              { label: "Sector", key: "sector" }, { label: "Plot No.", key: "plotNo" },
              { label: "Year *", key: "chargeYear", type: "number" }, { label: "Month", key: "chargeMonth", type: "number" },
              { label: "Amount (₹) *", key: "amount", type: "number" }, { label: "Penalty (₹)", key: "penaltyAmount", type: "number" },
              { label: "Due Date", key: "dueDate", type: "date" }, { label: "Paid Date", key: "paidDate", type: "date" },
              { label: "Receipt No.", key: "receiptNo" }, { label: "Payment Mode", key: "paymentMode" },
            ].map(f => (
              <div key={f.key}><Label className="text-xs text-gray-600">{f.label}</Label><Input type={f.type || "text"} value={form[f.key] || ""} onChange={e => sf(f.key, e.target.value)} className="mt-1" /></div>
            ))}
            <div>
              <Label className="text-xs text-gray-600">Status</Label>
              <select value={form.status} onChange={e => sf("status", e.target.value)} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                {["pending", "paid", "overdue", "waived"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div><Label className="text-xs text-gray-600">Remarks</Label><Input value={form.remarks || ""} onChange={e => sf("remarks", e.target.value)} className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-orange-600 hover:bg-orange-700">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}{editItem ? "Update" : "Add Demand"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Dialog */}
      <Dialog open={payDialog} onOpenChange={setPayDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-700">Record Payment</DialogTitle>
          </DialogHeader>
          {payItem && (
            <div className="space-y-4 py-2">
              <div className="bg-green-50 rounded-lg p-3 text-sm">
                <p className="font-semibold text-gray-800">{payItem.propertyNo} — {payItem.ownerName}</p>
                <p className="text-green-700 font-bold text-lg mt-1">{fmt(Number(payItem.amount) + Number(payItem.penaltyAmount || 0))}</p>
                <p className="text-gray-500 text-xs">Year: {payItem.chargeYear}</p>
              </div>
              {[
                { label: "Payment Date *", key: "paidDate", type: "date" },
                { label: "Transaction Ref / UPI ID", key: "transactionRef" },
                { label: "Collected By", key: "collectedBy" },
                { label: "Remarks", key: "remarks" },
              ].map(f => (
                <div key={f.key}><Label className="text-xs text-gray-600">{f.label}</Label><Input type={f.type || "text"} value={(payForm as any)[f.key]} onChange={e => setPayForm(p => ({ ...p, [f.key]: e.target.value }))} className="mt-1" /></div>
              ))}
              <div>
                <Label className="text-xs text-gray-600">Payment Mode *</Label>
                <select value={payForm.paymentMode} onChange={e => setPayForm(p => ({ ...p, paymentMode: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                  {["cash", "cheque", "dd", "upi", "neft", "rtgs", "card"].map(m => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayDialog(false)}>Cancel</Button>
            <Button onClick={markPaid} disabled={saving} className="bg-green-600 hover:bg-green-700">
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}<CheckCircle className="h-4 w-4 mr-1" /> Confirm Payment & Generate Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Payment Success + Receipt Dialog ── */}
      <Dialog open={receiptDialog} onOpenChange={setReceiptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" /> Payment Recorded Successfully
            </DialogTitle>
          </DialogHeader>
          {receiptItem && (
            <div className="space-y-4 py-2">
              {/* Success banner */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-700 mb-1">{fmt(Number(receiptItem.amount) + Number(receiptItem.penaltyAmount || 0))}</div>
                <div className="text-sm text-green-600 font-medium">Payment received from {receiptItem.ownerName}</div>
                <div className="text-xs text-gray-500 mt-1">{receiptItem.propertyNo} · {receiptItem.sector || "—"}</div>
              </div>
              {/* Receipt details */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt No.</span>
                  <span className="font-mono font-semibold text-orange-700">{receiptItem.receiptNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Date</span>
                  <span className="font-medium">{receiptItem.paidDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mode</span>
                  <span className="font-medium uppercase">{receiptItem.paymentMode || "Cash"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Paid ✓</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">The demand status has been updated to <strong>Paid</strong> and the dashboard has been refreshed.</p>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setReceiptDialog(false)}>Close</Button>
            <Button
              onClick={() => { if (receiptItem) printReceipt(receiptItem); }}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <Receipt className="h-4 w-4" /> Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Generate Demand Dialog ── */}
      <Dialog open={genDialog} onOpenChange={setGenDialog}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-700">
              <TrendingUp className="h-5 w-5" /> Generate Demand
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            {/* Property Selector — search + dropdown */}
            <div>
              <Label className="text-xs text-gray-600 font-semibold">Select Property *</Label>
              <div className="mt-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Type property code, owner name or sector to filter..."
                  value={propSearch}
                  onChange={e => { setPropSearch(e.target.value); gf("propertyId", ""); }}
                  className="pl-9 text-sm"
                />
              </div>
              <select
                value={genForm.propertyId}
                onChange={e => { gf("propertyId", e.target.value); if (e.target.value) setPropSearch(""); }}
                className="mt-2 w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                size={propSearch && !genForm.propertyId ? Math.min(6, properties.filter(p =>
                  !propSearch ||
                  (p.propertyCode || "").toLowerCase().includes(propSearch.toLowerCase()) ||
                  p.propertyNo.toLowerCase().includes(propSearch.toLowerCase()) ||
                  p.ownerName.toLowerCase().includes(propSearch.toLowerCase()) ||
                  (p.sector || "").toLowerCase().includes(propSearch.toLowerCase())
                ).length + 1) : 1}
              >
                <option value="">— Select a property —</option>
                {properties
                  .filter(p =>
                    !propSearch ||
                    (p.propertyCode || "").toLowerCase().includes(propSearch.toLowerCase()) ||
                    p.propertyNo.toLowerCase().includes(propSearch.toLowerCase()) ||
                    p.ownerName.toLowerCase().includes(propSearch.toLowerCase()) ||
                    (p.sector || "").toLowerCase().includes(propSearch.toLowerCase())
                  )
                  .map(p => (
                    <option key={p.id} value={String(p.id)}>
                      {p.propertyCode || p.propertyNo} | {p.ownerName} | Sec {p.sector || "—"} | {p.propertyType} {p.isDeveloped ? "(Dev)" : ""}
                    </option>
                  ))}
              </select>
              {propSearch && !genForm.propertyId && (
                <p className="text-xs text-gray-400 mt-1">
                  {properties.filter(p =>
                    (p.propertyCode || "").toLowerCase().includes(propSearch.toLowerCase()) ||
                    p.propertyNo.toLowerCase().includes(propSearch.toLowerCase()) ||
                    p.ownerName.toLowerCase().includes(propSearch.toLowerCase()) ||
                    (p.sector || "").toLowerCase().includes(propSearch.toLowerCase())
                  ).length} results — click to select
                </p>
              )}
            </div>

            {/* Property Details Card */}
            {selProp && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-blue-800 text-base">{selProp.propertyNo} — {selProp.ownerName}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">Type:</span> <span className={`px-1.5 py-0.5 rounded-full font-semibold capitalize ${TYPE_COLOR[selProp.propertyType] || "bg-gray-100 text-gray-700"}`}>{selProp.propertyType}</span></div>
                  <div><span className="text-gray-500">Area:</span> <span className="font-semibold text-gray-800">{selProp.area || "N/A"} sqft</span></div>
                  <div><span className="text-gray-500">Sector:</span> <span className="text-gray-700">{selProp.sector || "—"}</span></div>
                  <div><span className="text-gray-500">Status:</span> {selProp.isDeveloped ? <span className="text-green-700 font-semibold">Developed ✓</span> : <span className="text-yellow-600">Undeveloped</span>}</div>
                </div>
              </div>
            )}

            {/* Rate Slabs Found */}
            {selProp && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {/* Undeveloped rate */}
                  <div className={`rounded-lg p-3 text-xs border ${undevelopedRate ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"}`}>
                    <p className={`font-semibold mb-1 ${undevelopedRate ? "text-yellow-700" : "text-gray-500"}`}>
                      {undevelopedRate ? "✓ Undeveloped Rate" : "— Undeveloped Rate"}
                    </p>
                    {undevelopedRate
                      ? <><span className="text-gray-500">₹{undevelopedRate.ratePerSqft}/sqft/yr</span><br /><span className="text-gray-400">{undevelopedRate.description || ""}</span></>
                      : <span className="text-gray-400">Not configured for "{selProp.propertyType}"</span>
                    }
                  </div>
                  {/* Developed rate */}
                  <div className={`rounded-lg p-3 text-xs border ${developedRate ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                    <p className={`font-semibold mb-1 ${developedRate ? "text-green-700" : "text-gray-500"}`}>
                      {developedRate ? "✓ Developed Rate" : "— Developed Rate"}
                    </p>
                    {developedRate
                      ? <><span className="text-gray-500">₹{developedRate.ratePerSqft}/sqft/yr</span><br /><span className="text-gray-400">{developedRate.description || ""}</span></>
                      : <span className="text-gray-400">Not configured for "{selProp.propertyType}"</span>
                    }
                  </div>
                </div>

                {/* Manual amount input when no rate slab found */}
                {noRateSlab && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                      ⚠️ No rate slab configured for "{selProp.propertyType}" — enter amount manually
                    </p>
                    <div>
                      <Label className="text-xs text-gray-600">Demand Amount (₹) *</Label>
                      <Input
                        type="number"
                        min={0}
                        value={manualAmount}
                        onChange={e => setManualAmount(e.target.value)}
                        placeholder="Enter demand amount..."
                        className="mt-1"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        You can add rate slabs from the <strong>Rates</strong> tab for automatic calculation in future.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Last demand info */}
            {selProp && lastCoveredDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2">
                <CalendarDays className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>Previous demand covered up to <strong>{fmtD(lastCoveredDate)}</strong> — new calculation will start from <strong>{hasChargeDays ? fmtD(effectiveStart) : "N/A"}</strong></span>
              </div>
            )}

            {/* Year + Period */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-600 font-semibold">Charge Year *</Label>
                <Input type="number" value={genForm.year} onChange={e => gf("year", Number(e.target.value))} className="mt-1" min={2000} max={2100} />
              </div>
              <div>
                <Label className="text-xs text-gray-600 font-semibold">Period</Label>
                <select value={genForm.period} onChange={e => gf("period", e.target.value)} className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
                  <option value="annual">Annual (Full Year)</option>
                  <option value="q1">Q1 (Apr–Jun)</option>
                  <option value="q2">Q2 (Jul–Sep)</option>
                  <option value="q3">Q3 (Oct–Dec)</option>
                  <option value="q4">Q4 (Jan–Mar)</option>
                </select>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Due Date</Label>
                <Input type="date" value={genForm.dueDate} onChange={e => gf("dueDate", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Penalty Amount (₹)</Label>
                <Input type="number" value={genForm.penaltyAmount} onChange={e => gf("penaltyAmount", e.target.value)} className="mt-1" min={0} />
              </div>
              <div className="col-span-2">
                <Label className="text-xs text-gray-600">Remarks (optional)</Label>
                <Input value={genForm.remarks} onChange={e => gf("remarks", e.target.value)} className="mt-1" placeholder="Additional notes..." />
              </div>
            </div>

            {/* Day-based Calculation Breakdown */}
            {selProp && hasChargeDays && (undevelopedDays > 0 || developedDays > 0) && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="font-semibold text-orange-800 mb-1 text-sm">Calculation Breakdown (Day-Based)</p>
                <p className="text-xs text-gray-500 mb-3">
                  Charge period: <strong>{fmtD(effectiveStart)}</strong> → <strong>{fmtD(periodEnd)}</strong>
                  {possDate && !lastCoveredDate && <span className="ml-2 text-blue-600">(from possession date)</span>}
                </p>
                <div className="space-y-2 text-sm">
                  {/* Undeveloped segment */}
                  {undevelopedDays > 0 && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2.5">
                      <div className="flex justify-between font-semibold text-yellow-700 mb-1">
                        <span>Undeveloped Period</span>
                        <span>{fmt(undAmt)}</span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div className="flex justify-between">
                          <span>{undevelopedFrom ? fmtD(undevelopedFrom) : ""} → {undevelopedTo ? fmtD(undevelopedTo) : ""}</span>
                          <span>{undevelopedDays} days</span>
                        </div>
                        {undevelopedRate
                          ? <div className="flex justify-between"><span>₹{undevelopedRate.ratePerSqft}/sqft/yr ÷ 365 × {area} sqft × {undevelopedDays} days</span></div>
                          : <div className="text-red-500">⚠ Undeveloped rate slab not set</div>
                        }
                      </div>
                    </div>
                  )}
                  {/* Developed segment */}
                  {developedDays > 0 && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-2.5">
                      <div className="flex justify-between font-semibold text-green-700 mb-1">
                        <span>Developed Period</span>
                        <span>{fmt(devAmt)}</span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div className="flex justify-between">
                          <span>{developedFrom ? fmtD(developedFrom) : ""} → {developedTo ? fmtD(developedTo) : ""}</span>
                          <span>{developedDays} days</span>
                        </div>
                        {developedRate
                          ? <div className="flex justify-between"><span>₹{developedRate.ratePerSqft}/sqft/yr ÷ 365 × {area} sqft × {developedDays} days</span></div>
                          : <div className="text-red-500">⚠ Developed rate slab not set</div>
                        }
                      </div>
                    </div>
                  )}
                  <div className="border-t border-orange-200 pt-2 flex justify-between text-orange-700 font-semibold">
                    <span>Base Amount</span><span>{fmt(calcAmount)}</span>
                  </div>
                  {Number(genForm.penaltyAmount || 0) > 0 && (
                    <div className="flex justify-between text-red-600 text-sm">
                      <span>+ Penalty</span><span>{fmt(genForm.penaltyAmount)}</span>
                    </div>
                  )}
                  <div className="border-t border-orange-300 pt-2 flex justify-between text-orange-800 font-bold text-base">
                    <span>Total Due</span><span>{fmt(calcTotal)}</span>
                  </div>
                </div>
              </div>
            )}

            {selProp && !hasChargeDays && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
                ⚠️ No chargeable days in this period. Either this period has already been fully charged, or the possession date is after the period ends.
              </div>
            )}

            {selProp && !selProp.area && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700">
                ⚠️ This property does not have an <strong>Area (sqft)</strong> entered — please update the area in the Properties tab, otherwise the calculated amount will be ₹0.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGenDialog(false)}>Cancel</Button>
            <Button
              onClick={generateDemand}
              disabled={saving || !selProp || !hasChargeDays || effectiveAmount <= 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <TrendingUp className="h-4 w-4 mr-1" /> Generate Demand ({selProp && hasChargeDays && effectiveAmount > 0 ? fmt(calcTotal) : "₹0"})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TAB 5 — PAYMENTS & RECEIPTS
══════════════════════════════════════════════════════ */
function PaymentsTab({ receipts, loadReceipts }: { receipts: MReceipt[]; loadReceipts: () => void }) {
  const [search, setSearch] = useState("");
  const filtered = receipts.filter(r => !search || r.receiptNo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <SectionHead title={`Payment Receipts (${receipts.length})`} />
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input placeholder="Search by receipt no..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>
      {filtered.length === 0
        ? <div className="text-center py-12 text-gray-400"><Receipt className="h-10 w-10 mx-auto mb-2 opacity-30" /><p>No receipts yet. Record payments from the Demand Register tab.</p></div>
        : (
          <DataTable heads={["Receipt No.", "Charge ID", "Amount Paid", "Date", "Mode", "Transaction Ref", "Collected By"]} empty={filtered.length === 0}>
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 font-mono text-green-700 font-semibold">{r.receiptNo}</td>
                <td className="px-4 py-2.5 text-gray-500 text-xs">#{r.chargeId}</td>
                <td className="px-4 py-2.5 font-semibold text-gray-800">{fmt(r.paidAmount)}</td>
                <td className="px-4 py-2.5 text-gray-600 text-xs">{r.paidDate}</td>
                <td className="px-4 py-2.5"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase">{r.paymentMode}</span></td>
                <td className="px-4 py-2.5 text-gray-500 text-xs font-mono">{r.transactionRef || "—"}</td>
                <td className="px-4 py-2.5 text-gray-500 text-xs">{r.collectedBy || "—"}</td>
              </tr>
            ))}
          </DataTable>
        )
      }
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TAB 6 — DEFAULTERS & REPORTS
══════════════════════════════════════════════════════ */
/* Parse all "Notice issued on YYYY-MM-DD" occurrences from remarks */
const parseNotices = (remarks: string | null): { date: string; seq: number }[] => {
  if (!remarks) return [];
  const matches = [...remarks.matchAll(/Notice issued on (\d{4}-\d{2}-\d{2})/g)];
  return matches.map((m, i) => ({ date: m[1], seq: i + 1 }));
};

function DefaultersTab({ charges, onRefresh }: { charges: Charge[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [noticePopup, setNoticePopup] = useState<Charge | null>(null);
  const defaulters = charges.filter(c => c.status === "pending" || c.status === "overdue");

  const byStatus = { pending: defaulters.filter(c => c.status === "pending").length, overdue: defaulters.filter(c => c.status === "overdue").length };
  const totalDue = defaulters.reduce((s, c) => s + Number(c.amount) + Number(c.penaltyAmount || 0), 0);

  const printNotice = (item: Charge) => {
    const noticeNo = `BDA/MNT/NOTICE/${item.chargeYear}/${item.id}`;
    const issueDate = today();
    const totalDue = Number(item.amount) + Number(item.penaltyAmount || 0);
    const periodLabel = item.chargeFromDate && item.chargeToDate
      ? `${item.chargeFromDate} to ${item.chargeToDate}`
      : `Year ${item.chargeYear}`;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>BDA Demand Notice — ${item.propertyNo}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: 'Times New Roman', serif; font-size:13px; color:#111; background:#fff; }
      .page { width:720px; margin:30px auto; border:1.5px solid #333; padding:30px 36px; }
      .header { display:flex; align-items:center; border-bottom:2px solid #8b0000; padding-bottom:14px; margin-bottom:14px; gap:16px; }
      .header-logo { width:64px; height:64px; border-radius:50%; background:#8b0000; display:flex; align-items:center; justify-content:center; color:white; font-size:20px; font-weight:bold; flex-shrink:0; }
      .header-text { flex:1; text-align:center; }
      .header-text h1 { font-size:18px; font-weight:bold; color:#8b0000; letter-spacing:1px; }
      .header-text h2 { font-size:14px; color:#444; margin-top:3px; }
      .header-text p { font-size:11px; color:#666; margin-top:2px; }
      .notice-title { text-align:center; margin:14px 0 16px; }
      .notice-title h3 { font-size:16px; font-weight:bold; text-decoration:underline; text-transform:uppercase; letter-spacing:1.5px; }
      .notice-no { display:flex; justify-content:space-between; font-size:12px; color:#444; margin-bottom:16px; }
      .to-section { margin:12px 0 14px; font-size:13px; }
      .to-section strong { display:block; margin-bottom:4px; }
      .body-text { font-size:13px; line-height:1.8; margin-bottom:10px; text-align:justify; }
      .details-table { width:100%; border-collapse:collapse; margin:14px 0; font-size:12.5px; }
      .details-table th { background:#8b0000; color:white; padding:7px 10px; text-align:left; }
      .details-table td { border:1px solid #ccc; padding:7px 10px; }
      .details-table tr:nth-child(even) td { background:#fafafa; }
      .total-row td { font-weight:bold; background:#fff8f0 !important; font-size:13.5px; }
      .warning-box { border:2px solid #c0392b; background:#fff5f5; border-radius:4px; padding:12px 14px; margin:14px 0; font-size:12.5px; }
      .warning-box p { margin-bottom:4px; }
      .signature-block { display:flex; justify-content:space-between; margin-top:36px; font-size:12px; }
      .sig-right { text-align:center; }
      .sig-right .sig-line { border-top:1px solid #333; margin-bottom:4px; width:160px; }
      .footer-note { border-top:1px solid #ccc; margin-top:20px; padding-top:8px; font-size:11px; color:#555; text-align:center; }
      .stamp-area { position:relative; }
      @media print { .no-print { display:none!important; } @page { margin:15mm; } }
      .no-print { text-align:center; margin-top:20px; }
    </style></head><body>
    <div class="page">
      <div class="header">
        <div class="header-logo">BDA</div>
        <div class="header-text">
          <h1>Bareilly Development Authority</h1>
          <h2>बरेली विकास प्राधिकरण</h2>
          <p>Government of Uttar Pradesh | Bareilly, U.P.</p>
        </div>
      </div>

      <div class="notice-title"><h3>Maintenance Charge Demand Notice</h3></div>

      <div class="notice-no">
        <span><b>Notice No.:</b> ${noticeNo}</span>
        <span><b>Date of Issue:</b> ${issueDate}</span>
      </div>

      <div class="to-section">
        <strong>To,</strong>
        ${item.ownerName}<br/>
        Property No.: <b>${item.propertyNo}</b>${item.sector ? ` &nbsp;|&nbsp; Sector: <b>${item.sector}</b>` : ""}${item.plotNo ? ` &nbsp;|&nbsp; Plot: <b>${item.plotNo}</b>` : ""}
      </div>

      <p class="body-text">
        Dear Sir/Madam,<br/><br/>
        This is to inform you that the maintenance charges for your above-mentioned property, allotted by the Bareilly Development Authority, are outstanding as detailed below. You are hereby directed to deposit the due amount within <b>15 (fifteen) days</b> from the date of this notice. Failure to do so may attract penal interest and initiation of recovery proceedings as per the applicable BDA rules.
      </p>

      <table class="details-table">
        <tr>
          <th colspan="2">Property Details</th>
          <th colspan="2">Demand Details</th>
        </tr>
        <tr>
          <td><b>Property No.</b></td>
          <td>${item.propertyNo}</td>
          <td><b>Charge Period</b></td>
          <td>${periodLabel}</td>
        </tr>
        <tr>
          <td><b>Owner Name</b></td>
          <td>${item.ownerName}</td>
          <td><b>Charge Year</b></td>
          <td>${item.chargeYear}</td>
        </tr>
        <tr>
          <td><b>Sector</b></td>
          <td>${item.sector || "—"}</td>
          <td><b>Due Date</b></td>
          <td>${item.dueDate || "—"}</td>
        </tr>
        <tr>
          <td><b>Plot No.</b></td>
          <td>${item.plotNo || "—"}</td>
          <td><b>Status</b></td>
          <td style="color:#c0392b;font-weight:bold;text-transform:uppercase;">${item.status}</td>
        </tr>
        <tr>
          <td colspan="4" style="padding:0;"></td>
        </tr>
        <tr>
          <th colspan="2">Charge Breakup</th>
          <th colspan="2">Amount (₹)</th>
        </tr>
        <tr>
          <td colspan="2">Maintenance Charges (Principal)</td>
          <td colspan="2">₹${Number(item.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td colspan="2">Penalty / Interest</td>
          <td colspan="2">₹${Number(item.penaltyAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2"><b>Total Amount Due</b></td>
          <td colspan="2"><b>₹${totalDue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</b></td>
        </tr>
      </table>

      <div class="warning-box">
        <p><b>⚠️ Important Notice:</b></p>
        <p>1. Please deposit the above amount at the BDA office or through online payment within <b>15 days</b> of this notice.</p>
        <p>2. In case of non-payment, penal interest @ 12% per annum shall be levied on the outstanding amount.</p>
        <p>3. Continued non-payment may result in disconnection of utility services and legal action as per BDA Act.</p>
        <p>4. For queries, contact the Maintenance Section, BDA Office, Bareilly.</p>
      </div>

      ${item.remarks ? `<p class="body-text"><b>Remarks:</b> ${item.remarks}</p>` : ""}

      <div class="signature-block">
        <div>
          <p>Received by: _________________________</p>
          <p style="margin-top:4px;">Date: ___________________</p>
        </div>
        <div class="sig-right">
          <div class="sig-line"></div>
          <p><b>Executive Engineer / AE</b></p>
          <p>Maintenance Section</p>
          <p>Bareilly Development Authority</p>
        </div>
      </div>

      <div class="footer-note">
        This is a computer-generated notice. | Bareilly Development Authority | Bareilly, Uttar Pradesh<br/>
        Notice No.: ${noticeNo}
      </div>

      <div class="no-print" style="margin-top:24px;">
        <button onclick="window.print()" style="background:#8b0000;color:white;border:none;padding:10px 30px;border-radius:5px;font-size:14px;cursor:pointer;font-weight:600;">🖨️ Print Notice</button>
        <button onclick="window.close()" style="background:#e5e7eb;color:#374151;border:none;padding:10px 20px;border-radius:5px;font-size:14px;cursor:pointer;font-weight:600;margin-left:10px;">Close</button>
      </div>
    </div></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 600);
  };

  const issueNotice = async (item: Charge) => {
    await apiFetch(`/maintenance/${item.id}`, { method: "PUT", body: JSON.stringify({ ...item, status: "overdue", remarks: (item.remarks ? item.remarks + " | " : "") + `Notice issued on ${today()}` }) });
    toast({ title: `Notice issued for ${item.propertyNo}` });
    onRefresh();
    printNotice({ ...item, status: "overdue" });
  };

  const filtered = defaulters.filter(d => !search || d.propertyNo.toLowerCase().includes(search.toLowerCase()) || d.ownerName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-yellow-700">{byStatus.pending}</p>
          <p className="text-xs text-yellow-600 font-medium">Pending</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-red-700">{byStatus.overdue}</p>
          <p className="text-xs text-red-600 font-medium">Overdue / Notices Issued</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-2xl font-bold text-orange-700">{fmt(totalDue)}</p>
          <p className="text-xs text-orange-600 font-medium">Total Outstanding</p>
        </div>
      </div>

      <SectionHead title={`Defaulters List (${filtered.length})`} />
      <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><Input placeholder="Search defaulters..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div>

      {filtered.length === 0
        ? <div className="text-center py-12 text-gray-400"><CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-400" /><p>No defaulters! All demands are cleared.</p></div>
        : (
          <DataTable heads={["Property No.", "Owner", "Sector", "Year", "Total Due", "Status", "Due Date", "Notices Issued ✓", "Remarks", "Action"]} empty={filtered.length === 0}>
            {filtered.map(c => {
              const notices = parseNotices(c.remarks);
              return (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 font-mono font-semibold text-orange-700">{c.propertyNo}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{c.ownerName}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{c.sector || "—"}</td>
                  <td className="px-4 py-2.5 text-gray-600">{c.chargeYear}</td>
                  <td className="px-4 py-2.5 font-bold text-red-600">{fmt(Number(c.amount) + Number(c.penaltyAmount || 0))}</td>
                  <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[c.status]}`}>{c.status}</span></td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{c.dueDate || "—"}</td>

                  {/* ── Notices Issued column ── */}
                  <td className="px-4 py-2.5 text-center">
                    {notices.length > 0 ? (
                      <button
                        onClick={() => setNoticePopup(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full text-xs font-bold text-red-700 transition-colors cursor-pointer"
                      >
                        <FileWarning className="h-3 w-3" />
                        {notices.length}
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>

                  <td className="px-4 py-2.5 text-gray-400 text-xs max-w-[150px] truncate">{c.remarks || "—"}</td>
                  <td className="px-4 py-2.5">
                    {c.status === "pending" && (
                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs" onClick={() => issueNotice(c)}>
                        <FileWarning className="h-3 w-3 mr-1" /> Issue Notice
                      </Button>
                    )}
                    {c.status === "overdue" && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-red-500 font-semibold">Notice Issued ✓</span>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 text-xs" onClick={() => issueNotice(c)}>
                          <FileWarning className="h-3 w-3 mr-1" /> Issue Again
                        </Button>
                        <Button size="sm" variant="ghost" className="text-gray-500 hover:bg-gray-100 text-xs h-6 px-2" onClick={() => printNotice(c)}>
                          🖨️ Re-print
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </DataTable>
        )
      }

      {/* ── Notice History Popup ── */}
      <Dialog open={!!noticePopup} onOpenChange={open => { if (!open) setNoticePopup(null); }}>
        <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-5 pt-5 pb-3 border-b shrink-0">
            <DialogTitle className="text-base font-bold text-red-700 flex items-center gap-2">
              <FileWarning className="h-4 w-4" />
              Notices Issued — {noticePopup?.propertyNo}
            </DialogTitle>
            {noticePopup && (
              <p className="text-xs text-gray-500 mt-0.5">{noticePopup.ownerName} · Year {noticePopup.chargeYear} · {fmt(Number(noticePopup.amount) + Number(noticePopup.penaltyAmount || 0))} due</p>
            )}
          </DialogHeader>

          <div className="overflow-y-auto flex-1 max-h-[55vh]">
            {noticePopup && (() => {
              const notices = parseNotices(noticePopup.remarks);
              const noticeNo = (seq: number) =>
                `BDA/MNT/NOTICE/${noticePopup.chargeYear}/${noticePopup.id}${notices.length > 1 ? `/${seq}` : ""}`;

              return notices.length === 0 ? (
                <p className="text-center py-10 text-gray-400 text-sm">No notices found in remarks.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notices.map((n, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                      <div className="space-y-1">
                        <p className="font-mono text-sm font-semibold text-red-700">{noticeNo(n.seq)}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded">Notice #{n.seq}</span>
                          <span>Issued: <strong className="text-gray-700">{n.date}</strong></span>
                        </div>
                        <p className="text-[10px] text-gray-400">
                          Property: {noticePopup.propertyNo} · {noticePopup.ownerName}
                          {noticePopup.sector ? ` · Sector ${noticePopup.sector}` : ""}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 gap-1 text-xs shrink-0"
                        onClick={() => printNotice(noticePopup)}
                      >
                        🖨️ View Notice
                      </Button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="px-5 py-3 border-t bg-gray-50 shrink-0 flex justify-end">
            <Button variant="outline" onClick={() => setNoticePopup(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN MODULE
══════════════════════════════════════════════════════ */
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard",   label: "Dashboard",       icon: BarChart3 },
  { id: "properties",  label: "Properties",       icon: Building2 },
  { id: "rates",       label: "Rate Slabs",       icon: BadgePercent },
  { id: "demands",     label: "Demand Register",  icon: IndianRupee },
  { id: "payments",    label: "Payments",         icon: Receipt },
  { id: "defaulters",  label: "Defaulters",       icon: FileWarning },
];

export default function MaintenanceModule() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [charges, setCharges] = useState<Charge[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [receipts, setReceipts] = useState<MReceipt[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);

  const loadCharges = useCallback(async () => {
    const r = await apiFetch("/maintenance");
    setCharges(await r.json());
  }, []);
  const loadProperties = useCallback(async () => {
    const r = await apiFetch("/maintenance/properties");
    setProperties(await r.json());
  }, []);
  const loadReceipts = useCallback(async () => {
    const r = await apiFetch("/maintenance/receipts");
    setReceipts(await r.json());
  }, []);
  const loadRates = useCallback(async () => {
    const r = await apiFetch("/maintenance/rates");
    setRates(await r.json());
  }, []);

  useEffect(() => { loadCharges(); loadProperties(); loadReceipts(); loadRates(); }, [loadCharges, loadProperties, loadReceipts, loadRates]);

  return (
    <PortalLayout title="Maintenance Charges Management" moduleId="maintenance">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Tab Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  tab === t.id
                    ? "border-orange-600 text-orange-700 bg-orange-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === "defaulters" && charges.filter(c => c.status === "pending" || c.status === "overdue").length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold">
                    {charges.filter(c => c.status === "pending" || c.status === "overdue").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {tab === "dashboard"  && <DashboardTab charges={charges} properties={properties} receipts={receipts} />}
        {tab === "properties" && <PropertiesTab />}
        {tab === "rates"      && <RatesTab />}
        {tab === "demands"    && <DemandsTab onPaymentAdded={() => { loadCharges(); loadReceipts(); }} properties={properties} rates={rates} />}
        {tab === "payments"   && <PaymentsTab receipts={receipts} loadReceipts={loadReceipts} />}
        {tab === "defaulters" && <DefaultersTab charges={charges} onRefresh={loadCharges} />}
      </div>
    </PortalLayout>
  );
}
