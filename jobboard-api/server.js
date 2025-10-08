import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// 🌍 Port
const PORT = process.env.PORT || 3000;

// =============================
//  INDEX.HTML
// =============================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// =============================
//  COMPANIES CRUD
// =============================
app.get("/companies", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM companies");
  res.json(rows);
});

app.get("/companies/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM companies WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "Company not found" });
  res.json(rows[0]);
});

app.post("/companies", async (req, res) => {
  const { name, website, email, phone } = req.body;
  const [result] = await pool.query(
    "INSERT INTO companies (name, website, email, phone) VALUES (?, ?, ?, ?)",
    [name, website, email, phone]
  );
  res.status(201).json({ id: result.insertId, name, website, email, phone });
});

app.put("/companies/:id", async (req, res) => {
  const { name, website, email, phone } = req.body;
  await pool.query(
    "UPDATE companies SET name=?, website=?, email=?, phone=? WHERE id=?",
    [name, website, email, phone, req.params.id]
  );
  res.json({ message: "Company updated" });
});

app.delete("/companies/:id", async (req, res) => {
  await pool.query("DELETE FROM companies WHERE id=?", [req.params.id]);
  res.json({ message: "Company deleted" });
});

// =============================
//  USERS CRUD
// =============================
app.get("/users", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

app.get("/users/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "User not found" });
  res.json(rows[0]);
});

app.post("/users", async (req, res) => {
  const { full_name, email, password, role, phone } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, password, role || "applicant", phone || null]
    );
    res.status(201).json({ id: result.insertId, full_name, email, role: role || "applicant", phone });
  } catch (err) {
    console.error("❌ Error creating user:", err.sqlMessage || err.message);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error("❌ Error creating user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/users/:id", async (req, res) => {
  const { full_name, email, password, role, status } = req.body;
  await pool.query(
    "UPDATE users SET full_name=?, email=?, password=?, role=?, status=? WHERE id=?",
    [full_name, email, password, role, status || "active", req.params.id]
  );
  res.json({ message: "User updated" });
});

app.delete("/users/:id", async (req, res) => {
  const [result] = await pool.query("DELETE FROM users WHERE id=?", [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ message: "User deleted" });
});

// =============================
//  JOBS CRUD
// =============================

// 🧠 "Learn more" button => GET /jobs/:id
app.get("/jobs/:id", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT j.*, c.name AS company_name, c.website, c.email AS company_email
     FROM jobs j
     JOIN companies c ON j.company_id = c.id
     WHERE j.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: "Job not found" });
  res.json(rows[0]);
});

// Liste des jobs
app.get("/jobs", async (req, res) => {
  const search = req.query.q;
  let query = "SELECT * FROM jobs";
  let params = [];

  if (search) {
    query += " WHERE title LIKE ? OR location LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  }

  const [rows] = await pool.query(query, params);
  res.json(rows);
});

// Créer un job
app.post("/jobs", async (req, res) => {
  const { company_id, title, short_description, full_description, salary, location, working_hours } = req.body;
  const [result] = await pool.query(
    `INSERT INTO jobs (company_id, title, short_description, full_description, salary, location, working_hours)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [company_id, title, short_description, full_description, salary, location, working_hours]
  );
  res.status(201).json({ id: result.insertId, title });
});

// Mettre à jour un job
app.put("/jobs/:id", async (req, res) => {
  const { company_id, title, short_description, full_description, salary, location, working_hours } = req.body;
  await pool.query(
    `UPDATE jobs SET company_id=?, title=?, short_description=?, full_description=?, salary=?, location=?, working_hours=? WHERE id=?`,
    [company_id, title, short_description, full_description, salary, location, working_hours, req.params.id]
  );
  res.json({ message: "Job updated" });
});

// Supprimer un job
app.delete("/jobs/:id", async (req, res) => {
  await pool.query("DELETE FROM jobs WHERE id=?", [req.params.id]);
  res.json({ message: "Job deleted" });
});

// =============================
//  APPLICATIONS CRUD
// =============================
app.get("/applications", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applications");
  res.json(rows);
});

app.get("/applications/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applications WHERE id=?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "Application not found" });
  res.json(rows[0]);
});

app.post("/applications", async (req, res) => {
  const { job_id, user_id, message } = req.body;
  const [result] = await pool.query(
    "INSERT INTO applications (job_id, user_id, message) VALUES (?, ?, ?)",
    [job_id, user_id, message]
  );
  res.status(201).json({ id: result.insertId, job_id, user_id, message });
});

app.put("/applications/:id", async (req, res) => {
  const { job_id, user_id, message, status } = req.body;
  await pool.query(
    "UPDATE applications SET job_id=?, user_id=?, message=?, status=? WHERE id=?",
    [job_id, user_id, message, status, req.params.id]
  );
  res.json({ message: "Application updated" });
});

app.delete("/applications/:id", async (req, res) => {
  const [result] = await pool.query("DELETE FROM applications WHERE id=?", [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Application not found" });
  }
  res.json({ message: "Application deleted" });
});

// =============================
//  SERVEUR
// =============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
