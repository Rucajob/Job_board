import express from "express";
import {
  listUsers,
  showUser,
  addUserForm,
  createUser,
  updateUser,
  deleteUser,
  renderUserProfile
} from "../Controllers/usersController.js";

const router = express.Router();

router.get("/", listUsers);
router.get("/add", addUserForm);
router.post("/add", createUser);
router.get("/edit/:id", showUser);
router.post("/edit/:id", updateUser);
router.get("/delete/:id", deleteUser);

// 🔸 Profil utilisateur (après le reste)
router.get("/:id/profile", renderUserProfile);

export default router;
