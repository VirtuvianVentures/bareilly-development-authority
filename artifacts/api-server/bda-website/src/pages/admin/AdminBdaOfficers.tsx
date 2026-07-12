import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEED_OFFICERS } from "@/pages/about/BdaOfficers";

const STORAGE_KEY = "bda_officers_v1";

interface Officer {
  id: number;
  name: string;
  designation: string;
}

function loadOfficers(): Officer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_OFFICERS;
}

function saveOfficers(officers: Officer[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(officers));
}

export default function AdminBdaOfficers() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Officer | null>(null);
  const [formData, setFormData] = useState({ name: "", designation: "" });
  const { toast } = useToast();

  useEffect(() => {
    setOfficers(loadOfficers());
  }, []);

  const handleOpenModal = (item?: Officer) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, designation: item.designation });
    } else {
      setEditingItem(null);
      setFormData({ name: "", designation: "" });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.designation.trim()) return;

    let updated: Officer[];
    if (editingItem) {
      updated = officers.map((o) =>
        o.id === editingItem.id ? { ...o, ...formData } : o
      );
      toast({ title: "सफलता", description: "अधिकारी की जानकारी अपडेट हुई।" });
    } else {
      const newId = Math.max(0, ...officers.map((o) => o.id)) + 1;
      updated = [...officers, { id: newId, ...formData }];
      toast({ title: "सफलता", description: "नया अधिकारी जोड़ा गया।" });
    }

    saveOfficers(updated);
    setOfficers(updated);
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("क्या आप इस अधिकारी को हटाना चाहते हैं?")) return;
    const updated = officers.filter((o) => o.id !== id);
    saveOfficers(updated);
    setOfficers(updated);
    toast({ title: "हटाया गया", description: "अधिकारी हटा दिया गया।" });
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...officers];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    saveOfficers(updated);
    setOfficers(updated);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === officers.length - 1) return;
    const updated = [...officers];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    saveOfficers(updated);
    setOfficers(updated);
  };

  const handleReset = () => {
    if (!window.confirm("सभी बदलाव हटाकर मूल डेटा वापस लाना चाहते हैं?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setOfficers(SEED_OFFICERS);
    toast({ title: "रीसेट हुआ", description: "मूल डेटा वापस आ गया।" });
  };

  return (
    <AdminLayout title="BDA Officers Master">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          अधिकारी सूची ({officers.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-gray-600">
            Reset to Default
          </Button>
          <Button onClick={() => handleOpenModal()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            नया अधिकारी जोड़ें
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-16">क्र0</TableHead>
              <TableHead>अधिकारी का नाम</TableHead>
              <TableHead>पदनाम</TableHead>
              <TableHead className="w-24 text-center">क्रम</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {officers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  कोई अधिकारी नहीं मिला
                </TableCell>
              </TableRow>
            ) : (
              officers.map((officer, idx) => (
                <TableRow key={officer.id} className="odd:bg-white even:bg-gray-50/50">
                  <TableCell className="text-gray-500">{idx + 1}.</TableCell>
                  <TableCell className="font-medium text-gray-900" lang="hi">{officer.name}</TableCell>
                  <TableCell className="text-gray-700" lang="hi">{officer.designation}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="ऊपर ले जाएं"
                      >▲</button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === officers.length - 1}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30"
                        title="नीचे ले जाएं"
                      >▼</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleOpenModal(officer)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => handleDelete(officer.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "अधिकारी संपादित करें" : "नया अधिकारी जोड़ें"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">अधिकारी का नाम <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="जैसे: श्री अजय कुमार सिंह"
                lang="hi"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="designation">पदनाम <span className="text-red-500">*</span></Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="जैसे: सहायक अभियन्ता"
                lang="hi"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>रद्द करें</Button>
            <Button
              onClick={handleSave}
              disabled={!formData.name.trim() || !formData.designation.trim()}
              className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white"
            >
              सहेजें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
