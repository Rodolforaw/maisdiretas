// Equipment management

const currentEquipmentFilter = {
  search: "",
  type: "",
  status: "",
}

// Declare variables before using them
const somarDB = {
  getAll: async (type) => {
    // Mock implementation
    return []
  },
  add: async (type, data) => {
    // Mock implementation
  },
  logAction: async (username, action, message) => {
    // Mock implementation
  },
}

const showToast = (title, message, type) => {
  // Mock implementation
}

const getStatusColorClass = (status) => {
  // Mock implementation
  return ""
}

const formatCurrency = (value) => {
  // Mock implementation
  return value.toString()
}

const showModal = (title, content) => {
  // Mock implementation
}

const showLoading = () => {
  // Mock implementation
}

const hideLoading = () => {
  // Mock implementation
}

const closeModal = () => {
  // Mock implementation
}

const getCurrentUser = () => {
  // Mock implementation
  return { username: "user" }
}

// Load equipment page
async function loadEquipamentos() {
  await loadEquipmentList()
  setupEquipmentFilters()
  updateCadastroCount("equipamentos")
}

// Load equipment list
async function loadEquipmentList() {
  try {
    let equipamentos = await somarDB.getAll("equipamentos")

    // Apply filters
    if (currentEquipmentFilter.search) {
      equipamentos = equipamentos.filter(
        (eq) =>
          eq.nome.toLowerCase().includes(currentEquipmentFilter.search.toLowerCase()) ||
          eq.tipo.toLowerCase().includes(currentEquipmentFilter.search.toLowerCase()) ||
          eq.modelo.toLowerCase().includes(currentEquipmentFilter.search.toLowerCase()),
      )
    }

    if (currentEquipmentFilter.type) {
      equipamentos = equipamentos.filter((eq) => eq.tipo === currentEquipmentFilter.type)
    }

    if (currentEquipmentFilter.status) {
      equipamentos = equipamentos.filter((eq) => eq.status === currentEquipmentFilter.status)
    }

    renderEquipmentList(equipamentos)
  } catch (error) {
    console.error("Error loading equipment list:", error)
    showToast("Erro", "Falha ao carregar lista de equipamentos", "error")
  }
}

