"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch, apiJson } from "@/lib/api";

type StatusRecord = { StatusId: number; Status: string; Description?: string; CreatedAt?: string; UpdatedAt?: string };
const choices = [{ name: "Available", description: "I am available for work." }, { name: "Working", description: "I am currently working." }, { name: "Break", description: "I am currently on a break." }, { name: "Offline", description: "I am not available right now." }];
const time = (value?: string) => value ? new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Just now";

export default function EmployeeStatusPage() {
  const [history, setHistory] = useState<StatusRecord[]>([]);
  const [editing, setEditing] = useState<StatusRecord | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiJson<unknown>("/employees/me/statuses", { cache: "no-store" });
      setHistory(Array.isArray(data) ? data as StatusRecord[] : []);
      setMessage("");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Failed to load status history."); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const create = async (status: string, description: string) => {
    setSaving(true);
    try { await apiFetch("/employees/me/statuses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, description }) }); await load(); setMessage("Status updated successfully."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Unable to update status."); }
    finally { setSaving(false); }
  };
  const startEdit = (status: StatusRecord) => { setEditing(status); setEditStatus(status.Status); setEditDescription(status.Description ?? ""); };
  const saveEdit = async () => {
    if (!editing || !editStatus || !editDescription.trim()) return;
    setSaving(true);
    try { await apiFetch(`/employees/me/statuses/${editing.StatusId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: editStatus, description: editDescription.trim() }) }); setEditing(null); await load(); setMessage("Status edited successfully."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Unable to edit status."); }
    finally { setSaving(false); }
  };
  const remove = async (statusId: number) => {
    if (!window.confirm("Delete this status update?")) return;
    setSaving(true);
    try { await apiFetch(`/employees/me/statuses/${statusId}`, { method: "DELETE" }); await load(); setMessage("Status deleted successfully."); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Unable to delete status."); }
    finally { setSaving(false); }
  };

  const current = history[0];
  const today = new Date().toDateString();
  const todayStatuses = history.filter((status) => status.CreatedAt && new Date(status.CreatedAt).toDateString() === today);
  return <main className="dashboard-page">
    <aside className="sidebar"><div className="sidebar-logo">EMS</div><h2>Employee Panel</h2><nav><Link href="/employee/dashboard">Dashboard</Link><Link href="/employee/profile">My Profile</Link><Link href="/employee/status" className="active">My Status</Link><Link href="/employee/history">Status History</Link></nav><div className="sidebar-bottom"><Link href="/">Logout</Link></div></aside>
    <section className="dashboard-content"><header className="dashboard-header"><div><h1>My Status</h1><p>View and update your current work status.</p></div><div className="admin-profile"><div className="profile-circle">E</div><div><strong>Employee</strong><span>Employee Portal</span></div></div></header>
      <div className="employee-status-section"><div className="current-status-card"><div><span className="status-card-label">Current Status</span><div className="current-status-display"><div className="current-status-dot"></div><strong>{current?.Status ?? "No status set"}</strong></div><p>{current ? `Last updated at ${time(current.UpdatedAt ?? current.CreatedAt)}` : "No status updates yet."}</p></div></div>
        <div className="status-update-card"><div className="status-section-header"><h2>Update Your Status</h2><p>Select your current work status.</p></div><div className="status-options">{choices.map((choice) => <button key={choice.name} type="button" disabled={saving} className={`status-option ${current?.Status === choice.name ? "selected-status" : ""}`} onClick={() => void create(choice.name, choice.description)}><span className="status-option-name">{choice.name}</span><span className="status-option-description">{choice.description}</span></button>)}</div><div className="status-update-note"><strong>Saved to your status history</strong><p>Selecting a status creates a record you can edit or delete below.</p></div></div>
        <div className="status-today-card"><div className="status-section-header"><h2>Today&apos;s Status</h2><p>Your status activity for today.</p>{message && <p role="alert">{message}</p>}</div>{editing && <div className="today-status-edit"><select value={editStatus} onChange={(event) => setEditStatus(event.target.value)}>{choices.map((choice) => <option key={choice.name}>{choice.name}</option>)}</select><input value={editDescription} onChange={(event) => setEditDescription(event.target.value)} placeholder="Status description" /><button type="button" onClick={() => void saveEdit()} disabled={saving || !editDescription.trim()}>Save</button><button type="button" onClick={() => setEditing(null)} disabled={saving}>Cancel</button></div>}<div className="today-status-list">{todayStatuses.length ? todayStatuses.map((status) => <div className="today-status-item" key={status.StatusId}><div className="today-status-indicator"></div><div><strong>{status.Status}</strong><span>{time(status.UpdatedAt ?? status.CreatedAt)}</span></div><div className="today-status-actions"><button type="button" onClick={() => startEdit(status)} disabled={saving}>Edit</button><button type="button" onClick={() => void remove(status.StatusId)} disabled={saving}>Delete</button></div></div>) : <p>No status updates for today.</p>}</div></div>
      </div>
    </section>
  </main>;
}
