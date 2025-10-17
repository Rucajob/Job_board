import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import usersRoutes from "./routes/usersRoutes.js";
import companiesRoutes from "./routes/companiesRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
import applicationsRoutes from "./routes/applicationsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import industryRoutes from "./routes/industryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";


import { renderLandingPage } from "./Controllers/jobsController.js";
import { renderJobsPage } from "./Controllers/jobsController.js";

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
// 🔹 ADMIN DASHBOARD (EJS)
app.use("/admin", adminRoutes);

// 🔹 Routes front (EJS)
app.get("/", (req, res) => res.render("pages/home"));
app.get("/login", (req, res) => res.render("pages/login"));
app.get("/signup", (req, res) => res.render("pages/signup"));
app.get("/applications", (req, res) => res.render("pages/applications"));
app.get("/offers", renderJobsPage);
app.get("/landing", renderLandingPage);
app.get("/contact", (req, res) => {
  res.render("pages/contact");
});
app.post("/contact", (req, res) => {
  console.log(req.body);
  res.render("pages/contact", { message: "Message envoyé avec succès !" });
});

app.use("/industry", industryRoutes);
app.use("/jobs", jobsRoutes);

// 🔹 Routes API
app.use("/api/users", usersRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/auth", authRoutes);

export default app;
