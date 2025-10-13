import express from "express";
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} from "../controllers/applicationsController.js";

const router = express.Router();

router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;