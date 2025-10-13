import pool from "../config/db.js";

export default class User {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(data) {
    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)",
      [data.full_name, data.email, data.password, data.role, data.phone]
    );
    return result.insertId;
  }

  static async update(id, data) {
    await pool.query(
      "UPDATE users SET full_name=?, email=?, password=?, role=?, status=? WHERE id=?",
      [
        data.full_name,
        data.email,
        data.password,
        data.role,
        data.status || "active",
        id
      ]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM users WHERE id=?", [id]);
  }
}
