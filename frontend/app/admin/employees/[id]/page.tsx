import Link from "next/link";

const employees = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    department: "Development",
    designation: "Software Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya@example.com",
    phone: "9876543211",
    department: "HR",
    designation: "HR Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "9876543212",
    department: "Design",
    designation: "UI Designer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Neha Verma",
    email: "neha@example.com",
    phone: "9876543213",
    department: "Development",
    designation: "Frontend Developer",
    status: "Active",
  },
  {
    id: 5,
    name: "Vikas Gupta",
    email: "vikas@example.com",
    phone: "9876543214",
    department: "Marketing",
    designation: "Marketing Executive",
    status: "Active",
  },
];

export default async function EmployeeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const employee = employees.find(
    (item) => item.id === Number(id)
  );

  if (!employee) {
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
            <Link href="/">
              Logout
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <section className="dashboard-content">

          <header className="dashboard-header">
            <div>
              <h1>Employee Not Found</h1>

              <p>
                The employee you are trying to view
                does not exist.
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

        {/* Employee Details */}
        <div className="employee-details-section">

          {/* Employee Header */}
          <div className="employee-details-header">

            <div className="large-employee-avatar">
              {employee.name.charAt(0)}
            </div>

            <div>
              <h2>{employee.name}</h2>

              <p>
                {employee.designation}
              </p>

              <span
                className={`status ${
                  employee.status === "Active"
                    ? "active-status"
                    : "inactive-status"
                }`}
              >
                {employee.status}
              </span>
            </div>

          </div>

          {/* Employee Information */}
          <div className="employee-information">

            <div className="employee-info-item">
              <span>
                Email Address
              </span>

              <strong>
                {employee.email}
              </strong>
            </div>

            <div className="employee-info-item">
              <span>
                Phone Number
              </span>

              <strong>
                {employee.phone}
              </strong>
            </div>

            <div className="employee-info-item">
              <span>
                Department
              </span>

              <strong>
                {employee.department}
              </strong>
            </div>

            <div className="employee-info-item">
              <span>
                Designation
              </span>

              <strong>
                {employee.designation}
              </strong>
            </div>

            <div className="employee-info-item">
              <span>
                Employee ID
              </span>

              <strong>
                {employee.id}
              </strong>
            </div>

            <div className="employee-info-item">
              <span>
                Status
              </span>

              <strong>
                <span
                  className={`status ${
                    employee.status === "Active"
                      ? "active-status"
                      : "inactive-status"
                  }`}
                >
                  {employee.status}
                </span>
              </strong>
            </div>

          </div>

          {/* Buttons */}
          <div className="employee-details-actions">

            <Link
              href="/admin/employees"
              className="back-employees-button"
            >
              Back to Employees
            </Link>

            <Link
              href={`/admin/employees/${employee.id}/edit`}
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