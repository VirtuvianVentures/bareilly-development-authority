import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SEED_HOUSING_SCHEMES, HousingScheme, SchemeItem } from "@/pages/achievements/HousingSchemes";

const STORAGE_KEY = "bda_housing_schemes_v1";

function load(): HousingScheme[] {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return SEED_HOUSING_SCHEMES;
}
function save(data: HousingScheme[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

const EMPTY_ITEM: SchemeItem = { label: "", count: undefined, isSubheader: false, isTotal: false };

export default function AdminHousingSchemes() {
  const [schemes, setSchemes] = useState<HousingScheme[]>([]);
  const [schemeModal, setSchemeModal] = useState(false);
  const [itemModal, setItemModal] = useState(false);
  const [editingScheme, setEditingScheme] = useState<HousingScheme | null>(null);
  const [schemeName, setSchemeName] = useState("");
  const [activeSchemeId, setActiveSchemeId] = useState<number | null>(null);
  const [editingItemIdx, setEditingItemIdx] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState<SchemeItem>({ ...EMPTY_ITEM });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => { setSchemes(load()); }, []);

  /* ── Scheme CRUD ── */
  const openSchemeModal = (s?: HousingScheme) => {
    setEditingScheme(s || null);
    setSchemeName(s?.name || "");
    setSchemeModal(true);
  };

  const saveScheme = () => {
    if (!schemeName.trim()) return;
    let updated: HousingScheme[];
    if (editingScheme) {
      updated = schemes.map(s => s.id === editingScheme.id ? { ...s, name: schemeName } : s);
      toast({ title: "Updated", description: "Scheme name updated." });
    } else {
      const newId = Math.max(0, ...schemes.map(s => s.id)) + 1;
      updated = [...schemes, { id: newId, name: schemeName, items: [] }];
      toast({ title: "Added", description: "New scheme added." });
    }
    save(updated); setSchemes(updated); setSchemeModal(false);
  };

  const deleteScheme = (id: number) => {
    if (!confirm("Delete this scheme?")) return;
    const updated = schemes.filter(s => s.id !== id);
    save(updated); setSchemes(updated);
    toast({ title: "Deleted" });
  };

  const moveScheme = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= schemes.length) return;
    const updated = [...schemes];
    [updated[idx], updated[t]] = [updated[t], updated[idx]];
    save(updated); setSchemes(updated);
  };

  /* ── Item CRUD ── */
  const openItemModal = (schemeId: number, idx?: number) => {
    setActiveSchemeId(schemeId);
    const scheme = schemes.find(s => s.id === schemeId);
    if (idx !== undefined && scheme) {
      setEditingItemIdx(idx);
      setItemForm({ ...scheme.items[idx] });
    } else {
      setEditingItemIdx(null);
      setItemForm({ ...EMPTY_ITEM });
    }
    setItemModal(true);
  };

  const saveItem = () => {
    if (!itemForm.label.trim()) return;
    const updated = schemes.map(s => {
      if (s.id !== activeSchemeId) return s;
      const items = [...s.items];
      const newItem: SchemeItem = {
        label: itemForm.label,
        count: itemForm.count !== undefined && String(itemForm.count) !== "" ? Number(itemForm.count) : undefined,
        isSubheader: itemForm.isSubheader || false,
        isTotal: itemForm.isTotal || false,
      };
      if (editingItemIdx !== null) items[editingItemIdx] = newItem;
      else items.push(newItem);
      return { ...s, items };
    });
    save(updated); setSchemes(updated); setItemModal(false);
    toast({ title: editingItemIdx !== null ? "Item updated" : "Item added" });
  };

  const deleteItem = (schemeId: number, idx: number) => {
    const updated = schemes.map(s => {
      if (s.id !== schemeId) return s;
      return { ...s, items: s.items.filter((_, i) => i !== idx) };
    });
    save(updated); setSchemes(updated);
    toast({ title: "Item removed" });
  };

  const moveItem = (schemeId: number, idx: number, dir: -1 | 1) => {
    const updated = schemes.map(s => {
      if (s.id !== schemeId) return s;
      const items = [...s.items];
      const t = idx + dir;
      if (t < 0 || t >= items.length) return s;
      [items[idx], items[t]] = [items[t], items[idx]];
      return { ...s, items };
    });
    save(updated); setSchemes(updated);
  };

  const handleReset = () => {
    if (!confirm("Reset all housing schemes to default data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setSchemes(SEED_HOUSING_SCHEMES);
    toast({ title: "Reset", description: "Default data restored." });
  };

  return (
    <AdminLayout title="Housing Schemes Master">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Housing Schemes ({schemes.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-gray-600">Reset to Default</Button>
          <Button onClick={() => openSchemeModal()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />Add Scheme
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {schemes.map((scheme, idx) => (
          <div key={scheme.id} className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
            {/* Scheme header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
              <span className="text-gray-400 text-sm w-6">{idx + 1}.</span>
              <span className="flex-1 font-semibold text-[#c8580a]">{scheme.name}</span>
              <span className="text-xs text-gray-500 mr-2">{scheme.items.length} items</span>

              <div className="flex items-center gap-1">
                <button onClick={() => moveScheme(idx, -1)} disabled={idx === 0}
                  className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30" title="Move up">▲</button>
                <button onClick={() => moveScheme(idx, 1)} disabled={idx === schemes.length - 1}
                  className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30" title="Move down">▼</button>
                <Button variant="ghost" size="icon" onClick={() => openSchemeModal(scheme)}
                  className="h-7 w-7 text-blue-600 hover:bg-blue-50"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteScheme(scheme.id)}
                  className="h-7 w-7 text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                  className="h-7 w-7 text-gray-600 hover:bg-gray-100">
                  {expandedId === scheme.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            {/* Scheme items */}
            {expandedId === scheme.id && (
              <div className="p-4">
                <table className="w-full text-sm mb-3">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-600">
                      <th className="text-left px-2 py-1 border border-gray-200">Label</th>
                      <th className="text-right px-2 py-1 border border-gray-200 w-20">Count</th>
                      <th className="text-center px-2 py-1 border border-gray-200 w-20">Type</th>
                      <th className="text-center px-2 py-1 border border-gray-200 w-24">Order</th>
                      <th className="text-right px-2 py-1 border border-gray-200 w-16">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheme.items.map((item, i) => (
                      <tr key={i} className={item.isTotal ? "bg-orange-50" : item.isSubheader ? "bg-blue-50/40" : "even:bg-gray-50/30"}>
                        <td className={`px-2 py-1 border border-gray-200 ${item.isSubheader ? "italic text-gray-600" : item.isTotal ? "font-bold text-[#c8580a]" : "pl-4 text-gray-700"}`}>
                          {item.label}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right text-gray-700">
                          {item.count ?? ""}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-center text-xs text-gray-500">
                          {item.isSubheader ? "Header" : item.isTotal ? "Total" : "Item"}
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-center">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => moveItem(scheme.id, i, -1)} disabled={i === 0}
                              className="px-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▲</button>
                            <button onClick={() => moveItem(scheme.id, i, 1)} disabled={i === scheme.items.length - 1}
                              className="px-1 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▼</button>
                          </div>
                        </td>
                        <td className="px-2 py-1 border border-gray-200 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openItemModal(scheme.id, i)}
                              className="h-6 w-6 text-blue-600 hover:bg-blue-50"><Pencil className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(scheme.id, i)}
                              className="h-6 w-6 text-red-600 hover:bg-red-50"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button size="sm" variant="outline" onClick={() => openItemModal(scheme.id)}
                  className="text-[#1a3a6e] border-[#1a3a6e] hover:bg-[#1a3a6e]/10">
                  <Plus className="h-3.5 w-3.5 mr-1" />Add Item
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Scheme modal */}
      <Dialog open={schemeModal} onOpenChange={setSchemeModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{editingScheme ? "Edit Scheme Name" : "Add New Scheme"}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="sname">Scheme Name *</Label>
            <Input id="sname" className="mt-1" value={schemeName}
              onChange={e => setSchemeName(e.target.value)}
              placeholder="e.g. Tirbinath Residential Scheme" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSchemeModal(false)}>Cancel</Button>
            <Button onClick={saveScheme} disabled={!schemeName.trim()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item modal */}
      <Dialog open={itemModal} onOpenChange={setItemModal}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{editingItemIdx !== null ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="ilabel">Label *</Label>
              <Input id="ilabel" value={itemForm.label}
                onChange={e => setItemForm({ ...itemForm, label: e.target.value })}
                placeholder="e.g. EWS Houses" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icount">Count (leave blank for header rows)</Label>
              <Input id="icount" type="number" value={itemForm.count ?? ""}
                onChange={e => setItemForm({ ...itemForm, count: e.target.value === "" ? undefined : Number(e.target.value) })}
                placeholder="e.g. 196" />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="isub" checked={!!itemForm.isSubheader}
                  onCheckedChange={v => setItemForm({ ...itemForm, isSubheader: !!v, isTotal: false })} />
                <Label htmlFor="isub" className="cursor-pointer">Sub-header row</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="itotal" checked={!!itemForm.isTotal}
                  onCheckedChange={v => setItemForm({ ...itemForm, isTotal: !!v, isSubheader: false })} />
                <Label htmlFor="itotal" className="cursor-pointer">Total row</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemModal(false)}>Cancel</Button>
            <Button onClick={saveItem} disabled={!itemForm.label.trim()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
