"use client";

import { useEffect, useMemo, useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";

type WorkUpdate = {
  id: number;
  time: string;
  text: string;
  date?: string;
};

const STORAGE_KEY = "employee_work_updates";
const convertUpdateDateToISO = (date?: string) => {
  if (!date) return "";

  const parts = date.split(" ");

  if (parts.length !== 3) return "";

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const monthNumber = months[month];

  if (!monthNumber) return "";

  return `${year}-${monthNumber}-${day.padStart(2, "0")}`;
};

const initialUpdates: WorkUpdate[] = [
  {
    id: 1,
    date: "16 Sep 2026",
    time: "04:32 PM",
    text: "Fixed email validation in employee creation form and tested it. Also resolved an issue in employee status API.",
  },
  {
    id: 2,
    date: "16 Sep 2026",
    time: "12:15 PM",
    text: "Integrated employee API with the Next.js frontend. Connected all required endpoints and tested the functionality.",
  },
  {
    id: 3,
    date: "16 Sep 2026",
    time: "09:30 AM",
    text: "Completed employee login and refresh token API. Tested both in Postman and verified the response.",
  },
  {
    id: 4,
    date: "15 Sep 2026",
    time: "05:20 PM",
    text: "Worked on UI improvements for employee dashboard and fixed responsive issues.",
  },
  {
    id: 5,
    date: "15 Sep 2026",
    time: "11:10 AM",
    text: "Tested all authentication APIs in Postman and fixed minor bugs in refresh token logic.",
  },
  {
    id: 6,
    date: "14 Sep 2026",
    time: "03:45 PM",
    text: "Updated employee profile page and added input validations for all fields.",
  },
];

export default function StatusHistoryPage() {
  const [updates, setUpdates] = useState<WorkUpdate[]>([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editError, setEditError] = useState("");

  const itemsPerPage = 6;

  /* ================= LOAD UPDATES ================= */

  useEffect(() => {
    const loadUpdates = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setUpdates(parsed);
            return;
          }
        }

        // First time only
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(initialUpdates)
        );

        setUpdates(initialUpdates);
      } catch (error) {
        console.error("Failed to load work updates:", error);
        setUpdates(initialUpdates);
      }
    };

    loadUpdates();

    const handleStorageChange = () => {
      loadUpdates();
    };

    const handleCustomUpdate = () => {
      loadUpdates();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "work-update-changed",
      handleCustomUpdate
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "work-update-changed",
        handleCustomUpdate
      );
    };
  }, []);

  /* ================= FILTER ================= */

  const filteredUpdates = useMemo(() => {
    return updates.filter((update) => {
      const matchesSearch = update.text
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDate = filterDate
        ? convertUpdateDateToISO(update.date) === filterDate
        : true;

      let matchesType = true;

      if (filterType === "today") {
        matchesType =
          update.date ===
          new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
      }

      return matchesSearch && matchesDate && matchesType;
    });
  }, [updates, search, filterDate, filterType]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUpdates.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const visibleUpdates = filteredUpdates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /* ================= DELETE ================= */

  /* ================= DELETE ================= */

const deleteUpdate = (id: number) => {
  setDeleteId(id);
};

const confirmDelete = () => {
  if (deleteId === null) return;

  const updated = updates.filter(
    (update) => update.id !== deleteId
  );

  setUpdates(updated);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new Event("work-update-changed")
  );

  setDeleteId(null);
};

const cancelDelete = () => {
  setDeleteId(null);
};

  /* ================= EDIT ================= */

const editUpdate = (update: WorkUpdate) => {
  setEditId(update.id);
  setEditText(update.text);
  setEditError("");
};

const cancelEdit = () => {
  setEditId(null);
  setEditText("");
};

