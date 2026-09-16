"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-leaf">🌿</div>

        <div>
          <div className="sidebar-brand-title">EMS</div>
          <div className="sidebar-brand-subtitle">Admin Panel</div>
        </div>
      </div>

      <nav>
        <Link
          href="/admin/dashboard"
          className={pathname === "/admin/dashboard" ? "active" : ""}
        >
          <span className="menu-icon">⌂</span>
          Dashboard
        </Link>

        <Link
          href="/admin/employees"
          className={pathname.startsWith("/admin/employees") ? "active" : ""}
        >
          <span className="menu-icon">♙</span>
          Employees
        </Link>

        <Link
          href="/admin/deleted-employees"
          className={
            pathname.startsWith("/admin/deleted-employees") ? "active" : ""
          }
        >
          <span className="menu-icon">🗑</span>
          Deleted Employees
        </Link>

        <Link
          href="/admin/statuses"
          className={pathname.startsWith("/admin/statuses") ? "active" : ""}
        >
          <span className="menu-icon">〽</span>
          Statuses
        </Link>

        <Link
          href="/admin/reports"
          className={pathname.startsWith("/admin/reports") ? "active" : ""}
        >
          <span className="menu-icon">▥</span>
          Reports
        </Link>
      </nav>

      <div className="sidebar-bottom">
        <Link href="/">
          <span className="menu-icon">↪</span>
          Logout
        </Link>
      </div>
    </aside>
  );
}