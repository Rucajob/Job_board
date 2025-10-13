import pool from "../config/db.js";

export default class Company {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM companies");
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query("SELECT * FROM companies WHERE id = ?", [id]);
    return rows[0];
  }

  static async create(data) {
    const [result] = await pool.query(
      "INSERT INTO companies (name, website, email, phone) VALUES (?, ?, ?, ?)",
      [data.name, data.website, data.email, data.phone]
    );
    return result.insertId;
  }

  static async update(id, data) {
    await pool.query(
      "UPDATE companies SET name=?, website=?, email=?, phone=? WHERE id=?",
      [data.name, data.website, data.email, data.phone, id]
    );
  }

  static async delete(id) {
    await pool.query("DELETE FROM companies WHERE id=?", [id]);
  }
}