// Render equipment list
function renderEquipmentList(equipamentos) {
  const container = document.getElementById("equipamentosList")
  if (!container) return

  if (equipamentos.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-tools"></i>
        <h3>Nenhum equipamento encontrado</h3>
        <p>Não há equipamentos que correspondam aos filtros aplicados.</p>
        <button class="btn-primary" onclick="showNovoEquipamento()">
          <i class="fas fa-plus"></i> Novo Equipamento
        </button>
      </div>
    `
    return
  }

  container.innerHTML = equipamentos
    .map(
      (eq) => `
    <div class="equipamento-card">
      <div class="card-header">
        <h3>${eq.nome}</h3>
        <span class="badge ${getStatusColorClass(eq.status)}">${eq.status}</span>
      </div>
      
      <div class="equipment-details">
        <div class="detail-row">
          <span class="detail-label">Tipo:</span>
          <span class="detail-value">${eq.tipo}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Modelo:</span>
          <span class="detail-value">${eq.modelo}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Número de Série:</span>
          <span class="detail-value">${eq.numeroSerie}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Localização:</span>
          <span class="detail-value">${eq.localizacao}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Responsável:</span>
          <span class="detail-value">${eq.responsavel}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Valor:</span>
          <span class="detail-value">${formatCurrency(eq.valorAquisicao)}</span>
        </div>
      </div>
      
      <div class="card-actions">
        <button class="btn-icon" onclick="editEquipment(${eq.id})" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon" onclick="deleteEquipment(${eq.id})" title="Excluir">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Show new equipment modal
function showNovoEquipamento() {
  const content = `
    <form id="novoEquipamentoForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="equipNome">Nome do Equipamento *</label>
          <input type="text" id="equipNome" name="nome" required>
        </div>
        <div class="form-group">
          <label for="equipTipo">Tipo *</label>
          <select id="equipTipo" name="tipo" required>
            <option value="">Selecione o tipo</option>
            <option value="Ferramenta Elétrica">Ferramenta Elétrica</option>
            <option value="Ferramenta Manual">Ferramenta Manual</option>
            <option value="Equipamento Pesado">Equipamento Pesado</option>
            <option value="Equipamento de Segurança">Equipamento de Segurança</option>
            <option value="Equipamento de Medição">Equipamento de Medição</option>
          </select>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="equipModelo">Modelo</label>
          <input type="text" id="equipModelo" name="modelo">
        </div>
        <div class="form-group">
          <label for="equipNumeroSerie">Número de Série</label>
          <input type="text" id="equipNumeroSerie" name="numeroSerie">
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="equipStatus">Status *</label>
          <select id="equipStatus" name="status" required>
            <option value="Disponível">Disponível</option>
            <option value="Em Uso">Em Uso</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
        <div class="form-group">
          <label for="equipLocalizacao">Localização *</label>
          <input type="text" id="equipLocalizacao" name="localizacao" required>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-group">
          <label for="equipDataAquisicao">Data de Aquisição</label>
          <input type="date" id="equipDataAquisicao" name="dataAquisicao">
        </div>
        <div class="form-group">
          <label for="equipValorAquisicao">Valor de Aquisição</label>
          <input type="number" id="equipValorAquisicao" name="valorAquisicao" step="0.01" min="0">
        </div>
      </div>
      
      <div class="form-group">
        <label for="equipResponsavel">Responsável</label>
        <input type="text" id="equipResponsavel" name="responsavel">
      </div>
      
      <div class="flex justify-end gap-4 mt-6">
        <button type="button" class="btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn-primary">Cadastrar Equipamento</button>
      </div>
    </form>
  `

  showModal("Novo Equipamento", content)

  // Handle form submission
  document.getElementById("novoEquipamentoForm").addEventListener("submit", handleNovoEquipamento)
}

// Handle new equipment form submission
async function handleNovoEquipamento(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const data = Object.fromEntries(formData)

  // Validate required fields
  if (!data.nome || !data.tipo || !data.status || !data.localizacao) {
    showToast("Erro", "Preencha todos os campos obrigatórios", "error")
    return
  }

  try {
    showLoading()

    const equipmentData = {
      nome: data.nome,
      tipo: data.tipo,
      modelo: data.modelo || "",
      numeroSerie: data.numeroSerie || "",
      status: data.status,
      localizacao: data.localizacao,
      dataAquisicao: data.dataAquisicao || null,
      valorAquisicao: Number.parseFloat(data.valorAquisicao) || 0,
      responsavel: data.responsavel || "",
      createdAt: new Date().toISOString(),
    }

    await somarDB.add("equipamentos", equipmentData)

    // Log action
    await somarDB.logAction(getCurrentUser().username, "create_equipment", `Created equipment: ${data.nome}`)

    hideLoading()
    closeModal()
    showToast("Sucesso", "Equipamento cadastrado com sucesso!", "success")

    // Reload equipment list
    loadEquipamentos()
  } catch (error) {
    hideLoading()
    console.error("Error creating equipment:", error)
    showToast("Erro", "Falha ao cadastrar equipamento", "error")
  }
}

// Setup equipment filters
function setupEquipmentFilters() {
  // Implementation similar to other filters
}

// Edit equipment
async function editEquipment(equipmentId) {
  // Implementation similar to edit functions
}

// Delete equipment
async function deleteEquipment(equipmentId) {
  // Implementation similar to delete functions
}

// Update cadastro count
async function updateCadastroCount(type) {
  try {
    const count = await somarDB.getAll(type)
    const countElement = document.getElementById(`${type}Count`)
    if (countElement) {
      countElement.textContent = `${count.length} itens`
    }
  } catch (error) {
    console.error(`Error updating ${type} count:`, error)
  }
}
