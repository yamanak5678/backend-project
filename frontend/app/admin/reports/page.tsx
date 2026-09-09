"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch, apiJson } from "@/lib/api";

type Employee = { EmployeeId: number; Name?: string; Department?: string };
type EmployeeStatus = { StatusId: number; EmployeeId: number; Status: string; CreatedAt?: string };
type Report = { id: number; name: string; department: string; status: string; date: string; dateValue?: string };

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [reports, setReports] = useState<Report[]>([]);

  const loadReports = useCallback(async () => {
    try {
      const [employeeData, statusData] = await Promise.all([apiJson<unknown>("/admin/employees"), apiJson<unknown>("/admin/statuses")]);
      const employees = Array.isArray(employeeData) ? employeeData as Employee[] : [];
      const statuses = Array.isArray(statusData) ? statusData as EmployeeStatus[] : [];
      const latest = new Map<number, EmployeeStatus>();
      for (const item of statuses) if (!latest.has(item.EmployeeId) || item.StatusId > (latest.get(item.EmployeeId)?.StatusId ?? 0)) latest.set(item.EmployeeId, item);
      setReports(employees.map((employee) => {
        const item = latest.get(employee.EmployeeId);
        const dateValue = item?.CreatedAt;
        return { id: employee.EmployeeId, name: employee.Name ?? "Unknown Employee", department: employee.Department ?? "N/A", status: item?.Status ?? "Inactive", date: dateValue ? new Date(dateValue).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A", dateValue };
      }));
    } catch (cause) { setDownloadError(cause instanceof Error ? cause.message : "Failed to load reports."); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void loadReports(), 0); return () => window.clearTimeout(timer); }, [loadReports]);

  const downloadReport = async () => {
    setDownloading(true);
    setDownloadError("");
    try {
      const response = await apiFetch("/admin/reports/statuses");
      const file = await response.blob();
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "employee-status-report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setDownloadError(cause instanceof Error ? cause.message : "Unable to download the report.");
    } finally {
      setDownloading(false);
    }
  };

  const filteredReports = reports.filter((report) =>
    (!date || report.dateValue?.startsWith(date)) && `${report.name} ${report.department} ${report.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const active = filteredReports.filter((report) => report.status === "Active").length;
  const inactive = filteredReports.filter((report) => report.status === "Inactive").length;
  const onLeave = filteredReports.filter((report) => report.status === "On Leave").length;

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

            <button className="download-report-button" type="button" onClick={() => void downloadReport()} disabled={downloading}>
              {downloading ? "Preparing Report..." : "Download Report"}
            </button>

          </div>
          {downloadError && <p role="alert">{downloadError}</p>}

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
              <strong>{filteredReports.length}</strong>
            </div>

            <div className="report-summary-card">
              <span>Active</span>
              <strong>{active}</strong>
            </div>

            <div className="report-summary-card">
              <span>Inactive</span>
              <strong>{inactive}</strong>
            </div>

            <div className="report-summary-card">
              <span>On Leave</span>
              <strong>{onLeave}</strong>
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
