// src/routes/applicationsRoutes.js
import express from "express";
import {
  listApplications,
  showApplication,
  addApplicationForm,
  createApplication,
  updateApplication,
  deleteApplication,
  renderUserApplications
} from "../Controllers/applicationsController.js";

const router = express.Router();

// Gestion interne (admin ou dashboard)
router.get("/", listApplications);              // Liste des candidatures
router.get("/add", addApplicationForm);         // Formulaire d’ajout
router.post("/add", createApplication);         // Création
router.get("/edit/:id", showApplication);       // Page d’édition
router.post("/edit/:id", updateApplication);    // Mise à jour
router.get("/delete/:id", deleteApplication);   // Suppression

// Page publique (ex: voir les candidatures d’un utilisateur)
router.get("/user/:userId", renderUserApplications);

export default router;