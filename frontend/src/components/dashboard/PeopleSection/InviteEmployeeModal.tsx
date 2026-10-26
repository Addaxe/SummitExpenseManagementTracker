
import { useState, type FormEvent } from "react";

export interface EmployeeSpendingLimit {
  category: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
}

export interface NewEmployee {
  name: string;
  email: string;
  role: string;
  department: string;
  spendingLimits: EmployeeSpendingLimit[];
}

interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (employee: NewEmployee) => void;
}

interface SpendingLimitForm {
  id: string;
  category: string;
  amount: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
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

const categories = [
  "Meals",
  "Travel",
  "Software",
  "Office Supplies",
  "Transportation",
  "Entertainment",
  "Equipment",
  "Other",
];

const createDefaultLimits = (): SpendingLimitForm[] => [
  {
    id: crypto.randomUUID(),
    category: "Meals",
    amount: "300",
    frequency: "monthly",
  },
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
  const [spendingLimits, setSpendingLimits] =
    useState<SpendingLimitForm[]>(createDefaultLimits);
  const [hasNoLimit, setHasNoLimit] = useState(false);
  const [error, setError] = useState("");

  const inputClassName =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

  const labelClassName =
    "mb-1.5 block text-sm font-medium text-gray-700";

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("Employee");
    setDepartment("");
    setSpendingLimits(createDefaultLimits());
    setHasNoLimit(false);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addSpendingLimit = () => {
    setSpendingLimits((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        category: "",
        amount: "",
        frequency: "monthly",
      },
    ]);
    setError("");
  };

  const removeSpendingLimit = (id: string) => {
    setSpendingLimits((current) =>
      current.filter((limit) => limit.id !== id)
    );
    setError("");
  };

  const updateSpendingLimit = (
    id: string,
    field: "category" | "amount" | "frequency",
    value: string
  ) => {
    setSpendingLimits((current) =>
      current.map((limit) =>
        limit.id === id
          ? { ...limit, [field]: value }
          : limit
      )
    );

    setError("");
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

    let parsedLimits: EmployeeSpendingLimit[] = [];

    if (!hasNoLimit) {
      if (spendingLimits.length === 0) {
        setError(
          "Add at least one spending category or select no spending limit."
        );
        return;
      }

      if (spendingLimits.some((limit) => !limit.category)) {
        setError("Select a category for each spending limit.");
        return;
      }

      const selectedCategories = spendingLimits.map((limit) =>
        limit.category.trim().toLowerCase()
      );

      if (
        new Set(selectedCategories).size !==
        selectedCategories.length
      ) {
        setError(
          "Each spending category can only be added once."
        );
        return;
      }

      const hasInvalidAmount = spendingLimits.some((limit) => {
        const amount = Number(limit.amount);

        return (
          !limit.amount.trim() ||
          !Number.isFinite(amount) ||
          amount <= 0
        );
      });

      if (hasInvalidAmount) {
        setError(
          "Each spending limit must be greater than zero."
        );
        return;
      }

      parsedLimits = spendingLimits.map((limit) => ({
        category: limit.category,
        amount: Number(limit.amount),
        frequency: limit.frequency,
      }));
    }

    onInvite({
      name: trimmedName,
      email: normalizedEmail,
      role,
      department,
      spendingLimits: parsedLimits,
    });

    resetForm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 top-17.5 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
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

        <form
          className="space-y-5 px-6 py-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className={labelClassName}
              htmlFor="invite-name"
            >
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
            <label
              className={labelClassName}
              htmlFor="invite-email"
            >
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
              <label
                className={labelClassName}
                htmlFor="invite-role"
              >
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
              <label
                className={labelClassName}
                htmlFor="invite-department"
              >
                Department
              </label>

              <select
                className={inputClassName}
                id="invite-department"
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
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

          <fieldset className="space-y-4">
            <div>
              <legend className={labelClassName}>
                Spending categories
              </legend>

              <p className="text-xs leading-5 text-gray-500">
                Set a separate spending limit and reset frequency
                for each category.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-3 py-3 transition hover:border-[#26382f]/50">
              <input
                checked={hasNoLimit}
                className="mt-1 accent-[#26382f]"
                onChange={(event) => {
                  setHasNoLimit(event.target.checked);
                  setError("");
                }}
                type="checkbox"
              />

              <span>
                <span className="block text-sm font-medium text-gray-800">
                  No spending limits
                </span>

                <span className="mt-1 block text-xs leading-5 text-gray-500">
                  Do not assign category spending limits to this
                  employee.
                </span>
              </span>
            </label>

            {!hasNoLimit && (
              <>
                {spendingLimits.map((limit, index) => (
                  <div
                    className="space-y-3 rounded-xl border border-gray-200 p-4"
                    key={limit.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-gray-800">
                        Category {index + 1}
                      </span>

                      <button
                        aria-label={`Remove category ${index + 1}`}
                        className="text-sm font-medium text-red-600 transition hover:text-red-700"
                        onClick={() =>
                          removeSpendingLimit(limit.id)
                        }
                        type="button"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label
                        className={labelClassName}
                        htmlFor={`category-${limit.id}`}
                      >
                        Category
                      </label>

                      <select
                        className={inputClassName}
                        id={`category-${limit.id}`}
                        onChange={(event) =>
                          updateSpendingLimit(
                            limit.id,
                            "category",
                            event.target.value
                          )
                        }
                        required
                        value={limit.category}
                      >
                        <option value="">
                          Select a category
                        </option>

                        {categories.map((option) => (
                          <option
                            key={option}
                            value={option}
                            disabled={spendingLimits.some(
                              (other) =>
                                other.id !== limit.id &&
                                other.category === option
                            )}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label
                          className={labelClassName}
                          htmlFor={`amount-${limit.id}`}
                        >
                          Limit amount ($)
                        </label>

                        <input
                          className={inputClassName}
                          id={`amount-${limit.id}`}
                          min="0.01"
                          onChange={(event) =>
                            updateSpendingLimit(
                              limit.id,
                              "amount",
                              event.target.value
                            )
                          }
                          placeholder="Enter amount"
                          required
                          step="0.01"
                          type="number"
                          value={limit.amount}
                        />
                      </div>

                      <div>
                        <label
                          className={labelClassName}
                          htmlFor={`frequency-${limit.id}`}
                        >
                          Reset frequency
                        </label>

                        <select
                          className={inputClassName}
                          id={`frequency-${limit.id}`}
                          onChange={(event) =>
                            updateSpendingLimit(
                              limit.id,
                              "frequency",
                              event.target.value as SpendingLimitForm["frequency"]
                            )
                          }
                          value={limit.frequency}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-[#26382f] transition hover:border-[#26382f] hover:bg-gray-50"
                  onClick={addSpendingLimit}
                  type="button"
                >
                  + Add category
                </button>
              </>
            )}
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
