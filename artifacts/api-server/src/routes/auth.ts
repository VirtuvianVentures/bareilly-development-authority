import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, type JwtPayload } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (!user || !user.isActive) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    department: user.department,
  };

  const token = signToken(payload);
  res.json({ token, user: { id: user.id, name: user.name, username: user.username, role: user.role, department: user.department, designation: user.designation } });
});

// GET /api/auth/me
router.get("/auth/me", requireAuth, (req, res) => {
  res.json({ user: (req as any).user });
});

// POST /api/auth/change-password
router.post("/auth/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
  const me = (req as any).user as JwtPayload;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const [user] = await db.select().from(users).where(eq(users.id, me.userId)).limit(1);
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) { res.status(401).json({ error: "Current password incorrect" }); return; }

  const hash = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ passwordHash: hash, updatedAt: new Date() }).where(eq(users.id, me.userId));
  res.json({ ok: true });
});

export { requireAdmin } from "../middleware/auth.js";
export default router;
