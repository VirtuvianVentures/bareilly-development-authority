import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEED_INVESTORS, Investor } from "@/pages/achievements/InvestorsList";

const STORAGE_KEY = "bda_investors_list_v1";

function load(): Investor[] {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return SEED_INVESTORS;
}
function save(data: Investor[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export default function AdminInvestorsList() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Investor | null>(null);
  const [formData, setFormData] = useState({ name: "", cost: "" });
  const { toast } = useToast();

  useEffect(() => { setInvestors(load()); }, []);

  const total = investors.reduce((s, i) => s + i.cost, 0);

  const handleOpenModal = (item?: Investor) => {
    setEditingItem(item || null);
    setFormData({ name: item?.name || "", cost: item ? String(item.cost) : "" });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.cost) return;
    const cost = parseFloat(formData.cost);
    if (isNaN(cost)) return;

    let updated: Investor[];
    if (editingItem) {
      updated = investors.map(i => i.id === editingItem.id ? { ...i, name: formData.name, cost } : i);
      toast({ title: "Updated", description: "Investor entry updated." });
    } else {
      const newId = Math.max(0, ...investors.map(i => i.id)) + 1;
      updated = [...investors, { id: newId, name: formData.name, cost }];
      toast({ title: "Added", description: "New investor added." });
    }
    save(updated); setInvestors(updated); setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("इस निवेशक को हटाना चाहते हैं?")) return;
    const updated = investors.filter(i => i.id !== id);
    save(updated); setInvestors(updated);
    toast({ title: "Deleted" });
  };

  const handleMove = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= investors.length) return;
    const updated = [...investors];
    [updated[idx], updated[t]] = [updated[t], updated[idx]];
    save(updated); setInvestors(updated);
  };

  const handleReset = () => {
    if (!confirm("सभी बदलाव हटाकर मूल डेटा वापस लाना चाहते हैं?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setInvestors(SEED_INVESTORS);
    toast({ title: "Reset", description: "Default data restored." });
  };

  return (
    <AdminLayout title="Investors List Master">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          रामगंगा नगर योजना — निवेशक सूची ({investors.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-gray-600">Reset to Default</Button>
          <Button onClick={() => handleOpenModal()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />नया निवेशक जोड़ें
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-14">क्र0</TableHead>
              <TableHead>योजना का नाम</TableHead>
              <TableHead className="w-36 text-right">लागत (लाख में)</TableHead>
              <TableHead className="w-20 text-center">क्रम</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investors.map((inv, idx) => (
              <TableRow key={inv.id} className="odd:bg-white even:bg-blue-50/30">
                <TableCell className="text-gray-500">{idx + 1}</TableCell>
                <TableCell className="font-medium text-gray-800" lang="hi">{inv.name}</TableCell>
                <TableCell className="text-right text-gray-700">{inv.cost.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <button onClick={() => handleMove(idx, -1)} disabled={idx === 0}
                      className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▲</button>
                    <button onClick={() => handleMove(idx, 1)} disabled={idx === investors.length - 1}
                      className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▼</button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(inv)}
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(inv.id)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* Total row */}
            <TableRow className="bg-orange-50 font-bold border-t-2 border-orange-200">
              <TableCell colSpan={2} className="text-[#c8580a]" lang="hi">कुल योग</TableCell>
              <TableCell className="text-right text-[#c8580a]">{total.toFixed(2)}</TableCell>
              <TableCell /><TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "निवेशक संपादित करें" : "नया निवेशक जोड़ें"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="iname">योजना का नाम <span className="text-red-500">*</span></Label>
              <Input id="iname" value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="जैसे: सशस्त्र सीमा बल" lang="hi" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icost">लागत (लाख में) <span className="text-red-500">*</span></Label>
              <Input id="icost" type="number" step="0.01" value={formData.cost}
                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                placeholder="जैसे: 932.96" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!formData.name.trim() || !formData.cost}
              className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">सहेजें</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
