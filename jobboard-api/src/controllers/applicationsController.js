import pool from "../config/db.js";

export const getAllApplications = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applications");
  res.json(rows);
};

export const getApplicationById = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM applications WHERE id=?", [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: "Application not found" });
  res.json(rows[0]);
};

export const createApplication = async (req, res) => {
  const { job_id, message, email, phone, resume } = req.body;
  const applicant_id = req.user ? req.user.id : null;

  if (!applicant_id && (!email || !message)) {
    return res.status(400).json({ error: "Guests must provide email and message" });
  }

  const [result] = await pool.query(
    `INSERT INTO applications (job_id, applicant_id, message, email, phone, resume) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [job_id, applicant_id, message, email || null, phone || null, resume || null]
  );

  res.status(201).json({ id: result.insertId, job_id, applicant_id });
};

export const updateApplication = async (req, res) => {
  const { job_id, message, status } = req.body;
  await pool.query(
    "UPDATE applications SET job_id=?, message=?, status=? WHERE id=?",
    [job_id, message, status, req.params.id]
  );
  res.json({ message: "Application updated" });
};

export const deleteApplication = async (req, res) => {
  await pool.query("DELETE FROM applications WHERE id=?", [req.params.id]);
  res.json({ message: "Application deleted" });
};
