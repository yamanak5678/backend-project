    "use client";

      import Link from "next/link";
      import AdminSidebar from "@/components/AdminSidebar";
      import { useEffect, useState } from "react";
      import { apiJson } from "@/lib/api";

      type ApiEmployee = {
      EmployeeId: number;
      Name?: string;
      Email?: string;
      Department?: string;
      JoiningDate?: string;
      CreatedAt?: string;
    };
      type ApiStatus = {
          StatusId: number;
          EmployeeId: number;
          Status: string;
          CreatedAt?: string;
          UpdatedAt?: string;
        };
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
        const [currentPassword, setCurrentPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [showCurrentPassword, setShowCurrentPassword] = useState(false);
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [changingPassword, setChangingPassword] = useState(false);
        const [passwordMessage, setPasswordMessage] = useState(""); 
    
        useEffect(() => {
          const timer = window.setTimeout(() => {
            void (async () => {
              try {
                const [employeeData, statusData] = await Promise.all([
                  apiJson<unknown>("/admin/employees", { cache: "no-store" }),
                  apiJson<unknown>("/admin/statuses", { cache: "no-store" }),
                ]);
                const statuses = toList<ApiStatus>(statusData, "statuses");
               
                console.log("RAW STATUS DATA:", statusData);
                console.log("PARSED STATUSES:", statuses);
                console.log("STATUS COUNT:", statuses.length);
                 console.log("UNIQUE STATUS VALUES:", [
                      ...new Set(statuses.map((item) => item.Status)),
                    ]);

                    console.log("FIRST 10 STATUSES:", statuses.slice(0, 10));
                    console.log(
                      "FIRST 10 STATUS EMPLOYEE IDs:",
                            statuses.slice(0, 10).map((item) => ({
                        EmployeeId: item.EmployeeId,
                        Status: item.Status,
                      }))
                    );

                    console.log(
                      "EMPLOYEE IDs:",
                      toList<ApiEmployee>(employeeData, "employees")
                        .slice(0, 10)
                        .map((employee) => employee.EmployeeId)
                    );
                const latestStatuses = new Map<number, ApiStatus>();

                  for (const status of statuses) {
                    const employeeId = Number(status.EmployeeId);

                    const statusTime = new Date(
                      status.UpdatedAt ?? status.CreatedAt ?? ""
                    ).getTime();

                    const previous = latestStatuses.get(employeeId);

                    const previousTime = previous
                      ? new Date(
                          previous.UpdatedAt ?? previous.CreatedAt ?? ""
                        ).getTime()
                      : 0;

                    if (!previous || statusTime > previousTime) {
                      latestStatuses.set(employeeId, status);
                    }
                  }
                  console.log(
                      "LATEST STATUS MAP SAMPLE:",
                      Array.from(latestStatuses.entries()).slice(0, 10)
                    );

                    console.log(
                      "EMPLOYEE + MATCH SAMPLE:",
                      toList<ApiEmployee>(employeeData, "employees")
                        .slice(0, 10)
                        .map((employee) => ({
                          employeeId: employee.EmployeeId,
                          name: employee.Name,
                          matchedStatus:
                            latestStatuses.get(
                              Number(employee.EmployeeId)
                            )?.Status ?? "NO MATCH",
                        }))
                    );
                const today = new Date().toDateString();
                setStatusUpdatesToday(statuses.filter((status) => status.CreatedAt && new Date(status.CreatedAt).toDateString() === today).length);
                setEmployees(toList<ApiEmployee>(employeeData, "employees").map((employee) => {
                  const name = employee.Name ?? "Unknown Employee";

    const joinedDate = employee.JoiningDate
      ? new Date(employee.JoiningDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

    const joinedTime = employee.CreatedAt
      ? new Date(employee.CreatedAt).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return {
      id: employee.EmployeeId,
      name,
      email: employee.Email ?? "N/A",
      department: employee.Department ?? "N/A",
      status:
        latestStatuses.get(Number(employee.EmployeeId))?.Status ?? "Inactive",
      date: joinedTime ? `${joinedDate} • ${joinedTime}` : joinedDate,
      initial: name.charAt(0).toUpperCase(),
      avatar: "green",
    };
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
        const currentDate = new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
        const handleChangePassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setPasswordMessage("");

      if (!currentPassword) {
    setPasswordMessage("Please enter your current password.");
    return;
  }

  if (!newPassword) {
    setPasswordMessage("Please enter a new password.");
    return;
  }

  if (newPassword.length < 8) {
    setPasswordMessage(
      "New password must be at least 8 characters long."
    );
    return;
  }

  if (!/[A-Z]/.test(newPassword)) {
    setPasswordMessage(
      "New password must contain at least one uppercase letter."
    );
    return;
  }

  if (!/[a-z]/.test(newPassword)) {
    setPasswordMessage(
      "New password must contain at least one lowercase letter."
    );
    return;
  }

  if (!/[0-9]/.test(newPassword)) {
    setPasswordMessage(
      "New password must contain at least one number."
    );
    return;
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]\\\\/~`+;'=]/.test(newPassword)) {
    setPasswordMessage(
      "New password must contain at least one special character."
    );
    return;
  }

  if (/\s/.test(newPassword)) {
    setPasswordMessage(
      "New password must not contain spaces."
    );
    return;
  }

  if (currentPassword === newPassword) {
    setPasswordMessage(
      "New password must be different from your current password."
    );
    return;
  }

        setChangingPassword(true);

        try {
            await apiJson("/auth/change-password", {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            setPasswordMessage(
                "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
        } catch (e) {
            setPasswordMessage(
                e instanceof Error
                    ? e.message
                    : "Failed to change password."
            );
        } finally {
            setChangingPassword(false);
        }
    };
        return (
          <main className="dashboard-page">
            <AdminSidebar />

            <section className="dashboard-content">
              <header className="dashboard-header">
                <div>
                  <h1>Dashboard</h1>
                  <p>Welcome back, Admin! 👋</p>
                </div>

                <div className="admin-header-right">
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
                📅 {currentDate}
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
              <section className="profile-information-card admin-change-password-card">
                    <h2>Change Password</h2>

                  <p>
                    Update your admin account password.
                          </p>

                    <form onSubmit={handleChangePassword}>
                    <div className="admin-password-grid">
                    <div className="profile-info-item">
                    <span>Current Password</span>

                  <div className="password-input-wrapper">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      placeholder="Enter current password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? "Hide" : "Show"}
                    </button>
  </div>
                </div>

                <div className="profile-info-item">
                    <span>New Password</span>

                  <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="Enter new password"
                    minLength={8}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowNewPassword(!showNewPassword)
                    }
                  >
                    {showNewPassword ? "Hide" : "Show"}
                  </button>
  </div>
                  </div>

                  <button
                      type="submit"
                      disabled={changingPassword}
                  >
                      {changingPassword
                          ? "Changing..."
                          : "Change Password"}
                  </button>
          </div>
            {passwordMessage && (
              <p className="password-message" role="alert">
                {passwordMessage}
              </p>
            )}
        </form>
    </section>
            </section>
          </main>
        );
      }
