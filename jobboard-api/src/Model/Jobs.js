import pool from "../config/db.js";

export default class Job {
  static async getAll(search = null) {
    let query = "SELECT * FROM jobs";
    let params = [];
    if (search) {
      query += " WHERE title LIKE ? OR location LIKE ?";
      params = [`%${search}%`, `%${search}%`];
    }
    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(
      `SELECT j.*, c.name AS company_name
       FROM jobs j
       JOIN companies c ON j.company_id = c.id
       WHERE j.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const [result] = await pool.query(
      `INSERT INTO jobs (company_id, title, short_description, full_description, salary, location, working_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.company_id,
        data.title,
        data.short_description,
        data.full_description,
        data.salary,
        data.location,
        data.working_hours
      ]
    );
    return result.insertId;
  }

  static async update(id, data) {
    await pool.query(
      `UPDATE jobs SET company_id=?, title=?, short_description=?, full_description=?, salary=?, location=?, working_hours=? WHERE id=?`,
      [
        data.company_id,
        data.title,
        data.short_description,
        data.full_description,
        data.salary,
        data.location,
        data.working_hours,
        id
      ]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM jobs WHERE id=?", [id]);
  }
}