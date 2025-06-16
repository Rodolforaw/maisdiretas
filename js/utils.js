// Utility functions

// Format currency
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Format number
function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(value)
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR")
}

// Format datetime
function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("pt-BR")
}

// Get greeting based on time
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Show loading spinner
function showLoading() {
  document.getElementById("loadingSpinner").classList.add("active")
}

// Hide loading spinner
function hideLoading() {
  document.getElementById("loadingSpinner").classList.remove("active")
}

// Show toast notification
function showToast(title, message, type = "info") {
  const container = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`

  const iconMap = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  }

  toast.innerHTML = `
        <i class="toast-icon ${iconMap[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `

  container.appendChild(toast)

  // Show toast
  setTimeout(() => toast.classList.add("show"), 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => container.removeChild(toast), 300)
  }, 5000)
}

// Close toast
function closeToast(button) {
  const toast = button.closest(".toast")
  toast.classList.remove("show")
  setTimeout(() => toast.remove(), 300)
}

// Show modal
function showModal(title, content) {
  const modal = document.getElementById("modal")
  const overlay = document.getElementById("modalOverlay")
  const modalTitle = document.getElementById("modalTitle")
  const modalContent = document.getElementById("modalContent")

  modalTitle.textContent = title
  modalContent.innerHTML = content
  overlay.classList.add("active")

  // Prevent body scroll
  document.body.style.overflow = "hidden"
}

// Close modal
function closeModal() {
  const overlay = document.getElementById("modalOverlay")
  overlay.classList.remove("active")

  // Restore body scroll
  document.body.style.overflow = ""
}

// Toggle password visibility
function togglePassword() {
  const passwordInput = document.getElementById("password")
  const passwordIcon = document.getElementById("passwordIcon")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    passwordIcon.className = "fas fa-eye-slash"
  } else {
    passwordInput.type = "password"
    passwordIcon.className = "fas fa-eye"
  }
}

// Toggle sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  sidebar.classList.toggle("collapsed")
}

// Toggle user menu
function toggleUserMenu() {
  const userMenu = document.getElementById("userMenu")
  userMenu.classList.toggle("active")
}

// Toggle notifications
function toggleNotifications() {
  // Implementation for notifications dropdown
  showToast("Notificações", "Você tem 3 notificações pendentes", "info")
}

// Show page
function showPage(pageName) {
  // Hide all content sections
  const sections = document.querySelectorAll(".content-section")
  sections.forEach((section) => section.classList.remove("active"))

  // Show selected section
  const targetSection = document.getElementById(pageName + "Content")
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Update navigation
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => link.classList.remove("active"))

  const activeLink = document.querySelector(`[onclick="showPage('${pageName}')"]`)
  if (activeLink) {
    activeLink.classList.add("active")
  }

  // Update page title
  const titles = {
    dashboard: "Dashboard",
    obras: "Gestão de Obras",
    materiais: "Controle de Materiais",
    funcionarios: "Gestão de Funcionários",
    maquinario: "Controle de Maquinário",
    relatorios: "Relatórios e Analytics",
    diario: "Diário de Obras",
    mapa: "Mapa de Obras",
    vistoria: "Vistoria e Produção",
    ponto: "Controle de Ponto",
    fotos: "Registro Fotográfico",
    cronograma: "Cronograma",
    solicitacoes: "Solicitações",
    configuracoes: "Configurações",
  }

  const subtitles = {
    dashboard: "Bem-vindo ao sistema +Diretas da SOMAR",
    obras: "Controle e acompanhamento de todas as obras",
    materiais: "Gestão de estoque e solicitações",
    funcionarios: "Controle de equipe e recursos humanos",
    maquinario: "Gestão de equipamentos e veículos",
    relatorios: "Análises e relatórios detalhados das obras",
    diario: "Registre as atividades diárias da obra",
    mapa: "Visualização geográfica de todas as obras",
    vistoria: "Área de mapeamento e controle de produção",
    ponto: "Registro de entrada e saída dos funcionários",
    fotos: "Documentação fotográfica das obras",
    cronograma: "Planejamento e acompanhamento de prazos",
    solicitacoes: "Gerencie solicitações de abertura, execução e paralisação",
    configuracoes: "Configurações do sistema",
  }

  document.getElementById("pageTitle").textContent = titles[pageName] || "Página"
  document.getElementById("pageSubtitle").textContent = subtitles[pageName] || ""

  // Load page specific content
  switch (pageName) {
    case "dashboard":
      // loadDashboard();
      break
    case "obras":
      // loadObras();
      break
    case "materiais":
      // loadMaterials();
      break
    default:
      break
  }
}

