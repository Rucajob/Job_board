import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, full_name, email, role, phone, status FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Get user by ID (owner or admin)
export const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, role, phone, status FROM users WHERE id=?",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Create a user (public)
export const createUser = async (req, res) => {
  try {
    const { full_name, email, password, role, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, hashedPassword, role || "applicant", phone || null]
    );

    res.status(201).json({ id: result.insertId, full_name, email, role: role || "applicant", phone });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already registered" });
    }
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Update user (owner or admin)
export const updateUser = async (req, res) => {
  try {
    const { full_name, email, password, role, status } = req.body;

    // Hash password only if provided
    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Only update password if provided
    const query = `
      UPDATE users 
      SET full_name=?, email=?, password=COALESCE(?, password), role=?, status=? 
      WHERE id=?`;
    await pool.query(query, [
      full_name,
      email,
      hashedPassword,
      role,
      status || "active",
      req.params.id
    ]);

    res.json({ message: "User updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id=?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
