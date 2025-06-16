// Database simulation and management

// Database configuration
const DB_CONFIG = {
  name: "SomarDB",
  version: 1,
  stores: {
    users: "id, username, email, role, permissions, status, lastLogin, createdAt",
    obras: "id, titulo, distrito, status, encarregado, dataInicio, orcamento",
    ordens: "id, numero, titulo, obra, solicitante, status, prioridade, dataAbertura",
    materials: "id, nome, categoria, estoque, estoqueMinimo, fornecedor",
    equipamentos: "id, nome, tipo, modelo, status, localizacao",
    fornecedores: "id, nome, cnpj, contato, telefone, email, endereco, status, categoria",
    messages: "id, from, to, message, timestamp, read, type",
    logs: "id, user, action, details, timestamp",
  },
}

// IndexedDB wrapper
class SomarDB {
  constructor() {
    this.db = null
    this.isReady = false
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        this.isReady = true
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        // Create object stores
        Object.entries(DB_CONFIG.stores).forEach(([storeName, keyPath]) => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true })

            // Create indexes based on keyPath
            const indexes = keyPath.split(", ").slice(1) // Skip 'id'
            indexes.forEach((index) => {
              if (index.trim()) {
                store.createIndex(index.trim(), index.trim(), { unique: false })
              }
            })
          }
        })

        // Initialize with default data
        this.initializeDefaultData(db)
      }
    })
  }

  async initializeDefaultData(db) {
    const transaction = db.transaction(Object.keys(DB_CONFIG.stores), "readwrite")

    // Default users
    const usersStore = transaction.objectStore("users")
    const defaultUsers = [
      {
        id: 1,
        username: "admin",
        password: "admin123",
        name: "Administrador",
        email: "admin@somar.com.br",
        role: "admin",
        permissions: ["read", "write", "delete", "manage", "users", "reports"],
        status: "active",
        lastLogin: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        username: "master",
        password: "master2024",
        name: "Master User",
        email: "master@somar.com.br",
        role: "master",
        permissions: ["read", "write", "delete", "manage", "users", "reports", "system"],
        status: "active",
        lastLogin: null,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        username: "gerente01",
        password: "gerente123",
        name: "João Silva",
        email: "joao.silva@somar.com.br",
        role: "gerente",
        permissions: ["read", "write", "manage"],
        status: "active",
        lastLogin: null,
        createdAt: new Date().toISOString(),
      },
    ]

    defaultUsers.forEach((user) => usersStore.add(user))

    // Default equipment
    const equipamentosStore = transaction.objectStore("equipamentos")
    const defaultEquipamentos = [
      {
        id: 1,
        nome: "Furadeira Bosch",
        tipo: "Ferramenta Elétrica",
        modelo: "GSB 13 RE",
        numeroSerie: "BSH001234",
        status: "Disponível",
        localizacao: "Almoxarifado Central",
        dataAquisicao: "2023-01-15",
        valorAquisicao: 450.0,
        responsavel: "João Silva",
      },
      {
        id: 2,
        nome: "Betoneira 400L",
        tipo: "Equipamento Pesado",
        modelo: "BT-400",
        numeroSerie: "BET004567",
        status: "Em Uso",
        localizacao: "Obra Centro - OS-2024-001",
        dataAquisicao: "2023-03-20",
        valorAquisicao: 2800.0,
        responsavel: "Maria Santos",
      },
    ]

    defaultEquipamentos.forEach((equip) => equipamentosStore.add(equip))

    // Default suppliers
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

    defaultFornecedores.forEach((forn) => fornecedoresStore.add(forn))
  }

  async add(storeName, data) {
    if (!this.isReady) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)

      // Add timestamp if not exists
      if (!data.createdAt) {
        data.createdAt = new Date().toISOString()
      }

      const request = store.add(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get(storeName, id) {
    if (!this.isReady) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll(storeName) {
    if (!this.isReady) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async update(storeName, data) {
    if (!this.isReady) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)

      // Add update timestamp
      data.updatedAt = new Date().toISOString()

      const request = store.put(data)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName, id) {
    if (!this.isReady) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async query(storeName, indexName, value) {
    if (!this.isReady) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

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

  // Log user actions
  async logAction(user, action, details) {
    await this.add("logs", {
      user: user,
      action: action,
      details: details,
      timestamp: new Date().toISOString(),
    })
  }
}

// Initialize database instance
const somarDB = new SomarDB()

// Initialize database on page load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await somarDB.init()
    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization failed:", error)
    // showToast('Erro', 'Falha ao inicializar banco de dados', 'error');
  }
})

// Database helper functions
async function authenticateUser(username, password) {
  try {
    const users = await somarDB.getAll("users")
    const user = users.find((u) => u.username === username && u.password === password && u.status === "active")

    if (user) {
      // Update last login
      user.lastLogin = new Date().toISOString()
      await somarDB.update("users", user)

      // Log login action
      // await somarDB.logAction(getCurrentUser()?.username || 'system', 'login', 'User logged in');

      return user
    }

    return null
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

async function createUser(userData) {
  try {
    // Check if username already exists
    const existingUsers = await somarDB.query("users", "username", userData.username)
    if (existingUsers.length > 0) {
      throw new Error("Nome de usuário já existe")
    }

    // Check if email already exists
    const existingEmails = await somarDB.query("users", "email", userData.email)
    if (existingEmails.length > 0) {
      throw new Error("E-mail já está em uso")
    }

    const userId = await somarDB.add("users", userData)

    // Log user creation
    // await somarDB.logAction(getCurrentUser()?.username || 'system', 'create_user', `Created user: ${userData.username}`);

    return userId
  } catch (error) {
    console.error("Create user error:", error)
    throw error
  }
}

async function updateUserPermissions(userId, permissions) {
  try {
    const user = await somarDB.get("users", userId)
    if (!user) {
      throw new Error("Usuário não encontrado")
    }

    user.permissions = permissions
    await somarDB.update("users", user)

    // Log permission update
    // await somarDB.logAction(getCurrentUser()?.username || 'system', 'update_permissions', `Updated permissions for user: ${user.username}`);

    return true
  } catch (error) {
    console.error("Update permissions error:", error)
    throw error
  }
}

async function sendMessage(fromUser, toUser, message, type = "direct") {
  try {
    const messageData = {
      from: fromUser,
      to: toUser,
      message: message,
      type: type,
      timestamp: new Date().toISOString(),
      read: false,
    }

    const messageId = await somarDB.add("messages", messageData)

    // Update chat UI if recipient is current user
    // if (toUser === getCurrentUser()?.username) {
    //   updateChatUI();
    // }

    return messageId
  } catch (error) {
    console.error("Send message error:", error)
    throw error
  }
}

async function getUnreadMessages(username) {
  try {
    const messages = await somarDB.query("messages", "to", username)
    return messages.filter((msg) => !msg.read)
  } catch (error) {
    console.error("Get unread messages error:", error)
    return []
  }
}

async function markMessageAsRead(messageId) {
  try {
    const message = await somarDB.get("messages", messageId)
    if (message) {
      message.read = true
      await somarDB.update("messages", message)
    }
  } catch (error) {
    console.error("Mark message as read error:", error)
  }
}

// Export database instance for global use
window.somarDB = somarDB

// Declare missing functions
function showToast(title, message, type) {
  console.log(`Toast: ${title} - ${message} (${type})`)
}

function getCurrentUser() {
  return { username: "admin" } // Placeholder for current user logic
}

function updateChatUI() {
  console.log("Chat UI updated")
}
