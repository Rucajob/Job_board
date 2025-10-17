// src/routes/companiesRoutes.js
import express from "express";
import {
  listCompanies,
  showCompany,
  addCompanyForm,
  createCompany,
  updateCompany,
  deleteCompany,
  renderCompaniesPage
} from "../Controllers/companiesController.js";

const router = express.Router();

// Admin / gestion interne
router.get("/", listCompanies);          // Liste des entreprises
router.get("/add", addCompanyForm);      // Formulaire d’ajout
router.post("/add", createCompany);      // Création
router.get("/edit/:id", showCompany);    // Détails / édition
router.post("/edit/:id", updateCompany); // Mise à jour
router.get("/delete/:id", deleteCompany); // Suppression

export default router;
