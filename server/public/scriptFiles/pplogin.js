// pplogin.js
console.log("Login JS loaded");

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const loginData = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };

    try {
      const res = await fetch("/api/auth/pplogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // <--- IMPORTANT (send/receive cookies)
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Login successful!");
        window.location.href = "/ppdashboard";
      } else {
        alert("❌ Login failed: " + data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong, please try again.");
    }
  });
});
