import Application from "../Model/Applications.js";
import Job from "../Model/Jobs.js";
import User from "../Model/Users.js";

// Liste des candidatures
export const listApplications = async (req, res) => {
  const applications = await Application.getAll();
  res.render("applications/index", { applications });
};

// Détail d'une candidature
export const showApplication = async (req, res) => {
  const application = await Application.getById(req.params.id);
  res.render("applications/edit", { application });
};

// Formulaire de création
export const addApplicationForm = async (req, res) => {
  const jobs = await Job.getAll();
  const users = await User.getAll();
  res.render("applications/add", { jobs, users });
};

// Créer une candidature
export const createApplication = async (req, res) => {
  await Application.create(req.body);
  res.redirect("/applications");
};

// Modifier une candidature
export const updateApplication = async (req, res) => {
  await Application.update(req.params.id, req.body);
  res.redirect("/applications");
};

// Supprimer une candidature
export const deleteApplication = async (req, res) => {
  await Application.delete(req.params.id);
  res.redirect("/applications");
};

// 🆕 Page publique : affichage des candidatures d’un utilisateur
export const renderUserApplications = async (req, res) => {
  const applications = await Application.getByUserId(req.params.userId);
  res.render("pages/userApplications", { applications });
};
