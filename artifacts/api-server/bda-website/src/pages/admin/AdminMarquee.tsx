import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Paperclip, ExternalLink, FileText, ImageIcon, Link2 } from "lucide-react";

interface MarqueeItem {
  id: number;
  title: string;
  fileUrl: string | null;
  fileType: string | null;
  isActive: boolean;
  displayOrder: number;
}

const emptyForm = {
  title: "",
  fileUrl: "",
  fileType: "" as string,
  isActive: true,
  displayOrder: 0,
};

type AttachMode = "none" | "upload" | "url";

export default function AdminMarquee() {
  const { toast } = useToast();
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [attachMode, setAttachMode] = useState<AttachMode>("none");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    apiFetch("/marquee/all")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => toast({ title: "Error", description: "Failed to load ticker items", variant: "destructive" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setAttachMode("none");
    setDialogOpen(true);
  };

  const openEdit = (item: MarqueeItem) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      fileUrl: item.fileUrl || "",
      fileType: item.fileType || "",
      isActive: item.isActive,
      displayOrder: item.displayOrder,
    });
    setAttachMode(item.fileUrl ? (item.fileUrl.startsWith("http") ? "url" : "upload") : "none");
    setDialogOpen(true);
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiFetch("/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data: { fileUrl: string; fileType: string } = await res.json();
      setForm((f) => ({ ...f, fileUrl: data.fileUrl, fileType: data.fileType }));
      toast({ title: "Uploaded", description: "File uploaded successfully" });
    } catch {
      toast({ title: "Error", description: "File upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Validation", description: "Title is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: form.title,
        fileUrl: attachMode === "none" ? null : (form.fileUrl || null),
        fileType: attachMode === "none" ? null : (form.fileType || null),
        isActive: form.isActive,
        displayOrder: form.displayOrder,
      };
      const res = editId
        ? await apiFetch(`/marquee/${editId}`, { method: "PUT", body: JSON.stringify(body) })
        : await apiFetch("/marquee", { method: "POST", body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      toast({ title: editId ? "Updated" : "Added", description: "Ticker item saved" });
      setDialogOpen(false);
      load();
    } catch {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this ticker item?")) return;
    try {
      await apiFetch(`/marquee/${id}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Item removed" });
      load();
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  const set = (k: string, v: string | boolean | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const AttachIcon = form.fileType === "pdf" ? FileText : form.fileType === "image" ? ImageIcon : Link2;

  return (
    <AdminLayout title="News Ticker / Marquee">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            Manage the scrolling news ticker shown on the homepage. Each item can have an optional PDF or image attachment — clicking the item on the website opens it.
          </p>
          <Button onClick={openAdd} className="bg-[#1a3a6e] hover:bg-[#15306b]">
            <Plus className="h-4 w-4 mr-2" /> Add Ticker Item
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
                  <TableHead>Title</TableHead>
                  <TableHead>Attachment</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">
                      No ticker items yet. Add your first item.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id} className="odd:bg-gray-50">
                      <TableCell className="font-medium max-w-[300px] truncate">{item.title}</TableCell>
                      <TableCell>
                        {item.fileUrl ? (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            {item.fileType === "pdf" ? (
                              <FileText className="h-4 w-4 text-red-500" />
                            ) : item.fileType === "image" ? (
                              <ImageIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <Link2 className="h-4 w-4 text-blue-500" />
                            )}
                            {item.fileType?.toUpperCase() || "Link"}
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>{item.displayOrder}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {item.isActive ? "Yes" : "No"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleDelete(item.id)}>
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
            <DialogTitle>{editId ? "Edit Ticker Item" : "Add Ticker Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. OTS 2026 – Apply Now"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Attachment (optional)</label>
              <div className="flex gap-2 mb-3">
                {(["none", "upload", "url"] as AttachMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setAttachMode(mode);
                      if (mode === "none") setForm((f) => ({ ...f, fileUrl: "", fileType: "" }));
                    }}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                      attachMode === mode
                        ? "bg-[#1a3a6e] text-white border-[#1a3a6e]"
                        : "bg-white text-gray-600 border-gray-300 hover:border-[#1a3a6e]"
                    }`}
                  >
                    {mode === "none" ? "No Attachment" : mode === "upload" ? "Upload File" : "External URL"}
                  </button>
                ))}
              </div>

              {attachMode === "upload" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex-1"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Paperclip className="h-4 w-4 mr-2" />
                      )}
                      {uploading ? "Uploading..." : "Choose PDF or Image"}
                    </Button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  {form.fileUrl && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border text-sm">
                      <AttachIcon className="h-4 w-4 text-[#1a3a6e] shrink-0" />
                      <a
                        href={form.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate flex-1"
                      >
                        {form.fileUrl.split("/").pop()}
                      </a>
                      <ExternalLink className="h-3 w-3 text-gray-400 shrink-0" />
                    </div>
                  )}
                </div>
              )}

              {attachMode === "url" && (
                <div className="space-y-2">
                  <Input
                    value={form.fileUrl}
                    onChange={(e) => {
                      const url = e.target.value;
                      const ft = url.toLowerCase().includes(".pdf") ? "pdf" : "link";
                      setForm((f) => ({ ...f, fileUrl: url, fileType: ft }));
                    }}
                    placeholder="https://example.com/document.pdf"
                  />
                  <p className="text-xs text-gray-500">Paste a URL to a PDF, image, or any page.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Display Order</label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) => set("displayOrder", Number(e.target.value))}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => set("isActive", e.target.checked)}
                    className="w-4 h-4 accent-[#1a3a6e]"
                  />
                  <span className="text-sm font-medium text-gray-700">Show on website</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || uploading} className="bg-[#1a3a6e] hover:bg-[#15306b]">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {saving ? "Saving..." : "Save Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
