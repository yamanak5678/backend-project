  "use client";

  import Link from "next/link";
  import { useEffect, useState } from "react";
  import { apiJson } from "@/lib/api";
  import EmployeeSidebar from "../components/EmployeeSidebar";

 import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Clock3,
  Lightbulb,
  Pencil,
  User,
  Wifi,
  Zap,
} from "lucide-react";

  type EmployeeProfile = {
    EmployeeId: number;
    Name?: string;
    Department?: string;
    Position?: string;
  };

  type StatusRecord = {
    StatusId: number;
    Status: string;
    Description?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
  };

  type DashboardResponse = {
    employee: EmployeeProfile;
    statuses: StatusRecord[];
  };

  export default function EmployeeDashboardPage() {
    const [profile, setProfile] = useState<EmployeeProfile | null>(null);
    const [statusHistory, setStatusHistory] = useState<StatusRecord[]>([]);

    useEffect(() => {
      const loadProfile = async () => {
        try {
          const data = await apiJson<DashboardResponse>(
            "/employees/me/dashboard"
          );

          setProfile(data.employee);
          setStatusHistory(Array.isArray(data.statuses) ? data.statuses : []);
        } catch (error) {
          console.error("Failed to load employee profile:", error);
        }
      };

      void loadProfile();
    }, []);

    const employeeName = profile?.Name ?? "Employee";
    const initial = employeeName.charAt(0).toUpperCase();
    const firstName = employeeName.split(" ")[0];
    const currentStatus = statusHistory[0];
    const formatActivityTime = (value?: string) => value
      ? new Date(value).toLocaleString("en-IN", {
          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
        })
      : "No update yet";

    return (
      <main className="employee-dashboard-page">
        {/* ================= SIDEBAR ================= */}
        
         <EmployeeSidebar />
        

        {/* ================= MAIN ================= */}
        <section className="employee-dashboard-main">
          {/* Header */}
          <header className="employee-dashboard-header">
            <div>
              <span className="employee-page-label">
                EMPLOYEE PORTAL
              </span>

              <h1>Employee Dashboard</h1>

              <p>
                Welcome back! Here is your current information.
              </p>
            </div>

            <div className="employee-header-right">
              <button className="employee-notification-button">
                <Bell size={19} />
                <span></span>
              </button>

              <div className="employee-header-profile">
                <div className="employee-header-avatar">{initial}</div>

                  <div>
                    <strong>{employeeName}</strong>
                    <span>{profile?.Position ?? "Employee"}</span>
                  </div>

                <ChevronDown size={18} />
              </div>
            </div>
          </header>

          {/* ================= WELCOME ================= */}
          <section className="employee-welcome-banner">
            <div className="employee-welcome-content">
              <span>Good Morning ☀️</span>

              <h2>Welcome back, {firstName}! 👋</h2>

              <p>
                Have a productive day! You can manage your profile and
                update your current status from your dashboard.
              </p>
            </div>

            <div className="employee-welcome-illustration">
              <div className="plant">
                <div className="plant-stem"></div>
                <div className="plant-leaf leaf-one"></div>
                <div className="plant-leaf leaf-two"></div>
                <div className="plant-leaf leaf-three"></div>
                <div className="plant-pot"></div>
              </div>

              <div className="welcome-message">
                <strong>Small</strong>
                <strong>Steps</strong>
                <strong>Big Progress</strong>
              </div>
            </div>
          </section>

          {/* ================= STAT CARDS ================= */}
          <section className="employee-info-grid">
            {/* Status */}
            <div className="employee-info-card">
              <div className="employee-info-icon">
                <Wifi size={23} />
              </div>

              <div className="employee-info-content">
                <div className="employee-info-title">
                  <span>Today&apos;s Status</span>

                  <span className="employee-active-badge">
                    <span></span>
                    Active
                  </span>
                </div>

                <strong className="employee-available">
                  {currentStatus?.Status ?? "No status set"}
                </strong>

                <p>Last updated {formatActivityTime(currentStatus?.UpdatedAt ?? currentStatus?.CreatedAt)}</p>
              </div>
            </div>

            {/* Department */}
            <div className="employee-info-card">
              <div className="employee-info-icon">
                <Building2 size={23} />
              </div>

              <div className="employee-info-content">
                <div className="employee-info-title">
                  <span>Department</span>
                </div>

                <strong>{profile?.Department ?? "N/A"}</strong>
                <p>{profile?.Department ?? "Department"} Team</p>
              </div>
            </div>

            {/* Designation */}
            <div className="employee-info-card">
              <div className="employee-info-icon">
                <BriefcaseBusiness size={23} />
              </div>

              <div className="employee-info-content">
                <div className="employee-info-title">
                  <span>Designation</span>
                </div>

                <strong>{profile?.Position ?? "N/A"}</strong>
                <p>Employee ID: {profile?.EmployeeId ?? "N/A"}</p>
              </div>
            </div>
          </section>

          {/* ================= LOWER SECTION ================= */}
          <section className="employee-lower-grid">
            {/* Quick Actions */}
            <div className="employee-panel">
              <div className="employee-panel-header">
                <div className="employee-panel-heading">
                  <div className="employee-panel-icon">
                    <Zap size={21} />
                  </div>

                  <div>
                    <span>SHORTCUTS</span>
                    <h2>Quick Actions</h2>
                    <p>Quickly access your employee information.</p>
                  </div>
                </div>
              </div>

              <div className="employee-quick-list">
                <Link
                  href="/employee/profile"
                  className="employee-quick-item"
                >
                  <div className="employee-quick-icon">
                    <User size={19} />
                  </div>

                  <div>
                    <strong>My Profile</strong>
                    <span>View your personal information</span>
                  </div>

                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/employee/status"
                  className="employee-quick-item"
                >
                  <div className="employee-quick-icon">
                    <Pencil size={19} />
                  </div>

                  <div>
                    <strong>Update Status</strong>
                    <span>Change your current status</span>
                  </div>

                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/employee/history"
                  className="employee-quick-item"
                >
                  <div className="employee-quick-icon">
                    <Clock3 size={19} />
                  </div>

                  <div>
                    <strong>Status History</strong>
                    <span>Check your previous statuses</span>
                  </div>

                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="employee-panel">
              <div className="employee-panel-header activity-header">
                <div className="employee-panel-heading">
                  <div className="employee-panel-icon">
                    <Clock3 size={21} />
                  </div>

                  <div>
                    <span>ACTIVITY</span>
                    <h2>Recent Activity</h2>
                    <p>Your latest status updates.</p>
                  </div>
                </div>

                <Link
                  href="/employee/history"
                  className="employee-view-all"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="employee-activity-list">
                {statusHistory.length ? statusHistory.slice(0, 3).map((status, index) => (
                  <div className="employee-activity-row" key={status.StatusId}>
                    <div className="employee-activity-line">
                      <span className="activity-point available-point"></span>
                    </div>
                    <div className="employee-activity-text">
                      <strong>{status.Status}</strong>
                      <span>{formatActivityTime(status.UpdatedAt ?? status.CreatedAt)}</span>
                    </div>
                    {index === 0 && <span className="employee-current-badge">Current</span>}
                  </div>
                )) : <div className="employee-activity-row"><div className="employee-activity-text"><strong>No activity yet</strong><span>Update your status to create a database record.</span></div></div>}
              </div>
            </div>
          </section>

          {/* ================= FOOTER CTA ================= */}
          <section className="employee-status-cta">
            <div className="employee-cta-left">
              <div className="employee-cta-icon">
                <Lightbulb size={22} />
              </div>

              <div>
                <strong>Need to update your status?</strong>
                <span>
                  Keep your team updated with your current availability.
                </span>
              </div>
            </div>

            <Link
              href="/employee/status"
              className="employee-cta-button"
            >
              Update Status
              <ArrowRight size={18} />
            </Link>
          </section>
        </section>
      </main>
    );
  }
