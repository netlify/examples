const API_BASE = window.location.origin;

let selectedFile = null;

const elements = {
  tabs: document.querySelectorAll('.tab'),
  tabContents: document.querySelectorAll('.tab-content'),
  dropZone: document.getElementById('drop-zone'),
  fileInput: document.getElementById('file-input'),
  fileInfo: document.getElementById('file-info'),
  fileName: document.getElementById('file-name'),
  fileSize: document.getElementById('file-size'),
  uploadButton: document.getElementById('upload-button'),
  uploadStatus: document.getElementById('upload-status'),
  searchForm: document.getElementById('search-form'),
  searchInput: document.getElementById('search-input'),
  searchResults: document.getElementById('search-results'),
  errorMessage: document.getElementById('error-message'),
};

// Tab switching
elements.tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;

    elements.tabs.forEach(t => t.classList.remove('active'));
    elements.tabContents.forEach(tc => tc.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// File upload handlers
elements.dropZone.addEventListener('click', () => {
  elements.fileInput.click();
});

elements.dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  elements.dropZone.classList.add('drag-over');
});

elements.dropZone.addEventListener('dragleave', () => {
  elements.dropZone.classList.remove('drag-over');
});

elements.dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  elements.dropZone.classList.remove('drag-over');

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileSelect(files[0]);
  }
});

elements.fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFileSelect(e.target.files[0]);
  }
});

function handleFileSelect(file) {
  const allowedExtensions = ['.pdf', '.txt', '.json', '.md'];
  const fileExt = '.' + file.name.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(fileExt)) {
    showError('Unsupported file type. Only PDF, TXT, JSON, and MD files are allowed.');
    return;
  }

  selectedFile = file;
  elements.fileName.textContent = file.name;
  elements.fileSize.textContent = formatFileSize(file.size);
  elements.fileInfo.classList.remove('hidden');
  elements.uploadStatus.classList.add('hidden');
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

elements.uploadButton.addEventListener('click', async () => {
  if (!selectedFile) return;

  elements.uploadButton.disabled = true;
  elements.uploadButton.textContent = 'Uploading...';

  try {
    // Read file as base64
    const fileContent = await readFileAsBase64(selectedFile);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: selectedFile.name,
        fileContent: fileContent,
        contentType: selectedFile.type,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    const data = await response.json();

    showStatus('File uploaded successfully! It will be indexed in 1-2 minutes, then you can search for its contents.', 'success');

    // Reset file input
    selectedFile = null;
    elements.fileInput.value = '';
    elements.fileInfo.classList.add('hidden');
  } catch (error) {
    console.error('Upload error:', error);
    showError(error.message || 'Failed to upload file');
  } finally {
    elements.uploadButton.disabled = false;
    elements.uploadButton.textContent = 'Upload';
  }
});

// Search handlers
elements.searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const query = elements.searchInput.value.trim();
  if (!query) return;

  elements.searchResults.innerHTML = '<div class="loading-spinner">Searching...</div>';

  try {
    const response = await fetch(`${API_BASE}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Search failed');
    }

    const data = await response.json();
    displayResults(data.results);
  } catch (error) {
    console.error('Search error:', error);
    elements.searchResults.innerHTML = '';
    showError(error.message || 'Failed to search documents');
  }
});

function displayResults(results) {
  if (results.length === 0) {
    elements.searchResults.innerHTML = '<div class="no-results">No results found. Try uploading some documents first!</div>';
    return;
  }

  elements.searchResults.innerHTML = results.map(result => `
    <div class="result-card">
      <div class="result-header">
        <span class="result-file">${escapeHtml(result.fileName)}</span>
        <div class="result-score">
          <div class="score-circle" style="--score: ${result.score}%">
            <span>${result.score}%</span>
          </div>
        </div>
      </div>
      <div class="result-text">${escapeHtml(result.text)}</div>
    </div>
  `).join('');
}

function showStatus(message, type) {
  elements.uploadStatus.textContent = message;
  elements.uploadStatus.className = `status-message ${type}`;
  elements.uploadStatus.classList.remove('hidden');

  setTimeout(() => {
    elements.uploadStatus.classList.add('hidden');
  }, 5000);
}

function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.remove('hidden');

  setTimeout(() => {
    elements.errorMessage.classList.add('hidden');
  }, 5000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
