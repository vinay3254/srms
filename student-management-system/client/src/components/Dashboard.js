import { useEffect, useState } from "react";
import { getStats } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((d) => setStats(d.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty-state"><div className="icon">⏳</div><p>Loading dashboard…</p></div>;
  if (!stats) return <div className="empty-state"><div className="icon">⚠️</div><p>Could not load stats.</p></div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Overview of your student management system</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Students</div>
          <div className="stat-value blue">{stats.total}</div>
          <div className="stat-sub">Enrolled in system</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Active</div>
          <div className="stat-value green">{stats.active}</div>
          <div className="stat-sub">Currently active</div>
        </div>
        <div className="stat-card pink">
          <div className="stat-label">Inactive</div>
          <div className="stat-value pink">{stats.inactive}</div>
          <div className="stat-sub">Not currently active</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Avg Score</div>
          <div className="stat-value orange">{stats.avgScore}%</div>
          <div className="stat-sub">Across all subjects</div>
        </div>
      </div>

      {stats.topStudent && (
        <div className="info-card" style={{ marginBottom: 16 }}>
          <div className="info-card-label">🏆 Top Performer</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: "var(--gold)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.2rem", fontWeight: 900, color: "#090B0B",
              fontFamily: "var(--font-display)", flexShrink: 0,
            }}>
              {stats.topStudent.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {stats.topStudent.name}
              </div>
              <div style={{ color: "var(--amber)", fontWeight: 700, fontSize: "0.82rem", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                {stats.topStudent.score}% average
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-card">
        <div className="info-card-label">📚 Students by Course</div>
        <div className="course-cards">
          {stats.courseBreakdown.map((c) => (
            <div className="course-card" key={c.course}>
              <div className="course-card-name">{c.course}</div>
              <div className="course-card-count">{c.count}</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text3)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                student{c.count !== 1 ? "s" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
