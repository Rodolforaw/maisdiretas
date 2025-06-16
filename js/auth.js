// Authentication functions

const STORAGE_KEYS = {
  USER: "user",
}

let currentUser = null

function showLoading() {
  document.getElementById("loading").style.display = "block"
}

function hideLoading() {
  document.getElementById("loading").style.display = "none"
}

const mockData = {
  users: [
    { id: 1, name: "Admin User", email: "admin@example.com", cargo: "admin", avatar: null, isTestMode: false },
    { id: 2, name: "Gerente User", email: "gerente@example.com", cargo: "gerente", avatar: null, isTestMode: false },
    {
      id: 3,
      name: "Encarregado User",
      email: "encarregado@example.com",
      cargo: "encarregado",
      avatar: null,
      isTestMode: false,
    },
    {
      id: 4,
      name: "Funcionario User",
      email: "funcionario@example.com",
      cargo: "funcionario",
      avatar: null,
      isTestMode: false,
    },
  ],
}

function showToast(title, message, type) {
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
    `
  document.body.appendChild(toast)
  setTimeout(() => {
    document.body.removeChild(toast)
  }, 3000)
}

function showModal(title, content) {
  const modal = document.createElement("div")
  modal.className = "modal"
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">${title}</div>
            <div class="modal-body">${content}</div>
        </div>
    `
  document.body.appendChild(modal)
}

function validateForm(data, rules) {
  const errors = []
  for (const field in rules) {
    const rule = rules[field]
    if (rule.required && !data[field]) {
      errors.push(`${rule.label} é obrigatório`)
    }
    if (rule.email && !/\S+@\S+\.\S+/.test(data[field])) {
      errors.push(`${rule.label} deve ser um e-mail válido`)
    }
    if (rule.minLength && data[field].length < rule.minLength) {
      errors.push(`${rule.label} deve ter pelo menos ${rule.minLength} caracteres`)
    }
  }
  return errors
}

function closeModal() {
  const modal = document.querySelector(".modal")
  if (modal) {
    document.body.removeChild(modal)
  }
}

// Initialize authentication
function initAuth() {
  const savedUser = localStorage.getItem(STORAGE_KEYS.USER)
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    updateUIForUser()
    showDashboard()
  } else {
    showLogin()
  }
}

// Show login page
function showLogin() {
  document.getElementById("loginPage").classList.add("active")
  document.getElementById("dashboardPage").classList.remove("active")
}

// Show dashboard
function showDashboard() {
  document.getElementById("loginPage").classList.remove("active")
  document.getElementById("dashboardPage").classList.add("active")
}

// Login function
function login(email, password, cargo) {
  showLoading()

  // Simulate API call
  setTimeout(() => {
    // Find user (in real app, this would be server-side)
    const user = mockData.users.find((u) => u.email === email && u.cargo === cargo)

    if (user) {
      currentUser = user
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      updateUIForUser()
      showDashboard()
      showToast("Sucesso", `Bem-vindo, ${user.name}!`, "success")
    } else {
      showToast("Erro", "Credenciais inválidas", "error")
    }

    hideLoading()
  }, 1000)
}

// Test mode login
function loginTeste() {
  const testUser = {
    id: 999,
    name: "Usuário Teste",
    email: "teste@somar.com.br",
    cargo: "admin",
    avatar: null,
    isTestMode: true,
  }

  currentUser = testUser
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(testUser))
  updateUIForUser()
  showDashboard()
  showToast("Modo Teste", "Logado como administrador de teste", "info")
}

// Logout function
function logout() {
  currentUser = null
  localStorage.removeItem(STORAGE_KEYS.USER)
  showLogin()
  showToast("Logout", "Você foi desconectado com sucesso", "info")
}

// Update UI based on user role
function updateUIForUser() {
  if (!currentUser) return

  // Update user info in sidebar
  document.getElementById("userName").textContent = currentUser.name
  document.getElementById("userRole").textContent = currentUser.cargo
  document.getElementById("headerUserName").textContent = currentUser.name.split(" ")[0]

  // Update greeting
  document.getElementById("userGreeting").textContent = getGreeting()

  // Show/hide test badge
  const testBadge = document.getElementById("testBadge")
  if (currentUser.isTestMode) {
    testBadge.style.display = "flex"
  } else {
    testBadge.style.display = "none"
  }

  // Update body class for role-based styling
  document.body.className = `role-${currentUser.cargo}`

  // Show/hide menu items based on role
  updateMenuVisibility()
}

