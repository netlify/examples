const API_BASE = window.location.origin;

let sessionId = null;
let isProcessing = false;

const elements = {
  sessionStatus: document.getElementById('session-status'),
  memoryCount: document.getElementById('memory-count'),
  messages: document.getElementById('messages'),
  chatForm: document.getElementById('chat-form'),
  messageInput: document.getElementById('message-input'),
  sendButton: document.getElementById('send-button'),
  errorMessage: document.getElementById('error-message'),
};

// Initialize session on page load
async function initSession() {
  try {
    const response = await fetch(`${API_BASE}/api/create-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    const data = await response.json();
    sessionId = data.sessionId;

    elements.sessionStatus.textContent = `Session: ${sessionId.substring(0, 8)}...`;
    elements.memoryCount.textContent = 'Memories: 0';
    elements.messageInput.disabled = false;
    elements.sendButton.disabled = false;
    elements.messageInput.focus();

    addMessage('system', 'Session initialized. Start chatting!');
  } catch (error) {
    console.error('Init error:', error);
    showError('Failed to initialize session. Please refresh the page.');
  }
}

// Add message to chat
function addMessage(role, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  messageDiv.textContent = content;
  elements.messages.appendChild(messageDiv);
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

// Show error message
function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.remove('hidden');
  setTimeout(() => {
    elements.errorMessage.classList.add('hidden');
  }, 5000);
}

// Show loading indicator
function showLoading() {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.id = 'loading-indicator';
  loadingDiv.textContent = 'Thinking...';
  elements.messages.appendChild(loadingDiv);
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

// Remove loading indicator
function hideLoading() {
  const loadingDiv = document.getElementById('loading-indicator');
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// Send message
async function sendMessage(message) {
  if (isProcessing || !message.trim()) return;

  isProcessing = true;
  elements.messageInput.disabled = true;
  elements.sendButton.disabled = true;

  addMessage('user', message);
  showLoading();

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    hideLoading();

    addMessage('assistant', data.response);

    if (data.sessionId) {
      sessionId = data.sessionId;
    }

    if (data.memoryCount !== undefined) {
      elements.memoryCount.textContent = `Memories: ${data.memoryCount}`;
    }
  } catch (error) {
    console.error('Chat error:', error);
    hideLoading();
    showError('Failed to send message. Please try again.');
  } finally {
    isProcessing = false;
    elements.messageInput.disabled = false;
    elements.sendButton.disabled = false;
    elements.messageInput.focus();
  }
}

// Handle form submission
elements.chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = elements.messageInput.value.trim();
  if (message) {
    sendMessage(message);
    elements.messageInput.value = '';
  }
});

// Initialize on load
initSession();