const confirmEdit = () => {
  const trimmedText = editText.trim();

 if (trimmedText.length < 10) {
  setEditError(
    "Work update must contain at least 10 characters."
  );
  return;
}

if (trimmedText.length > 2000) {
  setEditError(
    "Work update cannot exceed 2000 characters."
  );
  return;
}

setEditError("");

  const updated = updates.map((item) =>
    item.id === editId
      ? {
          ...item,
          text: trimmedText,
        }
      : item
  );

  setUpdates(updated);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new Event("work-update-changed")
  );

  cancelEdit();
};
  /* ================= STATS ================= */

  const totalUpdates = updates.length;

  const today = new Date().toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const todayUpdates = updates.filter(
    (update) => update.date === today
  ).length;

  const currentMonth = new Date().toLocaleDateString(
    "en-GB",
    {
      month: "short",
      year: "numeric",
    }
  );

  const thisMonthUpdates = updates.filter(
    (update) =>
      update.date?.includes(
        currentMonth.split(" ")[0]
      )
  ).length;

  const thisWeekUpdates = Math.min(
    todayUpdates + 2,
    totalUpdates
  );

  return (
  <div className="employee-dashboard-page">
    <EmployeeSidebar />

    {/* ================= MAIN ================= */}

    <main className="employee-dashboard-main">

          {/* HEADER */}

          <header className="employee-dashboard-header">

            <div>
              <div className="employee-page-label">
                EMPLOYEE PORTAL
              </div>

              <h1>Status History</h1>

              <p>
                View your previous work updates.
              </p>
            </div>

            <div className="employee-header-right">

              <div className="employee-header-profile">

                <div className="employee-header-avatar">
                  E
                </div>

                <div>
                  <strong>Employee</strong>
                  <span>
                    Employee Portal
                  </span>
                </div>

                <span className="profile-arrow">
                 ⌄
                </span>

              </div>

            </div>

          </header>

          {/* ================= STATS ================= */}

          <section className="history-stats-grid">

            <div className="history-stat-card">

              <div className="history-stat-icon">
                ▤
              </div>

              <div>
                <span>Total Updates</span>
                <strong>{totalUpdates}</strong>
              </div>

            </div>

            <div className="history-stat-card">

              <div className="history-stat-icon">
                ▣
              </div>

              <div>
                <span>This Month</span>
                <strong>
                  {thisMonthUpdates}
                </strong>
              </div>

            </div>

            <div className="history-stat-card">

              <div className="history-stat-icon">
                ↗
              </div>

              <div>
                <span>This Week</span>
                <strong>
                  {thisWeekUpdates}
                </strong>
              </div>

            </div>

            <div className="history-stat-card">

              <div className="history-stat-icon">
                ◷
              </div>

              <div>
                <span>Today</span>
                <strong>
                  {todayUpdates}
                </strong>
              </div>

            </div>

          </section>

          {/* ================= HISTORY CARD ================= */}

          <section className="work-history-main-card">

            <div className="history-main-header">

              <div className="history-title-area">

                <div className="history-title-icon">
                  ◷
                </div>

                <div>
                  <h2>All Work Updates</h2>
                  <p>
                    Your complete work update history.
                  </p>
                </div>

              </div>

              {/* FILTERS */}

              <div className="history-filters">

                <div className="history-search">

                  <span>⌕</span>

                  <input
                    type="text"
                    placeholder="Search updates..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />

                </div>

                <div className="history-date-filter">

                      <span>▣</span>

                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => {
                          setFilterDate(e.target.value);
                          setCurrentPage(1);
                        }}
                      />

                      {filterDate && (
                        <button
                          type="button"
                          className="clear-date-button"
                          onClick={() => {
                            setFilterDate("");
                            setCurrentPage(1);
                          }}
                        >
                          Clear
                        </button>
                      )}

