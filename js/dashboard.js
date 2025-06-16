// Dashboard functions

// Load dashboard content
function loadDashboard() {
  loadDistrictData()
  loadRecentWorks()
  updateDashboardStats()
}

// Load district data
function loadDistrictData() {
  const container = document.getElementById("districtList")
  if (!container) return

  container.innerHTML = ""

  mockData.districts.forEach((district) => {
    const progressPercentage = calculateProgress(district.concluidas, district.obras)

    const item = document.createElement("div")
    item.className = "district-item"
    item.onclick = () => filterByDistrict(district.nome)

    item.innerHTML = `
            <div class="district-info">
                <h4>${district.nome}</h4>
                <div class="district-stats">
                    <span>Total: ${district.obras}</span>
                    <span>Andamento: ${district.andamento}</span>
                    <span>Concluídas: ${district.concluidas}</span>
                </div>
            </div>
            <div class="district-progress">
                <div class="district-progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
        `

    container.appendChild(item)
  })
}

// Load recent works
function loadRecentWorks() {
  const container = document.getElementById("recentWorks")
  if (!container) return

  container.innerHTML = ""

  const works = getWorks().slice(0, 5) // Get first 5 works

  works.forEach((work) => {
    const item = document.createElement("div")
    item.className = "work-item"
    item.onclick = () => showWorkDetails(work.id)

    item.innerHTML = `
            <div class="work-info">
                <h4>${work.titulo}</h4>
                <div class="work-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${work.distrito}</span>
                    <span><i class="fas fa-user"></i> ${work.encarregado}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(work.dataInicio)}</span>
                </div>
            </div>
            <div class="work-status ${getStatusColorClass(work.status)}">${work.status}</div>
        `

    container.appendChild(item)
  })
}

// Update dashboard statistics
function updateDashboardStats() {
  const works = getWorks()
  const materials = getMaterials()
  const employees = getEmployees()

  // Calculate statistics
  const stats = {
    totalWorks: works.length,
    worksInProgress: works.filter((w) => w.status === "Em Andamento").length,
    completedWorks: works.filter((w) => w.status === "Concluída").length,
    delayedWorks: works.filter((w) => w.status === "Atrasada").length,
    totalBudget: works.reduce((sum, w) => sum + w.orcamento, 0),
    totalSpent: works.reduce((sum, w) => sum + w.gastoAtual, 0),
    activeEmployees: employees.filter((e) => e.status === "Ativo").length,
    criticalMaterials: materials.filter((m) => m.status === "Crítico").length,
  }

  // Update stat cards
  updateStatCard(0, stats.totalWorks, "+12% este mês")
  updateStatCard(1, stats.worksInProgress, `${Math.round((stats.worksInProgress / stats.totalWorks) * 100)}% do total`)
  updateStatCard(2, stats.activeEmployees, `Distribuídos em ${stats.worksInProgress} obras`)
  updateStatCard(
    3,
    formatCurrency(stats.totalBudget),
    `${Math.round((stats.totalSpent / stats.totalBudget) * 100)}% utilizado`,
  )
}

// Update individual stat card
function updateStatCard(index, value, subtitle) {
  const cards = document.querySelectorAll(".stat-card")
  if (cards[index]) {
    const valueElement = cards[index].querySelector("h3")
    const subtitleElement = cards[index].querySelector(".stat-change")

    if (valueElement) valueElement.textContent = value
    if (subtitleElement) subtitleElement.textContent = subtitle
  }
}

// Filter by district
function filterByDistrict(districtName) {
  showPage("obras")
  // Set district filter
  const districtFilter = document.getElementById("districtFilter")
  if (districtFilter) {
    districtFilter.value = districtName.toLowerCase()
    filterWorks()
  }
}

// Show work details
function showWorkDetails(workId) {
  const work = getWorks().find((w) => w.id === workId)
  if (!work) return

  const content = `
        <div class="work-details-modal">
            <div class="work-header mb-4">
                <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-xl font-semibold">${work.titulo}</h3>
                    <span class="badge badge-outline">${work.id}</span>
                    <span class="badge ${getStatusColorClass(work.status)}">${work.status}</span>
                </div>
                <p class="text-gray-600">${work.descricao}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="work-detail">
                    <i class="fas fa-map-marker-alt text-blue-500"></i>
                    <span><strong>Distrito:</strong> ${work.distrito}</span>
                </div>
                <div class="work-detail">
                    <i class="fas fa-user text-blue-500"></i>
                    <span><strong>Encarregado:</strong> ${work.encarregado}</span>
                </div>
                <div class="work-detail">
                    <i class="fas fa-calendar text-blue-500"></i>
                    <span><strong>Início:</strong> ${formatDate(work.dataInicio)}</span>
                </div>
                <div class="work-detail">
                    <i class="fas fa-calendar-check text-blue-500"></i>
                    <span><strong>Previsão:</strong> ${formatDate(work.previsaoTermino)}</span>
                </div>
            </div>
            
            <div class="work-progress mb-4">
                <div class="progress-header">
                    <span>Progresso da Obra</span>
                    <span class="font-semibold">${work.progresso}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${work.progresso}%"></div>
                </div>
            </div>
            
            <div class="work-budget">
                <div class="budget-item">
                    <span class="budget-label">Orçamento Total</span>
                    <span class="budget-value budget-total">${formatCurrency(work.orcamento)}</span>
                </div>
                <div class="budget-item">
                    <span class="budget-label">Gasto Atual</span>
                    <span class="budget-value budget-spent">${formatCurrency(work.gastoAtual)}</span>
                </div>
                <div class="budget-item">
                    <span class="budget-label">Saldo</span>
                    <span class="budget-value budget-remaining">${formatCurrency(work.orcamento - work.gastoAtual)}</span>
                </div>
            </div>
            
            <div class="flex justify-end gap-4 mt-6">
                <button class="btn-outline" onclick="closeModal()">Fechar</button>
                <button class="btn-primary" onclick="editWork('${work.id}')">Editar Obra</button>
            </div>
        </div>
    `

  showModal("Detalhes da Obra", content)
}

// Edit work
function editWork(workId) {
    closeModal();
    showPage('obras');
    // Implementation for editing work would go here
    showToast('Info', '\
