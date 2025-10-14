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
app.set("views", path.join(__dirname, "View"));

// 🔹 Servir les fichiers statiques (images, CSS, JS)
app.use(express.static(path.join(__dirname, "View", "public")));

// TESTING PAGE
app.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, "../../index.html"));
  });

// 🔹 ADMIN
// tout ce qui commence par /admin/... doit venir du dossier /admin
// et la route /admin spécifique renvoie la page principale.
app.use("/admin", express.static(path.join(__dirname, "../../admin")));
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../../admin/admin.html"));
});

// 🔹 Routes front (EJS)
app.get("/", (req, res) => res.render("pages/accueil"));
app.get("/connexion", (req, res) => res.render("pages/login"));
app.get("/inscription", (req, res) => res.render("pages/signup"));
app.get("/candidature", (req, res) => res.render("pages/candidature"));
app.use("/jobs", jobsRoutes);

// 🔹 Routes API
app.use("/api/users", usersRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/auth", authRoutes);

export default app;
