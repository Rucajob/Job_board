import express from "express";
import { renderAdminDashboard } from "../Controllers/adminController.js";

const router = express.Router();

// Page principale admin
router.get("/", renderAdminDashboard);

export default router;
