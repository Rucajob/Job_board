import pool from "../config/db.js";

// Obtenir toutes les entreprises
export const getAllCompanies = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM companies");
  res.json(rows);
};

// Obtenir une entreprise par ID
export const getCompanyById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM companies WHERE id = ?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "Company not found" });
  res.json(rows[0]);
};

// Créer une entreprise
export const createCompany = async (req, res) => {
  const { name, website, email, phone } = req.body;
  const [result] = await pool.query(
    "INSERT INTO companies (name, website, email, phone) VALUES (?, ?, ?, ?)",
    [name, website, email, phone]
  );
  res.status(201).json({ id: result.insertId, name, website, email, phone });
};

// Mettre à jour une entreprise
export const updateCompany = async (req, res) => {
  const { name, website, email, phone } = req.body;
  await pool.query(
    "UPDATE companies SET name=?, website=?, email=?, phone=? WHERE id=?",
    [name, website, email, phone, req.params.id]
  );
  res.json({ message: "Company updated" });
};

// Supprimer une entreprise
export const deleteCompany = async (req, res) => {
  await pool.query("DELETE FROM companies WHERE id=?", [req.params.id]);
  res.json({ message: "Company deleted" });
};
