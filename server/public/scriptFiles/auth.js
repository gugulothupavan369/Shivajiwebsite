// public/js/auth.js
console.log("this is auth");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include", // cookies included
    });

    const data = await res.json();

    const loginBtn = document.getElementById("loginBtn");
    const dashboardLink = document.getElementById("dashboardLink");
    const logoutBtn = document.getElementById("logoutBtn");
    const events = document.getElementById("events");
    const welcomeText = document.getElementById("welcomeText");

    if (data.user) {
      if (welcomeText)
        welcomeText.textContent = `Welcome, ${data.user.fullname}! 🎉`;
      // ✅ user logged in → show dashboard, payments, logout
      if (loginBtn) loginBtn.style.display = "none";
      if (dashboardLink) dashboardLink.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
      if (events) events.style.display = "inline-block";
    } else {
      // ❌ not logged in → show login, signup
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (dashboardLink) dashboardLink.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "none";
      if (events) events.style.display = "none";
    }

    // logout action
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        window.location.href = "/"; // back to homepage
      });
    }
  } catch (err) {
    console.error("Auth check failed:", err);
  }
});
