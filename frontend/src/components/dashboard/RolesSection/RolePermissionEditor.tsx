
import type { Dispatch, SetStateAction } from "react";

export interface CompanyRole {
  id: number | string;
  name: string;
  description: string;
  permissions: string[];
  is_system: boolean;
  assigned_count: number;
}

export interface RoleFormData {
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  key: string;
  label: string;
}

interface PermissionGroup {
  name: string;
  description: string;
  permissions: Permission[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    name: "People",
    description: "Manage team members and company access.",
    permissions: [
      { key: "employees.view", label: "View employees" },
      { key: "employees.invite", label: "Invite employees" },
      { key: "employees.edit", label: "Edit employees" },
      { key: "employees.remove", label: "Remove employees" },
      { key: "roles.view", label: "View roles" },
      { key: "roles.manage", label: "Create and manage roles" },
    ],
  },
  {
    name: "Cards",
    description: "Control company card access.",
    permissions: [
      { key: "cards.view", label: "View cards" },
      { key: "cards.create", label: "Issue cards" },
      { key: "cards.edit", label: "Edit card settings" },
      { key: "cards.freeze", label: "Freeze and unfreeze cards" },
      { key: "cards.cancel", label: "Cancel cards" },
    ],
  },
  {
    name: "Transactions",
    description: "Access and review company transactions.",
    permissions: [
      { key: "transactions.view_own", label: "View own transactions" },
      { key: "transactions.view_all", label: "View all transactions" },
      { key: "transactions.review", label: "Review transactions" },
      { key: "transactions.export", label: "Export transactions" },
    ],
  },
  {
    name: "Expenses",
    description: "Manage expense submissions and reimbursements.",
    permissions: [
      { key: "expenses.view_own", label: "View own expenses" },
      { key: "expenses.view_all", label: "View all expenses" },
      { key: "expenses.submit", label: "Submit expenses" },
      { key: "expenses.approve", label: "Approve expenses" },
    ],
  },
  {
    name: "Budgets",
    description: "Manage team and company spending budgets.",
    permissions: [
      { key: "budgets.view", label: "View budgets" },
      { key: "budgets.create", label: "Create budgets" },
      { key: "budgets.edit", label: "Edit budgets" },
    ],
  },
  {
    name: "Reports",
    description: "Access financial reporting.",
    permissions: [
      { key: "reports.view", label: "View reports" },
      { key: "reports.export", label: "Export reports" },
    ],
  },
  {
    name: "Company settings",
    description: "Manage company-level configuration.",
    permissions: [
      { key: "company.view_settings", label: "View company settings" },
      { key: "company.edit_settings", label: "Edit company settings" },
    ],
  },
];

interface RolePermissionEditorProps {
  form: RoleFormData;
  setForm: Dispatch<SetStateAction<RoleFormData>>;
  readOnly?: boolean;
}

export default function RolePermissionEditor({
  form,
  setForm,
  readOnly = false,
}: RolePermissionEditorProps) {
  function togglePermission(key: string) {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(key)
        ? current.permissions.filter((item) => item !== key)
        : [...current.permissions, key],
    }));
  }

  function toggleGroup(group: PermissionGroup) {
    const keys = group.permissions.map((permission) => permission.key);
    const allSelected = keys.every((key) =>
      form.permissions.includes(key),
    );

    setForm((current) => ({
      ...current,
      permissions: allSelected
        ? current.permissions.filter((key) => !keys.includes(key))
        : [...new Set([...current.permissions, ...keys])],
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="role-name"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Role name <span className="text-red-500">*</span>
        </label>
        <input
          id="role-name"
          required
          maxLength={60}
          disabled={readOnly}
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
          placeholder="e.g. Finance Manager"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#26382f] disabled:bg-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="role-description"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="role-description"
          rows={2}
          maxLength={250}
          disabled={readOnly}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder="Describe what this role can do."
          className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#26382f] disabled:bg-gray-100"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[#26382f]">Permissions</h3>
            <p className="mt-1 text-xs text-gray-500">
              Choose which areas this role can access.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#26382f]/10 px-3 py-1 text-xs font-semibold text-[#26382f]">
            {form.permissions.length} selected
          </span>
        </div>

        <div className="space-y-3">
          {PERMISSION_GROUPS.map((group) => {
            const keys = group.permissions.map((item) => item.key);
            const selectedCount = keys.filter((key) =>
              form.permissions.includes(key),
            ).length;
            const allSelected = selectedCount === keys.length;

            return (
              <section
                key={group.name}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <div className="flex items-start justify-between gap-3 bg-gray-50 px-4 py-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      {group.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-500">
                      {group.description}
                    </p>
                  </div>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group)}
                      className="shrink-0 text-xs font-semibold text-[#26382f] hover:underline"
                    >
                      {allSelected ? "Clear all" : "Select all"}
                    </button>
                  )}
                </div>

                <div className="grid gap-3 p-4 sm:grid-cols-2">
                  {group.permissions.map((permission) => (
                    <label
                      key={permission.key}
                      className={`flex items-start gap-3 text-sm ${
                        readOnly
                          ? "cursor-default"
                          : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={readOnly}
                        checked={form.permissions.includes(
                          permission.key,
                        )}
                        onChange={() =>
                          togglePermission(permission.key)
                        }
                        className="mt-0.5 h-4 w-4 accent-[#26382f]"
                      />
                      <span className="text-gray-700">
                        {permission.label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
