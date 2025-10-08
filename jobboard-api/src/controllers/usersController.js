import pool from "../config/db.js";

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "User not found" });
  res.json(rows[0]);
};

// Créer un utilisateur
export const createUser = async (req, res) => {
  const { full_name, email, password, role, phone } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, password, role || "applicant", phone || null]
    );
    res.status(201).json({
      id: result.insertId,
      full_name,
      email,
      role: role || "applicant",
      phone
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ error: "Email already exists" });
    res.status(500).json({ error: "Database error" });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  const { full_name, email, password, role, status } = req.body;
  await pool.query(
    "UPDATE users SET full_name=?, email=?, password=?, role=?, status=? WHERE id=?",
    [full_name, email, password, role, status || "active", req.params.id]
  );
  res.json({ message: "User updated" });
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  const [result] = await pool.query("DELETE FROM users WHERE id=?", [req.params.id]);
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};
