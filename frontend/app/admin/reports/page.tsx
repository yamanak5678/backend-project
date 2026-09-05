"use client";

import Link from "next/link";
import { useState } from "react";

const reports = [
  {
    id: 1,
    name: "Rahul Sharma",
    department: "Development",
    status: "Active",
    date: "05 Sep 2026",
  },
  {
    id: 2,
    name: "Priya Singh",
    department: "HR",
    status: "Active",
    date: "05 Sep 2026",
  },
  {
    id: 3,
    name: "Amit Kumar",
    department: "Design",
    status: "Inactive",
    date: "05 Sep 2026",
  },
  {
    id: 4,
    name: "Neha Verma",
    department: "Development",
    status: "On Leave",
    date: "05 Sep 2026",
  },
  {
    id: 5,
    name: "Vikas Gupta",
    department: "Marketing",
    status: "Active",
    date: "05 Sep 2026",
  },
];

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("2026-09-05");

  const filteredReports = reports.filter((report) =>
    `${report.name} ${report.department} ${report.status}`
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

          <Link href="/admin/statuses">
            Statuses
          </Link>

          <Link href="/admin/reports" className="active">
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
            <h1>Reports</h1>
            <p>View and download employee status reports.</p>
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

        {/* Report Section */}
        <div className="reports-section">

          {/* Top Section */}
          <div className="reports-top">

            <div>
              <h2>Employee Status Report</h2>
              <p>
                View employee status information for the selected date.
              </p>
            </div>

            <button className="download-report-button">
              Download Report
            </button>

          </div>

          {/* Filters */}
          <div className="report-filters">

            <div className="report-date">

              <label htmlFor="reportDate">
                Select Date
              </label>

              <input
                id="reportDate"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />

            </div>

            <div className="report-search">

              <label htmlFor="reportSearch">
                Search
              </label>

              <input
                id="reportSearch"
                type="text"
                placeholder="Search employee, department or status..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

            </div>

          </div>

          {/* Summary Cards */}
          <div className="report-summary">

            <div className="report-summary-card">
              <span>Total Employees</span>
              <strong>5</strong>
            </div>

            <div className="report-summary-card">
              <span>Active</span>
              <strong>3</strong>
            </div>

            <div className="report-summary-card">
              <span>Inactive</span>
              <strong>1</strong>
            </div>

            <div className="report-summary-card">
              <span>On Leave</span>
              <strong>1</strong>
            </div>

          </div>

          {/* Table */}
          <div className="reports-table">

            <div className="reports-row reports-heading">
              <span>Employee</span>
              <span>Department</span>
              <span>Status</span>
              <span>Date</span>
            </div>

            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (

                <div
                  className="reports-row"
                  key={report.id}
                >

                  <div className="report-employee-name">

                    <div className="report-avatar">
                      {report.name.charAt(0)}
                    </div>

                    <span>{report.name}</span>

                  </div>

                  <span>
                    {report.department}
                  </span>

                  <span>
                    <span
                      className={`status ${
                        report.status === "Active"
                          ? "active-status"
                          : report.status === "Inactive"
                            ? "inactive-status"
                            : "leave-status"
                      }`}
                    >
                      {report.status}
                    </span>
                  </span>

                  <span>
                    {report.date}
                  </span>

                </div>

              ))
            ) : (

              <div className="no-reports">
                No reports found.
              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}
