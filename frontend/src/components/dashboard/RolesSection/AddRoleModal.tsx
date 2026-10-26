
import { useEffect, useState, type FormEvent } from "react";
import RolePermissionEditor, {
  type RoleFormData,
} from "./RolePermissionEditor";

interface AddRoleModalProps {
  open: boolean;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (form: RoleFormData) => Promise<void>;
}

const EMPTY_FORM: RoleFormData = {
  name: "",
  description: "",
  permissions: [],
};

export default function AddRoleModal({
  open,
  saving,
  error,
  onClose,
  onSave,
}: AddRoleModalProps) {
  const [form, setForm] = useState<RoleFormData>(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setForm({
        name: "",
        description: "",
        permissions: [],
      });
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) return;

    await onSave({
      name: form.name.trim(),
      description: form.description.trim(),
      permissions: form.permissions,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-role-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <h2
              id="add-role-title"
              className="text-xl font-semibold text-[#26382f]"
            >
              Create a role
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Define a role and choose what its members can access.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg px-3 py-1 text-xl text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-6 overflow-y-auto p-6">
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <RolePermissionEditor
              form={form}
              setForm={setForm}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || !form.name.trim()}
              className="rounded-xl bg-[#26382f] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#344a3d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
