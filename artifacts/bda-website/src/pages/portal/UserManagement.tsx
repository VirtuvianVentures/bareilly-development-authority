import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { apiFetch } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, UserX, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type Role = "superadmin" | "admin" | "officer" | "user";
interface User { id: number; name: string; username: string; email: string; role: Role; department: string; designation: string; phone: string; isActive: boolean; createdAt: string; }

const ROLE_COLORS: Record<Role, string> = {
  superadmin: "bg-red-100 text-red-700",
  admin: "bg-blue-100 text-blue-700",
  officer: "bg-green-100 text-green-700",
  user: "bg-gray-100 text-gray-700",
};

const emptyForm = { name: "", username: "", email: "", password: "", role: "officer" as Role, department: "", designation: "", phone: "" };

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // admin can assign only admin/officer/user; superadmin can assign all
  const assignableRoles: Role[] = currentUser?.role === "superadmin"
    ? ["superadmin", "admin", "officer", "user"]
    : ["admin", "officer", "user"];

  const load = async () => {
    setLoading(true);
    const r = await apiFetch("/users");
    setUsers(await r.json());
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditUser(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (u: User) => { setEditUser(u); setForm({ ...u, password: "" }); setShowForm(true); };

  const save = async () => {
    if (!form.name || !form.username || (!editUser && !form.password)) {
      toast({ title: "Error", description: "Name, username and password required", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      if (editUser) {
        await apiFetch(`/users/${editUser.id}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await apiFetch("/users", { method: "POST", body: JSON.stringify(form) });
      }
      toast({ title: editUser ? "User updated" : "User created" });
      setShowForm(false);
      load();
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const deactivate = async (id: number) => {
    if (!confirm("Deactivate this user?")) return;
    await apiFetch(`/users/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <PortalLayout title="User Management" moduleId="users">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">System Users</h2>
            <p className="text-sm text-gray-500">Manage portal access and roles</p>
          </div>
          <Button onClick={openAdd} className="bg-slate-700 hover:bg-slate-800 gap-2">
            <Plus className="h-4 w-4" /> Add User
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gray-300" /></div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>{["Name", "Username", "Role", "Department", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{u.name}</div>
                      <div className="text-xs text-gray-400">{u.designation}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.username}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.department || "—"}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{u.isActive ? "Active" : "Inactive"}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(u)}><Pencil className="h-3.5 w-3.5" /></Button>
                        {u.isActive && <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => deactivate(u.id)}><UserX className="h-3.5 w-3.5" /></Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="font-bold text-gray-800">{editUser ? "Edit User" : "Add New User"}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="px-6 py-5 space-y-4">
                {[
                  { label: "Full Name", key: "name", type: "text" },
                  { label: "Username", key: "username", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: editUser ? "New Password (leave blank to keep)" : "Password", key: "password", type: "password" },
                  { label: "Designation", key: "designation", type: "text" },
                  { label: "Department", key: "department", type: "text" },
                  { label: "Phone", key: "phone", type: "text" },
                ].map(f => (
                  <div key={f.key}>
                    <Label className="text-xs font-medium text-gray-600">{f.label}</Label>
                    <Input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="mt-1" />
                  </div>
                ))}
                <div>
                  <Label className="text-xs font-medium text-gray-600">Role</Label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))}
                    className="mt-1 w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500">
                    {assignableRoles.map(r => (
                      <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="px-6 pb-5 flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={save} disabled={saving} className="bg-slate-700 hover:bg-slate-800">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}{editUser ? "Save Changes" : "Create User"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
