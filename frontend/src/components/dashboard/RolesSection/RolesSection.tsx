
import { useEffect, useState } from "react";
import {
  Add,
  AdminPanelSettingsOutlined,
  DeleteOutlined,
  EditOutlined,
  LockOutlined,
  PeopleOutlined,
  SecurityOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import type {
  CompanyRole,
  RoleFormData,
} from "./RolePermissionEditor";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000";

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#26382f]/10 text-[#26382f]">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500">
          {label}
        </span>
      </div>

      <p className="mt-4 text-3xl font-semibold text-[#26382f]">
        {value}
      </p>
      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

async function rolesRequest(
  path: string,
  options: RequestInit = {},
) {
  const token =
    localStorage.getItem("accessToken") ??
    localStorage.getItem("authToken");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message ??
        data?.error ??
        `Request failed (${response.status}).`,
    );
  }

  if (response.status === 204) return null;

  return response.json();
}

export default function RolesSection() {
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [modalError, setModalError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editingRole, setEditingRole] =
    useState<CompanyRole | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadRoles() {
    setLoading(true);
    setPageError("");

    try {
      const data = await rolesRequest("/api/roles");
      const roleList = Array.isArray(data)
        ? data
        : data?.roles;

      if (!Array.isArray(roleList)) {
        throw new Error("The server returned an invalid roles list.");
      }

      setRoles(roleList);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to load roles.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadRoles();
  }, []);

  function openAddModal() {
    setNotice("");
    setModalError("");
    setAddOpen(true);
  }

  function closeAddModal() {
    if (saving) return;
    setAddOpen(false);
    setModalError("");
  }

  function openEditModal(role: CompanyRole) {
    setNotice("");
    setModalError("");
    setEditingRole(role);
  }

  function closeEditModal() {
    if (saving) return;
    setEditingRole(null);
    setModalError("");
  }

  async function createRole(form: RoleFormData) {
    setSaving(true);
    setModalError("");
    setNotice("");

    try {
      await rolesRequest("/api/roles", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setAddOpen(false);
      setNotice("Role created successfully.");
      await loadRoles();
    } catch (error) {
      setModalError(
        error instanceof Error
          ? error.message
          : "Unable to create role.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateRole(
    role: CompanyRole,
    form: RoleFormData,
  ) {
    if (role.is_system) return;

    setSaving(true);
    setModalError("");
    setNotice("");

    try {
      await rolesRequest(
        `/api/roles/${encodeURIComponent(String(role.id))}`,
        {
          method: "PUT",
          body: JSON.stringify(form),
        },
      );

      setEditingRole(null);
      setNotice("Role updated successfully.");
      await loadRoles();
    } catch (error) {
      setModalError(
        error instanceof Error
          ? error.message
          : "Unable to update role.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteRole(role: CompanyRole) {
    if (role.is_system) return;

    const warning =
      (role.assigned_count ?? 0) > 0
        ? `${role.name} is assigned to ${role.assigned_count} employee(s). Reassign those employees before deleting this role. Continue?`
        : `Delete "${role.name}"? This action cannot be undone.`;

    if (!window.confirm(warning)) return;

    setPageError("");
    setNotice("");

    try {
      await rolesRequest(
        `/api/roles/${encodeURIComponent(String(role.id))}`,
        { method: "DELETE" },
      );

      setNotice("Role deleted successfully.");
      await loadRoles();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to delete role.",
      );
    }
  }

  const filteredRoles = roles.filter((role) =>
    `${role.name} ${role.description ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const assignedEmployees = roles.reduce(
    (total, role) => total + (role.assigned_count ?? 0),
    0,
  );

  const customRoleCount = roles.filter(
    (role) => !role.is_system,
  ).length;

  return (
    <div className="min-h-full bg-[#f7f8f6] px-4 py-6 text-[#26382f] sm:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
              <SecurityOutlined fontSize="small" />
              Company administration
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Roles
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Create roles for your team and control what each
              role can access across Summit.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#26382f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#344a3d]"
          >
            <Add fontSize="small" />
            Create role
          </button>
        </header>

        {pageError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{pageError}</span>
            <button
              onClick={() => void loadRoles()}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            {notice}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<ShieldOutlined />}
            label="Total roles"
            value={roles.length}
            description="Available to your company"
          />
          <SummaryCard
            icon={<PeopleOutlined />}
            label="Assigned employees"
            value={assignedEmployees}
            description="Total assignments across roles"
          />
          <SummaryCard
            icon={<LockOutlined />}
            label="Custom roles"
            value={customRoleCount}
            description="Company-created roles"
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Your roles</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage team access from one place.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles..."
              aria-label="Search roles"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#26382f] sm:max-w-xs"
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Loading roles...
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="p-12 text-center">
              <AdminPanelSettingsOutlined
                className="mb-3 text-gray-400"
                fontSize="large"
              />
              <p className="font-medium">No roles found</p>
              <p className="mt-1 text-sm text-gray-500">
                Create a role or try another search.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#26382f]/[0.07] text-[#26382f]">
                      {role.is_system ? (
                        <LockOutlined />
                      ) : (
                        <AdminPanelSettingsOutlined />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">
                          {role.name}
                        </h3>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            role.is_system
                              ? "bg-gray-100 text-gray-600"
                              : "bg-[#ffbb00]/20 text-[#665000]"
                          }`}
                        >
                          {role.is_system ? "System role" : "Custom"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        {role.description ||
                          "No description provided."}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <PeopleOutlined fontSize="small" />
                          {role.assigned_count ?? 0} employees
                        </span>
                        <span>
                          {role.permissions.length} permissions
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                    <button
                      onClick={() => openEditModal(role)}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-100"
                    >
                      <EditOutlined fontSize="small" />
                      {role.is_system ? "View" : "Edit"}
                    </button>

                    <button
                      onClick={() => void deleteRole(role)}
                      disabled={role.is_system}
                      title={
                        role.is_system
                          ? "System roles cannot be deleted"
                          : "Delete role"
                      }
                      aria-label={`Delete ${role.name}`}
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <DeleteOutlined fontSize="small" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-xs leading-relaxed text-gray-500">
          Only authorized company administrators should be able
          to manage roles. Permission checks and company-level
          access must also be enforced by the backend.
        </p>
      </div>

      <AddRoleModal
        open={addOpen}
        saving={saving}
        error={modalError}
        onClose={closeAddModal}
        onSave={createRole}
      />

      <EditRoleModal
        role={editingRole}
        saving={saving}
        error={modalError}
        onClose={closeEditModal}
        onSave={updateRole}
      />
    </div>
  );
}
