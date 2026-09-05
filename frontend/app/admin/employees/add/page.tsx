"use client";

import Link from "next/link";
import { useState } from "react";

export default function AddEmployeePage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="dashboard-page">

      {/* Sidebar */}
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
            <h1>Add Employee</h1>
            <p>
              Create a new employee account.
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

        {/* Add Employee Form */}
        <div className="add-employee-section">

          <div className="add-employee-header">
            <h2>Employee Information</h2>

            <p>
              Enter the employee details below.
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
                  placeholder="Enter first name"
                />
              </div>

              <div className="employee-form-group">
                <label htmlFor="lastName">
                  Last Name
                </label>

                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter last name"
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
                  placeholder="Enter email address"
                />
              </div>

              <div className="employee-form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
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
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    Select department
                  </option>

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
                  placeholder="Enter designation"
                />
              </div>

            </div>

            {/* Password */}
            <div className="employee-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="employee-password-box">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  className="employee-show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* Status */}
            <div className="employee-form-group">

              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                defaultValue="Active"
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
                href="/admin/employees"
                className="cancel-employee-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="create-employee-button"
              >
                Create Employee
              </button>

            </div>

          </form>
        </div>
      </section>
    </main>
  );
}