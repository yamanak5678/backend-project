"use client";

import Link from "next/link";
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
  const [employees, setEmployees] = useState<EmployeeWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchEmployees(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchEmployees]);
  const filtered = employees.filter((employee) => `${employee.Name ?? ""} ${employee.Email ?? ""} ${employee.Department ?? ""}`.toLowerCase().includes(search.toLowerCase()));

  return <main className="dashboard-page">
    <aside className="sidebar"><div className="sidebar-logo">EMS</div><h2>Admin Panel</h2><nav><Link href="/admin/dashboard">Dashboard</Link><Link href="/admin/employees" className="active">Employees</Link><Link href="/admin/statuses">Statuses</Link><Link href="/admin/reports">Reports</Link></nav><div className="sidebar-bottom"><Link href="/">Logout</Link></div></aside>
    <section className="dashboard-content">
      <header className="dashboard-header"><div><h1>Employees</h1><p>Manage all employees in the system.</p></div><div className="admin-profile"><div className="profile-circle">A</div><div><strong>Admin</strong><span>Administrator</span></div></div></header>
      <div className="employees-section">
        <div className="employees-top"><div><h2>Employee List</h2><p>View and manage your employees.</p></div><Link href="/admin/employees/add" className="add-employee-button">+ Add Employee</Link></div>
        <div className="employee-search"><input type="search" placeholder="Search by name, email or department..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        {loading && <div className="no-employees">Loading employees...</div>}
        {!loading && error && <div className="no-employees">{error} <button type="button" onClick={() => void fetchEmployees()}>Retry</button></div>}
        {!loading && !error && <div className="employees-table">
          <div className="employees-row employees-heading"><span>Name</span><span>Email</span><span>Department</span><span>Status</span><span>Actions</span></div>
          {filtered.length ? filtered.map((employee) => { const name = employee.Name ?? "Unknown Employee"; const status = employee.status; return <div className="employees-row" key={employee.EmployeeId}><div className="employee-name"><div className="employee-avatar">{name.charAt(0).toUpperCase()}</div><span>{name}</span></div><span>{employee.Email ?? "N/A"}</span><span>{employee.Department ?? "N/A"}</span><span><span className={`status ${status.toLowerCase() === "active" ? "active-status" : "inactive-status"}`}>{status}</span></span><div className="employee-actions"><Link href={`/admin/employees/${employee.EmployeeId}`} className="view-button">View</Link><Link href={`/admin/employees/${employee.EmployeeId}/edit`} className="edit-button">Edit</Link></div></div>; }) : <div className="no-employees">No employees found.</div>}
        </div>}
      </div>
    </section>
  </main>;
}
