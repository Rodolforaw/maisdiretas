// Ordem de Serviço management

let currentOSFilter = {
  search: "",
  status: "",
  prioridade: "",
}

// Declare variables before using them
const somarDB = {} // Placeholder for somarDB
const showToast = (title, message, type) => {} // Placeholder for showToast
const getStatusColorClass = (status) => {} // Placeholder for getStatusColorClass
const getPriorityColorClass = (priority) => {} // Placeholder for getPriorityColorClass
const formatDate = (date) => {} // Placeholder for formatDate
const debounce = (func, wait) => {} // Placeholder for debounce
const showModal = (title, content) => {} // Placeholder for showModal
const showLoading = () => {} // Placeholder for showLoading
const getCurrentUser = () => ({ username: "user", name: "User Name" }) // Placeholder for getCurrentUser
const hideLoading = () => {} // Placeholder for hideLoading
const closeModal = () => {} // Placeholder for closeModal

// Load OS page
async function loadOrdens() {
  await loadOSStats()
  await loadOSList()
  setupOSFilters()
}

// Load OS statistics
async function loadOSStats() {
  try {
    const ordens = await somarDB.getAll("ordens")

    const stats = {
      total: ordens.length,
      abertas: ordens.filter((os) => os.status === "aberta").length,
      andamento: ordens.filter((os) => os.status === "andamento").length,
      concluidas: ordens.filter((os) => os.status === "concluida").length,
    }

    document.getElementById("totalOS").textContent = stats.total
    document.getElementById("osAbertas").textContent = stats.abertas
    document.getElementById("osAndamento").textContent = stats.andamento
    document.getElementById("osConcluidas").textContent = stats.concluidas
  } catch (error) {
    console.error("Error loading OS stats:", error)
  }
}

// Load OS list
async function loadOSList() {
  try {
    let ordens = await somarDB.getAll("ordens")

    // Apply filters
    if (currentOSFilter.search) {
      ordens = ordens.filter(
        (os) =>
          os.titulo.toLowerCase().includes(currentOSFilter.search.toLowerCase()) ||
          os.numero.toLowerCase().includes(currentOSFilter.search.toLowerCase()) ||
          os.solicitante.toLowerCase().includes(currentOSFilter.search.toLowerCase()),
      )
    }

    if (currentOSFilter.status) {
      ordens = ordens.filter((os) => os.status === currentOSFilter.status)
    }

    if (currentOSFilter.prioridade) {
      ordens = ordens.filter((os) => os.prioridade === currentOSFilter.prioridade)
    }

    // Sort by creation date (newest first)
    ordens.sort((a, b) => new Date(b.dataAbertura) - new Date(a.dataAbertura))

    renderOSList(ordens)
  } catch (error) {
    console.error("Error loading OS list:", error)
    showToast("Erro", "Falha ao carregar lista de OS", "error")
  }
}

// Render OS list
function renderOSList(ordens) {
  const container = document.getElementById("osList")
  if (!container) return

  if (ordens.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file-alt"></i>
        <h3>Nenhuma OS encontrada</h3>
        <p>Não há ordens de serviço que correspondam aos filtros aplicados.</p>
        <button class="btn-primary" onclick="showNovaOS()">
          <i class="fas fa-plus"></i> Nova OS
        </button>
      </div>
    `
    return
  }

  container.innerHTML = ordens
    .map(
      (os) => `
    <div class="os-card">
      <div class="os-header">
        <div class="os-title">
          <h3>${os.titulo}</h3>
          <span class="os-number">${os.numero}</span>
          <span class="badge ${getStatusColorClass(os.status)}">${os.status}</span>
          <span class="badge ${getPriorityColorClass(os.prioridade)}">${os.prioridade}</span>
        </div>
        <div class="os-actions">
          <button class="btn-icon" onclick="viewOS('${os.id}')" title="Visualizar">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-icon" onclick="editOS('${os.id}')" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-icon" onclick="deleteOS('${os.id}')" title="Excluir">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div class="os-description">
        ${os.descricao}
      </div>
      
      <div class="os-details">
        <div class="os-detail">
          <i class="fas fa-hard-hat"></i>
          <span>Obra: ${os.obra || "Não especificada"}</span>
        </div>
        <div class="os-detail">
          <i class="fas fa-user"></i>
          <span>Solicitante: ${os.solicitante}</span>
        </div>
        <div class="os-detail">
          <i class="fas fa-calendar"></i>
          <span>Abertura: ${formatDate(os.dataAbertura)}</span>
        </div>
        <div class="os-detail">
          <i class="fas fa-clock"></i>
          <span>Prazo: ${os.prazo ? formatDate(os.prazo) : "Não definido"}</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

// Setup OS filters
function setupOSFilters() {
  const searchInput = document.getElementById("osSearch")
  const statusFilter = document.getElementById("osStatusFilter")
  const prioridadeFilter = document.getElementById("osPrioridadeFilter")

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce((e) => {
        currentOSFilter.search = e.target.value
        loadOSList()
      }, 300),
    )
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      currentOSFilter.status = e.target.value
      loadOSList()
    })
  }

  if (prioridadeFilter) {
    prioridadeFilter.addEventListener("change", (e) => {
      currentOSFilter.prioridade = e.target.value
      loadOSList()
    })
  }
}

