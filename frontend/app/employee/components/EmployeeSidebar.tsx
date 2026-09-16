"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  Activity,
  Clock3,
  LogOut,
} from "lucide-react";

export default function EmployeeSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    router.push("/");
  };

  const navItems = [
    {
      href: "/employee/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/employee/profile",
      label: "My Profile",
      icon: User,
    },
    {
      href: "/employee/status",
      label: "My Status",
      icon: Activity,
    },
    {
      href: "/employee/history",
      label: "Status History",
      icon: Clock3,
    },
  ];

  return (
    <aside className="employee-sidebar">
      {/* Brand */}
      <div className="employee-sidebar-brand">
        <div className="employee-brand-icon">E</div>

        <div>
          <h2>EMS</h2>
          <span>Employee Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="employee-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`employee-nav-link ${
                isActive ? "active" : ""
              }`}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="employee-sidebar-logout">
        <button
          type="button"
          className="employee-nav-link employee-logout-button"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}