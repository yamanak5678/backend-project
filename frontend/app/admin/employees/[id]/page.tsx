  "use client";

  import Link from "next/link";
  import { useEffect, useState } from "react";
  import { useParams } from "next/navigation";

  import { apiJson } from "@/lib/api";

  type Employee = {
      EmployeeId: number | string;
      UserId?: number | string;
      Name?: string;
      Email?: string;
      Phone?: string;
      Department?: string;
      Position?: string;
      JoiningDate?: string;
      DateOfBirth?: string | null;
      Address?: string | null;
  };

  export default function EmployeeDetailsPage() {
      const params = useParams();
      const id = params.id as string;

      const [employee, setEmployee] = useState<Employee | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState("");

      useEffect(() => {
          const fetchEmployee = async () => {
              try {
                  setLoading(true);
                  setError("");

                  const data = await apiJson<Employee>(
                      `/admin/employees/${id}`,
                      {
                          cache: "no-store",
                      }
                  );

                  setEmployee(data);
              } catch (cause) {
                  console.error("Employee details error:", cause);

                  setError(
                      cause instanceof Error
                          ? cause.message
                          : "Failed to load employee."
                  );
              } finally {
                  setLoading(false);
              }
          };

          if (id) {
              void fetchEmployee();
          }
      }, [id]);

      if (loading) {
          return (
              <main className="dashboard-page">
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
                          <Link href="/">Logout</Link>
                      </div>
                  </aside>

                  <section className="dashboard-content">
                      <h1>Loading Employee...</h1>
                  </section>
              </main>
          );
      }

      if (error || !employee) {
          return (
              <main className="dashboard-page">
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
                          <Link href="/">Logout</Link>
                      </div>
                  </aside>

                  <section className="dashboard-content">
                      <header className="dashboard-header">
                          <div>
                              <h1>Employee Not Found</h1>

                              <p>
                                  {error ||
                                      "The employee you are trying to view does not exist."}
                              </p>
                          </div>
                      </header>

                      <div className="employee-not-found">
                          <h2>No Employee Found</h2>

                          <p>
                              Please go back and select a valid employee.
                          </p>

                          <Link
                              href="/admin/employees"
                              className="back-employees-button"
                          >
                              Back to Employees
                          </Link>
                      </div>
                  </section>
              </main>
          );
      }

      const name = employee.Name ?? "Unknown Employee";

      return (
          <main className="dashboard-page">
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
                      <Link href="/">Logout</Link>
                  </div>
              </aside>

              <section className="dashboard-content">
                  <header className="dashboard-header">
                      <div>
                          <h1>Employee Details</h1>

                          <p>
                              View employee information.
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

                  <div className="employee-details-section">
                      <div className="employee-details-header">
                          <div className="large-employee-avatar">
                              {name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                              <h2>{name}</h2>

                              <p>
                                  {employee.Position ?? "Employee"}
                              </p>
                          </div>
                      </div>

                      <div className="employee-information">
                          <div className="employee-info-item">
                              <span>Email Address</span>
                              <strong>
                                  {employee.Email ?? "N/A"}
                              </strong>
                          </div>

                          <div className="employee-info-item">
                              <span>Phone Number</span>
                              <strong>
                                  {employee.Phone ?? "N/A"}
                              </strong>
                          </div>

                          <div className="employee-info-item">
                              <span>Department</span>
                              <strong>
                                  {employee.Department ?? "N/A"}
                              </strong>
                          </div>

                          <div className="employee-info-item">
                              <span>Designation</span>
                              <strong>
                                  {employee.Position ?? "N/A"}
                              </strong>
                          </div>

                          <div className="employee-info-item">
                              <span>Employee ID</span>
                              <strong>
                                  {employee.EmployeeId}
                              </strong>
                          </div>

                          <div className="employee-info-item">
                              <span>Joining Date</span>
                              <strong>
                                  {employee.JoiningDate
                                      ? new Date(
                                            employee.JoiningDate
                                        ).toLocaleDateString("en-IN")
                                      : "N/A"}
                              </strong>
                          </div>
                      </div>

                      <div className="employee-details-actions">
                          <Link
                              href="/admin/employees"
                              className="back-employees-button"
                          >
                              Back to Employees
                          </Link>

                          <Link
                              href={`/admin/employees/${employee.EmployeeId}/edit`}
                              className="edit-employee-details-button"
                          >
                              Edit Employee
                          </Link>
                      </div>
                  </div>
              </section>
          </main>
      );
  }