import Company from "../Model/Companies.js";
import Job from "../Model/Jobs.js";

// Liste des entreprises
export const listCompanies = async (req, res) => {
  const companies = await Company.getAll();
  res.render("companies/index", { companies });
};

// Détail d'une entreprise
export const showCompany = async (req, res) => {
  const company = await Company.getById(req.params.id);
  const jobs = await Job.getByCompanyId(req.params.id);
  res.render("companies/show", { company, jobs });
};

// Formulaire d’ajout
export const addCompanyForm = (req, res) => {
  res.render("companies/add");
};

// Créer une entreprise
export const createCompany = async (req, res) => {
  await Company.create(req.body);
  res.redirect("/companies");
};

// Modifier une entreprise
export const updateCompany = async (req, res) => {
  await Company.update(req.params.id, req.body);
  res.redirect("/companies");
};

// Supprimer une entreprise
export const deleteCompany = async (req, res) => {
  await Company.delete(req.params.id);
  res.redirect("/companies");
};

// 🆕 Page publique : affichage des entreprises
export const renderCompaniesPage = async (req, res) => {
  const companies = await Company.getAll();
  res.render("pages/companies", { companies });
};
