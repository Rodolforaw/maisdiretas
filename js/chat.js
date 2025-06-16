// Chat functionality

let chatWidget = null
let chatMessages = []
let chatOpen = false
let unreadCount = 0

// Declare variables before using them
const getCurrentUser = () => {
  // Mock implementation for demonstration purposes
  return { username: "admin", role: "admin" }
}

const somarDB = {
  query: async (collection, field, value) => {
    // Mock implementation for demonstration purposes
    return [
      { id: 1, from: "user1", to: "admin", message: "Hello", timestamp: "2023-10-01T12:00:00Z", read: false },
      { id: 2, from: "user2", to: "admin", message: "Hi", timestamp: "2023-10-01T12:05:00Z", read: true },
    ]
  },
}

const formatDateTime = (timestamp) => {
  // Mock implementation for demonstration purposes
  return new Date(timestamp).toLocaleString()
}

const markMessageAsRead = async (messageId) => {
  // Mock implementation for demonstration purposes
  console.log(`Marking message ${messageId} as read`)
}

const showToast = (title, message, type) => {
  // Mock implementation for demonstration purposes
  console.log(`${type}: ${title} - ${message}`)
}

// Initialize chat
function initChat() {
  chatWidget = document.getElementById("chatWidget")
  loadChatMessages()
  setupChatPolling()

  // Check if user can send messages (admin only)
  const currentUser = getCurrentUser()
  if (currentUser && (currentUser.role === "admin" || currentUser.role === "master")) {
    document.getElementById("chatInput").style.display = "flex"
  }
}

// Toggle chat widget
function toggleChat() {
  chatOpen = !chatOpen
  chatWidget.classList.toggle("collapsed", !chatOpen)

  if (chatOpen) {
    loadChatMessages()
    markMessagesAsRead()
  }
}

// Load chat messages
async function loadChatMessages() {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) return

    // Get messages for current user
    const messages = await somarDB.query("messages", "to", currentUser.username)

    // Sort by timestamp
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    chatMessages = messages
    renderChatMessages()
    updateChatBadge()
  } catch (error) {
    console.error("Error loading chat messages:", error)
  }
}

// Render chat messages
function renderChatMessages() {
  const container = document.getElementById("chatMessages")
  if (!container) return

  if (chatMessages.length === 0) {
    container.innerHTML = `
      <div class="chat-empty">
        <i class="fas fa-comments"></i>
        <p>Nenhuma mensagem</p>
      </div>
    `
    return
  }

  container.innerHTML = chatMessages
    .map(
      (msg) => `
    <div class="chat-message received">
      <div class="message-header">
        <span class="message-sender">De: ${msg.from}</span>
        <span class="message-time">${formatDateTime(msg.timestamp)}</span>
      </div>
      <div class="message-bubble">
        ${msg.message}
      </div>
      <div class="message-status ${msg.read ? "read" : ""}">
        <i class="fas fa-${msg.read ? "check-double" : "check"}"></i>
        ${msg.read ? "Lida" : "Não lida"}
      </div>
    </div>
  `,
    )
    .join("")

  // Scroll to bottom
  container.scrollTop = container.scrollHeight
}

// Update chat badge
function updateChatBadge() {
  const badge = document.getElementById("chatBadge")
  if (!badge) return

  unreadCount = chatMessages.filter((msg) => !msg.read).length
  badge.textContent = unreadCount
  badge.style.display = unreadCount > 0 ? "block" : "none"
}

// Mark messages as read
async function markMessagesAsRead() {
  try {
    const unreadMessages = chatMessages.filter((msg) => !msg.read)

    for (const msg of unreadMessages) {
      await markMessageAsRead(msg.id)
      msg.read = true
    }

    renderChatMessages()
    updateChatBadge()
  } catch (error) {
    console.error("Error marking messages as read:", error)
  }
}

// Send message (admin only)
async function sendMessage() {
  const input = document.getElementById("messageInput")
  const message = input.value.trim()

  if (!message) return

  try {
    // For now, this would need a target user selection
    // In a real implementation, you'd have a user selector
    showToast("Info", "Funcionalidade de envio será implementada com seletor de usuário", "info")
    input.value = ""
  } catch (error) {
    console.error("Error sending message:", error)
    showToast("Erro", "Falha ao enviar mensagem", "error")
  }
}

// Setup chat polling for new messages
function setupChatPolling() {
  // Poll for new messages every 30 seconds
  setInterval(async () => {
    if (getCurrentUser()) {
      await loadChatMessages()
    }
  }, 30000)
}

// Handle Enter key in message input
document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById("messageInput")
  if (messageInput) {
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    })
  }
})
