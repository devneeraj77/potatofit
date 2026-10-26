#!/usr/bin/env tsx

import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  seedAdmins,
  AdminUser,
} from "../src/lib/admin-store";

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();

function printHelp() {
  console.log(`
\x1b[33m\x1b[1mUchitatvam Admin CLI\x1b[0m
====================================
Usage:
  \x1b[36mnpx tsx scripts/manage-admins.ts\x1b[0m <command> [arguments]

Commands:
  \x1b[32mseed\x1b[0m
    Seed default super admins (dev.neerajrekwar@gmail.com, etc.)

  \x1b[32mlist\x1b[0m
    List all registered platform admins

  \x1b[32mcreate\x1b[0m <email> <name> [role=admin|super_admin|editor]
    Create a new platform administrator

  \x1b[32mupdate\x1b[0m <email> [--name="..."] [--role=admin|super_admin|editor] [--status=active|suspended]
    Update an existing admin profile or change role

  \x1b[32mdelete\x1b[0m <email>
    Remove an administrator from access

Examples:
  npx tsx scripts/manage-admins.ts seed
  npx tsx scripts/manage-admins.ts list
  npx tsx scripts/manage-admins.ts create coach.sarah@uchitatvam.com "Sarah Jenkins" editor
  npx tsx scripts/manage-admins.ts update coach.sarah@uchitatvam.com --role=admin
  npx tsx scripts/manage-admins.ts delete coach.sarah@uchitatvam.com
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

function handleSeed() {
  console.log("\x1b[34m[Uchitatvam]\x1b[0m Seeding platform administrators...");
  const res = seedAdmins();
  console.log(`\x1b[32m✔ Seeding complete!\x1b[0m Total admins: ${res.admins.length} (Added: ${res.count})`);
  printTable(res.admins);
}

function handleList() {
  const admins = getAdmins();
  if (admins.length === 0) {
    console.log("\x1b[33mNo administrators found. Run seed command first.\x1b[0m");
    return;
  }
  printTable(admins);
}

function handleCreate() {
  const email = args[1];
  const name = args[2];
  const role = (args[3] as "super_admin" | "admin" | "editor") || "admin";

  if (!email || !name) {
    console.error("\x1b[31mError: Both <email> and <name> are required.\x1b[0m");
    console.log('Usage: npx tsx scripts/manage-admins.ts create <email> <name> [role]');
    process.exit(1);
  }

  const res = createAdmin({ email, name, role });
  if (!res.success) {
    console.error(`\x1b[31mError: ${res.error}\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[32m✔ Created administrator successfully:\x1b[0m`);
  console.log(JSON.stringify(res.admin, null, 2));
}

function handleUpdate() {
  const email = args[1];
  if (!email) {
    console.error("\x1b[31mError: <email> is required.\x1b[0m");
    process.exit(1);
  }

  const updates: Partial<AdminUser> = {};
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--name=")) {
      updates.name = arg.replace("--name=", "").replace(/^["']|["']$/g, "");
    } else if (arg.startsWith("--role=")) {
      updates.role = arg.replace("--role=", "") as "super_admin" | "admin" | "editor";
    } else if (arg.startsWith("--status=")) {
      updates.status = arg.replace("--status=", "") as "active" | "suspended";
    } else if (arg.startsWith("--notes=")) {
      updates.notes = arg.replace("--notes=", "").replace(/^["']|["']$/g, "");
    }
  }

  if (Object.keys(updates).length === 0) {
    console.error("\x1b[31mError: No update flags specified (e.g. --role=admin, --status=suspended).\x1b[0m");
    process.exit(1);
  }

  const res = updateAdmin(email, updates);
  if (!res.success) {
    console.error(`\x1b[31mError: ${res.error}\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[32m✔ Updated administrator ${email}:\x1b[0m`);
  console.log(JSON.stringify(res.admin, null, 2));
}

function handleDelete() {
  const email = args[1];
  if (!email) {
    console.error("\x1b[31mError: <email> is required.\x1b[0m");
    process.exit(1);
  }

  const res = deleteAdmin(email);
  if (!res.success) {
    console.error(`\x1b[31mError: ${res.error}\x1b[0m`);
    process.exit(1);
  }

  console.log(`\x1b[32m✔ Deleted administrator ${email}\x1b[0m`);
}

switch (command) {
  case "seed":
    handleSeed();
    break;
  case "list":
    handleList();
    break;
  case "create":
    handleCreate();
    break;
  case "update":
    handleUpdate();
    break;
  case "delete":
    handleDelete();
    break;
  default:
    printHelp();
    break;
}
