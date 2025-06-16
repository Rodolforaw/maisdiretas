// User management functions

const currentUserFilter = {
  search: "",
  role: "",
  status: "",
}

// Declare variables before using them
const somarDB = {} // Placeholder for somarDB
const showToast = () => {} // Placeholder for showToast
const formatDate = () => {} // Placeholder for formatDate
const formatDateTime = () => {} // Placeholder for formatDateTime
const showModal = () => {} // Placeholder for showModal
const showLoading = () => {} // Placeholder for showLoading
const createUser = () => {} // Placeholder for createUser
const hideLoading = () => {} // Placeholder for hideLoading
const closeModal = () => {} // Placeholder for closeModal
const getCurrentUser = () => {} // Placeholder for getCurrentUser
const sendMessage = () => {} // Placeholder for sendMessage

// Load users page
async function loadUsuarios() {
  await loadUserStats()
  await loadUsersList()
  setupUserFilters()
}

// Load user statistics
async function loadUserStats() {
  try {
    const users = await somarDB.getAll("users")

    const stats = {
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      admin: users.filter((u) => u.role === "admin" || u.role === "master").length,
      online: users.filter((u) => u.lastLogin && isRecentLogin(u.lastLogin)).length,
    }

    document.getElementById("totalUsers").textContent = stats.total
    document.getElementById("activeUsers").textContent = stats.active
    document.getElementById("adminUsers").textContent = stats.admin
    document.getElementById("onlineUsers").textContent = stats.online
  } catch (error) {
    console.error("Error loading user stats:", error)
  }
}

// Check if login is recent (within last 30 minutes)
function isRecentLogin(lastLogin) {
  if (!lastLogin) return false
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
  return new Date(lastLogin) > thirtyMinutesAgo
}

// Load users list
async function loadUsersList() {
  try {
    let users = await somarDB.getAll("users")

    // Apply filters
    if (currentUserFilter.search) {
      users = users.filter(
        (user) =>
          user.name.toLowerCase().includes(currentUserFilter.search.toLowerCase()) ||
          user.username.toLowerCase().includes(currentUserFilter.search.toLowerCase()) ||
          user.email.toLowerCase().includes(currentUserFilter.search.toLowerCase()),
      )
    }

    if (currentUserFilter.role) {
      users = users.filter((user) => user.role === currentUserFilter.role)
    }

    if (currentUserFilter.status) {
      users = users.filter((user) => user.status === currentUserFilter.status)
    }

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    renderUsersList(users)
  } catch (error) {
    console.error("Error loading users list:", error)
    showToast("Erro", "Falha ao carregar lista de usuários", "error")
  }
}

