import express from "express";
import {
  listJobs,
  showJob,
  createJob,
  updateJob,
  deleteJob,
  renderJobDetails,
  renderJobsPage, 
} from "../Controllers/jobsController.js";

const router = express.Router();

router.get("/", listJobs);
router.get("/:id", showJob);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

// ✅ Routes front (EJS)
router.get("/details/:id", renderJobDetails);
router.get("/home", renderJobsPage); // affichage page home dynamique


export default router;
