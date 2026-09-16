"use client";

import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { useCallback, useEffect, useState } from "react";
import { apiFetch, apiJson } from "@/lib/api";

type Status = {
  StatusId: number;
  EmployeeId: number;
  EmployeeName?: string;
  EmployeeEmail?: string;
  Status: string;
  Description?: string;
  CreatedAt?: string;
};
const options = ["Active", "Inactive", "On Leave", "Work From Home"];

export default function StatusesPage() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Status | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { const data = await apiJson<unknown>("/admin/statuses", { cache: "no-store" }); setStatuses(Array.isArray(data) ? data as Status[] : []); setMessage(""); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Failed to load statuses."); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const resetForm = () => { setShowForm(false); setEditing(null); setEmployeeId(""); setStatus("Active"); setDescription(""); };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true);
    try {
      const path = editing ? `/admin/statuses/${editing.StatusId}` : "/admin/statuses";
      const body = editing ? { status, description } : { employeeId: Number(employeeId), status, description };
      await apiFetch(path, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      resetForm(); await load(); setMessage(editing ? "Status updated successfully." : "Status added successfully.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Unable to save status."); }
    finally { setSaving(false); }
  };
  const edit = (item: Status) => { setEditing(item); setStatus(item.Status); setDescription(item.Description ?? ""); setShowForm(true); };
  const remove = async (statusId: number) => {
    if (!window.confirm("Delete this status record?")) return;
    setSaving(true);
    try { await apiFetch(`/admin/statuses/${statusId}`, { method: "DELETE" }); await load(); setMessage("Status deleted successfully."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Unable to delete status."); }
    finally { setSaving(false); }
  };
const filtered = statuses.filter((item) => {
  const searchValue = search.trim().toLowerCase();

  if (searchValue.length === 1) {
    return false;
  }

  return `${item.EmployeeId} ${item.EmployeeName ?? ""} ${item.EmployeeEmail ?? ""} ${item.Status} ${item.Description ?? ""}`
    .toLowerCase()
    .includes(searchValue);
});

  return <main className="dashboard-page"> <AdminSidebar /><section className="dashboard-content"><header className="dashboard-header"><div><h1>Statuses</h1><p>Manage employee status records.</p></div><div className="admin-profile"><div className="profile-circle">A</div><div><strong>Admin</strong><span>Administrator</span></div></div></header><div className="statuses-section"><div className="statuses-top"><div><h2>Status List</h2><p>View and manage all employee statuses.</p></div><button type="button" className="add-status-button" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Status</button></div>{message && <p role="alert">{message}</p>}{showForm && <form className="today-status-edit" onSubmit={submit}>{!editing && <input type="number" min="1" required value={employeeId} 
onChange={(event) => {
  const value = event.target.value;

  if (/^[A-Za-z0-9 ._-]*$/.test(value)) {
    setSearch(value.slice(0, 50));
  }
}} placeholder="Employee ID" />}<select value={status} onChange={(event) => setStatus(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><input required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" /><button type="submit" disabled={saving}>{editing ? "Save" : "Add"}</button><button type="button" onClick={resetForm} disabled={saving}>Cancel</button></form>}<div className="status-search">
 <input
  type="search"
  placeholder="Search by employee ID, status or description..."
  value={search}
  minLength={2}
  maxLength={50}
  onChange={(event) => {
    const value = event.target.value;

    if (/^[A-Za-z0-9 ._-]*$/.test(value)) {
      setSearch(value);
    }
  }}
/></div><div className="statuses-table">
    <div className="statuses-row statuses-heading">
  <span>Employee ID  Name (Status)</span>
  <span>Description</span>
  <span>Date</span>
  <span>Actions</span>
</div>{filtered.length ? filtered.map((item) => <div className="statuses-row" key={item.StatusId}>
<div className="status-name">
  <span className="employee-id">
    {item.EmployeeId}
  </span>

  <span className="employee-name">
    {item.EmployeeName || `Employee #${item.EmployeeId}`}
  </span>

  <small className="employee-status">
    ({item.Status})
  </small>
</div><span className="status-description">{item.Description ?? "No description"}</span><span>
  {item.CreatedAt
  ? new Date(item.CreatedAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  : "N/A"}
</span><div className="status-actions"><button type="button" className="status-edit-button" onClick={() => edit(item)} disabled={saving}>Edit</button><button type="button" className="status-delete-button" onClick={() => void remove(item.StatusId)} disabled={saving}>Delete</button></div></div>) : <div className="no-statuses">No statuses found.</div>}</div></div></section></main>;
}
