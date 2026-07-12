import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

interface Banner {
  id: number;
  title: string;
  titleHindi: string | null;
  subtitle: string | null;
  description: string | null;
  imageUrl: string | null;
  bgGradient: string;
  linkUrl: string | null;
  isActive: boolean;
  displayOrder: number;
}

const GRADIENT_OPTIONS = [
  { label: "Navy → Teal", value: "from-slate-900 to-teal-800" },
  { label: "Orange → Red", value: "from-orange-600 to-red-800" },
  { label: "Green → Teal", value: "from-green-700 to-teal-800" },
  { label: "Blue → Indigo", value: "from-blue-800 to-indigo-900" },
  { label: "Purple → Pink", value: "from-purple-800 to-pink-700" },
  { label: "Dark → Gold", value: "from-gray-900 to-yellow-800" },
];

const emptyForm = {
  title: "",
  titleHindi: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  bgGradient: "from-slate-900 to-teal-800",
  linkUrl: "",
  isActive: true,
  displayOrder: 0,
};

export default function AdminBanners() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    apiFetch("/banners")
      .then((r) => r.json())
      .then(setBanners)
      .catch(() => toast({ title: "Error", description: "Failed to load banners", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditId(b.id);
    setForm({
      title: b.title,
      titleHindi: b.titleHindi || "",
      subtitle: b.subtitle || "",
      description: b.description || "",
      imageUrl: b.imageUrl || "",
      bgGradient: b.bgGradient,
      linkUrl: b.linkUrl || "",
      isActive: b.isActive,
      displayOrder: b.displayOrder,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        titleHindi: form.titleHindi || null,
        subtitle: form.subtitle || null,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        linkUrl: form.linkUrl || null,
      };
      const res = editId
        ? await apiFetch(`/banners/${editId}`, { method: "PUT", body: JSON.stringify(body) })
        : await apiFetch("/banners", { method: "POST", body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: editId ? "Updated" : "Added", description: "Banner saved successfully" });
      setDialogOpen(false);
      load();
    } catch {
      toast({ title: "Error", description: "Failed to save banner", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await apiFetch(`/banners/${id}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Banner removed" });
      load();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const set = (k: string, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <AdminLayout title="Homepage Slider Banners">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Manage the slides shown on the homepage hero banner. Changes are reflected on the public website immediately.
          </p>
          <Button onClick={openAdd} className="bg-[#1a3a6e] hover:bg-[#15306b]" data-testid="button-add-banner">
            <Plus className="h-4 w-4 mr-2" /> Add Banner
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#1a3a6e]" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Preview</TableHead>
                  <TableHead>Title (English)</TableHead>
                  <TableHead>Title (Hindi)</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                      No banners yet. Add your first banner.
                    </TableCell>
                  </TableRow>
                ) : (
                  banners.map((b) => (
                    <TableRow key={b.id} className="odd:bg-gray-50" data-testid={`row-banner-${b.id}`}>
                      <TableCell>
                        <div
                          className={`w-20 h-12 rounded bg-gradient-to-r ${b.bgGradient} flex items-center justify-center`}
                        >
                          {b.imageUrl ? (
                            <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover rounded" />
                          ) : (
                            <span className="text-white text-xs font-bold truncate px-1">{b.title.slice(0, 8)}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[160px] truncate">{b.title}</TableCell>
                      <TableCell className="max-w-[140px] truncate" lang="hi">{b.titleHindi || "—"}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-gray-500">{b.subtitle || "—"}</TableCell>
                      <TableCell>{b.displayOrder}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {b.isActive ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(b)} data-testid={`btn-edit-banner-${b.id}`}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleDelete(b.id)} data-testid={`btn-delete-banner-${b.id}`}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Title (English)</label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Smart City Initiative" data-testid="input-banner-title" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Title (Hindi)</label>
              <Input value={form.titleHindi} onChange={(e) => set("titleHindi", e.target.value)} placeholder="e.g. रामायण वाटिका" lang="hi" data-testid="input-banner-title-hindi" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Subtitle</label>
              <Input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Tagline shown below the title" data-testid="input-banner-subtitle" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description text" rows={2} data-testid="input-banner-description" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Background Gradient</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6e]"
                value={form.bgGradient}
                onChange={(e) => set("bgGradient", e.target.value)}
                data-testid="select-banner-gradient"
              >
                {GRADIENT_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
              <div className={`mt-2 h-10 rounded bg-gradient-to-r ${form.bgGradient}`} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Image URL (optional — overrides gradient)</label>
              <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." data-testid="input-banner-image-url" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Link URL (optional)</label>
              <Input value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} placeholder="https://..." data-testid="input-banner-link-url" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Display Order</label>
                <Input type="number" value={form.displayOrder} onChange={(e) => set("displayOrder", Number(e.target.value))} data-testid="input-banner-order" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-[#1a3a6e]" data-testid="checkbox-banner-active" />
                  <span className="text-sm font-medium text-gray-700">Show on website</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancel-banner">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#1a3a6e] hover:bg-[#15306b]" data-testid="button-save-banner">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? "Saving..." : "Save Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
