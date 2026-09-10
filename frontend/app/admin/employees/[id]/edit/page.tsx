"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

type Employee = {
    EmployeeId: number | string;
    UserId: number;
    Name: string;
    Email: string;
    Phone: string;
    Department: string;
    Position: string;
    JoiningDate: string;
    DateOfBirth?: string | null;
    Address?: string | null;
    CreatedAt?: string;
    UpdatedAt?: string;
};

export default function EditEmployeePage() {
    const params = useParams();
    const router = useRouter();

    const id = String(params.id);

    const [employee, setEmployee] =
        useState<Employee | null>(null);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [joiningDate, setJoiningDate] = useState("");

    // =========================================
    // LOAD EMPLOYEE
    // =========================================

    useEffect(() => {
        const loadEmployee = async () => {
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

                setName(data.Name || "");
                setEmail(data.Email || "");
                setPhone(data.Phone || "");
                setDepartment(data.Department || "");
                setPosition(data.Position || "");

                if (data.JoiningDate) {
                    setJoiningDate(
                        data.JoiningDate.substring(0, 10)
                    );
                }
            } catch (e) {
                console.error(
                    "Error loading employee:",
                    e
                );

                setError(
                    e instanceof Error
                        ? e.message
                        : "Failed to load employee."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadEmployee();
        }
    }, [id]);

    // =========================================
    // UPDATE EMPLOYEE
    // =========================================

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !name.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !department.trim() ||
            !position.trim() ||
            !joiningDate
        ) {
            setError(
                "Please fill all required fields."
            );
            return;
        }

        setUpdating(true);

        try {
            const updatedEmployee =
                await apiJson<Employee>(
                    `/admin/employees/${id}`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            name: name.trim(),
                            email: email.trim(),
                            phone: phone.trim(),
                            department: department.trim(),
                            position: position.trim(),
                            joiningDate,
                        }),
                    }
                );

            setEmployee(updatedEmployee);

            setSuccess(
                "Employee updated successfully."
            );

            // Update form with latest backend data
            setName(updatedEmployee.Name || "");
            setEmail(updatedEmployee.Email || "");
            setPhone(updatedEmployee.Phone || "");
            setDepartment(
                updatedEmployee.Department || ""
            );
            setPosition(
                updatedEmployee.Position || ""
            );

            if (updatedEmployee.JoiningDate) {
                setJoiningDate(
                    updatedEmployee.JoiningDate.substring(
                        0,
                        10
                    )
                );
            }

            // Go back to employee list
            setTimeout(() => {
                router.push("/admin/employees");
            }, 1000);
        } catch (e) {
            console.error(
                "Error updating employee:",
                e
            );

            setError(
                e instanceof Error
                    ? e.message
                    : "Failed to update employee."
            );
        } finally {
            setUpdating(false);
        }
    };

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <main className="dashboard-page">
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

                <section className="dashboard-content">
                    <header className="dashboard-header">
                        <div>
                            <h1>Edit Employee</h1>

                            <p>
                                Loading employee
                                information...
                            </p>
                        </div>
                    </header>

                    <div className="employee-not-found">
                        <h2>Loading...</h2>

                        <p>
                            Please wait while employee
                            information is loading.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    // =========================================
    // EMPLOYEE NOT FOUND
    // =========================================

    if (error && !employee) {
        return (
            <main className="dashboard-page">
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

                <section className="dashboard-content">
                    <header className="dashboard-header">
                        <div>
                            <h1>
                                Employee Not Found
                            </h1>

                            <p>
                                The employee you are
                                trying to edit could not
                                be loaded.
                            </p>
                        </div>
                    </header>

                    <div className="employee-not-found">
                        <h2>No Employee Found</h2>

                        <p>
                            Please go back and select a
                            valid employee.
                        </p>

                        <p
                            style={{
                                color: "#d92d20",
                                marginTop: "10px",
                                fontWeight: 600,
                            }}
                        >
                            {error}
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

    // =========================================
    // EDIT PAGE
    // =========================================

    return (
        <main className="dashboard-page">

            {/* ================================
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

            {/* ================================
                MAIN CONTENT
            ================================= */}

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
                            <span>
                                Administrator
                            </span>
                        </div>
                    </div>
                </header>

                {/* ================================
                    FORM
                ================================= */}

                <div className="add-employee-section">

                    <div className="add-employee-header">
                        <h2>
                            Employee Information
                        </h2>

                        <p>
                            Update the employee details
                            below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Name */}

                        <div className="employee-form-group">
                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter employee name"
                                required
                            />
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
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div className="employee-form-group">
                                <label htmlFor="phone">
                                    Phone Number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter phone number"
                                    required
                                />
                            </div>

                        </div>

                        {/* Department / Position */}

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
                                    required
                                >
                                    <option value="">
                                        Select Department
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

                                    <option value="QA">
                                        QA
                                    </option>

                                    <option value="Operations">
                                        Operations
                                    </option>
                                </select>
                            </div>

                            <div className="employee-form-group">
                                <label htmlFor="position">
                                    Position
                                </label>

                                <input
                                    id="position"
                                    type="text"
                                    value={position}
                                    onChange={(event) =>
                                        setPosition(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter position"
                                    required
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
                                required
                            />
                        </div>

                        {/* Error */}

                        {error && (
                            <p
                                style={{
                                    color: "#d92d20",
                                    marginTop: "15px",
                                    fontWeight: 600,
                                }}
                            >
                                {error}
                            </p>
                        )}

                        {/* Success */}

                        {success && (
                            <p
                                style={{
                                    color: "#008f7a",
                                    marginTop: "15px",
                                    fontWeight: 600,
                                }}
                            >
                                {success}
                            </p>
                        )}

                        {/* Buttons */}

                        <div className="add-employee-actions">

                            <Link
                                href={`/admin/employees/${id}`}
                                className="cancel-employee-button"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="create-employee-button"
                                disabled={updating}
                            >
                                {updating
                                    ? "Updating..."
                                    : "Update Employee"}
                            </button>

                        </div>

                    </form>
                </div>
            </section>
        </main>
    );
}