import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Link2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEED_IMPORTANT_LINKS, ImportantLink } from "@/components/home/LatestNews";

const STORAGE_KEY = "bda_important_links_v1";

function load(): ImportantLink[] {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return SEED_IMPORTANT_LINKS;
}
function save(data: ImportantLink[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export default function AdminImportantLinks() {
  const [links, setLinks] = useState<ImportantLink[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ImportantLink | null>(null);
  const [formData, setFormData] = useState({ label: "", url: "" });
  const { toast } = useToast();

  useEffect(() => { setLinks(load()); }, []);

  const handleOpenModal = (item?: ImportantLink) => {
    setEditingItem(item || null);
    setFormData({ label: item?.label || "", url: item?.url || "" });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.label.trim()) return;
    let updated: ImportantLink[];
    if (editingItem) {
      updated = links.map(l => l.id === editingItem.id ? { ...l, label: formData.label, url: formData.url || "#" } : l);
      toast({ title: "Updated", description: "Link updated successfully." });
    } else {
      const newId = Math.max(0, ...links.map(l => l.id)) + 1;
      updated = [...links, { id: newId, label: formData.label, url: formData.url || "#" }];
      toast({ title: "Added", description: "New link added." });
    }
    save(updated); setLinks(updated); setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("This link will be removed from the home page. Continue?")) return;
    const updated = links.filter(l => l.id !== id);
    save(updated); setLinks(updated);
    toast({ title: "Deleted" });
  };

  const handleMove = (idx: number, dir: -1 | 1) => {
    const t = idx + dir;
    if (t < 0 || t >= links.length) return;
    const updated = [...links];
    [updated[idx], updated[t]] = [updated[t], updated[idx]];
    save(updated); setLinks(updated);
  };

  const handleReset = () => {
    if (!confirm("Reset all links to the original defaults?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setLinks(SEED_IMPORTANT_LINKS);
    toast({ title: "Reset", description: "Default links restored." });
  };

  return (
    <AdminLayout title="Important Links">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Important Links — Home Page ({links.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-gray-600">Reset to Default</Button>
          <Button onClick={() => handleOpenModal()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add Link
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Link Label</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-20 text-center">Order</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link, idx) => (
              <TableRow key={link.id} className="odd:bg-white even:bg-blue-50/30">
                <TableCell className="text-gray-400 font-mono text-sm">{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-orange-500 shrink-0" />
                    <span className="font-medium text-gray-800">{link.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-blue-600 font-mono break-all">{link.url}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <button onClick={() => handleMove(idx, -1)} disabled={idx === 0}
                      className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▲</button>
                    <button onClick={() => handleMove(idx, 1)} disabled={idx === links.length - 1}
                      className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30">▼</button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenModal(link)}
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}
                      className="h-8 w-8 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {links.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-400 py-8">No links added yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Link" : "Add New Link"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="linklabel">Link Label <span className="text-red-500">*</span></Label>
              <Input id="linklabel" value={formData.label}
                onChange={e => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Online Registration" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkurl">URL <span className="text-gray-400 text-xs font-normal">(internal path or full URL)</span></Label>
              <Input id="linkurl" value={formData.url}
                onChange={e => setFormData({ ...formData, url: e.target.value })}
                placeholder="e.g. /raise-query or https://example.gov.in" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formData.label.trim()}
              className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
