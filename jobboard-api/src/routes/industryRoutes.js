import express from "express";
import { getIndustryPage } from "../Controllers/industryController.js";

const router = express.Router();

router.get("/", getIndustryPage);

export default router;
