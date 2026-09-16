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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
        setError("Full Name is required.");
        return;
    }

    if (trimmedName.length < 2 || trimmedName.length > 100) {
        setError("Full Name must be between 2 and 100 characters.");
        return;
    }

    if (!/^[A-Za-z ]+$/.test(trimmedName)) {
        setError("Full Name can contain only letters and spaces.");
        return;
    }
  const trimmedEmail = email.trim();

if (!trimmedEmail) {
    setError("Email Address is required.");
    return;
}

if (trimmedEmail.length > 150) {
    setError("Email Address must not exceed 150 characters.");
    return;
}

const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

if (!emailPattern.test(trimmedEmail)) {
    setError("Please enter a valid email address.");
    return;
}

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
    setError("Please enter a valid email address.");
    return;
}

if (
    !emailDomain ||
    emailDomain.startsWith(".") ||
    emailDomain.endsWith(".") ||
    emailDomain.includes("..") ||
    !allowedDomains.includes(
        emailDomain.toLowerCase()
    )
) {
    setError(
        "Please use a valid email domain such as gmail.com, yahoo.com, outlook.com, hotmail.com or icloud.com."
    );
    return;
}

const trimmedPhone = phone.trim();

if (!trimmedPhone) {
    setError("Phone Number is required.");
    return;
}

if (!/^\d+$/.test(trimmedPhone)) {
    setError("Phone Number can contain only numbers.");
    return;
}

if (trimmedPhone.length !== 10) {
    setError("Phone Number must be exactly 10 digits.");
    return;
    
}
const validDepartments = [
    "Development",
    "HR",
    "Design",
    "Marketing",
    "Finance",
    "QA",
    "Operations",
];

if (!department.trim()) {
    setError("Department is required.");
    return;
}

if (!validDepartments.includes(department)) {
    setError("Please select a valid department.");
    return;
}

const trimmedJoiningDate = joiningDate.trim();

if (!trimmedJoiningDate) {
    setError("Joining Date is required.");
    return;
}

const [year, month, day] = trimmedJoiningDate
    .split("-")
    .map(Number);

const selectedDate = new Date(year, month - 1, day);
const today = new Date();

selectedDate.setHours(0, 0, 0, 0);
today.setHours(0, 0, 0, 0);

if (
    Number.isNaN(selectedDate.getTime()) ||
    selectedDate.getFullYear() !== year ||
    selectedDate.getMonth() !== month - 1 ||
    selectedDate.getDate() !== day
) {
    setError("Please enter a valid Joining Date.");
    return;
}

if (selectedDate > today) {
    setError("Joining Date cannot be in the future.");
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