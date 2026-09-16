  "use client";

  import Link from "next/link";
  import { FormEvent, useState } from "react";

  const API_URL = "http://localhost:5000/api/v1";

  export default function AddEmployeePage() {
    const [showPassword, setShowPassword] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [joiningDate, setJoiningDate] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("Active");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] =
      useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState("");

    const handleCreateEmployee = async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault();

      setError("");
      setValidationErrors([]);

      const errors: string[] = [];

        /* =========================================
        FIRST NAME
        ========================================= */
      const trimmedFirstName = firstName.trim();

      if (!trimmedFirstName) {
        errors.push("First Name is required.");
      } else if (trimmedFirstName.length < 2) {
        errors.push(
          "First Name must be at least 2 characters."
        );
      } else if (trimmedFirstName.length > 100) {
        errors.push(
          "First Name must not exceed 100 characters."
        );
      } else if (!/^[A-Za-z ]+$/.test(trimmedFirstName)) {
        errors.push(
          "First Name can contain only letters and spaces."
        );
      }

      /* =========================================
        LAST NAME
        ========================================= */
      const trimmedLastName = lastName.trim();

      if (!trimmedLastName) {
        errors.push("Last Name is required.");
      } else if (trimmedLastName.length < 2) {
        errors.push(
          "Last Name must be at least 2 characters."
        );
      } else if (trimmedLastName.length > 100) {
        errors.push(
          "Last Name must not exceed 100 characters."
        );
      } else if (!/^[A-Za-z ]+$/.test(trimmedLastName)) {
        errors.push(
          "Last Name can contain only letters and spaces."
        );
      }

      /* =========================================
        EMAIL
        ========================================= */
      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        errors.push("Email Address is required.");
      } else if (trimmedEmail.length > 150) {
        errors.push(
          "Email Address must not exceed 150 characters."
        );
      } else {
        const emailPattern =
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailPattern.test(trimmedEmail)) {
          errors.push(
            "Please enter a valid email address."
          );
        } else {
          const [emailName, emailDomain] =
            trimmedEmail.split("@");

          const allowedDomains = [
            "gmail.com",
            "yahoo.com",
            "outlook.com",
            "hotmail.com",
            "icloud.com",
          ];

          if (
            !emailName ||
            emailName.startsWith(".") ||
            emailName.endsWith(".") ||
            emailName.includes("..")
          ) {
            errors.push(
              "Please enter a valid email address."
            );
          } else if (
            !emailDomain ||
            emailDomain.startsWith(".") ||
            emailDomain.endsWith(".") ||
            emailDomain.includes("..") ||
            !allowedDomains.includes(
              emailDomain.toLowerCase()
            )
          ) {
            errors.push(
              "Please use a valid email domain such as gmail.com, yahoo.com, outlook.com, hotmail.com or icloud.com."
            );
          }
        }
      }

      /* =========================================
        PHONE
        ========================================= */
      const trimmedPhone = phone.trim();

      if (!trimmedPhone) {
        errors.push("Phone Number is required.");
      } else if (!/^\d+$/.test(trimmedPhone)) {
        errors.push(
          "Phone Number can contain only numbers."
        );
      } else if (trimmedPhone.length !== 10) {
        errors.push(
          "Phone Number must be exactly 10 digits."
        );
      }

      /* =========================================
        DEPARTMENT
        ========================================= */
      const validDepartments = [
        "Development",
        "HR",
        "Design",
        "Marketing",
        "Finance",
      ];

      const trimmedDepartment = department.trim();

      if (!trimmedDepartment) {
        errors.push("Department is required.");
      } else if (
        !validDepartments.includes(trimmedDepartment)
      ) {
        errors.push(
          "Please select a valid department."
        );
      }


      /* =========================================
        JOINING DATE
        ========================================= */
      if (!joiningDate) {
        errors.push("Joining Date is required.");
      } else {
        const dateParts = joiningDate.split("-");

        const year = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const day = Number(dateParts[2]);

        const selectedDate = new Date(
          year,
          month - 1,
          day
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isRealDate =
          dateParts.length === 3 &&
          /^\d{4}-\d{2}-\d{2}$/.test(joiningDate) &&
          Number.isInteger(year) &&
          Number.isInteger(month) &&
          Number.isInteger(day) &&
          month >= 1 &&
          month <= 12 &&
          day >= 1 &&
          day <= 31 &&
          selectedDate.getFullYear() === year &&
          selectedDate.getMonth() === month - 1 &&
          selectedDate.getDate() === day;

        if (!isRealDate) {
          errors.push(
            "Joining Date must be a valid date."
          );
        } else if (selectedDate > today) {
          errors.push(
            "Joining Date cannot be a future date."
          );
        }
      }

      /* =========================================
        PASSWORD
        ========================================= */
      if (!password) {
        errors.push("Password is required.");
      } else if (password.length < 6) {
        errors.push(
          "Password must be at least 6 characters long."
        );
      } else if (password.length > 100) {
        errors.push(
          "Password must not exceed 100 characters."
        );
      } else if (/\s/.test(password)) {
        errors.push(
          "Password must not contain spaces."
        );
      }

      /* =========================================
        STATUS
        ========================================= */
      const validStatuses = [
        "Active",
        "Inactive",
      ];

      if (!validStatuses.includes(status)) {
        errors.push(
          "Status must be Active or Inactive."
        );
      }
     
      /* =========================================
        STOP IF VALIDATION FAILED
        ========================================= */
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      setLoading(true);

      try {
        const token =
          localStorage.getItem("accessToken");

        if (!token) {
          setError(
            "Access token not found. Please login again."
          );
          return;
        }

        /*
        * Backend expects one name field.
        * First Name + Last Name are combined here.
        */
        const fullName =
          `${firstName.trim()} ${lastName.trim()}`.trim();

        const response = await fetch(
          `${API_URL}/admin/employees`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: fullName,
              email: email.trim(),
              phone: phone.trim(),
              department: department.trim(),
              joiningDate,
              password,
              status,
            }),
          }
        );

        const data = await response.json();

        /* =========================================
          BACKEND VALIDATION / API ERROR
          ========================================= */
        if (!response.ok) {
          if (
            Array.isArray(data.errors) &&
            data.errors.length > 0
          ) {
            setValidationErrors(
              data.errors.map(
                (item: unknown) =>
                  String(item)
              )
            );
          } else {
            setError(
              data.message ||
                "Unable to create employee."
            );
          }

          return;
        }

        /* =========================================
          SUCCESS
          ========================================= */
        setSuccessMessage("Employee added successfully!");

            setTimeout(() => {
              setSuccessMessage("");
              window.location.href = "/admin/employees";
            }, 2000);

       
      } catch (err) {
        console.error(
          "Create employee error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to create employee."
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <main className="dashboard-page">
        {/* =================================
            SIDEBAR
            ================================= */}
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

        {/* =================================
            MAIN CONTENT
            ================================= */}
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

          {/* =================================
              EMPLOYEE FORM
              ================================= */}
          <div className="add-employee-section">
            <div className="add-employee-header">
              <h2>
                Employee Information
              </h2>

              <p>
                Enter the employee details
                below.
              </p>
            </div>

            <form
              onSubmit={
                handleCreateEmployee
              }
            >
              {/* =================================
                  FIRST NAME / LAST NAME
                  ================================= */}
              <div className="form-row">
                <div className="employee-form-group">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
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
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* =================================
                  EMAIL / PHONE
                  ================================= */}
              <div className="form-row">
                <div className="employee-form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                  />
                </div>

                <div className="employee-form-group">
                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10 digit phone number"
                    value={phone}
                    maxLength={10}
                    onChange={(event) => {
                      const value =
                        event.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setPhone(value);
                    }}
                  />
                </div>
              </div>

              {/* =================================
                  DEPARTMENT / DESIGNATION
                  ================================= */}
              <div className="form-row">
                <div className="employee-form-group">
                  <label htmlFor="department">
                    Department
                  </label>

                  <select
                    id="department"
                    value={department}
                    onChange={(event) =>
                      setDepartment(
                        event.target.value
                      )
                    }
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
              </div>
              {/* =================================
                  JOINING DATE
                  ================================= */}
              <div className="employee-form-group">
                <label htmlFor="joiningDate">
                  Joining Date
                </label>

                <input
                  id="joiningDate"
                  type="date"
                  value={joiningDate}
                  onChange={(event) =>
                    setJoiningDate(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* =================================
                  PASSWORD
                  ================================= */}
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
                    value={password}
                    autoComplete="new-password"
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="employee-show-password"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {/* =================================
                  STATUS
                  ================================= */}
              <div className="employee-form-group">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
{/* =================================
    SUCCESS POPUP
    ================================= */}
              {successMessage && (
                <div
                  style={{
                    position: "fixed",
                    top: "30px",
                    right: "30px",
                    zIndex: 9999,
                    background: "#10b981",
                    color: "#ffffff",
                    padding: "14px 22px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    fontWeight: 600,
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {successMessage}
                </div>
              )}
              {/* =================================
                  VALIDATION ERRORS
                  ================================= */}
              {validationErrors.length >
                0 && (
                <div
                  style={{
                    marginTop: "18px",
                    padding: "14px 16px",
                    border:
                      "1px solid #fecaca",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    color: "#b91c1c",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Please fix the following
                    errors:
                  </strong>

                  {validationErrors.map(
                    (message, index) => (
                      <div
                        key={`${message}-${index}`}
                        style={{
                          fontSize: "13px",
                          lineHeight: "1.6",
                        }}
                      >
                        • {message}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* =================================
                  GENERAL ERROR
                  ================================= */}
              {error && (
                <p
                  role="alert"
                  style={{
                    color: "#b91c1c",
                    marginTop: "15px",
                    fontWeight: 600,
                  }}
                >
                  {error}
                </p>
              )}

              {/* =================================
                  BUTTONS
                  ================================= */}
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
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create Employee"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    );
  }