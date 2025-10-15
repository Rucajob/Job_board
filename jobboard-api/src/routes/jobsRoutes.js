import express from "express";
import {
  listJobs,
  showJob,
  addJobForm,
  createJob,
  updateJob,
  deleteJob
} from "../Controllers/jobsController.js";

const router = express.Router();

// ✅ Page listant les jobs
router.get("/", listJobs);

// ✅ Page "Ajouter un job"
router.get("/add", addJobForm);
router.post("/add", createJob);

// ✅ Page "Modifier un job"
router.get("/edit/:id", showJob);
router.post("/edit/:id", updateJob);

// ✅ Supprimer un job
router.post("/delete/:id", deleteJob);

export default router;
