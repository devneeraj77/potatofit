"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  Terminal,
} from "lucide-react";
import { AdminUser } from "@/lib/admin-store";

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "super_admin" | "editor">("admin");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const refreshAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins);
      }
    } catch {
      console.error("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/admins");
        const data = await res.json();
        if (active && data.success) {
          setAdmins(data.admins);
        }
      } catch {
        console.error("Failed to fetch admins");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) {
      setErrorMsg("Email and name are required.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, name: newName, role: newRole }),
      });
      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || "Failed to add admin");
        setSubmitting(false);
        return;
      }
      setModalOpen(false);
      setNewEmail("");
      setNewName("");
      refreshAdmins();
    } catch {
      setErrorMsg("Error creating admin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    const newStatus = admin.status === "active" ? "suspended" : "active";
    try {
      const res = await fetch("/api/admin/admins", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: admin.email, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmins((prev) =>
          prev.map((a) => (a.email === admin.email ? { ...a, status: newStatus } : a))
        );
      }
    } catch {
      console.error("Failed to toggle admin status");
    }
  };

  const handleDeleteAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove administrator ${email}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/admins?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setAdmins((prev) => prev.filter((a) => a.email !== email));
      } else {
        alert(data.error || "Failed to delete admin");
      }
    } catch {
      alert("Error deleting admin");
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Access Control &amp; RBAC
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs text-[#A0A493]">Uchitatvam Team</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Administrators &amp; Athletes
          </h1>
          <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] mt-0.5">
            Manage system administrators, grant coach privileges, and inspect member roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Administrator</span>
        </button>
      </div>

      {/* Terminal CLI Command Callout */}
      <div className="p-4 rounded-2xl bg-[#0E1310] border border-[#757761]/35 text-[#E2E7DE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#1D2520] text-[#f7fe72] shrink-0 mt-0.5">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#f7fe72] font-mono">
              Terminal Shell Commands Ready
            </h3>
            <p className="text-xs text-[#CBD2C7] leading-relaxed mt-0.5">
              You can also create, delete, update, and seed administrators directly via bash:
            </p>
            <div className="flex flex-wrap gap-2 mt-2 font-mono text-[11px] text-[#f7fe72]">
              <span className="px-2 py-0.5 rounded bg-black/40 border border-[#757761]/30">npm run admin:seed</span>
              <span className="px-2 py-0.5 rounded bg-black/40 border border-[#757761]/30">npm run admin:manage list</span>
              <span className="px-2 py-0.5 rounded bg-black/40 border border-[#757761]/30">npm run admin:manage create &lt;email&gt; &lt;name&gt;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
          />
        </div>
        <div className="text-xs text-[#505445] dark:text-[#A0A493] font-mono">
          {filteredAdmins.length} administrators registered
        </div>
      </div>

      {/* Admin Users Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F5] dark:bg-[#18211C] border-b border-[#757761]/20 text-[#757761] uppercase tracking-wider font-mono">
              <tr>
                <th className="px-5 py-3.5">Administrator</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Notes</th>
                <th className="px-4 py-3.5">Created</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#757761]/15">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#757761]">
                    Loading administrators...
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.email}
                    className="hover:bg-[#F4F6F5]/50 dark:hover:bg-[#18211C]/50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#18211C] border border-[#757761]/35 flex items-center justify-center text-[#f7fe72] font-bold text-xs shrink-0">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#121815] dark:text-white">
                            {admin.name}
                          </div>
                          <div className="text-[11px] font-mono text-[#505445] dark:text-[#A0A493]">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          admin.role === "super_admin"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/25"
                            : admin.role === "admin"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25"
                        }`}
                      >
                        {admin.role.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(admin)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer ${
                          admin.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25"
                        }`}
                        title="Click to toggle status"
                      >
                        {admin.status === "active" ? (
                          <UserCheck className="w-3 h-3" />
                        ) : (
                          <UserX className="w-3 h-3" />
                        )}
                        <span className="capitalize">{admin.status}</span>
                      </button>
                    </td>

                    <td className="px-4 py-4 text-[#505445] dark:text-[#A0A493] text-[11px] max-w-xs truncate">
                      {admin.notes || "—"}
                    </td>

                    <td className="px-4 py-4 font-mono text-[11px] text-[#757761] whitespace-nowrap">
                      {admin.createdAt ? admin.createdAt.split("T")[0] : "2026-01-01"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      {admin.email !== "dev.neerajrekwar@gmail.com" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(admin.email)}
                          className="p-1.5 rounded-lg text-[#757761] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Remove Admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#121815] dark:text-white">
              Add New Administrator
            </h3>
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500 text-xs">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#505445] dark:text-[#A0A493] mb-1 font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sarah Jenkins"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#505445] dark:text-[#A0A493] mb-1 font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g., sarah@uchitatvam.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#505445] dark:text-[#A0A493] mb-1 font-mono">
                  Permission Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "admin" | "super_admin" | "editor")}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
                >
                  <option value="admin">Admin (Full Management)</option>
                  <option value="super_admin">Super Admin (System Control)</option>
                  <option value="editor">Editor (Articles &amp; Categories Only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#757761]/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-[#505445] dark:text-[#CBD2C7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl font-bold text-[#0B0E0C] bg-[#f7fe72]"
                >
                  {submitting ? "Adding..." : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
