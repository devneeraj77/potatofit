#!/usr/bin/env tsx

import {
  getAdmins,
  createAdminAsync,
  updateAdminAsync,
  deleteAdminAsync,
  seedAdminsAsync,
  AdminUser,
} from "../src/lib/admin-store";

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();

function printHelp() {
  console.log(`
\x1b[33m\x1b[1mUchitatvam Admin CLI & Neon Sync Engine\x1b[0m
======================================================
Usage:
  \x1b[36mnpm run admin:manage\x1b[0m <command> [arguments]
  \x1b[36mnpm run admin:seed\x1b[0m

Commands:
  \x1b[32mseed\x1b[0m
    Seed default super admins (dev.neerajrekwar@gmail.com, etc.) to Local Store & Neon DB

  \x1b[32mlist\x1b[0m
    List all registered platform administrators

  \x1b[32mcreate\x1b[0m <email> <name> [role=admin|super_admin|editor]
    Create a new platform administrator and sync to Neon PostgreSQL

  \x1b[32mupdate\x1b[0m <email> [--name="..."] [--role=admin|super_admin|editor] [--status=active|suspended] [--notes="..."]
    Update an existing admin profile or change role

  \x1b[32mdelete\x1b[0m <email>
    Remove an administrator from access and sync removal with Neon PostgreSQL

Examples:
  npm run admin:seed
  npm run admin:manage list
  npm run admin:manage create coach.sarah@uchitatvam.com "Sarah Jenkins" editor
  npm run admin:manage update coach.sarah@uchitatvam.com --role=admin
  npm run admin:manage delete coach.sarah@uchitatvam.com
`);
}

function printTable(admins: AdminUser[]) {
  console.log("\n\x1b[1mRegistered Uchitatvam Administrators:\x1b[0m");
  console.log("-----------------------------------------------------------------------------------------");
  console.log(
    "EMAIL".padEnd(35) +
    "NAME".padEnd(24) +
    "ROLE".padEnd(14) +
    "STATUS".padEnd(10) +
    "CREATED"
  );
  console.log("-----------------------------------------------------------------------------------------");
  for (const a of admins) {
    const roleColor =
      a.role === "super_admin" ? "\x1b[35m" : a.role === "admin" ? "\x1b[33m" : "\x1b[36m";
    const statusColor = a.status === "active" ? "\x1b[32m" : "\x1b[31m";
    const createdStr = a.createdAt ? a.createdAt.split("T")[0] : "2026-01-01";

    console.log(
      `${a.email.padEnd(35)}${a.name.padEnd(24)}${roleColor}${a.role.padEnd(14)}\x1b[0m${statusColor}${a.status.padEnd(10)}\x1b[0m${createdStr}`
    );
  }
  console.log("-----------------------------------------------------------------------------------------\n");
}

async function handleSeed() {
  console.log("\x1b[34m[Uchitatvam]\x1b[0m Seeding platform administrators...");
  const res = await seedAdminsAsync();
  console.log(`\x1b[32m✔ Seeding complete!\x1b[0m Total admins: ${res.admins.length} (Newly Added: ${res.count})`);
  if (res.neonSynced) {
    console.log("\x1b[32m✔ Neon PostgreSQL:\x1b[0m Tables initialized and admins synchronized successfully.");
  } else {
    console.log("\x1b[33mℹ Storage:\x1b[0m Saved to data/admins.json. (To sync to remote Neon cloud, set DATABASE_URL in .env)");
  }
  printTable(res.admins);
}

function handleList() {
  const admins = getAdmins();
  if (admins.length === 0) {
    console.log("\x1b[33mNo administrators found. Run `npm run admin:seed` first.\x1b[0m");
    return;
  }
  printTable(admins);
}

