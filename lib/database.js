// Sistema de Banco de Dados para SOMAR - Obras Públicas
// Usando IndexedDB para persistência local

class SomarDatabase {
  constructor() {
    this.dbName = "SomarObrasDB"
    this.version = 1
    this.db = null
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Store para usuários
        if (!db.objectStoreNames.contains("users")) {
          const userStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true })
          userStore.createIndex("username", "username", { unique: true })
          userStore.createIndex("email", "email", { unique: true })
          userStore.createIndex("role", "role", { unique: false })
        }

        // Store para ordens de serviço
        if (!db.objectStoreNames.contains("ordens")) {
          const ordensStore = db.createObjectStore("ordens", { keyPath: "id", autoIncrement: true })
          ordensStore.createIndex("codigo", "codigo", { unique: true })
          ordensStore.createIndex("status", "status", { unique: false })
          ordensStore.createIndex("distrito", "distrito", { unique: false })
          ordensStore.createIndex("solicitante", "solicitante", { unique: false })
          ordensStore.createIndex("dataCriacao", "dataCriacao", { unique: false })
        }

        // Store para obras
        if (!db.objectStoreNames.contains("obras")) {
          const obrasStore = db.createObjectStore("obras", { keyPath: "id", autoIncrement: true })
          obrasStore.createIndex("codigo", "codigo", { unique: true })
          obrasStore.createIndex("titulo", "titulo", { unique: false })
          obrasStore.createIndex("status", "status", { unique: false })
          obrasStore.createIndex("distrito", "distrito", { unique: false })
          obrasStore.createIndex("encarregado", "encarregado", { unique: false })
        }

        // Store para funcionários
        if (!db.objectStoreNames.contains("funcionarios")) {
          const funcionariosStore = db.createObjectStore("funcionarios", { keyPath: "id", autoIncrement: true })
          funcionariosStore.createIndex("nome", "nome", { unique: false })
          funcionariosStore.createIndex("cargo", "cargo", { unique: false })
          funcionariosStore.createIndex("status", "status", { unique: false })
        }

        // Store para equipamentos
        if (!db.objectStoreNames.contains("equipamentos")) {
          const equipamentosStore = db.createObjectStore("equipamentos", { keyPath: "id", autoIncrement: true })
          equipamentosStore.createIndex("nome", "nome", { unique: false })
          equipamentosStore.createIndex("tipo", "tipo", { unique: false })
          equipamentosStore.createIndex("status", "status", { unique: false })
        }

        // Store para materiais
        if (!db.objectStoreNames.contains("materiais")) {
          const materiaisStore = db.createObjectStore("materiais", { keyPath: "id", autoIncrement: true })
          materiaisStore.createIndex("nome", "nome", { unique: false })
          materiaisStore.createIndex("categoria", "categoria", { unique: false })
          materiaisStore.createIndex("estoque", "estoque", { unique: false })
        }

        // Store para fornecedores
        if (!db.objectStoreNames.contains("fornecedores")) {
          const fornecedoresStore = db.createObjectStore("fornecedores", { keyPath: "id", autoIncrement: true })
          fornecedoresStore.createIndex("nome", "nome", { unique: false })
          fornecedoresStore.createIndex("cnpj", "cnpj", { unique: true })
          fornecedoresStore.createIndex("categoria", "categoria", { unique: false })
        }

        // Store para mensagens/chat
        if (!db.objectStoreNames.contains("mensagens")) {
          const mensagensStore = db.createObjectStore("mensagens", { keyPath: "id", autoIncrement: true })
          mensagensStore.createIndex("remetente", "remetente", { unique: false })
          mensagensStore.createIndex("destinatario", "destinatario", { unique: false })
          mensagensStore.createIndex("timestamp", "timestamp", { unique: false })
          mensagensStore.createIndex("lida", "lida", { unique: false })
        }

        // Store para relatórios
        if (!db.objectStoreNames.contains("relatorios")) {
          const relatoriosStore = db.createObjectStore("relatorios", { keyPath: "id", autoIncrement: true })
          relatoriosStore.createIndex("tipo", "tipo", { unique: false })
          relatoriosStore.createIndex("dataCriacao", "dataCriacao", { unique: false })
          relatoriosStore.createIndex("usuario", "usuario", { unique: false })
        }

        // Inserir dados iniciais
        this.insertInitialData(db)
      }
    })
  }

  insertInitialData(db) {
    const transaction = db.transaction(
      ["users", "funcionarios", "equipamentos", "materiais", "fornecedores"],
      "readwrite",
    )

    // Usuários padrão
    const usersStore = transaction.objectStore("users")
    const defaultUsers = [
      {
        id: 1,
        username: "admin",
        password: "admin123",
        name: "Administrador",
        email: "admin@somar.com.br",
        cargo: "admin",
        permissions: ["read", "write", "delete", "manage", "users", "reports"],
        status: "active",
        avatar: "/placeholder.svg",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        username: "master",
        password: "master2024",
        name: "Master User",
        email: "master@somar.com.br",
        cargo: "master",
        permissions: ["read", "write", "delete", "manage", "users", "reports", "system"],
        status: "active",
        avatar: "/placeholder.svg",
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        username: "gerente01",
        password: "gerente123",
        name: "João Silva",
        email: "joao.silva@somar.com.br",
        cargo: "gerente",
        permissions: ["read", "write", "manage"],
        status: "active",
        avatar: "/placeholder.svg",
        createdAt: new Date().toISOString(),
      },
    ]

    defaultUsers.forEach((user) => usersStore.add(user))

    // Funcionários padrão
    const funcionariosStore = transaction.objectStore("funcionarios")
    const defaultFuncionarios = [
      {
        id: 1,
        nome: "João Silva",
        cargo: "Encarregado",
        cpf: "123.456.789-00",
        telefone: "(21) 99999-0001",
        email: "joao.silva@somar.com.br",
        status: "Ativo",
        dataAdmissao: "2023-01-15",
        salario: 4500.0,
      },
      {
        id: 2,
        nome: "Maria Santos",
        cargo: "Pedreiro",
        cpf: "987.654.321-00",
        telefone: "(21) 99999-0002",
        email: "maria.santos@somar.com.br",
        status: "Ativo",
        dataAdmissao: "2023-02-20",
        salario: 3200.0,
      },
      {
        id: 3,
        nome: "Carlos Oliveira",
        cargo: "Eletricista",
        cpf: "456.789.123-00",
        telefone: "(21) 99999-0003",
        email: "carlos.oliveira@somar.com.br",
        status: "Ativo",
        dataAdmissao: "2023-03-10",
        salario: 3800.0,
      },
    ]

    defaultFuncionarios.forEach((funcionario) => funcionariosStore.add(funcionario))

    // Equipamentos padrão
    const equipamentosStore = transaction.objectStore("equipamentos")
    const defaultEquipamentos = [
      {
        id: 1,
        nome: "Retroescavadeira CAT 416F",
        tipo: "Máquina Pesada",
        modelo: "416F",
        numeroSerie: "CAT001234",
        status: "Disponível",
        localizacao: "Almoxarifado Central",
        dataAquisicao: "2023-01-15",
        valorAquisicao: 450000.0,
        responsavel: "João Silva",
      },
      {
        id: 2,
        nome: "Caminhão Basculante",
        tipo: "Veículo",
        modelo: "Mercedes 2831",
        numeroSerie: "MB004567",
        status: "Em Uso",
        localizacao: "Obra Centro - OS-25000001",
        dataAquisicao: "2023-03-20",
        valorAquisicao: 280000.0,
        responsavel: "Maria Santos",
      },
    ]

    defaultEquipamentos.forEach((equip) => equipamentosStore.add(equip))

    // Materiais padrão
    const materiaisStore = transaction.objectStore("materiais")
    const defaultMateriais = [
      {
        id: 1,
        nome: "Cimento Portland CP-II",
        categoria: "Cimento",
        unidade: "Saco 50kg",
        estoque: 150,
        estoqueMinimo: 50,
        valorUnitario: 28.5,
        fornecedor: "Construmega Materiais",
        localizacao: "Galpão A - Setor 1",
      },
      {
        id: 2,
        nome: "Areia Média",
        categoria: "Agregado",
        unidade: "m³",
        estoque: 80,
        estoqueMinimo: 20,
        valorUnitario: 45.0,
        fornecedor: "Areias do Litoral",
        localizacao: "Pátio Externo",
      },
    ]

    defaultMateriais.forEach((material) => materiaisStore.add(material))

    // Fornecedores padrão
    const fornecedoresStore = transaction.objectStore("fornecedores")
    const defaultFornecedores = [
      {
        id: 1,
        nome: "Construmega Materiais",
        cnpj: "12.345.678/0001-90",
        contato: "Carlos Pereira",
        telefone: "(21) 3333-4444",
        email: "vendas@construmega.com.br",
        endereco: "Av. Industrial, 1000 - Maricá/RJ",
        status: "Ativo",
        categoria: "Materiais de Construção",
      },
      {
        id: 2,
        nome: "TecnoFerramentas Ltda",
        cnpj: "98.765.432/0001-10",
        contato: "Ana Costa",
        telefone: "(21) 2222-3333",
        email: "contato@tecnoferramentas.com.br",
        endereco: "Rua das Ferramentas, 500 - Niterói/RJ",
        status: "Ativo",
        categoria: "Ferramentas e Equipamentos",
      },
    ]

    defaultFornecedores.forEach((fornecedor) => fornecedoresStore.add(fornecedor))
  }

  // Métodos CRUD genéricos
  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)

    data.createdAt = data.createdAt || new Date().toISOString()
    data.updatedAt = new Date().toISOString()

    return new Promise((resolve, reject) => {
      const request = store.add(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get(storeName, id) {
    const transaction = this.db.transaction([storeName], "readonly")
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], "readonly")
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async update(storeName, data) {
    const transaction = this.db.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)

    data.updatedAt = new Date().toISOString()

    return new Promise((resolve, reject) => {
      const request = store.put(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName, id) {
    const transaction = this.db.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Métodos específicos para autenticação
  async authenticateUser(username, password) {
    const users = await this.getAll("users")
    const user = users.find((u) => u.username === username && u.password === password && u.status === "active")

    if (user) {
      user.lastLogin = new Date().toISOString()
      await this.update("users", user)
      return user
    }

    return null
  }

  // Métodos específicos para ordens de serviço
  async createOrdem(ordemData) {
    const codigo = this.generateOSCode()
    const ordem = {
      ...ordemData,
      codigo,
      status: ordemData.status || "Rascunho",
      dataCriacao: new Date().toISOString(),
    }

    return await this.add("ordens", ordem)
  }

  async getOrdensByStatus(status) {
    const ordens = await this.getAll("ordens")
    return ordens.filter((ordem) => ordem.status === status)
  }

  async getOrdensByDistrito(distrito) {
    const ordens = await this.getAll("ordens")
    return ordens.filter((ordem) => ordem.distrito === distrito)
  }

  // Métodos específicos para mensagens
  async sendMessage(remetente, destinatario, mensagem, tipo = "direct") {
    const message = {
      remetente,
      destinatario,
      mensagem,
      tipo,
      timestamp: new Date().toISOString(),
      lida: false,
    }

    return await this.add("mensagens", message)
  }

  async getUnreadMessages(usuario) {
    const mensagens = await this.getAll("mensagens")
    return mensagens.filter((msg) => msg.destinatario === usuario && !msg.lida)
  }

  async markMessageAsRead(messageId) {
    const message = await this.get("mensagens", messageId)
    if (message) {
      message.lida = true
      await this.update("mensagens", message)
    }
  }

  // Métodos de busca
  async search(storeName, searchTerm, fields) {
    const allData = await this.getAll(storeName)
    const term = searchTerm.toLowerCase()

    return allData.filter((item) => {
      return fields.some((field) => {
        const value = item[field]
        return value && value.toString().toLowerCase().includes(term)
      })
    })
  }

  // Gerador de código de OS
  generateOSCode() {
    const currentYear = new Date().getFullYear().toString().slice(-2)
    const sequence = Math.floor(Math.random() * 999999) + 1
    return `${currentYear}${sequence.toString().padStart(6, "0")}`
  }

  // Métodos para relatórios
  async generateReport(tipo, filtros = {}) {
    const reportData = {
      tipo,
      filtros,
      dataCriacao: new Date().toISOString(),
      usuario: filtros.usuario || "system",
      dados: {},
    }

    switch (tipo) {
      case "ordens-por-status":
        const ordens = await this.getAll("ordens")
        reportData.dados = this.groupBy(ordens, "status")
        break

      case "obras-por-distrito":
        const obras = await this.getAll("obras")
        reportData.dados = this.groupBy(obras, "distrito")
        break

      case "funcionarios-por-cargo":
        const funcionarios = await this.getAll("funcionarios")
        reportData.dados = this.groupBy(funcionarios, "cargo")
        break
    }

    await this.add("relatorios", reportData)
    return reportData
  }

  groupBy(array, key) {
    return array.reduce((result, item) => {
      const group = item[key] || "Não definido"
      result[group] = result[group] || []
      result[group].push(item)
      return result
    }, {})
  }
}

// Instância global do banco
const somarDB = new SomarDatabase()

// Inicializar banco quando a página carregar
if (typeof window !== "undefined") {
  somarDB
    .init()
    .then(() => {
      console.log("✅ Banco de dados SOMAR inicializado com sucesso!")
    })
    .catch((error) => {
      console.error("❌ Erro ao inicializar banco de dados:", error)
    })
}

export default somarDB
