import express from "express";
import {
  getIndustryPage,
  createIndustry,
  updateIndustry,
  deleteIndustry
} from "../controllers/industryController.js";

import { verifyToken, authorizeRoles } from "../middlewares/auth.js";
import { checkOwnership } from "../middlewares/checkOwnership.js";
import pool from "../config/db.js";

const router = express.Router();

// Public route
router.get("/", getIndustryPage);

// Protected routes — admin can edit all, employer only their own
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "employer"),
  createIndustry
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "employer"),
  checkOwnership(
    { getById: async (id) => {
      const [rows] = await pool.query("SELECT * FROM industries WHERE id=?", [id]);
      return rows[0];
    }},
    "user_id" // assuming industries table has a user_id field
  ),
  updateIndustry
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "employer"),
  checkOwnership(
    { getById: async (id) => {
      const [rows] = await pool.query("SELECT * FROM industries WHERE id=?", [id]);
      return rows[0];
    }},
    "user_id"
  ),
  deleteIndustry
);

export default router;
