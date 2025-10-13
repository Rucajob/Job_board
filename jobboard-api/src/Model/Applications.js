import pool from "../config/db.js";

export default class Application {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM applications");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM applications WHERE id=?", [id]);
    return rows[0];
  }

  static async create(data) {
    const [result] = await pool.query(
      "INSERT INTO applications (job_id, user_id, message) VALUES (?, ?, ?)",
      [data.job_id, data.user_id, data.message]
    );
    return result.insertId;
  }

  static async update(id, data) {
    await pool.query(
      "UPDATE applications SET job_id=?, user_id=?, message=?, status=? WHERE id=?",
      [data.job_id, data.user_id, data.message, data.status, id]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM applications WHERE id=?", [id]);
  }
}
