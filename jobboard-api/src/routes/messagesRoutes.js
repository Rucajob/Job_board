import express from "express";
import { sendMessage } from "../Controllers/messagesController.js";

const router = express.Router();

router.post("/", sendMessage);

export default router;
