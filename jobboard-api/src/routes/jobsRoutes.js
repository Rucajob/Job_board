import express from "express";
import {
  listJobs,
  showJob,
  addJobForm,
  createJob,
  updateJob,
  deleteJob
} from "../controllers/jobsController.js";

import { verifyToken, verifyTokenOptional, authorizeRoles } from "../middlewares/auth.js";
import { checkOwnership } from "../middlewares/checkOwnership.js";
import Job from "../Model/Jobs.js";

const router = express.Router();

// 🌐 Public
router.get("/", verifyTokenOptional, listJobs);
router.get("/view/:id", verifyTokenOptional, showJob);

// 👔 Employer/Admin
router.get("/add", verifyToken, authorizeRoles("employer"), addJobForm);
router.post("/add", verifyToken, authorizeRoles("employer"), createJob);

// ✏️ Edit/Update/Delete with ownership check
router.get("/edit/:id", verifyToken, authorizeRoles("employer", "admin"),
  checkOwnership(async (id) => await Job.getById(id), "id", "created_by"),
  showJob
);

router.put("/:id", verifyToken, authorizeRoles("employer", "admin"),
  checkOwnership(async (id) => await Job.getById(id), "id", "created_by"),
  updateJob
);

router.delete("/:id", verifyToken, authorizeRoles("employer", "admin"),
  checkOwnership(async (id) => await Job.getById(id), "id", "created_by"),
  deleteJob
);

export default router;
