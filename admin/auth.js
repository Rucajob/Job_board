async function fetchCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html";
      return null;
    }
  
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: "Bearer " + token },
    });
  
    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return null;
    }
  
    return res.json();
  }
  