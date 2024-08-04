document.addEventListener("DOMContentLoaded", function() {
    const expenseForm = document.getElementById("expense-input");
    const expenseDateInput = document.getElementById("expenseDate");
    const expenseNameInput = document.getElementById("expenseName");
    const expenseAmountInput = document.getElementById("expenseAmount");
    const expenseTableBody = document.querySelector("#expenseTable tbody");

    // Fetch and display expenses on page load
    fetchExpenses();

    expenseForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addExpense();
    });

    async function fetchExpenses() {
        try {
            const response = await fetch("/expenses");
            const expenses = await response.json();
            displayExpenses(expenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    }

    function displayExpenses(expenses) {
        expenseTableBody.innerHTML = ""; // Clear current expenses
        expenses.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.name}</td>
                <td>${expense.amount}</td>
                <td><button class="delete-btn" data-id="${expense.id}">Delete</button></td>
            `;
            expenseTableBody.appendChild(row);
        });

        // Add delete functionality
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", function() {
                const expenseId = this.getAttribute("data-id");
                deleteExpense(expenseId);
            });
        });
    }

    async function addExpense() {
        const date = expenseDateInput.value;
        const name = expenseNameInput.value;
        const amount = parseFloat(expenseAmountInput.value);

        if (!date || !name || isNaN(amount)) {
            alert("Please enter valid expense details.");
            return;
        }

        const expense = { date, name, amount };

        try {
            const response = await fetch("/expenses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(expense)
            });

            const newExpense = await response.json();
            expenseTableBody.insertAdjacentHTML('beforeend', `
                <tr>
                    <td>${newExpense.date}</td>
                    <td>${newExpense.name}</td>
                    <td>${newExpense.amount}</td>
                    <td><button class="delete-btn" data-id="${newExpense.id}">Delete</button></td>
                </tr>
            `);

            // Add delete functionality for the new row
            const deleteButton = expenseTableBody.querySelector(`.delete-btn[data-id="${newExpense.id}"]`);
            deleteButton.addEventListener("click", function() {
                const expenseId = this.getAttribute("data-id");
                deleteExpense(expenseId);
            });

            // Clear inputs
            expenseDateInput.value = "";
            expenseNameInput.value = "";
            expenseAmountInput.value = "";

        } catch (error) {
            console.error("Error adding expense:", error);
        }
    }

    async function deleteExpense(expenseId) {
        try {
            await fetch(`/expenses/${expenseId}`, {
                method: "DELETE"
            });

            fetchExpenses(); // Refresh the list of expenses

        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    }
});
