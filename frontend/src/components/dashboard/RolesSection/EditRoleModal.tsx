
import { useEffect, useState, type FormEvent } from "react";
import RolePermissionEditor, {
  type CompanyRole,
  type RoleFormData,
} from "./RolePermissionEditor";

interface EditRoleModalProps {
  role: CompanyRole | null;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (
    role: CompanyRole,
    form: RoleFormData
  ) => Promise<void>;
}

export default function EditRoleModal({
  role,
  saving,
  error,
  onClose,
  onSave,
}: EditRoleModalProps) {
  const [form, setForm] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: [],
  });

  useEffect(() => {
    if (!role) {
      setForm({
        name: "",
        description: "",
        permissions: [],
      });
      return;
    }

    setForm({
      name: role.name,
      description: role.description ?? "",
      permissions: [...role.permissions],
    });
  }, [role]);

  if (!role) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Capture the role and verify it is not null.
    const currentRole = role;

    if (
      !currentRole ||
      currentRole.is_system ||
      !form.name.trim()
    ) {
      return;
    }

    await onSave(currentRole, {
      name: form.name.trim(),
      description: form.description.trim(),
      permissions: form.permissions,
    });
  }

  const isSystemRole = role.is_system;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#26382f] text-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/10 p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Edit Role
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Update the role name, description, and permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="rounded-lg px-3 py-1 text-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            &times;
          </button>
        </div>

        {isSystemRole && (
          <div className="mx-6 mt-5 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200">
            System roles cannot be edited.
          </div>
        )}

        {error && (
          <div className="mx-6 mt-5 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <RolePermissionEditor
              form={form}
              setForm={setForm}
              readOnly={isSystemRole}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 p-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            {!isSystemRole && (
              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="rounded-lg bg-[#ffbb00] px-5 py-2 text-sm font-semibold text-[#26382f] transition hover:bg-[#e6a800] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}