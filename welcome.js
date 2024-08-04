document.addEventListener('DOMContentLoaded', function() {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    let budgets = JSON.parse(localStorage.getItem('budgets')) || {};

    const expenseForm = document.getElementById('expense-input');
    const expenseDateInput = document.getElementById('expenseDate');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseTableBody = document.querySelector('#expenseTable tbody');
    const showSummaryBtn = document.querySelector('.show-summary');

    // Initialize the table with stored expenses
    updateTable();

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addExpense();
    });

    showSummaryBtn.addEventListener('click', function() {
        // Open summary.html in a new tab or window when Summary button is clicked
        window.open('summary.html', '_blank');
    });

    function addExpense() {
        const date = expenseDateInput.value;
        const name = expenseNameInput.value;
        const amount = parseFloat(expenseAmountInput.value);

        if (date && name && !isNaN(amount)) {
            const expense = { date, name, amount };
            expenses.push(expense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateTable();
            checkBudgetAlert(name, amount); // Check if budget exceeds after adding expense
            clearInputs();
        } else {
            alert('Please fill in all fields.');
        }
    }

    function updateTable() {
        expenseTableBody.innerHTML = '';
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.name}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>
                    <button class="btn edit-expense" data-index="${index}">Edit</button>
                    <button class="btn delete-expense" data-index="${index}">Delete</button>
                </td>
            `;
            expenseTableBody.appendChild(row);
        });
        updateTotal(); // Ensure this is called after updating the table
        attachEventListeners();
    }

    function updateTotal() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const totalExpenditureElement = document.getElementById('totalExpenditure');
        if (totalExpenditureElement) {
            totalExpenditureElement.textContent = `Total Expenditure: ${total.toFixed(2)}`;
        } else {
            console.error('Element with id "totalExpenditure" not found.');
        }
    }

    function clearInputs() {
        expenseDateInput.value = '';
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
    }

    function checkBudgetAlert(name, amount) {
        if (budgets[name] && amount > budgets[name]) {
            const warningSound = new Audio('C:/Users/Anjan/Downloads/warning-sound-6686.mp3'); // Replace with actual path to your audio file
            const warningMessage = `Warning: You have exceeded the budget for ${name}!`;
            const warningSymbol = '🚨'; // Red bulb emoji

            if (warningSound) {
                warningSound.play().then(() => {
                    alert(`${warningSymbol} ${warningMessage}`);
                }).catch(error => {
                    console.error('Failed to play warning sound:', error);
                    alert(`${warningSymbol} ${warningMessage}`); // Fallback if audio playback fails
                });
            } else {
                console.error('Failed to load warning sound.');
                alert(`${warningSymbol} ${warningMessage}`);
            }
        }
    }

    function attachEventListeners() {
        document.querySelectorAll('.edit-expense').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                editExpense(index);
            });
        });

        document.querySelectorAll('.delete-expense').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteExpense(index);
            });
        });

        const showPieChartBtn = document.querySelector('.show-pie-chart');
        const showBarChartBtn = document.querySelector('.show-bar-chart');
        const setBudgetBtn = document.querySelector('.set-budget');
        const saveBudgetBtn = document.querySelector('.save-budget');

        if (showPieChartBtn) showPieChartBtn.addEventListener('click', showPieChart);
        if (showBarChartBtn) showBarChartBtn.addEventListener('click', showBarChart);
        if (setBudgetBtn) setBudgetBtn.addEventListener('click', setBudget);
        if (saveBudgetBtn) saveBudgetBtn.addEventListener('click', saveBudget);
    }

    function editExpense(index) {
        const expense = expenses[index];
        expenseDateInput.value = expense.date;
        expenseNameInput.value = expense.name;
        expenseAmountInput.value = expense.amount;
        deleteExpense(index);
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateTable();
    }

    function showPieChart() {
        console.log('Show Pie Chart clicked');
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (window.myBarChart) {
            window.myBarChart.destroy();
        }
        if (window.myPieChart) {
            window.myPieChart.destroy();
        }
        window.myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: expenses.map(expense => expense.name),
                datasets: [{
                    label: 'Expenses',
                    data: expenses.map(expense => expense.amount),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                }]
            }
        });
    }

    function showBarChart() {
        console.log('Show Bar Chart clicked');
        const ctx = document.getElementById('chartCanvas').getContext('2d');
        if (window.myPieChart) {
            window.myPieChart.destroy();
        }
        if (window.myBarChart) {
            window.myBarChart.destroy();
        }
        window.myBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: expenses.map(expense => expense.name),
                datasets: [{
                    label: 'Expenses',
                    data: expenses.map(expense => expense.amount),
                    backgroundColor: '#36A2EB',
                }]
            }
        });
    }

    function setBudget() {
        console.log('Set Budget clicked');
        const category = prompt('Enter category:');
        const amount = parseFloat(prompt('Enter budget amount:'));

        if (category && !isNaN(amount)) {
            budgets[category] = amount;
            localStorage.setItem('budgets', JSON.stringify(budgets)); // Save budgets to localStorage
            alert(`Budget set for ${category}: ${amount}`);
        } else {
            alert('Invalid input. Please try again.');
        }
    }

    function saveBudget() {
        console.log('Save Budget clicked');
        const category = document.getElementById('budgetCategory').value;
        const amount = parseFloat(document.getElementById('budgetAmount').value);

        if (category && !isNaN(amount)) {
            budgets[category] = amount;
            localStorage.setItem('budgets', JSON.stringify(budgets)); // Save budgets to localStorage
            alert(`Budget saved for ${category}: ${amount}`);
        } else {
            alert('Invalid input. Please try again.');
        }
    }

    attachEventListeners();
});
