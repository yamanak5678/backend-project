"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api";

type Profile = {
    EmployeeId: number;
    Name?: string;
    Email?: string;
    Phone?: string;
    Department?: string;
    Position?: string;
    JoiningDate?: string;
};

export default function EmployeeProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [error, setError] = useState("");

    // Change password states
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void apiJson<Profile>("/employees/me")
                .then(setProfile)
                .catch((e: unknown) =>
                    setError(
                        e instanceof Error
                            ? e.message
                            : "Failed to load profile."
                    )
                );
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const handleChangePassword = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setPasswordMessage("");

        if (!currentPassword || !newPassword) {
            setPasswordMessage(
                "Current password and new password are required."
            );
            return;
        }

        if (newPassword.length < 6) {
            setPasswordMessage(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordMessage(
                "New password must be different from current password."
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

            setPasswordMessage("Password changed successfully.");

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

    const name = profile?.Name ?? "Employee";

    const [first, ...rest] = name.split(" ");

    const initial = name[0]?.toUpperCase() ?? "E";

    const info = (
        label: string,
        value?: string | number
    ) => (
        <div className="profile-info-item">
            <span>{label}</span>
            <strong>{value || "N/A"}</strong>
        </div>
    );

    return (
        <main className="dashboard-page">
            <aside className="sidebar">
                <div className="sidebar-logo">EMS</div>

                <h2>Employee Panel</h2>

                <nav>
                    <Link href="/employee/dashboard">
                        Dashboard
                    </Link>

                    <Link
                        href="/employee/profile"
                        className="active"
                    >
                        My Profile
                    </Link>

                    <Link href="/employee/status">
                        My Status
                    </Link>

                    <Link href="/employee/history">
                        Status History
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
                        <h1>My Profile</h1>
                        <p>
                            View your personal and employee information.
                        </p>
                    </div>

                    <div className="admin-profile">
                        <div className="profile-circle">
                            {initial}
                        </div>

                        <div>
                            <strong>{name}</strong>
                            <span>
                                {profile?.Position ?? "Employee"}
                            </span>
                        </div>
                    </div>
                </header>

                {error ? (
                    <div className="employee-not-found">
                        {error}
                    </div>
                ) : (
                    <div className="employee-profile-section">
                        <div className="employee-profile-header">
                            <div className="large-profile-circle">
                                {initial}
                            </div>

                            <div>
                                <h2>{name}</h2>

                                <p>
                                    {profile?.Position ?? "Employee"}
                                </p>

                                <span className="profile-active-status">
                                    Employee
                                </span>
                            </div>
                        </div>

                        <div className="employee-profile-content">
                            {/* Personal Information */}
                            <div className="profile-information-card">
                                <h2>Personal Information</h2>

                                <p>
                                    Your basic personal details.
                                </p>

                                <div className="profile-information-grid">
                                    {info(
                                        "First Name",
                                        first
                                    )}

                                    {info(
                                        "Last Name",
                                        rest.join(" ")
                                    )}

                                    {info(
                                        "Email Address",
                                        profile?.Email
                                    )}

                                    {info(
                                        "Phone Number",
                                        profile?.Phone
                                    )}
                                </div>
                            </div>

                            {/* Work Information */}
                            <div className="profile-information-card">
                                <h2>Work Information</h2>

                                <p>
                                    Your current employee information.
                                </p>

                                <div className="profile-information-grid">
                                    {info(
                                        "Employee ID",
                                        profile?.EmployeeId
                                    )}

                                    {info(
                                        "Department",
                                        profile?.Department
                                    )}

                                    {info(
                                        "Designation",
                                        profile?.Position
                                    )}

                                    {info(
                                        "Joining Date",
                                        profile?.JoiningDate
                                            ? new Date(
                                                  profile.JoiningDate
                                              ).toLocaleDateString(
                                                  "en-IN",
                                                  {
                                                      day: "2-digit",
                                                      month: "long",
                                                      year: "numeric",
                                                  }
                                              )
                                            : undefined
                                    )}
                                </div>
                            </div>

                            {/* Change Password */}
                            <div className="profile-information-card">
                                <h2>Change Password</h2>

                                <p>
                                    Update your account password.
                                </p>

                                <form
                                    onSubmit={handleChangePassword}
                                >
                                    <div className="profile-information-grid">
                                        <div className="profile-info-item">
                                            <span>
                                                Current Password
                                            </span>

                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(event) =>
                                                    setCurrentPassword(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter current password"
                                                required
                                            />
                                        </div>

                                        <div className="profile-info-item">
                                            <span>
                                                New Password
                                            </span>

                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(event) =>
                                                    setNewPassword(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter new password"
                                                minLength={6}
                                                required
                                            />
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

                                    {passwordMessage && (
                                        <p>
                                            {passwordMessage}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>

                        <div className="profile-note">
                            <strong>
                                Profile Information
                            </strong>

                            <p>
                                Your profile is loaded from the
                                Employee Management System database.
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}