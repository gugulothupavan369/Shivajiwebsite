// ppsignup.js
console.log("this is js file");


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".signup-form");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); // prevent page reload
  
      // Collect form data
      const userData = {
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      };
  
      try {
        // Send JSON to backend
        const res = await fetch("/api/auth/ppsignup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          alert("Signup successful ✅");
          window.location.href = "/pplogin"; // redirect to login page
        } else {
          alert("❌ Error: " + data.message);
        }
      } catch (err) {
        console.error("Signup failed:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  });
  