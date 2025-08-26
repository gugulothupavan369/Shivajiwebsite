document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

//    for (const [key, value] of formData.entries()) {
//   console.log(key, value);
// }
    

    try {
      const res = await fetch("/api/expenses/submitExpense", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save expense");

      alert("✅ Expense saved");
      form.reset();
    } catch (err) {
      console.error("Error:", err);
      alert("❌ " + err.message);
    }
  });
});
