"use client";

import Link from "next/link";
import { useState } from "react";

const statuses = [
  {
    id: 1,
    name: "Active",
    description: "Employee is currently active.",
  },
  {
    id: 2,
    name: "Inactive",
    description: "Employee is currently inactive.",
  },
  {
    id: 3,
    name: "On Leave",
    description: "Employee is currently on leave.",
  },
  {
    id: 4,
    name: "Work From Home",
    description: "Employee is working from home.",
  },
];

export default function StatusesPage() {
  const [search, setSearch] = useState("");

  const filteredStatuses = statuses.filter((status) =>
    `${status.name} ${status.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="dashboard-page">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          EMS
        </div>

        <h2>Admin Panel</h2>

        <nav>
          <Link href="/admin/dashboard">
            Dashboard
          </Link>

          <Link href="/admin/employees">
            Employees
          </Link>

          <Link href="/admin/statuses" className="active">
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
            <h1>Statuses</h1>
            <p>Manage employee statuses in the system.</p>
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

        {/* Status Section */}
        <div className="statuses-section">

          {/* Top Section */}
          <div className="statuses-top">

            <div>
              <h2>Status List</h2>
              <p>
                View and manage all employee statuses.
              </p>
            </div>

            <button className="add-status-button">
              + Add Status
            </button>

          </div>

          {/* Search */}
          <div className="status-search">

            <input
              type="text"
              placeholder="Search status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

          </div>

          {/* Status Table */}
          <div className="statuses-table">

            <div className="statuses-row statuses-heading">
              <span>Status Name</span>
              <span>Description</span>
              <span>Actions</span>
            </div>

            {filteredStatuses.length > 0 ? (
              filteredStatuses.map((status) => (

                <div
                  className="statuses-row"
                  key={status.id}
                >

                  <div className="status-name">

                    <div className="status-icon">
                      ✓
                    </div>

                    <span>{status.name}</span>

                  </div>

                  <span className="status-description">
                    {status.description}
                  </span>

                  <div className="status-actions">

                    <button className="status-edit-button">
                      Edit
                    </button>

                    <button className="status-delete-button">
                      Delete
                    </button>

                  </div>

                </div>

              ))
            ) : (

              <div className="no-statuses">
                No statuses found.
              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}