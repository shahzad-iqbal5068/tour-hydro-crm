"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import type { Role, UserRow } from "@/types";

const ROLES: Role[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "CEO",
  "SALES_EXEC",
  "CALL_PERSON",
];

export default function AdminUsersPageClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; email: string; role: Role }>({
    name: "",
    email: "",
    role: "SALES_EXEC",
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const startCreate = () => {
    setSelectedId(null);
    setForm({ name: "", email: "", role: "SALES_EXEC" });
  };

  const startEdit = (user: UserRow) => {
    setSelectedId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to save user");
        return;
      }
      toast.success(selectedId ? "User updated" : "User created");
      setSelectedId(null);
      setForm({ name: "", email: "", role: "SALES_EXEC" });
      loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
      <Toaster position="top-right" />

      {/* Users table */}
      <div className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Users
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Manage CRM roles for your team.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
          >
            + New user
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                <th className="px-3 py-2">Name</th>
                <th className="hidden px-3 py-2 sm:table-cell">Email</th>
                <th className="px-3 py-2">Role</th>
                <th className="hidden px-3 py-2 md:table-cell">Created</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-50">
                      {user.name}
                    </td>
                    <td className="hidden px-3 py-2 text-zinc-700 dark:text-zinc-200 sm:table-cell">
                      {user.email}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                        {user.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2 text-zinc-600 dark:text-zinc-300 md:table-cell">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(user)}
                        className="rounded-md border border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User form */}
      <div className="w-full shrink-0 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 lg:max-w-sm">
        <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {selectedId ? "Edit user" : "New user"}
        </h2>
        <p className="mb-4 text-xs text-zinc-600 dark:text-zinc-400">
          Assign roles like SUPER_ADMIN, ADMIN, MANAGER, CEO, SALES_EXEC or
          CALL_PERSON.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-100"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              placeholder="Full name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-100"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
              placeholder="Email address"
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-xs font-medium text-zinc-800 dark:text-zinc-100"
            >
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as Role })
              }
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
            >
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving
              ? selectedId
                ? "Saving..."
                : "Creating..."
              : selectedId
                ? "Save changes"
                : "Create user"}
          </button>
        </form>
      </div>
    </div>
  );
}
