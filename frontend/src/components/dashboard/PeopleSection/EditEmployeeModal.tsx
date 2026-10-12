import { useEffect, useState, type FormEvent } from "react";

export interface EditableEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  cardLimit: number | null;
  cardLimitFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  status: string;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  employee: EditableEmployee | null;
  onClose: () => void;
  onSave: (employee: EditableEmployee) => void;
}

const roles = [
  "Employee",
  "Manager",
  "Admin",
  "Product Designer",
  "Financial Analyst",
  "Frontend Engineer",
  "HR Manager",
  "Data Scientist",
];

const departments = [
  "Engineering",
  "Design",
  "Finance",
  "Human Resources",
  "Marketing",
  "Operations",
  "Product",
  "Sales",
  "Data",
  "Other",
];

const EditEmployeeModal = ({
  isOpen,
  employee,
  onClose,
  onSave,
}: EditEmployeeModalProps) => {
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("Employee");
  const [editDepartment, setEditDepartment] = useState("");
  const [editCustomLimit, setEditCustomLimit] = useState("");
  const [editLimitFrequency, setEditLimitFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [hasNoLimit, setHasNoLimit] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (!employee) return;

    setEditName(employee.name);
    setEditEmail(employee.email);
    setEditRole(employee.role);
    setEditDepartment(employee.department);
    setHasNoLimit(employee.cardLimit === null);
    setEditCustomLimit(employee.cardLimit === null ? "" : String(employee.cardLimit));
    setEditLimitFrequency(employee.cardLimitFrequency ?? "monthly");
    setEditError("");
  }, [employee]);

  if (!isOpen || !employee) return null;

  const handleClose = () => {
    setEditError("");
    onClose();
  };

  const handleSaveEmployee = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditError("");

    const name = editName.trim();
    const email = editEmail.trim().toLowerCase();

    if (!name) {
      setEditError("Please enter the employee's full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEditError("Enter a valid work email address.");
      return;
    }

    let cardLimit: number | null;
    if (hasNoLimit) {
      cardLimit = null;
    } else {
      const parsedLimit = Number(editCustomLimit);
      if (!editCustomLimit.trim() || !Number.isFinite(parsedLimit) || parsedLimit <= 0) {
        setEditError("Enter a spending limit greater than $0.");
        return;
      }
      cardLimit = parsedLimit;
    }

    onSave({
      ...employee,
      name,
      email,
      role: editRole,
      department: editDepartment,
      cardLimit,
      cardLimitFrequency: editLimitFrequency,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 top-17.5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-employee-title"
        className="my-auto w-full max-w-lg rounded-xl border border-black/10 bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="edit-employee-title" className="text-lg font-semibold text-slate-900">
              Edit employee
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update employee details and monthly card limit.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close edit employee form"
            onClick={handleClose}
            className="cursor-pointer rounded-md px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSaveEmployee} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-name" className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="edit-name"
              type="text"
              autoComplete="name"
              required
              value={editName}
              onChange={(event) => {
                setEditName(event.target.value);
                setEditError("");
              }}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-email" className="text-sm font-medium text-slate-700">
              Work email
            </label>
            <input
              id="edit-email"
              type="email"
              autoComplete="email"
              required
              value={editEmail}
              onChange={(event) => {
                setEditEmail(event.target.value);
                setEditError("");
              }}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-role" className="text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                id="edit-role"
                value={editRole}
                onChange={(event) => setEditRole(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="edit-department" className="text-sm font-medium text-slate-700">
                Department
              </label>
              <select
                id="edit-department"
                value={editDepartment}
                onChange={(event) => setEditDepartment(event.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10"
              >
                <option value="">Not assigned</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Spending limit</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Set a spending amount and choose how often the limit resets.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-custom-limit" className="text-sm font-medium text-slate-700">
                  Limit amount ($)
                </label>
                <input
                  id="edit-custom-limit"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  disabled={hasNoLimit}
                  required={!hasNoLimit}
                  value={editCustomLimit}
                  onChange={(event) => {
                    setEditCustomLimit(event.target.value);
                    setEditError("");
                  }}
                  placeholder="e.g. 1,000"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="edit-limit-frequency" className="text-sm font-medium text-slate-700">
                  Reset frequency
                </label>
                <select
                  id="edit-limit-frequency"
                  value={editLimitFrequency}
                  disabled={hasNoLimit}
                  onChange={(event) => setEditLimitFrequency(event.target.value as "daily" | "weekly" | "monthly" | "yearly")}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
              <input
                type="checkbox"
                checked={hasNoLimit}
                onChange={(event) => {
                  setHasNoLimit(event.target.checked);
                  setEditError("");
                }}
                className="mt-0.5 h-4 w-4 accent-[#26382f]"
              />
              <span>
                <span className="block text-sm font-medium text-slate-800">No spending limit</span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                  Allow spending without a set dollar cap.
                </span>
              </span>
            </label>
          </div>

          {editError && (
            <p role="alert" className="text-sm text-red-600">
              {editError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-md bg-[#26382f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#344a3e] focus:outline-none focus:ring-2 focus:ring-[#26382f]/30"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;