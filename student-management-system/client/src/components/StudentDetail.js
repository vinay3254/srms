import React from "react";

const gradeColor = (score) => {
  if (score >= 90) return "var(--mint)";
  if (score >= 75) return "var(--gold)";
  if (score >= 60) return "var(--amber)";
  return "var(--coral)";
};

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

export default function StudentDetail({ student, onClose, onEdit }) {
  if (!student) return null;
  const grades = student.grades || {};
  const subjects = Object.keys(grades);
  const avg = student.average || 0;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal fade-in" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <div className="modal-title">Student Profile</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {/* Profile header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16, marginBottom: 22,
            padding: "16px", background: "var(--surface2)", borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)"
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--gold), var(--gold-shadow))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.3rem", fontWeight: 900, color: "#fff",
              fontFamily: "var(--font-display)", flexShrink: 0,
            }}>
              {student.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.05rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {student.name}
              </div>
              <div style={{ color: "var(--text3)", fontSize: "0.75rem", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                {student.email}
              </div>
              <div style={{ marginTop: 8, display: "flex", gap: 5, flexWrap: "wrap" }}>
                <span className={`badge badge-${student.status?.toLowerCase()}`}>{student.status}</span>
                <span className="badge" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>{student.course}</span>
                <span className="badge" style={{ background: "var(--surface3)", color: "var(--text2)" }}>Year {student.year}</span>
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div className={`grade-pill ${gradeClass(avg)}`} style={{ fontSize: "1.3rem", padding: "5px 13px" }}>{gradeLabel(avg)}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text3)", marginTop: 5, fontFamily: "var(--font-mono)" }}>{avg}%</div>
            </div>
          </div>

          <div className="detail-section">
            <h4>Personal Info</h4>
            <div className="detail-row"><span className="detail-key">Phone</span><span className="detail-val">{student.phone || "—"}</span></div>
            <div className="detail-row"><span className="detail-key">Gender</span><span className="detail-val">{student.gender}</span></div>
            <div className="detail-row">
              <span className="detail-key">Enrolled</span>
              <span className="detail-val">{new Date(student.enrolledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          {subjects.length > 0 && (
            <div className="detail-section">
              <h4>Grades</h4>
              <div className="grades-bar-list">
                {subjects.map((sub) => (
                  <div className="grade-bar-item" key={sub}>
                    <div className="grade-bar-label">
                      <span style={{ color: "var(--text2)", fontSize: "0.78rem" }}>{sub}</span>
                      <span style={{ fontWeight: 700, color: gradeColor(grades[sub]), fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                        {grades[sub]}/100
                      </span>
                    </div>
                    <div className="grade-bar-track">
                      <div className="grade-bar-fill" style={{ width: `${grades[sub]}%`, background: gradeColor(grades[sub]) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => { onClose(); onEdit(student); }}>Edit Student</button>
        </div>
      </div>
    </div>
  );
}
