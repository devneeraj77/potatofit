"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserPlus,
  Search,
  Database,
  Trash2,
  Lock,
  Mail,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Terminal,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "editor";
  status: "active" | "suspended";
  createdAt: string;
  notes?: string;
  password?: string;
}

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Create admin modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"super_admin" | "admin" | "editor">("admin");
  const [newPassword, setNewPassword] = useState("SecretPass123-");
  const [newNotes, setNewNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // Edit password state
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [editPasswordVal, setEditPasswordVal] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const reloadAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (data.success && Array.isArray(data.admins)) {
        setAdmins(data.admins);
      }
    } catch {
      setActionMsg({ text: "Failed to load administrators from store.", type: "error" });
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/admins")
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data.success && Array.isArray(data.admins)) {
          setAdmins(data.admins);
        }
      })
      .catch(() => {
        if (mounted) {
          setActionMsg({ text: "Failed to load administrators from store.", type: "error" });
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSeed = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg({ text: `Seeding complete! ${data.admins.length} administrators verified and synced with Neon DB.`, type: "success" });
        setAdmins(data.admins);
      } else {
        setActionMsg({ text: data.error || "Seeding failed.", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Network error during seeding.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    setCreating(true);
    setActionMsg(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim().toLowerCase(),
          name: newName.trim(),
          role: newRole,
          password: newPassword,
          notes: newNotes.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setActionMsg({ text: `Administrator ${data.admin.email} created and synced to Neon PostgreSQL!`, type: "success" });
        setShowCreateModal(false);
        setNewEmail("");
        setNewName("");
        setNewNotes("");
        reloadAdmins();
      } else {
        setActionMsg({ text: data.error || "Failed to create administrator.", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Network error creating administrator.", type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    const nextStatus = admin.status === "active" ? "suspended" : "active";
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: admin.email,
          status: nextStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg({ text: `Updated ${admin.email} status to ${nextStatus}.`, type: "success" });
        reloadAdmins();
      }
    } catch {
      setActionMsg({ text: "Failed to update status.", type: "error" });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin || !editPasswordVal) return;

    setSavingEdit(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: editingAdmin.email,
          password: editPasswordVal,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg({ text: `Password updated for ${editingAdmin.email} and synced to Neon DB.`, type: "success" });
        setEditingAdmin(null);
        setEditPasswordVal("");
        reloadAdmins();
      }
    } catch {
      setActionMsg({ text: "Failed to update password.", type: "error" });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to remove administrator ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/admins?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg({ text: `Administrator ${email} removed and updated in Neon DB.`, type: "success" });
        reloadAdmins();
      } else {
        setActionMsg({ text: data.error || "Cannot delete admin.", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Network error during deletion.", type: "error" });
    }
  };

  const filteredAdmins = admins.filter((a) => {
    const matchesQuery =
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || a.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Security &amp; Operations
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#34d399]">
              <Database className="w-3 h-3" />
              Neon PostgreSQL Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Platform Administrators
          </h1>
          <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
            Manage administrative personnel, super admins, credential secrets, and Neon database synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSeed}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#141A16] hover:bg-[#EAEFEA] dark:hover:bg-[#1B231D] border border-[#757761]/30 text-[#121815] dark:text-white transition-colors cursor-pointer"
            title="Seed default platform admins"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#f7fe72]" : ""}`} />
            <span>Seed Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 border ${
            actionMsg.type === "success"
              ? "bg-[#34d399]/10 border-[#34d399]/30 text-[#34d399]"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{actionMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMsg(null)}
            className="text-xs opacity-70 hover:opacity-100 font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* Terminal CLI Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-[#EAEFEA]/80 dark:bg-[#0E1310] border border-[#757761]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#f7fe72]" />
          <span className="font-mono text-[11px] text-[#121815] dark:text-white font-semibold">
            Terminal CLI Synchronizer:
          </span>
          <span className="text-[11px] text-[#505445] dark:text-[#A0A493]">
            You can also manage admins via terminal using <code className="px-1.5 py-0.5 rounded bg-black/30 text-[#f7fe72] font-mono text-[10px]">npm run admin:manage</code>
          </span>
        </div>
        <div className="text-[10px] font-mono text-[#34d399] font-bold shrink-0">
          ● Dual-Store Sync (Neon + JSON)
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search admins by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-mono text-[#757761] shrink-0">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admins</option>
            <option value="admin">Platform Admins</option>
            <option value="editor">Editors</option>
          </select>
        </div>
      </div>

      {/* Admins Table */}
      <div className="rounded-2xl border border-[#757761]/25 bg-white dark:bg-[#0E1310] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EAEFEA]/70 dark:bg-[#141A16] border-b border-[#757761]/25 text-[#505445] dark:text-[#A0A493] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Administrator</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Credentials / Notes</th>
                <th className="py-3 px-4">Added</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#757761]/15">
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#757761] font-mono text-xs">
                    {loading ? "Loading administrators..." : "No administrators found matching criteria."}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-[#EAEFEA]/40 dark:hover:bg-[#141A16]/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1A231D] border border-[#757761]/35 flex items-center justify-center font-bold text-xs text-[#f7fe72] shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-[#121815] dark:text-white truncate">
                            {admin.name}
                          </div>
                          <div className="font-mono text-[11px] text-[#505445] dark:text-[#A0A493] truncate">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          admin.role === "super_admin"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : admin.role === "admin"
                            ? "bg-[#f7fe72]/10 text-[#7A5A00] dark:text-[#f7fe72] border-[#f7fe72]/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        <ShieldCheck className="w-3 h-3" />
                        {admin.role.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(admin)}
                        className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          admin.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${admin.status === "active" ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className="capitalize">{admin.status}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5 max-w-xs">
                        <div className="text-[11px] text-[#505445] dark:text-[#CBD2C7] truncate">
                          {admin.notes || "No notes"}
                        </div>
                        <div className="text-[10px] font-mono text-[#757761] flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{admin.password ? "••••••••" : "Default master secret"}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#757761]">
                      {admin.createdAt ? admin.createdAt.split("T")[0] : "2026-01-01"}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAdmin(admin);
                            setEditPasswordVal(admin.password || "");
                          }}
                          className="p-1.5 rounded-lg text-[#505445] dark:text-[#A0A493] hover:text-[#f7fe72] hover:bg-[#757761]/15 transition-colors"
                          title="Change Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={admin.email === "neerajrekwar817@gmail.com" || admin.email === "dev.neerajrekwar@gmail.com"}
                          onClick={() => handleDelete(admin.email)}
                          className="p-1.5 rounded-lg text-[#505445] dark:text-[#A0A493] hover:text-red-400 hover:bg-red-950/20 transition-colors disabled:opacity-20 disabled:hover:text-[#757761] disabled:hover:bg-transparent"
                          title={
                            admin.email.includes("neeraj")
                              ? "Super admin cannot be deleted"
                              : "Remove Admin"
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Admin */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#757761]/25">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f7fe72]" />
                <h3 className="text-base font-bold text-white">Create Platform Admin</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#757761] hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Patel"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="maya@uchitatvam.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Administrative Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "super_admin" | "admin" | "editor")}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                >
                  <option value="admin">Platform Admin (Standard Management)</option>
                  <option value="super_admin">Super Admin (Full Root Permissions)</option>
                  <option value="editor">Editor (Blog &amp; Protocols Only)</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Initial Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Dietitian &amp; Protocol Manager"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#757761]/25">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 rounded-xl text-xs text-[#A0A493] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {creating ? "Creating..." : "Save Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Password */}
      {editingAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#757761]/25">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#f7fe72]" />
                <h3 className="text-sm font-bold text-white">Update Password</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingAdmin(null)}
                className="p-1 text-[#757761] hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#A0A493]">
              Setting password for <span className="text-white font-mono">{editingAdmin.email}</span>.
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-[#A0A493] mb-1">New Password</label>
                <input
                  type="text"
                  required
                  placeholder="Min 6 characters"
                  value={editPasswordVal}
                  onChange={(e) => setEditPasswordVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#757761]/25">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#A0A493] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {savingEdit ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
