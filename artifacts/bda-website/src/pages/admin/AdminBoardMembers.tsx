import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEED_BOARD_MEMBERS } from "@/pages/about/BoardMembers";

const STORAGE_KEY = "bda_board_members_v1";

interface BoardMember {
  id: number;
  name: string;
  post: string;
  role: string;
}

function loadMembers(): BoardMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED_BOARD_MEMBERS;
}

function saveMembers(members: BoardMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

export default function AdminBoardMembers() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BoardMember | null>(null);
  const [formData, setFormData] = useState({ name: "", post: "", role: "" });
  const { toast } = useToast();

  useEffect(() => {
    setMembers(loadMembers());
  }, []);

  const handleOpenModal = (item?: BoardMember) => {
    if (item) {
      setEditingItem(item);
      setFormData({ name: item.name, post: item.post, role: item.role });
    } else {
      setEditingItem(null);
      setFormData({ name: "", post: "", role: "सदस्य" });
    }
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.post.trim() || !formData.role.trim()) return;

    let updated: BoardMember[];
    if (editingItem) {
      updated = members.map((m) => m.id === editingItem.id ? { ...m, ...formData } : m);
      toast({ title: "सफलता", description: "बोर्ड सदस्य की जानकारी अपडेट हुई।" });
    } else {
      const newId = Math.max(0, ...members.map((m) => m.id)) + 1;
      updated = [...members, { id: newId, ...formData }];
      toast({ title: "सफलता", description: "नया बोर्ड सदस्य जोड़ा गया।" });
    }

    saveMembers(updated);
    setMembers(updated);
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("क्या आप इस सदस्य को हटाना चाहते हैं?")) return;
    const updated = members.filter((m) => m.id !== id);
    saveMembers(updated);
    setMembers(updated);
    toast({ title: "हटाया गया", description: "सदस्य हटा दिया गया।" });
  };

  const handleMove = (idx: number, dir: -1 | 1) => {
    const updated = [...members];
    const target = idx + dir;
    if (target < 0 || target >= updated.length) return;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    saveMembers(updated);
    setMembers(updated);
  };

  const handleReset = () => {
    if (!window.confirm("सभी बदलाव हटाकर मूल डेटा वापस लाना चाहते हैं?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setMembers(SEED_BOARD_MEMBERS);
    toast({ title: "रीसेट हुआ", description: "मूल डेटा वापस आ गया।" });
  };

  return (
    <AdminLayout title="Board Members Master">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">बोर्ड सदस्य सूची ({members.length})</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-gray-600">
            Reset to Default
          </Button>
          <Button onClick={() => handleOpenModal()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
            <Plus className="h-4 w-4 mr-2" />
            नया सदस्य जोड़ें
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-14">क्र0</TableHead>
              <TableHead>नाम</TableHead>
              <TableHead>पदनाम</TableHead>
              <TableHead className="w-24">भूमिका</TableHead>
              <TableHead className="w-20 text-center">क्रम</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">कोई सदस्य नहीं मिला</TableCell>
              </TableRow>
            ) : (
              members.map((member, idx) => (
                <TableRow key={member.id} className="odd:bg-white even:bg-gray-50/50">
                  <TableCell className="text-gray-500">{idx + 1}.</TableCell>
                  <TableCell className="font-medium text-gray-900 max-w-[180px]" lang="hi">{member.name}</TableCell>
                  <TableCell className="text-gray-700 max-w-[260px]" lang="hi">{member.post}</TableCell>
                  <TableCell lang="hi">{member.role}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <button onClick={() => handleMove(idx, -1)} disabled={idx === 0}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▲</button>
                      <button onClick={() => handleMove(idx, 1)} disabled={idx === members.length - 1}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▼</button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(member)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
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
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "सदस्य संपादित करें" : "नया बोर्ड सदस्य जोड़ें"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">नाम</Label>
              <Input id="name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="जैसे: श्री अजय कुमार सिंह" lang="hi" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post">पदनाम <span className="text-red-500">*</span></Label>
              <Input id="post" value={formData.post}
                onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                placeholder="जैसे: जिलाधिकारी, बरेली" lang="hi" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">भूमिका <span className="text-red-500">*</span></Label>
              <select id="role" value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                <option value="अध्यक्ष">अध्यक्ष</option>
                <option value="उपाध्यक्ष">उपाध्यक्ष</option>
                <option value="सदस्य">सदस्य</option>
                <option value="सचिव">सचिव</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>रद्द करें</Button>
            <Button onClick={handleSave} disabled={!formData.post.trim() || !formData.role.trim()}
              className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
              सहेजें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
