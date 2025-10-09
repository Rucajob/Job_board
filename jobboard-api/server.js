// jobboard-api/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs"; // for password hashing
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// serve static files from project root (so index.html, login.html, register.html are accessible)
app.use(express.static(path.join(__dirname, "..")));

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_env";

// ---------------------------
// Helper: auth middleware
// ---------------------------
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied: No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user; // { id, email, role }
    next();
  });
}

// ======================
// AUTH ROUTES
// ======================

// Register
app.post("/auth/register", async (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashed, role || "applicant"]
    );
    res
      .status(201)
      .json({ message: "User registered", userId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ message: "Email already exists" });
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(400).json({ message: "Invalid email or password" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user info
app.get("/auth/me", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, role FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// ======================
// YOUR EXISTING CRUD ROUTES (companies, users, jobs) - keep as you had them
// (you can paste your existing routes here, unchanged)
// For clarity I'll show the jobs GET/:id and list route used by index.html
// ======================

app.get("/jobs/:id", async (req, res) => {
  const [rows] = await pool.query(
    `SELECT a.*, c.name AS company_name
     FROM advertisements a
     LEFT JOIN companies c ON a.company_id = c.id
     WHERE a.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0)
    return res.status(404).json({ message: "Job not found" });
  res.json(rows[0]);
});

app.get("/jobs", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM advertisements ORDER BY created_at DESC"
  );
  res.json(rows);
});

// ======================
// APPLICATIONS (protected)
// ======================
// Note: table uses `applicant_id` (per your Init.sql)
app.post("/applications", authenticateToken, async (req, res) => {
  const { job_id, message } = req.body;
  const applicant_id = req.user.id;

  if (!job_id) return res.status(400).json({ message: "job_id is required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO applications (job_id, applicant_id, message) VALUES (?, ?, ?)",
      [job_id, applicant_id, message || null]
    );

    res.status(201).json({
      id: result.insertId,
      job_id,
      applicant_id,
      message: message || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
});

// Keep your other older CRUD endpoints (companies, users admin routes, etc.) as needed.
// If you had routes already for /companies, /users, /applications GET etc. keep them too.

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
