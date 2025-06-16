// Main application initialization and coordination

// Application state
const appState = {
  currentUser: null,
  currentPage: "dashboard",
  isLoading: false,
  notifications: [],
}

// Declare variables
let somarDB,
  initAuth,
  initChat,
  showToast,
  showLoading,
  authenticateUser,
  updateUIForUser,
  showDashboard,
  hideLoading,
  getCurrentUser,
  loadDashboard,
  loadObras,
  loadMaterials,
  loadOrdens,
  loadUsuarios,
  loadEquipamentos,
  updateCadastroCount,
  hasPermission

// Initialize application
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialize database
    await somarDB.init()

    // Initialize authentication
    initAuth()

    // Initialize chat
    initChat()

    // Setup login form
    setupLoginForm()

    // Setup navigation
    setupNavigation()

    // Setup responsive behavior
    setupResponsive()

    console.log("Application initialized successfully")
  } catch (error) {
    console.error("Application initialization failed:", error)
    showToast("Erro", "Falha ao inicializar aplicação", "error")
  }
})

// Setup login form
function setupLoginForm() {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const username = formData.get("username")
  const password = formData.get("password")

  if (!username || !password) {
    showToast("Erro", "Preencha usuário e senha", "error")
    return
  }

  try {
    showLoading()

    const user = await authenticateUser(username, password)

    if (user) {
      appState.currentUser = user
      localStorage.setItem("currentUser", JSON.stringify(user))
      updateUIForUser()
      showDashboard()
      showToast("Sucesso", `Bem-vindo, ${user.name}!`, "success")

      // Initialize chat for logged in user
      initChat()
    } else {
      showToast("Erro", "Usuário ou senha inválidos", "error")
    }

    hideLoading()
  } catch (error) {
    hideLoading()
    console.error("Login error:", error)
    showToast("Erro", "Falha no login", "error")
  }
}

// Setup navigation
function setupNavigation() {
  // Handle page navigation
  document.addEventListener("click", (e) => {
    const navLink = e.target.closest(".nav-link")
    if (navLink && navLink.onclick) {
      // Navigation handled by onclick
      return
    }
  })

  // Handle browser back/forward
  window.addEventListener("popstate", (e) => {
    if (e.state && e.state.page) {
      showPage(e.state.page)
    }
  })
}

// Setup responsive behavior
function setupResponsive() {
  // Handle mobile sidebar
  if (window.innerWidth <= 1024) {
    const sidebar = document.getElementById("sidebar")
    if (sidebar) {
      sidebar.classList.add("collapsed")
    }
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1024) {
      const sidebar = document.getElementById("sidebar")
      if (sidebar && !sidebar.classList.contains("collapsed")) {
        sidebar.classList.add("collapsed")
      }
    }
  })
}

// Enhanced showPage function with loading and error handling
async function showPage(pageName) {
  try {
    // Check permissions
    if (!hasPagePermission(pageName)) {
      showToast("Erro", "Você não tem permissão para acessar esta página", "error")
      return
    }

    showLoading()

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
    updatePageTitle(pageName)

    // Load page specific content
    await loadPageContent(pageName)

    // Update browser history
    history.pushState({ page: pageName }, "", `#${pageName}`)

    appState.currentPage = pageName

    hideLoading()
  } catch (error) {
    hideLoading()
    console.error(`Error loading page ${pageName}:`, error)
    showToast("Erro", "Falha ao carregar página", "error")
  }
}

// Check page permissions
function hasPagePermission(pageName) {
  const currentUser = getCurrentUser()
  if (!currentUser) return false

  const pagePermissions = {
    dashboard: ["read"],
    obras: ["read"],
    materiais: ["read"],
    funcionarios: ["manage"],
    maquinario: ["manage"],
    relatorios: ["reports"],
    ordens: ["write"],
    cadastros: ["manage"],
    usuarios: ["users"],
    equipamentos: ["manage"],
    fornecedores: ["manage"],
    diario: ["write"],
    mapa: ["read"],
    vistoria: ["manage"],
    ponto: ["write"],
    fotos: ["write"],
    cronograma: ["write"],
    solicitacoes: ["write"],
    configuracoes: ["manage"],
  }

  const requiredPermissions = pagePermissions[pageName] || ["read"]
  return requiredPermissions.some((perm) => currentUser.permissions.includes(perm))
}

// Update page title
function updatePageTitle(pageName) {
  const titles = {
    dashboard: "Dashboard",
    obras: "Gestão de Obras",
    materiais: "Controle de Materiais",
    funcionarios: "Gestão de Funcionários",
    maquinario: "Controle de Maquinário",
    relatorios: "Relatórios e Analytics",
    ordens: "Ordens de Serviço",
    cadastros: "Cadastros do Sistema",
    usuarios: "Gestão de Usuários",
    equipamentos: "Cadastro de Equipamentos",
    fornecedores: "Cadastro de Fornecedores",
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
    ordens: "Gestão de ordens de serviço",
    cadastros: "Cadastros básicos do sistema",
    usuarios: "Administração de usuários e permissões",
    equipamentos: "Controle de ferramentas e equipamentos",
    fornecedores: "Gestão de fornecedores e parceiros",
    diario: "Registre as atividades diárias da obra",
    mapa: "Visualização geográfica de todas as obras",
    vistoria: "Área de mapeamento e controle de produção",
    ponto: "Registro de entrada e saída dos funcionários",
    fotos: "Documentação fotográfica das obras",
    cronograma: "Planejamento e acompanhamento de prazos",
    solicitacoes: "Gerencie solicitações de abertura, execução e paralisação",
    configuracoes: "Configurações",
  }

  const titleElement = document.getElementById("pageTitle")
  const subtitleElement = document.getElementById("pageSubtitle")

  if (titleElement) titleElement.textContent = titles[pageName] || "Página"
  if (subtitleElement) subtitleElement.textContent = subtitles[pageName] || ""
}

// Load page specific content
async function loadPageContent(pageName) {
  switch (pageName) {
    case "dashboard":
      await loadDashboard()
      break
    case "obras":
      await loadObras()
      break
    case "materiais":
      await loadMaterials()
      break
    case "ordens":
      await loadOrdens()
      break
    case "usuarios":
      await loadUsuarios()
      break
    case "equipamentos":
      await loadEquipamentos()
      break
    case "fornecedores":
      await loadFornecedores()
      break
    default:
      // For pages not yet implemented
      console.log(`Loading ${pageName} page...`)
      break
  }
}

// Load fornecedores (placeholder)
async function loadFornecedores() {
  // Implementation would be similar to equipamentos
  updateCadastroCount("fornecedores")
}

// Enhanced error handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error)
  showToast("Erro", "Ocorreu um erro inesperado", "error")
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
  showToast("Erro", "Falha na operação", "error")
})

// Periodic data sync (every 5 minutes)
setInterval(
  async () => {
    if (getCurrentUser()) {
      try {
        // Refresh current page data
        await loadPageContent(appState.currentPage)
      } catch (error) {
        console.error("Periodic sync error:", error)
      }
    }
  },
  5 * 60 * 1000,
)

// Export global functions
window.showPage = showPage
window.getCurrentUser = getCurrentUser
window.hasPermission = hasPermission
