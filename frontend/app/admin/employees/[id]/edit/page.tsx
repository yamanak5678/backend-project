import Link from "next/link";

const employees = [
  {
    id: 1,
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    department: "Development",
    designation: "Software Developer",
    status: "Active",
  },
  {
    id: 2,
    firstName: "Priya",
    lastName: "Singh",
    email: "priya@example.com",
    phone: "9876543211",
    department: "HR",
    designation: "HR Manager",
    status: "Active",
  },
  {
    id: 3,
    firstName: "Amit",
    lastName: "Kumar",
    email: "amit@example.com",
    phone: "9876543212",
    department: "Design",
    designation: "UI Designer",
    status: "Inactive",
  },
  {
    id: 4,
    firstName: "Neha",
    lastName: "Verma",
    email: "neha@example.com",
    phone: "9876543213",
    department: "Development",
    designation: "Frontend Developer",
    status: "Active",
  },
  {
    id: 5,
    firstName: "Vikas",
    lastName: "Gupta",
    email: "vikas@example.com",
    phone: "9876543214",
    department: "Marketing",
    designation: "Marketing Executive",
    status: "Active",
  },
];

export default async function EditEmployeePage({
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
                The employee you are trying to edit
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
            <h1>Edit Employee</h1>

            <p>
              Update employee information.
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

        {/* Edit Form */}
        <div className="add-employee-section">

          <div className="add-employee-header">

            <h2>Employee Information</h2>

            <p>
              Update the employee details below.
            </p>

          </div>

          <form>

            {/* First Name / Last Name */}
            <div className="form-row">

              <div className="employee-form-group">

                <label htmlFor="firstName">
                  First Name
                </label>

                <input
                  id="firstName"
                  type="text"
                  defaultValue={employee.firstName}
                />

              </div>

              <div className="employee-form-group">

                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  defaultValue={employee.lastName}
                />

              </div>

            </div>

            {/* Email / Phone */}
            <div className="form-row">

              <div className="employee-form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  defaultValue={employee.email}
                />

              </div>

              <div className="employee-form-group">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  defaultValue={employee.phone}
                />

              </div>

            </div>

            {/* Department / Designation */}
            <div className="form-row">

              <div className="employee-form-group">

                <label htmlFor="department">
                  Department
                </label>

                <select
                  id="department"
                  defaultValue={employee.department}
                >
                  <option value="Development">
                    Development
                  </option>

                  <option value="HR">
                    HR
                  </option>

                  <option value="Design">
                    Design
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>

                  <option value="Finance">
                    Finance
                  </option>
                </select>

              </div>

              <div className="employee-form-group">

                <label htmlFor="designation">
                  Designation
                </label>

                <input
                  id="designation"
                  type="text"
                  defaultValue={employee.designation}
                />

              </div>

            </div>

            {/* Status */}
            <div className="employee-form-group">

              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                defaultValue={employee.status}
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>

            {/* Buttons */}
            <div className="add-employee-actions">

              <Link
                href={`/admin/employees/${employee.id}`}
                className="cancel-employee-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="create-employee-button"
              >
                Update Employee
              </button>

            </div>

          </form>

        </div>
      </section>
    </main>
  );
}