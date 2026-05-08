import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "◈" },
  { id: "students", label: "Students", icon: "◉" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">SMS</div>
        <div className="sidebar-tagline">Student Management</div>
        <nav>
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

      </aside>

      <main className="main-content">
        {page === "dashboard" && <Dashboard />}
        {page === "students" && <Students />}
      </main>
    </div>
  );
}
