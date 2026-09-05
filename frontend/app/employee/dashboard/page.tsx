import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Clock3,
  Home,
  Lightbulb,
  LogOut,
  Pencil,
  User,
  Wifi,
  Zap,
} from "lucide-react";

export default function EmployeeDashboardPage() {
  return (
    <main className="employee-dashboard-page">
      {/* ================= SIDEBAR ================= */}
      <aside className="employee-sidebar">
        <div className="employee-sidebar-brand">
          <div className="employee-brand-icon">E</div>

          <div>
            <h2>EMS</h2>
            <span>Employee Panel</span>
          </div>
        </div>

        <nav className="employee-sidebar-nav">
          <Link
            href="/employee/dashboard"
            className="employee-nav-link active"
          >
            <Home size={19} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/employee/profile"
            className="employee-nav-link"
          >
            <User size={19} />
            <span>My Profile</span>
          </Link>

          <Link
            href="/employee/status"
            className="employee-nav-link"
          >
            <Activity size={19} />
            <span>My Status</span>
          </Link>

          <Link
            href="/employee/history"
            className="employee-nav-link"
          >
            <Clock3 size={19} />
            <span>Status History</span>
          </Link>
        </nav>

        <div className="employee-sidebar-logout">
          <Link href="/" className="employee-nav-link">
            <LogOut size={19} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

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
              <div className="employee-header-avatar">R</div>

              <div>
                <strong>Rahul Sharma</strong>
                <span>Software Developer</span>
              </div>

              <ChevronDown size={18} />
            </div>
          </div>
        </header>

        {/* ================= WELCOME ================= */}
        <section className="employee-welcome-banner">
          <div className="employee-welcome-content">
            <span>Good Morning ☀️</span>

            <h2>Welcome back, Rahul! 👋</h2>

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
                Available
              </strong>

              <p>Last updated today at 10:30 AM</p>
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

              <strong>Development</strong>

              <p>Software Development Team</p>
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

              <strong>Software Developer</strong>

              <p>Employee ID: EMP-001</p>
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
              <div className="employee-activity-row">
                <div className="employee-activity-line">
                  <span className="activity-point available-point"></span>
                </div>

                <div className="employee-activity-text">
                  <strong>Available</strong>
                  <span>Today, 10:30 AM</span>
                </div>

                <span className="employee-current-badge">
                  Current
                </span>
              </div>

              <div className="employee-activity-row">
                <div className="employee-activity-line">
                  <span className="activity-point working-point"></span>
                </div>

                <div className="employee-activity-text">
                  <strong>Working</strong>
                  <span>Today, 09:15 AM</span>
                </div>
              </div>

              <div className="employee-activity-row">
                <div className="employee-activity-line">
                  <span className="activity-point offline-point"></span>
                </div>

                <div className="employee-activity-text">
                  <strong>Offline</strong>
                  <span>Yesterday, 06:00 PM</span>
                </div>
              </div>
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