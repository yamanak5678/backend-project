"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/lib/api";

export default function AddEmployeePage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("Active");
    const [joiningDate, setJoiningDate] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const name = `${firstName.trim()} ${lastName.trim()}`.trim();

        if (!name) {
            setError("First name or last name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!phone.trim()) {
            setError("Phone number is required.");
            return;
        }

        if (!department) {
            setError("Please select a department.");
            return;
        }

        if (!designation.trim()) {
            setError("Designation is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (!joiningDate) {
            setError("Joining date is required.");
            return;
        }

        try {
            setLoading(true);

            const response = await apiJson<{
                message: string;
                employee: unknown;
            }>("/admin/employees", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email: email.trim(),
                    password,
                    phone: phone.trim(),
                    department,
                    position: designation.trim(),
                    joiningDate,
                    status
                })
            });

            setSuccess(
                response.message ||
                    "Employee created successfully."
            );

            // Go back to employee list after successful creation
            setTimeout(() => {
                router.push("/admin/employees");
                router.refresh();
            }, 800);

        } catch (cause) {
            console.error(
                "Create employee error:",
                cause
            );

            setError(
                cause instanceof Error
                    ? cause.message
                    : "Failed to create employee."
            );
        } finally {
            setLoading(false);
        }
    };

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

                    <form onSubmit={handleSubmit}>

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
                                    placeholder="Enter phone number"
                                    value={phone}
                                    maxLength={10}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
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
                                    value={department}
                                    onChange={(event) =>
                                        setDepartment(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="" disabled>
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
                                    value={designation}
                                    onChange={(event) =>
                                        setDesignation(
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                        </div>

                        {/* Joining Date */}
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
                                    value={password}
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

                        {/* Status */}
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

                        {/* Error */}
                        {error && (
                            <div
                                style={{
                                    color: "red",
                                    marginTop: "12px"
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div
                                style={{
                                    color: "green",
                                    marginTop: "12px"
                                }}
                            >
                                {success}
                            </div>
                        )}

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