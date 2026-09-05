import Link from "next/link";

export default function EmployeeProfilePage() {
  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-logo">EMS</div>

        <h2>Employee Panel</h2>

        <nav>
          <Link href="/employee/dashboard">Dashboard</Link>

          <Link href="/employee/profile" className="active">
            My Profile
          </Link>

          <Link href="/employee/status">
            My Status
          </Link>

          <Link href="/employee/history">
            Status History
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link href="/">Logout</Link>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>My Profile</h1>
            <p>View your personal and employee information.</p>
          </div>

          <div className="admin-profile">
            <div className="profile-circle">R</div>

            <div>
              <strong>Rahul Sharma</strong>
              <span>Software Developer</span>
            </div>
          </div>
        </header>

        <div className="employee-profile-section">
          <div className="employee-profile-header">
            <div className="large-profile-circle">R</div>

            <div>
              <h2>Rahul Sharma</h2>
              <p>Software Developer</p>

              <span className="profile-active-status">
                Active Employee
              </span>
            </div>
          </div>

          <div className="employee-profile-content">
            <div className="profile-information-card">
              <h2>Personal Information</h2>
              <p>Your basic personal details.</p>

              <div className="profile-information-grid">
                <div className="profile-info-item">
                  <span>First Name</span>
                  <strong>Rahul</strong>
                </div>

                <div className="profile-info-item">
                  <span>Last Name</span>
                  <strong>Sharma</strong>
                </div>

                <div className="profile-info-item">
                  <span>Email Address</span>
                  <strong>rahul@example.com</strong>
                </div>

                <div className="profile-info-item">
                  <span>Phone Number</span>
                  <strong>9876543210</strong>
                </div>
              </div>
            </div>

            <div className="profile-information-card">
              <h2>Work Information</h2>
              <p>Your current employee information.</p>

              <div className="profile-information-grid">
                <div className="profile-info-item">
                  <span>Employee ID</span>
                  <strong>EMP-001</strong>
                </div>

                <div className="profile-info-item">
                  <span>Department</span>
                  <strong>Development</strong>
                </div>

                <div className="profile-info-item">
                  <span>Designation</span>
                  <strong>Software Developer</strong>
                </div>

                <div className="profile-info-item">
                  <span>Joining Date</span>
                  <strong>01 September 2026</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-note">
            <strong>Profile Information</strong>
            <p>
              Your profile information is managed by the administrator.
              Contact your administrator if any information needs to be
              changed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}