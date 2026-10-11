import { useState, useEffect, type FormEvent } from "react";
import {
  useTable,
  createColumnHelper,
  flexRender,
  stockFeatures,
} from "@tanstack/react-table";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  cardLimit: number | null;
  status: "Active" | "Pending";
}

type LimitMode = "default" | "custom" | "none";

const DEFAULT_CARD_LIMIT = 1000;

const features = stockFeatures;

const columnHelper = createColumnHelper<typeof features, Employee>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Employee",
    cell: (info) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium text-slate-900">
          {info.getValue()}
        </span>
        <span className="text-xs text-slate-500">
          {info.row.original.email}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => (
      <span className="text-slate-600">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("cardLimit", {
    header: "Monthly card limit",
    cell: (info) => {
      const limit = info.getValue();

      return limit === null ? (
        <span className="text-slate-400">Not assigned</span>
      ) : (
        <span className="font-medium tabular-nums text-slate-800">
          {limit.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          })}
          <span className="ml-1 text-xs font-normal text-slate-500">
            / month
          </span>
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const isActive = info.getValue() === "Active";

      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              isActive ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {info.getValue()}
        </span>
      );
    },
  }),
]);

const mockDatabase: Record<number, Employee[]> = {
  1: [
    {
      id: "e1",
      name: "Jane Doe",
      email: "jane@company.com",
      role: "Admin",
      cardLimit: 3000,
      status: "Active",
    },
    {
      id: "e2",
      name: "Alex Smith",
      email: "alex@company.com",
      role: "Product Designer",
      cardLimit: 1000,
      status: "Active",
    },
    {
      id: "e3",
      name: "Carlos Ray",
      email: "carlos@company.com",
      role: "Financial Analyst",
      cardLimit: 1500,
      status: "Active",
    },
  ],
  2: [
    {
      id: "e4",
      name: "Sarah Jenkins",
      email: "sarah@company.com",
      role: "Frontend Engineer",
      cardLimit: 1000,
      status: "Active",
    },
    {
      id: "e5",
      name: "Michael Chang",
      email: "michael@company.com",
      role: "HR Manager",
      cardLimit: 2500,
      status: "Pending",
    },
    {
      id: "e6",
      name: "Emily Watson",
      email: "emily@company.com",
      role: "Data Scientist",
      cardLimit: null,
      status: "Pending",
    },
  ],
};

const initialEmployees = Object.values(mockDatabase).flat();