// Update menu visibility based on user role
function updateMenuVisibility() {
  const adminItems = document.querySelectorAll(".admin-only")
  const gerenteItems = document.querySelectorAll(".gerente-only")
  const encarregadoItems = document.querySelectorAll(".encarregado-only")

  // Hide all role-specific items first
  adminItems.forEach((item) => (item.style.display = "none"))
  gerenteItems.forEach((item) => (item.style.display = "none"))
  encarregadoItems.forEach((item) => (item.style.display = "none"))

  // Show items based on user role
  switch (currentUser.cargo) {
    case "admin":
      adminItems.forEach((item) => {
        item.style.display = item.tagName === "LI" ? "block" : item.classList.contains("nav-link") ? "flex" : "block"
      })
      encarregadoItems.forEach((item) => {
        item.style.display = item.tagName === "LI" ? "block" : item.classList.contains("nav-link") ? "flex" : "block"
      })
      break

    case "gerente":
      adminItems.forEach((item) => {
        item.style.display = item.tagName === "LI" ? "block" : item.classList.contains("nav-link") ? "flex" : "block"
      })
      gerenteItems.forEach((item) => {
        item.style.display = item.tagName === "LI" ? "block" : item.classList.contains("nav-link") ? "flex" : "block"
      })
      encarregadoItems.forEach((item) => {
        item.style.display = item.tagName === "LI" ? "block" : item.classList.contains("nav-link") ? "flex" : "block"
      })
      break

    case "encarregado":
      encarregadoItems.forEach((item) => {
        item.style.display = item.tagName === "LI" ? "block" : item.classList.contains("nav-link") ? "flex" : "block"
      })
      break
  }
}

// Show cadastro modal
function showCadastro() {
  const content = `
        <form id="cadastroForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                    <label for="cadastroNome">Nome Completo *</label>
                    <input type="text" id="cadastroNome" name="nome" required>
                </div>
                <div class="form-group">
                    <label for="cadastroCpf">CPF *</label>
                    <input type="text" id="cadastroCpf" name="cpf" required>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                    <label for="cadastroEmail">E-mail *</label>
                    <input type="email" id="cadastroEmail" name="email" required>
                </div>
                <div class="form-group">
                    <label for="cadastroTelefone">Telefone</label>
                    <input type="tel" id="cadastroTelefone" name="telefone">
                </div>
            </div>
            <div class="form-group">
                <label for="cadastroCargo">Cargo *</label>
                <select id="cadastroCargo" name="cargo" required>
                    <option value="">Selecione o cargo</option>
                    <option value="admin">Administrador</option>
                    <option value="gerente">Gerente de Obras</option>
                    <option value="encarregado">Encarregado</option>
                    <option value="funcionario">Funcionário</option>
                </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                    <label for="cadastroPassword">Senha *</label>
                    <input type="password" id="cadastroPassword" name="password" required>
                </div>
                <div class="form-group">
                    <label for="cadastroConfirmPassword">Confirmar Senha *</label>
                    <input type="password" id="cadastroConfirmPassword" name="confirmPassword" required>
                </div>
            </div>
            <div class="flex justify-end gap-4 mt-6">
                <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Cadastrar Usuário</button>
            </div>
        </form>
    `

  showModal("Cadastro de Usuário", content)

  // Handle form submission
  document.getElementById("cadastroForm").addEventListener("submit", handleCadastro)
}

// Handle cadastro form submission
function handleCadastro(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Validate passwords match
  if (data.password !== data.confirmPassword) {
    showToast("Erro", "As senhas não coincidem", "error")
    return
  }

  // Validate form
  const errors = validateForm(data, {
    nome: { required: true, label: "Nome" },
    cpf: { required: true, label: "CPF" },
    email: { required: true, email: true, label: "E-mail" },
    cargo: { required: true, label: "Cargo" },
    password: { required: true, minLength: 6, label: "Senha" },
  })

  if (errors.length > 0) {
    showToast("Erro", errors[0], "error")
    return
  }

  showLoading()

  // Simulate API call
  setTimeout(() => {
    hideLoading()
    closeModal()
    showToast("Sucesso", "Usuário cadastrado com sucesso!", "success")
  }, 1000)
}

// Show forgot password modal
function showForgotPassword() {
  const content = `
        <form id="forgotPasswordForm" class="space-y-4">
            <div class="form-group">
                <label for="forgotEmail">E-mail</label>
                <input type="email" id="forgotEmail" name="email" required 
                       placeholder="Digite seu e-mail para recuperar a senha">
            </div>
            <div class="flex justify-end gap-4 mt-6">
                <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
                <button type="submit" class="btn-primary">Enviar Link</button>
            </div>
        </form>
    `

  showModal("Recuperar Senha", content)

  // Handle form submission
  document.getElementById("forgotPasswordForm").addEventListener("submit", handleForgotPassword)
}

// Handle forgot password form submission
function handleForgotPassword(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = formData.get("email")

  if (!email) {
    showToast("Erro", "Digite um e-mail válido", "error")
    return
  }

  showLoading()

  // Simulate API call
  setTimeout(() => {
    hideLoading()
    closeModal()
    showToast("Sucesso", "Link de recuperação enviado para seu e-mail", "success")
  }, 1000)
}

// Get current user
function getCurrentUser() {
  return currentUser
}

// Check if user has permission
function hasPermission(permission) {
  if (!currentUser) return false

  const permissions = {
    admin: ["read", "write", "delete", "manage"],
    gerente: ["read", "write", "manage"],
    encarregado: ["read", "write"],
    funcionario: ["read"],
  }

  const userPermissions = permissions[currentUser.cargo] || []
  return userPermissions.includes(permission)
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) {
    return "Bom dia!"
  } else if (hour < 18) {
    return "Boa tarde!"
  } else {
    return "Boa noite!"
  }
}
