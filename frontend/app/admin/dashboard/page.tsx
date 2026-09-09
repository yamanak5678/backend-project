"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

type ApiEmployee = { EmployeeId: number; Name?: string; Email?: string; Department?: string; JoiningDate?: string };
type ApiStatus = { StatusId: number; EmployeeId: number; Status: string; CreatedAt?: string };
type DashboardEmployee = { id: number; name: string; email: string; department: string; status: string; date: string; initial: string; avatar: string };

const toList = <T,>(data: unknown, key: string): T[] => {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const value = (data as Record<string, unknown>).data ?? (data as Record<string, unknown>)[key];
    return Array.isArray(value) ? value as T[] : [];
  }
  return [];
};

export default function AdminDashboardPage() {
  const [employees, setEmployees] = useState<DashboardEmployee[]>([]);
  const [statusUpdatesToday, setStatusUpdatesToday] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const [employeeData, statusData] = await Promise.all([
            apiJson<unknown>("/admin/employees", { cache: "no-store" }),
            apiJson<unknown>("/admin/statuses", { cache: "no-store" }),
          ]);
          const statuses = toList<ApiStatus>(statusData, "statuses");
          const latestStatuses = new Map<number, ApiStatus>();
          for (const status of statuses) {
            const previous = latestStatuses.get(Number(status.EmployeeId));
            if (!previous || Number(status.StatusId) > Number(previous.StatusId)) latestStatuses.set(Number(status.EmployeeId), status);
          }
          const today = new Date().toDateString();
          setStatusUpdatesToday(statuses.filter((status) => status.CreatedAt && new Date(status.CreatedAt).toDateString() === today).length);
          setEmployees(toList<ApiEmployee>(employeeData, "employees").map((employee) => {
            const name = employee.Name ?? "Unknown Employee";
            return { id: employee.EmployeeId, name, email: employee.Email ?? "N/A", department: employee.Department ?? "N/A", status: latestStatuses.get(Number(employee.EmployeeId))?.Status ?? "Inactive", date: employee.JoiningDate ? new Date(employee.JoiningDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A", initial: name.charAt(0).toUpperCase(), avatar: "green" };
          }));
          setError("");
        } catch (cause) { setError(cause instanceof Error ? cause.message : "Failed to load dashboard."); }
      })();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const activeEmployees = employees.filter((employee) => employee.status.toLowerCase() === "active").length;
  const departments = new Set(employees.map((employee) => employee.department).filter((department) => department !== "N/A")).size;
  const recentEmployees = employees.slice(0, 5);

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-leaf">🌿</div>

          <div>
            <div className="sidebar-brand-title">EMS</div>
            <div className="sidebar-brand-subtitle">Admin Panel</div>
          </div>
        </div>

        <nav>
          <Link href="/admin/dashboard" className="active">
            <span className="menu-icon">⌂</span>
            Dashboard
          </Link>

          <Link href="/admin/employees">
            <span className="menu-icon">♙</span>
            Employees
          </Link>

          <Link href="/admin/statuses">
            <span className="menu-icon">〽</span>
            Statuses
          </Link>

          <Link href="/admin/reports">
            <span className="menu-icon">▥</span>
            Reports
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">
            <span className="menu-icon">↪</span>
            Logout
          </Link>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, Admin! 👋</p>
          </div>

          <div className="admin-header-right">
            <div className="notification-icon">♧</div>

            <div className="admin-profile">
              <div className="profile-circle">A</div>

              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-date">
          📅 Friday, 05 September 2026
        </div>

        <section className="admin-stat-grid">
  {/* Total Employees */}
  <div className="admin-stat-card total-card">
    <div className="card-decoration card-decoration-one"></div>
    <div className="card-decoration card-decoration-two"></div>

    <div className="stat-icon">
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>

    <div className="stat-card-content">
      <span>Total Employees</span>
      <strong>{employees.length}</strong>
      <p>All registered employees</p>
    </div>

    <div className="stat-change positive">↑ +8%</div>
  </div>

  {/* Active Employees */}
  <div className="admin-stat-card active-card">
    <div className="card-decoration card-decoration-one"></div>
    <div className="card-decoration card-decoration-two"></div>

    <div className="stat-icon">
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 2.5 2.5L16 9" />
      </svg>
    </div>

    <div className="stat-card-content">
      <span>Active Employees</span>
      <strong>{activeEmployees}</strong>
      <p>Currently active</p>
    </div>

    <div className="stat-change positive">↑ +12%</div>
  </div>

  {/* Inactive Employees */}
  <div className="admin-stat-card inactive-card">
    <div className="card-decoration card-decoration-one"></div>
    <div className="card-decoration card-decoration-two"></div>

    <div className="stat-icon">
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9l6 6" />
        <path d="m15 9-6 6" />
      </svg>
    </div>

    <div className="stat-card-content">
      <span>Inactive Employees</span>
      <strong>{employees.length - activeEmployees}</strong>
      <p>Currently inactive</p>
    </div>

    <div className="stat-change negative">↓ -5%</div>
  </div>

  {/* Today's Status */}
  <div className="admin-stat-card status-card">
    <div className="card-decoration card-decoration-one"></div>
    <div className="card-decoration card-decoration-two"></div>

    <div className="stat-icon">
      <svg
        width="25"
        height="25"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19V9" />
        <path d="M10 19V5" />
        <path d="M16 19v-8" />
        <path d="M22 19V3" />
      </svg>
    </div>

    <div className="stat-card-content">
      <span>Today&apos;s Status Updates</span>
      <strong>{statusUpdatesToday}</strong>
      <p>Status changes today</p>
    </div>

    <div className="stat-change positive">↑ +10%</div>
  </div>
