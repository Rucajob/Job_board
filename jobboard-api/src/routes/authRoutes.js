import express from "express";
import { register, login } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// 👇 celle que le front appelle avec fetchCurrentUser()
router.get("/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;