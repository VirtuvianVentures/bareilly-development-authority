import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { apiFetch } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Official {
  id: number;
  name: string;
  designation: string;
  department: string;
  photoUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminOfficials() {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Official | null>(null);
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    photoUrl: "",
    displayOrder: 0,
    isActive: true
  });

  const fetchOfficials = async () => {
    try {
      const res = await apiFetch("/officials");
      const data = await res.json();
      setOfficials(data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch officials", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  const handleOpenModal = (item?: Official) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        designation: item.designation,
        department: item.department || "",
        photoUrl: item.photoUrl || "",
        displayOrder: item.displayOrder || 0,
        isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        designation: "",
        department: "",
        photoUrl: "",
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
      const url = editingItem ? `/officials/${editingItem.id}` : "/officials";
      
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        toast({ title: "Success", description: `Official ${editingItem ? "updated" : "added"} successfully` });
        setModalOpen(false);
        fetchOfficials();
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to save official", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this official?")) return;
    
    try {
      const res = await apiFetch(`/officials/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Success", description: "Official deleted successfully" });
        fetchOfficials();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete official", variant: "destructive" });
    }
  };

  return (
    <AdminLayout title="Manage Officials">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Officials List</h2>
        <Button onClick={() => handleOpenModal()} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="w-24 text-center">Order</TableHead>
              <TableHead className="w-24 text-center">Active</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : officials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No officials found
                </TableCell>
              </TableRow>
            ) : (
              officials.map((item) => (
                <TableRow key={item.id} className="odd:bg-white even:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                  <TableCell>{item.designation}</TableCell>
                  <TableCell>{item.department}</TableCell>
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
            <DialogTitle>{editingItem ? "Edit Official" : "Add New Official"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name with designation <span className="text-red-500">*</span></Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Shri P. Guruprashad, IAS" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
              <Input id="designation" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Principal Secretary" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input id="photoUrl" value={formData.photoUrl} onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} placeholder="https://..." />
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
            <Button onClick={handleSave} disabled={saving || !formData.name || !formData.designation} className="bg-[#1a3a6e] hover:bg-[#1a3a6e]/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
