import express from "express";
import {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication
} from "../controllers/applicationsController.js";

import { verifyToken, verifyTokenOptional, authorizeRoles } from "../middlewares/auth.js";
import { checkOwnership } from "../middlewares/checkOwnership.js";
import pool from "../config/db.js";

const router = express.Router();

// Admin
router.get("/", verifyToken, authorizeRoles("admin"), getAllApplications);

// Get one application (admin or owner)
router.get("/:id", verifyToken, checkOwnership({ getById: async (id) => {
  const [rows] = await pool.query("SELECT * FROM applications WHERE id=?", [id]);
  return rows[0];
}}, "applicant_id"), getApplicationById);

// Create application (guest or logged-in)
router.post("/", verifyTokenOptional, createApplication);

// Update/Delete (admin or owner)
router.put("/:id", verifyToken, checkOwnership({ getById: async (id) => {
  const [rows] = await pool.query("SELECT * FROM applications WHERE id=?", [id]);
  return rows[0];
}}, "applicant_id"), updateApplication);

router.delete("/:id", verifyToken, checkOwnership({ getById: async (id) => {
  const [rows] = await pool.query("SELECT * FROM applications WHERE id=?", [id]);
  return rows[0];
}}, "applicant_id"), deleteApplication);

export default router;
