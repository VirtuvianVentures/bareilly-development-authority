import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "bda-jwt-secret-2025-change-in-prod";

export interface JwtPayload {
  userId: number;
  username: string;
  name: string;
  role: "superadmin" | "admin" | "officer" | "user";
  department?: string | null;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const payload = verifyToken(auth.slice(7));
  if (!payload) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
  (req as any).user = payload;
  next();
}

export function requireRole(...roles: JwtPayload["role"][]) {
  return (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, () => {
      const user = (req as any).user as JwtPayload;
      if (!roles.includes(user.role)) {
        res.status(403).json({ error: "Forbidden — insufficient role" });
        return;
      }
      next();
    });
  };
}

// Legacy compat: admin = superadmin | admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user as JwtPayload;
    if (user.role !== "superadmin" && user.role !== "admin") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}

// CMS writes: superadmin | admin | officer (webmaster)
export function requireCmsAccess(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user as JwtPayload;
    if (user.role !== "superadmin" && user.role !== "admin" && user.role !== "officer") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  });
}
