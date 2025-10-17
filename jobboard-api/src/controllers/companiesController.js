// controllers/companiesController.js
import pool from "../config/db.js";

// 🟢 Get all companies (public)
export const getAllCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM companies");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🟢 Get company by ID (public)
export const getCompanyById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM companies WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: "Company not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching company:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🟠 Create company (employer or admin)
export const createCompany = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, website, email, phone, industry, location, description } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      `INSERT INTO companies (user_id, name, website, email, phone, industry, location, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, website, email, phone, industry, location, description]
    );

    res.status(201).json({
      message: "Company created successfully",
      company: { id: result.insertId, name, user_id: userId },
    });
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🟡 Update company (owner or admin)
export const updateCompany = async (req, res) => {
  try {
    const { name, website, email, phone, industry, location, description } = req.body;
    await pool.query(
      `UPDATE companies
       SET name=?, website=?, email=?, phone=?, industry=?, location=?, description=?
       WHERE id=?`,
      [name, website, email, phone, industry, location, description, req.params.id]
    );
    res.json({ message: "Company updated successfully" });
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🔴 Delete company (owner or admin)
export const deleteCompany = async (req, res) => {
  try {
    await pool.query("DELETE FROM companies WHERE id=?", [req.params.id]);
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    console.error("Error deleting company:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
