"use client";

import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useCallback, useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

type Employee = { EmployeeId: number; UserId: number; Name?: string; Email?: string; Department?: string };
type EmployeeStatus = { StatusId: number; EmployeeId: number; Status: string };
type EmployeeWithStatus = Employee & { status: string };

const getList = <T,>(data: unknown, key: "employees" | "statuses"): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== "object") return [];

  const response = data as { data?: unknown; employees?: unknown; statuses?: unknown };
  const value = response.data ?? response[key];
  return Array.isArray(value) ? value as T[] : [];
};

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [employees, setEmployees] = useState<EmployeeWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteForm, setDeleteForm] = useState({
        name: "",
        email: "",
        department: "",
      });

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const [employeeData, statusData] = await Promise.all([
        apiJson<unknown>("/admin/employees", { cache: "no-store" }),
        apiJson<unknown>("/admin/statuses", { cache: "no-store" }),
      ]);
      const employeeList = getList<Employee>(employeeData, "employees");
      const statusList = getList<EmployeeStatus>(statusData, "statuses");
      const statuses = new Map<number, EmployeeStatus>();
      for (const status of statusList) {
        const previous = statuses.get(Number(status.EmployeeId));
        if (!previous || Number(status.StatusId) > Number(previous.StatusId)) statuses.set(Number(status.EmployeeId), status);
      }
      setEmployees(employeeList.map((employee) => ({ ...employee, status: statuses.get(Number(employee.EmployeeId))?.Status ?? "Inactive" })));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to load employees.");
    } finally { setLoading(false); }
  }, []);
