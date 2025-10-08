import pool from "../config/db.js";

// Obtenir toutes les candidatures
export const getAllApplications = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applications");
  res.json(rows);
};

// Obtenir une candidature par ID
export const getApplicationById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applications WHERE id=?", [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ message: "Application not found" });
  res.json(rows[0]);
};

// Créer une candidature
export const createApplication = async (req, res) => {
  const { job_id, user_id, message } = req.body;
  const [result] = await pool.query(
    "INSERT INTO applications (job_id, user_id, message) VALUES (?, ?, ?)",
    [job_id, user_id, message]
  );
  res.status(201).json({ id: result.insertId, job_id, user_id, message });
};

// Mettre à jour une candidature
export const updateApplication = async (req, res) => {
  const { job_id, user_id, message, status } = req.body;
  await pool.query(
    "UPDATE applications SET job_id=?, user_id=?, message=?, status=? WHERE id=?",
    [job_id, user_id, message, status, req.params.id]
  );
  res.json({ message: "Application updated" });
};

// Supprimer une candidature
export const deleteApplication = async (req, res) => {
  const [result] = await pool.query("DELETE FROM applications WHERE id=?", [req.params.id]);
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Application not found" });
  res.json({ message: "Application deleted" });
};
