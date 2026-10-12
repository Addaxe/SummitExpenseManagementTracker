import { useState, type FormEvent } from "react";
export interface NewEmployee {
  name: string;
  email: string;
  role: string;
  department: string;
  cardLimit: number | null;
  cardLimitFrequency: "daily" | "weekly" | "monthly" | "yearly";
}
interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (employee: NewEmployee) => void;
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
const InviteEmployeeModal = ({
  isOpen,
  onClose,
  onInvite,
}: InviteEmployeeModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [department, setDepartment] = useState("");
  const [customLimit, setCustomLimit] = useState("1000");
  const [limitFrequency, setLimitFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [hasNoLimit, setHasNoLimit] = useState(false);
  const [error, setError] = useState("");
  if (!isOpen) {
    return null;
  }
  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("Employee");
    setDepartment("");
    setCustomLimit("1000");
    setLimitFrequency("monthly");
    setHasNoLimit(false);
    setError("");
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!trimmedName) {
      setError("Please enter the employee's full name.");
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    let cardLimit: number | null = null;
    if (!hasNoLimit) {
      cardLimit = Number(customLimit);
      if (!customLimit.trim() || !Number.isFinite(cardLimit) || cardLimit <= 0) {
        setError("Enter a valid spending limit greater than zero, or select no spending limit.");
        return;
      }
    }
    onInvite({
      name: trimmedName,
      email: normalizedEmail,
      role,
      department,
      cardLimit,
      cardLimitFrequency: limitFrequency,
    });
    resetForm();
    onClose();
  };
  const inputClassName =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/15";
  const labelClassName =
    "mb-1.5 block text-sm font-medium text-gray-700";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 top-17.5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <section
        aria-labelledby="invite-employee-title"
        aria-modal="true"
        className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2
              className="text-xl font-semibold text-[#26382f]"
              id="invite-employee-title"
            >
              Invite employee
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a team member to your Summit workspace.
            </p>
          </div>
          <button
            aria-label="Close invite modal"
            className="rounded-lg px-2 py-1 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            onClick={handleClose}
            type="button"
          >
            ×
          </button>
        </div>
        <form className="space-y-4 px-6 py-5" onSubmit={handleSubmit}>
          <div>
            <label className={labelClassName} htmlFor="invite-name">
              Full name
            </label>
            <input
              autoComplete="name"
              className={inputClassName}
              id="invite-name"
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Jane Doe"
              required
              value={name}
            />
          </div>
          <div>
            <label className={labelClassName} htmlFor="invite-email">
              Work email
            </label>
            <input
              autoComplete="email"
              className={inputClassName}
              id="invite-email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@company.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="invite-role">
                Role
              </label>
              <select
                className={inputClassName}
                id="invite-role"
                onChange={(event) => setRole(event.target.value)}
                value={role}
              >
                {roles.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClassName} htmlFor="invite-department">
                Department
              </label>
              <select
                className={inputClassName}
                id="invite-department"
                onChange={(event) => setDepartment(event.target.value)}
                value={department}
              >
                <option value="">Not assigned</option>
                {departments.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <fieldset className="space-y-2">
            <legend className={labelClassName}>Spending limit</legend>
            <p className="text-xs leading-5 text-gray-500">
              Set how much this employee can spend before the limit resets.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClassName} htmlFor="invite-custom-limit">
                  Limit amount ($)
                </label>
                <input
                  className={inputClassName}
                  disabled={hasNoLimit}
                  id="invite-custom-limit"
                  min="0.01"
                  onChange={(event) => setCustomLimit(event.target.value)}
                  placeholder="Enter amount"
                  step="0.01"
                  type="number"
                  value={customLimit}
                />
              </div>
              <div>
                <label className={labelClassName} htmlFor="invite-limit-frequency">
                  Reset frequency
                </label>
                <select
                  className={inputClassName}
                  disabled={hasNoLimit}
                  id="invite-limit-frequency"
                  onChange={(event) =>
                    setLimitFrequency(event.target.value as typeof limitFrequency)
                  }
                  value={limitFrequency}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-3 py-3 transition hover:border-[#26382f]/50">
              <input
                checked={hasNoLimit}
                className="mt-1 accent-[#26382f]"
                onChange={(event) => setHasNoLimit(event.target.checked)}
                type="checkbox"
              />
              <span>
                <span className="block text-sm font-medium text-gray-800">
                  No spending limit
                </span>
                <span className="mt-1 block text-xs leading-5 text-gray-500">
                  This employee will not have a spending cap assigned in Summit.
                </span>
              </span>
            </label>
          </fieldset>
          {error && (
            <p
              aria-live="polite"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              onClick={handleClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-[#26382f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#344b3e] focus:outline-none focus:ring-2 focus:ring-[#26382f]/40 focus:ring-offset-2"
              type="submit"
            >
              Send invitation
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
export default InviteEmployeeModal;