// Validate form
function validateForm(formData, rules) {
  const errors = []

  for (const field in rules) {
    const rule = rules[field]
    const value = formData[field]

    if (rule.required && (!value || value.trim() === "")) {
      errors.push(`${rule.label} é obrigatório`)
    }

    if (rule.email && value && !isValidEmail(value)) {
      errors.push(`${rule.label} deve ser um email válido`)
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors.push(`${rule.label} deve ter pelo menos ${rule.minLength} caracteres`)
    }
  }

  return errors
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Filter array by search term
function filterBySearch(array, searchTerm, fields) {
  if (!searchTerm) return array

  const term = searchTerm.toLowerCase()
  return array.filter((item) => {
    return fields.some((field) => {
      const value = item[field]
      return value && value.toString().toLowerCase().includes(term)
    })
  })
}

// Sort array by field
function sortBy(array, field, direction = "asc") {
  return [...array].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]

    if (direction === "asc") {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

// Get status color class
function getStatusColorClass(status) {
  const statusMap = {
    "Em Andamento": "badge-progress",
    Concluída: "badge-completed",
    Atrasada: "badge-delayed",
    Planejada: "badge-planned",
    Disponível: "badge-available",
    "Estoque Baixo": "badge-low",
    Crítico: "badge-critical",
    Pendente: "badge-pending",
    Aprovada: "badge-approved",
    Rejeitada: "badge-rejected",
  }

  return statusMap[status] || "badge-default"
}

// Get priority color class
function getPriorityColorClass(priority) {
  const priorityMap = {
    Alta: "badge-priority-high",
    Média: "badge-priority-medium",
    Baixa: "badge-priority-low",
  }

  return priorityMap[priority] || "badge-default"
}

// Calculate progress percentage
function calculateProgress(current, total) {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Export to CSV
function exportToCSV(data, filename) {
  const csvContent = convertToCSV(data)
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Convert array to CSV
function convertToCSV(array) {
  if (!array.length) return ""

  const headers = Object.keys(array[0])
  const csvHeaders = headers.join(",")

  const csvRows = array.map((row) => {
    return headers
      .map((header) => {
        const value = row[header]
        return typeof value === "string" ? `"${value}"` : value
      })
      .join(",")
  })

  return [csvHeaders, ...csvRows].join("\n")
}

// Print page
function printPage() {
  window.print()
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      showToast("Sucesso", "Texto copiado para a área de transferência", "success")
    })
    .catch(() => {
      showToast("Erro", "Falha ao copiar texto", "error")
    })
}

// Get current location
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  })
}

// Check if mobile device
function isMobile() {
  return window.innerWidth <= 768
}

// Animate element
function animateElement(element, animation) {
  element.classList.add(animation)
  element.addEventListener(
    "animationend",
    () => {
      element.classList.remove(animation)
    },
    { once: true },
  )
}

// Smooth scroll to element
function scrollToElement(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Placeholder functions for undeclared variables
function loadDashboard() {
  // Implementation for loading dashboard
}

function loadObras() {
  // Implementation for loading obras
}

function loadMaterials() {
  // Implementation for loading materials
}