</section>
        <section className="recent-employees-card">
  <div className="recent-card-header">
    <div className="recent-title">
      <div className="recent-title-icon">♟</div>

      <div>
        <h2>Recent Employees</h2>
        <p>Recently added employees to the system.</p>
        {error && <p role="alert">{error}</p>}
      </div>
    </div>

    <Link href="/admin/employees" className="view-all-button">
      View All →
    </Link>
  </div>

  <div className="admin-table-wrapper">
    <table className="admin-dashboard-table">
      <thead>
        <tr>
          <th className="number-column">#</th>
          <th className="employee-column">Employee</th>
          <th className="email-column">Email</th>
          <th className="department-column">Department</th>
          <th className="status-column">Status</th>
          <th className="date-column">Joined Date</th>
          <th className="action-column">Action</th>
        </tr>
      </thead>

      <tbody>
        {recentEmployees.map((employee) => (
          <tr key={employee.id}>
            <td className="number-column">
              {employee.id}
            </td>

            <td className="employee-column">
              <div className="employee-name-cell">
                <div
                  className={`employee-avatar ${employee.avatar}`}
                >
                  {employee.initial}
                </div>

                <strong>{employee.name}</strong>
              </div>
            </td>

            <td className="email-column">
              {employee.email}
            </td>

            <td className="department-column">
              <span
                className={`department-badge ${employee.department
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {employee.department}
              </span>
            </td>

            <td className="status-column">
              <span
                className={`dashboard-status-badge ${
                  employee.status === "Active"
                    ? "active"
                    : "inactive"
                }`}
              >
                <span className="status-dot"></span>
                {employee.status}
              </span>
            </td>

            <td className="date-column">
              <span className="joined-date">
                <span className="date-icon">▣</span>
                {employee.date}
              </span>
            </td>

            <td className="action-column">
              <button
                type="button"
                className="table-action-button"
                aria-label={`Actions for ${employee.name}`}
              >
                ⋮
              </button>
            </td>
          </tr>
        ))}
        {!error && recentEmployees.length === 0 && (
          <tr><td colSpan={7}>No employees found.</td></tr>
        )}
      </tbody>
    </table>
  </div>
</section>

        <section className="admin-bottom-grid">
          <div className="admin-bottom-card quick-actions-card">
            <div className="bottom-card-header">
              <div className="bottom-card-icon green">◷</div>

              <div>
                <h2>Quick Actions</h2>
                <p>Manage your system quickly.</p>
              </div>
            </div>

            <div className="quick-action-buttons">
              <Link href="/admin/employees/add" className="quick-action add">
                <span>♙+</span>
                Add Employee
              </Link>

              <Link href="/admin/reports" className="quick-action reports">
                <span>▥</span>
                View Reports
              </Link>

              <Link href="/admin/statuses" className="quick-action manage">
                <span>〽</span>
                Manage Statuses
              </Link>
            </div>
          </div>

          <div className="admin-bottom-card system-overview-card">
            <div className="bottom-card-header">
              <div className="bottom-card-icon yellow">▤</div>

              <div>
                <h2>System Overview</h2>
                <p>Key information at a glance.</p>
              </div>
            </div>

            <div className="overview-items">
              <div className="overview-item">
                <div className="overview-icon yellow">⌂</div>

                <div>
                  <strong>{departments}</strong>
                  <span>Departments</span>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-icon green">♟</div>

                <div>
                  <strong>{employees.length}</strong>
                  <span>Total Employees</span>
                </div>
              </div>

              <div className="overview-item">
                <div className="overview-icon mint">〽</div>

                <div>
                  <strong>{statusUpdatesToday}</strong>
                  <span>Status Updates Today</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
