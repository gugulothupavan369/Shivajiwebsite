// Load Expenses from MongoDB (via Express API)
async function loadExpenses() {
  const tableBody = document.querySelector("#expenseTable tbody");
  tableBody.innerHTML = "";
    const params = new URLSearchParams(window.location.search);
    const year = params.get("year");

    document.getElementById("pageTitle").textContent = `Ganesh Chaturthi ${year} Expenses`;
  try {
    const res = await fetch(`/api/expenses/getExpenses/${year}`,{
        credentials:'include'
    }); // your API URL
    const expenses = await res.json();

  if (expenses.length === 0) {
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align:center; font-weight:500; padding:10px;">
        No expenses found
      </td>
    </tr>`;
  return;
}


    expenses.forEach((exp, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${exp.date}</td>
        <td>${exp.purpose}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.paidBy}</td>
        <td>${
          exp.bill
            ? `<a href="${exp.bill}" target="_blank">View Bill</a>`
            : "No Bill"
        }</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; font-weight:500; padding:10px;">Error loading data</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", loadExpenses);