// Clear OS filters
function clearOSFilters() {
  currentOSFilter = { search: "", status: "", prioridade: "" }

  document.getElementById("osSearch").value = ""
  document.getElementById("osStatusFilter").value = ""
  document.getElementById("osPrioridadeFilter").value = ""

  loadOSList()
}

// Show new OS modal
function showNovaOS() {
  const content = `
    <form id="novaOSForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="osTitulo">Título da OS *</label>
          <input type="text" id="osTitulo" name="titulo" required>
        </div>
        <div class="form-group">
          <label for="osPrioridade">Prioridade *</label>
          <select id="osPrioridade" name="prioridade" required>
            <option value="">Selecione a prioridade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="osObra">Obra Relacionada</label>
          <select id="osObra" name="obra">
            <option value="">Selecione a obra</option>
            <!-- Options will be populated by JavaScript -->
          </select>
        </div>
        <div class="form-group">
          <label for="osPrazo">Prazo</label>
          <input type="date" id="osPrazo" name="prazo">
        </div>
      </div>
      
      <div class="form-group">
        <label for="osDescricao">Descrição *</label>
        <textarea id="osDescricao" name="descricao" rows="4" required 
                  placeholder="Descreva detalhadamente o serviço a ser executado..."></textarea>
      </div>
      
      <div class="form-group">
        <label for="osObservacoes">Observações</label>
        <textarea id="osObservacoes" name="observacoes" rows="3" 
                  placeholder="Observações adicionais..."></textarea>
      </div>
      
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn-primary">Criar OS</button>
      </div>
    </form>
  `

  showModal("Nova Ordem de Serviço", content)

  // Populate obras dropdown
  populateObrasDropdown()

  // Handle form submission
  document.getElementById("novaOSForm").addEventListener("submit", handleNovaOS)
}

// Populate obras dropdown
async function populateObrasDropdown() {
  try {
    const obras = await somarDB.getAll("obras")
    const select = document.getElementById("osObra")

    if (select && obras.length > 0) {
      obras.forEach((obra) => {
        const option = document.createElement("option")
        option.value = obra.id
        option.textContent = `${obra.titulo} - ${obra.distrito}`
        select.appendChild(option)
      })
    }
  } catch (error) {
    console.error("Error loading obras:", error)
  }
}

// Handle new OS form submission
async function handleNovaOS(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Validate required fields
  if (!data.titulo || !data.prioridade || !data.descricao) {
    showToast("Erro", "Preencha todos os campos obrigatórios", "error")
    return
  }

  try {
    showLoading()

    // Generate OS number
    const osNumber = await generateOSNumber()

    const osData = {
      numero: osNumber,
      titulo: data.titulo,
      descricao: data.descricao,
      obra: data.obra || null,
      prioridade: data.prioridade,
      prazo: data.prazo || null,
      observacoes: data.observacoes || "",
      solicitante: getCurrentUser().name,
      status: "aberta",
      dataAbertura: new Date().toISOString(),
      responsavel: null,
      dataInicio: null,
      dataConclusao: null,
    }

    await somarDB.add("ordens", osData)

    // Log action
    await somarDB.logAction(getCurrentUser().username, "create_os", `Created OS: ${osNumber}`)

    hideLoading()
    closeModal()
    showToast("Sucesso", "OS criada com sucesso!", "success")

    // Reload OS list
    loadOrdens()
  } catch (error) {
    hideLoading()
    console.error("Error creating OS:", error)
    showToast("Erro", "Falha ao criar OS", "error")
  }
}

