import pool from "../config/db.js";

// Public page — anyone can view industry page
export const getIndustryPage = (req, res) => {
  try {
    const entrepriseData = {
      entrepriseNom: "Naghmouchi Riyad",
      entrepriseEmail: "riyad@test.fr",
      entrepriseTel: "+33601020304",
      entrepriseAdresse: "1 rue de Nice, 06000 Nice",
    };

    res.render("pages/industry", {
      ...entrepriseData,
      title: "Ruca — Page Entreprise",
    });
  } catch (err) {
    console.error("Erreur lors du rendu de la page entreprise :", err);
    res.status(500).send("Erreur interne du serveur");
  }
};

// Example of future protected action: create/update/delete industry
export const createIndustry = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await pool.query(
      "INSERT INTO industries (name, description, created_by) VALUES (?, ?, ?)",
      [name, description, userId]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

// Placeholder update/delete with ownership check
export const updateIndustry = async (req, res) => {
  const industryId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  const { name, description } = req.body;

  const [rows] = await pool.query("SELECT * FROM industries WHERE id = ?", [industryId]);
  if (rows.length === 0) return res.status(404).json({ error: "Industry not found" });

  const industry = rows[0];
  if (userRole !== "admin" && industry.created_by !== userId) {
    return res.status(403).json({ error: "Access denied" });
  }

  await pool.query(
    "UPDATE industries SET name=?, description=? WHERE id=?",
    [name, description, industryId]
  );
  res.json({ message: "Industry updated" });
};

export const deleteIndustry = async (req, res) => {
  const industryId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  const [rows] = await pool.query("SELECT * FROM industries WHERE id = ?", [industryId]);
  if (rows.length === 0) return res.status(404).json({ error: "Industry not found" });

  const industry = rows[0];
  if (userRole !== "admin" && industry.created_by !== userId) {
    return res.status(403).json({ error: "Access denied" });
  }

  await pool.query("DELETE FROM industries WHERE id = ?", [industryId]);
  res.json({ message: "Industry deleted" });
};