const PeopleSection = () => {
  const [employees, setEmployees] = useState<Employee[]>(
    initialEmployees
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Responsive pagination
  const [pageSize, setPageSize] = useState<number>(
    window.innerWidth < 640 ? 5 : 10
  );

  // Employee filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [cardLimitFilter, setCardLimitFilter] =
    useState<string>("All");

  // Employee edits
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
  const [editLimitMode, setEditLimitMode] = useState<LimitMode>("default");
  const [editCustomLimit, setEditCustomLimit] = useState<string>("1000");
  const [editLimitError, setEditLimitError] = useState<string>("");
  const editingEmployee = employees.find((employee) => employee.id === editingEmployeeId) ?? null;

  // Invitation form
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteRole, setInviteRole] = useState<string>("Employee");
  const [limitMode, setLimitMode] = useState<LimitMode>("default");
  const [customLimit, setCustomLimit] = useState<string>("1000");
  const [inviteError, setInviteError] = useState<string>("");

  // Update the page size when switching between mobile and desktop.
  useEffect(() => {
    const updatePageSize = () => {
      setPageSize(window.innerWidth < 640 ? 5 : 10);
    };

    window.addEventListener("resize", updatePageSize);

    return () => {
      window.removeEventListener("resize", updatePageSize);
    };
  }, []);

  // Filter employees before applying pagination.
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query);

    const matchesRole =
      roleFilter === "All" || employee.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" || employee.status === statusFilter;

    const matchesCardLimit =
      cardLimitFilter === "All" ||
      (cardLimitFilter === "Assigned" &&
        employee.cardLimit !== null) ||
      (cardLimitFilter === "None" && employee.cardLimit === null);

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus &&
      matchesCardLimit
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize)
  );

  // Keep the current page valid when filters or page size change.
  useEffect(() => {
    setCurrentPage((previousPage) =>
      Math.min(previousPage, totalPages)
    );
  }, [totalPages]);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [currentPage]);

  const clearFilters = (): void => {
    setSearchQuery("");
    setRoleFilter("All");
    setStatusFilter("All");
    setCardLimitFilter("All");
    setCurrentPage(1);
  };

  const openEditLimit = (employee: Employee): void => {
  setEditingEmployeeId(employee.id);

  if (employee.cardLimit === null) {
    setEditLimitMode("none");
    setEditCustomLimit(String(DEFAULT_CARD_LIMIT));
  } else if (employee.cardLimit === DEFAULT_CARD_LIMIT) {
    setEditLimitMode("default");
    setEditCustomLimit(String(employee.cardLimit));
  } else {
    setEditLimitMode("custom");
    setEditCustomLimit(String(employee.cardLimit));
  }

  setEditLimitError("");
  };

  const handleSaveCardLimit = (
    event: FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();

    if (!editingEmployee) return;

    let nextLimit: number | null = null;

    if (editLimitMode === "default") {
      nextLimit = DEFAULT_CARD_LIMIT;
    } else if (editLimitMode === "custom") {
      const parsedLimit = Number(editCustomLimit);

      if (
        editCustomLimit.trim() === "" ||
        !Number.isFinite(parsedLimit) ||
        parsedLimit <= 0
      ) {
        setEditLimitError(
          "Enter a valid monthly limit greater than $0."
        );
        return;
      }

      nextLimit = parsedLimit;
    }

    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === editingEmployee.id
          ? { ...employee, cardLimit: nextLimit }
          : employee
      )
    );

    setEditingEmployeeId(null);
    setEditLimitError("");
  };

  const resetInviteForm = (): void => {
    setInviteEmail("");
    setInviteRole("Employee");
    setLimitMode("default");
    setCustomLimit(String(DEFAULT_CARD_LIMIT));
    setInviteError("");
  };

  const handleCloseInvite = (): void => {
    setIsInviteOpen(false);
    resetInviteForm();
  };

  const handleInviteEmployee = (
    event: FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();

    const email = inviteEmail.trim().toLowerCase();

    const alreadyExists = employees.some(
      (employee) => employee.email.toLowerCase() === email
    );

    if (alreadyExists) {
      setInviteError(
        "This email is already on your employee list."
      );
      return;
    }

    let cardLimit: number | null = null;

    if (limitMode === "default") {
      cardLimit = DEFAULT_CARD_LIMIT;
    } else if (limitMode === "custom") {
      const parsedLimit = Number(customLimit);

      if (
        customLimit.trim() === "" ||
        !Number.isFinite(parsedLimit) ||
        parsedLimit <= 0
      ) {
        setInviteError(
          "Enter a valid monthly limit greater than $0."
        );
        return;
      }

      cardLimit = parsedLimit;
    }

    const newEmployee: Employee = {
      id: crypto.randomUUID(),
      name: email,
      email,
      role: inviteRole,
      cardLimit,
      status: "Pending",
    };

    const updatedEmployeeCount = employees.length + 1;
    const lastPage = Math.ceil(updatedEmployeeCount / pageSize);

    setEmployees((previousEmployees) => [
      ...previousEmployees,
      newEmployee,
    ]);

    // Clear active filters so the newly invited employee is visible.
    setSearchQuery("");
    setRoleFilter("All");
    setStatusFilter("All");
    setCardLimitFilter("All");
    setCurrentPage(lastPage);

    setIsInviteOpen(false);
    resetInviteForm();
  };

  const startPageIndex = (currentPage - 1) * pageSize;

  const currentPageEmployees = filteredEmployees.slice(
    startPageIndex,
    startPageIndex + pageSize
  );

  const table = useTable({
    features,
    data: currentPageEmployees,
    columns,
    getRowId: (row: Employee) => row.id,
  });

  return (
    <section
      id="People"
      className="flex h-full w-full flex-col gap-5"
    >
      <div className="flex h-full flex-col justify-between overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              People
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage employees, invitations, and card limits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#26382f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#344a3e] focus:outline-none focus:ring-2 focus:ring-[#26382f]/30"
          >
            <span className="text-lg leading-none">+</span>
            Invite employee
          </button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="relative w-full sm:max-w-sm">
            <label
              htmlFor="employee-search"
              className="sr-only"
            >
              Search employees
            </label>

            <input
              id="employee-search"
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name or email..."
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="role-filter"
                className="text-xs font-medium text-slate-500"
              >
                Role
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) => {
                  setRoleFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10 sm:w-auto"
              >
                <option value="All">All roles</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
                <option value="Manager">Manager</option>
                <option value="Product Designer">
                  Product Designer
                </option>
                <option value="Financial Analyst">
                  Financial Analyst
                </option>
                <option value="Frontend Engineer">
                  Frontend Engineer
                </option>
                <option value="HR Manager">HR Manager</option>
                <option value="Data Scientist">
                  Data Scientist
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="status-filter"
                className="text-xs font-medium text-slate-500"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10 sm:w-auto"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="card-limit-filter"
                className="text-xs font-medium text-slate-500"
              >
                Card limit
              </label>
              <select
                id="card-limit-filter"
                value={cardLimitFilter}
                onChange={(event) => {
                  setCardLimitFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10 sm:w-auto"
              >
                <option value="All">All card limits</option>
                <option value="Assigned">Card assigned</option>
                <option value="None">No card assigned</option>
              </select>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="self-start rounded-md px-3 py-2 text-sm font-medium text-[#26382f] transition hover:bg-slate-100 sm:mt-5"
            >
              Clear filters
            </button>
          </div>

          <p aria-live="polite" className="text-xs text-slate-500">
            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredEmployees.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {employees.length}
            </span>{" "}
            employees
          </p>
        </div>

        {/* Employee table */}
        <div className="min-h-55 w-full flex-1 overflow-x-auto">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center text-sm text-slate-400">
              Loading employees...
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-3">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No employees match your filters.
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="ml-1 font-medium text-[#26382f] underline underline-offset-2 hover:text-[#344a3e]"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-slate-50/50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap px-6 py-4 text-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}

                            {cell.column.id === "cardLimit" && (
                              <button
                                type="button"
                                onClick={() => openEditLimit(row.original)}
                                aria-label={`Edit card limit for ${row.original.name}`}
                                className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-[#26382f] transition hover:bg-slate-100"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-xs text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-800">
              {currentPage}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">
              {totalPages}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((previousPage) =>
                  Math.max(previousPage - 1, 1)
                )
              }
              disabled={currentPage === 1 || isLoading}
              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((previousPage) =>
                  Math.min(previousPage + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages || isLoading}
              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Invite employee modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 pt-20">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
            className="my-auto w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="invite-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Invite an employee
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add a team member to your Summit workspace.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close invitation form"
                onClick={handleCloseInvite}
                className="cursor-pointer rounded-md px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleInviteEmployee}
              className="flex flex-col gap-5"
            >
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="invite-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Work email
                </label>

                <input
                  id="invite-email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  required
                  value={inviteEmail}
                  onChange={(event) => {
                    setInviteEmail(event.target.value);
                    setInviteError("");
                  }}
                  placeholder="employee@company.com"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="invite-role"
                  className="text-sm font-medium text-slate-700"
                >
                  Role
                </label>

                <select
                  id="invite-role"
                  value={inviteRole}
                  onChange={(event) =>
                    setInviteRole(event.target.value)
                  }
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Monthly card limit */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Monthly card limit
                  </label>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Choose a spending allowance for this employee.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                    <input
                      type="radio"
                      name="limit-mode"
                      value="default"
                      checked={limitMode === "default"}
                      onChange={() => setLimitMode("default")}
                      className="mt-0.5 accent-[#26382f]"
                    />
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-medium text-slate-800">
                        Use default limit
                      </span>
                      <span className="text-xs text-slate-500">
                        ${DEFAULT_CARD_LIMIT.toLocaleString("en-US")} per month
                      </span>
                    </span>
                    {limitMode === "default" && (
                      <span className="text-xs font-medium text-emerald-700">
                        Default
                      </span>
                    )}
                  </label>

                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                    <input
                      type="radio"
                      name="limit-mode"
                      value="custom"
                      checked={limitMode === "custom"}
                      onChange={() => setLimitMode("custom")}
                      className="mt-0.5 accent-[#26382f]"
                    />
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-medium text-slate-800">
                        Set a custom limit
                      </span>
                      <span className="text-xs text-slate-500">
                        Choose a different monthly amount.
                      </span>
                    </span>
                  </label>

                  {limitMode === "custom" && (
                    <div className="flex flex-col gap-1.5 pl-7">
                      <label
                        htmlFor="custom-card-limit"
                        className="text-sm font-medium text-slate-700"
                      >
                        Custom amount (USD)
                      </label>

                      <div className="flex items-center rounded-md border border-slate-200 focus-within:border-[#26382f] focus-within:ring-2 focus-within:ring-[#26382f]/10">
                        <span className="pl-3 text-sm text-slate-500">
                          $
                        </span>
                        <input
                          id="custom-card-limit"
                          type="number"
                          min="0.01"
                          step="0.01"
                          required
                          value={customLimit}
                          onChange={(event) => {
                            setCustomLimit(event.target.value);
                            setInviteError("");
                          }}
                          placeholder="1000.00"
                          className="w-full rounded-md bg-transparent px-2 py-2 text-sm text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                    <input
                      type="radio"
                      name="limit-mode"
                      value="none"
                      checked={limitMode === "none"}
                      onChange={() => setLimitMode("none")}
                      className="mt-0.5 accent-[#26382f]"
                    />
                    <span className="flex flex-1 flex-col gap-1">
                      <span className="text-sm font-medium text-slate-800">
                        No card assigned yet
                      </span>
                      <span className="text-xs text-slate-500">
                        Invite the employee without assigning a card limit.
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Pending status explanation */}
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 size-2 shrink-0 rounded-full bg-amber-500" />
                  <p className="text-xs leading-5 text-slate-600">
                    The employee will be marked Pending until they
                    complete account setup and create their password.
                    The selected limit is a proposed setting, not an
                    active card authorization.
                  </p>
                </div>
              </div>

              {inviteError && (
                <p role="alert" className="text-sm text-red-600">
                  {inviteError}
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleCloseInvite}
                  className="cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-[#26382f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#344a3e] focus:outline-none focus:ring-2 focus:ring-[#26382f]/30"
                >
                  Send invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit card limit modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 pt-20">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-limit-title"
            className="my-auto w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-xl"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="edit-limit-title"
                  className="text-lg font-semibold text-slate-900"
                >
                  Edit card limit
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the monthly spending limit for{" "}
                  {editingEmployee.name}.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close edit card limit form"
                onClick={() => setEditingEmployeeId(null)}
                className="cursor-pointer rounded-md px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSaveCardLimit}
              className="flex flex-col gap-4"
            >
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                <input
                  type="radio"
                  name="edit-limit-mode"
                  checked={editLimitMode === "default"}
                  onChange={() => setEditLimitMode("default")}
                  className="mt-0.5 accent-[#26382f]"
                />
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-800">
                    Use default limit
                  </span>
                  <span className="text-xs text-slate-500">
                    ${DEFAULT_CARD_LIMIT.toLocaleString("en-US")} per month
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                <input
                  type="radio"
                  name="edit-limit-mode"
                  checked={editLimitMode === "custom"}
                  onChange={() => setEditLimitMode("custom")}
                  className="mt-0.5 accent-[#26382f]"
                />
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-800">
                    Set a custom limit
                  </span>
                  <span className="text-xs text-slate-500">
                    Choose a different monthly amount.
                  </span>
                </span>
              </label>

              {editLimitMode === "custom" && (
                <div className="flex flex-col gap-1.5 pl-7">
                  <label
                    htmlFor="edit-custom-limit"
                    className="text-sm font-medium text-slate-700"
                  >
                    Custom amount (USD)
                  </label>

                  <div className="flex items-center rounded-md border border-slate-200 focus-within:border-[#26382f] focus-within:ring-2 focus-within:ring-[#26382f]/10">
                    <span className="pl-3 text-sm text-slate-500">
                      $
                    </span>
                    <input
                      id="edit-custom-limit"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={editCustomLimit}
                      onChange={(event) => {
                        setEditCustomLimit(event.target.value);
                        setEditLimitError("");
                      }}
                      className="w-full rounded-md bg-transparent px-2 py-2 text-sm text-slate-900 outline-none"
                    />
                  </div>
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                <input
                  type="radio"
                  name="edit-limit-mode"
                  checked={editLimitMode === "none"}
                  onChange={() => setEditLimitMode("none")}
                  className="mt-0.5 accent-[#26382f]"
                />
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-800">
                    Remove card limit
                  </span>
                  <span className="text-xs text-slate-500">
                    Display the employee's limit as Not assigned.
                  </span>
                </span>
              </label>

              {editLimitError && (
                <p role="alert" className="text-sm text-red-600">
                  {editLimitError}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingEmployeeId(null)}
                  className="cursor-pointer rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-[#26382f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#344a3e] focus:outline-none focus:ring-2 focus:ring-[#26382f]/30"
                >
                  Save limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PeopleSection;