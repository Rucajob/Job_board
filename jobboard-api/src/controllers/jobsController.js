import Job from "../Model/Jobs.js";
import Company from "../Model/Companies.js";

export const listJobs = async (req, res) => {
  const jobs = await Job.getAll(req.query.q);
  res.render("jobs/index", { jobs });
};

export const showJob = async (req, res) => {
  const job = await Job.getById(req.params.id);
  res.render("jobs/edit", { job });
};

export const addJobForm = async (req, res) => {
  const companies = await Company.getAll();
  res.render("jobs/add", { companies });
};

export const createJob = async (req, res) => {
  await Job.create(req.body);
  res.redirect("/jobs");
};

export const updateJob = async (req, res) => {
  await Job.update(req.params.id, req.body);
  res.redirect("/jobs");
};

export const deleteJob = async (req, res) => {
  await Job.delete(req.params.id);
  res.redirect("/jobs");
};

// 🆕 Page publique "Offres" avec toutes les offres
export const renderJobsPage = async (req, res) => {
  try {
    const jobs = await Job.getAll();
    res.render("pages/offers", { jobs });
  } catch (error) {
    console.error("Erreur lors du rendu des jobs :", error);
    res.status(500).send("Erreur serveur");
  }
};

export const renderJobDetails = async (req, res) => {
  try {
    const job = await Job.getById(req.params.id);
    if (!job) return res.status(404).send("Offre introuvable");
    res.render("pages/jobDetails", { job });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur serveur");
  }
};