const handleDeleteEmployee = async () => {
  const name = deleteForm.name.trim();
  const email = deleteForm.email.trim();
  const department = deleteForm.department.trim();

  const nameRegex = /^[A-Za-z ]+$/;
  const departmentRegex = /^[A-Za-z0-9 &-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) {
    setError("Employee name is required.");
    return;
  }

  if (name.length < 2) {
    setError("Employee name must be at least 2 characters.");
    return;
  }

  if (name.length > 50) {
    setError("Employee name cannot exceed 50 characters.");
    return;
  }

  if (!nameRegex.test(name)) {
    setError("Employee name can contain only letters and spaces.");
    return;
  }

  if (!email) {
    setError("Employee email is required.");
    return;
  }

  if (email.length > 100) {
    setError("Employee email cannot exceed 100 characters.");
    return;
  }

  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!department) {
    setError("Department is required.");
    return;
  }

  if (department.length < 2) {
    setError("Department must be at least 2 characters.");
    return;
  }

  if (department.length > 50) {
    setError("Department cannot exceed 50 characters.");
    return;
  }

  if (!departmentRegex.test(department)) {
    setError("Department contains invalid characters.");
    return;
  }

  const employee = employees.find(
    (item) =>
      (item.Name ?? "").trim().toLowerCase() === name.toLowerCase() &&
      (item.Email ?? "").trim().toLowerCase() === email.toLowerCase() &&
      (item.Department ?? "").trim().toLowerCase() === department.toLowerCase()
  );

  if (!employee) {
    setError("Employee details do not match.");
    return;
  }

  try {
    setError("");

    await apiJson(`/admin/employees/${employee.EmployeeId}`, {
            method: "DELETE",
        });

    setShowDeleteModal(false);

    setDeleteForm({
      name: "",
      email: "",
      department: "",
    });

    await fetchEmployees();
  } catch (cause) {
    setError(
      cause instanceof Error
        ? cause.message
        : "Failed to delete employee."
    );
  }
};
  useEffect(() => {
    const timer = window.setTimeout(() => void fetchEmployees(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchEmployees]);
 const filtered = employees.filter((employee) => {
  const matchesSearch =
    `${employee.Name ?? ""} ${employee.Email ?? ""} ${employee.Department ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || employee.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return <main className="dashboard-page">
    <AdminSidebar />
    <section className="dashboard-content">
      <header className="dashboard-header"><div><h1>Employees</h1><p>Manage all employees in the system.</p></div><div className="admin-profile"><div className="profile-circle">A</div><div><strong>Admin</strong><span>Administrator</span></div></div></header>
      <div className="employees-section">
        <div className="employees-top">
  <div>
    <h2>Employee List</h2>
    <p>View and manage your employees.</p>
  </div>

  <div className="employee-top-actions">
  <Link
    href="/admin/employees/add"
    className="add-employee-button"
  >
    + Add Employee
  </Link>

  <select
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
    className="status-filter"
    aria-label="Filter employees by status"
  >
    <option value="All">All Status</option>
    <option value="Active">Active</option>
    <option value="Inactive">Inactive</option>
    <option value="On Leave">On Leave</option>
  </select>
</div>
    </div>
           

    {showDeleteModal && (
  <div className="delete-modal-overlay">
    <div className="delete-modal">
      <h3>Delete Employee</h3>


      <div className="delete-form-group">
        <label>Employee Name</label>
        <input
          type="text"
          placeholder="Enter employee name"
          value={deleteForm.name}
          readOnly={true}
          minLength={2}
          maxLength={50}
          required
          pattern="[A-Za-z ]+"
          onChange={(e) =>
            setDeleteForm({
              ...deleteForm,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="delete-form-group">
        <label>Employee Email</label>
        <input
          type="email"
          placeholder="Enter employee email"
          value={deleteForm.email}
          readOnly={true}
          minLength={5}
          maxLength={100}
          required
          onChange={(e) =>
            setDeleteForm({
              ...deleteForm,
              email: e.target.value,
            })
          }
        />
      </div>

      <div className="delete-form-group">
        <label>Department</label>
        <input
          type="text"
          placeholder="Enter department"
          value={deleteForm.department}
          readOnly={true}
          minLength={2}
          maxLength={50}
          required
          pattern="[A-Za-z0-9 &-]+"
          onChange={(e) =>
            setDeleteForm({
              ...deleteForm,
              department: e.target.value,
            })
          }
        />
      </div>

      <div className="delete-modal-actions">
        <button
          type="button"
          className="cancel-delete-button"
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteForm({
              name: "",
              email: "",
              department: "",
            });
            setError("");
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          className="confirm-delete-button"
          onClick={() => void handleDeleteEmployee()}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    <div className="employee-search">
                <input
                  type="search"
                  placeholder="Search by name, email or department..."
                  value={search}
                  minLength={2}
                  maxLength={50}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (/^[A-Za-z0-9 ._-]*$/.test(value)) {
                      setSearch(value.slice(0, 50));
                    }
                  }}
                />
              </div>
        {loading && <div className="no-employees">Loading employees...</div>}
        {!loading && error && <div className="no-employees">{error} <button type="button" onClick={() => void fetchEmployees()}>Retry</button></div>}
        {!loading && !error && <div className="employees-table">
          <div className="employees-row employees-heading">
                <span>Employee ID&nbsp;&nbsp;&nbsp;Name</span>
                <span>Email</span>
                <span>Department</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
          {filtered.length ? filtered.map((employee) => { const name = employee.Name ?? "Unknown Employee"; const status = employee.status; return <div className="employees-row" key={employee.EmployeeId}>
<div className="employee-name">
  <strong className="employee-id">
    {employee.EmployeeId}
  </strong>

  <span className="employee-name-text">
    {name}
  </span>
</div><span>{employee.Email ?? "N/A"}</span><span>{employee.Department ?? "N/A"}</span><span><span className={`status ${status.toLowerCase() === "active" ? "active-status" : "inactive-status"}`}>{status}</span></span>
<div className="employee-actions">
  <Link
    href={`/admin/employees/${employee.EmployeeId}`}
    className="view-button"
  >
    View
  </Link>

  <Link
    href={`/admin/employees/${employee.EmployeeId}/edit`}
    className="edit-button"
  >
    Edit
  </Link>

  <button
    type="button"
    className="delete-button"
    onClick={() => {
      setError("");
      setDeleteForm({
        name: employee.Name ?? "",
        email: employee.Email ?? "",
        department: employee.Department ?? "",
      });
      setShowDeleteModal(true);
    }}
  >
    Delete
  </button>
</div></div>; }) : <div className="no-employees">No employees found.</div>}
        </div>}
      </div>
    </section>
  </main>;
}
