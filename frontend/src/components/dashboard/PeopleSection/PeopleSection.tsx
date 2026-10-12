import { useEffect, useState } from "react";
import InviteEmployeeModal, { type NewEmployee } from "./InviteEmployeeModal";
import EditEmployeeModal, { type EditableEmployee } from "./EditEmployeeModal";
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
  department: string;
  cardLimit: number | null;
  cardLimitFrequency?: "daily" | "weekly" | "monthly" | "yearly";
  status: "Active" | "Pending";
}


const features = stockFeatures;
const columnHelper = createColumnHelper<typeof features, Employee>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: "Employee",
    cell: (info) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium text-slate-900">{info.getValue()}</span>
        <span className="text-xs text-slate-500">{info.row.original.email}</span>
      </div>
    ),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor("department", {
    header: "Department",
    cell: (info) => (
      <span className="text-slate-600">
        {info.getValue() || "Not assigned"}
      </span>
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
          <span className="ml-1 text-xs font-normal text-slate-500">/ month</span>
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
            isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
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

const initialEmployees: Employee[] = [
  {
    id: "e1",
    name: "Jane Doe",
    email: "jane@company.com",
    role: "Admin",
    department: "Operations",
    cardLimit: 3000,
    status: "Active",
  },
  {
    id: "e2",
    name: "Alex Smith",
    email: "alex@company.com",
    role: "Product Designer",
    department: "Design",
    cardLimit: 1000,
    status: "Active",
  },
  {
    id: "e3",
    name: "Carlos Ray",
    email: "carlos@company.com",
    role: "Financial Analyst",
    department: "Finance",
    cardLimit: 1500,
    status: "Active",
  },
  {
    id: "e4",
    name: "Sarah Jenkins",
    email: "sarah@company.com",
    role: "Frontend Engineer",
    department: "Engineering",
    cardLimit: 1000,
    status: "Active",
  },
  {
    id: "e5",
    name: "Michael Chang",
    email: "michael@company.com",
    role: "HR Manager",
    department: "Human Resources",
    cardLimit: 2500,
    status: "Pending",
  },
  {
    id: "e6",
    name: "Emily Watson",
    email: "emily@company.com",
    role: "Data Scientist",
    department: "Data",
    cardLimit: null,
    status: "Pending",
  },
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

const PeopleSection = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(window.innerWidth < 640 ? 5 : 10);

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [cardLimitFilter, setCardLimitFilter] = useState("All");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  const editingEmployee =
    employees.find((employee) => employee.id === editingEmployeeId) ?? null;

  useEffect(() => {
    const updatePageSize = () => setPageSize(window.innerWidth < 640 ? 5 : 10);
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query);
    const matchesRole = roleFilter === "All" || employee.role === roleFilter;
    const matchesStatus = statusFilter === "All" || employee.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "All" || employee.department === departmentFilter;
    const matchesCardLimit =
      cardLimitFilter === "All" ||
      (cardLimitFilter === "Assigned" && employee.cardLimit !== null) ||
      (cardLimitFilter === "None" && employee.cardLimit === null);

    return (
      matchesSearch &&
      matchesRole &&
      matchesStatus &&
      matchesDepartment &&
      matchesCardLimit
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));

  useEffect(() => {
    setCurrentPage((previousPage) => Math.min(previousPage, totalPages));
  }, [totalPages]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 300);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [currentPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("All");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setCardLimitFilter("All");
    setCurrentPage(1);
  };

  const openEditEmployee = (employee: Employee) => {
    setEditingEmployeeId(employee.id);
  };

  const handleSaveEmployee = (updatedEmployee: EditableEmployee) => {
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === updatedEmployee.id
          ? {
              ...employee,
              name: updatedEmployee.name,
              email: updatedEmployee.email,
              role: updatedEmployee.role,
              department: updatedEmployee.department,
              cardLimit: updatedEmployee.cardLimit,
              cardLimitFrequency: updatedEmployee.cardLimitFrequency ?? "monthly",
            }
          : employee
      )
    );
    setEditingEmployeeId(null);
  };

  const handleInviteEmployee = (newEmployee: NewEmployee) => {
    const normalizedEmail = newEmployee.email.trim().toLowerCase();
    const emailExists = employees.some(
      (employee) => employee.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      window.alert("This email is already on your employee list.");
      return;
    }

    const employee: Employee = {
      id: crypto.randomUUID(),
      name: newEmployee.name.trim(),
      email: normalizedEmail,
      role: newEmployee.role,
      department: newEmployee.department,
      cardLimit: newEmployee.cardLimit,
      cardLimitFrequency: newEmployee.cardLimitFrequency,
      status: "Pending",
    };

    const updatedCount = employees.length + 1;
    setEmployees((previousEmployees) => [...previousEmployees, employee]);
    clearFilters();
    setCurrentPage(Math.ceil(updatedCount / pageSize));
    setIsInviteOpen(false);
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
    <section id="People" className="flex h-full w-full flex-col gap-5">
      <div className="flex h-full flex-col justify-between overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">People</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage employees, invitations, departments, and card limits.
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
            <label htmlFor="employee-search" className="sr-only">Search employees</label>
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
              <label htmlFor="role-filter" className="text-xs font-medium text-slate-500">Role</label>
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
                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="department-filter" className="text-xs font-medium text-slate-500">Department</label>
              <select
                id="department-filter"
                value={departmentFilter}
                onChange={(event) => {
                  setDepartmentFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#26382f] focus:ring-2 focus:ring-[#26382f]/10 sm:w-auto"
              >
                <option value="All">All departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="status-filter" className="text-xs font-medium text-slate-500">Status</label>
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
              <label htmlFor="card-limit-filter" className="text-xs font-medium text-slate-500">Card limit</label>
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
            Showing <span className="font-medium text-slate-700">{filteredEmployees.length}</span>
            {" "}of <span className="font-medium text-slate-700">{employees.length}</span> employees
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
                        {header.isPlaceholder ? null : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-sm text-slate-500">
                      No employees match your filters.
                      <button type="button" onClick={clearFilters} className="ml-1 font-medium text-[#26382f] underline underline-offset-2 hover:text-[#344a3e]">
                        Clear filters
                      </button>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50/50">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-slate-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-6 py-4">
                        <button
                          type="button"
                          onClick={() => openEditEmployee(row.original)}
                          aria-label={`Edit ${row.original.name}`}
                          className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-[#26382f] transition hover:bg-slate-100"
                        >
                          Edit
                        </button>
                      </td>
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
            Page <span className="font-semibold text-slate-800">{currentPage}</span>
            {" "}of <span className="font-semibold text-slate-800">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((previousPage) => Math.max(previousPage - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((previousPage) => Math.min(previousPage + 1, totalPages))}
              disabled={currentPage === totalPages || isLoading}
              className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <InviteEmployeeModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInviteEmployee}
      />

      <EditEmployeeModal
        isOpen={editingEmployeeId !== null}
        employee={editingEmployee}
        onClose={() => setEditingEmployeeId(null)}
        onSave={handleSaveEmployee}
      />
    </section>
  );
};

export default PeopleSection;