"use client";

import Link from "next/link";
import { useState } from "react";

export default function EmployeeStatusPage() {
  const [currentStatus, setCurrentStatus] = useState("Available");

  const statuses = [
    {
      name: "Available",
      description: "I am available for work.",
    },
    {
      name: "Working",
      description: "I am currently working.",
    },
    {
      name: "Break",
      description: "I am currently on a break.",
    },
    {
      name: "Offline",
      description: "I am not available right now.",
    },
  ];

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">EMS</div>

        <h2>Employee Panel</h2>

        <nav>
          <Link href="/employee/dashboard">Dashboard</Link>

          <Link href="/employee/profile">My Profile</Link>

          <Link href="/employee/status" className="active">
            My Status
          </Link>

          <Link href="/employee/history">Status History</Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">Logout</Link>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>My Status</h1>
            <p>View and update your current work status.</p>
          </div>

          <div className="admin-profile">
            <div className="profile-circle">R</div>

            <div>
              <strong>Rahul Sharma</strong>
              <span>Software Developer</span>
            </div>
          </div>
        </header>

        <div className="employee-status-section">
          <div className="current-status-card">
            <div>
              <span className="status-card-label">Current Status</span>

              <div className="current-status-display">
                <div className="current-status-dot"></div>

                <strong>{currentStatus}</strong>
              </div>

              <p>Last updated today at 10:30 AM</p>
            </div>
          </div>

          <div className="status-update-card">
            <div className="status-section-header">
              <h2>Update Your Status</h2>

              <p>Select your current work status.</p>
            </div>

            <div className="status-options">
              {statuses.map((status) => (
                <button
                  key={status.name}
                  type="button"
                  className={`status-option ${
                    currentStatus === status.name
                      ? "selected-status"
                      : ""
                  }`}
                  onClick={() => setCurrentStatus(status.name)}
                >
                  <span className="status-option-name">
                    {status.name}
                  </span>

                  <span className="status-option-description">
                    {status.description}
                  </span>
                </button>
              ))}
            </div>

            <div className="status-update-note">
              <strong>UI Preview</strong>

              <p>
                Status changes are currently for UI testing only and are
                not saved to the database.
              </p>
            </div>
          </div>

          <div className="status-today-card">
            <div className="status-section-header">
              <h2>Today&apos;s Status</h2>

              <p>Your status activity for today.</p>
            </div>

            <div className="today-status-list">
              <div className="today-status-item">
                <div className="today-status-indicator"></div>

                <div>
                  <strong>Available</strong>
                  <span>10:30 AM</span>
                </div>
              </div>

              <div className="today-status-item">
                <div className="today-status-indicator"></div>

                <div>
                  <strong>Working</strong>
                  <span>09:15 AM</span>
                </div>
              </div>

              <div className="today-status-item">
                <div className="today-status-indicator"></div>

                <div>
                  <strong>Available</strong>
                  <span>09:00 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}