// Mock data for the application
const mockData = {
  // User data
  users: [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@somar.com.br",
      cargo: "encarregado",
      avatar: null,
      isTestMode: false,
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@somar.com.br",
      cargo: "gerente",
      avatar: null,
      isTestMode: false,
    },
    {
      id: 3,
      name: "Admin Teste",
      email: "admin@somar.com.br",
      cargo: "admin",
      avatar: null,
      isTestMode: true,
    },
  ],

  // Districts data
  districts: [
    {
      nome: "Centro",
      obras: 23,
      andamento: 15,
      concluidas: 8,
      latitude: -22.9068,
      longitude: -43.1729,
    },
    {
      nome: "Inoã",
      obras: 18,
      andamento: 12,
      concluidas: 6,
      latitude: -22.9408,
      longitude: -42.9306,
    },
    {
      nome: "Itaipuaçu",
      obras: 31,
      andamento: 19,
      concluidas: 12,
      latitude: -22.9403,
      longitude: -42.8444,
    },
    {
      nome: "Ponta Negra",
      obras: 15,
      andamento: 9,
      concluidas: 6,
      latitude: -22.9778,
      longitude: -42.7447,
    },
    {
      nome: "São José do Imbassaí",
      obras: 22,
      andamento: 14,
      concluidas: 8,
      latitude: -22.8667,
      longitude: -42.8333,
    },
    {
      nome: "Guaratiba",
      obras: 19,
      andamento: 11,
      concluidas: 8,
      latitude: -22.9458,
      longitude: -42.7942,
    },
    {
      nome: "Cordeirinho",
      obras: 28,
      andamento: 9,
      concluidas: 5,
      latitude: -22.9575,
      longitude: -42.7619,
    },
  ],

  // Works data
  works: [
    {
      id: "OS-2024-001",
      titulo: "Pavimentação Rua das Flores",
      descricao: "Pavimentação asfáltica da Rua das Flores, incluindo drenagem e sinalização viária.",
      distrito: "Centro",
      endereco: "Rua das Flores, 100 - Centro, Maricá/RJ",
      status: "Em Andamento",
      progresso: 75,
      encarregado: "João Silva",
      dataInicio: "2024-01-15",
      previsaoTermino: "2024-03-20",
      orcamento: 850000,
      gastoAtual: 637500,
      prioridade: "Alta",
    },
    {
      id: "OS-2024-002",
      titulo: "Construção Praça da Juventude",
      descricao: "Construção de praça com equipamentos de lazer e área verde.",
      distrito: "Inoã",
      endereco: "Av. Central, 500 - Inoã, Maricá/RJ",
      status: "Em Andamento",
      progresso: 45,
      encarregado: "Maria Santos",
      dataInicio: "2024-02-01",
      previsaoTermino: "2024-05-15",
      orcamento: 1200000,
      gastoAtual: 540000,
      prioridade: "Média",
    },
    {
      id: "OS-2024-003",
      titulo: "Reforma Escola Municipal",
      descricao: "Reforma completa da Escola Municipal com ampliação de salas.",
      distrito: "Itaipuaçu",
      endereco: "Rua da Escola, 25 - Itaipuaçu, Maricá/RJ",
      status: "Atrasada",
      progresso: 30,
      encarregado: "Carlos Oliveira",
      dataInicio: "2024-01-10",
      previsaoTermino: "2024-02-28",
      orcamento: 650000,
      gastoAtual: 195000,
      prioridade: "Alta",
    },
    {
      id: "OS-2024-004",
      titulo: "Instalação Iluminação LED",
      descricao: "Substituição da iluminação pública por LED em toda a avenida.",
      distrito: "Ponta Negra",
      endereco: "Av. Beira Mar - Ponta Negra, Maricá/RJ",
      status: "Concluída",
      progresso: 100,
      encarregado: "Ana Costa",
      dataInicio: "2024-01-05",
      previsaoTermino: "2024-02-15",
      orcamento: 320000,
      gastoAtual: 315000,
      prioridade: "Baixa",
    },
  ],

  // Materials data
  materials: [
    {
      id: 1,
      nome: "Asfalto CBUQ",
      categoria: "Pavimentação",
      unidade: "ton",
      estoque: 150,
      estoqueMinimo: 50,
      valorUnitario: 450,
      fornecedor: "Asfaltos Maricá Ltda",
      status: "Disponível",
    },
    {
      id: 2,
      nome: "Brita Graduada",
      categoria: "Agregados",
      unidade: "m³",
      estoque: 200,
      estoqueMinimo: 100,
      valorUnitario: 85,
      fornecedor: "Pedreira Central",
      status: "Disponível",
    },
    {
      id: 3,
      nome: "Cimento Portland",
      categoria: "Cimentícios",
      unidade: "saca",
      estoque: 25,
      estoqueMinimo: 50,
      valorUnitario: 32,
      fornecedor: "Cimentos do Brasil",
      status: "Estoque Baixo",
    },
    {
      id: 4,
      nome: "Tinta para Sinalização",
      categoria: "Tintas",
      unidade: "lata",
      estoque: 80,
      estoqueMinimo: 30,
      valorUnitario: 125,
      fornecedor: "Tintas Especiais RJ",
      status: "Disponível",
    },
    {
      id: 5,
      nome: "Ferro 12mm",
      categoria: "Estrutural",
      unidade: "barra",
      estoque: 5,
      estoqueMinimo: 20,
      valorUnitario: 45,
      fornecedor: "Aços Maricá",
      status: "Crítico",
    },
  ],

  // Material requests
  materialRequests: [
    {
      id: "RM-2024-001",
      obra: "OS-2024-001",
      solicitante: "João Silva",
      datasolicitacao: "2024-01-20",
      status: "Pendente",
      prioridade: "Alta",
      itens: [
        { material: "Asfalto CBUQ", quantidade: 10, unidade: "ton", justificativa: "Pavimentação setor 2" },
        { material: "Brita Graduada", quantidade: 15, unidade: "m³", justificativa: "Base da pavimentação" },
      ],
      observacoes: "Material necessário para continuidade da obra",
      valorTotal: 5775,
    },
    {
      id: "RM-2024-002",
      obra: "OS-2024-002",
      solicitante: "Maria Santos",
      datasolicitacao: "2024-01-19",
      status: "Aprovada",
      prioridade: "Média",
      itens: [{ material: "Cimento Portland", quantidade: 20, unidade: "saca", justificativa: "Fundação da praça" }],
      observacoes: "Urgente para não atrasar cronograma",
      valorTotal: 640,
      dataAprovacao: "2024-01-20",
      aprovadoPor: "Carlos Admin",
    },
  ],

  // Employees data
  employees: [
    {
      id: 1,
      nome: "João Silva",
      funcao: "Encarregado",
      cpf: "123.456.789-00",
      telefone: "(21) 99999-1111",
      email: "joao.silva@somar.com.br",
      dataAdmissao: "2023-01-15",
      status: "Ativo",
      obraAtual: "OS-2024-001",
      salario: 4500,
    },
    {
      id: 2,
      nome: "Maria Santos",
      funcao: "Operadora de Máquinas",
      cpf: "987.654.321-00",
      telefone: "(21) 99999-2222",
      email: "maria.santos@somar.com.br",
      dataAdmissao: "2023-03-20",
      status: "Ativo",
      obraAtual: "OS-2024-002",
      salario: 3800,
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      funcao: "Pedreiro",
      cpf: "456.789.123-00",
      telefone: "(21) 99999-3333",
      email: "carlos.oliveira@somar.com.br",
      dataAdmissao: "2023-02-10",
      status: "Ativo",
      obraAtual: "OS-2024-003",
      salario: 3200,
    },
  ],

  // Machinery data
  machinery: [
    {
      id: 1,
      nome: "Escavadeira CAT 320",
      tipo: "Escavadeira",
      modelo: "320D",
      ano: 2020,
      placa: "ABC-1234",
      status: "Em Uso",
      obraAtual: "OS-2024-001",
      operador: "Carlos Silva",
      horasTrabalho: 1250,
      proximaManutencao: "2024-02-15",
    },
    {
      id: 2,
      nome: "Rolo Compactador Dynapac",
      tipo: "Compactador",
      modelo: "CA250D",
      ano: 2019,
      placa: "DEF-5678",
      status: "Disponível",
      obraAtual: null,
      operador: null,
      horasTrabalho: 890,
      proximaManutencao: "2024-01-30",
    },
  ],
}

