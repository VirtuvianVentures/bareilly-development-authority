import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, LayoutGrid, ClipboardList, FileText, Lock, Image } from "lucide-react";

type SchemeType = "scheme" | "survey";
type ActiveTab = "surveys_schemes" | "ongoing" | "schemes_display";

interface Scheme {
  id: number;
  type: SchemeType;
  title: string;
  titleHindi: string | null;
  description: string | null;
  descriptionHindi: string | null;
  imageUrl: string | null;
  bookletUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  fees: string | null;
  feesLabel: string | null;
  isActive: boolean;
  isOpenForRegistration: boolean;
  displayOrder: number;
}

interface SimpleCard {
  id: number;
  section: string;
  title: string;
  imageUrl: string | null;
  displayOrder: number;
}

/* ─── Helpers ─────────────────────────────────────────── */
const emptyForm = {
  type: "scheme" as SchemeType,
  title: "",
  titleHindi: "",
  description: "",
  descriptionHindi: "",
  imageUrl: "",
  bookletUrl: "",
  startDate: "",
  endDate: "",
  fees: "",
  feesLabel: "",
  isActive: true,
  isOpenForRegistration: false,
  displayOrder: 0,
};

const emptyCardForm = { title: "", imageUrl: "", displayOrder: 0 };

function toInputDate(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* ─── Simple Card row (Ongoing / Schemes display) ─────── */
function CardRow({ c, onEdit, onDelete }: { c: SimpleCard; onEdit: () => void; onDelete: () => void }) {
  return (
    <TableRow className="odd:bg-gray-50/40">
      <TableCell>
        {c.imageUrl
          ? <img src={c.imageUrl} alt={c.title} className="w-16 h-10 object-cover rounded" />
          : <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
        }
      </TableCell>
      <TableCell className="font-medium text-gray-800">{c.title}</TableCell>
      <TableCell className="text-sm text-gray-500">{c.displayOrder}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}><Pencil className="h-3 w-3" /></Button>
          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={onDelete}><Trash2 className="h-3 w-3" /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ─── Main Component ───────────────────────────────────── */
export default function AdminSchemes() {
  const { toast } = useToast();

  // Full schemes/surveys
  const [items, setItems] = useState<Scheme[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [schemeDialog, setSchemeDialog] = useState(false);
  const [schemeSaving, setSchemeSaving] = useState(false);
  const [editSchemeId, setEditSchemeId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Simple display cards
  const [cards, setCards] = useState<SimpleCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [cardDialog, setCardDialog] = useState(false);
  const [cardSection, setCardSection] = useState<"ongoing" | "schemes">("ongoing");
  const [editCardId, setEditCardId] = useState<number | null>(null);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [cardSaving, setCardSaving] = useState(false);

  const [tab, setTab] = useState<ActiveTab>("surveys_schemes");
  const [typeFilter, setTypeFilter] = useState<"all" | "scheme" | "survey">("all");

  /* ── Loaders ── */
  const loadItems = () => {
    setItemsLoading(true);
    apiFetch("/schemes").then(r => r.json()).then(setItems).finally(() => setItemsLoading(false));
  };
  const loadCards = () => {
    setCardsLoading(true);
    apiFetch("/scheme-cards").then(r => r.json()).then(setCards).finally(() => setCardsLoading(false));
  };

  useEffect(() => { loadItems(); loadCards(); }, []);

  /* ── Scheme form helpers ── */
  const setF = (k: string, v: string | boolean | number) => setForm(f => ({ ...f, [k]: v }));

  const openAddScheme = () => { setEditSchemeId(null); setForm(emptyForm); setSchemeDialog(true); };
  const openEditScheme = (s: Scheme) => {
    setEditSchemeId(s.id);
    setForm({
      type: s.type, title: s.title, titleHindi: s.titleHindi ?? "",
      description: s.description ?? "", descriptionHindi: s.descriptionHindi ?? "",
      imageUrl: s.imageUrl ?? "", bookletUrl: s.bookletUrl ?? "",
      startDate: toInputDate(s.startDate), endDate: toInputDate(s.endDate),
      fees: s.fees ?? "", feesLabel: s.feesLabel ?? "",
      isActive: s.isActive, isOpenForRegistration: s.isOpenForRegistration,
      displayOrder: s.displayOrder,
    });
    setSchemeDialog(true);
  };

  const handleSaveScheme = async () => {
    if (!form.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    setSchemeSaving(true);
    try {
      const body = {
        type: form.type, title: form.title,
        titleHindi: form.titleHindi || null, description: form.description || null,
        descriptionHindi: form.descriptionHindi || null,
        imageUrl: form.imageUrl || null, bookletUrl: form.bookletUrl || null,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        fees: form.fees || null, feesLabel: form.feesLabel || null,
        isActive: form.isActive, isOpenForRegistration: form.isOpenForRegistration,
        displayOrder: Number(form.displayOrder),
      };
      const res = editSchemeId
        ? await apiFetch(`/schemes/${editSchemeId}`, { method: "PUT", body: JSON.stringify(body) })
        : await apiFetch("/schemes", { method: "POST", body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast({ title: editSchemeId ? "Updated" : "Created" });
      setSchemeDialog(false);
      loadItems();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
    finally { setSchemeSaving(false); }
  };

  const handleDeleteScheme = async (id: number) => {
    if (!window.confirm("Delete?")) return;
    await apiFetch(`/schemes/${id}`, { method: "DELETE" });
    toast({ title: "Deleted" });
    loadItems();
  };

  /* ── Card form helpers ── */
  const setC = (k: string, v: string | number) => setCardForm(f => ({ ...f, [k]: v }));

  const openAddCard = (section: "ongoing" | "schemes") => {
    setCardSection(section); setEditCardId(null); setCardForm(emptyCardForm); setCardDialog(true);
  };
  const openEditCard = (c: SimpleCard) => {
    setCardSection(c.section as "ongoing" | "schemes");
    setEditCardId(c.id);
    setCardForm({ title: c.title, imageUrl: c.imageUrl ?? "", displayOrder: c.displayOrder });
    setCardDialog(true);
  };

  const handleSaveCard = async () => {
    if (!cardForm.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    setCardSaving(true);
    try {
      const body = {
        section: cardSection, title: cardForm.title,
        imageUrl: cardForm.imageUrl || null,
        displayOrder: Number(cardForm.displayOrder),
      };
      const res = editCardId
        ? await apiFetch(`/scheme-cards/${editCardId}`, { method: "PUT", body: JSON.stringify(body) })
        : await apiFetch("/scheme-cards", { method: "POST", body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      toast({ title: editCardId ? "Updated" : "Created" });
      setCardDialog(false);
      loadCards();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
    finally { setCardSaving(false); }
  };

  const handleDeleteCard = async (id: number) => {
    if (!window.confirm("Delete?")) return;
    await apiFetch(`/scheme-cards/${id}`, { method: "DELETE" });
    toast({ title: "Deleted" });
    loadCards();
  };

  /* ── Derived lists ── */
  const visibleItems = typeFilter === "all" ? items : items.filter(i => i.type === typeFilter);
  const ongoingCards = cards.filter(c => c.section === "ongoing");
  const schemesCards = cards.filter(c => c.section === "schemes");

  const typeColor = (t: SchemeType) => t === "scheme" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700";

  const statusBadges = (s: Scheme) => {
    const b = [];
    b.push(s.isActive ? { label: "Active", cls: "bg-green-100 text-green-700" } : { label: "Inactive", cls: "bg-gray-100 text-gray-500" });
    b.push(s.isOpenForRegistration ? { label: "Open Reg.", cls: "bg-emerald-100 text-emerald-700" } : { label: "Reg. Closed", cls: "bg-red-100 text-red-600" });
    if (s.bookletUrl) b.push({ label: "Booklet ✓", cls: "bg-purple-100 text-purple-700" });
    return b;
  };

  /* ── Tabs config ── */
  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "surveys_schemes", label: "Surveys & Schemes", icon: <ClipboardList className="h-4 w-4" /> },
    { id: "ongoing", label: "Ongoing Schemes", icon: <LayoutGrid className="h-4 w-4" /> },
    { id: "schemes_display", label: "Schemes", icon: <Image className="h-4 w-4" /> },
  ];

  /* ── Simple card table ── */
  function CardTable({ section, list, loading }: { section: "ongoing" | "schemes"; list: SimpleCard[]; loading: boolean }) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button onClick={() => openAddCard(section)} className="bg-[#1a3a6e] hover:bg-[#15306b]">
            <Plus className="h-4 w-4 mr-2" /> Add Card
          </Button>
        </div>
        {loading
          ? <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-[#1a3a6e]" /></div>
          : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.length === 0
                    ? <TableRow><TableCell colSpan={4} className="text-center py-10 text-gray-400">No cards yet. Click "Add Card" to create one.</TableCell></TableRow>
                    : list.map(c => (
                      <CardRow key={c.id} c={c}
                        onEdit={() => openEditCard(c)}
                        onDelete={() => handleDeleteCard(c.id)}
                      />
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          )
        }
      </div>
    );
  }

  return (
    <AdminLayout title="Schemes & Surveys">
      <div className="space-y-5">
        {/* Top-level tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 flex-1 justify-center py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white shadow text-[#1a3a6e]" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Surveys & Schemes ── */}
        {tab === "surveys_schemes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {(["all", "scheme", "survey"] as const).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${typeFilter === t ? "bg-white shadow text-[#1a3a6e]" : "text-gray-500 hover:text-gray-700"}`}>
                    {t === "all" ? "All" : t === "scheme" ? "Schemes" : "Surveys"}
                  </button>
                ))}
              </div>
              <Button onClick={openAddScheme} className="bg-[#1a3a6e] hover:bg-[#15306b]">
                <Plus className="h-4 w-4 mr-2" /> Add New
              </Button>
            </div>

            {itemsLoading
              ? <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#1a3a6e]" /></div>
              : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Image</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Fees</TableHead>
                        <TableHead>Booklet</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleItems.length === 0
                        ? <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-400">No items yet. Click "Add New".</TableCell></TableRow>
                        : visibleItems.map(s => (
                          <TableRow key={s.id} className="odd:bg-gray-50/40">
                            <TableCell>
                              {s.imageUrl
                                ? <img src={s.imageUrl} alt={s.title} className="w-16 h-10 object-cover rounded" />
                                : <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>
                              }
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${typeColor(s.type)}`}>{s.type}</span>
                            </TableCell>
                            <TableCell className="max-w-[180px]">
                              <p className="font-medium text-gray-800 truncate">{s.title}</p>
                              {s.titleHindi && <p className="text-xs text-gray-400 truncate" lang="hi">{s.titleHindi}</p>}
                            </TableCell>
                            <TableCell className="text-xs whitespace-nowrap">
                              <p className="text-green-700 font-medium">Start: {formatDate(s.startDate)}</p>
                              <p className="text-red-600 font-medium">End: {formatDate(s.endDate)}</p>
                            </TableCell>
                            <TableCell className="text-sm">{s.fees ? `₹${Number(s.fees).toLocaleString("en-IN")}` : "—"}</TableCell>
                            <TableCell>
                              {s.bookletUrl
                                ? <a href={s.bookletUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-600 text-xs font-medium"><FileText className="h-3.5 w-3.5" /> PDF</a>
                                : <span className="text-gray-400 text-xs flex items-center gap-1"><Lock className="h-3 w-3" /> None</span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {statusBadges(s).map(b => (
                                  <span key={b.label} className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${b.cls}`}>{b.label}</span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" onClick={() => openEditScheme(s)}><Pencil className="h-3 w-3" /></Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleDeleteScheme(s.id)}><Trash2 className="h-3 w-3" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </div>
              )
            }
          </div>
        )}

        {/* ── Tab: Ongoing Schemes cards ── */}
        {tab === "ongoing" && (
          <div>
            <p className="text-sm text-gray-500 mb-4">These cards appear in the <span className="font-semibold text-gray-700">"Ongoing Schemes"</span> section on the public Schemes page (image + title only).</p>
            <CardTable section="ongoing" list={ongoingCards} loading={cardsLoading} />
          </div>
        )}

        {/* ── Tab: Schemes display cards ── */}
        {tab === "schemes_display" && (
          <div>
            <p className="text-sm text-gray-500 mb-4">These cards appear in the <span className="font-semibold text-gray-700">"Schemes"</span> section at the bottom of the public Schemes page (image + title only).</p>
            <CardTable section="schemes" list={schemesCards} loading={cardsLoading} />
          </div>
        )}
      </div>

      {/* ─── Add/Edit Scheme Dialog ─────────────────────── */}
      <Dialog open={schemeDialog} onOpenChange={setSchemeDialog}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1a3a6e]">{editSchemeId ? "Edit" : "Add New"} Scheme / Survey</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Type *</label>
              <div className="grid grid-cols-2 gap-3">
                {(["scheme", "survey"] as const).map(t => (
                  <button key={t} type="button" onClick={() => setF("type", t)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${form.type === t ? (t === "scheme" ? "border-blue-600 bg-blue-50" : "border-orange-500 bg-orange-50") : "border-gray-200 hover:border-gray-300"}`}>
                    {t === "scheme" ? <LayoutGrid className={`h-6 w-6 ${form.type === t ? "text-blue-600" : "text-gray-400"}`} /> : <ClipboardList className={`h-6 w-6 ${form.type === t ? "text-orange-500" : "text-gray-400"}`} />}
                    <div>
                      <p className={`font-semibold capitalize ${form.type === t ? (t === "scheme" ? "text-blue-700" : "text-orange-600") : "text-gray-600"}`}>{t === "scheme" ? "Scheme" : "Survey"}</p>
                      <p className="text-xs text-gray-400">{t === "scheme" ? "Housing / development scheme" : "Demand survey / registration"}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* Title */}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title (English) *</label><Input value={form.title} onChange={e => setF("title", e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Title (Hindi)</label><Input value={form.titleHindi} onChange={e => setF("titleHindi", e.target.value)} lang="hi" /></div>
            </div>
            {/* Description */}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label><Textarea value={form.description} onChange={e => setF("description", e.target.value)} rows={3} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description (Hindi)</label><Textarea value={form.descriptionHindi} onChange={e => setF("descriptionHindi", e.target.value)} rows={3} lang="hi" /></div>
            </div>
            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheme Image URL</label>
              <Input value={form.imageUrl} onChange={e => setF("imageUrl", e.target.value)} placeholder="https://..." />
              {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-2 h-24 w-auto rounded-lg object-cover border" />}
            </div>
            {/* Booklet */}
            <div className="rounded-xl border-2 border-dashed border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-purple-600" />
                <label className="text-sm font-semibold text-purple-700">Booklet / Brochure PDF URL</label>
                <span className="text-[10px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Payment-gated</span>
              </div>
              <Input value={form.bookletUrl} onChange={e => setF("bookletUrl", e.target.value)} placeholder="https://... (PDF link)" className="bg-white" />
              <p className="text-xs text-purple-500 mt-1.5">Only downloadable after successful fee payment.</p>
            </div>
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><Input type="date" value={form.startDate} onChange={e => setF("startDate", e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><Input type="date" value={form.endDate} onChange={e => setF("endDate", e.target.value)} /></div>
            </div>
            {/* Fees */}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Application Fees (₹)</label><Input type="number" value={form.fees} onChange={e => setF("fees", e.target.value)} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Fees Label</label><Input value={form.feesLabel} onChange={e => setF("feesLabel", e.target.value)} /></div>
            </div>
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              {([
                { key: "isOpenForRegistration", label: "Open for Registration", sub: form.isOpenForRegistration ? "Users can apply now" : "Registration closed", activeColor: "border-emerald-500 bg-emerald-50", dotColor: "bg-emerald-500", textColor: "text-emerald-700" },
                { key: "isActive", label: "Active on Website", sub: form.isActive ? "Visible to public" : "Hidden from public", activeColor: "border-blue-500 bg-blue-50", dotColor: "bg-blue-500", textColor: "text-blue-700" },
              ] as const).map(toggle => {
                const val = form[toggle.key as keyof typeof form] as boolean;
                return (
                  <button key={toggle.key} type="button" onClick={() => setF(toggle.key, !val)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${val ? toggle.activeColor : "border-gray-200 bg-gray-50"}`}>
                    <div className={`w-10 h-6 rounded-full flex items-center px-1 transition-all ${val ? `${toggle.dotColor} justify-end` : "bg-gray-300 justify-start"}`}>
                      <div className="w-4 h-4 rounded-full bg-white shadow" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${val ? toggle.textColor : "text-gray-500"}`}>{toggle.label}</p>
                      <p className="text-xs text-gray-400">{toggle.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Order */}
            <div className="w-40"><label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label><Input type="number" value={form.displayOrder} onChange={e => setF("displayOrder", Number(e.target.value))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSchemeDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveScheme} disabled={schemeSaving} className="bg-[#1a3a6e] hover:bg-[#15306b]">
              {schemeSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : `Save ${form.type === "scheme" ? "Scheme" : "Survey"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Add/Edit Simple Card Dialog ────────────────── */}
      <Dialog open={cardDialog} onOpenChange={setCardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a3a6e]">
              {editCardId ? "Edit" : "Add"} Card — {cardSection === "ongoing" ? "Ongoing Schemes" : "Schemes"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <Input value={cardForm.title} onChange={e => setC("title", e.target.value)} placeholder="e.g. Sky-Way Apartments" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <Input value={cardForm.imageUrl} onChange={e => setC("imageUrl", e.target.value)} placeholder="https://..." />
              {cardForm.imageUrl && (
                <img src={cardForm.imageUrl} alt="preview" className="mt-2 h-24 w-auto rounded-lg object-cover border" />
              )}
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <Input type="number" value={cardForm.displayOrder} onChange={e => setC("displayOrder", Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCardDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveCard} disabled={cardSaving} className="bg-[#1a3a6e] hover:bg-[#15306b]">
              {cardSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : "Save Card"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
