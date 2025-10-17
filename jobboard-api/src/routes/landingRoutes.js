import express from "express";
import { renderLandingPage } from "../Controllers/jobsController.js";

const router = express.Router();

router.get("/landing", renderLandingPage);

export default router;