// Local storage keys
const STORAGE_KEYS = {
  USER: "somar_user",
  WORKS: "somar_works",
  MATERIALS: "somar_materials",
  REQUESTS: "somar_requests",
  EMPLOYEES: "somar_employees",
  MACHINERY: "somar_machinery",
}

// Initialize data in localStorage if not exists
function initializeData() {
  if (!localStorage.getItem(STORAGE_KEYS.WORKS)) {
    localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(mockData.works))
  }
  if (!localStorage.getItem(STORAGE_KEYS.MATERIALS)) {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(mockData.materials))
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(mockData.materialRequests))
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(mockData.employees))
  }
  if (!localStorage.getItem(STORAGE_KEYS.MACHINERY)) {
    localStorage.setItem(STORAGE_KEYS.MACHINERY, JSON.stringify(mockData.machinery))
  }
}

// Data access functions
function getWorks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKS) || "[]")
}

function saveWorks(works) {
  localStorage.setItem(STORAGE_KEYS.WORKS, JSON.stringify(works))
}

function getMaterials() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATERIALS) || "[]")
}

function saveMaterials(materials) {
  localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials))
}

function getRequests() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || "[]")
}

function saveRequests(requests) {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests))
}

function getEmployees() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES) || "[]")
}

function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees))
}

function getMachinery() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.MACHINERY) || "[]")
}

function saveMachinery(machinery) {
  localStorage.setItem(STORAGE_KEYS.MACHINERY, JSON.stringify(machinery))
}

// Initialize data on load
initializeData()
