"use client";

import { useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";

type WorkUpdate = {
  id: number;
  time: string;
  text: string;
};

const MIN_LENGTH = 10;
const MAX_LENGTH = 2000;

export default function MyStatusPage() {
  const [updateText, setUpdateText] = useState("");
  const [touched, setTouched] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [updates, setUpdates] = useState<WorkUpdate[]>([
    {
      id: 1,
      time: "04:32 PM",
      text:
        "Fixed email validation in employee creation form and tested it. Also resolved an issue in employee status API.",
    },
    {
      id: 2,
      time: "12:15 PM",
      text:
        "Integrated employee API with the Next.js frontend. Connected all required endpoints and tested the functionality.",
    },
    {
      id: 3,
      time: "09:30 AM",
      text:
        "Completed employee login and refresh token API. Tested both in Postman and verified the response.",
    },
  ]);

  // ================= VALIDATION =================

  const trimmedText = updateText.trim();
  const textLength = trimmedText.length;

  const getValidationError = () => {
    if (!touched && updateText.length === 0) {
      return "";
    }

    if (!trimmedText) {
      return "Work update is required.";
    }

    if (textLength < MIN_LENGTH) {
      return `Work update must contain at least ${MIN_LENGTH} characters.`;
    }

    if (textLength > MAX_LENGTH) {
      return `Work update cannot exceed ${MAX_LENGTH} characters.`;
    }

    return "";
  };

  const validationError = getValidationError();

  const isValid =
    trimmedText.length >= MIN_LENGTH &&
    trimmedText.length <= MAX_LENGTH;

  // ================= SAVE =================

  const handleSaveUpdate = () => {
    setTouched(true);

    if (!isValid) {
      return;
    }

    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUpdate: WorkUpdate = {
      id: Date.now(),
      time,
      text: trimmedText,
    };

    setUpdates((prev) => [newUpdate, ...prev]);

    setUpdateText("");
    setTouched(false);
  };

  // ================= DELETE =================

 const handleDelete = (id: number) => {
  setDeleteId(id);
};

const confirmDelete = () => {
  if (deleteId === null) {
    return;
  }

  setUpdates((prev) =>
    prev.filter((item) => item.id !== deleteId)
  );

  setDeleteId(null);
};

const cancelDelete = () => {
  setDeleteId(null);
};

  // ================= EDIT =================

  const handleEdit = (id: number) => {
    const selectedUpdate = updates.find(
      (item) => item.id === id
    );

    if (!selectedUpdate) {
      return;
    }

    setUpdateText(selectedUpdate.text);
    setTouched(false);

    setUpdates((prev) =>
      prev.filter((item) => item.id !== id)
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="employee-dashboard-page employee-status-page">
  <EmployeeSidebar />

  <main className="employee-dashboard-main employee-status-main">

          {/* ================= HEADER ================= */}

          <header className="employee-dashboard-header">
            <div>
              <span className="employee-page-label">
                EMPLOYEE PORTAL
              </span>

              <h1>My Work Update</h1>

              <p>
                Add your daily work updates and keep your team informed.
              </p>
            </div>

            <div className="employee-header-right">
              <div className="employee-header-profile">
                <div className="employee-header-avatar">
                  E
                </div>

                <div>
                  <strong>Employee</strong>
                  <span>Employee Portal</span>
                </div>

                <span>⌄</span>
              </div>
            </div>
          </header>

          {/* ================= ADD WORK UPDATE ================= */}

          <section className="work-update-card">

            <div className="work-header">
              <div className="section-header-icon">
                ▤
              </div>

              <div className="status-section-header">
                <h2>Add Work Update</h2>
                <p>
                  Share what you have worked on today.
                </p>
              </div>
            </div>

            <div className="work-form-group full-width">

              <label>
                Work Update <span>*</span>
              </label>

              <textarea
                value={updateText}
                onChange={(e) => {
                  setUpdateText(e.target.value);
                  setTouched(true);
                }}
                onBlur={() => setTouched(true)}
                maxLength={MAX_LENGTH}
                rows={7}
                placeholder={`Write your work update here...

                    Example:
                    • Completed employee API integration
                    • Fixed validation issues
                    • Updated employee status page
                    • Tested APIs in Postman`}
              />

              <div className="character-count">
                {textLength} / {MAX_LENGTH}
              </div>

              {validationError && (
                <div className="status-error-message">
                  {validationError}
                </div>
              )}

              {!validationError && touched && isValid && (
                <p
                  style={{
                    marginTop: "8px",
                    color: "#059669",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  ✓ Work update is valid
                </p>
              )}

              {!validationError &&
                !touched &&
                updateText.length === 0 && (
                  <p
                    style={{
                      marginTop: "8px",
                      color: "#94a3b8",
                      fontSize: "12px",
                    }}
                  >
                    Minimum {MIN_LENGTH} characters
                  </p>
                )}

              <button
                type="button"
                onClick={handleSaveUpdate}
                disabled={!isValid}
                className="update-work-button"
              >
                <span>➤</span>
                Save Update
              </button>
            </div>
          </section>

          {/* ================= TODAY'S UPDATES ================= */}

          <section className="work-history-card">

            <div className="history-header">

              <div className="work-header">
                <div className="section-header-icon">
                  ◷
                </div>

                <div className="status-section-header">
                  <h2>Today&apos;s Updates</h2>
                  <p>
                    Your work updates for today.
                  </p>
                </div>
              </div>

              <div className="history-date">
                ▣
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

            </div>

            <div className="work-history-list">

              {updates.length === 0 ? (

                <div className="empty-history">
                  📝
                  <br />
                  No work updates yet
                </div>

              ) : (

                updates.map((update) => (

                  <div
                    key={update.id}
                    className="work-history-row"
                  >

                    {/* Timeline */}

                    <div className="history-timeline">
                      <div className="history-dot" />
                    </div>

                    {/* Time */}

                    <div className="history-time">
                      {update.time}
                    </div>

                    {/* Details */}

                    <div className="history-details">
                      <strong>Work Update</strong>

                      <p>
                        {update.text}
                      </p>
                    </div>

                    {/* Actions */}

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(update.id)
                        }
                        className="history-update-button"
                        style={{
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        ✎ Edit
                      </button>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(update.id)
                        }
                        className="history-update-button"
                        style={{
                          border: "none",
                          cursor: "pointer",
                          background: "#dc2626",
                        }}
                      >
                        🗑 Delete
                      </button>
                    </div>

                  </div>

                ))

              )}

            </div>

          </section>

        </main>
        {/* ================= DELETE MODAL ================= */}

{deleteId !== null && (
  <div
    className="status-delete-modal-overlay"
    onClick={cancelDelete}
  >
    <div
      className="status-delete-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="status-delete-icon">
        !
      </div>

      <div className="status-delete-content">
        <h2>Delete Work Update?</h2>

        <p>
          Are you sure you want to delete this work update?
          This action cannot be undone.
        </p>
      </div>

      <div className="status-delete-actions">
        <button
          type="button"
          className="status-delete-cancel"
          onClick={cancelDelete}
        >
          Cancel
        </button>

        <button
          type="button"
          className="status-delete-confirm"
          onClick={confirmDelete}
        >
          🗑 Delete Update
        </button>
      </div>
    </div>
  </div>
)}
      </div>
  );
}