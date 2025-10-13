import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import des routes
import usersRoutes from "./routes/usersRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import applicationsRoutes from "./routes/applicationsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

// Brancher les routes
app.use("/users", usersRoutes);
app.use("/companies", companiesRoutes);
app.use("/jobs", jobsRoutes);
app.use("/applications", applicationsRoutes);
app.use("/auth", authRoutes);

export default app;
