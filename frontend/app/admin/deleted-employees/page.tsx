"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { apiJson } from "@/lib/api";

type DeletedEmployee = {
  DeletedEmployeeId: number;
  EmployeeId: number;
  UserId?: number | null;
  Name: string;
  Email: string;
  Phone?: string | null;
  Department?: string | null;
  Position?: string | null;
  JoiningDate?: string | null;
  DeletedAt: string;
};

export default function DeletedEmployeesPage() {
  const [employees, setEmployees] = useState<DeletedEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [restoringId, setRestoringId] = useState<number | null>(null);
  const [restoreEmployee, setRestoreEmployee] =useState<DeletedEmployee | null>(null);

  const fetchDeletedEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiJson<unknown>(
        "/admin/deleted-employees",
        {
          cache: "no-store",
        }
      );

      const list = Array.isArray(data)
        ? data
        : data &&
            typeof data === "object" &&
            "data" in data &&
            Array.isArray((data as { data: unknown }).data)
          ? (data as { data: DeletedEmployee[] }).data
          : [];

      setEmployees(list as DeletedEmployee[]);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Failed to load deleted employees."
      );
    } finally {
      setLoading(false);
    }
  };

 const handleRestoreEmployee = async (
  employee: DeletedEmployee
) => {
  try {
    setRestoringId(employee.DeletedEmployeeId);
    setError("");

    await apiJson(
      `/admin/deleted-employees/${employee.DeletedEmployeeId}/restore`,
      {
        method: "POST",
      }
    );

   

    setRestoreEmployee(null);

    await fetchDeletedEmployees();
  } catch (cause) {
    setError(
      cause instanceof Error
        ? cause.message
        : "Failed to restore employee."
    );
  } finally {
    setRestoringId(null);
  }
};

   

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void fetchDeletedEmployees();
  }, 0);

  return () => {
    window.clearTimeout(timer);
  };
}, []);

  return (
    <main className="dashboard-page">
      <AdminSidebar />

      <section className="dashboard-content">
        <div className="employees-section">
          <div className="employees-top">
            <div>
              <h1>Deleted Employees</h1>

              <p>
                View employees who have been deleted from the system.
              </p>
            </div>
          </div>

          <div className="employee-list-card">
            <div className="employee-list-header">
              <div>
                <h2>Deleted Employee List</h2>

                <p>
                  Deleted employee records and their previous details.
                </p>
              </div>
            </div>

            {loading && (
              <div className="employees-empty">
                Loading deleted employees...
              </div>
            )}

            {!loading && error && (
              <div className="employees-error">
                {error}
              </div>
            )}

            {!loading &&
              !error &&
              employees.length === 0 && (
                <div className="employees-empty">
                  No deleted employees found.
                </div>
              )}

            {!loading &&
              !error &&
              employees.length > 0 && (
                <div className="employee-table-wrapper">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Joining Date</th>
                        <th>Deleted At</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {employees.map((employee) => (
                        <tr
                          key={
                            employee.DeletedEmployeeId
                          }
                        >
                          <td>
                            {employee.Name}
                          </td>

                          <td>
                            {employee.Email}
                          </td>

                          <td>
                            {employee.Phone || "-"}
                          </td>

                          <td>
                            {employee.Department || "-"}
                          </td>

                          <td>
                            {employee.Position || "-"}
                          </td>

                          <td>
                            {employee.JoiningDate
                              ? new Date(
                                  employee.JoiningDate
                                ).toLocaleDateString()
                              : "-"}
                          </td>

                          <td>
                            {employee.DeletedAt
                              ? new Date(
                                  employee.DeletedAt
                                ).toLocaleString()
                              : "-"}
                          </td>

                          <td>
                            <button
                              type="button"
                              className="restore-button"
                              disabled={
                                restoringId ===
                                employee.DeletedEmployeeId
                              }
                             onClick={() => {
                                setRestoreEmployee(employee);
                                setError("");
                                }}
                            >
                              {restoringId ===
                              employee.DeletedEmployeeId
                                ? "Restoring..."
                                : "Restore"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
      </section>
      {restoreEmployee && (
  <div className="restore-modal-overlay">
    <div className="restore-modal">
      <div className="restore-modal-icon">
        ↻
      </div>

      <h3>Restore Employee</h3>

      <p>
        Are you sure you want to restore{" "}
        <strong>{restoreEmployee.Name}</strong>?
      </p>

      <div className="restore-modal-actions">
        <button
          type="button"
          className="restore-cancel-button"
          disabled={restoringId !== null}
          onClick={() => setRestoreEmployee(null)}
        >
          Cancel
        </button>

        <button
          type="button"
          className="restore-confirm-button"
          disabled={restoringId !== null}
          onClick={() =>
            void handleRestoreEmployee(
              restoreEmployee
            )
          }
        >
          {restoringId !== null
            ? "Restoring..."
            : "Restore Employee"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}