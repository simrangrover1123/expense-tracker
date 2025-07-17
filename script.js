// Elements
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAll');
const expenseList = document.getElementById('expenseList');
const chartCanvas = document.getElementById('expenseChart');
const themeToggle = document.getElementById('themeToggle');

// Data
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editIndex = null; // for edit mode
let chartInstance;

// Render
function render() {
  expenseList.innerHTML = '';
  expenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${exp.title} - ₹${exp.amount} (${exp.category}) on ${exp.date}</span>
      <div>
        <button onclick="editExpense(${index})">✏️</button>
        <button onclick="deleteExpense(${index})">❌</button>
      </div>
    `;
    expenseList.appendChild(li);
  });
  renderChart();
}

// Add or update
addBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;
  const date = dateInput.value || new Date().toISOString().split('T')[0];

  if (!title || isNaN(amount) || amount <= 0) {
    alert('Please enter valid title and amount');
    return;
  }

  if (editIndex !== null) {
    // update existing
    expenses[editIndex] = { title, amount, category, date };
    editIndex = null;
    addBtn.textContent = '➕ Add Expense';
  } else {
    expenses.push({ title, amount, category, date });
  }

  localStorage.setItem('expenses', JSON.stringify(expenses));

  titleInput.value = '';
  amountInput.value = '';
  dateInput.value = '';

  render();
});

// Edit expense
function editExpense(index) {
  const exp = expenses[index];
  titleInput.value = exp.title;
  amountInput.value = exp.amount;
  categorySelect.value = exp.category;
  dateInput.value = exp.date;
  editIndex = index;
  addBtn.textContent = '💾 Save Changes';
}
window.editExpense = editExpense;

// Delete
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  render();
}
window.deleteExpense = deleteExpense;

// Clear all
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all expenses?')) {
    expenses = [];
    localStorage.setItem('expenses', JSON.stringify(expenses));
    render();
  }
});

// Chart
function renderChart() {
  const totals = {};
  expenses.forEach(exp => {
    totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(totals);
  const data = Object.values(totals);

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          '#9C27B0'
        ]
      }]
    }
  });
}

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    themeToggle.textContent = '☀️ Light Mode';
  } else {
    themeToggle.textContent = '🌙 Dark Mode';
  }
});

// Initial render
render();
