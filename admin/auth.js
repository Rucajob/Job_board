const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // 🧾 Register Form Handling
  // ============================
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const full_name = document.getElementById("full_name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = document.getElementById("role")
        ? document.getElementById("role").value
        : "applicant";

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password, role }),
      });

      const data = await res.json();
      document.getElementById("message").innerText =
        data.message || JSON.stringify(data);

      if (res.ok) {
        // Redirect to login page after successful registration
        setTimeout(() => (window.location.href = "login.html"), 1000);
      }
    });
  }

  // ============================
  // 🔑 Login Form Handling
  // ============================
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      document.getElementById("message").innerText =
        data.message || JSON.stringify(data);

      if (res.ok && data.token) {
        // Save token and user info locally
        localStorage.setItem("token", data.token);
        try {
          localStorage.setItem("userName", data.user.full_name || "");
          localStorage.setItem("userEmail", data.user.email || "");
        } catch (e) {}

        // 🧭 Redirect admin@example.com to admin dashboard
        if (data.user.email === "admin@example.com") {
          window.location.href = "admin/admin.html";
        } else {
          window.location.href = "index.html";
        }
      }
    });
  }
});

// ============================
// 👤 Fetch Current User Helper
// ============================
export async function fetchCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: "Bearer " + token },
    });
    if (!res.ok) {
      localStorage.removeItem("token");
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

// Expose globally (since no ES modules are used in plain HTML)
window.fetchCurrentUser = fetchCurrentUser;
window.API_URL = API_URL;