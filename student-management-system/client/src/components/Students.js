import React, { useEffect, useState, useCallback } from "react";
import { getStudents, deleteStudent } from "../api";
import StudentForm from "./StudentForm";
import StudentDetail from "./StudentDetail";
import { createStudent, updateStudent } from "../api";

const COURSES = ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical", "Business"];

const gradeClass = (avg) => {
  if (avg >= 90) return "grade-a";
  if (avg >= 75) return "grade-b";
  if (avg >= 60) return "grade-c";
  return "grade-d";
};

const gradeLabel = (avg) => {
  if (avg >= 90) return "A";
  if (avg >= 75) return "B";
  if (avg >= 60) return "C";
  return "D";
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = useCallback(() => {
    setLoading(true);
    getStudents({ search, course: filterCourse, year: filterYear, status: filterStatus })
      .then((d) => { setStudents(d.data); setCount(d.count); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [search, filterCourse, filterYear, filterStatus]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data) => {
    if (editStudent) {
      await updateStudent(editStudent.id, data);
      showToast("✅ Student updated successfully!");
    } else {
      await createStudent(data);
      showToast("✅ Student added successfully!");
    }
    setShowForm(false);
    setEditStudent(null);
    load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await deleteStudent(confirmDelete.id);
    setConfirmDelete(null);
    showToast(`🗑️ ${confirmDelete.name} has been removed.`);
    load();
  };

  const openEdit = (s) => { setEditStudent(s); setShowForm(true); };
  const openAdd = () => { setEditStudent(null); setShowForm(true); };

  return (
    <div className="fade-in">
      {toast && <div className="success-banner" style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, minWidth: 280 }}>{toast}</div>}

      <div className="page-header">
        <div>
          <div className="page-title">Students</div>
          <div className="page-subtitle">Manage all student records</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>➕ Add Student</button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <span style={{ color: "var(--text3)" }}>🔍</span>
          <input
            placeholder="Search by name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "0.9rem" }} onClick={() => setSearch("")}>✕</button>}
        </div>
        <select className="filter-select" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="">All Courses</option>
          {COURSES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">All Years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        {(search || filterCourse || filterYear || filterStatus) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(""); setFilterCourse(""); setFilterYear(""); setFilterStatus(""); }}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <div className="table-info">
          Showing <strong>{count}</strong> student{count !== 1 ? "s" : ""}
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Course</th>
              <th>Year</th>
              <th>Gender</th>
              <th>Avg Grade</th>
              <th>Status</th>
              <th>Enrolled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="loading-row">
                  <td><span className="skeleton" style={{ width: 20 }} /></td>
                  <td><span className="skeleton" /></td>
                  <td><span className="skeleton" style={{ width: "60%" }} /></td>
                  <td><span className="skeleton" style={{ width: 30 }} /></td>
                  <td><span className="skeleton" style={{ width: 40 }} /></td>
                  <td><span className="skeleton" style={{ width: 50 }} /></td>
                  <td><span className="skeleton" style={{ width: 60 }} /></td>
                  <td><span className="skeleton" style={{ width: 80 }} /></td>
                  <td><span className="skeleton" style={{ width: 80 }} /></td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty-state">
                    <div className="icon">🎓</div>
                    <p>No students found. Try adjusting your filters or add a new student.</p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((s, i) => (
                <tr key={s.id}>
                  <td style={{ color: "var(--text3)", fontWeight: 600 }}>{i + 1}</td>
                  <td>
                    <div className="student-name" style={{ cursor: "pointer", color: "var(--accent)" }} onClick={() => setViewStudent(s)}>
                      {s.name}
                    </div>
                    <div className="student-email">{s.email}</div>
                    {s.phone && <div className="student-email">{s.phone}</div>}
                  </td>
                  <td>{s.course}</td>
                  <td>Year {s.year}</td>
                  <td>{s.gender}</td>
                  <td>
                    {s.average != null ? (
                      <span className={`grade-pill ${gradeClass(s.average)}`}>
                        {gradeLabel(s.average)} · {s.average}%
                      </span>
                    ) : "—"}
                  </td>
                  <td><span className={`badge badge-${s.status?.toLowerCase()}`}>{s.status}</span></td>
                  <td style={{ color: "var(--text3)", fontSize: "0.8rem" }}>
                    {new Date(s.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-edit btn-sm" onClick={() => openEdit(s)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(s)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <StudentForm
          student={editStudent}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditStudent(null); }}
        />
      )}

      {/* View Detail Modal */}
      {viewStudent && (
        <StudentDetail
          student={viewStudent}
          onClose={() => setViewStudent(null)}
          onEdit={(s) => { setViewStudent(null); openEdit(s); }}
        />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}>
          <div className="modal fade-in" style={{ maxWidth: 400 }}>
            <div className="confirm-body">
              <div className="confirm-icon">⚠️</div>
              <h3>Delete Student?</h3>
              <p>Are you sure you want to remove <strong>{confirmDelete.name}</strong>? This action cannot be undone.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: "center" }}>
              <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