</div>

              </div>

            </div>

            {/* ================= TIMELINE ================= */}

            <div className="history-update-list">

              {visibleUpdates.length === 0 ? (

                <div className="history-empty">
                  <div>▤</div>
                  <h3>No work updates found</h3>
                  <p>
                    Try changing your search or filter.
                  </p>
                </div>

              ) : (

                visibleUpdates.map((update) => (

                  <div
                    className="history-update-row"
                    key={update.id}
                  >

                    <div className="history-row-timeline">

                      <div className="history-row-dot" />

                    </div>

                    <div className="history-row-date">

                      <strong>
                        {update.date || "Today"}
                      </strong>

                      <span>
                        {update.time}
                      </span>

                    </div>

                    <div className="history-row-text">
                      {update.text}
                    </div>

                    <div className="history-row-actions">

                      <button
                        type="button"
                        className="history-edit-button"
                        onClick={() =>
                          editUpdate(update)
                        }
                      >
                        ✎ &nbsp; Edit
                      </button>

                      <button
                        type="button"
                        className="history-delete-button"
                        onClick={() =>
                          deleteUpdate(update.id)
                        }
                      >
                        ▣ &nbsp; Delete
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

            {/* ================= FOOTER ================= */}

            {filteredUpdates.length > 0 && (
              <div className="history-footer">

                <span>
                  Showing{" "}
                  {startIndex + 1} to{" "}
                  {Math.min(
                    startIndex + itemsPerPage,
                    filteredUpdates.length
                  )}{" "}
                  of {filteredUpdates.length} updates
                </span>

                <div className="history-pagination">

                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage(
                        (page) => page - 1
                      )
                    }
                  >
                    ‹
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (

                    <button
                      type="button"
                      key={page}
                      className={
                        currentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setCurrentPage(page)
                      }
                    >
                      {page}
                    </button>

                  ))}

                  <button
                    type="button"
                    disabled={
                      currentPage === totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) => page + 1
                      )
                    }
                  >
                    ›
                  </button>

                </div>

              </div>
            )}

          </section>

        </main>
                {/* ================= EDIT WORK UPDATE MODAL ================= */}

{/* ================= EDIT WORK UPDATE MODAL ================= */}

{editId !== null && (
  <div
    className="edit-modal-overlay"
    onClick={cancelEdit}
  >
    <div
      className="edit-work-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="edit-modal-header">
        <div className="edit-modal-icon">
          ✎
        </div>

        <div>
          <h3>Edit Work Update</h3>
          <p>Update your work details below.</p>
        </div>
      </div>

      {/* Input */}
      <div className="edit-modal-body">
        <label htmlFor="edit-work-update">
          Work Update
        </label>

        <textarea
          id="edit-work-update"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          maxLength={2000}
          rows={5}
          placeholder="Enter your work update..."
          autoFocus
        />

        <div className="edit-character-count">
          <span>Minimum 10 characters</span>
          <span>{editText.length}/2000</span>
        </div>
        {editError && (
            <div className="edit-modal-error">
              {editError}
            </div>
          )}
      </div>

      {/* Actions */}
      <div className="edit-modal-footer">
        <button
          type="button"
          className="edit-modal-cancel"
          onClick={cancelEdit}
        >
          Cancel
        </button>

        <button
          type="button"
          className="edit-modal-save"
          onClick={confirmEdit}
        >
          ✓ Save Changes
        </button>
      </div>
    </div>
  </div>
)}

        {/* ================= DELETE CONFIRMATION MODAL ================= */}

        {deleteId !== null && (
          <div
            className="delete-modal-overlay"
            onClick={cancelDelete}
          >
            <div
              className="delete-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="delete-modal-icon">
                !
              </div>

              <div className="delete-modal-content">

                <h3>Delete Work Update?</h3>

                <p>
                  Are you sure you want to delete this
                  work update? This action cannot be undone.
                </p>

              </div>

              <div className="delete-modal-actions">

                <button
                  type="button"
                  className="delete-cancel-button"
                  onClick={cancelDelete}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="delete-confirm-button"
                  onClick={confirmDelete}
                >
                  Delete Update
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
  );
}