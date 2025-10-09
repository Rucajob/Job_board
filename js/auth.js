// Job-board/js/auth.js
// Shared auth helper used by login.html, register.html and index.html
const API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  // Register form handling
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
        setTimeout(() => (window.location.href = "login.html"), 1000);
      }
    });
  }

  // Login form handling
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
        localStorage.setItem("token", data.token);
        // Save some quick info for UI (optional)
        try {
          localStorage.setItem("userName", data.user.full_name || "");
          localStorage.setItem("userEmail", data.user.email || "");
        } catch (e) {}
        window.location.href = "index.html";
      }
    });
  }
});

// convenient helper: get token
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

// expose to global for inline use (since modules aren't used in simple HTML)
window.fetchCurrentUser = fetchCurrentUser;
window.API_URL = API_URL;
