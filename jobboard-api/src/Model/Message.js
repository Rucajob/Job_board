import db from "../config/db.js";

class Message {
  static async create({ prenom, nom, email, sujet, message }) {
    const [result] = await db.execute(
      "INSERT INTO messages (prenom, nom, email, sujet, message) VALUES (?, ?, ?, ?, ?)",
      [prenom, nom, email, sujet, message]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM messages ORDER BY created_at DESC");
    return rows;
  }
}

export default Message;
