import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";
import { checkOwnership } from "../middlewares/checkOwnership.js";
import pool from "../config/db.js";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/usersController.js";

const router = express.Router();

// 🌐 Public: create user (registration)
router.post("/", createUser);

// 👤 Admin: list all users
router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);

// 👤 Owner or Admin: get a single user
router.get("/:id", verifyToken, checkOwnership({
  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
    return rows[0];
  }
}, "id"), getUserById);

// 👤 Owner or Admin: update user
router.put("/:id", verifyToken, checkOwnership({
  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [id]);
    return rows[0];
  }
}, "id"), updateUser);

// 🛑 Admin only: delete user
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

export default router;
