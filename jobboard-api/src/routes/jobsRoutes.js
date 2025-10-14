import express from "express";
import {
  listJobs,
  showJob,
  createJob,
  updateJob,
  deleteJob
} from "../Controllers/jobsController.js";

const router = express.Router();

router.get("/", listJobs);
router.get("/:id", showJob);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
