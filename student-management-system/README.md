# 🎓 Student Management System
**Full-stack app using Node.js + Express (backend) and React (frontend)**

---

## 📁 Project Structure

```
student-management-system/
├── package.json              ← Root: runs both server & client
├── README.md
├── server/
│   ├── package.json
│   └── index.js              ← Express API server (port 5000)
└── client/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── api.js
        └── components/
            ├── Dashboard.js
            ├── Students.js
            ├── StudentForm.js
            └── StudentDetail.js
```

---

## 🚀 Quick Start (Step-by-Step)

### Step 1 — Install dependencies

```bash
# From the project root
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### Step 2 — Run the app

```bash
# From the project root — starts BOTH server and client
npm run dev
```

This will start:
- **Backend API** → http://localhost:5000
- **React Frontend** → http://localhost:3000

Open your browser at **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students (supports search & filter) |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Add a new student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |
| GET | `/api/stats` | Get dashboard statistics |

### Query Params for GET /api/students:
- `search` — search by name, email, phone
- `course` — filter by course name
- `year` — filter by year (1–4)
- `status` — filter by Active / Inactive

---

## ✨ Features

- **Dashboard** — Total students, active/inactive count, average score, top performer, course breakdown
- **Student List** — Table with search, filter by course/year/status
- **Add Student** — Full form with name, email, phone, course, year, gender, grades
- **Edit Student** — Pre-filled form to update student info
- **View Student** — Detailed profile with grade bars
- **Delete Student** — Confirmation dialog before deletion
- **Grade Tracking** — Per-subject grades with A/B/C/D ratings
- **In-memory storage** — No database setup needed; 5 sample students preloaded

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Axios |
| Backend | Node.js, Express |
| Storage | In-Memory (JavaScript array) |
| Styling | Custom CSS with design system |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both server + client |
| `npm run server` | Start only the Express server |
| `npm run client` | Start only the React app |
| `npm run install:all` | Install all dependencies at once |

---

## 📝 Notes

- Data is stored **in-memory** — it resets when the server restarts. This is by design (no DB setup required).
- The React app proxies API calls to `localhost:5000` via the `"proxy"` field in `client/package.json`.
- To persist data, you can replace the in-memory `students` array in `server/index.js` with a database like MongoDB or SQLite.
