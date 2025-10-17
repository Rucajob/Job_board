// routes/companiesRoutes.js
import express from "express";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} from "../controllers/companiesController.js";

import { verifyToken, authorizeRoles } from "../middlewares/auth.js";
import { checkOwnership } from "../middlewares/ownership.js"; // ✅ corrected path
import pool from "../config/db.js";

const router = express.Router();

// 🟢 Public routes
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

// 🟠 Protected routes
router.post(
  "/",
  verifyToken,
  authorizeRoles("employer", "admin"),
  createCompany
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("employer", "admin"),
  checkOwnership(
    async (id) => {
      const [rows] = await pool.query("SELECT * FROM companies WHERE id=?", [id]);
      return rows[0];
    },
    "id", // param name in route
    "user_id" // ownership field in DB
  ),
  updateCompany
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("employer", "admin"),
  checkOwnership(
    async (id) => {
      const [rows] = await pool.query("SELECT * FROM companies WHERE id=?", [id]);
      return rows[0];
    },
    "id",
    "user_id"
  ),
  deleteCompany
);

export default router;