// Generate OS number
async function generateOSNumber() {
  const year = new Date().getFullYear()
  const ordens = await somarDB.getAll("ordens")
  const currentYearOrdens = ordens.filter((os) => os.numero.includes(year.toString()))
  const nextNumber = currentYearOrdens.length + 1

  return `OS-${year}-${nextNumber.toString().padStart(3, "0")}`
}

// View OS details
async function viewOS(osId) {
  try {
    const os = await somarDB.get("ordens", Number.parseInt(osId))
    if (!os) {
      showToast("Erro", "OS não encontrada", "error")
      return
    }

    const content = `
      <div class="os-details-modal">
        <div class="os-header mb-4">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-xl font-semibold">${os.titulo}</h3>
            <span class="badge badge-outline">${os.numero}</span>
            <span class="badge ${getStatusColorClass(os.status)}">${os.status}</span>
            <span class="badge ${getPriorityColorClass(os.prioridade)}">${os.prioridade}</span>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="os-detail">
            <i class="fas fa-user text-blue-500"></i>
            <span><strong>Solicitante:</strong> ${os.solicitante}</span>
          </div>
          <div class="os-detail">
            <i class="fas fa-calendar text-blue-500"></i>
            <span><strong>Data Abertura:</strong> ${formatDate(os.dataAbertura)}</span>
          </div>
          ${
            os.obra
              ? `
          <div class="os-detail">
            <i class="fas fa-hard-hat text-blue-500"></i>
            <span><strong>Obra:</strong> ${os.obra}</span>
          </div>
          `
              : ""
          }
          ${
            os.prazo
              ? `
          <div class="os-detail">
            <i class="fas fa-clock text-blue-500"></i>
            <span><strong>Prazo:</strong> ${formatDate(os.prazo)}</span>
          </div>
          `
              : ""
          }
        </div>
        
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Descrição:</h4>
          <div class="bg-gray-50 p-3 rounded-lg">
            ${os.descricao}
          </div>
        </div>
        
        ${
          os.observacoes
            ? `
        <div class="mb-4">
          <h4 class="font-semibold mb-2">Observações:</h4>
          <div class="bg-gray-50 p-3 rounded-lg">
            ${os.observacoes}
          </div>
        </div>
        `
            : ""
        }
        
        <div class="flex justify-end gap-4 mt-6">
          <button class="btn-outline" onclick="closeModal()">Fechar</button>
          <button class="btn-primary" onclick="editOS('${os.id}')">Editar OS</button>
        </div>
      </div>
    `

    showModal("Detalhes da OS", content)
  } catch (error) {
    console.error("Error viewing OS:", error)
    showToast("Erro", "Falha ao carregar detalhes da OS", "error")
  }
}

