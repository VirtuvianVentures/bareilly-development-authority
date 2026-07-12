import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Photo | null>(null);
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    displayOrder: 0,
    isActive: true
  });

  const fetchPhotos = async () => {
    try {
      const res = await apiFetch("/photos");
      const data = await res.json();
      setPhotos(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch photos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleOpenModal = (item?: Photo) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        imageUrl: item.imageUrl,
        displayOrder: item.displayOrder || 0,
        isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        imageUrl: "",
        displayOrder: 0,
        isActive: true
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `/photos/${editingItem.id}` : "/photos";
      
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast({ title: "Success", description: `Photo ${editingItem ? "updated" : "added"} successfully` });
        setModalOpen(false);
        fetchPhotos();
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to save photo", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    
    try {
      const res = await apiFetch(`/photos/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Success", description: "Photo deleted successfully" });
        fetchPhotos();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete photo", variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Manage Photo Gallery">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Photos List</h2>
        <Button onClick={() => handleOpenModal()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-24">Thumbnail</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-24 text-center">Order</TableHead>
              <TableHead className="w-24 text-center">Active</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : photos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No photos found
                </TableCell>
              </TableRow>
            ) : (
              photos.map((item) => (
                <TableRow key={item.id} className="odd:bg-white even:bg-gray-50/50">
                  <TableCell>
                    <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center border border-gray-200">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                  <TableCell className="text-center">{item.displayOrder}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${item.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)} className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Photo" : "Add New Photo"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Photo Title <span className="text-red-500">*</span></Label>
              <Input id="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Image URL <span className="text-red-500">*</span></Label>
              <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" type="number" value={formData.displayOrder} onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})} />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData({...formData, isActive: !!checked})} />
                <Label htmlFor="isActive" className="cursor-pointer">Show on website</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !formData.title || !formData.imageUrl} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
