"use client";

import Link from "next/link";
import { useState } from "react";

const employees = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    department: "Development",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    department: "HR",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    department: "Design",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Neha Verma",
    email: "neha@example.com",
    department: "Development",
    status: "Active",
  },
  {
    id: 5,
    name: "Vikas Gupta",
    email: "vikas@example.com",
    department: "Marketing",
    status: "Active",
  },
];

export default function EmployeesPage() {
  const [search, setSearch] = useState("");

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.email} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">EMS</div>

        <h2>Admin Panel</h2>

        <nav>
          <Link href="/admin/dashboard">
            Dashboard
          </Link>

          <Link
            href="/admin/employees"
            className="active"
          >
            Employees
          </Link>

          <Link href="/admin/statuses">
            Statuses
          </Link>

          <Link href="/admin/reports">
            Reports
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <section className="dashboard-content">

        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>Employees</h1>
            <p>
              Manage all employees in the system.
            </p>
          </div>

          <div className="admin-profile">
            <div className="profile-circle">
              A
            </div>

            <div>
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* Employee Section */}
        <div className="employees-section">

          <div className="employees-top">
            <div>
              <h2>Employee List</h2>
              <p>
                View and manage your employees.
              </p>
            </div>

            <Link
              href="/admin/employees/add"
              className="add-employee-button"
            >
              + Add Employee
            </Link>
          </div>

          {/* Search */}
          <div className="employee-search">
            <input
              type="text"
              placeholder="Search by name, email or department..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          {/* Employee Table */}
          <div className="employees-table">

            <div className="employees-row employees-heading">
              <span>Name</span>
              <span>Email</span>
              <span>Department</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <div
                  className="employees-row"
                  key={employee.id}
                >

                  {/* Name */}
                  <div className="employee-name">
                    <div className="employee-avatar">
                      {employee.name.charAt(0)}
                    </div>

                    <span>
                      {employee.name}
                    </span>
                  </div>

                  {/* Email */}
                  <span>
                    {employee.email}
                  </span>

                  {/* Department */}
                  <span>
                    {employee.department}
                  </span>

                  {/* Status */}
                  <span>
                    <span
                      className={`status ${
                        employee.status === "Active"
                          ? "active-status"
                          : "inactive-status"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </span>

                  {/* Actions */}
                  <div className="employee-actions">

                    <Link
                      href={`/admin/employees/${employee.id}`}
                      className="view-button"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/employees/${employee.id}/edit`}
                      className="edit-button"
                    >
                      Edit
                    </Link>

                  </div>

                </div>
              ))
            ) : (
              <div className="no-employees">
                No employees found.
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}