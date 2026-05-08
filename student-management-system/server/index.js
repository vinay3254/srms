const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ─── In-Memory Database ────────────────────────────────────────────────────────
let students = [
  {
    id: uuidv4(),
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "9876543210",
    course: "Computer Science",
    year: 2,
    gender: "Male",
    grades: { Math: 88, Science: 92, English: 76, History: 84, Programming: 95 },
    enrolledAt: new Date("2023-07-15").toISOString(),
    status: "Active",
  },
  {
    id: uuidv4(),
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "9123456789",
    course: "Electronics",
    year: 3,
    gender: "Female",
    grades: { Math: 95, Science: 89, English: 91, History: 72, Programming: 85 },
    enrolledAt: new Date("2022-07-10").toISOString(),
    status: "Active",
  },
  {
    id: uuidv4(),
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "9988776655",
    course: "Mechanical",
    year: 1,
    gender: "Male",
    grades: { Math: 70, Science: 78, English: 65, History: 80, Programming: 55 },
    enrolledAt: new Date("2024-07-20").toISOString(),
    status: "Active",
  },
  {
    id: uuidv4(),
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    phone: "9871234560",
    course: "Computer Science",
    year: 4,
    gender: "Female",
    grades: { Math: 99, Science: 97, English: 94, History: 90, Programming: 98 },
    enrolledAt: new Date("2021-07-08").toISOString(),
    status: "Active",
  },
  {
    id: uuidv4(),
    name: "Karan Singh",
    email: "karan.singh@example.com",
    phone: "9765432100",
    course: "Civil",
    year: 2,
    gender: "Male",
    grades: { Math: 60, Science: 65, English: 72, History: 68, Programming: 50 },
    enrolledAt: new Date("2023-07-18").toISOString(),
    status: "Inactive",
  },
];

// ─── Helper: Calculate Average ─────────────────────────────────────────────────
const calcAverage = (grades) => {
  const values = Object.values(grades);
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all students (with optional search & filter)
app.get("/api/students", (req, res) => {
  const { search = "", course = "", year = "", status = "" } = req.query;

  let result = [...students];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q)
    );
  }
  if (course) result = result.filter((s) => s.course === course);
  if (year) result = result.filter((s) => s.year === parseInt(year));
  if (status) result = result.filter((s) => s.status === status);

  const enriched = result.map((s) => ({
    ...s,
    average: calcAverage(s.grades),
  }));

  res.json({ success: true, count: enriched.length, data: enriched });
});

// GET dashboard stats
app.get("/api/stats", (req, res) => {
  const total = students.length;
  const active = students.filter((s) => s.status === "Active").length;
  const inactive = total - active;
  const courses = [...new Set(students.map((s) => s.course))];
  const avgScore =
    Math.round(
      students.reduce((sum, s) => sum + calcAverage(s.grades), 0) / total
    ) || 0;
  const topStudent = students.reduce((top, s) =>
    calcAverage(s.grades) > calcAverage(top.grades) ? s : top
  , students[0]);

  const courseBreakdown = courses.map((c) => ({
    course: c,
    count: students.filter((s) => s.course === c).length,
  }));

  res.json({
    success: true,
    data: {
      total,
      active,
      inactive,
      avgScore,
      topStudent: topStudent ? { name: topStudent.name, score: calcAverage(topStudent.grades) } : null,
      courseBreakdown,
      totalCourses: courses.length,
    },
  });
});

// GET single student
app.get("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ success: false, message: "Student not found" });
  res.json({ success: true, data: { ...student, average: calcAverage(student.grades) } });
});

// POST create student
app.post("/api/students", (req, res) => {
  const { name, email, phone, course, year, gender, grades, status } = req.body;

  if (!name || !email || !course || !year) {
    return res.status(400).json({ success: false, message: "Name, email, course, and year are required." });
  }

  if (students.find((s) => s.email === email)) {
    return res.status(409).json({ success: false, message: "Email already exists." });
  }

  const newStudent = {
    id: uuidv4(),
    name,
    email,
    phone: phone || "",
    course,
    year: parseInt(year),
    gender: gender || "Other",
    grades: grades || {},
    enrolledAt: new Date().toISOString(),
    status: status || "Active",
  };

  students.push(newStudent);
  res.status(201).json({ success: true, message: "Student added successfully.", data: { ...newStudent, average: calcAverage(newStudent.grades) } });
});

// PUT update student
app.put("/api/students/:id", (req, res) => {
  const idx = students.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Student not found" });

  const { name, email, phone, course, year, gender, grades, status } = req.body;

  // Check duplicate email (exclude current student)
  if (email && students.find((s) => s.email === email && s.id !== req.params.id)) {
    return res.status(409).json({ success: false, message: "Email already exists." });
  }

  students[idx] = {
    ...students[idx],
    name: name || students[idx].name,
    email: email || students[idx].email,
    phone: phone !== undefined ? phone : students[idx].phone,
    course: course || students[idx].course,
    year: year ? parseInt(year) : students[idx].year,
    gender: gender || students[idx].gender,
    grades: grades || students[idx].grades,
    status: status || students[idx].status,
  };

  res.json({ success: true, message: "Student updated successfully.", data: { ...students[idx], average: calcAverage(students[idx].grades) } });
});

// DELETE student
app.delete("/api/students/:id", (req, res) => {
  const idx = students.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Student not found" });

  const removed = students.splice(idx, 1)[0];
  res.json({ success: true, message: `Student "${removed.name}" deleted successfully.` });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎓 Student Management Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET    /api/students         - List all students`);
  console.log(`   GET    /api/students/:id     - Get single student`);
  console.log(`   POST   /api/students         - Add new student`);
  console.log(`   PUT    /api/students/:id     - Update student`);
  console.log(`   DELETE /api/students/:id     - Delete student`);
  console.log(`   GET    /api/stats            - Dashboard statistics\n`);
});