// Render users list
function renderUsersList(users) {
  const container = document.getElementById("usersList")
  if (!container) return

  if (users.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-users"></i>
        <h3>Nenhum usuário encontrado</h3>
        <p>Não há usuários que correspondam aos filtros aplicados.</p>
        <button class="btn-primary" onclick="showNovoUsuario()">
          <i class="fas fa-user-plus"></i> Novo Usuário
        </button>
      </div>
    `
    return
  }

  container.innerHTML = users
    .map(
      (user) => `
    <div class="user-card" style="position: relative;">
      <div class="user-status ${getOnlineStatus(user.lastLogin)}"></div>
      
      <div class="user-header">
        <div class="user-avatar-large">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <div class="user-info-card">
          <h3>${user.name}</h3>
          <span class="user-role-badge role-${user.role}">${user.role}</span>
        </div>
      </div>
      
      <div class="user-details">
        <div class="user-detail">
          <i class="fas fa-user"></i>
          <span>@${user.username}</span>
        </div>
        <div class="user-detail">
          <i class="fas fa-envelope"></i>
          <span>${user.email}</span>
        </div>
        <div class="user-detail">
          <i class="fas fa-calendar"></i>
          <span>Criado em ${formatDate(user.createdAt)}</span>
        </div>
        <div class="user-detail">
          <i class="fas fa-clock"></i>
          <span>Último login: ${user.lastLogin ? formatDateTime(user.lastLogin) : "Nunca"}</span>
        </div>
      </div>
      
      <div class="user-permissions">
        <h4>Permissões:</h4>
        <div class="permissions-list">
          ${user.permissions.map((perm) => `<span class="permission-tag">${perm}</span>`).join("")}
        </div>
      </div>
      
      <div class="user-actions">
        <button class="btn-icon" onclick="editUser(${user.id})" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon" onclick="sendMessageToUser('${user.username}')" title="Enviar Mensagem">
          <i class="fas fa-comment"></i>
        </button>
        <button class="btn-icon" onclick="toggleUserStatus(${user.id})" title="${user.status === "active" ? "Desativar" : "Ativar"}">
          <i class="fas fa-${user.status === "active" ? "user-slash" : "user-check"}"></i>
        </button>
        ${
          user.role !== "master"
            ? `
        <button class="btn-icon" onclick="deleteUser(${user.id})" title="Excluir">
          <i class="fas fa-trash"></i>
        </button>
        `
            : ""
        }
      </div>
    </div>
  `,
    )
    .join("")
}

// Get online status class
function getOnlineStatus(lastLogin) {
  if (!lastLogin) return "status-offline"

  const now = new Date()
  const loginTime = new Date(lastLogin)
  const diffMinutes = (now - loginTime) / (1000 * 60)

  if (diffMinutes <= 5) return "status-online"
  if (diffMinutes <= 30) return "status-away"
  return "status-offline"
}

// Setup user filters
function setupUserFilters() {
  // Implementation would be similar to OS filters
}

// Show new user modal
function showNovoUsuario() {
  const content = `
    <form id="novoUsuarioForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="userName">Nome Completo *</label>
          <input type="text" id="userName" name="name" required>
        </div>
        <div class="form-group">
          <label for="userUsername">Nome de Usuário *</label>
          <input type="text" id="userUsername" name="username" required>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="userEmail">E-mail *</label>
          <input type="email" id="userEmail" name="email" required>
        </div>
        <div class="form-group">
          <label for="userRole">Cargo *</label>
          <select id="userRole" name="role" required>
            <option value="">Selecione o cargo</option>
            <option value="funcionario">Funcionário</option>
            <option value="encarregado">Encarregado</option>
            <option value="gerente">Gerente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="userPassword">Senha *</label>
          <input type="password" id="userPassword" name="password" required>
        </div>
        <div class="form-group">
          <label for="userConfirmPassword">Confirmar Senha *</label>
          <input type="password" id="userConfirmPassword" name="confirmPassword" required>
        </div>
      </div>
      
      <div class="form-group">
        <label>Permissões *</label>
        <div class="permissions-grid">
          <label class="permission-checkbox">
            <input type="checkbox" name="permissions" value="read" checked>
            <span>Leitura</span>
          </label>
          <label class="permission-checkbox">
            <input type="checkbox" name="permissions" value="write">
            <span>Escrita</span>
          </label>
          <label class="permission-checkbox">
            <input type="checkbox" name="permissions" value="delete">
            <span>Exclusão</span>
          </label>
          <label class="permission-checkbox">
            <input type="checkbox" name="permissions" value="manage">
            <span>Gerenciar</span>
          </label>
          <label class="permission-checkbox">
            <input type="checkbox" name="permissions" value="users">
            <span>Usuários</span>
          </label>
          <label class="permission-checkbox">
            <input type="checkbox" name="permissions" value="reports">
            <span>Relatórios</span>
          </label>
        </div>
      </div>
      
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn-primary">Criar Usuário</button>
      </div>
    </form>
  `

  showModal("Novo Usuário", content)

  // Handle form submission
  document.getElementById("novoUsuarioForm").addEventListener("submit", handleNovoUsuario)

  // Handle role change to auto-select permissions
  document.getElementById("userRole").addEventListener("change", handleRoleChange)
}

// Handle role change for auto-permissions
function handleRoleChange(e) {
  const role = e.target.value
  const checkboxes = document.querySelectorAll('input[name="permissions"]')

  // Clear all checkboxes
  checkboxes.forEach((cb) => (cb.checked = false))

  // Set permissions based on role
  const rolePermissions = {
    funcionario: ["read"],
    encarregado: ["read", "write"],
    gerente: ["read", "write", "manage"],
    admin: ["read", "write", "delete", "manage", "users", "reports"],
  }

  if (rolePermissions[role]) {
    rolePermissions[role].forEach((perm) => {
      const checkbox = document.querySelector(`input[value="${perm}"]`)
      if (checkbox) checkbox.checked = true
    })
  }
}

// Handle new user form submission
async function handleNovoUsuario(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Get selected permissions
  const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map((cb) => cb.value)

  // Validate passwords match
  if (data.password !== data.confirmPassword) {
    showToast("Erro", "As senhas não coincidem", "error")
    return
  }

  // Validate required fields
  if (!data.name || !data.username || !data.email || !data.role || !data.password) {
    showToast("Erro", "Preencha todos os campos obrigatórios", "error")
    return
  }

  if (permissions.length === 0) {
    showToast("Erro", "Selecione pelo menos uma permissão", "error")
    return
  }

  try {
    showLoading()

    const userData = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
      permissions: permissions,
      status: "active",
      lastLogin: null,
      createdAt: new Date().toISOString(),
    }

    await createUser(userData)

    hideLoading()
    closeModal()
    showToast("Sucesso", "Usuário criado com sucesso!", "success")

    // Reload users list
    loadUsuarios()
  } catch (error) {
    hideLoading()
    console.error("Error creating user:", error)
    showToast("Erro", error.message || "Falha ao criar usuário", "error")
  }
}

// Edit user
async function editUser(userId) {
  try {
    const user = await somarDB.get("users", userId)
    if (!user) {
      showToast("Erro", "Usuário não encontrado", "error")
      return
    }

    const content = `
      <form id="editUsuarioForm" class="space-y-4">
        <input type="hidden" name="id" value="${user.id}">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="editUserName">Nome Completo *</label>
            <input type="text" id="editUserName" name="name" value="${user.name}" required>
          </div>
          <div class="form-group">
            <label for="editUserUsername">Nome de Usuário *</label>
            <input type="text" id="editUserUsername" name="username" value="${user.username}" required>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="editUserEmail">E-mail *</label>
            <input type="email" id="editUserEmail" name="email" value="${user.email}" required>
          </div>
          <div class="form-group">
            <label for="editUserRole">Cargo *</label>
            <select id="editUserRole" name="role" required>
              <option value="funcionario" ${user.role === "funcionario" ? "selected" : ""}>Funcionário</option>
              <option value="encarregado" ${user.role === "encarregado" ? "selected" : ""}>Encarregado</option>
              <option value="gerente" ${user.role === "gerente" ? "selected" : ""}>Gerente</option>
              <option value="admin" ${user.role === "admin" ? "selected" : ""}>Administrador</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label>Permissões *</label>
          <div class="permissions-grid">
            <label class="permission-checkbox">
              <input type="checkbox" name="permissions" value="read" ${user.permissions.includes("read") ? "checked" : ""}>
              <span>Leitura</span>
            </label>
            <label class="permission-checkbox">
              <input type="checkbox" name="permissions" value="write" ${user.permissions.includes("write") ? "checked" : ""}>
              <span>Escrita</span>
            </label>
            <label class="permission-checkbox">
              <input type="checkbox" name="permissions" value="delete" ${user.permissions.includes("delete") ? "checked" : ""}>
              <span>Exclusão</span>
            </label>
            <label class="permission-checkbox">
              <input type="checkbox" name="permissions" value="manage" ${user.permissions.includes("manage") ? "checked" : ""}>
              <span>Gerenciar</span>
            </label>
            <label class="permission-checkbox">
              <input type="checkbox" name="permissions" value="users" ${user.permissions.includes("users") ? "checked" : ""}>
              <span>Usuários</span>
            </label>
            <label class="permission-checkbox">
              <input type="checkbox" name="permissions" value="reports" ${user.permissions.includes("reports") ? "checked" : ""}>
              <span>Relatórios</span>
            </label>
          </div>
        </div>
        
        <div class="form-group">
          <label for="editUserPassword">Nova Senha (deixe em branco para manter atual)</label>
          <input type="password" id="editUserPassword" name="password">
        </div>
        
        <div class="flex justify-end gap-4 mt-6">
          <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `

    showModal("Editar Usuário", content)

    // Handle form submission
    document.getElementById("editUsuarioForm").addEventListener("submit", handleEditUsuario)
  } catch (error) {
    console.error("Error loading user for edit:", error)
    showToast("Erro", "Falha ao carregar usuário para edição", "error")
  }
}

// Handle edit user form submission
async function handleEditUsuario(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Get selected permissions
  const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map((cb) => cb.value)

  if (permissions.length === 0) {
    showToast("Erro", "Selecione pelo menos uma permissão", "error")
    return
  }

  try {
    showLoading()

    const userId = Number.parseInt(data.id)
    const user = await somarDB.get("users", userId)

    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    // Update user data
    user.name = data.name
    user.username = data.username
    user.email = data.email
    user.role = data.role
    user.permissions = permissions

    // Update password if provided
    if (data.password) {
      user.password = data.password
    }

    await somarDB.update("users", user)

    // Log action
    await somarDB.logAction(getCurrentUser().username, "update_user", `Updated user: ${user.username}`)

    hideLoading()
    closeModal()
    showToast("Sucesso", "Usuário atualizado com sucesso!", "success")

    // Reload users list
    loadUsuarios()
  } catch (error) {
    hideLoading()
    console.error("Error updating user:", error)
    showToast("Erro", "Falha ao atualizar usuário", "error")
  }
}

// Toggle user status
async function toggleUserStatus(userId) {
  try {
    const user = await somarDB.get("users", userId)
    if (!user) {
      showToast("Erro", "Usuário não encontrado", "error")
      return
    }

    const newStatus = user.status === "active" ? "inactive" : "active"
    const action = newStatus === "active" ? "ativar" : "desativar"

    if (!confirm(`Tem certeza que deseja ${action} este usuário?`)) {
      return
    }

    user.status = newStatus
    await somarDB.update("users", user)

    // Log action
    await somarDB.logAction(getCurrentUser().username, "toggle_user_status", `${action} user: ${user.username}`)

    showToast("Sucesso", `Usuário ${action === "ativar" ? "ativado" : "desativado"} com sucesso!`, "success")

    // Reload users list
    loadUsuarios()
  } catch (error) {
    console.error("Error toggling user status:", error)
    showToast("Erro", "Falha ao alterar status do usuário", "error")
  }
}

// Delete user
async function deleteUser(userId) {
  if (!confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
    return
  }

  try {
    showLoading()

    const user = await somarDB.get("users", userId)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    await somarDB.delete("users", userId)

    // Log action
    await somarDB.logAction(getCurrentUser().username, "delete_user", `Deleted user: ${user.username}`)

    hideLoading()
    closeModal()
    showToast("Sucesso", "Usuário excluído com sucesso!", "success")

    // Reload users list
    loadUsuarios()
  } catch (error) {
    hideLoading()
    console.error("Error deleting user:", error)
    showToast("Erro", "Falha ao excluir usuário", "error")
  }
}

// Send message to user
function sendMessageToUser(username) {
  const content = `
    <form id="sendMessageForm" class="space-y-4">
      <input type="hidden" name="to" value="${username}">
      
      <div class="form-group">
        <label for="messageText">Mensagem para @${username}</label>
        <textarea id="messageText" name="message" rows="4" required 
                  placeholder="Digite sua mensagem..."></textarea>
      </div>
      
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn-primary">Enviar Mensagem</button>
      </div>
    </form>
  `

  showModal("Enviar Mensagem", content)

  // Handle form submission
  document.getElementById("sendMessageForm").addEventListener("submit", handleSendMessage)
}

// Handle send message form submission
async function handleSendMessage(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  if (!data.message.trim()) {
    showToast("Erro", "Digite uma mensagem", "error")
    return
  }

  try {
    showLoading()

    await sendMessage(getCurrentUser().username, data.to, data.message, "direct")

    hideLoading()
    closeModal()
    showToast("Sucesso", "Mensagem enviada com sucesso!", "success")
  } catch (error) {
    hideLoading()
    console.error("Error sending message:", error)
    showToast("Erro", "Falha ao enviar mensagem", "error")
  }
}
