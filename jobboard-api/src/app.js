import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

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
app.use(express.urlencoded({ extended: true }));

// 🔹 Configurer EJS
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/accueil"));
app.set("views", path.join(__dirname, "View"));

// 🔹 Servir les fichiers statiques (images, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Routes front (EJS)
app.get("/", (req, res) => res.render("pages/accueil"));
app.get("/connexion", (req, res) => res.render("pages/login"));
app.get("/inscription", (req, res) => res.render("pages/signup"));
app.get("/home", (req, res) => res.render("pages/home"));
app.get("/candidature", (req, res) => res.render("pages/candidature"));

// 🔹 Routes API
app.use("/users", usersRoutes);
app.use("/companies", companiesRoutes);
app.use("/jobs", jobsRoutes);
app.use("/applications", applicationsRoutes);
app.use("/auth", authRoutes);

export default app;
