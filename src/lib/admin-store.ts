import fs from "fs";
import path from "path";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
  status: "active" | "suspended";
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ADMINS_FILE = path.join(DATA_DIR, "admins.json");

const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: "admin-neeraj",
    email: "dev.neerajrekwar@gmail.com",
    name: "Neeraj Rekwar",
    role: "super_admin",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    notes: "Lead Founder & Super Admin",
  },
  {
    id: "admin-system",
    email: "admin@uchitatvam.com",
    name: "Uchitatvam Operations",
    role: "super_admin",
    status: "active",
    createdAt: "2026-01-01T00:00:00.000Z",
    notes: "Core Platform Service Admin",
  },
  {
    id: "admin-david",
    email: "david.kim@fitmeal.fit",
    name: "David Kim",
    role: "admin",
    status: "active",
    createdAt: "2026-02-15T00:00:00.000Z",
    notes: "Head Performance & Biometrics Coach",
  },
];

function ensureDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAdmins(): AdminUser[] {
  try {
    ensureDirExists();
    if (!fs.existsSync(ADMINS_FILE)) {
      fs.writeFileSync(ADMINS_FILE, JSON.stringify(DEFAULT_ADMINS, null, 2), "utf8");
      return DEFAULT_ADMINS;
    }
    const raw = fs.readFileSync(ADMINS_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : DEFAULT_ADMINS;
  } catch (err) {
    console.error("[admin-store] Error reading admins file:", err);
    return DEFAULT_ADMINS;
  }
}

export function saveAdmins(admins: AdminUser[]): boolean {
  try {
    ensureDirExists();
    fs.writeFileSync(ADMINS_FILE, JSON.stringify(admins, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[admin-store] Error saving admins file:", err);
    return false;
  }
}

export function getAdminByEmail(email: string): AdminUser | null {
  const admins = getAdmins();
  return admins.find((a) => a.email.toLowerCase() === email.toLowerCase()) || null;
}

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  const admin = getAdminByEmail(email);
  return Boolean(admin && admin.status === "active");
}

export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  const admin = getAdminByEmail(email);
  return Boolean(admin && admin.status === "active" && admin.role === "super_admin");
}

export function createAdmin(input: {
  email: string;
  name: string;
  role?: "super_admin" | "admin" | "editor";
  notes?: string;
}): { success: boolean; admin?: AdminUser; error?: string } {
  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { success: false, error: "Valid email is required" };
  }

  const admins = getAdmins();
  if (admins.some((a) => a.email.toLowerCase() === email)) {
    return { success: false, error: `Admin with email ${email} already exists` };
  }

  const newAdmin: AdminUser = {
    id: "admin-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 6),
    email,
    name: input.name?.trim() || email.split("@")[0],
    role: input.role || "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    notes: input.notes?.trim() || "Created via Admin Management",
  };

  admins.push(newAdmin);
  saveAdmins(admins);
  return { success: true, admin: newAdmin };
}

export function updateAdmin(
  email: string,
  updates: Partial<Omit<AdminUser, "id" | "email" | "createdAt">>
): { success: boolean; admin?: AdminUser; error?: string } {
  const admins = getAdmins();
  const index = admins.findIndex((a) => a.email.toLowerCase() === email.trim().toLowerCase());

  if (index === -1) {
    return { success: false, error: `Admin with email ${email} not found` };
  }

  const updated: AdminUser = {
    ...admins[index],
    ...updates,
  };

  admins[index] = updated;
  saveAdmins(admins);
  return { success: true, admin: updated };
}

export function deleteAdmin(email: string): { success: boolean; error?: string } {
  const normEmail = email.trim().toLowerCase();
  // Prevent deleting primary super admin
  if (normEmail === "dev.neerajrekwar@gmail.com") {
    return { success: false, error: "Cannot delete the lead super admin dev.neerajrekwar@gmail.com" };
  }

  const admins = getAdmins();
  const filtered = admins.filter((a) => a.email.toLowerCase() !== normEmail);

  if (filtered.length === admins.length) {
    return { success: false, error: `Admin ${email} not found` };
  }

  saveAdmins(filtered);
  return { success: true };
}

export function seedAdmins(): { count: number; admins: AdminUser[] } {
  ensureDirExists();
  const existing = getAdmins();
  const existingEmails = new Set(existing.map((a) => a.email.toLowerCase()));

  let added = 0;
  for (const def of DEFAULT_ADMINS) {
    if (!existingEmails.has(def.email.toLowerCase())) {
      existing.push(def);
      added++;
    }
  }

  saveAdmins(existing);
  return { count: added, admins: existing };
}
