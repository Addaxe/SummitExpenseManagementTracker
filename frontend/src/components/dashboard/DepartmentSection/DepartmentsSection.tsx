import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Building2,
  Users,
  Pencil,
  Trash2,
  X,
  BriefcaseBusiness,
} from "lucide-react";

type Department = {
  id: number;
  name: string;
  description: string;
  employeeCount: number;
};

const initialDepartments: Department[] = [
  {
    id: 1,
    name: "Engineering",
    description: "Software development and technical operations.",
    employeeCount: 12,
  },
  {
    id: 2,
    name: "Finance",
    description: "Financial planning, accounting, and reporting.",
    employeeCount: 8,
  },
  {
    id: 3,
    name: "Marketing",
    description: "Brand strategy, marketing, and communications.",
    employeeCount: 5,
  },
  {
    id: 4,
    name: "Human Resources",
    description: "Recruitment, employee relations, and HR operations.",
    employeeCount: 4,
  },
  {
    id: 5,
    name: "Operations",
    description: "Business operations and administrative support.",
    employeeCount: 9,
  },
];

const DepartmentsSection = () => {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) =>
      `${department.name} ${department.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [departments, search]);

  const totalEmployees = departments.reduce(
    (total, department) => total + department.employeeCount,
    0
  );

  const openAddModal = () => {
    setEditingDepartment(null);
    setForm({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (department: Department) => {
    setEditingDepartment(department);
    setForm({
      name: department.name,
      description: department.description,
    });
    setOpenMenu(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) return;

    const duplicate = departments.some(
      (department) =>
        department.name.toLowerCase() === name.toLowerCase() &&
        department.id !== editingDepartment?.id
    );

    if (duplicate) {
      alert("A department with this name already exists.");
      return;
    }

    if (editingDepartment) {
      setDepartments((previous) =>
        previous.map((department) =>
          department.id === editingDepartment.id
            ? { ...department, name, description }
            : department
        )
      );
    } else {
      setDepartments((previous) => [
        ...previous,
        {
          id: Date.now(),
          name,
          description,
          employeeCount: 0,
        },
      ]);
    }

    setIsModalOpen(false);
    setEditingDepartment(null);
    setForm({ name: "", description: "" });
  };

  const handleDelete = (department: Department) => {
    if (department.employeeCount > 0) {
      alert(
        "This department has employees assigned to it. Reassign those employees before deleting it."
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${department.name}?`
      )
    ) {
      setDepartments((previous) =>
        previous.filter((item) => item.id !== department.id)
      );
    }

    setOpenMenu(null);
  };

  return (
    <section
      id="Departments"
      className="flex h-full flex-col gap-6 overflow-y-auto"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#26382f]">
            Departments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Organize your company by creating and managing departments.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#26382f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#344b40]"
        >
          <Plus size={17} />
          Add department
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total departments
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#26382f]">
                {departments.length}
              </p>
            </div>

            <div className="rounded-lg bg-[#26382f]/10 p-3 text-[#26382f]">
              <Building2 size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Employees assigned
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#26382f]">
                {totalEmployees}
              </p>
            </div>

            <div className="rounded-lg bg-[#ffbb00]/20 p-3 text-[#26382f]">
              <Users size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Department Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-[#26382f]">
              All departments
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredDepartments.length} departments
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#26382f]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-medium uppercase tracking-wide text-gray-500">
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Employees</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredDepartments.map((department) => (
                <tr
                  key={department.id}
                  className="transition hover:bg-gray-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#26382f]/10 p-2.5 text-[#26382f]">
                        <BriefcaseBusiness size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {department.name}
                      </span>
                    </div>
                  </td>

                  <td className="max-w-xs px-5 py-4 text-sm text-gray-500">
                    {department.description || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={15} className="text-gray-400" />
                      {department.employeeCount}
                    </div>
                  </td>

                  <td className="relative px-5 py-4 text-right">
                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === department.id
                            ? null
                            : department.id
                        )
                      }
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#26382f]"
                      aria-label={`Actions for ${department.name}`}
                    >
                      <MoreHorizontal size={19} />
                    </button>

                    {openMenu === department.id && (
                      <div className="absolute right-8 top-12 z-20 w-40 rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg">
                        <button
                          onClick={() => openEditModal(department)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil size={15} />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(department)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredDepartments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center"
                  >
                    <Building2
                      size={28}
                      className="mx-auto mb-3 text-gray-300"
                    />
                    <p className="text-sm font-medium text-gray-700">
                      No departments found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Try another search or create a department.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Department Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#26382f]">
                  {editingDepartment
                    ? "Edit department"
                    : "Create department"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {editingDepartment
                    ? "Update your department information."
                    : "Add a new department to your organization."}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Department name
                </label>
                <input
                  autoFocus
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Engineering"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#26382f]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                  <span className="ml-1 font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  maxLength={255}
                  value={form.description}
                  onChange={(e) =>
                    setForm((previous) => ({
                      ...previous,
                      description: e.target.value,
                    }))
                  }
                  placeholder="What does this department do?"
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-[#26382f]"
                />
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#26382f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#344b40]"
                >
                  {editingDepartment
                    ? "Save changes"
                    : "Create department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default DepartmentsSection;