// Edit OS
async function editOS(osId) {
  try {
    const os = await somarDB.get("ordens", Number.parseInt(osId))
    if (!os) {
      showToast("Erro", "OS não encontrada", "error")
      return
    }

    const content = `
      <form id="editOSForm" class="space-y-4">
        <input type="hidden" name="id" value="${os.id}">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="editOsTitulo">Título da OS *</label>
            <input type="text" id="editOsTitulo" name="titulo" value="${os.titulo}" required>
          </div>
          <div class="form-group">
            <label for="editOsStatus">Status *</label>
            <select id="editOsStatus" name="status" required>
              <option value="aberta" ${os.status === "aberta" ? "selected" : ""}>Aberta</option>
              <option value="andamento" ${os.status === "andamento" ? "selected" : ""}>Em Andamento</option>
              <option value="concluida" ${os.status === "concluida" ? "selected" : ""}>Concluída</option>
              <option value="cancelada" ${os.status === "cancelada" ? "selected" : ""}>Cancelada</option>
            </select>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="editOsPrioridade">Prioridade *</label>
            <select id="editOsPrioridade" name="prioridade" required>
              <option value="baixa" ${os.prioridade === "baixa" ? "selected" : ""}>Baixa</option>
              <option value="media" ${os.prioridade === "media" ? "selected" : ""}>Média</option>
              <option value="alta" ${os.prioridade === "alta" ? "selected" : ""}>Alta</option>
              <option value="urgente" ${os.prioridade === "urgente" ? "selected" : ""}>Urgente</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editOsPrazo">Prazo</label>
            <input type="date" id="editOsPrazo" name="prazo" value="${os.prazo || ""}">
          </div>
        </div>
        
        <div class="form-group">
          <label for="editOsDescricao">Descrição *</label>
          <textarea id="editOsDescricao" name="descricao" rows="4" required>${os.descricao}</textarea>
        </div>
        
        <div class="form-group">
          <label for="editOsObservacoes">Observações</label>
          <textarea id="editOsObservacoes" name="observacoes" rows="3">${os.observacoes || ""}</textarea>
        </div>
        
        <div class="flex justify-end gap-4 mt-6">
          <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn-primary">Salvar Alterações</button>
        </div>
      </form>
    `

    showModal("Editar OS", content)

    // Handle form submission
    document.getElementById("editOSForm").addEventListener("submit", handleEditOS)
  } catch (error) {
    console.error("Error loading OS for edit:", error)
    showToast("Erro", "Falha ao carregar OS para edição", "error")
  }
}

// Handle edit OS form submission
async function handleEditOS(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  try {
    showLoading()

    const osId = Number.parseInt(data.id)
    const os = await somarDB.get("ordens", osId)

    if (!os) {
      throw new Error("OS não encontrada")
    }

    // Update OS data
    os.titulo = data.titulo
    os.status = data.status
    os.prioridade = data.prioridade
    os.prazo = data.prazo || null
    os.descricao = data.descricao
    os.observacoes = data.observacoes || ""

    // Set completion date if status changed to completed
    if (data.status === "concluida" && os.status !== "concluida") {
      os.dataConclusao = new Date().toISOString()
    }

    await somarDB.update("ordens", os)

    // Log action
    await somarDB.logAction(getCurrentUser().username, "update_os", `Updated OS: ${os.numero}`)

    hideLoading()
    closeModal()
    showToast("Sucesso", "OS atualizada com sucesso!", "success")

    // Reload OS list
    loadOrdens()
  } catch (error) {
    hideLoading()
    console.error("Error updating OS:", error)
    showToast("Erro", "Falha ao atualizar OS", "error")
  }
}

// Delete OS
async function deleteOS(osId) {
  if (!confirm("Tem certeza que deseja excluir esta OS? Esta ação não pode ser desfeita.")) {
    return
  }

  try {
    showLoading()

    const os = await somarDB.get("ordens", Number.parseInt(osId))
    if (!os) {
      throw new Error("OS não encontrada")
    }

    await somarDB.delete("ordens", Number.parseInt(osId))

    // Log action
    await somarDB.logAction(getCurrentUser().username, "delete_os", `Deleted OS: ${os.numero}`)

    hideLoading()
    showToast("Sucesso", "OS excluída com sucesso!", "success")

    // Reload OS list
    loadOrdens()
  } catch (error) {
    hideLoading()
    console.error("Error deleting OS:", error)
    showToast("Erro", "Falha ao excluir OS", "error")
  }
}

// Initialize OS page when shown
document.addEventListener("DOMContentLoaded", () => {
  // Load OS data when page is shown
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        const ordensContent = document.getElementById("ordensContent")
        if (ordensContent && ordensContent.classList.contains("active")) {
          loadOrdens()
        }
      }
    })
  })

  const ordensContent = document.getElementById("ordensContent")
  if (ordensContent) {
    observer.observe(ordensContent, { attributes: true })
  }
})