async function handleCreate() {
  const email = args[1];
  const name = args[2];
  let role: "super_admin" | "admin" | "editor" = "admin";
  let password = "SecretPass123-";

  for (let i = 3; i < args.length; i++) {
    const rawArg = args[i];
    const cleanArg = rawArg.replace(/^--/, "");
    if (cleanArg.startsWith("role=")) {
      role = cleanArg.replace("role=", "") as "super_admin" | "admin" | "editor";
    } else if (cleanArg.startsWith("password=")) {
      password = cleanArg.replace("password=", "");
    } else if (["super_admin", "admin", "editor"].includes(cleanArg)) {
      role = cleanArg as "super_admin" | "admin" | "editor";
    } else if (i === 4 || (!cleanArg.includes("=") && cleanArg.length >= 6)) {
      password = cleanArg;
    }
  }

  if (!email || !name) {
    console.error("\x1b[31mError: Both <email> and <name> are required.\x1b[0m");
    console.log('Usage: npm run admin:manage create <email> <name> [role] [password]');
    process.exit(1);
  }

  const res = await createAdminAsync({ email, name, role, password });
  if (!res.success) {
    console.error(`\x1b[31mError: ${res.error}\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[32m✔ Created administrator successfully:\x1b[0m`);
  console.log(JSON.stringify(res.admin, null, 2));
  if (res.neonSynced) {
    console.log("\x1b[32m✔ Neon PostgreSQL synced:\x1b[0m Admin record inserted/updated in database.");
  }
}

async function handleUpdate() {
  const email = args[1];
  if (!email) {
    console.error("\x1b[31mError: <email> is required.\x1b[0m");
    process.exit(1);
  }

  const updates: Partial<AdminUser> = {};
  for (let i = 2; i < args.length; i++) {
    const rawArg = args[i];
    const cleanArg = rawArg.replace(/^--/, "");
    if (cleanArg.startsWith("name=")) {
      updates.name = cleanArg.replace("name=", "").replace(/^["']|["']$/g, "");
    } else if (cleanArg.startsWith("role=")) {
      updates.role = cleanArg.replace("role=", "") as "super_admin" | "admin" | "editor";
    } else if (cleanArg.startsWith("status=")) {
      updates.status = cleanArg.replace("status=", "") as "active" | "suspended";
    } else if (cleanArg.startsWith("password=")) {
      updates.password = cleanArg.replace("password=", "");
    } else if (cleanArg.startsWith("notes=")) {
      updates.notes = cleanArg.replace("notes=", "").replace(/^["']|["']$/g, "");
    } else if (["super_admin", "admin", "editor"].includes(cleanArg)) {
      updates.role = cleanArg as "super_admin" | "admin" | "editor";
    } else if (["active", "suspended"].includes(cleanArg)) {
      updates.status = cleanArg as "active" | "suspended";
    }
  }

  if (Object.keys(updates).length === 0) {
    console.error("\x1b[31mError: No update flags specified (e.g. role=admin, status=suspended, or --role=admin).\x1b[0m");
    process.exit(1);
  }

  const res = await updateAdminAsync(email, updates);
  if (!res.success) {
    console.error(`\x1b[31mError: ${res.error}\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[32m✔ Updated administrator ${email}:\x1b[0m`);
  console.log(JSON.stringify(res.admin, null, 2));
  if (res.neonSynced) {
    console.log("\x1b[32m✔ Neon PostgreSQL synced:\x1b[0m Admin record updated in database.");
  }
}

async function handleDelete() {
  const email = args[1];
  if (!email) {
    console.error("\x1b[31mError: <email> is required.\x1b[0m");
    process.exit(1);
  }

  const res = await deleteAdminAsync(email);
  if (!res.success) {
    console.error(`\x1b[31mError: ${res.error}\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[32m✔ Deleted administrator ${email}\x1b[0m`);
  if (res.neonSynced) {
    console.log("\x1b[32m✔ Neon PostgreSQL synced:\x1b[0m Admin record deleted from database.");
  }
}

async function main() {
  switch (command) {
    case "seed":
      await handleSeed();
      break;
    case "list":
      handleList();
      break;
    case "create":
      await handleCreate();
      break;
    case "update":
      await handleUpdate();
      break;
    case "delete":
      await handleDelete();
      break;
    default:
      printHelp();
      break;
  }
}

main().catch((err) => {
  console.error("Fatal CLI Error:", err);
  process.exit(1);
});
