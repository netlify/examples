// API Base URL (works both locally and in production)
const API_BASE = window.location.origin;

// DOM Elements
const elements = {
  // Tabs
  tabButtons: document.querySelectorAll('.tab-button'),
  tabPanes: document.querySelectorAll('.tab-pane'),

  // Seed tab
  seedBtn: document.getElementById('seed-btn'),
  seedStatus: document.getElementById('seed-status'),

  // Query tab
  queryInput: document.getElementById('query-input'),
  queryBtn: document.getElementById('query-btn'),
  queryStatus: document.getElementById('query-status'),
  exampleButtons: document.querySelectorAll('.example-btn'),
  resultsContainer: document.getElementById('results-container'),
  aiReasoning: document.getElementById('ai-reasoning'),
  sqlQuery: document.getElementById('sql-query'),
  resultsDisplay: document.getElementById('results-display'),
};

// Tab switching
elements.tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabName = button.dataset.tab;
    switchTab(tabName);
  });
});

function switchTab(tabName) {
  // Update tab buttons
  elements.tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab panes
  elements.tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `${tabName}-tab`);
  });

  // Clear status messages when switching tabs
  hideStatus(elements.seedStatus);
  hideStatus(elements.queryStatus);
}

// Seed database
elements.seedBtn.addEventListener('click', async () => {
  try {
    setLoading(elements.seedBtn, true);
    hideStatus(elements.seedStatus);

    const response = await fetch(`${API_BASE}/api/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (data.alreadySeeded) {
        showStatus(
          elements.seedStatus,
          `Database already seeded! Existing tables: ${data.tablesExist.join(', ')}`,
          'success'
        );
      } else {
        showStatus(
          elements.seedStatus,
          `Database seeded successfully! Created ${data.stats.customers} customers, ${data.stats.products} products, ${data.stats.orders} orders, and ${data.stats.orderItems} order items.`,
          'success'
        );
      }
    } else {
      showStatus(elements.seedStatus, `Error: ${data.error}. ${data.details || ''}`, 'error');
    }
  } catch (error) {
    showStatus(elements.seedStatus, `Failed to seed database: ${error.message}`, 'error');
  } finally {
    setLoading(elements.seedBtn, false);
  }
});

// Query database
elements.queryBtn.addEventListener('click', async () => {
  await executeQuery(elements.queryInput.value.trim());
});

// Example query buttons
elements.exampleButtons.forEach(button => {
  button.addEventListener('click', () => {
    const query = button.dataset.query;
    elements.queryInput.value = query;
    executeQuery(query);
  });
});

// Allow Enter key to submit (Ctrl/Cmd + Enter for multi-line)
elements.queryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
    e.preventDefault();
    elements.queryBtn.click();
  }
});

async function executeQuery(query) {
  if (!query) {
    showStatus(elements.queryStatus, 'Please enter a question', 'error');
    return;
  }

  try {
    setLoading(elements.queryBtn, true);
    hideStatus(elements.queryStatus);
    elements.resultsContainer.style.display = 'none';

    const response = await fetch(`${API_BASE}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ textQuery: query }),
    });

    const data = await response.json();

    if (response.ok) {
      // Display AI reasoning
      elements.aiReasoning.textContent = data.aiReasoning || 'No reasoning provided';

      // Display SQL query
      elements.sqlQuery.textContent = data.queryExecuted || 'No SQL query available';

      // Display results
      displayResults(data.results);

      // Show results container
      elements.resultsContainer.style.display = 'block';

      // Scroll to results
      elements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      showStatus(elements.queryStatus, `Error: ${data.error}. ${data.details || ''}`, 'error');
    }
  } catch (error) {
    showStatus(elements.queryStatus, `Failed to execute query: ${error.message}`, 'error');
  } finally {
    setLoading(elements.queryBtn, false);
  }
}

function displayResults(results) {
  // Clear previous results
  elements.resultsDisplay.innerHTML = '';

  if (!results || (Array.isArray(results) && results.length === 0)) {
    elements.resultsDisplay.innerHTML = '<p style="color: #64748b; padding: 15px;">No results found</p>';
    return;
  }

  // If results is an array, display as table
  if (Array.isArray(results)) {
    const table = createTable(results);
    elements.resultsDisplay.appendChild(table);
  } else {
    // Display as formatted JSON
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(results, null, 2);
    elements.resultsDisplay.appendChild(pre);
  }
}

function createTable(data) {
  const table = document.createElement('table');

  if (data.length === 0) {
    return table;
  }

  // Create header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const keys = Object.keys(data[0]);

  keys.forEach(key => {
    const th = document.createElement('th');
    th.textContent = key;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement('tbody');

  data.forEach(row => {
    const tr = document.createElement('tr');
    keys.forEach(key => {
      const td = document.createElement('td');
      const value = row[key];

      // Format numbers nicely
      if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          td.textContent = value.toLocaleString();
        } else {
          td.textContent = value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }
      } else {
        td.textContent = value !== null && value !== undefined ? value : '';
      }

      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  return table;
}

// Helper functions
function setLoading(button, loading) {
  const btnText = button.querySelector('.btn-text');
  const spinner = button.querySelector('.loading-spinner');

  if (loading) {
    button.disabled = true;
    btnText.textContent = 'Loading...';
    spinner.style.display = 'inline-block';
  } else {
    button.disabled = false;
    spinner.style.display = 'none';

    // Reset button text based on which button it is
    if (button === elements.seedBtn) {
      btnText.textContent = 'Seed Database';
    } else if (button === elements.queryBtn) {
      btnText.textContent = 'Ask Question';
    }
  }
}

function showStatus(element, message, type) {
  element.textContent = message;
  element.className = `status-message ${type}`;
  element.style.display = 'block';
}

function hideStatus(element) {
  element.style.display = 'none';
}
