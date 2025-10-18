import User from "../Model/Users.js";
import Company from "../Model/Companies.js";
import Job from "../Model/Jobs.js";
import Application from "../Model/Applications.js";
import Message from "../Model/Message.js";

export const renderAdminDashboard = async (req, res) => {
  try {
    // Récupérer les données
    const users = await User.getAll();
    const companies = await Company.getAll();
    const jobs = await Job.getAll();
    const applications = await Application.getAll();
    const messages = await Message.getAll();

    // Filtrer les candidats et admins
    const candidates = users.filter(u => u.role === "candidate");
    const admins = users.filter(u => u.role === "admin");

    res.render("admin/admin", {
      admins,
      candidates,
      companies,
      jobs,
      applications,
      messages
    });
  } catch (err) {
    console.error("Erreur dans renderAdminDashboard :", err);
    res.status(500).send("Erreur serveur sur la page admin");
  }
};
