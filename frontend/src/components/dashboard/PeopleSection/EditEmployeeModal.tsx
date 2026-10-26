
import { useEffect, useState, type FormEvent } from "react";

export interface EmployeeSpendingLimit {
  category: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
}

export interface EditableEmployee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  spendingLimits: EmployeeSpendingLimit[];
  status: string;
}

interface EditEmployeeModalProps {
  isOpen: boolean;
  employee: EditableEmployee | null;
  onClose: () => void;
  onSave: (employee: EditableEmployee) => void;
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

const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/15 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

const labelClassName =
  "mb-1.5 block text-sm font-medium text-gray-700";

const createLimitForm = (
  limits: EmployeeSpendingLimit[] = []
): SpendingLimitForm[] =>
  limits.map((limit) => ({
    id: crypto.randomUUID(),
    category: limit.category,
    amount: String(limit.amount),
    frequency: limit.frequency,
  }));

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
  const [spendingLimits, setSpendingLimits] =
    useState<SpendingLimitForm[]>([]);
  const [hasNoLimit, setHasNoLimit] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (!employee || !isOpen) return;

    setEditName(employee.name);
    setEditEmail(employee.email);
    setEditRole(employee.role);
    setEditDepartment(employee.department);
    setSpendingLimits(createLimitForm(employee.spendingLimits));
    setHasNoLimit(employee.spendingLimits.length === 0);
    setEditError("");
  }, [employee, isOpen]);

  if (!isOpen || !employee) return null;

  const handleClose = () => {
    setEditError("");
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
    setHasNoLimit(false);
    setEditError("");
  };

  const removeSpendingLimit = (id: string) => {
    setSpendingLimits((current) =>
      current.filter((limit) => limit.id !== id)
    );
    setEditError("");
  };

  const updateSpendingLimit = (
    id: string,
    field: "category" | "amount" | "frequency",
    value: string
  ) => {
    setSpendingLimits((current) =>
      current.map((limit) =>
        limit.id === id ? { ...limit, [field]: value } : limit
      )
    );
    setEditError("");
  };

  const handleSaveEmployee = (
    event: FormEvent<HTMLFormElement>
  ) => {
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

    let parsedLimits: EmployeeSpendingLimit[] = [];

    if (!hasNoLimit) {
      if (spendingLimits.length === 0) {
        setEditError(
          "Add at least one spending category or select no spending limit."
        );
        return;
      }

      if (spendingLimits.some((limit) => !limit.category)) {
        setEditError(
          "Select a category for each spending limit."
        );
        return;
      }

      const selectedCategories = spendingLimits.map((limit) =>
        limit.category.trim().toLowerCase()
      );

      if (
        new Set(selectedCategories).size !==
        selectedCategories.length
      ) {
        setEditError(
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
        setEditError(
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

    onSave({
      ...employee,
      name,
      email,
      role: editRole,
      department: editDepartment,
      spendingLimits: parsedLimits,
    });

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-employee-title"
        className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2
              id="edit-employee-title"
              className="text-xl font-semibold text-[#26382f]"
            >
              Edit employee
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update employee details and card spending limits.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close edit employee modal"
            onClick={handleClose}
            className="rounded-lg px-2 py-1 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSaveEmployee}
          className="space-y-5 px-6 py-5"
        >
          <div>
            <label htmlFor="edit-name" className={labelClassName}>
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
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="edit-email" className={labelClassName}>
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
              className={inputClassName}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-role" className={labelClassName}>
                Role
              </label>
              <select
                id="edit-role"
                value={editRole}
                onChange={(event) => setEditRole(event.target.value)}
                className={inputClassName}
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
                htmlFor="edit-department"
                className={labelClassName}
              >
                Department
              </label>
              <select
                id="edit-department"
                value={editDepartment}
                onChange={(event) =>
                  setEditDepartment(event.target.value)
                }
                className={inputClassName}
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

          <fieldset className="space-y-4 border-t border-gray-200 pt-4">
            <div>
              <legend className="text-sm font-medium text-gray-800">
                Card spending categories
              </legend>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Manage the spending limits assigned to this
                employee's card. Each category has its own amount
                and reset frequency.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 px-3 py-3 transition hover:border-[#26382f]/50">
              <input
                type="checkbox"
                checked={hasNoLimit}
                onChange={(event) => {
                  setHasNoLimit(event.target.checked);
                  setEditError("");
                }}
                className="mt-1 accent-[#26382f]"
              />
              <span>
                <span className="block text-sm font-medium text-gray-800">
                  No spending limits
                </span>
                <span className="mt-1 block text-xs leading-5 text-gray-500">
                  Remove all category spending limits from this
                  employee's card.
                </span>
              </span>
            </label>

            {!hasNoLimit && (
              <>
                {spendingLimits.map((limit, index) => (
                  <div
                    key={limit.id}
                    className="space-y-3 rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-gray-800">
                        Category {index + 1}
                      </span>

                      <button
                        type="button"
                        aria-label={`Remove category ${index + 1}`}
                        onClick={() => removeSpendingLimit(limit.id)}
                        className="text-sm font-medium text-red-600 transition hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label
                        htmlFor={`edit-category-${limit.id}`}
                        className={labelClassName}
                      >
                        Category
                      </label>
                      <select
                        id={`edit-category-${limit.id}`}
                        value={limit.category}
                        required
                        onChange={(event) =>
                          updateSpendingLimit(
                            limit.id,
                            "category",
                            event.target.value
                          )
                        }
                        className={inputClassName}
                      >
                        <option value="">Select a category</option>
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
                          htmlFor={`edit-amount-${limit.id}`}
                          className={labelClassName}
                        >
                          Limit amount ($)
                        </label>
                        <input
                          id={`edit-amount-${limit.id}`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          inputMode="decimal"
                          required
                          value={limit.amount}
                          onChange={(event) =>
                            updateSpendingLimit(
                              limit.id,
                              "amount",
                              event.target.value
                            )
                          }
                          placeholder="Enter amount"
                          className={inputClassName}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`edit-frequency-${limit.id}`}
                          className={labelClassName}
                        >
                          Reset frequency
                        </label>
                        <select
                          id={`edit-frequency-${limit.id}`}
                          value={limit.frequency}
                          onChange={(event) =>
                            updateSpendingLimit(
                              limit.id,
                              "frequency",
                              event.target.value
                            )
                          }
                          className={inputClassName}
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
                  type="button"
                  onClick={addSpendingLimit}
                  className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-[#26382f] transition hover:border-[#26382f] hover:bg-gray-50"
                >
                  + Add category
                </button>
              </>
            )}
          </fieldset>

          {editError && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {editError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#26382f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#344b3e] focus:outline-none focus:ring-2 focus:ring-[#26382f]/40 focus:ring-offset-2"
            >
              Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default EditEmployeeModal;