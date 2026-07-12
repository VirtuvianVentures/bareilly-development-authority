import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireRole } from "../middleware/auth.js";
import type { JwtPayload } from "../middleware/auth.js";

const router = Router();

// superadmin + admin can view users
router.get("/users", requireRole("superadmin", "admin"), async (_req, res) => {
  const rows = await db.select({
    id: users.id, name: users.name, username: users.username, email: users.email,
    role: users.role, department: users.department, designation: users.designation,
    phone: users.phone, isActive: users.isActive, createdAt: users.createdAt,
  }).from(users).orderBy(users.createdAt);
  res.json(rows);
});

// superadmin + admin can create users
// admin CANNOT create superadmin
router.post("/users", requireRole("superadmin", "admin"), async (req, res) => {
  const caller = (req as any).user as JwtPayload;
  const { name, username, email, password, role, department, designation, phone } =
    req.body as { name: string; username: string; email?: string; password: string; role: any; department?: string; designation?: string; phone?: string };

  if (!name || !username || !password || !role) {
    res.status(400).json({ error: "name, username, password, role required" }); return;
  }
  // admin cannot create superadmin accounts
  if (caller.role === "admin" && role === "superadmin") {
    res.status(403).json({ error: "Admin cannot create superadmin accounts" }); return;
  }
  const hash = await bcrypt.hash(password, 10);
  const [created] = await db.insert(users).values({
    name, username, email, passwordHash: hash, role, department, designation, phone,
  }).returning();
  res.status(201).json(created);
});

// superadmin + admin can edit users
// admin CANNOT assign superadmin role
router.put("/users/:id", requireRole("superadmin", "admin"), async (req, res) => {
  const caller = (req as any).user as JwtPayload;
  const id = Number(req.params.id);
  const { name, email, role, department, designation, phone, isActive, password } =
    req.body as { name?: string; email?: string; role?: any; department?: string; designation?: string; phone?: string; isActive?: boolean; password?: string };

  if (caller.role === "admin" && role === "superadmin") {
    res.status(403).json({ error: "Admin cannot assign superadmin role" }); return;
  }
  const updates: Record<string, any> = { updatedAt: new Date() };
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (role !== undefined) updates.role = role;
  if (department !== undefined) updates.department = department;
  if (designation !== undefined) updates.designation = designation;
  if (phone !== undefined) updates.phone = phone;
  if (isActive !== undefined) updates.isActive = isActive;
  if (password) updates.passwordHash = await bcrypt.hash(password, 10);

  const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
  res.json(updated);
});

// superadmin + admin can deactivate users
router.delete("/users/:id", requireRole("superadmin", "admin"), async (req, res) => {
  const id = Number(req.params.id);
  await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, id));
  res.json({ ok: true });
});

export default router;
