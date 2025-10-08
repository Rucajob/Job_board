import pool from "../config/db.js";

// Obtenir tous les jobs (avec recherche facultative)
export const getAllJobs = async (req, res) => {
  const search = req.query.q;
  let query = "SELECT * FROM jobs";
  let params = [];

  if (search) {
    query += " WHERE title LIKE ? OR location LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  }

  const [rows] = await pool.query(query, params);
  res.json(rows);
};

// Obtenir un job par ID (avec info sur l’entreprise)
export const getJobById = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT j.*, c.name AS company_name, c.website, c.email AS company_email
     FROM jobs j
     JOIN companies c ON j.company_id = c.id
     WHERE j.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ message: "Job not found" });
  res.json(rows[0]);
};

// Créer un job
export const createJob = async (req, res) => {
  const { company_id, title, short_description, full_description, salary, location, working_hours } = req.body;
  const [result] = await pool.query(
    `INSERT INTO jobs (company_id, title, short_description, full_description, salary, location, working_hours)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [company_id, title, short_description, full_description, salary, location, working_hours]
  );
  res.status(201).json({ id: result.insertId, title });
};

// Mettre à jour un job
export const updateJob = async (req, res) => {
  const { company_id, title, short_description, full_description, salary, location, working_hours } = req.body;
  await pool.query(
    `UPDATE jobs SET company_id=?, title=?, short_description=?, full_description=?, salary=?, location=?, working_hours=? WHERE id=?`,
    [company_id, title, short_description, full_description, salary, location, working_hours, req.params.id]
  );
  res.json({ message: "Job updated" });
};

// Supprimer un job
export const deleteJob = async (req, res) => {
  await pool.query("DELETE FROM jobs WHERE id=?", [req.params.id]);
  res.json({ message: "Job deleted" });
};
