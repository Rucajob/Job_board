import Job from "../Model/Jobs.js";
import Company from "../Model/Companies.js";

// 🌐 Public pages
export const listJobs = async (req, res) => {
  try {
    const jobs = await Job.getAll(req.query.q);
    res.render("jobs/index", { jobs });
  } catch (err) {
    console.error("Error listing jobs:", err);
    res.status(500).send("Internal server error");
  }
};

export const showJob = async (req, res) => {
  try {
    const job = await Job.getById(req.params.id);
    if (!job) return res.status(404).send("Job not found");

    res.render("jobs/edit", { job });
  } catch (err) {
    console.error("Error showing job:", err);
    res.status(500).send("Internal server error");
  }
};

// 👔 Employer/Admin pages
export const addJobForm = async (req, res) => {
  try {
    const companies = await Company.getAll();
    res.render("jobs/add", { companies });
  } catch (err) {
    console.error("Error fetching companies:", err);
    res.status(500).send("Internal server error");
  }
};

export const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, created_by: req.user.id }; // attach employer ID
    await Job.create(jobData);
    res.redirect("/jobs");
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).send("Internal server error");
  }
};

// ✅ Ownership enforced via checkOwnership middleware
export const updateJob = async (req, res) => {
  try {
    // req.resource is set by checkOwnership middleware
    await Job.update(req.resource.id, req.body);
    res.redirect("/jobs");
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).send("Internal server error");
  }
};

export const deleteJob = async (req, res) => {
  try {
    await Job.delete(req.resource.id);
    res.redirect("/jobs");
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).send("Internal server error");
  }
};
