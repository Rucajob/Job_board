// admin.js
const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

let currentUser;
const pageSize = 10;

// Pagination state
const state = {
  usersPage: 1,
  companiesPage: 1,
  jobsPage: 1,
  applicationsPage: 1,
};

async function fetchJSON(url, options = {}) {
  options.headers = {
    ...(options.headers || {}),
    Authorization: "Bearer " + token,
  };
  const res = await fetch(url, options);
  if (!res.ok) throw new Error("API Error");
  return res.json();
}

async function checkAdmin() {
  currentUser = await fetchCurrentUser();
  if (!currentUser || currentUser.role !== "admin") {
    alert("Admins only!");
    window.location.href = "index.html";
  }
  document.getElementById(
    "welcome"
  ).innerText = `Welcome, ${currentUser.full_name} (Admin)`;
}

// ---------------- Users ----------------
async function loadUsers() {
  const { data, total } = await fetchJSON(
    `/api/users?page=${state.usersPage}&pageSize=${pageSize}`
  );
  const tbody = document.querySelector("#usersTable tbody");
  tbody.innerHTML = "";
  data.forEach((u) => {
    tbody.innerHTML += `<tr>
      <td>${u.id}</td>
      <td>${u.full_name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.status}</td>
      <td>
        <button onclick="deleteUser(${u.id})" class="btn btn-sm btn-danger">Delete</button>
      </td>
    </tr>`;
  });
  document.getElementById("usersPage").innerText = `Page ${state.usersPage}`;
}

async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;
  await fetchJSON(`/api/users/${id}`, { method: "DELETE" });
  loadUsers();
}

// Pagination buttons
document.getElementById("usersPrev").onclick = () => {
  if (state.usersPage > 1) {
    state.usersPage--;
    loadUsers();
  }
};
document.getElementById("usersNext").onclick = () => {
  state.usersPage++;
  loadUsers();
};

// ---------------- Companies ----------------
async function loadCompanies() {
  const { data } = await fetchJSON(
    `/api/companies?page=${state.companiesPage}&pageSize=${pageSize}`
  );
  const tbody = document.querySelector("#companiesTable tbody");
  tbody.innerHTML = "";
  data.forEach((c) => {
    tbody.innerHTML += `<tr>
      <td>${c.user_id}</td>
      <td>${c.company_name}</td>
      <td>${c.website || ""}</td>
      <td>${c.industry || ""}</td>
      <td>${c.location || ""}</td>
      <td><button onclick="deleteCompany(${
        c.user_id
      })" class="btn btn-sm btn-danger">Delete</button></td>
    </tr>`;
  });
  document.getElementById(
    "companiesPage"
  ).innerText = `Page ${state.companiesPage}`;
}

async function deleteCompany(id) {
  if (!confirm("Delete this company?")) return;
  await fetchJSON(`/api/companies/${id}`, { method: "DELETE" });
  loadCompanies();
}

document.getElementById("companiesPrev").onclick = () => {
  if (state.companiesPage > 1) {
    state.companiesPage--;
    loadCompanies();
  }
};
document.getElementById("companiesNext").onclick = () => {
  state.companiesPage++;
  loadCompanies();
};

// ---------------- Jobs ----------------
async function loadJobs() {
  const { data } = await fetchJSON(
    `/api/jobs?page=${state.jobsPage}&pageSize=${pageSize}`
  );
  const tbody = document.querySelector("#jobsTable tbody");
  tbody.innerHTML = "";
  data.forEach((j) => {
    tbody.innerHTML += `<tr>
      <td>${j.id}</td>
      <td>${j.title}</td>
      <td>${j.company_name || ""}</td>
      <td>${j.location || ""}</td>
      <td>${j.employment_type}</td>
      <td><button onclick="deleteJob(${
        j.id
      })" class="btn btn-sm btn-danger">Delete</button></td>
    </tr>`;
  });
  document.getElementById("jobsPage").innerText = `Page ${state.jobsPage}`;
}

async function deleteJob(id) {
  if (!confirm("Delete this job?")) return;
  await fetchJSON(`/api/jobs/${id}`, { method: "DELETE" });
  loadJobs();
}

document.getElementById("jobsPrev").onclick = () => {
  if (state.jobsPage > 1) {
    state.jobsPage--;
    loadJobs();
  }
};
document.getElementById("jobsNext").onclick = () => {
  state.jobsPage++;
  loadJobs();
};

// ---------------- Applications ----------------
async function loadApplications() {
  const { data } = await fetchJSON(
    `/api/applications?page=${state.applicationsPage}&pageSize=${pageSize}`
  );
  const tbody = document.querySelector("#applicationsTable tbody");
  tbody.innerHTML = "";
  data.forEach((a) => {
    tbody.innerHTML += `<tr>
      <td>${a.id}</td>
      <td>${a.job_title || ""}</td>
      <td>${a.applicant_name || ""}</td>
      <td>${a.status}</td>
      <td>${new Date(a.application_date).toLocaleString()}</td>
      <td><button onclick="deleteApplication(${
        a.id
      })" class="btn btn-sm btn-danger">Delete</button></td>
    </tr>`;
  });
  document.getElementById(
    "applicationsPage"
  ).innerText = `Page ${state.applicationsPage}`;
}

async function deleteApplication(id) {
  if (!confirm("Delete this application?")) return;
  await fetchJSON(`/api/applications/${id}`, { method: "DELETE" });
  loadApplications();
}

document.getElementById("applicationsPrev").onclick = () => {
  if (state.applicationsPage > 1) {
    state.applicationsPage--;
    loadApplications();
  }
};
document.getElementById("applicationsNext").onclick = () => {
  state.applicationsPage++;
  loadApplications();
};

// ---------------- Initialize ----------------
(async function init() {
  await checkAdmin();
  loadUsers();
  loadCompanies();
  loadJobs();
  loadApplications();
})();
