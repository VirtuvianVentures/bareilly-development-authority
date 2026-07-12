/**
 * Seed script — run once to create the superadmin user.
 * Usage: node --enable-source-maps dist/seed.mjs
 * Or via: pnpm --filter @workspace/api-server run seed
 */
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { users } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding users...");

  const accounts = [
    { name: "Super Admin", username: "superadmin", password: "BDA@SuperAdmin2025", role: "superadmin" as const, designation: "System Administrator", department: "IT" },
    { name: "BDA Admin", username: "admin", password: "bda@admin2025", role: "admin" as const, designation: "Administrator", department: "Administration" },
    { name: "Web Officer", username: "webmaster", password: "Web@BDA2025", role: "officer" as const, designation: "Web Master", department: "IT" },
  ];

  for (const acc of accounts) {
    const [existing] = await db.select().from(users).where(eq(users.username, acc.username)).limit(1);
    if (existing) {
      console.log(`  ✓ ${acc.username} already exists — skipping`);
      continue;
    }
    const passwordHash = await bcrypt.hash(acc.password, 10);
    await db.insert(users).values({ name: acc.name, username: acc.username, passwordHash, role: acc.role, designation: acc.designation, department: acc.department });
    console.log(`  ✓ Created ${acc.role}: ${acc.username} / ${acc.password}`);
  }

  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
