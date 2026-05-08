import React, { useState, useEffect } from "react";

const SUBJECTS = ["Math", "Science", "English", "History", "Programming"];
const COURSES = ["Computer Science", "Electronics", "Mechanical", "Civil", "Chemical", "Business"];

const defaultForm = {
  name: "", email: "", phone: "", course: "", year: "1",
  gender: "Male", status: "Active",
  grades: { Math: "", Science: "", English: "", History: "", Programming: "" },
};

export default function StudentForm({ student, onSave, onClose }) {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        course: student.course || "",
        year: String(student.year || "1"),
        gender: student.gender || "Male",
        status: student.status || "Active",
        grades: {
          Math: student.grades?.Math ?? "",
          Science: student.grades?.Science ?? "",
          English: student.grades?.English ?? "",
          History: student.grades?.History ?? "",
          Programming: student.grades?.Programming ?? "",
        },
      });
    }
  }, [student]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.course) e.course = "Course is required";
    if (!form.year) e.year = "Year is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleGrade = (subject, value) => {
    const val = value === "" ? "" : Math.min(100, Math.max(0, parseInt(value) || 0));
    setForm((f) => ({ ...f, grades: { ...f.grades, [subject]: val } }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const payload = {
        ...form,
        year: parseInt(form.year),
        grades: Object.fromEntries(
          Object.entries(form.grades).filter(([, v]) => v !== "").map(([k, v]) => [k, parseInt(v)])
        ),
      };
      await onSave(payload);
    } catch (err) {
      setApiError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in">
        <div className="modal-header">
          <div className="modal-title">{student ? "✏️ Edit Student" : "➕ Add New Student"}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {apiError && <div className="error-banner">{apiError}</div>}
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handle} placeholder="e.g. Arjun Kumar" />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
            <div className="form-field">
              <label>Email *</label>
              <input name="email" value={form.email} onChange={handle} placeholder="student@email.com" />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
            <div className="form-field">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handle} placeholder="10-digit number" maxLength={10} />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select name="gender" value={form.gender} onChange={handle}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-field">
              <label>Course *</label>
              <select name="course" value={form.course} onChange={handle}>
                <option value="">Select Course</option>
                {COURSES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.course && <span className="error-msg">{errors.course}</span>}
            </div>
            <div className="form-field">
              <label>Year *</label>
              <select name="year" value={form.year} onChange={handle}>
                {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="form-field full">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handle}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <hr className="grades-divider" />
          <label className="grades-section-label">Grades (0–100) — optional</label>
          <div className="grades-grid">
            {SUBJECTS.map((s) => (
              <div className="grade-input-wrap" key={s}>
                <label>{s}</label>
                <input
                  type="number" min="0" max="100"
                  value={form.grades[s]}
                  onChange={(e) => handleGrade(s, e.target.value)}
                  placeholder="–"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving…" : student ? "Update Student" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}
