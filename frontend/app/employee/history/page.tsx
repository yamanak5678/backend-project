import Link from "next/link";

export default function EmployeeHistoryPage() {
  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div className="employee-sidebar-brand">
          <div className="employee-leaf-logo">
            
          </div>

          <div>
            <h2>EMS</h2>
            <span>Employee Panel</span>
          </div>
        </div>

        <nav>
          <Link href="/employee/dashboard">
            Dashboard
          </Link>

          <Link href="/employee/profile">
            My Profile
          </Link>

          <Link href="/employee/status">
            My Status
          </Link>

          <Link href="/employee/history" className="active">
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
            <h1>Status History</h1>
            <p>View your previous status updates.</p>
          </div>

          <div className="admin-profile">
            <div className="profile-circle">R</div>

            <div>
              <strong>Rahul Sharma</strong>
              <span>Software Developer</span>
            </div>
          </div>
        </header>

        <div className="employee-history-section">
          <div className="employee-history-card">
            <div className="employee-history-card-header">
              <div>
                <span>ACTIVITY</span>
                <h2>Status History</h2>
                <p>Your previous status changes are shown below.</p>
              </div>

              <Link
                href="/employee/status"
                className="history-update-button"
              >
                Update Status →
              </Link>
            </div>

            <div className="employee-history-table-wrapper">
              <table className="employee-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Duration</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>05 Sep 2026</td>
                    <td>
                      <span className="history-status available">
                        Available
                      </span>
                    </td>
                    <td>10:30 AM</td>
                    <td>Present</td>
                    <td>Current</td>
                  </tr>

                  <tr>
                    <td>05 Sep 2026</td>
                    <td>
                      <span className="history-status working">
                        Working
                      </span>
                    </td>
                    <td>09:15 AM</td>
                    <td>10:30 AM</td>
                    <td>1h 15m</td>
                  </tr>

                  <tr>
                    <td>04 Sep 2026</td>
                    <td>
                      <span className="history-status break">
                        Break
                      </span>
                    </td>
                    <td>01:00 PM</td>
                    <td>01:30 PM</td>
                    <td>30m</td>
                  </tr>

                  <tr>
                    <td>04 Sep 2026</td>
                    <td>
                      <span className="history-status working">
                        Working
                      </span>
                    </td>
                    <td>09:20 AM</td>
                    <td>06:00 PM</td>
                    <td>8h 40m</td>
                  </tr>

                  <tr>
                    <td>03 Sep 2026</td>
                    <td>
                      <span className="history-status offline">
                        Offline
                      </span>
                    </td>
                    <td>06:00 PM</td>
                    <td>Next Day</td>
                    <td>14h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="employee-history-summary">
            <div>
              <span>Total Status Updates</span>
              <strong>24</strong>
            </div>

            <div>
              <span>Working Time Today</span>
              <strong>1h 15m</strong>
            </div>

            <div>
              <span>Current Status</span>
              <strong className="history-current-status">
                Available
              </strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}